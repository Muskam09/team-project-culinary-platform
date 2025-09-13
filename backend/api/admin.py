from django.contrib import admin
from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag,
    Recipe, RecipeStep, RecipeIngredient,
    Collection, CollectionItem,
    Review,
    MealEntry,
    ShoppingList, ShoppingItem,
)

# ── Справочники ────────────────────────────────────────────────────────────────

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("key", "name")
    search_fields = ("key", "name")


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ("name", "alt_names")
    search_fields = ("name", "alt_names")


@admin.register(Cuisine)
class CuisineAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Diet)
class DietAdmin(admin.ModelAdmin):
    list_display = ("slug", "title")
    search_fields = ("slug", "title")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("slug", "title")
    search_fields = ("slug", "title")


# ── Рецепты ───────────────────────────────────────────────────────────────────

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1
    autocomplete_fields = ("ingredient", "unit")
    fields = ("ingredient", "qty", "unit", "note")


class RecipeStepInline(admin.TabularInline):
    model = RecipeStep
    extra = 1
    fields = ("order", "text", "image")


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "cuisine", "cook_time_min", "difficulty",
        "rating_avg", "reviews_count", "saves_count", "is_published", "created_at",
    )
    list_filter = ("cuisine", "difficulty", "is_published", "diets", "tags", "created_at")
    search_fields = ("title",)
    autocomplete_fields = ("cuisine",)
    filter_horizontal = ("diets", "tags")
    readonly_fields = ("rating_avg", "reviews_count", "saves_count", "created_at", "updated_at")
    date_hierarchy = "created_at"
    inlines = [RecipeIngredientInline, RecipeStepInline]


# ── Коллекции (избранное) ─────────────────────────────────────────────────────

class CollectionItemInline(admin.TabularInline):
    model = CollectionItem
    extra = 0
    autocomplete_fields = ("recipe",)
    fields = ("recipe", "added_at")
    readonly_fields = ("added_at",)


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "is_public")
    list_filter = ("is_public",)
    search_fields = ("title", "owner__username")
    autocomplete_fields = ("owner",)
    inlines = [CollectionItemInline]


@admin.register(CollectionItem)
class CollectionItemAdmin(admin.ModelAdmin):
    list_display = ("id", "collection", "recipe", "added_at")
    list_select_related = ("collection", "recipe")
    search_fields = ("collection__title", "recipe__title")
    readonly_fields = ("added_at",)
    autocomplete_fields = ("collection", "recipe")


# ── Отзывы ────────────────────────────────────────────────────────────────────

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "recipe", "author", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("recipe__title", "author__username", "text")
    autocomplete_fields = ("recipe", "author")
    date_hierarchy = "created_at"


# ── План питания ──────────────────────────────────────────────────────────────

@admin.register(MealEntry)
class MealEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "date", "meal_type", "recipe", "servings")
    list_filter = ("meal_type", "date")
    search_fields = ("owner__username", "recipe__title", "note")
    autocomplete_fields = ("owner", "recipe")
    date_hierarchy = "date"


# ── Списки покупок ────────────────────────────────────────────────────────────

class ShoppingItemInline(admin.TabularInline):
    model = ShoppingItem
    extra = 0
    autocomplete_fields = ("ingredient", "unit")
    fields = ("ingredient", "qty", "unit", "is_checked", "category", "note")


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "title", "created_at")
    search_fields = ("owner__username", "title")
    autocomplete_fields = ("owner",)
    date_hierarchy = "created_at"
    inlines = [ShoppingItemInline]


@admin.register(ShoppingItem)
class ShoppingItemAdmin(admin.ModelAdmin):
    list_display = ("id", "shopping_list", "ingredient", "qty", "unit", "is_checked", "category")
    list_filter = ("is_checked", "category")
    list_select_related = ("shopping_list", "ingredient", "unit")
    search_fields = ("ingredient__name", "shopping_list__title", "note")
    autocomplete_fields = ("shopping_list", "ingredient", "unit")
