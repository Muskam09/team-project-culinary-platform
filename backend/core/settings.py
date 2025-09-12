from datetime import timedelta
import os
from pathlib import Path
from dotenv import load_dotenv

# ── Paths / Env ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ── Core ───────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-dev")  # замени в .env на сильный ключ
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost,0.0.0.0").split(",")
    if h.strip()
]

# ── Apps ───────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # 3rd-party
    "rest_framework",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "corsheaders",
    "django_filters",

    # Local
    "api",
]

# ── Middleware (важно: CorsMiddleware до CommonMiddleware) ─────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",   # ← до CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],  # при необходимости: [BASE_DIR / "templates"]
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# ── Database (SQLite для dev; Postgres шаблон ниже) ────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.getenv("DB_NAME", BASE_DIR / "db.sqlite3"),
        # следующие поля игнорируются для SQLite, но пригодятся для Postgres
        "USER": os.getenv("DB_USER", ""),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", ""),
        "PORT": os.getenv("DB_PORT", ""),
    }
}

# ── I18N / TZ ──────────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "Europe/Kyiv")
USE_I18N = True
USE_TZ = True

# ── Static / Media ─────────────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"          # collectstatic кладёт сюда на проде
STATICFILES_DIRS = []                           # напр.: [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── DRF / Filters / Pagination / OpenAPI ───────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",

    # Аутентификация: JWT + (Session/Basic — удобно в админке/на dev)
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),

    # Разрешения по умолчанию: читать всем, писать авторизованным
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),

    # Поиск/фильтры/сортировки
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),

    # Пагинация
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,

    # Парсеры (JSON, формы и файлы — для ImageField upload)
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),
}

# Рендереры: в проде — только JSON; в dev — ещё Browsable API
if not DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (
        "rest_framework.renderers.JSONRenderer",
    )
else:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    )

SPECTACULAR_SETTINGS = {
    "TITLE": "Culinary Platform API",
    "DESCRIPTION": "Backend for recipes, collections, planner, shopping lists",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ── CORS / CSRF ────────────────────────────────────────────────────────────────
# Для локалки можно разрешить всё; на проде перечисляй домены
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "True") == "True"

# Точечное разрешение источников (рекомендуется на проде)
CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

# Разрешить куки (если фронт будет работать с cookie)
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "False") == "True"

# Django 4+ требует доверенные источники для безопасных POST с фронта
CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]

# ── Security (мягкие дефолты; ужесточай на проде) ─────────────────────────────
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https") if os.getenv("USE_PROXY", "False") == "True" else None
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "False") == "True"
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "False") == "True"

# ── (Опционально) SIMPLE JWT конфиг — подключим, когда дойдём до auth ─────────
# from datetime import timedelta
# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MIN", "15"))),
#     "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7"))),
#     "AUTH_HEADER_TYPES": ("Bearer",),
# }

# ── Подсказка по Postgres (docker-compose/прод) ───────────────────────────────
# В .env укажи:
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=culinary
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_HOST=postgres
# DB_PORT=5432

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
