// create a texture from an image path
var texture = PIXI.Texture.fromImage('img/bunny.png');

function bunnies() {
   for (var i = 0; i < 10; i++)
   {
      createBunny(Math.floor(Math.random() * pixijs.canvasW) , Math.floor(Math.random() * pixijs.canvasH));
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

   // add it to the stage
   pixijs.stage.addChild(bunny);


}
