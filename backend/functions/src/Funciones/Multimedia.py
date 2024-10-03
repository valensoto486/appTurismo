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
# Recibe un archivo file que sea: (jpg, png, mp4) y un json conocido como metadata con: (uuid Lugar)
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

        # Se valida que el archivo tenga nombre y que sea de la extension adecuada
        if archivo.filename == '':
            return https_fn.Response("El archivo no tiene ningun nombre")

        extension = archivo.filename.split(".")[1]

        if not (extension == "jpg" or extension == "png" or extension == "mp4"):
            return https_fn.Response("El archivo no tiene la extension adecuada (jpg, png, mp4)")

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


# [DELETE] este borra un archivo del storage
# Recibe un JSON: (uuid_lugar, uuid_recurso)
@https_fn.on_request()
def EliminarContenido(request) -> https_fn.Response:
    try:
        # Se revisa y obtienen los campos del JSON
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid_lugar = parametros.get('uuid_lugar')
        uuid_recurso = parametros.get('uuid_recurso')

        # Se obtienen las referencias del lugar y del archivo multimedia
        lugar = firestore_db.collection('Lugares').document(uuid_lugar)
        referencia = lugar.collection('Multimedia').document(uuid_recurso)

        blob = firebase_storage.blob(uuid_recurso)
        
        # Se borra el archivo en storage y su url en firestore
        referencia.delete()
        blob.delete()

        return https_fn.Response('El archivo se borro correctamente')

    except Exception as e:
        return https_fn.Response("Ocurrio un error subiendo el recurso: " + str(e))