const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {origin: "*"}
})

var messages = []

io.on('connection', (socket) => {
  console.log(`New connection [${socket.id}]`)

  messages.forEach(msg => {
    socket.emit('message', msg)
  })

  socket.on('message', (message) => {
    // console.log(message)
    if(message === '') {
      return
    }

    if(message.substr(0, 5).toLowerCase() === 'clear') {
      messages = []
      setTimeout(() => {
        io.emit('message', `[SYSTEM]: all messages have been deleted`)
        messages.push(`[SYSTEM]: all messages have been deleted`)
      }, 200)
      return
    }
    messages.push(`[${socket.id}]: ${message}`)
    io.emit('message', `[${socket.id}]: ${message}`)
  })
})

http.listen(8080, () => console.log('SERVER STARTED'))