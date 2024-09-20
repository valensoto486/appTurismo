from firebase_functions import https_fn

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
def ProbarStorage(req: https_fn.Request) -> https_fn.Response:
    try:
        return https_fn.Response("Hola desde el storage")
    except Exception:
        return https_fn.Response("Se cometio un error en la prueba del storage")