$(function () {
    //Kết nối tới server socket đang lắng nghe
    // var socket = io.connect('https://node-js-chat-real-time.herokuapp.com/');
    var socket = io.connect('http://localhost:7778/');

    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    socket.on('connect', () => authen(token,
        () => {
            console.log('object')
        },
        (msg) => {
            console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
        }
    ));

    //Bắt sự kiện click gửi message
    $("#sendMessage").on('click', function () {
        sendMessage();
    })

    $("#message").on('keypress', function (e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    var authen = (token, successCallback, errorCallback) => {
        socket
            .emit('authenticate', { token }) //send the jwt
            .on('authenticated', () => successCallback())
            .on('unauthorized', (msg) => errorCallback(msg))
    }

    socket.on("send", function (data) {
        authen(token,
            () => {
                console.log(data);
                $("#content").append("<p class='message'>" + data.username + ": " + data.message + "</p>")
            },
            (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
            })
    })

    var onSendMessage = () => {
        var username = $('#username').val();
        var content = $('#message').val();

        if (username == '' || content == '') {
            console.log('Please enter name and message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', { username: username, message: content });
            $('#message').val('');
            // saveToMongo({ username: username, message: content })
        }
    }

    var sendMessage = () => {
        authen(token,
            () => onSendMessage(),
            (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
            });

        // var username = $('#username').val();
        // var content = $('#message').val();

        // if (username == '' || content == '') {
        //     alert('Please enter name and message!!');
        // } else {
        //     //Gửi dữ liệu cho socket
        //     socket.emit('send', { username: username, message: content });
        //     $('#message').val('');
        //     // saveToMongo({ username: username, message: content })
        // }
    }

    var saveToMongo = function (message) {
        mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true })
        var db = mongoose.connection;
        db.on('err', function (err) {
            if (err) {
                console.log(err)
            }
        })

        db.once('open', function () {
            console.log('Connect to MongoDB successfully!')
            var Schema = mongoose.Schema;
            var messageSchema = new Schema({
                userId: String,
                content: String,
                createdAt: String,
            });

            messageSchema.methods.showMessage = function () {
                console.log(`Add "${this.content}"`)
            }

            var Message = mongoose.model('Message', messageSchema);
            var data = {
                userId: message.username,
                content: message.content,
                createdAt: Math.floor(Date.now() / 1000),
            }

            var messageCollection = new Message(data);
            messageCollection.save(function (err, data) {
                if (err) {
                    return console.log(err)
                }
                console.log(data);
                messageCollection.showMessage();
            })
        })
    }
})