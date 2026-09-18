def get_crop_health(farm_id: int) -> dict:
    return {"demo": True, "farm_id": farm_id, "current_index": 0.58, "baseline": 0.71, "change_percent": -18, "status": "Possible vegetation stress", "signal": "Satellite crop-health indicator", "possible_reasons": ["Water stress", "Nutrient stress", "Crop-stage variation", "Disease or other stressors"]}


def get_satellite(farm_id: int) -> dict:
    return {"demo": True, "farm_id": farm_id, "boundary": [[25.45, 81.85], [25.46, 81.87], [25.44, 81.88], [25.43, 81.86]], "health_layer": "moderate", "legend": ["Low health", "Moderate", "Healthy"], "awaiting_live_service": True}
