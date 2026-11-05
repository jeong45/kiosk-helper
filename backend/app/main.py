from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.models import (
    users,
    category,
    menu,
    option_group,
    option_item,
    mission_attempt,
    mission_attempt_item,
    mission_attempt_option,
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, world"}