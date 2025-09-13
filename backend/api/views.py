# backend/api/views.py
from decimal import Decimal
import csv

from django.db import IntegrityError
from django.db.models import F, Q, Count
from django.http import HttpResponse
from django.utils.dateparse import parse_date
from django.utils.encoding import smart_str
from django_filters.rest_framework import DjangoFilterBackend

from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets, mixins, filters
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    SAFE_METHODS,
    BasePermission,
)
from rest_framework.response import Response

from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag, Recipe,
    Collection, CollectionItem, Review,
    MealEntry, ShoppingList, ShoppingItem, Unit,
)
from .serializers import (
    UnitSerializer, IngredientSerializer, CuisineSerializer, DietSerializer, TagSerializer,
    RecipeListSerializer, RecipeDetailSerializer,
    CollectionSerializer, ReviewSerializer,
    MealEntrySerializer, ShoppingListSerializer, ShoppingItemSerializer,
    # эти два должны быть у тебя в serializers.py (мы их добавляли):
    GenerateFromPlanSerializer, ShoppingItemCreateUpdateSerializer,
)


# ----------------------------- permissions ------------------------------------
class IsAuthorOrReadOnly(BasePermission):
    """Править/удалять объект может только его автор; читать могут все."""
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "author_id", None) == getattr(request.user, "id", None)


# ----------------------------- misc endpoints ---------------------------------
@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response({
        "id": u.id,
        "username": u.get_username(),
        "email": u.email,
    })


# ----------------------------- dictionaries -----------------------------------
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


# ----------------------------- recipes ----------------------------------------
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

    # include/exclude по ингредиентам
    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)

        include_param = self.request.query_params.get("include")
        if include_param:
            try:
                include_ids = [int(x) for x in include_param.split(",") if x.strip()]
            except ValueError:
                include_ids = []
            if include_ids:
                qs = qs.annotate(
                    _incl_cnt=Count(
                        "ingredients__ingredient_id",
                        filter=Q(ingredients__ingredient_id__in=include_ids),
                        distinct=True,
                    )
                ).filter(_incl_cnt=len(include_ids))

        exclude_param = self.request.query_params.get("exclude")
        if exclude_param:
            try:
                exclude_ids = [int(x) for x in exclude_param.split(",") if x.strip()]
            except ValueError:
                exclude_ids = []
            if exclude_ids:
                qs = qs.exclude(ingredients__ingredient_id__in=exclude_ids)

        return qs

    @action(detail=False, methods=["get"])
    def trending(self, request):
        """
        GET /api/recipes/trending/?limit=10
        Топ по: rating_avg, saves_count, свежести
        """
        try:
            limit = int(request.query_params.get("limit", 10))
        except ValueError:
            limit = 10
        qs = (
            self.get_queryset()
            .order_by("-rating_avg", "-saves_count", "-created_at", "-id")[:limit]
        )
        ser = RecipeListSerializer(qs, many=True, context={"request": request})
        return Response(ser.data)

    @action(detail=True, methods=["get"], url_path="reviews")
    def recipe_reviews(self, request, pk=None):
        """GET /api/recipes/{id}/reviews/"""
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

