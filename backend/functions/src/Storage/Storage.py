from firebase_functions import https_fn

import firebase_admin

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

import os
import sys

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

firebase_storage = firebaseConfig.firebase_storage

# Se hizo una funcion de prueba para probar el Storage
@https_fn.on_request()
def ProbarStorage(request) -> https_fn.Response:
    try:
        #Se crea un archivo de prueba txt
        nombre_remoto = request.args.get("remoto")
        ruta = 'archivoPrueba.txt'

        with open(ruta, 'w') as file:
            file.write('Archivo creado correctamente')

        #Se crea un blob donde se metera el archivo, de ahi se remueve el archivo

        blob = firebase_storage.blob(nombre_remoto)
        blob.upload_from_filename(ruta)

        os.remove(ruta)

        return https_fn.Response("Se ha creado el archivo correctamente")
    except Exception as e:
        return https_fn.Response("Se cometio un error en la prueba del storage: " + str(e))