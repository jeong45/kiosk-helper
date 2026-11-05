"""FastAPI 미션 API: GET /api/missions/random, POST /api/missions/check"""
from typing import Literal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.mission_check_test import MissionCheckTest
from pydantic import BaseModel, Field
from app.services.mission_service import create_mission, check_mission

router = APIRouter(prefix="/api/missions", tags=["missions"])


class OrderItem(BaseModel):
    name: str
    quantity: int = Field(ge=1)
    options: dict[str, str] = Field(default_factory=dict)


class MissionSubmission(BaseModel):
    mission_id: str
    items: list[OrderItem]
    payment_method: str
    membership_method: str | None = None


def _normalize_composition(value: str) -> str:
    aliases = {
        "single": "단품",
        "set": "세트",
        "large_set": "라지세트",
    }
    return aliases.get(value, value)


def _normalize_payment_method(value: str) -> str:
    aliases = {
        "card": "카드 결제",
        "samsung": "삼성페이",
        "spay": "삼성페이",
        "kakao": "카카오페이",
        "kpay": "카카오페이",
    }
    return aliases.get(value, value)


@router.get("/random")
def random_mission(
    category: Literal["fastfood", "cafe", "restaurant", "mart"],
    difficulty: Literal["easy", "hard"],
):
    return create_mission(category, difficulty)


@router.post("/check")
def submit_mission(payload: MissionSubmission, db: Session = Depends(get_db)):
    items = [item.model_dump() for item in payload.items]
    for item in items:
        if "composition" in item["options"]:
            item["options"]["composition"] = _normalize_composition(
                item["options"]["composition"]
            )

    result = check_mission(
        payload.mission_id,
        items,
        _normalize_payment_method(payload.payment_method),
        payload.membership_method,
    )
    record = MissionCheckTest(mission_id=payload.mission_id, success=result["success"], checks=result["checks"])
    db.add(record)
    db.commit()
    db.refresh(record)
    return {**result, "test_record_id": record.id}
