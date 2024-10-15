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

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# [POST] Crea un comentario de una ubicacion turistica
# Recibe un JSON con: (uuid_usuario, uuid_ubicacion, contenido, calificacion, ind1, ind2, ind3, ind4)
@https_fn.on_request()
def CrearComentario(request) -> https_fn.Response:
    try:
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid_usuario = parametros.get('uuid_usuario')
        uuid_ubicacion = parametros.get('uuid_ubicacion')
        contenido = parametros.get('contenido')
        calificacion = int(parametros.get('calificacion'))
        ind1 = int(parametros.get('ind1'))
        ind2 = int(parametros.get('ind2'))
        ind3 = int(parametros.get('ind3'))
        ind4 = int(parametros.get('ind4'))

        ubicacion = firestore_db.collection('Lugares').document(uuid_ubicacion)
        nuevo_comentario = ubicacion.collection('Comentarios').document()

        usuario = firestore_db.collection('Usuarios').document(uuid_usuario)
        nombre = usuario.get().to_dict().get('nombre')

        nuevo_usuario = {
            "Nombre": nombre,
            "Contenido": contenido,
            'Calificacion': calificacion,
            'Ind1': ind1,
            'Ind2': ind2,
            'Ind3': ind3,
            'Ind4': ind4,
            'Fecha': datetime.now()
        }

        nuevo_comentario.set(nuevo_usuario)

        return https_fn.Response("Comentario creado correctamente")

        
    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el comentario: " + str(e))