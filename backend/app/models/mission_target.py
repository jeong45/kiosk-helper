from sqlalchemy import Column, Float, JSON, String

from app.db.base import Base


class MissionTarget(Base):
    __tablename__ = "mission_target"

    mission_id = Column(String, primary_key=True)
    target = Column(JSON, nullable=False)
    created_at = Column(Float, nullable=False, index=True)
