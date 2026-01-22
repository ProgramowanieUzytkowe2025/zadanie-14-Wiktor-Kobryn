from pydantic import BaseModel

class RoslinaResponse(BaseModel):
    id: int
    gatunek: str
    cena: float
    dostepnosc: bool

    class Config:
        orm_mode = True

class RoslinaRequest(BaseModel):
    gatunek: str
    cena: float
    dostepnosc: bool