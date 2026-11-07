"""DB 없이 동작하는 랜덤 미션 생성 및 임시 채점. 서버 재시작 시 미션 소멸."""
import random
import time
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.mission_target import MissionTarget
from .mission_data import (
    PAYMENTS, MEMBERSHIP, FASTFOOD,
    FASTFOOD_SET_SIDES, FASTFOOD_DRINKS, FASTFOOD_RECOMMENDED, CATALOG,
)

# 임시 저장소: 배포 시 다중 프로세스/재시작에 취약. 최종적으로 DB 연동 필요.
MISSIONS: dict[str, dict[str, Any]] = {}
TTL_SECONDS = 60 * 60


def _item(name: str, quantity: int = 1, **options: str) -> dict[str, Any]:
    return {"name": name, "quantity": quantity, "options": options}


def _flat_items(category: str, allowed_sections: list[str] | None = None) -> list[str]:
    sections = CATALOG[category]
    return [name for section, menus in sections.items()
            if allowed_sections is None or section in allowed_sections
            for name in menus]


def _generate_fastfood(difficulty: str) -> list[dict[str, Any]]:
    name = random.choice([n for section in FASTFOOD.values() for n in section])
    composition = random.choice(["단품", "세트", "라지세트"])
    options = {"composition": composition}
    if composition != "단품":
        options["set_side"] = random.choice(FASTFOOD_SET_SIDES)
        options["drink"] = random.choice(FASTFOOD_DRINKS)
    items = [_item(name, **options)]
    if difficulty == "hard":
        # 별도 추가상품은 실제 메뉴에 존재하는 항목에서 선택
        extra = random.choice(FASTFOOD_RECOMMENDED)
        items.append(_item(extra))
    return items


def _generate_cafe(difficulty: str) -> list[dict[str, Any]]:
    name = random.choice(_flat_items("cafe", ["커피", "음료", "티"]))
    options = {}
    if name == "아메리카노":
        options = {"temperature": random.choice(["HOT", "ICED"]),
                   "beans": random.choice(["일반원두", "디카페인"])}
    first = _item(name, random.choice([1, 2]) if difficulty == "hard" else 1, **options)
    if difficulty == "easy":
        return [first]
    # 하드: 음료 + 베이커리 조합
    bakery = random.choice(list(CATALOG["cafe"]["베이커리"]))
    return [first, _item(bakery)]


def _generate_restaurant(difficulty: str) -> list[dict[str, Any]]:
    names = _flat_items("restaurant")
    if difficulty == "hard":
        return [_item(name) for name in random.sample(names, 2)]
    return [_item(random.choice(names))]


def _generate_mart(difficulty: str) -> list[dict[str, Any]]:
    names = list(dict.fromkeys(_flat_items("mart")))
    chosen = random.sample(names, 2 if difficulty == "hard" else 1)
    return [_item(name, random.choice([1, 2]) if difficulty == "hard" else 1) for name in chosen]


def _describe_item(item: dict[str, Any]) -> str:
    o = item["options"]
    desc = item["name"]
    if "composition" in o:
        desc += f" {o['composition']}"
    if "temperature" in o:
        desc += f" {o['temperature']}"
    if "beans" in o:
        desc += f"({o['beans']})"
    if "set_side" in o:
        desc += f"(사이드: {o['set_side']}, 음료: {o['drink']})"
    return f"{desc} {item['quantity']}개"


def create_mission(
    category: str,
    difficulty: str,
    db: Session | None = None,
) -> dict[str, Any]:
    if category not in {"fastfood", "cafe", "restaurant", "mart"}:
        raise HTTPException(400, "category는 fastfood/cafe/restaurant/mart 중 하나여야 합니다.")
    if difficulty not in {"easy", "hard"}:
        raise HTTPException(400, "difficulty는 easy/hard 중 하나여야 합니다.")
    generators = {"fastfood": _generate_fastfood, "cafe": _generate_cafe,
                  "restaurant": _generate_restaurant, "mart": _generate_mart}
    items = generators[category](difficulty)
    payment = random.choice(PAYMENTS)
    membership = random.choice(MEMBERSHIP) if difficulty == "hard" and category != "restaurant" else None
    instruction = "와 ".join(_describe_item(item) for item in items)
    payment_phrase = "카드로" if payment == "카드 결제" else f"{payment}로"
    instruction += f"를 주문하고 {payment_phrase} 결제하세요."
    if membership == "멤버십 바코드로 적립":
        instruction += " 멤버십은 바코드로 적립해 주세요."
    elif membership == "전화번호로 적립":
        instruction += " 멤버십은 전화번호로 적립해 주세요."
    elif membership == "적립 안함":instruction += " 멤버십은 적립하지 마세요."
    mission_id = uuid.uuid4().hex
    now = time.time()
    for key, stored in list(MISSIONS.items()):
        if now - stored["created_at"] > TTL_SECONDS:
            del MISSIONS[key]
    MISSIONS[mission_id] = {
        "items": items,
        "payment_method": payment,
        "membership_method": membership,
        "difficulty": difficulty,
        "created_at": now,
    }

    def save_target(session: Session) -> None:
        session.query(MissionTarget).filter(
            MissionTarget.created_at < now - TTL_SECONDS
        ).delete(synchronize_session=False)
        session.add(
            MissionTarget(
                mission_id=mission_id,
                target=MISSIONS[mission_id],
                created_at=now,
            )
        )

    if db is None:
        with SessionLocal.begin() as session:
            save_target(session)
    else:
        save_target(db)
        db.commit()

    # 정답 구조(items)는 노출하지 않고 미션 문구만 전달
    return {"mission_id": mission_id, "category": category,
            "difficulty": difficulty, "instruction": instruction}


def _normalize(items: list[dict[str, Any]]) -> list[tuple[Any, ...]]:
    return sorted((i["name"], i["quantity"], tuple(sorted(i.get("options", {}).items())))
                  for i in items)


def get_mission_target(
    mission_id: str,
    db: Session | None = None,
) -> dict[str, Any] | None:
    now = time.time()
    target = MISSIONS.get(mission_id)
    if target is not None and now - target["created_at"] <= TTL_SECONDS:
        return target

    MISSIONS.pop(mission_id, None)
    if db is None:
        return None

    record = db.get(MissionTarget, mission_id)
    if record is None or now - record.created_at > TTL_SECONDS:
        return None

    MISSIONS[mission_id] = record.target
    return record.target


def check_mission(
    mission_id: str,
    items: list[dict[str, Any]],
    payment_method: str,
    membership_method: str | None,
    db: Session | None = None,
) -> dict[str, Any]:
    target = get_mission_target(mission_id, db)
    if target is None:
        raise HTTPException(404, "미션을 찾을 수 없거나 만료되었습니다. 새 미션을 요청하세요.")
    checks = {
        "items": _normalize(items) == _normalize(target["items"]),
        "payment_method": payment_method == target["payment_method"],
    }
    if target["membership_method"] is not None:
        checks["membership_method"] = membership_method == target["membership_method"]
    return {"mission_id": mission_id, "success": all(checks.values()),
            "checks": checks}
