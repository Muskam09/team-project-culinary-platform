# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag,
    Recipe, RecipeStep, RecipeIngredient,
    Collection, CollectionItem,
)
from .models import Review
# ── Dictionaries ──────────────────────────────────────────────────────────────

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "key", "name"]


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "name", "alt_names"]


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ["id", "name"]


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ["id", "slug", "title"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "slug", "title"]


# ── Recipe ────────────────────────────────────────────────────────────────────

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    unit = UnitSerializer(read_only=True, required=False, allow_null=True)

    class Meta:
        model = RecipeIngredient
        fields = ["ingredient", "qty", "unit", "note"]


class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ["order", "text", "image"]


class RecipeListSerializer(serializers.ModelSerializer):
    cuisine = CuisineSerializer(read_only=True)
    rating = serializers.FloatField(source="rating_avg", read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "preview_image", "cook_time_min", "difficulty",
            "servings", "cuisine", "rating", "saves_count",
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    cuisine = CuisineSerializer(read_only=True)
    diets = DietSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    rating = serializers.FloatField(source="rating_avg", read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "preview_image", "cook_time_min", "difficulty",
            "servings", "cuisine", "diets", "tags",
            "ingredients", "steps", "rating", "saves_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


# ── Collections (Favorites) ───────────────────────────────────────────────────

class CollectionItemSerializer(serializers.ModelSerializer):
    # короткая карточка рецепта
    recipe = RecipeListSerializer(read_only=True)

    class Meta:
        model = CollectionItem
        fields = ["id", "recipe", "added_at"]
        read_only_fields = ["id", "added_at", "recipe"]


class CollectionSerializer(serializers.ModelSerializer):
    items = CollectionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ["id", "title", "is_public", "items"]
        read_only_fields = ["id", "items"]

    def validate_title(self, value: str) -> str:
        """Запретить дубликаты названий коллекций у одного владельца
        (красивее, чем ловить DB-ошибку UniqueConstraint)."""
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            qs = Collection.objects.filter(owner=request.user, title=value)
            # при обновлении — исключаем текущую запись
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError("You already have a collection with this title.")
        return value

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "recipe", "author", "rating", "text", "created_at", "updated_at"]
        read_only_fields = ["id", "author", "created_at", "updated_at"]

    def get_author(self, obj):
        return {"id": obj.author_id, "username": obj.author.get_username()}

    def validate_rating(self, value: int):
        if not (1 <= int(value) <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        # если пришли через обычный ViewSet — автор из request
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data.setdefault("author", request.user)
        return super().create(validated_data)
