from firebase_functions import https_fn

import os
import sys
import json
import requests
import traceback
from flask import make_response, jsonify
import uuid
from datetime import datetime
import statistics

from io import BytesIO


# Se tiene que mapear la ruta relativa para importar firebaseConfig
# Se obtiene la ruta de este archivo, luego se devuelve dos carpetas y finalmente se accede al archivo

ruta_archivo = os.path.dirname( __file__ )
ruta_config = os.path.join( ruta_archivo, '..', '..')
sys.path.append( ruta_config )
import firebaseConfig

# Se traen los servicios que son necesarios

firestore_db = firebaseConfig.firestore_db
firebase_storage = firebaseConfig.firebase_storage

# [GET] Obtiene los lugares dados un evento en especifico
# Recibe un JSON con el: (municipio)
# Devuelve un form-data con la lista de las ubicaciones y una lista de contenido
@https_fn.on_request()
def BuscarUbicacionesPorMunicipio(request) -> https_fn.Response:
    try:

        # Se comprueba si se recibio el JSON
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        municipio = parametros.get('municipio')

        # Se buscan los lugares filtrandolos por su ubicacion
        lugares_ref = firestore_db.collection("Lugares")

        query_validacion = lugares_ref.where("Municipio", "==", municipio)
        lista_lugares = query_validacion.get()

        lista_respuesta = []

        # Se obtienen las calificaciones promedio de estos lugares

        for doc in lista_lugares:
            
            lugar = doc.to_dict()
            lugar['Id'] = doc.id

            lugar_ref = firestore_db.collection("Lugares").document(lugar['Id'])
            comentarios = lugar_ref.collection('Comentarios').get()

            valores_cal = []

            for comentario in comentarios:
                objeto = comentario.to_dict()
                valores_cal.append(objeto['Calificacion'])

            if(len(valores_cal) != 0):
                calificacion_prom = statistics.mean(valores_cal)
                lugar['Calificacion'] = calificacion_prom
                valores_cal.clear()
            else:
                lugar['Calificacion'] = 0


            for comentario in comentarios:
                objeto = comentario.to_dict()
                valores_cal.append(objeto['Cuidado del Medio Ambiente'])

            if(len(valores_cal) != 0):
                calificacion_prom = statistics.mean(valores_cal)
                lugar['Cuidado del Medio Ambiente'] = calificacion_prom
                valores_cal.clear()
            else:
                lugar['Cuidado del Medio Ambiente'] = 0
            

            for comentario in comentarios:
                objeto = comentario.to_dict()
                valores_cal.append(objeto['Gestion de Residuos'])

            if(len(valores_cal) != 0):
                calificacion_prom = statistics.mean(valores_cal)
                lugar['Gestion de Residuos'] = calificacion_prom
                valores_cal.clear()
            else:
                lugar['Gestion de Residuos'] = 0


            for comentario in comentarios:
                objeto = comentario.to_dict()
                valores_cal.append(objeto['Movilidad sostenible'])

            if(len(valores_cal) != 0):
                calificacion_prom = statistics.mean(valores_cal)
                lugar['Movilidad sostenible'] = calificacion_prom
                valores_cal.clear()
            else:
                lugar['Movilidad sostenible'] = 0


            for comentario in comentarios:
                objeto = comentario.to_dict()
                valores_cal.append(objeto['Cultura local'])

            if(len(valores_cal) != 0):
                calificacion_prom = statistics.mean(valores_cal)
                lugar['Cultura local'] = calificacion_prom
                valores_cal.clear()
            else:
                lugar['Cultura local'] = 0
                

            lista_respuesta.append(lugar)


        json_respuesta = json.dumps(lista_respuesta).encode('utf-8')

        # Se obtienen todos los archivos en base a la url
        archivos_storage = []
        
        for document in lista_respuesta:
            url = document.get('URLImagen')
            blob = firebase_storage.blob(url)
            archivo = BytesIO()
            blob.download_to_file(archivo)
            archivo.seek(0)
            archivos_storage.append((url, archivo.read()))

        # Se agrega el json a la respuesta
        #multipart_data = encoder.MultipartEncoder(fields={
        #    'documentos': ('documentos.json', BytesIO(json_respuesta), 'application/json')
        #})

        # Se Añade cada archivo al `multipart_data`
        #for nombre, contenido in archivos_storage:
        #    multipart_data.fields[nombre] = (nombre.split('/')[-1], BytesIO(contenido), 'application/octet-stream')

        # Aqui se transforma en una respuesta form-data, iba a usar una libreria pero functions no
        # quiere importar los paquetes de pip, y no entiendo porque
        boundary = uuid.uuid4().hex
        body = BytesIO()

        # Parte 1: JSON de documentos
        body.write(f'--{boundary}\r\n'.encode())
        body.write(b'Content-Disposition: form-data; name="documentos"; filename="documentos.json"\r\n')
        body.write(b'Content-Type: application/json\r\n\r\n')
        body.write(json_respuesta)
        body.write(b'\r\n')

        # Partes de archivos
        for filename, file_content in archivos_storage:
            body.write(f'--{boundary}\r\n'.encode())
            body.write(f'Content-Disposition: form-data; name="{filename}"; filename="{filename}"\r\n'.encode())
            body.write(b'Content-Type: application/octet-stream\r\n\r\n')
            body.write(file_content)
            body.write(b'\r\n')

        # Cierre del límite
        body.write(f'--{boundary}--\r\n'.encode())

        # Se Configura la respuesta con `multipart/form-data`
        #response = make_response(multipart_data.to_string())
        response = make_response(body.getvalue())
        response.headers['Content-Type'] = f'multipart/form-data; boundary={boundary}'
        #response.headers['Content-Type'] = multipart_data.content_type
        return response


    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda: " + str(e))


