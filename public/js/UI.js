$(document).ready(function() {
   
   //Back to main menu button
   $(document.body).on('click', '#backToMainMenu', function() {
      App.showInitScreen();
   });

   $(document.body).on('click', '#audio-button', function() {
      if(App.originalRole == 'Host') {
         console.log(App.audioSettings);
         if(App.audioSettings !== 'mute-audio-video') {
            console.log('Launched, audio settings: ' + App.audioSettings);
            if (App.sessionID !== 'undefined') {
               IO.socket.emit('audioStarted', App.gameId);
            } else {
               IO.socket.emit('audioStarted', App.gameId);
            }
            $('#audio-button').hide();
         }
         else {
            $('#publisherContainer').hide();
         }
      } else {
         console.log('Launched, audio settings: ' + App.audioSettings);
         IO.socket.emit('requestApiKey', App.gameId);
         $('#audio-button').hide();
      }
   });
})
