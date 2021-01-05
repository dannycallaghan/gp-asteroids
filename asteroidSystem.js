class AsteroidSystem {

  /**
   * Constructor. Creates arrays to store each asteroid's data
   * 
   * @return void.
   */
  constructor () {
    this.locations = [];
    this.velocities = [];
    this.accelerations = [];
    this.diams = [];
    this.explosions = [];
  }

  /**
   * Starts the asteroids
   * 
   * @return void.
   */
  run () {
      this.spawn();
      this.move();
      this.draw();
  }

  /**
   * Spawns asteroid at random intervals, increases with level
   * 
   * @return void.
   */
  spawn () {
    if (random(1)< (0.01 + (level * 0.005))){
      this.accelerations.push(new createVector(0,random(0.1,1)));
      this.velocities.push(new createVector(0, 0));
      this.locations.push(new createVector(random(width), 0));
      this.diams.push(random(30,50));
    }
  }

  /**
   * Moves all asteroids
   * 
   * @return void.
   */
  move () {
    for (var i=0; i<this.locations.length; i++){
      this.velocities[i].add(this.accelerations[i]);
      this.locations[i].add(this.velocities[i]);
      this.accelerations[i].mult(0);
    }
  }

  /**
   * Adds force to the asteroids
   * 
   * @param {number} f - The force to apply
   * 
   * @return void.
   */
  applyForce (f) {
    for (let i=0; i<this.locations.length; i++){
      this.accelerations[i].add(f);
    }
  }

  /**
   * Draws the asteroids and any explosions
   * 
   * @return void.
   */
  draw () {
    noStroke();
    fill(200);
    const locationsLength = this.locations.length;
    const explosions = this.explosions;
    const explosionsLength = explosions.length;

    // Asteroids
    for (let i = 0; i < locationsLength; i++) {
      imageMode(CENTER);
      image(asteroidImg, this.locations[i].x, this.locations[i].y, this.diams[i], this.diams[i]);
    }

    // Explosions
    for (let i = 0; i < explosionsLength; i++) {
      push();
      if (explosions[i]) {
        const size = explosions[i].size + 2;
        if (size <= explosions[i].limit) {
          imageMode(CENTER);
          image(explosionImg, explosions[i].x, explosions[i].y, size, size);
          explosions[i].size= size;
        } else {
          this.explosions.splice(i, 1);
        }
      }
      pop();
    }
  }

  /**
   * Function that calculates effect of gravity on each asteroid and accelerates it
   * 
   * @param {number} centerOfMass - The centre of mass
   * 
   * @return void.
   */
  calcGravity (centerOfMass) {
    for (let i=0; i<this.locations.length; i++){
      const gravity = p5.Vector.sub(centerOfMass, this.locations[i]);
      gravity.normalize();
      gravity.mult(.001);
      this.applyForce(gravity);
    }
  }

  /**
   * Destroys all data associated with each asteroid
   * 
   * @param {number} index - The index of the asteroid to destroy
   * 
   * @return void.
   */
  destroy (index) {
    // Set up explosion
    this.explosions = this.explosions.concat([{
      x: this.locations[index].x,
      y: this.locations[index].y,
      limit: this.diams[index] * 1.5,
      size: 1
    }])
    // Remove data
    this.locations.splice(index, 1);
    this.velocities.splice(index, 1);
    this.accelerations.splice(index, 1);
    this.diams.splice(index, 1);
    score++;
  }

  /**
   * Destroys all asteroids if a nuke is fired
   * 
   * @return void.
   */
  destroyAll () {
    const numberSpawned = this.locations.length;
    this.locations = [];
    this.velocities = [];
    this.accelerations = [];
    this.diams = [];
    this.explosions = [];
    score = score + numberSpawned;
  }
}
