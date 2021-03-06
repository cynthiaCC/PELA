// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

//TODO: Communication implementation
var OpenTok = require('opentok');
//Include the credentials stored in a seperate file
var credentials = require('./credentials');
console.log(credentials.apiKey);
var apiKey = credentials.apiKey;
var apiSecret = credentials.apiSecret;
var opentok = new OpenTok(apiKey, apiSecret);

//Import the PELABlocks server side file
var blocks = require('./blocks');


//Create a simple Express application
// Turn down the logging activity
//app.use(express.logger('dev'));

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static(path.join(__dirname,'public')));

//Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(8080);

//Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

//Reduce the logging output of Socket.IO
//io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {    
    blocks.initGame(io, socket, opentok, credentials);
});
