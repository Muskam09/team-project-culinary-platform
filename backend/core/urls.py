from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from api.views import health

urlpatterns = [
    # редирект с "/" сразу на Swagger UI
    path("", RedirectView.as_view(url="/api/docs/", permanent=False)),

    # админка
    path("admin/", admin.site.urls),

    # health-check
    path("api/health/", health, name="health"),

    # API schema & Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    # если будут свои эндпоинты в api/urls.py
    path("api/", include("api.urls")),
]
