from fastapi import FastAPI
from .routes.tickets import router as ticket_router
from .database import engine, Base
from . import models
from fastapi.middleware.cors import CORSMiddleware

#Create all Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DataStraw Support CRM",
    description="Customer Support Ticketing CRM",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ticket_router)

@app.get("/")
def root():
    return{
        "message":"DataStraw Support CRM API is running"
    }