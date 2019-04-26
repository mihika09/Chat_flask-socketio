from flask import session
from flask_socketio import emit, join_room, leave_room
from app import socketio


@socketio.on('joined', namespace='/chat')
def joined(message):

    print("\n{} joined\n".format(session.get('username')))
    room = session.get('room')
    join_room(room)
    emit('status', {'username': session.get('username'), 'state': 'joined'}, room=room)


@socketio.on('text', namespace='/chat')
def text(message):

    room = session.get('room')
    emit('message', {'username': session.get('username'), 'msg': message['msg']}, room=room)


@socketio.on('left', namespace='/chat')
def left(message):

    room = session.get('room')
    leave_room(room)
    emit('status', {'username': session.get('username'), 'state': 'left'}, room=room)


@socketio.on('disconnect', namespace='/chat')
def disconnect():
    room = session.get('room')
    emit('status', {'username': session.get('username'), 'state': 'left'}, room=room)