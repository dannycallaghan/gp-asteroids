class Spaceship {

  constructor(){
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width/2, height/2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;

    //this.thrustUp = false;
    //this.thrustDown = false;

    this.rotate = 0;
    this.currentRotation = 45;

  }

  run(){
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  draw(){
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
    
    function showFlame() {
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

  /*
  TODO
  Step 3: In spaceship.js update the move() function similarly to how 
  the move() function works in asteroidSystem. Make sure you limit the 
  velocity vector to maxVelocity so that the spaceship does not accelerate too 
  much. Notice how, unless we fire the rockets in the opposite direction, 
  the spaceship will keep moving. There is no friction in empty space.
  */
  move(){
    this.velocity.add(this.acceleration.rotate(radians(this.currentRotation)));
    this.velocity.limit(this.maxVelocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(f){
    this.acceleration.add(f);
  }

  doRotate(amount) {
    this.rotate = amount;
  }

  /*
  TODO
  Step 2: In spaceship.js update the interaction() function and fill out the 
  missing information in order to simulate the correct behavior in the system. 
  When the left arrow is pressed the spaceship should move left, when the right arrow 
  is pressed it should move right and so on. Please note that the spaceship won't 
  move until you have completed the next step too.
  */

  interaction(){
      if (keyIsDown(LEFT_ARROW)){
        this.thrustLeft = true;
        this.doRotate(-1);
      }
      if (keyIsDown(RIGHT_ARROW)){
        this.thrustRight = true;
        this.doRotate(1);
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

  fire(){
    this.bulletSys.fire(this.location.x, this.location.y, this.currentRotation);
  }

  edges(){
    if (this.location.x<0) this.location.x=width;
    else if (this.location.x>width) this.location.x = 0;
    else if (this.location.y<0) this.location.y = height;
    else if (this.location.y>height) this.location.y = 0;
  }

  /*
  TODO
  Step 9: In spaceship.js complete the setNearEarth() function. 
  When the spaceship enters the earth's atmosphere it's affected 
  by the earth's gravity. Create a "downwards-pointing" vector of strength 
  0.05 which pulls the spaceship towards the earth. The atmosphere also 
  introduces friction and the spaceship can't move forever like in empty space. 
  It will decelerate unless it fires its engines. Create a force called friction 
  that's 30 times smaller than the velocity of the spaceship, points the opposite 
  direction to velocity and is then applied in the the opposite direction.
  */

  setNearEarth(){
    //YOUR CODE HERE (6 lines approx)

    // Create a "downwards-pointing" vector of strength
    // 0.05 which pulls the spaceship towards the earth.
    this.applyForce(createVector(0, 0.05));

    // Create a force called friction that's 30 times 
    // smaller than the velocity of the spaceship, points the 
    // opposite direction to velocity and is then applied in the the opposite direction.
    // const frictionValue = this.velocity / 30;
    // const friction = new createVector(0, frictionValue);
    // this.applyForce(friction);


    /*
    var normal = mouse.copy(); // Make a copy of the thing we want the direction of
    normal.normalize(); // Normalize it (make the length 1)
    normal.mult(25); // Now make it as big as you want
    const friction = new createVector(0, frictionValue);
    this.applyForce(friction);
    */


    let frictionValue = this.velocity.copy();
    frictionValue = frictionValue.mult(2);

    //const _frictionValue = this.velocity / 30;

    //console.warn
    

    //frictionValue.normalize();
    //frictionValue = frictionValue.mult(-1);
    
    //frictionValue.div(30);

   

    const friction = new createVector(0, this.velocity / 2);
    this.applyForce(friction);

    /*
    const friction = new createVector(0, frictionValue);
    this.applyForce(friction);

    var normal = mouse.copy(); // Make a copy of the thing we want the direction of
    normal.normalize(); // Normalize it (make the length 1)
    normal.mult(25); // Now make it as big as you want (25 * 1)
    */

  }
}
