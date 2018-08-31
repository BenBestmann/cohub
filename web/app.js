var socket = io.connect('http://192.168.1.194:5000');

function scrollToBottom(id){
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

if(!localStorage.getItem('cohubId')) {
    localStorage.setItem('cohubId', guid());
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
                var newMessage = {
                    id: guid(),
                    author: localStorage.getItem('cohubId'),
                    text: this.message
                };
                socket.emit('message', newMessage);
                this.messages.push(newMessage);
                this.message = '';
                scrollToBottom('message-box');
            }
        },
        remove: function(id) {
            console.log('Remove called with: ' + id);
            socket.emit('delete', { id: id, author: localStorage.getItem('cohubId') });
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

