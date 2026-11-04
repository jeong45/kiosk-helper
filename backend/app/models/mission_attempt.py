from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class MissionAttempt(Base):
    __tablename__ = "mission_attempt"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menu.id"), nullable=False)
    difficulty = Column(String, nullable=False)  # 'easy' / 'hard'

    payment_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=False)
    side_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)        # 하드모드만
    point_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)  # 하드모드만

    success = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())