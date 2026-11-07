from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.base import Base


class OptionItem(Base):
    __tablename__ = "option_item"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("option_group.id"), nullable=False)
    name = Column(String, nullable=False)
    extra_price = Column(Integer, default=0, nullable=False)
