from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class MissionMistake(Base):
    __tablename__ = "mission_mistake"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("mission_attempt.id"), nullable=False)
    mistake_field = Column(String, nullable=False)       # 'payment_method' / 'side' / 'point_method'
    mistake_value_id = Column(Integer, ForeignKey("option_item.id"), nullable=False)