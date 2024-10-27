from firebase_functions import https_fn
from firebase_admin import auth

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo
import os
import sys
import traceback

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
    

# Esta es una funcion para comprobar la autenticacion de los metodos
# Recibe el request de una funcion y los roles que pueden acceder a la funcion
# Devuelve el UID del usuario o devuelve None si no lo hace
def AutenticarMetodo(request, roles):
    try:
        autorizacion = request.headers.get('Authorization')

        if autorizacion is None:
            return None

        id_token = autorizacion.split('Bearer ')[1]

        decoded_token = firebase_auth.verify_id_token(id_token)
        rol_usuario = decoded_token.get('rol', None)
        uid = decoded_token['uid']


        if roles == '':
            return "Autorizacion concedida"
        if (rol_usuario in roles):
            # Usuario autorizado para acceder a la función
            return uid
        else:
            # Usuario no autorizado
            return None

    except Exception as e:
        #raise Exception('Ocurrio un error en la autenticacion ' + str(e))
        return None