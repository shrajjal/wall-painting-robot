from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.core.database import get_db
from app.models.trajectory import Trajectory
from app.schemas.trajectory import TrajectoryRequest
from app.services.path_service import generate_path
from app.utils.logger import logger

router = APIRouter()



@router.post("/trajectory")
def create_trajectory(data: TrajectoryRequest, db: Session = Depends(get_db)):
    logger.info("Generating path...")

    # Generate path
    path = generate_path(data.width, data.height, data.obstacles)

    # Save to DB
    traj = Trajectory(
        width=data.width,
        height=data.height,
        path=json.dumps(path),
        obstacles=json.dumps([obs.dict() for obs in data.obstacles])
    )

    db.add(traj)
    db.commit()
    db.refresh(traj)

    logger.info(f"Trajectory saved with ID: {traj.id}")

    return {
        "id": traj.id,
        "path": path
    }



@router.get("/trajectories")
def get_all(db: Session = Depends(get_db)):
    trajectories = db.query(Trajectory).all()

    result = []
    for traj in trajectories:
        result.append({
            "id": traj.id,
            "width": traj.width,
            "height": traj.height,
            "created_at": traj.created_at
        })

    return result



@router.get("/trajectory/{id}")
def get_one(id: int, db: Session = Depends(get_db)):
    traj = db.query(Trajectory).filter(Trajectory.id == id).first()

    if not traj:
        raise HTTPException(status_code=404, detail="Trajectory not found")

    return {
        "id": traj.id,
        "width": traj.width,
        "height": traj.height,
        "path": json.loads(traj.path),
        "obstacles": json.loads(traj.obstacles) if traj.obstacles else []
    }



@router.delete("/trajectory/{id}")
def delete_trajectory(id: int, db: Session = Depends(get_db)):
    traj = db.query(Trajectory).filter(Trajectory.id == id).first()

    if not traj:
        raise HTTPException(status_code=404, detail="Trajectory not found")

    db.delete(traj)
    db.commit()

    logger.info(f"Deleted trajectory ID: {id}")

    return {"message": f"Trajectory {id} deleted successfully"}
