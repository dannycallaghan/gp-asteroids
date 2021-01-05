class BulletSystem {

  /**
   * Constructor
   * 
   * @return void.
   */
  constructor () {
    this.bullets = [];
    this.diam = 10;
  }

  /**
   * Starts the bullet system
   * 
   * @return void.
   */
  run () {
      this.move();
      this.draw();
      this.edges();
  }

  /**
   * Fires a bullet
   * 
   * @param {number} x - The x cordinate of the bullet path
   * @param {number} y - The x cordinate of the bullet path
   * @param {number} currentRotation - Current rotation of the spaceship
   * 
   * @return void.
   */
  fire (x, y, currentRotation) {
    const velocity = new createVector(0, -5);
    velocity.rotate(radians(currentRotation));
    this.bullets.push({
      position: createVector(x,y),
      velocity: velocity 
    });
  }

  /**
   * Draws the bullets
   * 
   * @return void.
   */
  draw(){
    fill(255);
    for (let i=0; i<this.bullets.length; i++){
      ellipse(this.bullets[i].position.x, this.bullets[i].position.y, this.diam, this.diam);
    }
  }

  /**
   * Updates the location of all bullets
   * 
   * @return void.
   */
  move () {
    for (let i=0; i<this.bullets.length; i++){
      this.bullets[i].position.x += this.bullets[i].velocity.x
      this.bullets[i].position.y += this.bullets[i].velocity.y 
    }
  }

  /**
   * Check if bullets leave the screen and remove them from the array
   * 
   * @return void.
   */
  edges () {
    const bulletsLength = this.bullets.length;
    for (let i = 0; i < bulletsLength; i++) {
      if (
        (this.bullets[i].position.x < 0 || this.bullets[i].position.x > width) ||
        (this.bullets[i].position.y < 0 || this.bullets[i].position.y > height)
      ) {
        this.bullets.splice(i, 1);
        break;
      }
    }
  }
}
