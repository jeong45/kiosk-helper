from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.base import Base


class MissionAttemptItem(Base):
    __tablename__ = "mission_attempt_item"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("mission_attempt.id"), nullable=False)

    target_menu_id = Column(Integer, ForeignKey("menu.id"), nullable=True)
    target_menu_name = Column(String, nullable=True)
    chosen_menu_id = Column(Integer, ForeignKey("menu.id"), nullable=True)
    chosen_menu_name = Column(String, nullable=True)

    target_quantity = Column(Integer, nullable=False, default=1)
    chosen_quantity = Column(Integer, nullable=False, default=1)
