import os
from pathlib import Path

from dotenv import load_dotenv
import dj_database_url
from datetime import timedelta

# ── Paths / Env ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(str(BASE_DIR / ".env"))  # .env рядом с manage.py / core

def env_bool(key: str, default: bool = False) -> bool:
    return os.getenv(key, str(default)).strip().lower() in {"1", "true", "yes", "on"}

def env_list(key: str, default: str = "") -> list[str]:
    return [x.strip() for x in os.getenv(key, default).split(",") if x.strip()]

# ── Core ───────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-dev")  # замени в .env на сильный ключ
DEBUG = env_bool("DEBUG", False)

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "127.0.0.1,localhost,0.0.0.0")

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
    "api.apps.ApiConfig",
]

# ── Middleware (важно: CorsMiddleware до CommonMiddleware) ─────────────────────
# + WhiteNoise после SecurityMiddleware (п.6)
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",   # ← добавлено (serve static в проде)
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",        # ← до CommonMiddleware
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

# ── Database ───────────────────────────────────────────────────────────────────
# При наличии DATABASE_URL используем её (прод/докер). Иначе — переменные DB_* или SQLite.
database_url = os.getenv("DATABASE_URL", "")

if database_url:
    DATABASES = {
        "default": dj_database_url.config(
            default=database_url,
            conn_max_age=int(os.getenv("DB_CONN_MAX_AGE", "600")),
            ssl_require=env_bool("DB_SSL_REQUIRED", False),
        )
    }
else:
    engine = os.getenv("DB_ENGINE", "django.db.backends.sqlite3")
    name = os.getenv("DB_NAME", str(BASE_DIR / "db.sqlite3"))
    DATABASES = {
        "default": {
            "ENGINE": engine,
            "NAME": name,
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
STATIC_ROOT = BASE_DIR / "staticfiles"      # collectstatic кладёт сюда на проде
STATICFILES_DIRS = []                       # напр.: [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# WhiteNoise storage (п.6): включаем только в проде
if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── DRF / Filters / Pagination / OpenAPI ───────────────────────────────────────
_renderers = ["rest_framework.renderers.JSONRenderer"]
if DEBUG:
    _renderers.append("rest_framework.renderers.BrowsableAPIRenderer")

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",

    # Аутентификация
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",  # удобно в админке/dev
        "rest_framework.authentication.BasicAuthentication",    # удобно в админке/dev
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
    "PAGE_SIZE": int(os.getenv("PAGE_SIZE", "20")),

    # Парсеры (JSON, формы и файлы — для upload картинок и т.п.)
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),

    # Рендеры
    "DEFAULT_RENDERER_CLASSES": tuple(_renderers),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Culinary Platform API",
    "DESCRIPTION": "Backend for recipes, collections, planner, shopping lists",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SECURITY_SCHEMES": {
        "jwtAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"},
        "basicAuth": {"type": "http", "scheme": "basic"},
        "cookieAuth": {"type": "apiKey", "in": "cookie", "name": "sessionid"},
    },
    "SECURITY": [{"jwtAuth": []}],
    "COMPONENT_SPLIT_REQUEST": True,
}

# (п.7) В проде ограничиваем доступ к Swagger/Redoc только staff/admin
if not DEBUG:
    SPECTACULAR_SETTINGS["SERVE_PERMISSIONS"] = ["rest_framework.permissions.IsAdminUser"]
    SPECTACULAR_SETTINGS["SERVE_AUTHENTICATION"] = ["rest_framework.authentication.SessionAuthentication"]

# ── CORS / CSRF ────────────────────────────────────────────────────────────────
# Для локалки можно разрешить всё; на проде перечисляй домены
CORS_ALLOW_ALL_ORIGINS = env_bool("CORS_ALLOW_ALL_ORIGINS", True)

# Точечное разрешение источников (рекомендуется на проде)
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "")

# Разрешить куки (если фронт будет работать с cookie)
CORS_ALLOW_CREDENTIALS = env_bool("CORS_ALLOW_CREDENTIALS", False)

# Django 4+ требует доверенные источники для безопасных POST с фронта
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "")

# ── Security (мягкие дефолты; ужесточай на проде) ─────────────────────────────
SECURE_PROXY_SSL_HEADER = (
    ("HTTP_X_FORWARDED_PROTO", "https") if env_bool("USE_PROXY", False) else None
)
SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", False)
CSRF_COOKIE_SECURE = env_bool("CSRF_COOKIE_SECURE", False)

# ── Simple JWT ─────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.getenv("JWT_ACCESS_MIN", "60"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.getenv("JWT_REFRESH_DAYS", "7"))
    ),
    "ROTATE_REFRESH_TOKENS": env_bool("JWT_ROTATE", False),
    "BLACKLIST_AFTER_ROTATION": env_bool("JWT_BLACKLIST_AFTER_ROTATION", False),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

# ── Логи (минимально полезные дефолты) ─────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {"handlers": ["console"], "level": LOG_LEVEL},
}
