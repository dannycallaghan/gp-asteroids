class Spaceship {

  /**
   * Constructor
   * 
   * @return void.
   */
  constructor () {
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width/2, height/2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 3;
    this.bulletSys = new BulletSystem();
    this.size = 50;
    this.rotate = 0;
    this.currentRotation = 0;
  }

  /**
   * Starts the spacehip functionality
   * 
   * @return void.
   */
  run () {
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  /**
   * Draws the spaceship
   * 
   * @return void.
   */
  draw () {
    push();
    translate(this.location.x, this.location.y);

    this.currentRotation = this.currentRotation + this.rotate;
    rotate(radians(this.currentRotation)); 

    var shipTop = 0 - this.size / 2;
    var shipRight = shipTop + this.size;
    var shipBottom = shipTop + this.size;
    var shipLeft = shipTop;
    
    fill(180); // Legs colour
    
    rect(shipLeft, shipBottom - 4, 10, 4); // Left foot
    rect(shipRight - 10, shipRight - 4, 10, 4); // Right 
    
    // Left leg
    beginShape();
    vertex(shipLeft + 10, 4);
    vertex(shipLeft + 15, 4);
    vertex(shipLeft + 5, shipBottom);
    vertex(shipLeft, shipBottom);
    endShape();
    
    // Left support
    beginShape();
    vertex(shipLeft + 20, 4);
    vertex(shipLeft + 23, 4);
    vertex(shipLeft + 8, shipBottom - 8);
    vertex(shipLeft + 5, shipBottom - 8);
    endShape();
    
    // Right leg
    beginShape();
    vertex(shipRight - 15, 4);
    vertex(shipRight - 10, 4);
    vertex(shipRight, shipBottom);
    vertex(shipRight - 5, shipBottom);
    endShape();
    
    // Right support
    beginShape();
    vertex(shipRight - 23, 4);
    vertex(shipRight - 20, 4);
    vertex(shipRight - 5, shipBottom - 8);
    vertex(shipRight - 8, shipBottom - 8);
    endShape();
    
    // Legs base
    fill(210, 105, 30); // leg base colour
    rect(shipLeft + 10, 0, 30, 4);
    
    // Dome
    fill(212,175,55); // dome colour
    arc(  0, 0,
          this.size - 5, this.size - 5,
          PI + radians(0),
          TWO_PI + radians(0),
          OPEN);
    
    // Left booster
    push();
    translate(-25.5, -2)
    rotate(radians(280));
    rect(0, 0, 8, 4);
    pop();
    
    // Right booster
    push();
    translate(24, -10)
    rotate(radians(78));
    rect(0, 0, 8, 4)
    pop();
    
    // Top left booster
    rect(0 - 14, shipTop + 2, 8, 6)
    
    // Top right booster
    rect(0 + 6, shipTop + 2, 8, 6)
    
    // Rockets
    rect(0 - 2, shipTop, 4, 4)
    
    // Union flag
    fill(0, 0, 255); // Blue
    push();
    translate(0 - 12, 0 - 16);
    rect(0, 0, 24, 14); // Flag background
    
    fill(255); // White
    rect(10, 0, 4, 14); // Vertical white line
    rect(0, 5, 24, 4) // Horizontal white line
    
    // Top left to bottom right white line
    beginShape();
    vertex(0, 0);
    vertex(2, 0);
    vertex(24, 12);
    vertex(24, 14);
    vertex(22, 14);
    vertex(0, 2);
    endShape();
    
    // Top right to bottom left white line
    beginShape();
    vertex(24, 0);
    vertex(22, 0);
    vertex(0, 12);
    vertex(0, 14);
    vertex(2, 14);
    vertex(24, 2);
    endShape();
    
    fill(255, 0, 0); // Red
    rect(11, 0, 2, 14); // Vertical red line
    rect(0, 6, 24, 2); // Horizontal red line
    
    // Top left to bottom right red line
    beginShape();
    vertex(0, 0);
    vertex(1, 0);
    vertex(24, 13);
    vertex(24, 14);
    vertex(23, 14);
    vertex(0, 1);
    endShape();
    
    // Top right to bottom left red line
    beginShape();
    vertex(24, 0);
    vertex(23, 0);
    vertex(0, 13);
    vertex(0, 14);
    vertex(1, 14);
    vertex(24, 1);
    endShape();
    pop();
    
    // Flames
    // Red flame
    const redFlame = [
      createVector(0, 0),
      createVector(4, 30),
      createVector(4, 30),
      createVector(8, 0)
    ];
    // Yellow flame
    const yellowFlame = [
      createVector(2, 0),
      createVector(4, 26),
      createVector(4, 26),
      createVector(6, 0)
    ];

    // Bottom left flame
    push();
    translate(shipLeft + 1, this.size / 2)
    if (this.thrustUp) showFlame();
    pop();
    
    // Bottom right flame
    push();
    translate(shipRight - 9, this.size / 2)
    if (this.thrustUp) showFlame();
    pop();
    
    // Top right flame
    push();
    rotate(radians(180));
    translate(0 - 14, (this.size / 2) -2)
    if (this.thrustDown) showFlame();
    pop();
    
    // Top left flame
    push();
    rotate(radians(180));
    translate(0 + 6, (this.size / 2) -2)
    if (this.thrustDown) showFlame();
    pop();
    
    // Left flame
    push();
    translate(-24, -10)
    rotate(radians(101));
    if (this.thrustRight) showFlame();
    pop();
    
    // Right flame
    push();
    translate(25.5, -2)
    rotate(radians(257));
    if (this.thrustLeft) showFlame();
    pop();

    pop();
    
    /**
     * Fires the booster / shows the flame (despite no fire in space!)
     * 
     * @return void.
     */
    function showFlame () {
      // Red flame
      fill(255, 0, 0);
      bezier(redFlame[0].x, redFlame[0].y,
            redFlame[1].x, redFlame[1].y,
            redFlame[2].x, redFlame[2].y,
            redFlame[3].x, redFlame[3].y);
      // Yellow flame
      if (frameCount % 5 === 0) {
        fill(255, 255, 0);
        bezier(yellowFlame[0].x, yellowFlame[0].y,
              yellowFlame[1].x, yellowFlame[1].y,
              yellowFlame[2].x, yellowFlame[2].y,
              yellowFlame[3].x, yellowFlame[3].y);
      }
    }
  }

  /**
   * Moves the spaceship in the direction the booster pushes it
   * 
   * @return void.
   */
  move(){
    this.velocity.add(this.acceleration.rotate(radians(this.currentRotation)));
    this.velocity.limit(this.maxVelocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  /**
   * Adds force to the asteroids
   * 
   * @param {number} f - The force to apply
   * 
   * @return void.
   */
  applyForce (f) {
    this.acceleration.add(f);
  }

  /**
   * Rotate the spaceship when left or right boosters are fired
   * 
   * @param {number} amount - The amount of rotation
   * 
   * @return void.
   */
  doRotate (amount) {
    this.rotate = amount;
  }

  /**
   * Adds the key press functionality to move the spaceship
   * 
   * @return void.
   */
  interaction () {
      if (keyIsDown(LEFT_ARROW)){
        this.thrustLeft = true;
        this.doRotate(-2);
      }
      if (keyIsDown(RIGHT_ARROW)){
        this.thrustRight = true;
        this.doRotate(2);
      }
      if (keyIsDown(UP_ARROW)){
        this.thrustUp = true;
        this.applyForce(createVector(0, -0.1));
      }
      if (keyIsDown(DOWN_ARROW)){
        this.thrustDown = true;
        this.applyForce(createVector(0, 0.1));
      }
      if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        this.doRotate(0);
      }
      if (!keyIsDown(LEFT_ARROW)){
        this.thrustLeft = false;
      }
      if (!keyIsDown(RIGHT_ARROW)){
        this.thrustRight = false;
      }
      if (!keyIsDown(UP_ARROW)){
        this.thrustUp = false;
      }
      if (!keyIsDown(DOWN_ARROW)){
        this.thrustDown = false;
      }
  }

  /**
   * Fires a missile
   * 
   * @return void.
   */
  fire () {
    this.bulletSys.fire(this.location.x, this.location.y, this.currentRotation);
  }

  /**
   * Fires a nuke by setting nukeFired to the current location of the ship
   * 
   * @return void.
   */
  fireNuke () {
    nukeFired = [this.location.x, this.location.y];
  }

  /**
   * Works out if the spaceship is still on screen
   * 
   * @return void.
   */
  edges () {
    if (this.location.x<0) this.location.x=width;
    else if (this.location.x>width) this.location.x = 0;
    else if (this.location.y<0) this.location.y = height;
    else if (this.location.y>height) this.location.y = 0;
  }

  /**
   * Increases gravity when the spaceship gets too close to Earth
   * 
   * @return void.
   */
  setNearEarth () {
    this.applyForce(createVector(0, 0.05));
    let frictionValue = this.velocity.copy();
    frictionValue = frictionValue.mult(2);
    const friction = new createVector(0, this.velocity / 2);
    this.applyForce(friction);
  }
}
