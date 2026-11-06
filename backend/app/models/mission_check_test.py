from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class MissionCheckTest(Base):
    """Temporary independent persistence test; NOT the team's final mission_attempt schema."""
    __tablename__ = "mission_check_test"
    id = Column(Integer, primary_key=True, autoincrement=True)
    mission_id = Column(String, nullable=False)
    success = Column(Boolean, nullable=False)
    checks = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
