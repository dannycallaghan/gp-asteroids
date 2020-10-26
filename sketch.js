var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200,800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
  noStroke();
  //draw atmosphere
  fill(0,0,255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

/*
TODO
Step 5: In sketch.js complete the checkCollisions() function so 
that you check collisions between the spaceship and all asteroids. 
Hint: You'll need to loop over all the asteroids and use the inInside() 
function you just programmed. If it returns true then you'll call the 
gameOver() function. If you've done things right, if the spaceship is 
hit by an asteroid the game will end. Check before proceeding.
*/

/*
TODO
Step 6: In sketch.js add more functionality to the checkCollisions() 
function to check if an asteroid has crashed onto earth. If you do 
things right then the game should end when that happens. Check before proceeding.
*/

/*
TODO
Step 7: In sketch.js add more functionality to the checkCollisions() 
function to check if the spaceship has collided with the earth and if it 
has it ends the game. Check before proceeding.
*/

/*
TODO
Step 8: In sketch.js add more functionality to the checkCollisions() 
function to check if the spaceship is inside the atmosphere. If it is, the 
spaceship's setNearEarth() function is called.
*/

/*
TODO
Step 10: In sketch.js add more functionality to the checkCollisions() 
function to check if any of the bullets of the spaceship have hit any asteroids. 
If they have, then call the destroy() function of the asteroid object, 
passing it the index of the asteroid to destroy.
*/

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){
  const asteroidsLength = asteroids.locations.length;
  const bulletsLength = spaceship.bulletSys.bullets.length;
    
  //spaceship-2-asteroid collisions
  for (let i = 0; i < asteroidsLength; i++) {
    if (isInside(asteroids.locations[i], asteroids.diams[i], spaceship.location, spaceship.size)) {
      gameOver();
    }
  }

  //asteroid-2-earth collisions
  for (let i = 0; i < asteroidsLength; i++) {
    if (isInside(asteroids.locations[i], asteroids.diams[i], earthLoc, earthSize)) {
      gameOver();
    }
  }

  //spaceship-2-earth
  if (isInside(earthLoc, earthSize, spaceship.location, spaceship.size)) {
    gameOver();
  }

  //spaceship-2-atmosphere
  if (isInside(atmosphereLoc, atmosphereSize, spaceship.location, spaceship.size)) {
    spaceship.setNearEarth();
  }

  //bullet collisions
  for (let i = 0; i < bulletsLength; i++) {
    for (let j = 0; j < asteroidsLength; j++) {
      if (isInside(spaceship.bulletSys.bullets[i], spaceship.bulletSys.diam, asteroids.locations[j], asteroids.diams[j])) {
        asteroids.destroy(j);
        spaceship.bulletSys.bullets.splice(i, 1);
        break;
      }
    }
  }
}

/*
TODO
Step 4: In sketch.js complete the isInside() function that takes the 
location of two circles and their diameters and returns true if they 
overlap, false otherwise. You could check it works, by creating a 
dummy circle around the mouse and checking if isInside() returns true.
*/

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
  const _sizeA = typeof sizeA === 'object' ? sizeA.x : sizeA;
  const _sizeB = typeof sizeB === 'object' ? sizeB.x : sizeB;
  return dist(locA.x, locA.y, locB.x, locB.y) < _sizeA / 2 + _sizeB / 2;
}

//////////////////////////////////////////////////
function keyPressed(){
  if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2)
  noLoop();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}
