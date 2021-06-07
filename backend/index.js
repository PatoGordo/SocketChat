const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {origin: "*"}
})

// This array||db store all messages sent
var messages = []

io.on('connection', (socket) => {
  console.log(`New connection [${socket.id}]`)

  // Send all messages for new users
  messages.forEach(msg => {
    socket.emit('message', msg)
  })

  socket.on('message', (message) => {

    // Check for invalid possibilities
    if(message.text === '' || message.author === '' || message.author === 'SYSTEM') {
      return
    }

    // Send socket id to user  
    if(message.text.substr(0, 5).toLowerCase() === '!myid') {
      socket.emit('message', {text: `(Message sent only for you) Your id is: ${socket.id}`, author: 'SYSTEM'})
      return
    }

    // Clear all chat
    if(message.text.substr(0, 6).toLowerCase() === '!clear') {

      messages = []

      setTimeout(() => {
        io.emit('message', {text: 'all messages have been deleted', author: 'SYSTEM'})
        messages.push({text: 'all messages have been deleted', author: 'SYSTEM'})
      }, 200)
      return
    }

    // Add messages to message array||db and emit foi all usets
    messages.push(message)
    io.emit('message', message)
  })

})

const port = process.env.PORT || 3000

http.listen(port, () => {
  console.log('SERVER STARTED')
})