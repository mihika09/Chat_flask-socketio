const enterChat = document.getElementById('enterChat')
const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
const sendBtn = document.getElementById('sendMsg')
let name
let roomId
let color = 'rgb(' + random(3, 240) + ',' + random(3, 240) + ',' + random(3, 240) + ')'

msgBox.value = ''
msgBox.disabled = true

var socket;
socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');

socket.on('connect', function() {
    socket.emit('joined', {});
});

function notify (message) {
  let notification = document.createElement('p')
  notification.setAttribute('class', 'notification')
  notification.textContent = message
  screen.appendChild(notification)
}

function random (min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min
  return num
}

function getTime () {
  let today = new Date()
  let hours = today.getHours()
  if (hours >= 12) {
    if (hours === 12) return hours + ':' + today.getMinutes() + ' p.m.'
    return (hours - 12) + ':' + today.getMinutes() + ' p.m.'
  }
  return today.getHours() + ':' + today.getMinutes() + ' a.m.'
}

sendBtn.addEventListener('click', () => {
  let message = msgBox.value
  socket.emit('text', {msg: message});
})

msgBox.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && msgBox.value.trim() !== '') {
    let message = msgBox.value
    socket.emit('text', {msg: message});
  }
})

function addMessage (message, msgClass, sender = name) {
  let msg = document.createElement('div')
  msg.setAttribute('class', msgClass)
  let content = document.createElement('span')
  content.textContent = message
  content.setAttribute('class', 'msgContent')
  if (msgClass === 'reply') {
    let user = document.createElement('p')
    user.setAttribute('class', 'sender')
    user.textContent = sender
    user.style.color = color
    msg.appendChild(user)
  }
  let time = document.createElement('span')
  time.setAttribute('class', 'msgTime')
  time.textContent = getTime()
  msg.appendChild(content)
  msg.appendChild(time)
  screen.appendChild(msg)
  msgBox.value = ''
  msgBox.focus()
}

function addToList (value) {
  let list = document.getElementById('chatList')
  let newUser = document.createElement('li')
  newUser.setAttribute('class', 'userDisplay')
  newUser.textContent = value
  list.appendChild(newUser)
}

socket.on('status', function(data) {
        // $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        // $('#chat').scrollTop($('#chat')[0].scrollHeight);
        let username = data.username
        let status = data.status
        notify(message)
        addToList(data['name'])
    });

socket.on('message', function(data) {
        // $('#chat').val($('#chat').val() + data.msg + '\n');
        // $('#chat').scrollTop($('#chat')[0].scrollHeight);
        let message = data.msg
        addMessage(message)
    });

function leave_room() {
    socket.emit('left', {}, function() {
        socket.disconnect();
        // go back to the login page
        window.location.href = "{{ url_for('index') }}";
    });
}