# [GET] Obtiene 4 eventos basados en cuales son los mas recientes
# Recibe un JSON con el: (municipio)
# Devuelve un form-data con la lista de las ubicaciones y una lista de contenido
@https_fn.on_request()
def BuscarEventosInicio(request) -> https_fn.Response:
    try:

        ref_eventos = firestore_db.collection('Eventos')
        eventos = ref_eventos.stream()
        lista_eventos = []

        for doc in eventos:
            evento = doc.to_dict()
            evento['Id'] = doc.id
            lista_eventos.append(evento)

        eventos_ordenados = []

        # Se ordenan los eventos para sacar los 4 que empiezen antes
        for doc in lista_eventos:
            fecha = doc.get('Comienza').replace(tzinfo=None)
            termino = doc.get('Termina').replace(tzinfo=None)

            # Si hay menos de 4 eventos entonces se agrega el evento
            if len(eventos_ordenados) < 4 and termino > datetime.now().replace(tzinfo=None):

                eventos_ordenados.append(doc)
                continue
            
            # Se ordenan por el campo de fecha
            eventos_ordenados = sorted(
                eventos_ordenados, 
                key=lambda x: datetime.strptime(x['Comienza'].strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S"),
                reverse=True
            )

            # Si el evento actual tiene una fecha de inicio menor a la fecha mas tardia, entonces lo
            # reemplaza
            if(fecha < eventos_ordenados[0]['Comienza'].replace(tzinfo=None)):

                eventos_ordenados[0] = doc

        for evento in eventos_ordenados:
            evento['Comienza'] = evento['Comienza'].strftime('%Y-%m-%d %H:%M:%S')
            evento['Termina'] = evento['Termina'].strftime('%Y-%m-%d %H:%M:%S')

        json_respuesta = json.dumps(eventos_ordenados).encode('utf-8')

        # Se obtienen todos los archivos en base a la url
        archivos_storage = []
        
        for document in eventos_ordenados:
            url = document.get('URLImagen')
            blob = firebase_storage.blob(url)
            archivo = BytesIO()
            blob.download_to_file(archivo)
            archivo.seek(0)
            archivos_storage.append((url, archivo.read()))

        boundary = uuid.uuid4().hex
        body = BytesIO()

        # Parte 1: JSON de documentos
        body.write(f'--{boundary}\r\n'.encode())
        body.write(b'Content-Disposition: form-data; name="documentos"; filename="documentos.json"\r\n')
        body.write(b'Content-Type: application/json\r\n\r\n')
        body.write(json_respuesta)
        body.write(b'\r\n')

        # Partes de archivos
        for filename, file_content in archivos_storage:
            body.write(f'--{boundary}\r\n'.encode())
            body.write(f'Content-Disposition: form-data; name="{filename}"; filename="{filename}"\r\n'.encode())
            body.write(b'Content-Type: application/octet-stream\r\n\r\n')
            body.write(file_content)
            body.write(b'\r\n')

        # Cierre del límite
        body.write(f'--{boundary}--\r\n'.encode())

        # Se Configura la respuesta con `multipart/form-data`
        response = make_response(body.getvalue())
        response.headers['Content-Type'] = f'multipart/form-data; boundary={boundary}'
        return response

    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda de los eventos: " + str(e) + traceback.format_exc()) 


# [GET] Obtiene los eventos basados en cuales son los mas recientes
# Devuelve un form-data con un JSON de la lista de los y una lista de sus imagenes
@https_fn.on_request()
def BuscarEventos(request) -> https_fn.Response:
    try:

        ref_eventos = firestore_db.collection('Eventos')
        eventos = ref_eventos.stream()

        lista_eventos = []

        for doc in eventos:

            evento = doc.to_dict()
            evento['Id'] = doc.id
            termina = evento.get('Termina').replace(tzinfo=None)

            if termina <= datetime.now().replace(tzinfo=None):
                continue

            evento['Comienza'] = evento['Comienza'].strftime('%Y-%m-%d %H:%M:%S')
            evento['Termina'] = evento['Termina'].strftime('%Y-%m-%d %H:%M:%S')
            lista_eventos.append(evento)       

        json_respuesta = json.dumps(lista_eventos).encode('utf-8')

        # Se obtienen todos los archivos en base a la url
        archivos_storage = []
        
        for document in lista_eventos:
            url = document.get('URLImagen')
            blob = firebase_storage.blob(url)
            archivo = BytesIO()
            blob.download_to_file(archivo)
            archivo.seek(0)
            archivos_storage.append((url, archivo.read()))

        boundary = uuid.uuid4().hex
        body = BytesIO()

        # Parte 1: JSON de documentos
        body.write(f'--{boundary}\r\n'.encode())
        body.write(b'Content-Disposition: form-data; name="documentos"; filename="documentos.json"\r\n')
        body.write(b'Content-Type: application/json\r\n\r\n')
        body.write(json_respuesta)
        body.write(b'\r\n')

        # Partes de archivos
        for filename, file_content in archivos_storage:
            body.write(f'--{boundary}\r\n'.encode())
            body.write(f'Content-Disposition: form-data; name="{filename}"; filename="{filename}"\r\n'.encode())
            body.write(b'Content-Type: application/octet-stream\r\n\r\n')
            body.write(file_content)
            body.write(b'\r\n')

        # Cierre del límite
        body.write(f'--{boundary}--\r\n'.encode())

        # Se Configura la respuesta con `multipart/form-data`
        response = make_response(body.getvalue())
        response.headers['Content-Type'] = f'multipart/form-data; boundary={boundary}'
        return response

    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda de los eventos: " + str(e)) 

# [GET] Obtiene los comentarios de una ubicacion
# Recibe un JSON con el: (uuid_ubicacion)
# Devuelve un form-data con la lista de multimedia
@https_fn.on_request()
def BuscarContenidoMultimedia(request) -> https_fn.Response:
    try:

        # Se comprueba si se recibio el JSON
        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid_ubicacion = parametros.get('uuid_ubicacion')

        ubicacion = firestore_db.collection('Lugares').document(uuid_ubicacion)
        contenido = ubicacion.collection('Multimedia').stream()

        lista_contenido = []
        lista_url = []

        for document in contenido:
            lista_url.append({"Id": document.id})
            url = document.id
            blob = firebase_storage.blob(url)
            archivo = BytesIO()
            blob.download_to_file(archivo)
            archivo.seek(0)
            lista_contenido.append((url, archivo.read()))

        json_respuesta = json.dumps(lista_url).encode('utf-8')

        boundary = uuid.uuid4().hex
        body = BytesIO()

        # Parte 1: JSON de documentos
        body.write(f'--{boundary}\r\n'.encode())
        body.write(b'Content-Disposition: form-data; name="documentos"; filename="documentos.json"\r\n')
        body.write(b'Content-Type: application/json\r\n\r\n')
        body.write(json_respuesta)
        body.write(b'\r\n')

        # Partes de archivos
        for filename, file_content in lista_contenido:
            body.write(f'--{boundary}\r\n'.encode())
            body.write(f'Content-Disposition: form-data; name="{filename}"; filename="{filename}"\r\n'.encode())
            body.write(b'Content-Type: application/octet-stream\r\n\r\n')
            body.write(file_content)
            body.write(b'\r\n')

        # Cierre del límite
        body.write(f'--{boundary}--\r\n'.encode())

        # Se Configura la respuesta con `multipart/form-data`
        response = make_response(body.getvalue())
        response.headers['Content-Type'] = f'multipart/form-data; boundary={boundary}'
        return response

    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda de contenido: " + str(e))    
    

# [GET] Obtiene los comentarios de una ubicacion
# Recibe un JSON con el: (uuid_ubicacion)
# Devuelve un JSON con los comentarios
@https_fn.on_request()
def BuscarComentarios(request) -> https_fn.Response:
    try:

        if not request.is_json:
            return https_fn.Response('No hay JSON')

        parametros = request.get_json()

        uuid_ubicacion = parametros.get('uuid_ubicacion')

        ubicacion = firestore_db.collection('Lugares').document(uuid_ubicacion)
        comentarios = ubicacion.collection('Comentarios')
        lista_comentarios = comentarios.stream()

        resultado = []
        for doc in lista_comentarios:
            comentario = doc.to_dict()
            comentario['Id'] = doc.id
            resultado.append(comentario)

        return jsonify(resultado)

    except Exception as e:
        return https_fn.Response("Ocurrio un error en la busqueda de comentarios: " + str(e))