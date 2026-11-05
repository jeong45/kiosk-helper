"""FastAPI 미션 API: GET /api/missions/random, POST /api/missions/check"""
from collections import defaultdict
from itertools import zip_longest
from typing import Any, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.mission_attempt import MissionAttempt
from app.models.mission_attempt_item import MissionAttemptItem
from app.models.mission_attempt_option import MissionAttemptOption
from app.models.users import Users
from app.services.mission_service import MISSIONS, check_mission, create_mission

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


def _item_sort_key(item: dict[str, Any]) -> tuple[Any, ...]:
    return (
        item["name"],
        item["quantity"],
        tuple(sorted(item["options"].items())),
    )


def _pair_items(
    target_items: list[dict[str, Any]],
    chosen_items: list[dict[str, Any]],
) -> list[tuple[dict[str, Any] | None, dict[str, Any] | None]]:
    target_by_name: dict[str, list[dict[str, Any]]] = defaultdict(list)
    chosen_by_name: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in target_items:
        target_by_name[item["name"]].append(item)
    for item in chosen_items:
        chosen_by_name[item["name"]].append(item)

    pairs: list[tuple[dict[str, Any] | None, dict[str, Any] | None]] = []
    for name in sorted(target_by_name.keys() | chosen_by_name.keys()):
        targets = sorted(target_by_name[name], key=_item_sort_key)
        choices = sorted(chosen_by_name[name], key=_item_sort_key)
        pairs.extend(zip_longest(targets, choices))

    return pairs


def _save_attempt(
    db: Session,
    target: dict[str, Any],
    chosen_items: list[dict[str, Any]],
    payment_method: str,
    membership_method: str | None,
    success: bool,
) -> MissionAttempt:
    demo_user = db.query(Users).order_by(Users.id).first()
    if demo_user is None:
        demo_user = Users()
        db.add(demo_user)
        db.flush()

    attempt = MissionAttempt(
        user_id=demo_user.id,
        difficulty=target["difficulty"],
        target_payment_method_name=target["payment_method"],
        chosen_payment_method_name=payment_method,
        target_membership_method_name=target["membership_method"],
        chosen_membership_method_name=membership_method,
        success=success,
    )
    db.add(attempt)
    db.flush()

    for target_item, chosen_item in _pair_items(target["items"], chosen_items):
        attempt_item = MissionAttemptItem(
            attempt_id=attempt.id,
            target_menu_name=target_item["name"] if target_item else None,
            chosen_menu_name=chosen_item["name"] if chosen_item else None,
            target_quantity=target_item["quantity"] if target_item else 0,
            chosen_quantity=chosen_item["quantity"] if chosen_item else 0,
        )
        db.add(attempt_item)
        db.flush()

        target_options = target_item["options"] if target_item else {}
        chosen_options = chosen_item["options"] if chosen_item else {}
        for option_type in sorted(target_options.keys() | chosen_options.keys()):
            db.add(
                MissionAttemptOption(
                    attempt_item_id=attempt_item.id,
                    option_group_id=None,
                    option_type=option_type,
                    target_option_item_name=target_options.get(option_type),
                    chosen_option_item_name=chosen_options.get(option_type),
                )
            )

    return attempt


@router.get("/random")
def random_mission(
    category: Literal["fastfood", "cafe", "restaurant", "mart"],
    difficulty: Literal["easy", "hard"],
):
    return create_mission(category, difficulty)


@router.post("/check")
def submit_mission(payload: MissionSubmission, db: Session = Depends(get_db)):
    target = MISSIONS.get(payload.mission_id)
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
    try:
        record = _save_attempt(
            db,
            target,
            items,
            _normalize_payment_method(payload.payment_method),
            payload.membership_method,
            result["success"],
        )
        db.commit()
        db.refresh(record)
    except Exception:
        db.rollback()
        raise

    return {**result, "test_record_id": record.id}
