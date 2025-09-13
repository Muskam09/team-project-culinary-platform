from django.db.models import Avg, Count
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review, Recipe


def _recompute_recipe_rating(recipe_id: int) -> None:
    agg = Review.objects.filter(recipe_id=recipe_id).aggregate(
        avg=Avg("rating"),
        cnt=Count("id"),
    )
    Recipe.objects.filter(id=recipe_id).update(
        rating_avg=agg["avg"] or 0,
        reviews_count=agg["cnt"] or 0,
    )


@receiver(post_save, sender=Review)
def on_review_saved(sender, instance: Review, **kwargs):
    _recompute_recipe_rating(instance.recipe_id)


@receiver(post_delete, sender=Review)
def on_review_deleted(sender, instance: Review, **kwargs):
    _recompute_recipe_rating(instance.recipe_id)
