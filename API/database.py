from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

connection_string = "mssql+pyodbc://@(localdb)\MSSQLLocalDB/Kwiaciarnia?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
engine = create_engine(connection_string)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
