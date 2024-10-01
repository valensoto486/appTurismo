from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db

# [POST] Esta funcion se encargara de subir un sitio turistico en base a las indicaciones dadas
# Recibe un JSON con: (Nombre, UUIDDueño, Tipo, Descripcion, Latitud, Longitud)
@https_fn.on_request()
def CrearUbicacion(request) -> https_fn.Response:
    try:
        
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        nombre = parametros.get('nombre')
        dueno = parametros.get('uuiddueno')

        # Validamos que no exista un lugar con el mismo nombre

        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Nombre", "==", nombre)
        res_validacion = query_validacion.get() 

        if res_validacion:
            return https_fn.Response("Ya existe una ubicacion con el nombre: " + nombre)
        
        # Despues de la validacion, se procede a hacer crear el lugar

        tipo = parametros.get('tipo')
        municipio = parametros.get('municipio')
        descripcion = parametros.get('descripcion')
        latidud = float(parametros.get('latitud'))
        longitud = float(parametros.get('longitud'))

        informacion = {
            "Nombre": nombre,
            "Municipio": municipio,
            "Dueño": dueno,
            "Tipo": tipo,
            "Descripcion": descripcion,
            "Latitud": latidud,
            "Longitud": longitud
        }

        nueva_ubicacion = firestore_db.collection('Lugares').document()
        nueva_ubicacion.set(informacion)

        return https_fn.Response("Se creo la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e))


# [POST] Esta funcion se encargara de modificar un sitio turistico en base a las indicaciones dadas
# Recibe un JSON con: (Nombre, UUID, Tipo, Descripcion, Latitud, Longitud)
@https_fn.on_request()
def ModificarUbicacion(request) -> https_fn.Response:
    try:
        
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid = parametros.get('uuid')
        nombre = parametros.get('nombre')

        # Validamos que no exista un lugar con el mismo nombre y diferente UUID

        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Nombre", "==", nombre)
        res_validacion = query_validacion.get() 

        if (res_validacion and res_validacion[0].id != uuid):
            return https_fn.Response("Ya existe una ubicacion con el nombre: " + nombre)
        
        # Despues de la validacion, se procede a hacer modificar el lugar

        tipo = parametros.get('tipo')
        municipio = parametros.get('municipio')
        descripcion = parametros.get('descripcion')
        latidud = float(parametros.get('latitud'))
        longitud = float(parametros.get('longitud'))

        informacion = {
            "Nombre": nombre,
            "Municipio": municipio,
            "Tipo": tipo,
            "Descripcion": descripcion,
            "Latitud": latidud,
            "Longitud": longitud
        }

        nueva_ubicacion = firestore_db.collection('Lugares').document(uuid)
        nueva_ubicacion.update(informacion)

        return https_fn.Response("Se modifico la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e))


# [POST] Esta funcion se encargara de borrar un sitio turistico
# Recibe un JSON con: (UUID)
@https_fn.on_request()
def EliminarUbicacion(request) -> https_fn.Response:
    try:
        
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid = parametros.get('uuid')

        ubicacion = firestore_db.collection('Lugares').document(uuid)
        ubicacion.delete()

        return https_fn.Response("Se elimino la ubicacion correctamente")

    except Exception as e:
        return https_fn.Response("Ocurrio un error borrando la ubicacion: " + str(e))