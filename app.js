var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const socketioJwt = require('socketio-jwt');

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'public')));

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/views/chat.html'));
});

//Tạo socket 
io.sockets
    .on('connection', socketioJwt.authorize({
        // jwt secret key
        secret: 'your-256-bit-secret',
        timeout: 15000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', (socket) => {
        //this socket is authenticated, we are good to handle more events from it.

        socket.on('send', function (data) { 
            console.log('data', data)
            io.sockets.emit('send', data);
        });
    });

//Khởi tạo 1 server listen tại 1 port
server.listen(process.env.PORT || 7778);