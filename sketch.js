let spaceship;
let asteroids;
let atmosphereLoc;
let atmosphereSize;
let earthLoc;
let earthSize;
let starLocs = [];
let speed;

let isGameStarted = false;
let isGameOver = false;
let isGameWon = false;
let timer = 0;
const levelUpTimerPeriod = 20;
let score = 0;
let level = 0;
let nukeSize = 100;
let nukesAllowed = 2;
let nukeFired = [];

let explosionImg;
let asteroidImg;
let font;

/**
 * P5 preload functionality
 *
 * @return void.
 */
function preload () {
  explosionImg = loadImage('./images/explosion.png');
  asteroidImg = loadImage('./images/asteroid.png');
  font = loadFont('./fonts/font.ttf');
}


/**
 * P5 setup functionality
 *
 * @return void.
 */
function setup () {
  createCanvas(1200, 800);
  
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

/**
 * P5 draw functionality
 *
 * @return void.
 */
function draw () {
  background(0);
  sky();
  speed = frameCount;

  if (isGameStarted) {
    spaceship.run();
    asteroids.run();
    drawEarth();
    checkCollisions(spaceship, asteroids); // function that checks collision between various elements
    drawTimer();
    drawProgress();

    if (nukeFired.length) {
      explodeNuke();
    }

    return;
  }

  drawGameText();
}

/**
 * Draws the game progress - score, nukes, level
 *
 * @return void.
 */
function drawProgress () {
  push();
  textFont(font);
	stroke(0);
	strokeWeight(2);
  
  // Score
  fill(255, 0, 0);
  textSize(20);
  textAlign(LEFT);
  text('SCORE:', width - 230, 50);
  textSize(40);
  textAlign(CENTER);
  text(score, width - 76, 56);

  fill(255, 255, 0);
  
  // Level
  textSize(20);
  textAlign(LEFT);
  text('LEVEL:', 230, 50);
  textSize(40);
  textAlign(CENTER);
  text(level + 1, 380, 56);

  // Nukes
  textSize(20);
  textAlign(LEFT);
  text('NUKES:', 470, 50);
  textSize(40);
  textAlign(CENTER);
  text(nukesAllowed, 620, 56);

  pop();
}

/**
 * Draws and keeps track of time survived
 *
 * @return void.
 */
function drawTimer () {
  push();
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(2);
  textFont(font);
  textSize(20);
  textAlign(LEFT);
  text('TIME:', 20, 50);
  textSize(40);
  textAlign(CENTER);
  text(timer, 140, 56);
  pop();
  if (frameCount % 60 == 0) {
    timer++;
    level = Math.floor(timer / levelUpTimerPeriod);
  }
}

/**
 * Draws the text for the main game screen
 * 
 * @return void.
 */
function drawGameText () {
	push();

	fill(255, 255, 0);
	stroke(0);
	strokeWeight(4);
	textFont(font);

	// Start text
	const textStartX = width / 2;
	const textStartY = !isGameStarted && !isGameOver ? 320 : -2000;
	textSize(50);
	textAlign(CENTER);
	text('PRESS ENTER TO START', textStartX, textStartY);
  textSize(26);
  fill(255);
	stroke(0);
	strokeWeight(4);
	text(`USE ARROW KEYS TO MOVE`, textStartX, textStartY + 50);
  text(`HIT SPACEBAR TO FIRE`, textStartX, textStartY + 80);
  text(`HIT 'N' TO FIRE A NUCLEAR DEVICE. USE SPARINGLY.`, textStartX, textStartY + 110);

	// Game over text
	const textGameOverX = width / 2;
  const textGameOverY = isGameOver && !isGameStarted ? height / 2 - 50 : -2000;
  const textGameOver = 'GAME OVER';
  fill(255, 0, 0);
	textSize(80);
  text(textGameOver, textGameOverX, textGameOverY);
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(4);
  textSize(50);
	textAlign(CENTER);
  text('PRESS ENTER TO TRY AGAIN', textGameOverX, textGameOverY + 80);
  textSize(26);
  fill(255);
	stroke(0);
	strokeWeight(4);
	text(`USE ARROW KEYS TO MOVE`, textGameOverX, textGameOverY + 120);
  text(`HIT SPACEBAR TO FIRE`, textGameOverX, textGameOverY + 150);
  text(`HIT 'N' TO FIRE A NUCLEAR DEVICE. USE SPARINGLY.`, textGameOverX, textGameOverY + 180);

	pop();
}

/**
 * Draws earth and atmosphere
 *
 * @return void.
 */
function drawEarth () {
  noStroke();
  //draw atmosphere
  fill(0,0,255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

/**
 * Draws the nuclear explosion effect
 *
 * @return void.
 */
function explodeNuke () {
  if (nukeSize > width + 200) {
    nukeSize = 100;
    nukeFired = [];
  }
  push();
  fill(255);
  ellipse(nukeFired[0], nukeFired[1], nukeSize, nukeSize);
  nukeSize = nukeSize + 30;
  pop();
}

/**
 * Checks collisions between all types of bodies
 * 
 * @param {object} spaceship - The main spaceship
 * @param {object} asteroids - The asteroids
 *
 * @return void.
 */
function checkCollisions (spaceship, asteroids) {
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
      if (spaceship.bulletSys.bullets[i]) {
        if (isInside(spaceship.bulletSys.bullets[i].position, spaceship.bulletSys.diam, asteroids.locations[j], asteroids.diams[j])) {
          asteroids.destroy(j);
          spaceship.bulletSys.bullets.splice(i, 1);
          break;
        }
      }
    }
  }
}

/**
 * Helper function checking if there's collision between object A and object B
 * 
 * @param {object} locA - X and Y coords of object A
 * @param {object | number} sizeA - Size of obect A
 * @param {object} locB - X and Y coords of object B
 * @param {object | number} sizeB - Size of obect B
 *
 * @return {boolean} Whether there is a collision
 */
//////////////////////////////////////////////////
function isInside (locA, sizeA, locB, sizeB) {
  if (!locA | !locB) { return; }
  const _sizeA = typeof sizeA === 'object' ? sizeA.x : sizeA;
  const _sizeB = typeof sizeB === 'object' ? sizeB.x : sizeB;
  return dist(locA.x, locA.y, locB.x, locB.y) < _sizeA / 2 + _sizeB / 2;
}

/**
 * P5 keypressed event - starts game and fires missile
 * 
 * @return void
 */
function keyPressed () {
  if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
    if (isGameStarted) {
      spaceship.fire();
    }
  }

  if (keyIsPressed && keyCode === 13){ // if enter key is pressed, start the game
    if (!isGameStarted) {
      startGame();
    }
  }
}

