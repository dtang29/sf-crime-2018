#Import dependencies
import pandas as pd
import os

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, MetaData
from sqlalchemy import Column, Integer, String, Float

# Import and establish Base for which classes will be constructed 
from sqlalchemy.ext.declarative import declarative_base

#Read in the csvs for 2018 crime data
crime_data_2018 = pd.read_csv("Police_Department_Incidents_-_Current_Year__2018_.csv", dtype=object)

#Create a database using engine and call it crimedata.sqlite
engine = create_engine("sqlite:///crimedata.sqlite")

#Create a connection to the engine
conn = engine.connect()

# Use `declarative_base` from SQLAlchemy to model the crime data as an ORM
Base = declarative_base()

class CrimeData2018(Base):
    __tablename__ = 'crimedata2018'
    id = Column(Integer, primary_key=True)
    IncidntNum = Column(Integer)
    Category = Column(String)
    Descript = Column(String)
    DayOfWeek = Column(String)
    Date = Column(String)
    Time = Column(String)
    PdDistrict = Column(String)
    Resolution = Column(String)
    Address = Column(String)
    X = Column(Float)
    Y = Column(Float)
    Location = Column(String)
    PdId = Column(Float)
    
    def __repr__(self):
        return f"id={self.id}, name={self.name}"     

    # def __repr__(self):
    #     return '<CrimeData2018 %r>' % (self.name)   
        
#Create the table in the database
Base.metadata.create_all(engine)


#Use Orient='records' to create a list of data to write
crimedata2018_dict = crime_data_2018.to_dict(orient='records')


#Use MetaData from SQLAlchemy to reflect the table
metadata = MetaData(bind=engine)
metadata.reflect()

#Save the reference to the crimedata2017 table as a variable
crimedata2018 = sqlalchemy.Table('crimedata2018', metadata, autoload=True)


#Insert the crimedata2017 (dictionary format) into  tables
conn.execute(crimedata2018.insert(), crimedata2018_dict)