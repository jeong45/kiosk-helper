"""FastAPI 미션 API: GET /api/missions/random, POST /api/missions/check"""
from typing import Literal
from fastapi import APIRouter
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


@router.get("/random")
def random_mission(
    category: Literal["fastfood", "cafe", "restaurant", "mart"],
    difficulty: Literal["easy", "hard"],
):
    return create_mission(category, difficulty)


@router.post("/check")
def submit_mission(payload: MissionSubmission):
    return check_mission(
        payload.mission_id,
        [item.model_dump() for item in payload.items],
        payload.payment_method,
        payload.membership_method,
    )
