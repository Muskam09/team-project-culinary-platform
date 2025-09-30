from django.http import JsonResponse
from django.db import connection

def health(request):
    try:
        with connection.cursor() as c:
            c.execute("SELECT 1")
        db = "ok"
        status = 200
    except Exception as e:
        db = f"error: {e}"
        status = 500
    return JsonResponse({"status": "ok" if status == 200 else "fail", "db": db}, status=status)
