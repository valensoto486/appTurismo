from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback
from datetime import datetime

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig
from src.Autenticador.Autenticador import AutenticarMetodo

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# SE REQUIERE AUTENTICACION (turista)
# [POST] Crea un comentario de una ubicacion turistica
# Recibe un JSON con: (uuid_ubicacion, contenido, calificacion, 
# gestion_residuos, cuidado_ambiente, movilidad_sostenible, cultura_local)
@https_fn.on_request()
def CrearComentario(request) -> https_fn.Response:
    try:

        # Se autoriza si el usuario tiene el rol adecuado
        uuid_usuario = AutenticarMetodo(request=request, roles=['turista']) 
        if uuid_usuario is None:
            return https_fn.Response("Autorizacion denegada", status=401)

        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        #uuid_usuario = parametros.get('uuid_usuario')
        uuid_ubicacion = parametros.get('uuid_ubicacion')
        contenido = parametros.get('contenido')
        calificacion = int(parametros.get('calificacion'))
        indicador_gr = int(parametros.get('gestion_residuos'))
        indicador_ca = int(parametros.get('cuidado_ambiente'))
        indicador_ms = int(parametros.get('movilidad_sostenible'))
        indicador_cl = int(parametros.get('cultura_local'))

        ubicacion = firestore_db.collection('Lugares').document(uuid_ubicacion)
        nuevo_comentario = ubicacion.collection('Comentarios').document()

        usuario = firestore_db.collection('Usuarios').document(uuid_usuario)
        nombre = usuario.get().to_dict().get('nombre')

        nuevo_usuario = {
            "Nombre": nombre,
            "Contenido": contenido,
            'Calificacion': calificacion,
            'Gestion de Residuos': indicador_gr,
            'Cuidado del Medio Ambiente': indicador_ca,
            'Movilidad sostenible': indicador_ms,
            'Cultura local': indicador_cl,
            'Fecha': datetime.now()
        }

        nuevo_comentario.set(nuevo_usuario)

        return https_fn.Response("Comentario creado correctamente")

        
    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el comentario: " + str(e))

# SE REQUIERE AUTENTICACION (turista)    
# [DELETE] Borra un comentario de una ubicacion turistica
# Recibe un JSON con: (uuid_comentario, uuid_ubicacion)
@https_fn.on_request()
def BorrarComentario(request) -> https_fn.Response:
    try:

        # Se autoriza si el usuario tiene el rol adecuado
        if AutenticarMetodo(request=request, roles=['turista']) is None:
            return https_fn.Response("Autorizacion denegada", status=401)

        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid_comentario = parametros.get('uuid_comentario')
        uuid_ubicacion = parametros.get('uuid_ubicacion')

        ubicacion = firestore_db.collection('Lugares').document(uuid_ubicacion)
        comentario = ubicacion.collection('Comentarios').document(uuid_comentario)

        comentario.delete()
        return https_fn.Response("Comentario borrado correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error borrando el comentario: " + str(e))