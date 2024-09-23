# Este archivo se usara para configurar la SDK de firebase y para conectar los servicios 
# que se van a utilizar

# Para usar correctamente esto se debe correr el comando ($ pip install firebase-admin)

import firebase_admin
from firebase_admin import credentials, auth, storage

try: 

    # Se cambio la inicializacion a las credenciales
    credencial = credentials.Certificate('./credenciales.json')
    firebase_admin.initialize_app(credencial, {
    'storageBucket': 'turismoeco-598e9.appspot.com'}) 

    # Aca van los servicios de firebase que se van a implementar (Storage, Auth, Firestore)  
    firebase_auth = firebase_admin.auth
    firebase_storage = firebase_admin.storage.bucket()
except Exception:
    print("Ocurrio un error conectando los servicios de firebase firebase en el backend")


