from sqlalchemy.orm import Session
from model import Roslina
from database import SessionLocal

def dodaj_przykladowe_rosliny():
    przykladowe_rosliny = [
        {"gatunek": "Haworthia attenuata", "cena": 59.99, "dostepnosc": True},
        {"gatunek": "Echinocactus grusonii", "cena": 12.50, "dostepnosc": True},
        {"gatunek": "Opuntia microdasys", "cena": 5.50, "dostepnosc": False},
        {"gatunek": "Chlorophytum comosum", "cena": 13.73, "dostepnosc": True},
        {"gatunek": "Sansevieria trifasciata", "cena": 45.54, "dostepnosc": True},
        {"gatunek": "Monstera deliciosa", "cena": 4.12, "dostepnosc": True},
    ]
    
    db: Session = SessionLocal()
    try:
        for r in przykladowe_rosliny:
            nowa_roslina = Roslina(**r)
            db.add(nowa_roslina)
        db.commit()
        print("== Pomyślnie dodano rośliny do bazy ==")
    except Exception as ex:
        db.rollback()
        print("== Błąd dodawania roślin do bazy:", ex)
    finally:
        db.close()

if __name__ == "__main__":
    dodaj_przykladowe_rosliny()