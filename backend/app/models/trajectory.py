from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Trajectory(Base):
    __tablename__ = "trajectories"

    id = Column(Integer, primary_key=True, index=True)
    width = Column(Integer)
    height = Column(Integer)
    path = Column(String)         # JSON string
    obstacles = Column(String)    # ✅ ADD THIS LINE
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))