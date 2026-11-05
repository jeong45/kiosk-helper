import json
from pathlib import Path

from app.db.session import SessionLocal
from app.models.category import Category
from app.models.menu import Menu
from app.models.option_group import OptionGroup
from app.models.option_item import OptionItem

DATA_PATH = Path(__file__).parent / "seed_data" / "menu_data.json"


def seed():
    db = SessionLocal()

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for cat_data in data:
        category = Category(name=cat_data["category"])
        db.add(category)
        db.commit()
        db.refresh(category)

        for menu_data in cat_data["menus"]:
            menu = Menu(
                category_id=category.id,
                name=menu_data["name"],
                base_price=menu_data["base_price"],
            )
            db.add(menu)
            db.commit()
            db.refresh(menu)

            for group_data in menu_data["option_groups"]:
                group = OptionGroup(
                    menu_id=menu.id,
                    type=group_data["type"],
                    is_required=group_data["is_required"],
                )
                db.add(group)
                db.commit()
                db.refresh(group)

                for item_data in group_data["items"]:
                    item = OptionItem(
                        group_id=group.id,
                        name=item_data["name"],
                        extra_price=item_data["extra_price"],
                    )
                    db.add(item)

                db.commit()

    db.close()
    print("더미 데이터 삽입 완료")


if __name__ == "__main__":
    seed()
