from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from app.db.base import Base


class OptionGroup(Base):
    __tablename__ = "option_group"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menu.id"), nullable=False)
    type = Column(String, nullable=False)
    is_required = Column(Boolean, default=False, nullable=False)
