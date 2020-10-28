$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('https://node-js-chat-real-time.herokuapp.com/');

    //Socket nhận data và append vào giao diện
    socket.on("send", function (data) {
        console.log(data);
        $("#content").append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })

    //Bắt sự kiện click gửi message
    $("#sendMessage").on('click', function () {
        sendMessage();
    })

    $("#message").on('keypress', function (e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    var sendMessage = function () {
        var username = $('#username').val();
        var message = $('#message').val();

        if (username == '' || message == '') {
            alert('Please enter name and message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', { username: username, message: message });
            $('#message').val('');
        }
    }
})