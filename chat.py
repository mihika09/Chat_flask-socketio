from app import app, socketio


if __name__ == '__main__':
	socketio.run(app, host='192.168.0.121', port=8000)
