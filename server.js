const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// set static
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
const botName = 'chikkuuu'







io.on('connection', (socket) => {

    // rooom and username varificaion

    socket.on('joinRoom', ({ username, room }) => {
        // 

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // sending message
        socket.emit('message', formatMessage(username, 'welcome to chat server'));

        // brodcast everyone except client

        socket.broadcast.emit('message', formatMessage(username,`${username} has joined the chat `));

    })


    // disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){

            io.emit('message', formatMessage(botName, `${user.username} left the chat`));
        }
    });

    // listen chatMessage
    socket.on('chatMessage', (msg) => {
        const user =  getCurrentUser(socket.id)

        console.log(msg)
        io.emit('message', formatMessage(user.username, msg));
    });




    // to everyone
    // io.on('connection', 'everyone will we notified')
});

const port = 3000 || process.env.PORT;
server.listen(port, () => console.log('server running on', port));