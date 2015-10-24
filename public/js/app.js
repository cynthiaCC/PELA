 var App = {

   /**
    * Keep track of the gameId, which is identical to the ID
    * of the Socket.IO Room used for the players and host to communicate
    *
    */
   gameId: 0,

   /**
    * This is used to differentiate between 'Host' and 'Player' browsers.
    */
   myRole: '',   // 'Player' or 'Host'

   /**
    * The Socket.IO socket object identifier. This is unique for
    * each player and host. It is generated when the browser initially
    * connects to the server when the page loads for the first time.
    */
   mySocketId: '',


   /* *************************************
    *                Setup                *
    * *********************************** */

   /**
    * This runs when the page initially loads.
    */
   init: function () {
      App.cacheElements();
      App.showInitScreen();
      App.bindEvents();

   },

   /**
    * Create references to on-screen elements used throughout the game.
    */
   cacheElements: function () {
      App.$doc = $(document);
   },

   /**
    * Create some click handlers for the various buttons that appear on-screen.
    */
   bindEvents: function () {
      // Instructor (Host)
      App.$doc.on('click', '#btnCreateGame', App.Host.onCreateClick);
      App.$doc.on('click', '#startGame', App.Host.onStartClick);

      // Builder
      App.$doc.on('click', '#btnJoinGame', App.Player.onJoinClick);
      App.$doc.on('click', '#btnStart',App.Player.onPlayerStartClick);
   },

   /* *************************************
    *             Game Logic              *
    * *********************************** */

   /**
    * Show the initial PELABlocks Title Screen
    * (with Host and Join buttons)
    */
   showInitScreen: function() {
      $('#pb-create-game-template').hide();
      $('#pb-join-game-template').hide();
      $('#pb-game-template').hide();
      $('#pb-intro-screen-template').show();
   },
   
   //Start the game
   beginNewGame : function() {
      $('#pb-create-game-template').hide();
      $('#pb-join-game-template').hide();
      $('#pb-game-template').show();
      $('#pb-intro-screen-template').hide();
      App[App.myRole].createGameScreen();
   },


   /* *******************************
    *         HOST CODE           *
    ******************************* */
   Host : {

      /**
       * Contains references to player data
       */
      players : [],

      /**
       * Flag to indicate if a new game is starting.
       * This is used after the first game ends, and players initiate a new game
       * without refreshing the browser windows.
       */
      isNewGame : false,

      /**
       * Keep track of the number of players that have joined the game.
       */
      numPlayersInRoom: 0,

      /**
       * Handler for the "Start" button on the Title Screen.
       */
      onCreateClick: function () {
         // console.log('Clicked "Create A Game"');
         IO.socket.emit('hostCreateNewGame');
      },

      /**
       * The Host screen is displayed for the first time.
       * @param data{{ gameId: int, mySocketId: * }}
       */
      gameInit: function (data) {
         App.gameId = data.gameId;
         App.mySocketId = data.mySocketId;
         App.myRole = 'Host';
         App.Host.numPlayersInRoom = 0;
         App.Host.displayNewGameScreen();
         // console.log("Game started with ID: " + App.gameId + ' by host: ' + App.mySocketId);
      },

      /**
       * Show the Host screen containing the game URL and unique game ID
       */
      displayNewGameScreen : function() {
         // Fill the game screen with the appropriate HTML
         $('#pb-intro-screen-template').hide();
         $('#pb-create-game-template').show();
         
         // Display the URL on screen
         //$('#gameURL').text(window.location.href);

         // Show the gameId / room id on screen
         $('#spanNewGameCode').text(App.gameId);
      },

      /**
       * Update the Host screen when the first player joins
       * @param data{{playerName: string}}
       */
      updateWaitingScreen: function(data) {
         // Update host screen
         $('#playersWaiting').text('Builder has joined the game.');

      },
      
      onStartClick : function() {
         IO.socket.emit('gameStarted', App.gameId);
      },

    //TODO: Implementing gamelogic ralated host code
      //Create game screen for host with pixi.js
      createGameScreen : function() {
         //TODO: Create the pixi.js canvas and the first object to create, maybe different file for pixi.js logic
      }
      
   },
   /* *****************************
    *        PLAYER CODE        *
    ***************************** */

   Player : {

      /**
       * A reference to the socket ID of the Host
       */
      hostSocketId: '',

      /**
       * The player's name entered on the 'Join' screen.
       */
      myName: '',

      /**
       * Click handler for the 'JOIN' button
       */
      onJoinClick: function () {
         $('#pb-intro-screen-template').hide();
         $('#pb-join-game-template').show();
      },

      /**
       * The player entered their name and gameId (hopefully)
       * and clicked Start.
       */
      onPlayerStartClick: function() {
         // console.log('Player clicked "Start"');

         // collect data to send to the server
         var data = {
            gameId : +($('#inputGameId').val()),
            playerName : $('#inputPlayerName').val() || 'anon'
         };

         // Send the gameId and playerName to the server
         IO.socket.emit('playerJoinGame', data);

         // Set the appropriate properties for the current player.
         App.myRole = 'Player';
         App.Player.myName = data.playerName;
      },

      /**
       * Display the waiting screen for player 1
       * @param data
       */
      updateWaitingScreen : function(data) {
         if(IO.socket.io.engine.id === data.mySocketId){
            App.myRole = 'Player';
            App.gameId = data.gameId;

            //TODO: Localization
            $('#waitingForInstructor').html('Please wait for instructor to start the game.');
        }
      },

      //TODO: Implement gamelogic related builder code
    //Create game screen for player with pixi.js
      createGameScreen : function() {
         //TODO: Create the pixi.js canvas and the first building blocks to create, maybe different file for pixi.js logic
      }

   },

};

IO.init();
App.init();
