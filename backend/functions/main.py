# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

# Todas las funciones que esten en este archivo seran las que despliegue firebase, importar cualquier
# funcion que se vaya a usar aca
from firebase_functions import https_fn
from firebase_admin import initialize_app

from src.Autenticador.Autenticador import ProbarAuth
from src.Storage.Storage import ProbarStorage

initialize_app()

@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

@https_fn.on_request()
def on_request_example2(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello John!")