from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import UniqueConstraint
from django.db.models import Avg, Count, UniqueConstraint
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

User = get_user_model()


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Unit(models.Model):
    """Единицы измерения: g, ml, pcs, tsp, tbsp и т.д."""
    key = models.SlugField(max_length=32, unique=True)  # 'g', 'ml', 'pcs'
    name = models.CharField(max_length=64)              # 'grams', 'milliliters', 'pieces'

    def __str__(self):
        return self.key


class Ingredient(models.Model):
    """Базовый каталог ингредиентов (морковь, молоко…)."""
    name = models.CharField(max_length=128, unique=True)
    alt_names = models.CharField(max_length=256, blank=True, default="")  # синонимы

    def __str__(self):
        return self.name


class Cuisine(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name


class Diet(models.Model):
    """Диетические категории: vegan, keto, gluten-free…"""
    slug = models.SlugField(max_length=64, unique=True)
    title = models.CharField(max_length=128)

    def __str__(self):
        return self.title


class Tag(models.Model):
    """Общие теги/категории (сезонное, бюджетное, kid-friendly…)."""
    slug = models.SlugField(max_length=64, unique=True)
    title = models.CharField(max_length=128)

    def __str__(self):
        return self.title


class Recipe(TimeStampedModel):
    """Рецепт (UGC)."""
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=160)
    preview_image = models.ImageField(upload_to="recipes/previews/", blank=True, null=True)

    # краткие атрибуты
    cook_time_min = models.PositiveIntegerField(default=0)     # время готовки
    difficulty = models.PositiveSmallIntegerField(default=1)   # 1..5
    servings = models.PositiveSmallIntegerField(default=1)

    cuisine = models.ForeignKey(Cuisine, on_delete=models.SET_NULL, null=True, blank=True)
    diets = models.ManyToManyField(Diet, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    # агрегированные поля для быстрого листинга
    rating_avg = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    saves_count = models.PositiveIntegerField(default=0)  # добавления в избранное

    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    order = models.PositiveSmallIntegerField()
    text = models.TextField()
    image = models.ImageField(upload_to="recipes/steps/", blank=True, null=True)

    class Meta:
        unique_together = ("recipe", "order")
        ordering = ["order"]


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    qty = models.FloatField()
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, null=True, blank=True)
    note = models.CharField(max_length=128, blank=True, default="")  # «измельчить», «по вкусу»

    class Meta:
        unique_together = ("recipe", "ingredient")

class Collection(TimeStampedModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="collections")
    title = models.CharField(max_length=120)
    is_public = models.BooleanField(default=False)

    class Meta:
        constraints = [
            UniqueConstraint(fields=["owner", "title"], name="uniq_collection_per_owner_title")
        ]

    def __str__(self):
        return f"{self.owner} / {self.title}"


class CollectionItem(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name="items")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="in_collections")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=["collection", "recipe"], name="uniq_recipe_per_collection")
        ]

    def __str__(self):
        return f"{self.collection.title}: {self.recipe.title}"

# --- Reviews / Ratings --------------------------------------------------------
class Review(models.Model):
    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="reviews")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()  # 1..5
    text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["author", "recipe"], name="unique_review_per_user_recipe"),
            models.CheckConstraint(check=models.Q(rating__gte=1, rating__lte=5), name="rating_between_1_5"),
        ]

    def __str__(self):
        return f"{self.author} → {self.recipe} ({self.rating})"


def _recalc_recipe_rating(recipe_id: int) -> None:
    agg = Review.objects.filter(recipe_id=recipe_id).aggregate(
        avg=Avg("rating"), cnt=Count("id")
    )
    avg = float(agg["avg"] or 0.0)
    cnt = int(agg["cnt"] or 0)
    Recipe.objects.filter(id=recipe_id).update(rating_avg=avg, rating_count=cnt)


@receiver(post_save, sender=Review)
def _on_review_saved(sender, instance: "Review", **kwargs):
    _recalc_recipe_rating(instance.recipe_id)


@receiver(post_delete, sender=Review)
def _on_review_deleted(sender, instance: "Review", **kwargs):
    _recalc_recipe_rating(instance.recipe_id)


# --- Reviews / Ratings --------------------------------------------------------
class Review(models.Model):
    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="reviews")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()  # 1..5
    text = models.TextField(blank=True)

    # таймстемпы (если у тебя есть общий TimeStampedModel — можно от него наследоваться)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["author", "recipe"], name="unique_review_per_user_recipe"),
            models.CheckConstraint(check=models.Q(rating__gte=1, rating__lte=5), name="rating_between_1_5"),
        ]

    def __str__(self):
        return f"{self.author} → {self.recipe} ({self.rating})"


def _recalc_recipe_rating(recipe_id: int) -> None:
    agg = Review.objects.filter(recipe_id=recipe_id).aggregate(
        avg=Avg("rating"), cnt=Count("id")
    )
    avg = float(agg["avg"] or 0.0)
    cnt = int(agg["cnt"] or 0)
    Recipe.objects.filter(id=recipe_id).update(rating_avg=avg, rating_count=cnt)


@receiver(post_save, sender=Review)
def _on_review_saved(sender, instance: "Review", **kwargs):
    _recalc_recipe_rating(instance.recipe_id)


@receiver(post_delete, sender=Review)
def _on_review_deleted(sender, instance: "Review", **kwargs):
    _recalc_recipe_rating(instance.recipe_id)

class MealEntry(models.Model):
    """Запись плана питания на конкретный день/приём пищи."""
    class MealType(models.TextChoices):
        BREAKFAST = "breakfast", "Завтрак"
        LUNCH     = "lunch",     "Обед"
        DINNER    = "dinner",    "Ужин"
        SNACK     = "snack",     "Перекус"
        DESSERT   = "dessert",   "Десерт"
        DRINK     = "drink",     "Напиток"

    owner     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="meal_entries")
    date      = models.DateField()
    meal_type = models.CharField(max_length=16, choices=MealType.choices)
    recipe    = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="planned_in")
    servings  = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    note      = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["date", "meal_type", "id"]
        indexes  = [models.Index(fields=["owner", "date"])]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "date", "meal_type", "recipe"],
                name="uniq_owner_day_meal_recipe",
            ),
        ]

    def __str__(self):
        return f"{self.owner} {self.date} {self.meal_type} → {self.recipe}"


# --- Shopping List ------------------------------------------------------------
class ShoppingList(models.Model):
    owner      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="shopping_lists")
    title      = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "id"]

    def __str__(self):
        return f"{self.title} ({self.owner})"


class ShoppingItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name="items")
    ingredient    = models.ForeignKey("Ingredient", on_delete=models.PROTECT)
    qty           = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    unit          = models.ForeignKey("Unit", on_delete=models.PROTECT, null=True, blank=True)
    is_checked    = models.BooleanField(default=False)
    note          = models.CharField(max_length=255, blank=True)
    category      = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["ingredient__name", "id"]
