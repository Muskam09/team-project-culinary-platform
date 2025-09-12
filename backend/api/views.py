# backend/api/views.py
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets, mixins, filters
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, SAFE_METHODS, BasePermission

from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag, Recipe,
    Collection, CollectionItem, Review,
)
from .serializers import (
    UnitSerializer, IngredientSerializer, CuisineSerializer, DietSerializer, TagSerializer,
    RecipeListSerializer, RecipeDetailSerializer,
    CollectionSerializer, ReviewSerializer,
)


class IsAuthorOrReadOnly(BasePermission):
    """Править/удалять объект может только его автор; читать могут все."""
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "author_id", None) == getattr(request.user, "id", None)


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


class UnitViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Unit.objects.all().order_by("key")
    serializer_class = UnitSerializer
    permission_classes = []


class IngredientViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Ingredient.objects.all().order_by("name")
    serializer_class = IngredientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "alt_names"]
    permission_classes = []


class CuisineViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Cuisine.objects.all().order_by("name")
    serializer_class = CuisineSerializer
    permission_classes = []


class DietViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Diet.objects.all().order_by("title")
    serializer_class = DietSerializer
    permission_classes = []


class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Tag.objects.all().order_by("title")
    serializer_class = TagSerializer
    permission_classes = []


class RecipeViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = (
        Recipe.objects.filter(is_published=True)
        .select_related("cuisine")
        .prefetch_related("diets", "tags")
    )
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "cuisine__name": ["exact"],
        "diets__slug": ["exact"],
        "tags__slug": ["exact"],
        "cook_time_min": ["lte", "gte"],
        "difficulty": ["exact", "lte", "gte"],
    }
    search_fields = ["title", "tags__title"]
    ordering_fields = ["rating_avg", "saves_count", "cook_time_min", "created_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        return RecipeDetailSerializer if self.action == "retrieve" else RecipeListSerializer

    # --- Добавлено: тренды / отзывы / оценка ---

    @action(detail=False, methods=["get"])
    def trending(self, request):
        """
        GET /api/recipes/trending/?limit=10
        Топ по: rating_avg, rating_count, saves_count
        """
        try:
            limit = int(request.query_params.get("limit", 10))
        except ValueError:
            limit = 10
        qs = (
            self.get_queryset()
            .order_by("-rating_avg", "-rating_count", "-saves_count", "-id")[:limit]
        )
        ser = RecipeListSerializer(qs, many=True, context={"request": request})
        return Response(ser.data)

    @action(detail=True, methods=["get"], url_path="reviews")
    def recipe_reviews(self, request, pk=None):
        """
        GET /api/recipes/{id}/reviews/
        """
        qs = Review.objects.filter(recipe_id=pk).select_related("author").order_by("-created_at")
        page = self.paginate_queryset(qs)
        ser = ReviewSerializer(page or qs, many=True, context={"request": request})
        if page is not None:
            return self.get_paginated_response(ser.data)
        return Response(ser.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated], url_path="rate")
    def rate(self, request, pk=None):
        """
        POST /api/recipes/{id}/rate/
        Body: {"rating": 1..5, "text": "optional"}
        Создаёт/обновляет отзыв текущего пользователя для рецепта.
        """
        rating = request.data.get("rating")
        text = request.data.get("text", "")
        if rating is None:
            return Response({"detail": "rating is required (1..5)"}, status=400)
        try:
            rating = int(rating)
        except (TypeError, ValueError):
            return Response({"detail": "rating must be integer 1..5"}, status=400)
        if not (1 <= rating <= 5):
            return Response({"detail": "rating must be between 1 and 5"}, status=400)

        obj, created = Review.objects.get_or_create(
            recipe_id=pk, author=request.user, defaults={"rating": rating, "text": text}
        )
        if not created:
            obj.rating = rating
            if text is not None:
                obj.text = text
            obj.save(update_fields=["rating", "text", "updated_at"])

        ser = ReviewSerializer(obj, context={"request": request})
        return Response(ser.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Collection.objects
            .filter(owner=self.request.user)
            .prefetch_related("items__recipe", "items__recipe__cuisine")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def add_recipe(self, request, pk=None):
        """POST /api/collections/{id}/add_recipe/  body: {"recipe_id": 1}"""
        recipe_id = request.data.get("recipe_id")
        if not recipe_id:
            return Response({"detail": "recipe_id is required"}, status=400)
        collection = self.get_object()
        obj, created = CollectionItem.objects.get_or_create(
            collection=collection, recipe_id=recipe_id
        )
        if not created:
            return Response({"detail": "already in collection"}, status=200)
        Recipe.objects.filter(id=recipe_id).update(saves_count=F("saves_count") + 1)
        return Response({"detail": "added"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path=r"items/(?P<recipe_id>\d+)")
    def remove_recipe(self, request, pk=None, recipe_id=None):
        """DELETE /api/collections/{id}/items/{recipe_id}/"""
        collection = self.get_object()
        deleted, _ = CollectionItem.objects.filter(
            collection=collection, recipe_id=recipe_id
        ).delete()
        if deleted:
            Recipe.objects.filter(id=recipe_id).update(saves_count=F("saves_count") - 1)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "not found"}, status=404)


# --- Добавлено: CRUD отзывов (общий роут /api/reviews/) ---

class ReviewViewSet(viewsets.ModelViewSet):
    """
    CRUD отзывов. Фильтрация по рецепту: ?recipe=<id>
    Создавать/редактировать — только авторизованные; править может только автор.
    """
    queryset = Review.objects.select_related("recipe", "author")
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["recipe"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response({
        "id": u.id,
        "username": u.get_username(),
        "email": u.email,
    })
