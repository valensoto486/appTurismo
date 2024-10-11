from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback
#from requests_toolbelt.multipart import encoder
from flask import make_response
import uuid

from io import BytesIO


# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# [GET] Obtiene los lugares dados un evento en especifico
# Recibe un JSON con el: (municipio)
# Devuelve un form-data con la lista de las ubicaciones y una lista de sus imagenes
@https_fn.on_request()
def BuscarUbicacionesPorMunicipio(request) -> https_fn.Response:
    try:

        # Se comprueba si se recibio el JSON
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        municipio = parametros.get('municipio')

        # Se buscan los lugares filtrandolos por su ubicacion
        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Municipio", "==", municipio)
        lista_lugares = query_validacion.get()

        lista_respuesta = [doc.to_dict() for doc in lista_lugares]
        json_respuesta = json.dumps(lista_respuesta).encode('utf-8')

        # Se obtienen todos los archivos en base a la url
        archivos_storage = []
        
        for document in lista_respuesta:
            url = document.get('URLImagen')
            blob = firebase_storage.blob(url)
            archivo = BytesIO()
            blob.download_to_file(archivo)
            archivo.seek(0)
            archivos_storage.append((url, archivo.read()))

        # Se agrega el json a la respuesta
        #multipart_data = encoder.MultipartEncoder(fields={
        #    'documentos': ('documentos.json', BytesIO(json_respuesta), 'application/json')
        #})

        # Se Añade cada archivo al `multipart_data`
        #for nombre, contenido in archivos_storage:
        #    multipart_data.fields[nombre] = (nombre.split('/')[-1], BytesIO(contenido), 'application/octet-stream')

        # Aqui se transforma en una respuesta form-data, iba a usar una libreria pero functions no
        # quiere importar los paquetes de pip, y no entiendo porque
        boundary = uuid.uuid4().hex
        body = BytesIO()

        # Parte 1: JSON de documentos
        body.write(f'--{boundary}\r\n'.encode())
        body.write(b'Content-Disposition: form-data; name="documentos"; filename="documentos.json"\r\n')
        body.write(b'Content-Type: application/json\r\n\r\n')
        body.write(json_respuesta)
        body.write(b'\r\n')

    # Partes de archivos
        for filename, file_content in archivos_storage:
            body.write(f'--{boundary}\r\n'.encode())
            body.write(f'Content-Disposition: form-data; name="{filename}"; filename="{filename}"\r\n'.encode())
            body.write(b'Content-Type: application/octet-stream\r\n\r\n')
            body.write(file_content)
            body.write(b'\r\n')

    # Cierre del límite
        body.write(f'--{boundary}--\r\n'.encode())

        # Se Configura la respuesta con `multipart/form-data`
        #response = make_response(multipart_data.to_string())
        response = make_response(body.getvalue())
        response.headers['Content-Type'] = f'multipart/form-data; boundary={boundary}'
        #response.headers['Content-Type'] = multipart_data.content_type
        return response


    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda: " + str(e))