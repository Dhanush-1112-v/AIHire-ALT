from pathlib import Path

from dotenv import dotenv_values
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

env = dotenv_values(ENV_FILE)

DB_HOST = env.get("DB_HOST") or "localhost"
DB_PORT = env.get("DB_PORT") or "5432"
DB_NAME = env.get("DB_NAME") or "aihire"
DB_USER = env.get("DB_USER") or "postgres"
DB_PASSWORD = env.get("DB_PASSWORD") or "Dhanush@1112"  # Replace with your actual PostgreSQL password


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME
)


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()