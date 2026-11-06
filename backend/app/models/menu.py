from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.base import Base


class Menu(Base):
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    name = Column(String, nullable=False)
    base_price = Column(Integer, nullable=False)
