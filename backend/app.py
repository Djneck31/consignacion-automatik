from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET'] = os.getenv('JWT_SECRET')

from routes.auth import auth_bp
from routes.negocios import negocios_bp
from routes.empleados import empleados_bp
from routes.productos import productos_bp
from routes.visitas import visitas_bp
from routes.evidencias import evidencias_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(negocios_bp, url_prefix='/api/negocios')
app.register_blueprint(empleados_bp, url_prefix='/api/empleados')
app.register_blueprint(productos_bp, url_prefix='/api/productos')
app.register_blueprint(visitas_bp, url_prefix='/api/visitas')
app.register_blueprint(evidencias_bp, url_prefix='/api/evidencias')

@app.route('/')
def index():
    return {'status': 'ok', 'sistema': 'Consignacion by Automatik RD'}

if __name__ == '__main__':
    app.run(debug=True, port=5001)
