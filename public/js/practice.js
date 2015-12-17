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
         var scaleWidth = width /practice.canvasW;
         var scaleHeight = height / practice.canvasH;
          
         /**
           * Set the canvas size and display size
           * 
           */
         if (scaleHeight < scaleWidth) {
            practice.scale = scaleHeight;
            practice.renderer.view.height = Math.min(practice.canvasH, height * window.devicePixelRatio);
            practice.renderer.view.style.height = Math.min(practice.canvasH, height) + 'px';
            practice.renderer.view.width = practice.canvasW * Math.min(1,practice.scale);
            practice.renderer.view.style.width = practice.canvasW * Math.min(1,practice.scale) + 'px';
            practice.stage.scale.x = practice.stage.scale.y = Math.min(1,practice.scale);
         } else {
            practice.scale = scaleWidth;
            practice.renderer.view.width = Math.min(practice.canvasW, width * window.devicePixelRatio);
            practice.renderer.view.style.width = Math.min(practice.canvasW, width) + 'px';
            practice.renderer.view.height = practice.canvasH * Math.min(1,practice.scale);
            practice.renderer.view.style.height = practice.canvasH * Math.min(1,practice.scale) + 'px';
            practice.stage.scale.x = practice.stage.scale.y = Math.min(1, practice.scale);
         }
         /**
           * Resize the PIXI renderer
           * Let PIXI know that we changed the size of the viewport
           */
             practice.renderer.resize(practice.renderer.view.width, practice.renderer.view.height);

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

         requestAnimationFrame(practice.animate);

         // render the stage
         practice.renderer.render(practice.stage);
      },
   
};