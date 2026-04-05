from flask import Blueprint, request, jsonify
from supabase_client import supabase
from routes.auth import token_requerido, solo_admin

visitas_bp = Blueprint('visitas', __name__)

@visitas_bp.route('/', methods=['GET'])
@token_requerido
def listar_visitas():
    rol = request.usuario.get('rol')
    mensajero_id = request.usuario.get('id')

    if rol == 'administrador':
        resultado = supabase.table('visitas').select('*, negocios(nombre), empleados(nombre)').order('fecha', desc=True).execute()
    else:
        resultado = supabase.table('visitas').select('*, negocios(nombre), empleados(nombre)').eq('mensajero_id', mensajero_id).order('fecha', desc=True).execute()

    return jsonify(resultado.data)

@visitas_bp.route('/<uuid:id>', methods=['GET'])
@token_requerido
def obtener_visita(id):
    resultado = supabase.table('visitas').select('*, negocios(*), empleados(nombre)').eq('id', str(id)).execute()
    if not resultado.data:
        return jsonify({'error': 'Visita no encontrada'}), 404

    visita = resultado.data[0]
    productos = supabase.table('visita_productos').select('*, productos(*)').eq('visita_id', str(id)).execute()
    evidencias = supabase.table('evidencias').select('*').eq('visita_id', str(id)).execute()

    visita['productos'] = productos.data
    visita['evidencias'] = evidencias.data

    return jsonify(visita)

@visitas_bp.route('/', methods=['POST'])
@token_requerido
def crear_visita():
    data = request.json
    mensajero_id = request.usuario.get('id')

    if not data.get('negocio_id'):
        return jsonify({'error': 'negocio_id requerido'}), 400

    nueva = supabase.table('visitas').insert({
        'negocio_id': data['negocio_id'],
        'mensajero_id': mensajero_id,
        'estado': 'pendiente',
        'dinero_recogido': data.get('dinero_recogido', 0),
        'porcentaje_pagado': data.get('porcentaje_pagado', 0),
        'observaciones': data.get('observaciones', '')
    }).execute()

    visita_id = nueva.data[0]['id']

    if data.get('productos'):
        for p in data['productos']:
            supabase.table('visita_productos').insert({
                'visita_id': visita_id,
                'producto_id': p['producto_id'],
                'cantidad_entregada': p.get('cantidad_entregada', 0),
                'cantidad_retirada': p.get('cantidad_retirada', 0),
                'estado_producto': p.get('estado_producto', 'bueno')
            }).execute()

            if p.get('cantidad_entregada', 0) > 0:
                inv = supabase.table('inventario_negocio').select('id,cantidad_actual').eq('negocio_id', data['negocio_id']).eq('producto_id', p['producto_id']).execute()
                if inv.data:
                    nueva_cantidad = inv.data[0]['cantidad_actual'] + p['cantidad_entregada'] - p.get('cantidad_retirada', 0)
                    supabase.table('inventario_negocio').update({'cantidad_actual': nueva_cantidad}).eq('id', inv.data[0]['id']).execute()

    return jsonify({'mensaje': 'Visita creada', 'id': visita_id}), 201

@visitas_bp.route('/<uuid:id>/estado', methods=['PUT'])
@token_requerido
def actualizar_estado(id):
    data = request.json
    estado = data.get('estado')

    if estado not in ['pendiente', 'visitado', 'no_visitado', 'incidencia']:
        return jsonify({'error': 'Estado inválido'}), 400

    actualizar = {'estado': estado}
    if 'dinero_recogido' in data: actualizar['dinero_recogido'] = data['dinero_recogido']
    if 'porcentaje_pagado' in data: actualizar['porcentaje_pagado'] = data['porcentaje_pagado']
    if 'observaciones' in data: actualizar['observaciones'] = data['observaciones']

    supabase.table('visitas').update(actualizar).eq('id', str(id)).execute()
    return jsonify({'mensaje': 'Visita actualizada'})

@visitas_bp.route('/reporte', methods=['GET'])
@solo_admin
def reporte_visitas():
    desde = request.args.get('desde')
    hasta = request.args.get('hasta')
    mensajero_id = request.args.get('mensajero_id')
    negocio_id = request.args.get('negocio_id')

    query = supabase.table('visitas').select('*, negocios(nombre), empleados(nombre)')

    if desde:
        query = query.gte('fecha', desde)
    if hasta:
        query = query.lte('fecha', hasta)
    if mensajero_id:
        query = query.eq('mensajero_id', mensajero_id)
    if negocio_id:
        query = query.eq('negocio_id', negocio_id)

    resultado = query.order('fecha', desc=True).execute()
    return jsonify(resultado.data)
