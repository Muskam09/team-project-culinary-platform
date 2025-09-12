from django.contrib import admin
from .models import (
    Unit, Ingredient, Cuisine, Diet, Tag,
    Recipe, RecipeStep, RecipeIngredient
)

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

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1

class RecipeStepInline(admin.TabularInline):
    model = RecipeStep
    extra = 1

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "cuisine", "cook_time_min", "difficulty", "rating_avg", "saves_count", "is_published")
    list_filter = ("cuisine", "difficulty", "is_published", "diets", "tags")
    search_fields = ("title",)
    inlines = [RecipeIngredientInline, RecipeStepInline]
