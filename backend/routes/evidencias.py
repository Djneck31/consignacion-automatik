from flask import Blueprint, request, jsonify
from supabase_client import supabase
from routes.auth import token_requerido, solo_admin
import base64
import uuid

evidencias_bp = Blueprint('evidencias', __name__)

@evidencias_bp.route('/', methods=['POST'])
@token_requerido
def subir_evidencia():
    data = request.json
    mensajero_id = request.usuario.get('id')

    visita_id = data.get('visita_id')
    negocio_id = data.get('negocio_id')
    imagen_base64 = data.get('imagen_base64')
    tipo = data.get('tipo', 'vitrina')
    nota = data.get('nota', '')

    if not visita_id or not negocio_id or not imagen_base64:
        return jsonify({'error': 'visita_id, negocio_id e imagen_base64 requeridos'}), 400

    if tipo not in ['vitrina', 'producto_dañado', 'cobro', 'otro']:
        return jsonify({'error': 'Tipo inválido'}), 400

    imagen_bytes = base64.b64decode(imagen_base64)
    nombre_archivo = f"{visita_id}_{uuid.uuid4()}.jpg"

    bucket = supabase.storage.from_('evidencias')
    bucket.upload(nombre_archivo, imagen_bytes, {'content-type': 'image/jpeg'})
    url_foto = bucket.get_public_url(nombre_archivo)

    resultado = supabase.table('evidencias').insert({
        'visita_id': visita_id,
        'negocio_id': negocio_id,
        'mensajero_id': mensajero_id,
        'url_foto': url_foto,
        'tipo': tipo,
        'nota': nota
    }).execute()

    return jsonify({'mensaje': 'Evidencia subida', 'url': url_foto, 'id': resultado.data[0]['id']}), 201

@evidencias_bp.route('/visita/<uuid:visita_id>', methods=['GET'])
@token_requerido
def evidencias_por_visita(visita_id):
    resultado = supabase.table('evidencias').select('*').eq('visita_id', str(visita_id)).execute()
    return jsonify(resultado.data)

@evidencias_bp.route('/negocio/<uuid:negocio_id>', methods=['GET'])
@solo_admin
def evidencias_por_negocio(negocio_id):
    resultado = supabase.table('evidencias').select('*').eq('negocio_id', str(negocio_id)).order('fecha', desc=True).execute()
    return jsonify(resultado.data)
