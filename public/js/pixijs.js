/* This is for all the pixi.js related functions */
var pixijs = {
   //Dimensions of the canvas
   canvasW : 1024,
   canvasH : 624,
   canvasBlueprintW : 824,
   canvasBlockW : 200,
   
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
   //The button for finishing the construction
   finishButton : null,
   
   //The button for the vocabulary menu
   menuButton : null,
   
   //The button for the info text
   infoButton : null,

   //UI elements for sound adjustement
   voiceSliderLocation : {x : 20, y : 50, padding: 20},
   voiceSlider : null,
   
   //The progress bar for the game
   progressBar : null,
   
   //The background for easy access
   bg : null,
   
   //Store all the rotators in this, this makes them easier to remove when finished with building.
   rotators : [],
   
   //BlockMenu is stored inside this
   menu : null,
   currentMenuY : 55,
   
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
      
      //Create container for UI elements
      pixijs.UI = new PIXI.Container();
      pixijs.stage.addChild(pixijs.UI);
      pixijs.addFinished();
      
    //Create the menu button
      pixijs.addMenuButton();
      
      //Create the info button
      pixijs.createTutorial();
      
      pixijs.createVoiceSlider();
      
      //Create the progress bar
      pixijs.createProgressBar();
      
      
      
      //start the animation
      requestAnimationFrame( pixijs.animate );
      
      
   },
   
   //Create menu to the right side of the canvas for blocks
   blockMenu : function(){
      
      var blockMenu = PIXI.Texture.fromImage('img/block.menu.png');
      pixijs.menu = new PIXI.Sprite(blockMenu);
      pixijs.menu.height = pixijs.canvasH;
      pixijs.menu.width = pixijs.canvasBlockW;
         
      pixijs.menu.position.x = pixijs.canvasBlueprintW;
      pixijs.menu.position.y = 0;
      
      pixijs.stage.addChild(pixijs.menu);
   },
   
   addFinished : function() {
      //Create the button for finishing the game
      var finButton = new PIXI.Texture.fromImage('img/Finish-button.png');
      pixijs.finishButton = new PIXI.Sprite(finButton);
      /*pixijs.finishButton.lineStyle(2, 0x0000FF, 1);
      pixijs.finishButton.beginFill(0xFF700B, 1);
      pixijs.finishButton.drawRect(50, 250, 120, 120);*/
      
      //TODO: the placement could be changed to a better position later on
      pixijs.finishButton.height = 81;
      pixijs.finishButton.width = 201;
      pixijs.finishButton.position.x = 50;
      pixijs.finishButton.position.y = 250;
      pixijs.finishButton.renderable = false;
      pixijs.finishButton
            .on('mousedown', pixijs.onFinished);
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
      pixijs.progressBar.width = 200;
      pixijs.progressBar.height = 22;
      
      //position the bar
      pixijs.progressBar.position.x = 40;
      pixijs.progressBar.position.y = 580;
      
      //Add the bar to the UI container
      pixijs.UI.addChild(pixijs.progressBar);
      
   },
   //Function for the vocabulary menu button
   addMenuButton : function(){
	   
	   var menu = new PIXI.Texture.fromImage('img/temp.png');
	   pixijs.menuButton = new PIXI.Sprite(menu);

	   
	   pixijs.menuButton.buttonMode = true;
	   pixijs.menuButton.interactive = true;
	   
	   pixijs.menuButton.anchor.set(0.5);

	   pixijs.menuButton.position.x = 40; 
	   pixijs.menuButton.position.y = 20;
	   
	  
	   pixijs.menuButton.width = 100;
	   pixijs.menuButton.height = 50;
	   
	   
	   
	   pixijs.UI.addChild(pixijs.menuButton);
   },
   
   createTutorial : function(){
	 
	   var tutorial = new PIXI.Texture.fromImage('img/temp.png');
	   pixijs.infoButton = new PIXI.Sprite(tutorial);
	   
	   pixijs.infoButton.buttonMode = true;
	   pixijs.infoButton.interactive = true;
	   
	   pixijs.infoButton.anchor.set(0.5);

	   pixijs.infoButton.position.x = 750; 
	   pixijs.infoButton.position.y = 30;
	   
	  
	   pixijs.infoButton.width = 50;
	   pixijs.infoButton.height = 50;
	   
	   
	   
	   //create the variables for the text
	   var infoText1 = new PIXI.Text('Open menu to see the vocabulary.' , {font: '10px Arial', fill: 'white', align: 'center'});
	   var infoText2 = new PIXI.Text('Drag blocks to the blue area to build.' , {font: '10px Arial', fill: 'white', align: 'center'});
	   var infoText3 = new PIXI.Text('Click to mute the microphone.' , {font: '10px Arial', fill: 'white', align: 'center'});
	   
	   infoText1.renderable = false;
	   infoText2.renderable = false;
	   infoText3.renderable = false;
	   
	   //Position the texts
	   infoText1.position.x = -300;
	   infoText1.position.y = 20;
	   
	   infoText2.position.x = -150;
	   infoText2.position.y = 100;
	   
	   infoText3.position.x = -250;
	   infoText3.position.y = 200;
	   
	   pixijs.infoButton
	                    .on('mousedown', pixijs.onTutorialStart)
	                    .on('mouseup', pixijs.onTutorialEnd);
	   
	   //Add them to the UI container
	   pixijs.infoButton.addChild(infoText1);
	   pixijs.infoButton.addChild(infoText2);
	   pixijs.infoButton.addChild(infoText3);
	   
	   
	   
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
      pixijs.currentMenuY = 55;
      pixijs.currentBlocks = 0;
      pixijs.blockTotal = 0;
      pixijs.objects.position.x = 0;
      pixijs.objects.position.y = 0;
   },
   
   //Load the temporary container sent by app
   loadTemp : function(data) {
      //First clear the container
      pixijs.clearContainer(pixijs.tempCont);
      var texture = PIXI.Texture.fromImage(data);
      sprite = new PIXI.Sprite(texture);
      sprite.alpha = 0.5;
      sprite.tint = 0x9999FF;
      pixijs.tempCont.addChild(sprite);
   },
   
   //Get an image of the current objects
   getImgOfCurrent : function() {
      pixijs.setActive(null);
      pixijs.renderer.transparent = true;
      pixijs.UI.renderable = false;
      pixijs.menu.renderable = false;
      pixijs.bg.renderable = false;
      pixijs.renderer.render(pixijs.stage);
      var texture = pixijs.renderer.view.toDataURL();
      pixijs.UI.renderable = true;
      pixijs.menu.renderable = true;
      pixijs.bg.renderable = true;
      return texture;
   },
   
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
            var yFromMiddle = averageY - (pixijs.canvasH/2);
            var xFromMiddle = averageX - (pixijs.canvasBlueprintW/2);
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
      
      sprite.position.x = pixijs.canvasBlueprintW/2;
      sprite.position.y = pixijs.canvasH/2;
      
      //Make the rotator
      var rotator = new PIXI.Sprite(pixijs.rotatorTexture);
      //rotator.interactive = true;
      rotator.anchor.set(0.5);
      //rotator.buttonMode = true;
      rotator.renderable = false;
      rotator.position.x = 0;
      //This y value places the rotator above the sprite
      rotator.position.y = - sprite.height;
      
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
      
      //Set height and width
      //sprite.height = 90;
      //sprite.width = 100;
      
      //Set the amount of blocks
      sprite.remaining = amount;
      //Add value amount to the total blocks within construct
      pixijs.blockTotal += parseInt(amount);
      
      
      //Set events
      sprite
            .on('mousedown', pixijs.onMenuClick)
            .on('touchstart', pixijs.onMenuClick);
      
      //Set the position
      sprite.position.x = pixijs.canvasBlockW/2;
      sprite.position.y = pixijs.currentMenuY;
      

    //Add a text showing how many are remaining
      pixijs.createCounter(sprite, sprite.remaining);

      
      //Add the height+some padding to currentMenuY
      pixijs.currentMenuY += (90 + 10);
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
      
      //Create the text
      var objectCount = new PIXI.Text(parts , {font: '20px Arial', fill: 'white', align: 'center'});
         
      objectCount.anchor.set (0.5);
      //objectCount.height = 100;
      //objectCount.width = 100;
      objectCount.position.x = 5;
      objectCount.position.y = 10;
      /*objectCount.position.x = pixijs.canvastW - pixijs.canvasBlockW/2;
      objectCount.position.y = pixijs.currentMenuY;*/
      
      //Create the background for the text
      var fadeBalloon = new PIXI.Sprite(pixijs.fadeBalloon);
      fadeBalloon.anchor.set(0.5);
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
      
      //calculate how many blocks are still in the blockmenu
      var blocksLeft = pixijs.blockTotal - pixijs.currentBlocks;
      
      
      var progressSoFar = pixijs.currentBlocks/pixijs.blockTotal;
      
      var chunksNeeded = Math.floor(progressSoFar/5);
      
    
      
      var barLength = pixijs.progressBar.children.length * chunksNeeded;
      for(var i = 0; i <= chunksNeeded;i += 1 ){
         
       //Create a sprite from the image
         var prog = new PIXI.Texture.fromImage('img/ProgressBarBit5Percent.png');
         progUpdate = new PIXI.Sprite(prog);
         
         
         progUpdate.width = 10;
         progUpdate.height = 22;
         
         progUpdate.position.x = barLength;
         
         
         pixijs.progressBar.addChild(progUpdate);
         
         barLength += 5;
      }
      
      
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
   
   onTutorialStart : function(event){
	   this.data = event.data;
	   
	   this.children.forEach(function(child,index,array){
           child.renderable = true;
        })
	   
   },
   
   onTutorialEnd : function(){
	   this.data = null;
	   
	   this.children.forEach(function(child,index,array){
           child.renderable = false;
        })
   }
};
