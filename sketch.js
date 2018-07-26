// version 0.1.1

var earthImg
var poisonImg
var sunImg
var bgImg
var buttonImg
var gameoverImg


var bgmSound
var eatSound
var gameoverSound

var earth
var sun
var poison
var button
var gameover

var gameOverIs
var gameStartIs

var gameOverSoundIsPlaying

var score

var font




function preload(){
  font = loadFont('assets/love.ttf')
  earthImg = loadImage('assets/earth.png')
  sunImg = loadImage('assets/sun.png')
  poisonImg = loadImage('assets/poison.png')
  bgImg = loadImage('assets/bg.png')
  buttonImg = loadImage('assets/button.png')
  gameoverImg = loadImage('assets/gameover.png')

  bgmSound = loadSound('assets/bgm.mp3')
  eatSound = loadSound('assets/eatSound.mp3')
  gameoverSound = loadSound('assets/gameoverBgm.mp3')

}

function setup() {

  // frameRate(30)
  textFont(font)

  createCanvas(windowWidth,windowHeight)
  GameInit()
  button = new imgDsp(width/2,height/2,buttonImg,2)
  gameover = new imgDsp(width/2,button.pos.y-100,gameoverImg,2)
  noStroke()
  gameStartIs = false
  gameOverSoundIsPlaying = false
  bgmSound.setLoop(true)
  gameoverSound.setLoop(true)

  eatSound.playMode('restart')
  bgmSound.playMode('restart')
  gameoverSound.playMode('restart')
  // bgmSound.setVolume(0.5)
  // bgmSound.play()
}

function draw() {

  if(!gameStartIs){
    textAlign(CENTER)
    clear()
    image(bgImg,0,0,width,height)
    textSize(50)
    stroke(0)
    strokeWeight(10)
    fill(255,194,30)

    text('TOUCH TO MOVE',width/2,height/2-50)
    text('AVOID PURPLE PLANET' ,width/2,height/2)
    text('AND GET YELLOW PLANET!',width/2,height/2+50)
  }
  if(!gameOverIs && gameStartIs){



    clear()
    image(bgImg,0,0,width,height)
    edgeCheck(earth)
    if(CollisionCheck(earth,poison)){
      gameOverIs = true
      // console.log('game over')
    } else if (CollisionCheck(earth,sun)){
      sun.eaten = true
      eatSound.play()
    }

    earth.update()
    earth.draw()
    poison.update()

    poison.chase()
    poison.draw()

    sun.gen()
    sun.draw()

  //fps
  var fps = frameRate();
  fill(255);
  stroke(0);
  // console.log(frameCount)
  textSize(20)
  noStroke()
  text("FPS: " + fps.toFixed(2), 50, 50);
  textSize(30)
  stroke(0)
  strokeWeight(10)

  text(score,50,100)
} else if(gameOverIs){
    gameover.draw()
    button.draw()
    textSize(100)
    textAlign(CENTER)
    stroke(0)
    strokeWeight(10)
    fill(255,194,30)
    text(score,width/2,button.pos.y+buttonImg.height*4)

    bgmSound.setVolume(0)
    gameoverSound.setVolume(1)
    if(!gameOverSoundIsPlaying)
    gameoverSound.play(0)
    gameOverSoundIsPlaying = true
    // rect(button.pos.x,button.pos.y,buttonImg.width*button.scl,buttonImg.height*button.scl)



  }


}
function edgeCheck(planet){
  if(planet.pos.x<0){
    planet.pos.x = width-planet.pos.x
  } else if (planet.pos.x>width){
    planet.pos.x = planet.pos.x - width
  } else if (planet.pos.y<0){
    planet.pos.y = height-planet.pos.y
  } else if(planet.pos.y>height) {
    planet.pos.y = planet.pos.y - height
  }
}
function CollisionCheck (planet1, planet2){
  // var d = p5.Vector.dist(planet1.pos.add(planet1.r,planet1.r), planet2.pos.add(planet2.r,planet2.r));
  var d = dist(planet1.pos.x+planet1.r,planet1.pos.y+planet1.r,planet2.pos.x+planet2.r,planet2.pos.y+planet2.r)
  if(d<=planet1.r+planet2.r){
    return true
  } else {
    return false
  }
}



function Planet(x,y,r,power,imgName){
  this.r = r
  this.imgName = imgName
  this.pos = createVector (x,y)
  this.vel = createVector (0,0)
  this.power = power
  this.eaten = false

  this.update = function(){
    this.pos.x += this.vel.x*this.power
    this.pos.y += this.vel.y*this.power

  }

  this.draw = function(){
    image(this.imgName,this.pos.x,this.pos.y,this.r*2,this.r*2)
  }

  this.chase = function(){
    this.vel.x = (earth.pos.x-this.pos.x)/dist(this.pos.x,this.pos.y,earth.pos.x,earth.pos.y)
    this.vel.y = (earth.pos.y-this.pos.y)/dist(this.pos.x,this.pos.y,earth.pos.x,earth.pos.y)
  }



  this.gen = function(){
    if(this.eaten){

      this.pos = createVector(random(this.r*2,width-this.r*2),random(this.r*2,height-this.r*2))
      this.eaten = false
      earth.power += 1.5
      earth.r += 5
      score++
      if(int(score%4)==3){
        poison.power += 1
        poison.r += 3
      }
    }
  }
}

function imgDsp(x,y,imgName,scl){
  this.scl = scl
  this.pos = createVector(x-imgName.width*this.scl/2,y-imgName.height*this.scl/2)
  this.imgName = imgName
  this.draw = function(){
    image(this.imgName,this.pos.x,this.pos.y,imgName.width*this.scl,imgName.height*this.scl)
  }
}


function GameInit(){
  bgmSound.setVolume(1)
  bgmSound.play()

  gameoverSound.setVolume(0)
  gameOverSoundIsPlaying = false
  gameOverIs = false
  gameStartIs = false
  earth = new Planet(width/2-32, height/2-32,64,3,earthImg)
  poison = new Planet(100,100,64,1,poisonImg)
  sun = new Planet(random(width),random(height),64,0,sunImg)
  // item1 = new Planet(random(width),random(height),32,0,item1Img)

  score = 0
}


function mousePressed(){
  // console.log('click')
  gameStartIs = true
  earth.vel.x = (mouseX-earth.pos.x)/dist(mouseX,mouseY,earth.pos.x,earth.pos.y)
  earth.vel.y = (mouseY-earth.pos.y)/dist(mouseX,mouseY,earth.pos.x,earth.pos.y)
  if(gameOverIs){


    if(mouseX>button.pos.x && mouseX<button.pos.x+buttonImg.width*button.scl){
      if(mouseY>button.pos.y && mouseY<button.pos.y+buttonImg.height*button.scl){

        GameInit()
        // return 0
      }
    }
  }

}

function keyPressed(){
  if(keyCode===UP_ARROW)
  noLoop()
}
