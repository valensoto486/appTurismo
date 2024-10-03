from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback
import uuid

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# [POST] este metodo sube un archivo multimedia a firebase
# Recibe un archivo
@https_fn.on_request()
def SubirContenido(request) -> https_fn.Response:
    try:

        # Se valida si el metodo es POST, se manda el archivo o si tiene nombre
        if request.method != 'POST':
            return https_fn.Response("Uso de metodo equivocado")

        if 'file' not in request.files:
            return https_fn.Response("No se mando ningun archivo")

        if 'metadata' not in request.form:
            return https_fn.Response("No se mando el JSON del UUID")

        # Se obtiene el json y el archivo
        metadatos = request.form['metadata']
        archivo = request.files['file']

        if archivo.filename == '':
            return https_fn.Response("El archivo no tiene ningun nombre")

        # Se hace una ubicacion nueva para que todos los archivos sean diferentes
        unique_id = str(uuid.uuid4())
        ubicacion = unique_id + '_' + archivo.filename

        # Se sube el archivo
        blob = firebase_storage.blob(ubicacion)
        blob.upload_from_file(archivo)

        metadatos_json = json.loads(metadatos)

        # Se guarda la referencia en un documento vacio de la ubicacion
        referencia = firestore_db.collection('Lugares').document(metadatos_json['uuid'])
        referencia.collection('Multimedia').document(ubicacion).set({})

        return https_fn.Response("El archivo se subio correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error subiendo el recurso: " + str(e))