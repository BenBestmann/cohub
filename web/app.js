var socket = io.connect('http://192.168.1.194:5000');

function scrollToBottom(id){
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

const App = new Vue({
    el: '#app',
    data: {
        message: '',
        messages: []
    },
    methods: {
        send: function() {
            if(this.message !== '') {
                socket.emit('message', this.message);
                this.messages.push(this.message);
                this.message = '';
                scrollToBottom('message-box');
            }
        }
    }
});

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('update', function(messages) {
    App.messages = messages;
    scrollToBottom('message-box');
});

