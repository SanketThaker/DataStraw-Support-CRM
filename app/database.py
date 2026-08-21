from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

#sql lite database file
DATABASE_URL = "sqlite:///./support_crm.db"


#Create Databse Engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread":False}
)


#Create Databse Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


#Base Class for our Databse Models
Base = declarative_base()


#Database Dependency for FastAPI

def get_db():
    db=SessionLocal()

    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    with engine.connect() as connection:
        print("SQLite Database connection Successful!")