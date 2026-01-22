from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from model import *
from schemas import RoslinaResponse, RoslinaRequest
from database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Roslina CRUD API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD - READ ALL
@app.get("/rosliny", response_model=List[RoslinaResponse])
def get_all_roslina(db: Session = Depends(get_db)):
    return db.query(Roslina).all()

# CRUD - READ ONE
@app.get("/rosliny/{id}", response_model=RoslinaResponse)
def get_single_roslina(id: int, db: Session = Depends(get_db)):
    roslina = db.query(Roslina).filter(Roslina.id == id).first()
    if not roslina:
        raise HTTPException(404, "Nie znaleziono rośliny")
    return roslina

# CRUD - CREATE
@app.post("/rosliny", response_model=RoslinaResponse)
def create_roslina(data: RoslinaRequest, db: Session = Depends(get_db)):
    nowa_roslina = Roslina(**data.dict())
    db.add(nowa_roslina)
    db.commit()
    return nowa_roslina

# CRUD - DELETE
@app.delete("/rosliny/{id}")
def delete_roslina(id: int, db: Session = Depends(get_db)):
    usuwana_roslina = db.query(Roslina).filter(Roslina.id == id).first()
    if not usuwana_roslina:
        raise HTTPException(404, "Nie znaleziono rośliny")
    
    # lab 14 - ograniczenie po stronie API - dostępność
    if usuwana_roslina.dostepnosc == False:
        raise HTTPException(400, "Nie można usunąć niedostępnej rośliny")
    
    db.delete(usuwana_roslina)
    db.commit()
    return {"message": "Poprawnie usunięto roślinę"}

# CRUD - UPDATE
@app.put("/rosliny/{id}", response_model=RoslinaResponse)
def update_roslina(id: int, data: RoslinaRequest, db: Session = Depends(get_db)):
    pobrana_roslina = db.query(Roslina).filter(Roslina.id == id).first()
    if not pobrana_roslina:
        raise HTTPException(404, "Nie znaleziono rośliny o podanym id")

    # lab 14 - ograniczenie po stronie API - cena
    if data.cena < 1.0:
        raise HTTPException(400,"Cena rośliny nie może być mniejsza niż 1 zł")

    for key, value in data.dict().items():
        setattr(pobrana_roslina, key, value)

    db.commit()
    return pobrana_roslina



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# alembic upgrade head
# uvicorn crud_fastapi:app --reload
# http://127.0.0.1:8000/docs#/