from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class MissionAttemptOption(Base):
    __tablename__ = "mission_attempt_option"

    id = Column(Integer, primary_key=True, index=True)
    attempt_item_id = Column(Integer, ForeignKey("mission_attempt_item.id"), nullable=False)

    option_group_id = Column(Integer, ForeignKey("option_group.id"), nullable=True)
    option_type = Column(String, nullable=False)  # 예: "composition"

    target_option_item_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    target_option_item_name = Column(String, nullable=True)
    chosen_option_item_id = Column(Integer, ForeignKey("option_item.id"), nullable=True)
    chosen_option_item_name = Column(String, nullable=True)