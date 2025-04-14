"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
# Leo: Importar las siguientes librerias
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_cors import CORS

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
# Leo: Adicionado
app.config["JWT_SECRET_KEY"] = "nuestra_clave_secreta"
jwt = JWTManager(app)  # Inicializar jwt para que funcione dentro del BackEnd
CORS(app)
# Leo: Fin-Adicionado
app.url_map.strict_slashes = False


# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
# add the admin
setup_admin(app)
# add the admin
setup_commands(app)
# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Leo: Endpoint "/Login": Recibe usuario, valida, genera y retorna el token
@app.route('/login', methods=['POST'])
def get_logintoken():
    try:
        # silent=True : Devuelve None cuando esta mal formateado el objeto del body recibido del front}, pero no se cae toda la funcion sino que continua
        dataFront = request.get_json(silent=True)
        print("data del Front- body ", dataFront)  # imprimir en terminal

        # Buscar usuario en BD, por su correo electronico (usuario tiene id=1)
        user = db.session.execute(db.select(User).filter_by(email=dataFront["correo"])).scalar_one_or_none()
        print("Usuario objero de BD ", user.password)# Nota: Se obtiene el campo de BD a pesar de que en el Modelo de BD no se expone como serializado

        # Validar que exista usuario en BD y su contraseña
        if not user or user.password != dataFront["contrasena"]:
            return jsonify({"ok": False, "msg": "Usuario no existe o su contraseña es incorrecta"}), 401

        # Opcional: Agrego Claims como información
        claims = {
            "role": "admin",
            "otra_informacion": {"info": "info...", "data": "data info"}
        }

        # Si todo lo demas es exitoso.... Entonces creamos el token
        access_token = create_access_token(identity=str(user.id), additional_claims=claims)

        # Retornamos una respuesta exitosa, junto con el token creado
        return jsonify({
            "ok": True,
            "access_token": access_token,
            "msg": "Loguin existoso!"
        }), 200

    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


# Leo: Endpoint "/signup": Crear Usuario
@app.route('/signup', methods=['POST'])
def add_User():
    # Recibir Body del front
    dataFront = request.get_json(silent=True)
    print("data del body ", dataFront)

    # Validar1: Body no sea vacio
    if not dataFront or not dataFront.get("correo") or not dataFront.get("contrasena"):
        return jsonify({"error": "BackEnd Recibe Datos vacios desde el front"}), 400

    # Validar2: Usuario no se repita
    if db.session.execute(db.select(User).filter_by(email=dataFront["correo"])).scalar_one_or_none():
        return jsonify({"error": "Usuario ya existe"}), 409

    # Crear Usuario
    new_usuario = User(email=dataFront["correo"], password=dataFront["contrasena"], is_active=True)
    db.session.add(new_usuario)
    db.session.commit()

    return jsonify({'message': f'Usuario  {dataFront["correo"]} ha sido creado'}), 201


# Leo: Endpoint "/private": Retornar usuario con sus campos según el usuario
@app.route("/private", methods=["GET"])
@jwt_required()
def get_private():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    return jsonify(user.serialize()), 200


# Leo: Endpoint "/private": Actualizar usuario 
@app.route("/private", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    dataFront = request.get_json(silent=True)

    user.email = dataFront.get("correo", user.email)
    user.is_active = dataFront.get("activo", user.is_active)
    db.session.commit()
    return jsonify({"message": "Perfil actualizado"}), 200


# Leo: Endpoint "/private": Eliminar usuario 
@app.route("/private", methods=["DELETE"])
@jwt_required()
def delete_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Cuenta eliminada"}), 200







# Otros Endpoint Demo:
@app.route('/loginDemo', methods=['POST'])
def handle_login():
    try:
        # silent=True : Devuelve None cuando est{a mal formateado el objeto del body recibido del front}, pero no se cae toda la funcion sino que continua
        data = request.get_json(silent=True)
        print("data del body ", data)  # imprimir en terminal
        # Simulamos que fue a BD, el usuario existe y obtuvo el id de usuario
        user_id = 1

        claims = {
            "role": "admin",
            "otra_informacion": {"info": "info...", "data": "data info"}
        }

        # Si todo lo demas es exitoso.... Entonces creamos el token
        access_token = create_access_token(
            identity=str(user_id), additional_claims=claims)
        # Retornamos una respuesta exitosa, junto con el token creado
        return jsonify({
            "ok": True,
            "msg": "Loguin existoso....",
            "access_token": access_token
        }), 200

    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500

# Endpoint1 leo creado


@app.route('/register', methods=['POST'])
def handle_register():
    try:
        data = request.get_json(silent=True)
        print("data del body ", data)
        # Agregarllo a bd
        return jsonify({"ok": True, "msg": "registro existoso...."}), 201
    except Exception as e:
        print("Error", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)})

# Leo: Endpoint1 leo creado









# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
