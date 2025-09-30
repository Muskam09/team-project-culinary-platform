from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.views.generic import RedirectView

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from api.views import health
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Редирект на Swagger по имени, без хардкода пути
    path("", RedirectView.as_view(url=reverse_lazy("swagger-ui"), permanent=False)),

    path("admin/", admin.site.urls),

    path("api/health/", health, name="health"),

    # OpenAPI схема (JSON/YAML через ?format=yaml)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    # Документация
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # API и аутентификация
    path("api/", include("api.urls")),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/", include(("api.urls", "api"), namespace="v1")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
