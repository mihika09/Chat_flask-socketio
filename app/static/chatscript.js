const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
const sendBtn = document.getElementById('sendMsg')
const leaveChat = document.getElementById('leave')
const userInfo = document.getElementById('user')
let name = userInfo.textContent.split(' ')[1]

let color = 'rgb(' + random(3, 240) + ',' + random(3, 240) + ',' + random(3, 240) + ')'

msgBox.value = ''
msgBox.focus()

let socket
socket = io.connect('http://' + document.domain + ':' + location.port + '/chat')

socket.on('connect', function () {
  socket.emit('joined', {})
})

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
  if (msgBox.value.trim() !== '') socket.emit('text', { msg: msgBox.value })
})

msgBox.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && msgBox.value.trim() !== '') socket.emit('text', { msg: msgBox.value })
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

socket.on('status', function (data) {
  console.log(data)
  console.log('data.state', data.state)
  let message
  if ( data.username === name) notify('You have joined the chat!')
  else {
    message = data.state === 'joined' ? ' has joined the chat!' : ' left'
    notify(data.username + message)
  }
  addToList(data.username)
})

socket.on('message', function (data) {
  console.log(data.username)
  let msgClass = data.username === name ? 'message' : 'reply'
  console.log(msgClass)
  addMessage(data.msg, msgClass, data.username)
})

function leaveRoom () {
  socket.emit('left', {}, function () {
    socket.disconnect()
    window.location.href = "{{ url_for('index') }}"
  })
}

leaveChat.addEventListener('click', leaveRoom)
