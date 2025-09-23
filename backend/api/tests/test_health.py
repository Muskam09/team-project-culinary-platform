from django.test import TestCase, Client

class HealthTest(TestCase):
    def test_health_endpoint_returns_ok(self):
        c = Client()
        resp = c.get("/api/health/")
        assert resp.status_code in (200, 204)
