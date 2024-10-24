# Este archivo se usara para configurar la SDK de firebase y para conectar los servicios 
# que se van a utilizar

# Para usar correctamente esto se debe coerrer el comando ($ pip install firebase-admin)

import firebase_admin
from firebase_admin import credentials

# Se configura la credenciales con un archivo JSON generado en el proyecto de firebase

try:   
    credencial = credentials.Certificate("./credenciales.json")
    firebase_admin.initialize_app(credencial)

    # Aca van los servicios de firebase que se van a implementar (Storage, Auth, Firestore)    
except Exception:
    print("Ocurrio un error conectando firebase en el backend")


