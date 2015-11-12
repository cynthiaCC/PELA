/**
 * All the code relevant to Socket.IO is collected in the IO namespace.
 *
 * @type {{init: Function, bindEvents: Function, onConnected: Function, onNewGameCreated: Function, playerJoinedRoom: Function, beginNewGame: Function, onNewWordData: Function, hostCheckAnswer: Function, gameOver: Function, error: Function}}
 */
var IO = {

   /**
     * This is called when the page is displayed. It connects the Socket.IO client
     * to the Socket.IO server
     */
   init: function() {
       IO.socket = io.connect();
       IO.bindEvents();
   },

   /**
    * While connected, Socket.IO will listen to the following events emitted
    * by the Socket.IO server, then run the appropriate function.
    */
   bindEvents : function() {
       IO.socket.on('connected', IO.onConnected );
       IO.socket.on('newGameCreated', IO.onNewGameCreated );
       IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom );
       IO.socket.on('beginNewGame', IO.beginNewGame );
       IO.socket.on('errorJoining', IO.errorJoining );
       IO.socket.on('builderFinished', IO.gameOver);
       IO.socket.on('gameOver', IO.gameOver);
       IO.socket.on('constructionFinished', IO.constructionFinished);
       
       IO.socket.on('audioStarted', IO.enableInstructorAudio );
       IO.socket.on('sentApiKey', IO.enableBuilderAudio);
       IO.socket.on('blockAdded', IO.blockAdded);
       
       IO.socket.on('error', IO.error );
   },

   /**
    * The client is successfully connected!
    */
   onConnected : function() {
       // Cache a copy of the client's socket.IO session ID on the App
       App.mySocketId = IO.socket.sessionid;
       // console.log(data.message);
   },

   /**
    * A new game has been created and a random game ID has been generated.
    * @param data {{ gameId: int, mySocketId: * }}
    */
   onNewGameCreated : function(data) {
       App.Host.gameInit(data);
   },

   /**
    * A player has successfully joined the game.
    * @param data {{playerName: string, gameId: int, mySocketId: int}}
    */
   playerJoinedRoom : function(data, token) {
      App.audioTokenBuilder = token;
      // When a player joins a room, do the updateWaitingScreen function.
      // There are two versions of this function: one for the 'host' and
      // another for the 'player'.
      //
      // So on the 'host' browser window, the App.Host.updateWiatingScreen function is called.
      // And on the player's browser, App.Player.updateWaitingScreen is called.
      App[App.myRole].updateWaitingScreen(data);
   },

   /**
    * Both players have joined the game.
    * @param data
    */
   beginNewGame : function(data) {
      if(App.myRole === 'Player') {
         App.audioSessionId = data.audioSessionId;
         App.audioSettings = data.audioSettings;
         App.audioTokenBuilder = data.builderToken;
      }
      App.beginNewGame();
   },
   
   /**
    * An error occured while trying to join a room
    * @param data
    */
   errorJoining : function(data) {
      $('#waitingForInstructor').html(data.message);
   },
   
  /**
   * The builder has finished. If this is the host, check the answer.
   * @param data
   */
   builderFinished : function(data) {
       if(App.myRole === 'Host') {
           App.Host.checkAnswer(data);
       }
   },
   
   /**
    * The player ends the game after finishing the build
    */
   gameOver : function(data) {
	   App[App.myRole].endGame(data);
   },
   /**
    * The builder hit the 'Start Again' button after the end of a game.
    */
   restartGame : function() {
       App.$gameArea.html(App.$templateNewGame);
       $('#spanNewGameCode').text(App.gameId);
   },
   
   /**
    * Enable audio BUTTON for builder and audio for instructor
    * @param data
    */
   enableInstructorAudio : function(apiKey) {
       if(App.myRole === 'Player') {
           $('#audio-button').show();
       }
       else {
          App.initAudio(App.audioSettings, apiKey);
       }
   },
   
   enableBuilderAudio : function(apiKey) {
      if(App.myRole === 'Player') {
         App.initAudio(App.audioSettings, apiKey);
      }
  },
  
  constructionFinished : function(data) {
     App.loadConstruction(data);
  },
  
  //Builder added a block, update values
  blockAdded : function() {
     if (App.myRole === 'Host') {
        App[App.myRole].updateBlockAmount();
     }
  },

   /**
    * An error has occurred.
    * @param data
    */
   error : function(data) {
      console.log(data.message);
   }
   
};
