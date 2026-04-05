from flask import Blueprint, request, jsonify
from supabase_client import supabase
from routes.auth import token_requerido, solo_admin

negocios_bp = Blueprint('negocios', __name__)

@negocios_bp.route('/', methods=['GET'])
@token_requerido
def listar_negocios():
    rol = request.usuario.get('rol')
    mensajero_id = request.usuario.get('id')

    if rol == 'administrador':
        resultado = supabase.table('negocios').select('*').execute()
        return jsonify(resultado.data)
    else:
        asignaciones = supabase.table('asignaciones').select('negocio_id').eq('mensajero_id', mensajero_id).eq('activo', True).execute()
        ids = [a['negocio_id'] for a in asignaciones.data]
        if not ids:
            return jsonify([])
        resultado = supabase.table('negocios').select('*').in_('id', ids).execute()
        return jsonify(resultado.data)

@negocios_bp.route('/<uuid:id>', methods=['GET'])
@token_requerido
def obtener_negocio(id):
    resultado = supabase.table('negocios').select('*').eq('id', str(id)).execute()
    if not resultado.data:
        return jsonify({'error': 'Negocio no encontrado'}), 404
    return jsonify(resultado.data[0])

@negocios_bp.route('/', methods=['POST'])
@solo_admin
def crear_negocio():
    data = request.json
    if not data.get('nombre'):
        return jsonify({'error': 'Nombre requerido'}), 400

    nuevo = supabase.table('negocios').insert({
        'nombre': data['nombre'],
        'responsable': data.get('responsable', ''),
        'telefono': data.get('telefono', ''),
        'direccion': data.get('direccion', ''),
        'referencia': data.get('referencia', ''),
        'porcentaje': data.get('porcentaje', 0),
        'latitud': data.get('latitud'),
        'longitud': data.get('longitud'),
        'estado': 'activo'
    }).execute()

    return jsonify({'mensaje': 'Negocio creado', 'id': nuevo.data[0]['id']}), 201

@negocios_bp.route('/<uuid:id>', methods=['PUT'])
@solo_admin
def editar_negocio(id):
    data = request.json
    actualizar = {}

    campos = ['nombre', 'responsable', 'telefono', 'direccion', 'referencia', 'porcentaje', 'latitud', 'longitud', 'estado']
    for campo in campos:
        if campo in data:
            actualizar[campo] = data[campo]

    supabase.table('negocios').update(actualizar).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Negocio actualizado'})

@negocios_bp.route('/<uuid:id>', methods=['DELETE'])
@solo_admin
def desactivar_negocio(id):
    supabase.table('negocios').update({'estado': 'inactivo'}).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Negocio desactivado'})

@negocios_bp.route('/asignar', methods=['POST'])
@solo_admin
def asignar_mensajero():
    data = request.json
    mensajero_id = data.get('mensajero_id')
    negocio_id = data.get('negocio_id')

    if not mensajero_id or not negocio_id:
        return jsonify({'error': 'mensajero_id y negocio_id requeridos'}), 400

    existente = supabase.table('asignaciones').select('id').eq('mensajero_id', mensajero_id).eq('negocio_id', negocio_id).execute()
    if existente.data:
        supabase.table('asignaciones').update({'activo': True}).eq('mensajero_id', mensajero_id).eq('negocio_id', negocio_id).execute()
        return jsonify({'mensaje': 'Asignación reactivada'})

    supabase.table('asignaciones').insert({
        'mensajero_id': mensajero_id,
        'negocio_id': negocio_id,
        'activo': True
    }).execute()

    return jsonify({'mensaje': 'Negocio asignado al mensajero'}), 201

@negocios_bp.route('/desasignar', methods=['POST'])
@solo_admin
def desasignar_mensajero():
    data = request.json
    supabase.table('asignaciones').update({'activo': False}).eq('mensajero_id', data.get('mensajero_id')).eq('negocio_id', data.get('negocio_id')).execute()
    return jsonify({'mensaje': 'Asignación removida'})
