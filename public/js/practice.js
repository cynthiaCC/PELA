/**
 * 
 */
var practice = {
      
    //Dimensions of the canvas
      canvasW : 1024,
      canvasH : 624,
      
      //Scaling variables
      scale : 1,
      
      //The renderer and the stage
      renderer : null,
      stage : null,
      
      
      //Container for UI elements within gameArea
      UI : null,
      
  
      
      //The button for the next tutorial
      nextButton : null,
  
      
      //The button for the previous tutorial
      previousButton : null,
   
      init : function() {
         //Initiate the renderer
         practice.renderer = PIXI.autoDetectRenderer(practice.canvasW, practice.canvasH,undefined,true);
         
         // create the root of the scene graph
         practice.stage = new PIXI.Container();
         
         //Create background from image and add it to the stage
         var first = PIXI.Texture.fromImage('img/tutorial1.png');
         tutorial1 = new PIXI.Sprite(first);
         
         
         tutorial1.height = practice.canvasH;
         tutorial1.width = practice.canvastW;
         practice.stage.addChild(tutorial1);
         
         
         practice.renderer.view.style.border = "3px dashed black";
       
         
         //Create container for UI elements
         practice.UI = new PIXI.Container();
         practice.stage.addChild(practice.UI);
         
         
         //start the animation
         requestAnimationFrame( practice.animate );
         
         practice.resize();
         practice.rendererResize();
      },
      
      
      /**
       * Add listeners for canvas scaling with window resizing and device rotation
       */
      resize : function () {
              window.addEventListener('resize', practice.rendererResize);
              window.addEventListener('deviceOrientation', practice.rendererResize);
      },
      
    //Function for scaling the game to accommodate to device size
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
   
};