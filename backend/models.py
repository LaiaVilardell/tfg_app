from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    surname = db.Column(db.String(150), nullable=False)
    center = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # "patient" or "psychologist"

    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    patient_profile = db.relationship("PatientProfile", backref="user", uselist=False)
    psychologist_profile = db.relationship("PsychologistProfile", backref="user", uselist=False)
    patient_drawings = db.relationship("PatientDrawing", backref="patient")

class PatientProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=True, nullable=False)
    
    # Add more patient-specific fields here
    birthdate = db.Column(db.Date)
    treatment = db.Column(db.String(20))

class PsychologistProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=True, nullable=False)
    
    # Add more psychologist-specific fields here
    specialty = db.Column(db.String(150))

class PatientDrawing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
    # Save the image as base64 or route to an SVG file
    image_data = db.Column(db.Text, nullable=False)  # For base64 or SVG
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    title = db.Column(db.String(100))  # Optional: title of the drawing
    description = db.Column(db.Text)   # Optional: Description of the drawing

    patient = db.relationship("User", backref="drawings")   