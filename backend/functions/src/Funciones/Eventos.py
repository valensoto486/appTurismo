from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback
import uuid
from datetime import datetime, timedelta

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# [POST] Esta funcion se encarga de crear un evento
# Recibe un format-data con:
# JSON (metadata) que recibe: (nombre, municipio, descripcion, fecha_inicio, fecha_final)
# Un archivo (file)
@https_fn.on_request()
def CrearEvento(request) -> https_fn.Response:
    try:

        # Se validan y se obtienen el json y el archivo
        if 'file' not in request.files:
            return https_fn.Response("No se mando ningun archivo")

        if 'metadata' not in request.form:
            return https_fn.Response("No se mando el JSONs")
        
        metadatos = request.form['metadata']
        archivo = request.files['file']

        metadatos_json = json.loads(metadatos)

        # Se valida si el archivo tiene un nombre y una extension adecuados
        if archivo.filename == '':
            return https_fn.Response("El archivo no tiene ningun nombre")

        extension = archivo.filename.split(".")[1]

        if not (extension == "jpg" or extension == "png"):
            return https_fn.Response("El archivo no tiene la extension adecuada (jpg, png)")
        
        # Se hace una ubicacion nueva para que todos los archivos sean diferentes
        unique_id = str(uuid.uuid4())
        ubicacion = unique_id + '_' + archivo.filename

        nombre = metadatos_json['nombre']

        # Validamos que no exista un lugar con el mismo nombre

        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Nombre", "==", nombre)
        res_validacion = query_validacion.get() 

        if res_validacion:
            return https_fn.Response("Ya existe una ubicacion con el nombre: " + nombre)
        
        # Despues de la validacion, se procede a hacer crear el lugar

        municipio = metadatos_json['municipio']
        descripcion = metadatos_json['descripcion']
        fecha_inicio = datetime.strptime(metadatos_json['fecha_inicio'], '%m/%d/%y %H:%M:%S')
        fecha_final = datetime.strptime(metadatos_json['fecha_final'], '%m/%d/%y %H:%M:%S')

        fecha_inicio_utc5 = fecha_inicio + timedelta(hours=5)
        fecha_final_utc5 = fecha_final + timedelta(hours=5)

        if(fecha_inicio > fecha_final):
            return https_fn.Response("La fecha final es menor a la fecha inicial")

        informacion = {
            "Nombre": nombre,
            "Municipio": municipio,
            "URLImagen": ubicacion,
            "Descripcion": descripcion,
            "Comienza": fecha_inicio_utc5,
            "Termina": fecha_final_utc5
        }

        nueva_ubicacion = firestore_db.collection('Eventos').document()
        nueva_ubicacion.set(informacion)

        # De aqui se guardan la imagen indicada
        blob = firebase_storage.blob(ubicacion)
        blob.upload_from_file(archivo)

        return https_fn.Response("Se creo el evento correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e))