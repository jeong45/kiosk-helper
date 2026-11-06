import json
from pathlib import Path

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.category import Category
from app.models.menu import Menu
from app.models.option_group import OptionGroup
from app.models.option_item import OptionItem

DATA_PATH = Path(__file__).parent / "seed_data" / "menu_data.json"


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    with DATA_PATH.open(encoding="utf-8") as seed_file:
        data = json.load(seed_file)

    with SessionLocal.begin() as db:
        for category_data in data:
            category = (
                db.query(Category)
                .filter_by(name=category_data["category"])
                .first()
            )
            if category is None:
                category = Category(name=category_data["category"])
                db.add(category)
                db.flush()

            for menu_data in category_data["menus"]:
                menu = (
                    db.query(Menu)
                    .filter_by(category_id=category.id, name=menu_data["name"])
                    .first()
                )
                if menu is None:
                    menu = Menu(
                        category_id=category.id,
                        name=menu_data["name"],
                        base_price=menu_data["base_price"],
                    )
                    db.add(menu)
                    db.flush()
                else:
                    menu.base_price = menu_data["base_price"]

                for group_data in menu_data["option_groups"]:
                    group = (
                        db.query(OptionGroup)
                        .filter_by(menu_id=menu.id, type=group_data["type"])
                        .first()
                    )
                    if group is None:
                        group = OptionGroup(
                            menu_id=menu.id,
                            type=group_data["type"],
                            is_required=group_data["is_required"],
                        )
                        db.add(group)
                        db.flush()
                    else:
                        group.is_required = group_data["is_required"]

                    for item_data in group_data["items"]:
                        option_item = (
                            db.query(OptionItem)
                            .filter_by(group_id=group.id, name=item_data["name"])
                            .first()
                        )
                        if option_item is None:
                            db.add(
                                OptionItem(
                                    group_id=group.id,
                                    name=item_data["name"],
                                    extra_price=item_data["extra_price"],
                                )
                            )
                        else:
                            option_item.extra_price = item_data["extra_price"]


if __name__ == "__main__":
    seed()
