# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

# Todas las funciones que esten en este archivo seran las que despliegue firebase, importar cualquier
# funcion que se vaya a usar aca
from firebase_functions import https_fn
from firebase_admin import initialize_app

import firebaseConfig
import json

from src.Autenticador.Autenticador import ProbarAuth
from src.Storage.Storage import ProbarStorage

from src.Funciones.InicioSesion import CrearUsuario, AutenticarUsuario
from src.Funciones.Ubicaciones import CrearUbicacion, ModificarUbicacion


@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

@https_fn.on_request()
def on_request_param(request) -> https_fn.Response:
    nombre = request.args.get("nombre")
    return https_fn.Response("Hello " + nombre)

@https_fn.on_request()
def on_request_json(request) -> https_fn.Response:

    if request.is_json:
        parametros = request.get_json()
    else:
        return https_fn.Response('No hay JSON')

    nombre = parametros.get('Nombre', 'NADA')

    respuesta_json = {
                "mensaje": "Hola" + nombre,
                "prueba": "hola"
            }

    return https_fn.Response(json.dumps(respuesta_json), mimetype='application/json')