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
from src.Autenticador.Autenticador import AutenticarMetodo

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# REQUIERE DE UN ROL (anfitrion, admin)
# [POST] Esta funcion se encargara de subir un sitio turistico en base a las indicaciones dadas
# Recibe un form-data con un JSON (metadata) con: 
# (nombre, tipo, municipio, descripcion, latitud, longitud)
# Y un archivo jpg o png (file)
@https_fn.on_request()
def CrearUbicacion(request) -> https_fn.Response:
    try:
        
        # Se valida el rol
        dueno = AutenticarMetodo(request=request, roles=['anfitrion', 'admin']) 
        if dueno is None:
            return https_fn.Response("Autorizacion denegada", status=401)

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
        #dueno = metadatos_json['uuiddueno']

        # Validamos que no exista un lugar con el mismo nombre

        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Nombre", "==", nombre)
        res_validacion = query_validacion.get() 

        if res_validacion:
            return https_fn.Response("Ya existe una ubicacion con el nombre: " + nombre)
        

        # Despues de la validacion, se procede a hacer crear el lugar

        tipo = metadatos_json['tipo']
        municipio = metadatos_json['municipio']
        descripcion = metadatos_json['descripcion']
        latidud = float(metadatos_json['latitud'])
        longitud = float(metadatos_json['longitud'])

        informacion = {
            "Nombre": nombre,
            "Municipio": municipio,
            "Dueño": dueno,
            "URLImagen": ubicacion,
            "Tipo": tipo,
            "Descripcion": descripcion,
            "Latitud": latidud,
            "Longitud": longitud
        }

        nueva_ubicacion = firestore_db.collection('Lugares').document()
        nueva_ubicacion.set(informacion)

        # De aqui se guardan la imagen indicada
        blob = firebase_storage.blob(ubicacion)
        blob.upload_from_file(archivo)

        return https_fn.Response("Se creo la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e))


# REQUIERE DE UN ROL (anfitrion, admin)
# [PUT] Esta funcion se encargara de modificar un sitio turistico en base a las indicaciones dadas
# Recibe un form-data con un JSON (metadata) con: (nombre, uuid, tipo, descripcion, latitud, longitud)
# Opcionalmente puede recibir un archivo en jpg o png (file)
@https_fn.on_request()
def ModificarUbicacion(request) -> https_fn.Response:
    try:
        
        # Se valida el rol
        if AutenticarMetodo(request=request, roles=['anfitrion', 'admin']) is None:
            return https_fn.Response("Autorizacion denegada", status=401)

        # Se validan y se obtienen el json

        if 'metadata' not in request.form:
            return https_fn.Response("No se mando el JSONs")
        
        metadatos = request.form['metadata']

        metadatos_json = json.loads(metadatos)

        # Validamos que no exista un lugar con el mismo nombre y diferente UUID

        nombre = metadatos_json['nombre']
        lugar = metadatos_json['uuid']

        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Nombre", "==", nombre)
        res_validacion = query_validacion.get() 

        if (res_validacion and res_validacion[0].id != lugar):
            return https_fn.Response("Ya existe una ubicacion con el nombre: " + nombre)
        
        # Despues de la validacion, se procede a hacer modificar el lugar

        tipo = metadatos_json['tipo']
        municipio = metadatos_json['municipio']
        descripcion = metadatos_json['descripcion']
        latidud = float(metadatos_json['latitud'])
        longitud = float(metadatos_json['longitud'])

        informacion = {
            "Nombre": nombre,
            "Municipio": municipio,
            "Tipo": tipo,
            "Descripcion": descripcion,
            "Latitud": latidud,
            "Longitud": longitud
        }

        nueva_ubicacion = firestore_db.collection('Lugares').document(lugar)

        # Si se envia un archivo este lo reemplaza por el que habia antes
        if 'file' in request.files:

            url = nueva_ubicacion.get().to_dict().get("URLImagen")
            archivo = request.files['file']

            if archivo.filename == '':
                return https_fn.Response("El archivo no tiene ningun nombre")

            extension = archivo.filename.split(".")[1]

            if not (extension == "jpg" or extension == "png"):
                return https_fn.Response("El archivo no tiene la extension adecuada (jpg, png)")


            blob = firebase_storage.blob(url)
            blob.upload_from_file(archivo)

        nueva_ubicacion.update(informacion)

        return https_fn.Response("Se modifico la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e) + traceback.format_exc())

# REQUIERE DE UN ROL (anfitrion, admin)
# [DELETE] Esta funcion se encargara de borrar un sitio turistico
# Recibe un JSON con: (uuid)
@https_fn.on_request()
def EliminarUbicacion(request) -> https_fn.Response:
    try:
        
        # Se validad el rol
        if AutenticarMetodo(request=request, roles=['anfitrion', 'admin']) is None:
            return https_fn.Response("Autorizacion denegada", status=401)

        # Se valida el JSON y se obtiene el uuid
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid = parametros.get('uuid')

        # Se obtiene la ubicacion y la url de su imagen asociada, de ahi se borra
        ubicacion = firestore_db.collection('Lugares').document(uuid)

        url = ubicacion.get().to_dict().get('URLImagen')
        blob = firebase_storage.blob(url)

        blob.delete()
        ubicacion.delete()

        return https_fn.Response("Se elimino la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error borrando la ubicacion: " + str(e))