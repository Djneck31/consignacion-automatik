from flask import Blueprint, request, jsonify
from supabase_client import supabase
from routes.auth import token_requerido, solo_admin

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/', methods=['GET'])
@token_requerido
def listar_productos():
    resultado = supabase.table('productos').select('*').execute()
    return jsonify(resultado.data)

@productos_bp.route('/<uuid:id>', methods=['GET'])
@token_requerido
def obtener_producto(id):
    resultado = supabase.table('productos').select('*').eq('id', str(id)).execute()
    if not resultado.data:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return jsonify(resultado.data[0])

@productos_bp.route('/', methods=['POST'])
@solo_admin
def crear_producto():
    data = request.json
    if not data.get('nombre'):
        return jsonify({'error': 'Nombre requerido'}), 400

    nuevo = supabase.table('productos').insert({
        'codigo': data.get('codigo', ''),
        'nombre': data['nombre'],
        'descripcion': data.get('descripcion', ''),
        'categoria': data.get('categoria', ''),
        'precio': data.get('precio', 0),
        'estado': 'activo'
    }).execute()

    return jsonify({'mensaje': 'Producto creado', 'id': nuevo.data[0]['id']}), 201

@productos_bp.route('/<uuid:id>', methods=['PUT'])
@solo_admin
def editar_producto(id):
    data = request.json
    actualizar = {}

    campos = ['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'estado']
    for campo in campos:
        if campo in data:
            actualizar[campo] = data[campo]

    supabase.table('productos').update(actualizar).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Producto actualizado'})

@productos_bp.route('/<uuid:id>', methods=['DELETE'])
@solo_admin
def desactivar_producto(id):
    supabase.table('productos').update({'estado': 'inactivo'}).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Producto desactivado'})

@productos_bp.route('/inventario/<uuid:negocio_id>', methods=['GET'])
@token_requerido
def inventario_negocio(negocio_id):
    resultado = supabase.table('inventario_negocio').select('*, productos(*)').eq('negocio_id', str(negocio_id)).execute()
    return jsonify(resultado.data)

@productos_bp.route('/inventario', methods=['POST'])
@token_requerido
def registrar_inventario():
    data = request.json
    negocio_id = data.get('negocio_id')
    producto_id = data.get('producto_id')

    if not negocio_id or not producto_id:
        return jsonify({'error': 'negocio_id y producto_id requeridos'}), 400

    existente = supabase.table('inventario_negocio').select('id,cantidad_actual').eq('negocio_id', negocio_id).eq('producto_id', producto_id).execute()

    if existente.data:
        actual = existente.data[0]['cantidad_actual']
        nueva = actual + data.get('cantidad_enviada', 0)
        supabase.table('inventario_negocio').update({
            'cantidad_enviada': data.get('cantidad_enviada', 0),
            'cantidad_actual': nueva
        }).eq('id', existente.data[0]['id']).execute()
        return jsonify({'mensaje': 'Inventario actualizado'})

    supabase.table('inventario_negocio').insert({
        'negocio_id': negocio_id,
        'producto_id': producto_id,
        'cantidad_enviada': data.get('cantidad_enviada', 0),
        'cantidad_actual': data.get('cantidad_enviada', 0)
    }).execute()

    return jsonify({'mensaje': 'Inventario registrado'}), 201

