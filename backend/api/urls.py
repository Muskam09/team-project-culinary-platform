from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet


from .views import (
    UnitViewSet,
    IngredientViewSet,
    CuisineViewSet,
    DietViewSet,
    TagViewSet,
    RecipeViewSet,
    CollectionViewSet,
    me,
)

router = DefaultRouter()
router.register(r"units", UnitViewSet, basename="units")
router.register(r"ingredients", IngredientViewSet, basename="ingredients")
router.register(r"cuisines", CuisineViewSet, basename="cuisines")
router.register(r"diets", DietViewSet, basename="diets")
router.register(r"tags", TagViewSet, basename="tags")
router.register(r"recipes", RecipeViewSet, basename="recipes")
router.register(r"collections", CollectionViewSet, basename="collections")
router.register(r"reviews", ReviewViewSet, basename="reviews")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/me/", me),
]
