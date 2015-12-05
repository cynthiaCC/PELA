/* This is for all the pixi.js related functions */
var pixijs = {
   //Dimensions of the canvas
   canvasW : 1024,
   canvasH : 624,
   canvasBlueprintW : 824,
   canvasBlockW : 200,
   
   //Scaling variables
   scale : 1,
   
   //The renderer and the stage
   renderer : null,
   stage : null,
   
   //All the draggable objects are stored here
   objects : null,
   
   //Currently active object
   activeObject : null,
   
   //Container for the temporary objects when finished with construction
   tempCont : null,
   
   //Container for UI elements within gameArea
   UI : null,
   
   //Container for the text within gameArea
   text : null,
   
   //The button for finishing the construction
   finishButton : null,
   
   //The button for the vocabulary menu
   menuButton : null,
   
   //Button for the voice enabling
   communicationButton : null,
   
   //The button for the info text
   infoButton : null,
   
   //Text for comparison
   comparisonText : null,

   //UI elements for sound adjustement
   voiceSliderLocation : {x : 20, y : 50, padding: 20},
   voiceSlider : null,
   
   //The progress bar for the game
   progressBar : null,
   
   //The background for easy access
   bg : null,
   
   //BlockMenu is stored inside this
   menu : null,
   menuBG : null,
   blocksPerPage : 6,
   currentMenuY : (this.canvasH/(this.blocksPerPage*2)),
   menuPage : 1,
   totalPages : 1,
   arrowUp : null,
   arrowDown : null,
   
   //Current blocks on the gamearea
   currentBlocks : 0,
   //Total amount of blocks for the construct
   blockTotal : 0,
   
   //The default texture for rotator
   rotatorTexture : PIXI.Texture.fromImage('img/rotate.png'),
   
 //The default texture for the block number background
   fadeBalloon : PIXI.Texture.fromImage('img/fade_balloon.png'),

   /* ****************************
    *    Initiating functions    *
    ****************************** */
   init : function() {
      //Initiate the renderer
      pixijs.renderer = PIXI.autoDetectRenderer(pixijs.canvasW, pixijs.canvasH,undefined,true);
      
      // create the root of the scene graph
      pixijs.stage = new PIXI.Container();
      
      //Create background from image and add it to the stage
      var background = PIXI.Texture.fromImage('img/blueprint.png');
      pixijs.bg = new PIXI.Sprite(background);
      pixijs.bg.height = pixijs.canvasH;
      pixijs.bg.width = pixijs.canvasBlueprintW;
      pixijs.stage.addChild(pixijs.bg);
      pixijs.renderer.view.style.border = "3px dashed black";
      
      //Create a container for all the objects and add it to stage
      pixijs.objects = new PIXI.Container();
      pixijs.stage.addChild(pixijs.objects);
      
      //The temporary container that will have the instructions for builder and built object for instructor after finishing
      pixijs.tempCont = new PIXI.Container();
      pixijs.stage.addChild(pixijs.tempCont);
      
      //Create the menu
      pixijs.blockMenu();
      
      //Create the text container
      pixijs.text = new PIXI.Container();
      pixijs.stage.addChild(pixijs.text);
      pixijs.text.renderable = false;
      
      //Create container for UI elements
      pixijs.UI = new PIXI.Container();
      pixijs.stage.addChild(pixijs.UI);
      pixijs.addFinished();
      
    //Create the menu button
      pixijs.addMenuButton();
      
      pixijs.addCommunicationButton();
      
      //Create the info button
      pixijs.createTutorial();
      pixijs.createComparison();
      pixijs.createVoiceSlider();
      
      //Create the progress bar
      pixijs.createProgressBar();
      
   
      
      //start the animation
      requestAnimationFrame( pixijs.animate );
      
      pixijs.resize();
      pixijs.rendererResize();
   },
   
   /**
    * Add listeners for canvas scaling with window resizing and device rotation
    */
   resize : function () {
           window.addEventListener('resize', pixijs.rendererResize);
           window.addEventListener('deviceOrientation', pixijs.rendererResize);
   },
   
   //Create the text for comparison and a button to restart with swapped roles
   createComparison : function() {
      pixijs.comparisonText = new PIXI.Text('Test', {font: '40px Arial', fill: 'white', align: 'center', stroke:'black', strokeThickness : 1});
      pixijs.comparisonText.position.x = pixijs.canvasBlueprintW/2;
      pixijs.comparisonText.position.y = pixijs.canvasH - 100;
      pixijs.comparisonText.anchor.set(0.5);
      pixijs.comparisonText.renderable = false;
      
      var button = new PIXI.Sprite(PIXI.Texture.fromImage('img/temp.png'));
      button.anchor.set(0.5);
      button
            .on('mousedown', pixijs.onNewRound)
            .on('touchstart', pixijs.onNewRound);
      button.position.y = 40;
      pixijs.comparisonText.addChild(button);
      
      pixijs.UI.addChild(pixijs.comparisonText);
   },
   //Create menu to the right side of the canvas for blocks
   //Create menu to the right side of the canvas for blocks
   blockMenu : function(){
      //Add the image of the menu
      var blockMenu = new PIXI.Sprite(PIXI.Texture.fromImage('img/block.menu.png'));
      blockMenu.height = pixijs.canvasH;
      blockMenu.width = pixijs.canvasBlockW;
         
      blockMenu.position.x = pixijs.canvasBlueprintW;
      blockMenu.position.y = 0;
      
      //TODO replace with the proper texture
      pixijs.arrowUp = new PIXI.Sprite(PIXI.Texture.fromImage('img/temp.png'));
      pixijs.arrowUp.position.y = 10;
      pixijs.arrowUp.position.x = pixijs.canvasBlockW - 20;
      pixijs.arrowUp.renderable = false;
      pixijs.arrowUp
               .on('mousedown', pixijs.onArrowUp)
               .on('touchstart', pixijs.onArrowUp);
      pixijs.arrowDown = new PIXI.Sprite(PIXI.Texture.fromImage('img/temp.png'));
      pixijs.arrowDown.position.y = pixijs.canvasH - 30;
      pixijs.arrowDown.position.x = pixijs.canvasBlockW - 20;
      pixijs.arrowDown.renderable = false;
      pixijs.arrowDown
               .on('mousedown', pixijs.onArrowDown)
               .on('touchstart', pixijs.onArrowDown);
      blockMenu.addChild(pixijs.arrowUp);
      blockMenu.addChild(pixijs.arrowDown);
      
      pixijs.menu = new PIXI.Container();
      blockMenu.addChild(pixijs.menu);
      
      pixijs.menuBg = blockMenu;
      pixijs.stage.addChild(blockMenu);
   },
   
   addFinished : function() {
      //Create the button for finishing the game
      var finButton = new PIXI.Texture.fromImage('img/Finish-button.png');
      pixijs.finishButton = new PIXI.Sprite(finButton);
      
      //TODO: the placement could be changed to a better position later on
      pixijs.finishButton.height = 81;
      pixijs.finishButton.width = 201;
      pixijs.finishButton.position.x = 50;
      pixijs.finishButton.position.y = 250;
      pixijs.finishButton.renderable = false;
      pixijs.finishButton
            .on('mousedown', pixijs.onFinished)
            .on('touchstart', pixijs.onFinished);
      pixijs.UI.addChild(pixijs.finishButton);
   },
   //Function that creates the progress bar
   createProgressBar : function(){
      
      //Create a sprite from the image
      var pBar = new PIXI.Texture.fromImage('img/ProgressBarOutline.png');
      pixijs.progressBar = new PIXI.Sprite(pBar);
      
      //Set it to the default anchor
      pixijs.progressBar.anchor.set(0.0);
      
      //Bar width and height
      //pixijs.progressBar.width = 200;
      //pixijs.progressBar.height = 20;
      
      //position the bar
      pixijs.progressBar.position.x = 40;
      pixijs.progressBar.position.y = 580;
      
      pixijs.progressBar.children = [];
      
      //Add the bar to the UI container
      pixijs.UI.addChild(pixijs.progressBar);
      
   },
   //Function for the vocabulary menu button
   addMenuButton : function(){
      
	   //Create the icon from the image
      var menu = new PIXI.Texture.fromImage('img/temp.png');
      pixijs.menuButton = new PIXI.Sprite(menu);

      //Set it to be interactive
      pixijs.menuButton.buttonMode = true;
      pixijs.menuButton.interactive = true;
      
      //Anchor and position it
      pixijs.menuButton.anchor.set(0.5);

      pixijs.menuButton.position.x = 40; 
      pixijs.menuButton.position.y = 20;
      
     
      pixijs.menuButton.width = 100;
      pixijs.menuButton.height = 50;
      
      
      //Add it to the UI container
      pixijs.UI.addChild(pixijs.menuButton);
   },
   
   //Function for the communication button
   addCommunicationButton : function(){
      
	   //Create the icon from the image
      var voice = new PIXI.Texture.fromImage('img/temp.png');
      pixijs.communicationButton = new PIXI.Sprite(voice);
      
      
      if(App.originalRole == 'Player'){
    	  pixijs.communicationButton.renderable = false;
	  	   pixijs.communicationButton.interactive = false;
	  	   pixijs.communicationButton.buttonMode = false;
      }
      else{
    	  
    	//Set it to be interactive
    	  pixijs.communicationButton.renderable = true;
	  	   pixijs.communicationButton.interactive = true;
	  	   pixijs.communicationButton.buttonMode = true;
      }
      
      
      //Anchor and position it
      pixijs.communicationButton.anchor.set(0.5);

      pixijs.communicationButton.position.x = 300; 
      pixijs.communicationButton.position.y = 20;
      
     
      pixijs.communicationButton.width = 100;
      pixijs.communicationButton.height = 50;
      
      pixijs.communicationButton.on('mousedown', pixijs.onCommunicationStart)
                                .on('touchstart', pixijs.onCommunicationStart);
      
      //Add it to the UI container
      pixijs.UI.addChild(pixijs.communicationButton);
   },
   
   //Function that creates the tutorial texts in the play area
   createTutorial : function(){
      
      //Create the button
      var tutorial = new PIXI.Texture.fromImage('img/temp.png');
      pixijs.infoButton = new PIXI.Sprite(tutorial);
      
      //Hide it from the instructor because the info is for the builder
      if(App.originalRole == 'Host'){
         pixijs.infoButton.buttonMode = false;
         pixijs.infoButton.interactive = false;
         pixijs.infoButton.renderable = false;
      }
      else{
         //Make it interactive, position it etc.
         pixijs.infoButton.buttonMode = true;
         pixijs.infoButton.interactive = true;
         pixijs.infoButton.renderable = true;
      }
     
      
      pixijs.infoButton.anchor.set(0.5);

      pixijs.infoButton.position.x = 750; 
      pixijs.infoButton.position.y = 30;
      
     
      pixijs.infoButton.width = 50;
      pixijs.infoButton.height = 50;
      
      
      
      //create the variables for the text
      var infoText1 = new PIXI.Text('Open menu to see the vocabulary.' , {font: '20px Arial', fill: 'white', align: 'center'});
      var infoText2 = new PIXI.Text('Click or tap blocks on the grey area to build.' , {font: '20px Arial', fill: 'white', align: 'center'});
      var infoText3 = new PIXI.Text('Slide the slider up and down to change voice volume.' , {font: '20px Arial', fill: 'white', align: 'center'});
     
      
      //Position the texts
      infoText1.position.x = 50;
      infoText1.position.y = 50;
      
      infoText2.position.x = 500;
      infoText2.position.y = 100;
      
      infoText3.position.x = 100;
      infoText3.position.y = 510;
      
      //Events for the text
      pixijs.infoButton
                       .on('mousedown', pixijs.onTutorialStart)
                       .on('mouseup', pixijs.onTutorialEnd)
                       .on('touchstart', pixijs.onTutorialStart)
                        .on('mouseupoutside', pixijs.onTutorialEnd)
                        .on('touchend', pixijs.onTutorialEnd)
                        .on('touchendoutside', pixijs.onTutorialEnd);
      
      //Add them to the text container
      pixijs.text.addChild(infoText1);
      pixijs.text.addChild(infoText2);
      pixijs.text.addChild(infoText3);
      
      
      //Add the button to the UI container
      pixijs.UI.addChild(pixijs.infoButton);
   },
   
   //Create the voice slider for adjusting voice communication volume
   createVoiceSlider : function() {
      var texture = new PIXI.Texture.fromImage('img/temp.png');
      pixijs.voiceSlider = new PIXI.Sprite(texture);
      
      //Set the slider interactive
      pixijs.voiceSlider.buttonMode = true;
      pixijs.voiceSlider.interactive = true;
      
      //Set anchor to middle, adjust into position
      pixijs.voiceSlider.anchor.set(0.5);
      pixijs.voiceSlider.position.x = pixijs.voiceSliderLocation.x;
      pixijs.voiceSlider.position.y = pixijs.canvasH - pixijs.voiceSliderLocation.y - pixijs.voiceSliderLocation.padding;
      
      //Set the events
      pixijs.voiceSlider
                        .on('mousedown', pixijs.onSliderDragStart)
                        .on('touchstart', pixijs.onSliderDragStart)
                        //events for drag end
                        .on('mouseup', pixijs.onSliderDragEnd)
                        .on('mouseupoutside', pixijs.onSliderDragEnd)
                        .on('touchend', pixijs.onSliderDragEnd)
                        .on('touchendoutside', pixijs.onSliderDragEnd)
                        // events for drag move
                        .on('mousemove', pixijs.onSliderDragMove)
                        .on('touchmove', pixijs.onSliderDragMove);
      
      pixijs.UI.addChild(pixijs.voiceSlider);
   },
   
   /* ************************
    *    Called functions    *
    ************************** */
   
   
   //Recursively destroy the given pixijs object
   recursiveDestroy: function(object) {
      if(typeof object.children != "undefined"){
         if (object.children.length > 0) {
            object.children.forEach(function(child,index,array){
               pixijs.recursiveDestroy(child);
            })
         }
      }
    //Finally destroy the object itself
      object.destroy();
   },
   
   
   
   //Clear the given container completely
   clearContainer : function(container) {
      container.children.forEach(function(child,index,array){
         pixijs.recursiveDestroy(child);
      })
      container.removeChildren();
   },
   
   //Clear all containers
   clearAll : function() {
      pixijs.clearContainer(pixijs.objects);
      pixijs.clearContainer(pixijs.menu);
      pixijs.clearContainer(pixijs.tempCont);
      pixijs.clearContainer(pixijs.progressBar);
      pixijs.currentMenuY = pixijs.canvasH/(pixijs.blocksPerPage*2);
      pixijs.currentBlocks = 0;
      pixijs.blockTotal = 0;
      pixijs.objects.position.x = 0;
      pixijs.objects.position.y = 0;
      pixijs.comparisonText.renderable = false;
      pixijs.comparisonText.getChildAt(0).interactive = false;
      pixijs.comparisonText.getChildAt(0).buttonMode = false;
      pixijs.menu.position.x = 0;
      pixijs.menu.position.y = 0;
      pixijs.menuPage = 1;
      pixijs.totalPages = 1;
      pixijs.arrowUp.renderable = false;
      pixijs.arrowUp.interactive = false;
      pixijs.arrowUp.buttonMode = false;
      pixijs.arrowDown.renderable = false;
      pixijs.arrowDown.interactive = false;
      pixijs.arrowDown.buttonMode = false;
   },
   
   //Load the temporary container sent by app
   loadTemp : function(data) {
      //First clear the container
      pixijs.clearContainer(pixijs.tempCont);
      var texture = PIXI.Texture.fromImage(data);
      sprite = new PIXI.Sprite(texture);
      sprite.height = pixijs.canvasH;
      sprite.width = pixijs.canvasW;
      sprite.alpha = 0.5;
      sprite.tint = 0x9999FF;
      pixijs.tempCont.addChild(sprite);
   },
   
   //Set back to original resolution
   resetResolution : function() {
      pixijs.renderer.resize(pixijs.canvasW, pixijs.canvasH);
      pixijs.renderer.view.height = pixijs.canvasH;
      pixijs.renderer.view.style.height = pixijs.canvasH + 'px';
      pixijs.renderer.view.width = pixijs.canvasW;
      pixijs.renderer.view.style.width = pixijs.canvasW + 'px';
      pixijs.stage.scale.x = pixijs.stage.scale.y = 1;
   },
   //Get an image of the current objects
   getImgOfCurrent : function() {
      pixijs.resetResolution();
      pixijs.setActive(null);
      pixijs.renderer.transparent = true;
      pixijs.UI.renderable = false;
      pixijs.menuBg.renderable = false;
      pixijs.text.renderable = false;
      pixijs.bg.renderable = false;
      pixijs.tempCont.renderable = false;
      pixijs.renderer.render(pixijs.stage);
      var texture = pixijs.renderer.view.toDataURL();
      pixijs.UI.renderable = true;
      pixijs.menuBg.renderable = true;
      pixijs.bg.renderable = true;
      pixijs.tempCont.renderable = true;
      pixijs.rendererResize();
      return texture;
   },
   
 /*/Get an image of the current temp
   getImgOfTemp : function() {
      pixijs.resetResolution();
      pixijs.renderer.transparent = true;
      pixijs.UI.renderable = false;
      pixijs.menuBg.renderable = false;
      pixijs.text.renderable = false;
      pixijs.bg.renderable = false;
      pixijs.objects.renderable = false;
      pixijs.renderer.render(pixijs.stage);
      var texture = pixijs.renderer.view.toDataURL();
      pixijs.UI.renderable = true;
      pixijs.menuBg.renderable = true;
      pixijs.bg.renderable = true;
      pixijs.objects.renderable = true;
      pixijs.rendererResize();
      return texture;
   },*/
   
   //Center the built construction
   centerObjects : function() {
      if (pixijs.blockTotal > 0){
         if(pixijs.objects.children != null) {
            //Calculate the average X and Y values
            var averageY = 0;
            var averageX = 0;
            pixijs.objects.children.forEach(function(child,index,array){
               averageY += child.position.y;
               averageX += child.position.x;
            })
            averageY = averageY/pixijs.blockTotal;
            averageX = averageX/pixijs.blockTotal;
            //Figure the distance from middle
            var yFromMiddle = averageY - ((pixijs.canvasH)/2);
            var xFromMiddle = averageX - ((pixijs.canvasBlueprintW)/2);
            //Move the container of objects
            pixijs.objects.position.y = -yFromMiddle;
            pixijs.objects.position.x = -xFromMiddle;
         }
      }
   },
   
   
   //This function adds the sprite in middle of the playable area
   addSprite : function(texture, scale) {
      //Create the sprite
      var sprite = new PIXI.Sprite(texture);
      
      //Set it interactive
      sprite.interactive = true;
      
      //Set the cursor to change into clicking mode when hovering over it
      sprite.buttonMode = true;
      
      //Set the anchor in the middle of the sprite
      sprite.anchor.set(0.5);
      
      //Set the scale of the sprite if defined
      if (typeof scale != "undefined") {
         sprite.scale = scale;
      }
      
      //Add events
      sprite
            .on('mousedown', pixijs.onDragStart)
            .on('touchstart', pixijs.onDragStart)
            // events for drag end
            .on('mouseup', pixijs.onDragEnd)
            .on('mouseupoutside', pixijs.onDragEnd)
            .on('touchend', pixijs.onDragEnd)
            .on('touchendoutside', pixijs.onDragEnd)
            // events for drag move
            .on('mousemove', pixijs.onDragMove)
            .on('touchmove', pixijs.onDragMove);
      
      sprite.position.x = Math.floor(Math.random() * (pixijs.canvasBlueprintW+1));
      sprite.position.y = Math.floor(Math.random() * (pixijs.canvasH+1));
      
      //Make the rotator
      var rotator = new PIXI.Sprite(pixijs.rotatorTexture);
      //rotator.interactive = true;
      rotator.anchor.set(0.5);
      //rotator.buttonMode = true;
      rotator.renderable = false;
      rotator.position.x = 0;
      //This y value places the rotator above the sprite
      rotator.position.y = - (sprite.height/2 + 10);
      
      //Add events
      rotator
            // events for drag start
            .on('mousedown', pixijs.onRotateStart)
            .on('touchstart', pixijs.onRotateStart)
            // events for drag end
            .on('mouseup', pixijs.onRotateEnd)
            .on('mouseupoutside', pixijs.onRotateEnd)
            .on('touchend', pixijs.onRotateEnd)
            .on('touchendoutside', pixijs.onRotateEnd)
            // events for drag rotate
            .on('mousemove', pixijs.onDragRotate)
            .on('touchmove', pixijs.onDragRotate);
      
      //Add rotator to the sprite
      sprite.addChild(rotator);
      //Add the sprite to the objects container
      pixijs.objects.addChild(sprite);
      pixijs.setActive(sprite);
   },
   
   //Add a sprite to the block menu and add the on functions to it
   addToBlockMenu : function(texture, amount) {
      //Create the sprite
      var sprite = new PIXI.Sprite(texture);
      
      //Set it interactive
      sprite.interactive = true;
      
      //Set the cursor to change into clicking mode when hovering over it
      sprite.buttonMode = true;
      
      //Set the anchor in the middle of the sprite
      sprite.anchor.set(0.5);
      
      //Set scale
      var scale = 1;
      
      if (sprite.width < 10) {
         scale = 10/sprite.width;
      }
      if (sprite.width > pixijs.canvasBlockW - 20) {
         scale = (pixijs.canvasBlockW - 20)/sprite.width;
      }
      if (sprite.height > (pixijs.canvasH/pixijs.blocksPerPage) - 20) {
         if (scale > ((pixijs.canvasH/pixijs.blocksPerPage) - 20)/sprite.height){
            scale = ((pixijs.canvasH/pixijs.blocksPerPage) - 20)/sprite.height;
         }
      }
      
      console.log(scale);
      
      sprite.scale.set(scale, scale);
      
      //Set the amount of blocks
      sprite.remaining = amount;
      //Add value amount to the total blocks within construct
      pixijs.blockTotal += parseInt(amount);
      
      
      //Set events
      sprite
            .on('mousedown', pixijs.onMenuClick)
            .on('touchstart', pixijs.onMenuClick);
      
      //Set the position
      sprite.position.x = (pixijs.canvasBlockW)/2;
      sprite.position.y = pixijs.currentMenuY;
      

    //Add a text showing how many are remaining
      pixijs.createCounter(sprite, sprite.remaining);

      
      //Add the height+some padding to currentMenuY
      pixijs.currentMenuY += pixijs.canvasH/pixijs.blocksPerPage;
      pixijs.menu.addChild(sprite);
   },
   
   //Add a blueprint to the playarea for instructor to describe
   addBlueprint : function(texture) {
      //Create the sprite
      var sprite = new PIXI.Sprite(texture);
      
      //Set the anchor in the middle of the sprite
      sprite.anchor.set(0.5);
      
      //Put in middle
      sprite.position.x = pixijs.canvasBlueprintW/2;
      sprite.position.y = pixijs.canvasH/2;

      //Add the sprite to the objects container
      if(App.myRole == "Host") {
         pixijs.objects.addChild(sprite);
      }
      else {
         pixijs.tempCont.addChild(sprite);
      }
   },
   
   //function that creates the counter for each object
   createCounter : function(spriteObj, parts){
      //if(spriteObj.children.length > 0){
      //for (var i = spriteObj.children.length - 1; i >= 0; i--) {
      //   spriteObj.removeChild(spriteObj.children[i]);
      //}
      //}
      //spriteObj.removeChildren();
      var scale = 1/spriteObj.scale.x;
      //Create the text
      var objectCount = new PIXI.Text(parts , {font: '20px Arial', fill: 'white', align: 'center'});
         
      objectCount.anchor.set (0.5);
      //objectCount.height = 100;
      //objectCount.width = 100;
      objectCount.scale.set(scale, scale);
      objectCount.position.x = 5;
      objectCount.position.y = 10;
      /*objectCount.position.x = pixijs.canvastW - pixijs.canvasBlockW/2;
      objectCount.position.y = pixijs.currentMenuY;*/
      
      //Create the background for the text
      var fadeBalloon = new PIXI.Sprite(pixijs.fadeBalloon);
      fadeBalloon.anchor.set(0.5);
      fadeBalloon.scale.set(scale, scale);
      //fadeBalloon.height = 20;
      //fadeBalloon.width = 20;
      fadeBalloon.position.x = 5;
      fadeBalloon.position.y = 10;
      /*fadeBalloon.buttonMode = true;
      fadeBalloon.position.x = pixijs.canvasW - pixijs.canvasBlockW/2;
      fadeBalloon.position.y = pixijs.currentMenuY;*/
      
      //Adds the counter and the background to the parent sprite
      spriteObj.addChild(fadeBalloon);
      spriteObj.addChild(objectCount);
         
   },
   
   //function that updates the progress bar
   updateProgress : function(){
      
      //Calculate how many pieces of the bar are needed
      var progress = Math.floor(((pixijs.currentBlocks/pixijs.blockTotal)*100)/5);
	   
      //Loop that adds the pieces to the progress bar. Runs as long as there are fewer
      //bar children than there should be
      while(progress > pixijs.progressBar.children.length){
    	  
        //Create a sprite from the image
         var prog = new PIXI.Texture.fromImage('img/ProgressBarBit5Percent.png');
         progUpdate = new PIXI.Sprite(prog);
         
         
         //If there are no children(bar is empty) then the first piece goes to the beginning
         if(pixijs.progressBar.children.length == 0){
        	 
        	 progUpdate.position.x = 1;
             progUpdate.position.y = 1;
         }
         //If there are children , then place the new piece after the ones that are already there
         else{
             progUpdate.position.x = pixijs.progressBar.getChildAt(pixijs.progressBar.children.length - 1).position.x + 10;
             progUpdate.position.y = 1;
         }
         
         //Add the bits of bar to the progress bar
         pixijs.progressBar.addChild(progUpdate);
         
        
      }
   },
   
   vocabularyMenu : function(){
    
      var menuFile = "JSON/menu.json";
      var menuJSON;
      $.getJSON(menuFile, function(data){
      menuJSON = data;
          });
	   
      var loader = PIXI.loader;
      $.each(menuJSON.parts, function(index, value) {
         var path = 'img' + value.thumbnailImg;
         var name = "part" + index;
         loader.add(name, path);
         loader.load(function(loader, resources){
            pixijs.onVocMenuClick(resources[name].texture);
         });
      });
      
	   
   },
   
   //Sets the given object as active in the playarea
   setActive : function(object){
      if(pixijs.activeObject != null){
         if (pixijs.activeObject.children != null) {
            pixijs.activeObject.children.forEach(function(child,index,array){
               child.interactive = false;
               child.buttonMode = false;
               child.renderable = false;
            })
         }
      }
      if(object != null) {
         object.children.forEach(function(child,index,array){
            child.interactive = true;
            child.buttonMode = true;
            child.renderable = true;
         })
         pixijs.objects.setChildIndex(object, pixijs.objects.children.length - 1);
      }
      pixijs.activeObject = object;
   },
   
   showComparison : function(data) {
      var blueprintImage = new Image();
      blueprintImage.src = 'img/' + App.currentCompilation.compilationImg;
      blueprintImage.onload = function() {
         var possibleChangePercentage = ((2*blueprintImage.height*blueprintImage.width)/(pixijs.canvasH*pixijs.canvasW))*100;
         pixijs.comparisonText.renderable = true;
         pixijs.comparisonText.text = Math.floor((data.misMatchPercentage/possibleChangePercentage)*100) + "% is different";
         pixijs.comparisonText.getChildAt(0).interactive = true;
         pixijs.comparisonText.getChildAt(0).buttonMode = true;
      }
   },
   
   rendererResize : function() {
      var width = window.innerWidth,
      height = window.innerHeight;
      
      
      /**
        * Scale the canvas horizontally and vertically keeping in mind the screen estate we have
        * at our disposal. This keeps the relative game dimensions in place.
        */
      var scaleWidth = width /pixijs.canvasW;
      var scaleHeight = height / pixijs.canvasH;
       
      /**
        * Set the canvas size and display size
        * 
        */
      if (scaleHeight < scaleWidth) {
         pixijs.scale = scaleHeight;
         pixijs.renderer.view.height = Math.min(pixijs.canvasH, height * window.devicePixelRatio);
         pixijs.renderer.view.style.height = Math.min(pixijs.canvasH, height) + 'px';
         pixijs.renderer.view.width = pixijs.canvasW * Math.min(1,pixijs.scale);
         pixijs.renderer.view.style.width = pixijs.canvasW * Math.min(1,pixijs.scale) + 'px';
         pixijs.stage.scale.x = pixijs.stage.scale.y = Math.min(1,pixijs.scale);
      } else {
         pixijs.scale = scaleWidth;
         pixijs.renderer.view.width = Math.min(pixijs.canvasW, width * window.devicePixelRatio);
         pixijs.renderer.view.style.width = Math.min(pixijs.canvasW, width) + 'px';
         pixijs.renderer.view.height = pixijs.canvasH * Math.min(1,pixijs.scale);
         pixijs.renderer.view.style.height = pixijs.canvasH * Math.min(1,pixijs.scale) + 'px';
         pixijs.stage.scale.x = pixijs.stage.scale.y = Math.min(1, pixijs.scale);
      }
      /**
        * Resize the PIXI renderer
        * Let PIXI know that we changed the size of the viewport
        */
          pixijs.renderer.resize(pixijs.renderer.view.width, pixijs.renderer.view.height);

      /**
        * iOS likes to scroll when rotating - fix that 
        */
      window.scrollTo(0, 0);
      
    },
   
   /* *****************
    *    Animation    *
    ******************* */
   
   //The animation function, set any per frame calculations and functions here
   animate : function() {

      requestAnimationFrame(pixijs.animate);

      // render the stage
      pixijs.renderer.render(pixijs.stage);
   },

   /* ********************
    *    On functions    *
    ********************** */
   //Player starts dragging the object from somewhere else besides the rotator
   onDragStart : function(event)
   {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      if (typeof this.rotating == "undefined" || this.rotating == false){
         this.data = event.data;
         this.alpha = 0.5;
         this.dragging = true;
         this.rotating = false;
      }
      pixijs.setActive(this);
   },
   
   //Begin the rotation towards the mouse
   onRotateStart : function(event) {
      if (typeof this.parent.dragging == "undefined" || this.parent.dragging == false){
         this.data = event.data;
         this.parent.rotating = true;
         this.parent.dragging = false;
      }
   },

   //Stop the movement of the object
   onDragEnd : function()
   {
      this.alpha = 1;

      this.dragging = false;

      // set the interaction data to null
      this.data = null;
   },
   
   //Rotating of the object has ended
   onRotateEnd : function() {
      this.parent.rotating = false;
      this.data = null;
   },
   
   //Moves the object within the playarea
   onDragMove : function()
   {
      if (this.dragging)
      {
         var newPosition = this.data.getLocalPosition(this.parent);
         this.position.x = Math.max(0, Math.min(newPosition.x, pixijs.canvasBlueprintW));
         this.position.y = Math.max(0, Math.min(newPosition.y, pixijs.canvasH));
      }
   },
   
   //Function to rotate an object with a rotator child object
   //Note, DO NOT APPLY THIS EVEN TO AN OBJECT WITHOUT PARENT OBJECT. 
   //Only apply to rotators. Place the rotator above the sprite when rotation is set to 0
   onDragRotate : function() {
      if (this.parent.rotating) {
         var pointerPosition = this.data.global;
         this.parent.rotation = Math.atan2(pointerPosition.y - this.parent.position.y, pointerPosition.x - this.parent.position.x) + (PIXI.DEG_TO_RAD * 90);
      }
   },
   
   
   
   //Function to call when player clicks the button to finish the build, also hide the button again
   onFinished : function() {
      this.renderable = false;
      this.interactive = false;
      this.buttonMode = false;
      pixijs.centerObjects();
      App.Player.finishConstruction(pixijs.getImgOfCurrent());
   },
   
   //Function to add from blockMenu
   onMenuClick : function() {
      if (this.remaining > 0) {
         App.Player.blockAdded();
         pixijs.currentBlocks++;
         this.remaining--;
         pixijs.addSprite(this.texture);
         pixijs.updateProgress();
         var newtext = this.remaining.toString();
         //pixijs.createCounter(pixijs.sprite, this.remaining);
         if(typeof this.children != "undefined") {
            this.children.forEach(function(child,index,array){
               if(typeof child.text != "undefined"){
                  child.text = newtext;
               }
            })
         }
         if (pixijs.currentBlocks == pixijs.blockTotal){
            pixijs.finishButton.renderable = true;
            pixijs.finishButton.interactive = true;
            pixijs.finishButton.buttonMode = true;
         }
      }
   },
   
   //Events for voice slider
   onSliderDragStart : function(event) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
   },
   
   onSliderDragEnd : function() {
      this.alpha = 1;

      this.dragging = false;

      // set the interaction data to null
      this.data = null;
      App.setVolume((pixijs.canvasH - this.position.y-pixijs.voiceSliderLocation.padding)/50*100);
   },
   
   onSliderDragMove : function() {
      if (this.dragging)
      {
         var newPosition = this.data.getLocalPosition(this.parent);
         this.position.y = Math.max(pixijs.canvasH - pixijs.voiceSliderLocation.y - pixijs.voiceSliderLocation.padding, Math.min(newPosition.y, pixijs.canvasH - pixijs.voiceSliderLocation.padding));
      }
   },
   
   //function to make the text viewable
   onTutorialStart : function(event){
      this.data = event.data;
     
      //Show the text if the button is pressed if you are the builder
      if(App.originalRole == 'Host'){
         pixijs.text.renderable = false;
      }
      else{
         pixijs.text.renderable = true;
      }    
      
   },
   //Function the hide the text
   onTutorialEnd : function(){
      this.data = null;
      //hide the info texts
      pixijs.text.renderable = false;
   },
   
   onArrowDown : function(){
      if(pixijs.menuPage < pixijs.totalPages) {
         pixijs.menu.position.y -= pixijs.canvasH;
         pixijs.menuPage++;
         if (pixijs.menuPage === pixijs.totalPages) {
            this.renderable = false;
            this.interactive = false;
            this.buttonMode = false;
         }
         if(pixijs.menuPage > 1) {
            pixijs.arrowUp.renderable = true;
            pixijs.arrowUp.interactive = true;
            pixijs.arrowUp.buttonMode = true;
         }
      }
   },
   
   onArrowUp : function(){
      if (pixijs.menuPage > 1) {
         pixijs.menu.position.y += pixijs.canvasH;
         pixijs.menuPage--;
         if (pixijs.menuPage === 1) {
            this.renderable = false;
            this.interactive = false;
            this.buttonMode = false;
         }
         if (pixijs.menuPage < pixijs.totalPages) {
            pixijs.arrowDown.renderable = true;
            pixijs.arrowDown.interactive = true;
            pixijs.arrowDown.buttonMode = true;
         }
      }
   },
   
   onVocMenuClick : function(){
     
      
   },
   
   onNewRound : function() {
      App.startNewRound();
   },
   
   onCommunicationStart : function(){
	   
	   if(App.originalRole == 'Host') {
	   
	         console.log(App.audioSettings);
	         if(App.audioSettings !== 'mute-audio-video') {
	            console.log('Launched, audio settings: ' + App.audioSettings);
	            if (App.sessionID !== 'undefined') {
	               IO.socket.emit('audioStarted', App.gameId);
	            } else {
	               IO.socket.emit('audioStarted', App.gameId);
	            }
	            pixijs.communicationButton.renderable = false;
	         pixijs.communicationButton.interactive = false;
	         pixijs.communicationButton.buttonMode = false;
	         }
	         else {
	          pixijs.communicationButton.renderable = false;
             pixijs.communicationButton.interactive = false;
             pixijs.communicationButton.buttonMode = false;
	         }
	      } else {
	         console.log('Launched, audio settings: ' + App.audioSettings);
	         IO.socket.emit('requestApiKey', App.gameId);
	         pixijs.communicationButton.renderable = false;
	      pixijs.communicationButton.interactive = false;
	      pixijs.communicationButton.buttonMode = false;
	      }
	   
	   
	   
   },
   
};
