# backend/api/serializers.py
from rest_framework.validators import UniqueTogetherValidator
from rest_framework import serializers

from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag,
    Recipe, RecipeStep, RecipeIngredient,
    Collection, CollectionItem,
    Review,
    MealEntry, ShoppingList, ShoppingItem,
)

# ---- справочники -------------------------------------------------------------
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


# ---- рецепты -----------------------------------------------------------------
class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    unit = UnitSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ["ingredient", "qty", "unit", "note"]


class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ["order", "text", "image"]


class RecipeListSerializer(serializers.ModelSerializer):
    cuisine = CuisineSerializer()
    rating = serializers.FloatField(source="rating_avg", read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "preview_image", "cook_time_min", "difficulty",
            "servings", "cuisine", "rating", "saves_count",
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    cuisine = CuisineSerializer()
    diets = DietSerializer(many=True)
    tags = TagSerializer(many=True)
    ingredients = RecipeIngredientSerializer(many=True)
    steps = RecipeStepSerializer(many=True)
    rating = serializers.FloatField(source="rating_avg", read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "preview_image", "cook_time_min", "difficulty",
            "servings", "cuisine", "diets", "tags",
            "ingredients", "steps", "rating", "saves_count",
            "created_at", "updated_at",
        ]


# ---- коллекции (избранное) ---------------------------------------------------
class CollectionItemSerializer(serializers.ModelSerializer):
    recipe = RecipeListSerializer(read_only=True)

    class Meta:
        model = CollectionItem
        fields = ["id", "recipe", "added_at"]


class CollectionSerializer(serializers.ModelSerializer):
    items = CollectionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ["id", "title", "is_public", "items"]


# ---- отзывы ------------------------------------------------------------------
class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        source="recipe", queryset=Recipe.objects.all(), write_only=True
    )

    class Meta:
        model = Review
        fields = ["id", "author", "recipe_id", "rating", "text", "created_at", "updated_at"]
        read_only_fields = ["id", "author", "created_at", "updated_at"]
        validators = [
            UniqueTogetherValidator(
                queryset=Review.objects.all(),
                fields=["author", "recipe"],
                message="Вы уже оставляли отзыв для этого рецепта.",
            )
        ]


# ---- meal planner ------------------------------------------------------------
class MealEntrySerializer(serializers.ModelSerializer):
    recipe = RecipeListSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        source="recipe", queryset=Recipe.objects.all(), write_only=True
    )

    class Meta:
        model = MealEntry
        fields = ["id", "date", "meal_type", "recipe", "recipe_id", "servings", "note"]


# ---- shopping list -----------------------------------------------------------
class ShoppingItemSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        source="ingredient", queryset=Ingredient.objects.all(), write_only=True
    )
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.PrimaryKeyRelatedField(
        source="unit", queryset=Unit.objects.all(), allow_null=True, required=False, write_only=True
    )

    class Meta:
        model = ShoppingItem
        fields = [
            "id",
            "ingredient", "ingredient_id",
            "qty",
            "unit", "unit_id",
            "is_checked", "note", "category",
        ]


class ShoppingListSerializer(serializers.ModelSerializer):
    items = ShoppingItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingList
        fields = ["id", "title", "created_at", "items"]
        read_only_fields = ["id", "created_at", "items"]


# --- input сериалайзер для генерации списка покупок из плана ------------------
class GenerateFromPlanSerializer(serializers.Serializer):
    date_from = serializers.DateField(help_text="YYYY-MM-DD")
    date_to = serializers.DateField(help_text="YYYY-MM-DD")
    title = serializers.CharField(required=False, allow_blank=True)

    # Необязательно: исключить ингредиенты по id
    exclude = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        default=list,
    )

    # Необязательно: фильтр по типам приёмов пищи
    meal_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )


# --- сериалайзер для создания/обновления позиций списка -----------------------
class ShoppingItemCreateUpdateSerializer(serializers.ModelSerializer):
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        source="ingredient",
        write_only=True,
    )
    unit_id = serializers.PrimaryKeyRelatedField(
        queryset=Unit.objects.all(),
        source="unit",
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = ShoppingItem
        fields = ["ingredient_id", "qty", "unit_id", "note", "category"]

    def validate_qty(self, value):
        if value is None:
            raise serializers.ValidationError("qty is required")
        try:
            if value <= 0:
                raise serializers.ValidationError("qty must be > 0")
        except TypeError:
            raise serializers.ValidationError("qty must be a number")
        return value

class RateRecipeSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    text = serializers.CharField(required=False, allow_blank=True, default="")
