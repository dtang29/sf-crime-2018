from app import db

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
