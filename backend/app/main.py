from fastapi import FastAPI
from app.api import missions

app = FastAPI()

app.include_router(missions.router)