@action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
def rate(self, request, pk=None):
    """
    POST /api/recipes/{id}/rate/
    body: {"rating": <1..5>, "text": "<опционально>"}

    Создаёт или обновляет отзыв current user для этого рецепта.
    """
    ser = RateRecipeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)

    review, created = Review.objects.update_or_create(
        author=request.user,
        recipe_id=pk,
        defaults={
            "rating": ser.validated_data["rating"],
            "text": ser.validated_data.get("text", ""),
        },
    )
    return Response(
        ReviewSerializer(review).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@action(detail=False, methods=["get"])
def trending(self, request):
    """
    GET /api/recipes/trending/
    Топ рецептов по сохранениям и рейтингу.
    """
    qs = (
        self.get_queryset()
        .order_by("-saves_count", "-rating_avg", "-created_at")[:20]
    )
    return Response(RecipeListSerializer(qs, many=True).data)

# ----------------------------- reviews (optional global) ----------------------
class ReviewViewSet(viewsets.ModelViewSet):
    """
    Глобальный список/CRUD отзывов.
    Фильтр по рецепту: GET /api/reviews/?recipe=<id>
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    # Фильтры/поиск/сортировки
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "recipe_id": ["exact"],
        "author_id": ["exact"],
        "rating": ["exact", "gte", "lte"],
    }
    search_fields = ["text", "author__username", "recipe__title"]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_queryset(self):
        # Базовый queryset
        qs = (Review.objects
              .select_related("author", "recipe")
              .order_by("-created_at"))

        # Доп. фильтр через query param ?recipe=...
        recipe_id = self.request.query_params.get("recipe")
        if recipe_id:
            qs = qs.filter(recipe_id=recipe_id)
        return qs

    def perform_create(self, serializer):
        # Привязываем автора к текущему пользователю
        serializer.save(author=self.request.user)

    # Ловим дубли (уникальное ограничение author+recipe в БД)
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Вы уже оставляли отзыв для этого рецепта."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # На всякий случай ловим конфликт и на апдейте (если кто-то попытается сменить recipe)
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Отзыв для этого рецепта от вас уже существует."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def partial_update(self, request, *args, **kwargs):
        try:
            return super().partial_update(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Отзыв для этого рецепта от вас уже существует."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ----------------------------- collections ------------------------------------
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


# ----------------------------- meal plan --------------------------------------
class MealEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MealEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {
        "date": ["exact", "gte", "lte"],
        "meal_type": ["exact"],  # если поле есть
        "recipe_id": ["exact"],
    }
    ordering = ["-date", "-id"]

    def get_queryset(self):
        return (
            MealEntry.objects
            .filter(owner=self.request.user)
            .select_related("recipe")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ----------------------------- shopping lists ---------------------------------
class ShoppingListViewSet(viewsets.ModelViewSet):
    """
    Списки покупок + генерация из плана.
    """
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ["-created_at", "id"]

    def get_queryset(self):
        return (
            ShoppingList.objects
            .filter(owner=self.request.user)
            .prefetch_related("items__ingredient", "items__unit")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @extend_schema(
        request=GenerateFromPlanSerializer,
        responses=ShoppingListSerializer,
        description="Сформировать список покупок по записям планировщика за период."
    )
    @action(detail=False, methods=["post"], url_path="generate_from_plan")
    def generate_from_plan(self, request):
        """
        POST /api/shopping-lists/generate_from_plan/
        body: {
          "date_from":"YYYY-MM-DD",
          "date_to":"YYYY-MM-DD",
          "title":"optional",
          "exclude":[ingredient_id...],         # опционально
          "meal_types":["breakfast","dinner"]   # опционально
        }
        """
        df = request.data.get("date_from")
        dt = request.data.get("date_to")
        if not df or not dt:
            return Response({"detail": "date_from and date_to are required (YYYY-MM-DD)"}, status=400)

        date_from = parse_date(df)
        date_to = parse_date(dt)
        if not date_from or not date_to or date_from > date_to:
            return Response({"detail": "invalid date range"}, status=400)

        title = request.data.get("title") or f"Groceries {date_from}…{date_to}"

        # исключения
        exclude_raw = request.data.get("exclude") or request.data.get("exclude_ingredient_ids")
        exclude_ids: set[int] = set()
        if isinstance(exclude_raw, list):
            exclude_ids = {int(x) for x in exclude_raw if str(x).isdigit()}
        elif isinstance(exclude_raw, str):
            exclude_ids = {int(x) for x in exclude_raw.split(",") if x.strip().isdigit()}

        # фильтр по типам приёмов
        meal_types_raw = request.data.get("meal_types")
        meal_types: set[str] = set()
        if isinstance(meal_types_raw, list):
            meal_types = {str(x) for x in meal_types_raw if str(x)}
        elif isinstance(meal_types_raw, str):
            meal_types = {x.strip() for x in meal_types_raw.split(",") if x.strip()}

        entries_qs = MealEntry.objects.filter(
            owner=request.user, date__gte=date_from, date__lte=date_to
        ).select_related("recipe").prefetch_related(
            "recipe__ingredients__ingredient", "recipe__ingredients__unit"
        )
        if meal_types:
            entries_qs = entries_qs.filter(meal_type__in=meal_types)

        if not entries_qs.exists():
            return Response({"detail": "No meal entries in the selected range."}, status=400)

        # Нормализация единиц (kg→g, l→ml)
        unit_map = {u.key: u.id for u in Unit.objects.filter(key__in=["g", "kg", "ml", "l"])}
        base_mass_id = unit_map.get("g")
        base_vol_id = unit_map.get("ml")

        def normalize(qty: Decimal, unit_key: str | None, unit_id: int | None) -> tuple[Decimal, int | None]:
            if unit_key == "kg" and base_mass_id:
                return (qty * Decimal("1000"), base_mass_id)
            if unit_key == "g" and base_mass_id:
                return (qty, base_mass_id)
            if unit_key == "l" and base_vol_id:
                return (qty * Decimal("1000"), base_vol_id)
            if unit_key == "ml" and base_vol_id:
                return (qty, base_vol_id)
            return (qty, unit_id)

        # агрегатор по (ingredient, normalized_unit)
        agg: dict[tuple[int, int | None], Decimal] = {}

        for e in entries_qs:
            r = e.recipe
            base_serv = r.servings or 1
            target_serv = e.servings or base_serv
            factor = Decimal(target_serv) / Decimal(base_serv)

            for ri in r.ingredients.all():
                if ri.ingredient_id in exclude_ids:
                    continue
                raw_qty = (Decimal(ri.qty) * factor)
                unit_key = getattr(ri.unit, "key", None) if ri.unit_id else None
                norm_qty, norm_unit_id = normalize(raw_qty, unit_key, ri.unit_id)
                norm_qty = norm_qty.quantize(Decimal("0.01"))

                key = (ri.ingredient_id, norm_unit_id)
                agg[key] = (agg.get(key, Decimal("0")) + norm_qty).quantize(Decimal("0.01"))

        if not agg:
            return Response({"detail": "Nothing to add after filters."}, status=400)

        sl = ShoppingList.objects.create(owner=request.user, title=title)
        items = [
            ShoppingItem(
                shopping_list=sl,
                ingredient_id=ing_id,
                qty=qty,
                unit_id=unit_id,
            )
            for (ing_id, unit_id), qty in agg.items()
            if qty > 0
        ]
        ShoppingItem.objects.bulk_create(items)

        data = ShoppingListSerializer(sl, context={"request": request}).data
        return Response(data, status=status.HTTP_201_CREATED)

    # CRUD позиций списка
    @action(detail=True, methods=["post"], url_path="items")
    def add_item(self, request, pk=None):
        """
        POST /api/shopping-lists/{list_id}/items/
        { "ingredient_id": 3, "qty": "2.00", "unit_id": 1, "note": "по скидке", "category": "овощи" }
        """
        sl = self.get_object()
        ser = ShoppingItemCreateUpdateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        obj = ser.save(shopping_list=sl)
        return Response(ShoppingItemSerializer(obj).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path=r"items/(?P<item_id>\d+)")
    def update_item(self, request, pk=None, item_id=None):
        """
        PATCH /api/shopping-lists/{list_id}/items/{item_id}/
        """
        sl = self.get_object()
        try:
            it = sl.items.get(id=item_id)
        except ShoppingItem.DoesNotExist:
            return Response({"detail": "item not found"}, status=404)
        ser = ShoppingItemCreateUpdateSerializer(it, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        it = ser.save()
        return Response(ShoppingItemSerializer(it).data)

    @action(detail=True, methods=["delete"], url_path=r"items/(?P<item_id>\d+)")
    def delete_item(self, request, pk=None, item_id=None):
        """DELETE /api/shopping-lists/{list_id}/items/{item_id}/"""
        sl = self.get_object()
        deleted, _ = sl.items.filter(id=item_id).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "item not found"}, status=404)

    @action(detail=True, methods=["post"], url_path=r"items/(?P<item_id>\d+)/check")
    def check_item(self, request, pk=None, item_id=None):
        """POST /api/shopping-lists/{list_id}/items/{item_id}/check/"""
        sl = self.get_object()
        try:
            it = sl.items.get(id=item_id)
        except ShoppingItem.DoesNotExist:
            return Response({"detail": "item not found"}, status=404)
        it.is_checked = True
        it.save(update_fields=["is_checked"])
        return Response(ShoppingItemSerializer(it).data)

    @action(detail=True, methods=["post"], url_path=r"items/(?P<item_id>\d+)/uncheck")
    def uncheck_item(self, request, pk=None, item_id=None):
        """POST /api/shopping-lists/{list_id}/items/{item_id}/uncheck/"""
        sl = self.get_object()
        try:
            it = sl.items.get(id=item_id)
        except ShoppingItem.DoesNotExist:
            return Response({"detail": "item not found"}, status=404)
        it.is_checked = False
        it.save(update_fields=["is_checked"])
        return Response(ShoppingItemSerializer(it).data)

    @action(detail=True, methods=["get"], url_path="export/csv")
    def export_csv(self, request, pk=None):
        """
        GET /api/shopping-lists/{id}/export/csv
        Скачивание CSV со столбцами: Ingredient, Qty, Unit, Note, Category, Checked
        """
        sl = self.get_object()
        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="shopping_list_{sl.id}.csv"'

        writer = csv.writer(response)
        writer.writerow(["Ingredient", "Qty", "Unit", "Note", "Category", "Checked"])
        for it in sl.items.select_related("ingredient", "unit").all():
            writer.writerow([
                smart_str(it.ingredient.name),
                smart_str(it.qty),
                smart_str(getattr(it.unit, "key", "")),
                smart_str(it.note or ""),
                smart_str(it.category or ""),
                "yes" if it.is_checked else "no",
            ])
        return response
