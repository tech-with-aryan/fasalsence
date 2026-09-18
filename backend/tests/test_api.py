from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import init_db
from app.database.seed import seed_demo_data

init_db()
seed_demo_data()
client = TestClient(app)


def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_demo_farms():
    response = client.get('/api/farms')
    assert response.status_code == 200
    assert response.json()[0]['crop'] == 'Wheat'


def test_weather():
    response = client.get('/api/weather/1')
    assert response.status_code == 200
    assert response.json()['demo'] is True
