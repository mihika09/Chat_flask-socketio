from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

app.debug = True
app.config['SECRET_KEY'] = 'lol'

from app import routes, events
