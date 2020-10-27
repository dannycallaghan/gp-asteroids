class BulletSystem {

  constructor(){
    this.bullets = [];
    this.diam = 10;
  }

  run(){
      this.move();
      this.draw();
      this.edges();
  }

  fire(x, y, currentRotation){
    const velocity = new createVector(0, -5);
    velocity.rotate(radians(currentRotation));
    this.bullets.push({
      position: createVector(x,y),
      velocity: velocity 
    });
  }

  //draws all bullets
  draw(){
    fill(255);
    for (var i=0; i<this.bullets.length; i++){
      ellipse(this.bullets[i].position.x, this.bullets[i].position.y, this.diam, this.diam);
    }
  }

  //updates the location of all bullets
  move(){
    for (var i=0; i<this.bullets.length; i++){
      this.bullets[i].position.x += this.bullets[i].velocity.x
      this.bullets[i].position.y += this.bullets[i].velocity.y 
    }
  }

  /*
  TODO
  Step 1: In bulletSystem.js complete the function edges() by looping 
  over the bullets array and for each bullet check if it has left the screen. 
  If it has, remove the specific bullet from the array. (Hint: Use splice() 
  to remove the bullet from the array). Remember: If you want to call a 
  function or use any variable that belongs to the class you'll need to prefix 
  it with the word "this". So in this case it would be: this.bullets.myFunction();
  */

  //check if bullets leave the screen and remove them from the array
  edges(){
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
