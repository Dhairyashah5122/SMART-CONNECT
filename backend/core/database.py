"""
Database connection and session management for SMART Connect
"""
import logging
from typing import Generator

from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import settings

logger = logging.getLogger(__name__)

# -------------------------------
# Engine configuration
# -------------------------------
engine = create_engine(
    settings.database_url,
    echo=settings.debug,         # Enable SQL logging in debug mode
    future=True                  # SQLAlchemy 2.x style
)

# -------------------------------
# Metadata and Base for models
# -------------------------------
metadata = MetaData(schema=settings.db_schema)
Base = declarative_base(metadata=metadata)

# -------------------------------
# Session factory
# -------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    future=True
)

# -------------------------------
# Dependency for FastAPI
# -------------------------------
def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get a database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# -------------------------------
# Utility functions
# -------------------------------
def create_tables():
    """
    Create all tables in the database
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def check_db_connection() -> bool:
    """
    Check if database connection is working
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))  # v2-compatible
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
