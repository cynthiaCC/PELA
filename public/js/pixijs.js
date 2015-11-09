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
   
   //Container for the temporary objects when finished with construction
   tempCont : null,
   
   //Container for UI elements within gameArea
   UI : null,
   
   //The background for easy access
   bg : null,
   
   //Store all the rotators in this, this makes them easier to remove when finished with building.
   rotators : [],
   
   //BlockMenu is stored inside this
   menu : null,
   //TODO: figure the Y value to use at start
   currentMenuY : 55,
   
   //The default texture for rotator
   rotatorTexture : PIXI.Texture.fromImage('img/rotate.png'),

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
      
      //
      pixijs.tempCont = new PIXI.Container();
      pixijs.stage.addChild(pixijs.tempCont);
      
      //Create container for UI elements
      pixijs.UI = new PIXI.Container();
      pixijs.stage.addChild(pixijs.UI);
      pixijs.addFinished();
      
      //Create the menu
      pixijs.blockMenu();
      
      //start the animation
      requestAnimationFrame( pixijs.animate );
      
      
   },
   
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
      //TODO: replace with the proper button and placement
      var button = new PIXI.Graphics();
      button.lineStyle(2, 0x0000FF, 1);
      button.beginFill(0xFF700B, 1);
      button.drawRect(50, 250, 120, 120);
      
      button.interactive = true;
      button.buttonMode = true;
      button
            .on('mousedown', pixijs.onFinished);
      pixijs.UI.addChild(button);
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
   
 //Load the temporary container sent by app
   loadTemp : function(data) {
      //First clear the container
      pixijs.tempCont.children.forEach(function(child,index,array){
         pixijs.recursiveDestroy(child);
      })
      var texture = PIXI.Texture.fromImage(data);
      pixijs.tempCont.removeChildren();
      console.log(data);
      pixijs.tempCont.addChild(new PIXI.Sprite(texture));
      pixijs.stage.addChild(pixijs.tempCont);
   },
   
   //Get an image of the current objects
   getImgOfCurrent : function() {
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
      rotator.interactive = true;
      rotator.anchor.set(0.5);
      rotator.buttonMode = true;
      rotator.position.x = 0;
      //This y value places the rotator above the sprite
      rotator.position.y = -20;
      
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
      sprite.height = 90;
      sprite.width = 100;
      
      //Set the amount of blocks
      sprite.remaining = amount;
      
      //TODO: add a text showing how many are remaining
      
      //Set events
      sprite
            .on('mousedown', pixijs.onMenuClick)
            .on('touchstart', pixijs.onMenuClick);
      
      //Set the position
      sprite.position.x = pixijs.canvasBlockW/2;
      sprite.position.y = pixijs.currentMenuY;
      
      //Add the height+some padding to currentMenuY
      pixijs.currentMenuY += (sprite.height + 10);
      pixijs.menu.addChild(sprite);
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
   },
   
   onRotateStart : function(event) {
      if (typeof this.parent.dragging == "undefined" || this.parent.dragging == false){
         this.data = event.data;
         this.parent.rotating = true;
         this.parent.dragging = false;
      }
   },

   onDragEnd : function()
   {
      this.alpha = 1;

      this.dragging = false;

      // set the interaction data to null
      this.data = null;
   },
   
   onRotateEnd : function() {
      this.parent.rotating = false;
      this.data = null;
   },

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
      App.Player.finishConstruction(pixijs.getImgOfCurrent());
   },
   
   //Function to add from blockMenu
   onMenuClick : function() {
      if (this.remaining > 0) {
         this.remaining--;
         pixijs.addSprite(this.texture);
         //TODO: update the text child once implemented
      }
   },
   
};
