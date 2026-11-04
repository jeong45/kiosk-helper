from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.base import Base

class OptionGroup(Base):
    __tablename__ = "option_group"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menu.id"), nullable=False)
    type = Column(String, nullable=False)       # '구성', '사이드', '음료', '결제방식', '적립방식'
    is_required = Column(Boolean, default=False, nullable=False)