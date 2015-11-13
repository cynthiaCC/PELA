var io;
var gameSocket;
var opentok;
var credentials

var gameID = '';
var audioSessionId = '';
var instructorToken = '';
var builderToken = '';

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket, ot, cred){
    io = sio;
    gameSocket = socket;
    opentok = ot;
    credentials = cred;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('hostRoomFull', hostPrepareGame);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerRestart', playerRestart);
    gameSocket.on('constructionFinished', constructionFinished);
    
    //General Events
    gameSocket.on('gameStarted', startGame);
    gameSocket.on('audioStarted', audioStarted);
    gameSocket.on('blockAdded', blockAdded);
    
    gameSocket.on('requestApiKey', requestApiKey);
    
    gameSocket.on('error', function(error) {
       console.log(error);
    });
}

/* ********************************************
   *                                          *
   *       INSTRUCTOR (HOST) FUNCTIONS        *
   *                                          *
   ******************************************** */

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */
function hostCreateNewGame() {
   // Create a unique Socket.IO Room
   var thisGameId = ( Math.random() * 100000 ) | 0;
   var instance = this;
   gameId = thisGameId;
   
   //Start opentok session
   opentok.createSession({mediaMode:"routed"}, function(err,session){
      //Generate tokens
      instructorToken = opentok.generateToken(session.sessionId);
      builderToken = opentok.generateToken(session.sessionId);
      //assign session id
      audioSessionId = session.sessionId;
      // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
      instance.emit('newGameCreated', {gameId: thisGameId, mySocketId: instance.id, audioSessionId : audioSessionId, instructorToken : instructorToken});
   
      // Join the Room and wait for the players
      instance.join(thisGameId.toString());
   });
};

/**
 * Player has joined. Alert the host!
 * @param gameId The game ID / room ID
 */
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };
    //console.log("All Players Present. Preparing game...");
    io.sockets.in(data.gameId).emit('beginNewGame', data);
}

/* ******************************
   *                            *
   *     BUILDER FUNCTIONS      *
   *                            *
   ****************************** */

/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
function playerJoinGame(data) {
    //console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );
    // A reference to the player's Socket.IO socket object
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.adapter.rooms[data.gameId];

    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        //console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data, builderToken);

    } else {
        // Otherwise, send an error message back to the player.
        sock.emit('errorJoining',{message: "This room does not exist."} );
    }
}


/**
 * The game is over, and a player has clicked a button to restart the game.
 * @param data
 */
function playerRestart(data) {
    // console.log('Player: ' + data.playerName + ' ready for new game.');

    // Emit the player's data back to the clients in the game room.
    data.playerId = this.id;
    io.sockets.in(data.gameId).emit('playerJoinedRoom',data);
}

function constructionFinished(data, gameId) {
   io.sockets.in(gameId).emit('constructionFinished', data);
}

/* *************************
   *                       *
   *      General          *
   *                       *
   ************************* */

function startGame(gameId, audioSettings) {
   var sock = this;
   var data = {
         mySocketId : sock.id,
         gameId : gameId,
         audioSettings : audioSettings,
         audioSessionId : audioSessionId,
         builderToken : builderToken
   };
   io.sockets.in(data.gameId).emit('beginNewGame', data);
}

function audioStarted(gameId) {
   io.sockets.in(gameId).emit('audioStarted', credentials.apiKey);
}

function requestApiKey(gameId) {
   io.sockets.in(gameId).emit('sentApiKey', credentials.apiKey);
}

/* *************************
   *                       *
   *      GAME LOGIC       *
   *                       *
   ************************* */

//TODO: Implement Game Logic
function blockAdded(gameId) {
   io.sockets.in(gameId).emit('blockAdded');
}