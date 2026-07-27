import logging
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("db")

Base = declarative_base()

def init_db_engine():
    """
    Attempts to initialize MySQL connection.
    If MySQL server is unreachable, falls back gracefully to SQLite.
    """
    mysql_url = settings.DATABASE_URL
    try:
        # First attempt to create database if MySQL server is running
        server_url = f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}"
        temp_engine = create_engine(server_url, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DB}"))
            conn.commit()
        
        logger.info(f"Successfully connected to MySQL database: {settings.MYSQL_DB}")
        engine = create_engine(mysql_url, pool_recycle=3600)
        # Test connection
        with engine.connect() as conn:
            pass
        return engine, "MySQL"
    except Exception as e:
        logger.warning(f"MySQL connection unavailable ({e}). Falling back to local SQLite database (complaints.db)...")
        sqlite_url = "sqlite:///./complaints.db"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        return engine, "SQLite"

engine, DB_TYPE = init_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