/**
 * P5 keytypes event - Fires nuke
 * 
 * @return void
 */
function keyTyped () {
  // Do nothing if game hasn't started
  if (!isGameStarted) {
    return;
  }
  // N - Nuke!
  if (key==='n'){
    if (nukesAllowed) {
      spaceship.fireNuke();
      asteroids.destroyAll();
      nukesAllowed--;
    }
  }
}

/**
 * Sets the game to a finished state.
 * 
 * @param {boolean} success - Whether the user beat the game
 * 
 * @return void.
 */
function gameOver (success) {
  isGameOver = true;
  isGameStarted = false;
  resetGameState();
}

/**
 * Resets all the global vars and calls set up functions again ready for a new game
 * 
 * @return void.
 */
function resetGameState () {
  spaceship;
  asteroids;
  atmosphereLoc;
  atmosphereSize;
  earthLoc;
  earthSize;
  starLocs = [];
  speed;
  score = 0;
  timer = 0;
  level = 0;
  nukeSize = 100;
  nukesAllowed = 2;
  nukeFired = [];

  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

/**
 * Starts a game
 * 
 * @return void.
 */
function startGame () {
  isGameOver = false;
	isGameStarted = true;
}


/**
 * Creates the sky filled sky
 * 
 * @return void.
 */
function sky () {
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (let i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}
