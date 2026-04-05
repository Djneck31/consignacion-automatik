from flask import Blueprint, request, jsonify
from supabase_client import supabase
from routes.auth import token_requerido, solo_admin
import bcrypt

empleados_bp = Blueprint('empleados', __name__)

@empleados_bp.route('/', methods=['GET'])
@solo_admin
def listar_empleados():
    resultado = supabase.table('empleados').select('id,nombre,telefono,correo,usuario,rol,estado,created_at').execute()
    return jsonify(resultado.data)

@empleados_bp.route('/<uuid:id>', methods=['GET'])
@solo_admin
def obtener_empleado(id):
    resultado = supabase.table('empleados').select('id,nombre,telefono,correo,usuario,rol,estado,created_at').eq('id', str(id)).execute()
    if not resultado.data:
        return jsonify({'error': 'Empleado no encontrado'}), 404
    return jsonify(resultado.data[0])

@empleados_bp.route('/', methods=['POST'])
@solo_admin
def crear_empleado():
    data = request.json
    campos = ['nombre', 'correo', 'usuario', 'password', 'rol']
    for campo in campos:
        if not data.get(campo):
            return jsonify({'error': f'Campo requerido: {campo}'}), 400

    if data['rol'] not in ['administrador', 'mensajero']:
        return jsonify({'error': 'Rol inválido'}), 400

    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    nuevo = supabase.table('empleados').insert({
        'nombre': data['nombre'],
        'telefono': data.get('telefono', ''),
        'correo': data['correo'],
        'usuario': data['usuario'],
        'password_hash': password_hash,
        'rol': data['rol'],
        'estado': 'activo'
    }).execute()

    return jsonify({'mensaje': 'Empleado creado', 'id': nuevo.data[0]['id']}), 201

@empleados_bp.route('/<uuid:id>', methods=['PUT'])
@solo_admin
def editar_empleado(id):
    data = request.json
    actualizar = {}

    if 'nombre' in data: actualizar['nombre'] = data['nombre']
    if 'telefono' in data: actualizar['telefono'] = data['telefono']
    if 'correo' in data: actualizar['correo'] = data['correo']
    if 'rol' in data: actualizar['rol'] = data['rol']
    if 'estado' in data: actualizar['estado'] = data['estado']
    if 'password' in data:
        actualizar['password_hash'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    supabase.table('empleados').update(actualizar).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Empleado actualizado'})

@empleados_bp.route('/<uuid:id>', methods=['DELETE'])
@solo_admin
def desactivar_empleado(id):
    supabase.table('empleados').update({'estado': 'inactivo'}).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Empleado desactivado'})
