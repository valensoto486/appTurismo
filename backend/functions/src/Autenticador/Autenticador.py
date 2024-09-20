from firebase_functions import https_fn

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo
import os
import sys

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

firebase_auth = firebaseConfig.firebase_auth

# Se hizo una funcion de prueba para probar el autenticador de firebase
@https_fn.on_request()
def ProbarAuth(req: https_fn.Request) -> https_fn.Response:
    try:
        #firebase_auth.create_user(email="John", password="12345678")
        return https_fn.Response("Hola desde el autenticador")
    except Exception:
        return https_fn.Response("Se cometio un error en la prueba del autenticador")