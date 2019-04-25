from flask import session
from flask_socketio import emit, join_room, leave_room
from app import socketio


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    print("Helllllllllooooooooooooooooooooo")
    room = session.get('room')
    join_room(room)
    emit('status', {'username': session.get('username'), 'status': 'joined'}, room=room)


@socketio.on('text', namespace='/chat')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = session.get('room')
    emit('message', {'msg': session.get('username') + ':' + message['msg']}, room=room)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    emit('status', {'username': session.get('username'), 'status': 'left'}, room=room)