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
def ProbarAuth(request) -> https_fn.Response:
    try:
        email = request.args.get("email")
        password = request.args.get("password")
        firebase_auth.create_user(email=email, password=password)
        return https_fn.Response("Se creo el usuario")
    except Exception as e:
        return https_fn.Response("Ocurrio un error en la autenticacion " + str(e))