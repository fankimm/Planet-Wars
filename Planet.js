function Planet(x, y, vx, vy, sp, fn, isAnim, endNum){
  this.dd = displayDensity()
  this.pos = createVector(x, y)
  this.vel = createVector(vx, vy)
  this.speed = sp
  this.rad = 30
  this.pixelSize = 60
  this.frameIndex = fn
  this.planetImage = loadImage("assets/spriteSheets.png")

  this.update = function(dt){
    this.pos.x += this.vel.x * this.speed * dt
    this.pos.y += this.vel.y * this.speed * dt
  }
  this.draw = function(){
    if(this.pos.x > -this.rad && this.pos.x < width - this.rad && this.pos.y > -this.rad && this.pos.y < height - this.rad){
      if(!this.isAnim)
      image(this.planetImage, this.pos.x, this.pos.y, this.rad * 2, this.rad * 2,
        this.frameIndex * this.pixelSize, 0, this.pixelSize, this.pixelSize )
    }
  }


  this.spriteAnimation = function(f){
    if(this.isAnim){
      if(this.frameIndex >= endNum - 1) this.frameIndex = 0
      // image(this.planetImage, this.pos.x, this.pos.y)
      image(this.planetImage, this.pos.x, this.pos.y, this.rad * 2, this.rad * 2, this.frameIndex * this.pixelSize, 0, this.pixelSize, this.pixelSize )
      if(frameCount % f == 0) this.frameIndex++
    }
  }


}
