"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt 

# Allow CORS requests to this API
#Permite que, todos los "endpoints" de esta pagina, tengan como raiz "..../api/"
api = Blueprint('api', __name__)
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

#Leo: Agregar Endpoint "/me" 
@api.route('/me', methods=['GET'])
@jwt_required() #Requerir Token para que funcione el metodo
def handle_me():
    identity= get_jwt_identity()
    claims=get_jwt()
    role=claims.get('role')
    otra_informacion=claims.get('otra_informacion')

    print("claims: ", claims)
    print("identity: ", identity)
    print("identity Type: ", type(identity))
    print("identity converted: ", type(int(identity)))
    return jsonify({
        "ok": True, 
        "msg":"Aqui va toda tu informacion", 
        "user_id":identity,
        "role":role,
        "info_extra":otra_informacion
        }),200


