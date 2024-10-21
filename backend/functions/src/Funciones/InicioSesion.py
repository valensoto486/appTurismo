from firebase_functions import https_fn

# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo
import os
import sys
import json
import requests
import traceback

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

firebase_auth = firebaseConfig.firebase_auth
firestore_db = firebaseConfig.firestore_db

# [POST] Esta funcion crea un usuario en el autenticador y firestore
# recibe el JSON: (nombre, correo, contrasenia, rol)
@https_fn.on_request()
def CrearUsuario(request) -> https_fn.Response:
    try:

        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        nombre = parametros.get('nombre')
        correo = parametros.get('correo')
        contrasenia = parametros.get('contrasenia')
        rol = parametros.get('rol')

        # Crea el usuario en el autenticador y su informacion lo almacena en una variable
        usuario = firebase_auth.create_user(email=correo, password=contrasenia)

        firebase_auth.set_custom_user_claims(usuario.uid, {'rol': rol})

        # Con el uid del usuario se crea un registro en firestore ligado a ese uid, con los atributos
        # especificados en el JSON nuevo_usuario
        referencia = firestore_db.collection('Usuarios').document(usuario.uid)
        
        nuevo_usuario = {
            "nombre": nombre,
            "rol": rol,
        }

        referencia.set(nuevo_usuario)

        return https_fn.Response("Usuario creado correctamente")
       
    except Exception as e:
        return https_fn.Response("Ocurrio un error creando el usuario: " + str(e))


# [POST] Esta funcion es para autenticar al usuario
# recibe el JSON: (correo, contraseña)
@https_fn.on_request()
def AutenticarUsuario(request) -> https_fn.Response:
    try:

        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()
        # Los parametros son obtenidos y usados en un objeto JSON, que es enviado al autenticador para 
        # validarlos
        correo = parametros.get('correo')
        contrasenia = parametros.get('contrasenia')
        llave_api = 'AIzaSyBT-u7CtZk66Yoe8JL24dmJRZEhVS8K5p8'

        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={llave_api}"
    
        payload = {
            "email": correo,
            "password": contrasenia,
            "returnSecureToken": True
        }
    
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
    
        # Si es exitosa la peticion, obtiene con el uid, el usuario de firestore que esta asociada a el
        if response.status_code == 200:
            data = response.json()
            uid = data['localId']
            jwt = data.get('idToken')

            referencia = firestore_db.collection('Usuarios').document(uid)

            usuario = referencia.get()

            # Se crea un JSON que devuelve el uid del usuario y el rol que este tiene en la aplicacion
            respuesta_json = {
                #'uid': uid,
                #'rol': usuario.to_dict().get("rol")
                'Token': jwt
            }

            return https_fn.Response(json.dumps(respuesta_json), mimetype='application/json')
        else:
            return https_fn.Response('No encontro el usuario')

    except Exception as e:
        
        return https_fn.Response("Ocurrio un error autenticando el usuario. " + str(e) + ": " + 
            traceback.format_exc())