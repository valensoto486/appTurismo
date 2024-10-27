# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

# PD: para correr esto se debe instalar
# firebase-admin (firebase)
# requests-toolbelt (solicitudes)

# Todas las funciones que esten en este archivo seran las que despliegue firebase, importar cualquier
# funcion que se vaya a usar aca
from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask_cors import CORS
from flask import Flask

import firebaseConfig
import json

#from src.Autenticador.Autenticador import ProbarAuth
#from src.Storage.Storage import ProbarStorage

app = Flask(__name__)

CORS(app=app, resources={r"/*": {"origins": "https://turismoeco-598e9.web.app"}})

from src.Funciones.InicioSesion import CrearUsuario, AutenticarUsuario
from src.Funciones.Ubicaciones import CrearUbicacion, ModificarUbicacion, EliminarUbicacion
from src.Funciones.Multimedia import SubirContenido, EliminarContenido
from src.Funciones.Eventos import CrearEvento, ModificarEvento, EliminarEvento
from src.Funciones.Busqueda import BuscarUbicacionesPorMunicipio, BuscarComentarios, BuscarContenidoMultimedia
from src.Funciones.Busqueda import BuscarEventos, BuscarEventosInicio
from src.Funciones.Comentarios import CrearComentario, BorrarComentario