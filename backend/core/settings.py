import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")  # подтягиваем .env из корня backend

# ── Core ────────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-dev")
DEBUG = os.getenv("DEBUG", "False") == "True"

# список хостов (через запятую в .env), по умолчанию локальная разработка
ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost,0.0.0.0").split(",")
    if h.strip()
]

# ── Apps ────────────────────────────────────────────────────────────────────────
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
    "corsheaders",

    # Local
    "api",
]

# ── Middleware (важно: CorsMiddleware до CommonMiddleware) ─────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",   # <- должен идти до CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
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
        "DIRS": [],  # можно добавить BASE_DIR / "templates"
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
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ── I18N / TZ ──────────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "Europe/Kyiv")  # удобнее тебе
USE_I18N = True
USE_TZ = True

# ── Static / Media ─────────────────────────────────────────────────────────────
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # на проде collectstatic сложит сюда
STATICFILES_DIRS = []  # например: [BASE_DIR / "static"]

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── DRF / Schema ───────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # под dev можно оставить пусто. Если надо — добавим аутентификацию/пагинацию.
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Culinary Platform API",
    "DESCRIPTION": "Backend bootstrap",
    "VERSION": "0.1.0",
}

# ── CORS / CSRF ────────────────────────────────────────────────────────────────
# Для локалки самое простое — разрешить всё. На проде лучше перечислять домены.
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "True") == "True"

# Если хочешь точечно (рекомендуется для продакшена), укажи в .env:
# CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

# Разрешить куки (если фронт будет работать с сессиями/JWT в cookie)
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "False") == "True"

# Для POST/PUT с фронта Django 4+ требует явные доверенные источники CSRF:
# пример для локалки: CSRF_TRUSTED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]
