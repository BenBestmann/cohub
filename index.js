'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const _ = require('lodash');

const port = process.env.PORT || 5000;

// Setup express app
const app = express();
// Remove express branding
app.set('x-powered-by', false);
// Add required middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(methodOverride('X-HTTP-Method-Override'));
// Enable CORS for all requests
app.use(cors());
// Make sure all header data is available if running behind a reverse proxy (e.g. heroku)
app.enable('trust proxy');

// Setup static routing for react client SPA
app.use('/', express.static(path.join(__dirname, 'web')));

// Load API endpoints
// app.use('/api', routes);

// Start server
const server = app.listen(port, () => {
    console.log('Server started on port: ' + port);
});

const messages = [];

// Socket stuff
const io = require('socket.io')(server);
io.on('connection', client => {
    console.log('Client connected: ' + client.request.headers['user-agent']);

    // Automatically send all current messages
    client.emit('update', messages);

    client.on('message', message => {
        // console.log(message);
        messages.push(message);
        // console.log('Total messages: ' + messages.length);
        io.emit('update', messages);
    });

    client.on('delete', request => {
        const msg = _.find(messages, { id: request.id });
        if(msg.author === request.author) {
            _.remove(messages, { id: request.id });
        }
        io.emit('update', messages);
    });

});