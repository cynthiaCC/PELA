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
      
      
      //Container for pictures
      pictures : null,
      
      UI : null,
      
      //The button for the next tutorial
      nextButton : null,
  
      
      //The button for the previous tutorial
      previousButton : null,
      
      //Variables for the tutoril pictures
      first : PIXI.Texture.fromImage('img/tutorial1.png'),
      
      second : PIXI.Texture.fromImage('img/tutorial2.png'),
      
      third : PIXI.Texture.fromImage('img/tutorial3.png'),
      fourth : PIXI.Texture.fromImage('img/tutorial4.png'),
      
      tutorial1 : null,
      
      tutorial2 : null,
      tutorial3 : null,
      tutorial4 : null,
      
      //TODO: Implement a proper way to show the pictures using the JSON-file since this is really ugly
      init : function() {
         //Initiate the renderer
         practice.renderer = PIXI.autoDetectRenderer(practice.canvasW, practice.canvasH,undefined,true);
         
         // create the root of the scene graph
         practice.stage = new PIXI.Container();
         
         //Create background from image
         practice.tutorial1 = new PIXI.Sprite(practice.first);
         practice.tutorial2 = new PIXI.Sprite(practice.second);
         practice.tutorial3 = new PIXI.Sprite(practice.third);
         practice.tutorial4 = new PIXI.Sprite(practice.fourth);
         
         //Ony render the first image initially
         practice.tutorial2.renderable = false;
         practice.tutorial3.renderable = false;
         practice.tutorial4.renderable = false;
         
         
         //Create the stage
         practice.pictures = new PIXI.Container();
         practice.stage.addChild(practice.pictures);
         
         
         //The the image heights and widths
         practice.tutorial1.height = practice.canvasH;
         practice.tutorial1.width = practice.canvastW;
         
         practice.tutorial2.height = practice.canvasH;
         practice.tutorial2.width = practice.canvastW;
         
         practice.tutorial3.height = practice.canvasH;
         practice.tutorial3.width = practice.canvastW;
         
         practice.tutorial4.height = practice.canvasH;
         practice.tutorial4.width = practice.canvastW;
         
         //Add the images to the picture container
         practice.pictures.addChild(practice.tutorial1);
         practice.pictures.addChild(practice.tutorial2);
         practice.pictures.addChild(practice.tutorial3);
         practice.pictures.addChild(practice.tutorial4);
         
         practice.UI = new PIXI.Container();
         practice.stage.addChild(practice.UI);
         
         practice.addButtons();
         
         practice.renderer.view.style.border = "3px dashed black";
     
         
         
         //start the animation
         requestAnimationFrame( practice.animate );
         
         practice.resize();
         practice.rendererResize();
      },
      //Creates the buttons for switching the images
      addButtons : function(){
         
         var textButton1 = new PIXI.Text('Part 1' , {font: '20px Arial', fill: 'white', align: 'center'});
         var textButton2 = new PIXI.Text('Part 2' , {font: '20px Arial', fill: 'white', align: 'center'});
         var textButton3 = new PIXI.Text('Part 3' , {font: '20px Arial', fill: 'white', align: 'center'});
         var textButton4 = new PIXI.Text('Part 4' , {font: '20px Arial', fill: 'white', align: 'center'});

         
         textButton1.interactive = true;
         textButton1.buttonMode=true;
         
         textButton2.interactive = true;
         textButton2.buttonMode=true;
         
         textButton3.interactive = true;
         textButton3.buttonMode=true;
         
         textButton4.interactive = true;
         textButton4.buttonMode=true;
         
         textButton1.position.x = 950;
         textButton1.position.y = 440;
         
         textButton2.position.x = 950;
         textButton2.position.y = 490;
         
         textButton3.position.x = 950;
         textButton3.position.y = 540;
         
         textButton4.position.x = 950;
         textButton4.position.y = 590;
         
         textButton1.on('mousedown', practice.onTutorialClick1)
                              .on('touchstart', practice.onTutorialClick1);
         
         textButton2.on('mousedown', practice.onTutorialClick2)
         .on('touchstart', practice.onTutorialClick2);
         
         textButton3.on('mousedown', practice.onTutorialClick3)
         .on('touchstart', practice.onTutorialClick3);
         
         textButton4.on('mousedown', practice.onTutorialClick4)
         .on('touchstart', practice.onTutorialClick4);
         
         practice.UI.addChild(textButton1);
         practice.UI.addChild(textButton2);
         practice.UI.addChild(textButton3);
         practice.UI.addChild(textButton4);
         
      },
      
      //Functions that hide and show the pictures
      onTutorialClick1 : function(){
         
         practice.tutorial1.renderable = !practice.tutorial1.renderable;
         practice.tutorial2.renderable = false;
         practice.tutorial3.renderable = false;
         practice.tutorial4.renderable = false;
         
      },
      
      onTutorialClick2 : function(){
         
         practice.tutorial2.renderable = !practice.tutorial2.renderable;
         practice.tutorial1.renderable = false;
         practice.tutorial3.renderable = false;
         practice.tutorial4.renderable = false;
         
      },
      
      onTutorialClick3 : function(){
         
         practice.tutorial3.renderable = !practice.tutorial3.renderable;
         practice.tutorial1.renderable = false;
         practice.tutorial2.renderable = false;
         practice.tutorial4.renderable = false;
         
      },
      
      onTutorialClick4 : function(){
         
         practice.tutorial4.renderable = !practice.tutorial4.renderable;
         practice.tutorial1.renderable = false;
         practice.tutorial2.renderable = false;
         practice.tutorial3.renderable = false;
         
      },
      
  //Function that initiates the creating of voc menu
      createtutorial : function(){
         
         //Store the JSON-file
         var menuFile = "JSON/tutorial.json";
        
          //get the file
         $.getJSON(menuFile, function(data){
            practice.menuJSON = data;
         
            //Call the builder function
            practice.tutorial(practice.menuJSON, practice.vocabularyMenu)

         });
         
         
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