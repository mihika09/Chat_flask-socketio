from app import app
from app.forms import LoginForm
from flask import request, session, render_template, redirect, url_for


@app.route('/', methods=['GET', 'POST'])
def index():
	form = LoginForm()

	if form.validate_on_submit():
		session['username'] = form.username.data
		session['room'] = form.room.data
		return redirect(url_for('chat'))

	elif request.method == 'GET':
		form.username.data = session.get('username', '')
		form.room.data = session.get('room', '')

	return render_template('index.html', form=form)


@app.route('/chat')
def chat():
	username = session['username']
	room = session['room']

	if username == '' or room == '':
		return redirect(url_for('index'))

	return render_template('base.html', username=username, room=room)
