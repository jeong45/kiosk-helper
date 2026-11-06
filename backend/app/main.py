from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.api import missions
from app.models import (
    category,
    menu,
    mission_attempt,
    mission_attempt_item,
    mission_attempt_option,
    option_group,
    option_item,
    users,
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(missions.router)