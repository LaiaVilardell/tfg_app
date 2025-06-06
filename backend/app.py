from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt)
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from models import db, User
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'tfg_secret'
db.init_app(app)

jwt = JWTManager(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    center = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)  # optional if unused
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient' or 'psychologist'
    
"""Run this only once to recreate your DB (if you're starting fresh)
with app.app_context():
    db.drop_all()
    db.create_all()"""

# Create database
with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    surname = data.get('surname')
    center = data.get('center')
    phone = data.get('phone')  # optional
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([name, surname, center, email, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    if role not in ['patient', 'psychologist']:
        return jsonify({'error': 'Invalid role'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409

    hashed_password = generate_password_hash(password)
    user = User(
        name=name,
        surname=surname,
        center=center,
        phone=phone,
        email=email,
        password=hashed_password,
        role=role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    additional_claims = {'role': user.role}
    access_token = create_access_token(identity=user.id, additional_claims=additional_claims)

    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    })

# Role-based decorator
def role_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorated(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') not in allowed_roles:
                return jsonify({'error': 'Unauthorized access'}), 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper

# Protected dashboards
@app.route('/dashboard/patient')
@role_required(['patient']) # Endpoint for patients
def patient_dashboard():
    return jsonify({'message': 'Welcome to the Patient dashboard'})

@app.route('/dashboard/psychologist')
@role_required(['psychologist'])
def psychologist_dashboard():
    return jsonify({'message': 'Welcome to the Psychologist dashboard'})

@app.route('/dashboard/patient/drawscreen')
@role_required(['patient'])
def DrawScreen():
    return jsonify({'message': 'Draw from scratch'})

@app.route('/dashboard/patient/avatar')
@role_required(['patient'])
def AvatarScreen():
    return jsonify({'message': 'Start with existing avatar'})

# Run server
if __name__ == '__main__':
    app.run(debug=True)
