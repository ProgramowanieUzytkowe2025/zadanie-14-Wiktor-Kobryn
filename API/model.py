from sqlalchemy import Column, Integer, String, Numeric, Boolean
from database import Base

class Roslina(Base):
    __tablename__ = "Rosliny"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    gatunek = Column(String(100), nullable=False)
    cena = Column(Numeric(10, 2), nullable=False)
    dostepnosc = Column(Boolean, nullable=False, default=False)
    
    def __repr__(self):
        return f"<Roslina(id={self.id}, gatunek='{self.gatunek}', cena={self.cena}, dostepnosc={self.dostepnosc})>"
    
    def __str__(self):
        return f"[{self.id}] {self.gatunek}: {self.cena}zł, dostępność: {self.dostepnosc}"
