###########################
# Dependencies
###########################
#Set up Flask (Server)
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect,
    url_for)

#SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc, select
from flask_sqlalchemy import SQLAlchemy

import pandas as pd, json
import numpy as np
import os

###########################
# Convert Json to GeoJson
###########################
# def df_to_geojson(df, properties, lat='Y', lon='X'):

# # create a new python dict to contain our geojson data, using geojson format
#     geojson = {'type':'FeatureCollection', 'features':[]}

#     # loop through each row in the dataframe and convert each row to geojson format
#     for _, row in df.iterrows():
#         # create a feature template to fill in
#         feature = {'type':'Feature',
#                 'properties':{},
#                 'geometry':{'type':'Point',
#                             'coordinates':[]}}

#         # fill in the coordinates
#         feature['geometry']['coordinates'] = [row[lon],row[lat]]

#         # for each column, get the value and add it as a new feature property
#         for prop in properties:
#             feature['properties'][prop] = row[prop]
        
#         # add this feature (aka, converted dataframe row) to the list of features inside our dict
#         geojson['features'].append(feature)
    
#     return geojson


###########################
# Flask Setup
###########################
#create the engine with sqlite
app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/crimedata.sqlite" 

# engine = create_engine("sqlite:///db/crimedata.sqlite")

# # reflect an existing database into a new model
# Base = automap_base()

# # reflect the tables
# Base.prepare(engine, reflect=True)

# Crime2017 = Base.classes.crimedata2017
# CrimeData2018 = Base.classes.crimedata2018
db = SQLAlchemy(app)

class CrimeData2018(db.Model):
    __tablename__ = 'crimedata2018'

    id = db.Column(db.Integer, primary_key=True)
    IncidntNum = db.Column(db.Integer)
    Category = db.Column(db.String)
    Descript = db.Column(db.String)
    DayOfWeek = db.Column(db.String)
    Date = db.Column(db.String)
    Time = db.Column(db.String)
    PdDistrict = db.Column(db.String)
    Resolution = db.Column(db.String)
    Address = db.Column(db.String)
    X = db.Column(db.Float)
    Y = db.Column(db.Float)
    Location = db.Column(db.String)
    PdId = db.Column(db.Float)
    
    
    def __repr__(self):
        return '<CrimeData2018 %r>' % (self.name) 


#################################################
# Database Setup
#################################################

#db = SQLAlchemy(app)
#session = Session(engine)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/mapbox/dark")
def sfmapboxdark():
    json_data = os.path.join(app.static_folder, 'style.json')
    with open(json_data) as blog_file:
        data = json.load(blog_file)
        return jsonify(data)

@app.route("/api/crimedata/sfgrid")
def sfgrid():
    json_data = os.path.join(app.static_folder, 'sfneighborhoods.geojson')
    with open(json_data) as blog_file:
        data = json.load(blog_file)
        return jsonify(data)

@app.route("/api/crimedata/sfBARTstations")
def sfBARTstations():
    json_data = os.path.join(app.static_folder, 'sfBARTStations.geojson')
    with open(json_data) as blog_file:
        data = json.load(blog_file)
        return jsonify(data)

@app.route("/api/crimedata/sfBARTlines")
def sfBARTlines():
    json_data = os.path.join(app.static_folder, 'sfBARTLines.geojson')
    with open(json_data) as blog_file:
        data = json.load(blog_file)
        return jsonify(data)

@app.route("/api/crimedata/2018/theft")
def crimedata2018theft():
   
    #Grab all the columns we need and create a list
    sel2018 = [CrimeData2018.IncidntNum,
        CrimeData2018.Category,
        CrimeData2018.Descript,
        CrimeData2018.DayOfWeek,
        CrimeData2018.Date,
        CrimeData2018.Time,
        CrimeData2018.PdDistrict,
        CrimeData2018.Resolution,
        CrimeData2018.Address,
        CrimeData2018.X,
        CrimeData2018.Y]    

    results2018 = db.session.query(*sel2018).\
        filter(CrimeData2018.Category == "LARCENY/THEFT").all()
        
    #Store results into a dataframe
    df = pd.DataFrame(results2018, columns=['IncidntNum','Category','Descript',
                                        'DayOfWeek', 'Date', 'Time', 'PdDistrict',
                                        'Resolution', 'Address', 'X', 'Y'])

    #Return the dataframe in json format
    return jsonify(df.to_dict(orient="records"))    
    

##Assault End Point    
@app.route("/api/crimedata/2018/assault")
def crimedata2018assault():
   
    #Grab all the columns we need and create a list
    sel2018 = [CrimeData2018.IncidntNum,
        CrimeData2018.Category,
        CrimeData2018.Descript,
        CrimeData2018.DayOfWeek,
        CrimeData2018.Date,
        CrimeData2018.Time,
        CrimeData2018.PdDistrict,
        CrimeData2018.Resolution,
        CrimeData2018.Address,
        CrimeData2018.X,
        CrimeData2018.Y]    

    results2018 = db.session.query(*sel2018).\
        filter(CrimeData2018.Category == "ASSAULT").all()
        
    #Store results into a dataframe
    df = pd.DataFrame(results2018, columns=['IncidntNum','Category','Descript',
                                        'DayOfWeek', 'Date', 'Time', 'PdDistrict',
                                        'Resolution', 'Address', 'X', 'Y'])

    #Return the dataframe in json format
    return jsonify(df.to_dict(orient="records"))    

 #Assault End Point    
@app.route("/api/crimedata/2018/vandalism")
def crimedata2018vandalism():
   
    #Grab all the columns we need and create a list
    sel2018 = [CrimeData2018.IncidntNum,
        CrimeData2018.Category,
        CrimeData2018.Descript,
        CrimeData2018.DayOfWeek,
        CrimeData2018.Date,
        CrimeData2018.Time,
        CrimeData2018.PdDistrict,
        CrimeData2018.Resolution,
        CrimeData2018.Address,
        CrimeData2018.X,
        CrimeData2018.Y]    

    results2018 = db.session.query(*sel2018).\
        filter(CrimeData2018.Category == "VANDALISM").all()
        
    #Store results into a dataframe
    df = pd.DataFrame(results2018, columns=['IncidntNum','Category','Descript',
                                        'DayOfWeek', 'Date', 'Time', 'PdDistrict',
                                        'Resolution', 'Address', 'X', 'Y'])

    #Return the dataframe in json format
    return jsonify(df.to_dict(orient="records"))    

if __name__ == "__main__":
    app.run(debug=True)