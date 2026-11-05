from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.db.base import Base


class MissionAttempt(Base):
    __tablename__ = "mission_attempt"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    difficulty = Column(String, nullable=False)

    target_payment_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    target_payment_method_name = Column(String, nullable=True)
    chosen_payment_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    chosen_payment_method_name = Column(String, nullable=True)

    target_membership_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    target_membership_method_name = Column(String, nullable=True)
    chosen_membership_method_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    chosen_membership_method_name = Column(String, nullable=True)

    success = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
