class AsteroidSystem {

  //creates arrays to store each asteroid's data
  constructor(){
    this.locations = [];
    this.velocities = [];
    this.accelerations = [];
    this.diams = [];
    this.explosions = [];
  }

  run(){
      this.spawn();
      this.move();
      this.draw();
  }

  // spawns asteroid at random intervals
  spawn(){
    if (random(1)<0.01){
      this.accelerations.push(new createVector(0,random(0.1,1)));
      this.velocities.push(new createVector(0, 0));
      this.locations.push(new createVector(random(width), 0));
      this.diams.push(random(30,50));
    }
  }

  //moves all asteroids
  move(){
    for (var i=0; i<this.locations.length; i++){
      this.velocities[i].add(this.accelerations[i]);
      this.locations[i].add(this.velocities[i]);
      this.accelerations[i].mult(0);
    }
  }

  applyForce(f){
    for (var i=0; i<this.locations.length; i++){
      this.accelerations[i].add(f);
    }
  }

  //draws all asteroids
  draw(){
    noStroke();
    fill(200);
    const locationsLength = this.locations.length;
    const explosions = this.explosions;
    const explosionsLength = explosions.length;

    for (var i = 0; i < locationsLength; i++) {
      ellipse(this.locations[i].x, this.locations[i].y, this.diams[i], this.diams[i]);
    }

    for (var i = 0; i < explosionsLength; i++) {
      push();
      const size = explosions[i].size + 2;
      if (size <= explosions[i].limit) {
        fill(255, 0, 0);
        ellipse(explosions[i].x, explosions[i].y, size, size);
        explosions[i].size= size;
      } else {
        this.explosions.splice(i, 1);
      }
      pop();
    }

  }

  //function that calculates effect of gravity on each asteroid and accelerates it
  calcGravity(centerOfMass){
    for (var i=0; i<this.locations.length; i++){
      var gravity = p5.Vector.sub(centerOfMass, this.locations[i]);
      gravity.normalize();
      gravity.mult(.001);
      this.applyForce(gravity);
    }
  }

  //destroys all data associated with each asteroid
  destroy(index){

    this.explosions = this.explosions.concat([{
      x: this.locations[index].x,
      y: this.locations[index].y,
      limit: this.diams[index],
      size: 1
    }])

    this.locations.splice(index, 1);
    this.velocities.splice(index, 1);
    this.accelerations.splice(index, 1);
    this.diams.splice(index, 1);
  }
}
