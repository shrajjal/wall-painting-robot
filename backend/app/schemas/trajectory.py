from pydantic import BaseModel
from typing import List

class Obstacle(BaseModel):
    x: int
    y: int
    width: int
    height: int

class TrajectoryRequest(BaseModel):
    width: int
    height: int
    obstacles: List[Obstacle]

class TrajectoryResponse(BaseModel):
    id: int
    path: list