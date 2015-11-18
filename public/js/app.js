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
   originalRole: '', //Tells what the original role was when starting in case audio is started after first round and not on 3rd, 5th etc. when current role isnt the same

   /**
    * The Socket.IO socket object identifier. This is unique for
    * each player and host. It is generated when the browser initially
    * connects to the server when the page loads for the first time.
    */
   mySocketId: '',
   
   audioSettings : 'only-audio',
   audioSessionId : '',
   audioTokenInstructor : '',
   audioTokenBuilder : '',
   
   //Audio stream
   audio : null,


   /* *************************************
    *                Setup                *
    * *********************************** */

   /**
    * This runs when the page initially loads.
    */
   init: function () {
      console.log("Initiating App");
      App.cacheElements();
      App.showInitScreen();
      App.bindEvents();
      console.log("Finished initiating App");
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
      console.log("Showing initial screen");
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
   
   beginRound : function(compilation) {
      pixijs.clearAll();
      var filename = "JSON/" + compilation + ".json";
      var compilationJSON;
      $.getJSON(filename, function(data) {
         compilationJSON = data;
         App[App.myRole].begin(compilationJSON);
      });
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
         App.audioSessionId = data.audioSessionId;
         App.audioTokenInstructor = data.instructorToken;
         App.myRole = 'Host';
         App.originalRole = 'Host';
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
         $('#playersWaiting').text('Builder ' + data.playerName + ' has joined the game.');
         
         //Show the start game button
         $('#startGame').fadeIn();

      },
      
      onStartClick : function() {
         IO.socket.emit('gameStarted', App.gameId, App.audioSettings);
      },
      
      /**
       * Check the answer clicked by a player.
       * 
       */
      checkAnswer : function(data) {
         
      },
      
      endGame : function(data){
         App.showInitScreen();
        
      },

      //TODO: Implementing gamelogic ralated host code
      //Create game screen for host with pixi.js
      createGameScreen : function() {
         pixijs.init();
         $('#pixi-canvas').append(pixijs.renderer.view);
      },
      
      //begin the round for instructor
      begin : function(compilation) {
         pixijs.addBlueprint(PIXI.Texture.fromImage('img/' + compilation.compilationImg));
         var blocks = 0;
         $.each(compilation.parts, function(index, value) {
            blocks += value.quantity;
         });
         pixijs.blockTotal = blocks;
      },
      
      //Add to the block amount
      updateBlockAmount : function() {
         pixijs.currentBlocks++;
      },
      
   },
   /* *****************************
    *        PLAYER CODE          *
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
         App.originalRole = 'Player';
         App.Player.myName = data.playerName;
      },

      /**
       * Display the waiting screen for player 1
       * @param data
       */
      updateWaitingScreen : function(data) {
         if(IO.socket.io.engine.id === data.mySocketId){
            App.myRole = 'Player';
            App.originalRole = 'Player';
            App.gameId = data.gameId;

            //TODO: Localization
            $('#waitingForInstructor').html('Please wait for instructor to start the game.');
        }
      },

      //TODO: Implement gamelogic related builder code
      //Create game screen for player with pixi.js
      createGameScreen : function() {
         //Hide audio button
         $('#audio-button').hide();
         pixijs.init();
         $('#pixi-canvas').append(pixijs.renderer.view);
      },
      
      /**
       * Player finishes the construction and the built construction is sent to host
       * @param data Holds the objects pixijs container
       */
      finishConstruction : function(data){
         IO.socket.emit('constructionFinished', data, App.gameId);
      },
      
      //Begin the round for builder
      begin : function(compilation) {
         $.each(compilation.parts, function(index, value) {
            pixijs.addToBlockMenu(PIXI.Texture.fromImage('img/' + value.partImg), value.quantity);
         });
      },
      
      

   },
   
   /* *************** 
    *    GENERAL    *
    ***************** */
   
   /**
    * Load the instructions for the builder and built construct for instructor after construction is finished
    * @param data holds the pixijs container to load for instructor
    */
   loadConstruction : function(data) {
      if (App.myRole == 'Host') {
         pixijs.loadTemp(data);
      }
   },
   
   initAudio: function (settings, apiKey) {
      // init session and publisher
      var pubSettings = '';
      
      if (settings == 'only-audio') {
         pubSettings = {videoSource: null};
         $('#publisherContainer').hide();
      } else {
         pubSettings = {publishAudio:true, publishVideo:true};
      }
      var session = OT.initSession(apiKey, App.audioSessionId),
         publisher = OT.initPublisher('publisherContainer', pubSettings);
      
      // assign token for instructor and builder
      var token = '';
      if(App.originalRole == 'Host') {
         token = App.audioTokenInstructor;
      } else {
         token = App.audioTokenBuilder;
      }           
      
      // connect to a session and publisher a stream
      session.connect(token, function(err, info) {
      if(err) {
         //alert(err.message || err);
      }
         session.publish(publisher);
      });
      // detect new streams and connect them to the app  
      session.on('streamCreated', function(event) {
         console.log("New stream in the session: " + event.stream.streamId);
         App.audio = session.subscribe(event.stream, "publisherContainer", { insertMode: "append" });
      });
   
   },
   
   //Set the volume of the audio
   setVolume : function(newVolume) {
      if (App.audio != null) {
         App.audio.setAudioVolume(newVolume);
      }
   },
   
   //Block has been added from the menu
   blockAdded : function() {
      IO.socket.emit('blockAdded', App.gameId);
   },

};

IO.init();
App.init();
