// create a texture from an image path
var texture = PIXI.Texture.fromImage('img/bunny.png');

function bunnies() {
   for (var i = 0; i < 10; i++)
   {
      createBunny(Math.floor(Math.random() * pixijs.canvasBlueprintW) , Math.floor(Math.random() * pixijs.canvasH));
   }
}

function createBunny(x, y)
{
   // create our little bunny friend..
   var bunny = new PIXI.Sprite(texture);

   // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
   bunny.interactive = true;

   // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
   bunny.buttonMode = true;

   // center the bunny's anchor point
   bunny.anchor.set(0.5);

   // make it a bit bigger, so it's easier to grab
   bunny.scale.set(3);

   // setup events
   bunny
      // events for drag start
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

   // move the sprite to its designated position
   bunny.position.x = x;
   bunny.position.y = y;
   
   //make a rotator for the bunny
   var circle = new PIXI.Sprite(pixijs.rotatorTexture);
   circle.interactive = true;
   circle.anchor.set(0.5);
   circle.scale.set(0.4);
   circle.buttonMode = true;
   circle.position.x = 0;
   circle.position.y = -20;
   circle
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
   
   bunny.addChild(circle);

   // add it to the stage
   pixijs.objects.addChild(bunny);


}
