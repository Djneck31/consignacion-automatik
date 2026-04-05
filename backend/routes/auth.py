from flask import Blueprint, request, jsonify, current_app
from supabase_client import supabase
import jwt
import bcrypt
import datetime

auth_bp = Blueprint('auth', __name__)

def generar_token(empleado):
    payload = {
        'id': str(empleado['id']),
        'usuario': empleado['usuario'],
        'rol': empleado['rol'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')
    return token

def verificar_token(token):
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_requerido(f):
    from functools import wraps
    @wraps(f)
    def decorador(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
        payload = verificar_token(token)
        if not payload:
            return jsonify({'error': 'Token inválido o expirado'}), 401
        request.usuario = payload
        return f(*args, **kwargs)
    return decorador

def solo_admin(f):
    from functools import wraps
    @wraps(f)
    def decorador(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
        payload = verificar_token(token)
        if not payload:
            return jsonify({'error': 'Token inválido o expirado'}), 401
        if payload.get('rol') != 'administrador':
            return jsonify({'error': 'Acceso solo para administradores'}), 403
        request.usuario = payload
        return f(*args, **kwargs)
    return decorador

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    usuario = data.get('usuario')
    password = data.get('password')

    if not usuario or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400

    resultado = supabase.table('empleados').select('*').eq('usuario', usuario).eq('estado', 'activo').execute()

    if not resultado.data:
        return jsonify({'error': 'Usuario no encontrado o inactivo'}), 404

    empleado = resultado.data[0]

    if not bcrypt.checkpw(password.encode('utf-8'), empleado['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Contraseña incorrecta'}), 401

    token = generar_token(empleado)

    return jsonify({
        'token': token,
        'usuario': {
            'id': empleado['id'],
            'nombre': empleado['nombre'],
            'usuario': empleado['usuario'],
            'rol': empleado['rol']
        }
    })

@auth_bp.route('/crear-admin', methods=['POST'])
def crear_admin_inicial():
    existente = supabase.table('empleados').select('id').eq('rol', 'administrador').execute()
    if existente.data:
        return jsonify({'error': 'Ya existe un administrador'}), 400

    data = request.json
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    nuevo = supabase.table('empleados').insert({
        'nombre': data['nombre'],
        'correo': data['correo'],
        'usuario': data['usuario'],
        'password_hash': password_hash,
        'rol': 'administrador',
        'estado': 'activo',
        'telefono': data.get('telefono', '')
    }).execute()

    return jsonify({'mensaje': 'Administrador creado', 'id': nuevo.data[0]['id']}), 201
