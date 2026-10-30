import base64

import pytest
from fastapi.testclient import TestClient

import main

JPEG = base64.b64encode(b"\xff\xd8\xff" + b"0" * 200).decode()


@pytest.fixture(autouse=True)
def setup(monkeypatch):
    monkeypatch.setattr(main, "NVIDIA_API_KEY", "test")
    main._hits.clear()


client = TestClient(main.app)


def test_parse_strips_fences_and_units():
    n = main.parse_model_output('```json\n{"foodName":"Pasta","calories":"520 kcal","protein":"18g","carbs":"80g","fats":"12g"}\n```')
    assert (n.foodName, n.calories, n.protein, n.carbs, n.fats) == ("Pasta", 520, 18, 80, 12)


def test_parse_rejects_absurd_values():
    with pytest.raises(Exception):
        main.parse_model_output('{"foodName":"x","calories":99999,"protein":1,"carbs":1,"fats":1}')


def test_name_is_sanitized():
    assert "<" not in main.parse_model_output('{"foodName":"<script>Rice</script>","calories":1,"protein":1,"carbs":1,"fats":1}').foodName


def test_happy_path(monkeypatch):
    async def fake(b64, mime):
        return '{"foodName":"Salad","calories":200,"protein":5,"carbs":10,"fats":8}'
    monkeypatch.setattr(main, "call_model", fake)
    r = client.post("/api/analyze-food", json={"base64_image": JPEG})
    assert r.status_code == 200 and r.json()["calories"] == 200


def test_rejects_non_image():
    bad = base64.b64encode(b"not an image" * 20).decode()
    assert client.post("/api/analyze-food", json={"base64_image": bad}).status_code == 415


def test_rejects_bad_base64():
    assert client.post("/api/analyze-food", json={"base64_image": "!" * 200}).status_code == 400


def test_rejects_oversized():
    assert client.post("/api/analyze-food", json={"base64_image": "A" * (main.MAX_B64 + 1)}).status_code in (413, 422)


def test_rate_limit(monkeypatch):
    async def fake(b64, mime):
        return '{"foodName":"A","calories":1,"protein":1,"carbs":1,"fats":1}'
    monkeypatch.setattr(main, "call_model", fake)
    codes = [client.post("/api/analyze-food", json={"base64_image": JPEG}).status_code for _ in range(12)]
    assert codes[:10] == [200] * 10 and codes[10] == 429


def test_garbage_model_output_returns_502(monkeypatch):
    async def fake(b64, mime):
        return "sorry I cannot help"
    monkeypatch.setattr(main, "call_model", fake)
    assert client.post("/api/analyze-food", json={"base64_image": JPEG}).status_code == 502
