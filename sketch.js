var player
var enemy
var sun
var item

var score

var isItemGen
var isItemGet
var isItemUse
var isGameOver
var isGrown

var spriteSheets
var spriteIndex

var currentTime
var lastTime
var deltaTime

var dd

var lastFrameCount

var font

function preload(){
  font = loadFont("assets/love.ttf")
  spriteSheets = loadImage("assets/spriteSheets.png")
}
function setup() {
  dd = displayDensity()
  pixelDensity(1)
  var dw = displayWidth - 100
  var dh = displayHeight - 100
  if(dw > dh){
    createCanvas(dh / 1.7, dh)
  } else createCanvas(window.innerWidth, window.innerHeight)

  imageMode(CENTER)
  textFont(font)

  score = 0
  lastFrameCount = 0

  player = new Planet(width - 100, height - 100, 0, 0, 2, 0, false, 4)
  enemy = new Planet(100, 100, 1, 1, 1, 1, false)
  sun = new Planet(random(100, width - 100), random(100, height - 100), 0, 0, 0, 2, false)
  item = new Planet(-100, -100, 0, 0, 0, 3, false)

  isItemGen = false
  isItemGet = false
  isItemUse = false
  isGameOver = false
  isGrown = false

  spriteIndex = 0
  // player.spriteAnimation(10)

  lsatTime = 0
  currentTime = millis()
  deltaTime = 0
  fill(255)
  textSize(64)


}

function draw() {
  lastTime = currentTime
  currentTime = millis()
  var dt = (currentTime - lastTime)/ 10
  // console.log(dt)


  if(!isGameOver){
    background(30)

    // player.pos.add(player.vel)
    if(isItemUse) {
      player.spriteAnimation(10)

      stroke(0)
      strokeWeight(5)
      fill(255)

      rect(player.pos.x - player.rad, player.pos.y + 30, (lastFrameCount - frameCount + 240) / 24 * 6.4 * dd / 2 , 12 * dd / 2)

    } else if(!isItemUse) player.draw()

    player.update(dt)
    enemy.update(dt)
    enemy.draw()
    sun.draw()
    item.draw()

    edgeCheck(player)
    enemyMove(enemy, player)
    getSun()
    itemGen()
    getItem()
    gameOver()
    itemEnd()
    enemyGrow()
    itemDraw()
  }

  text(score, 10, 50)

}

function gameOver(){
  if(!isGameOver){
    if(isItemUse) return 0
    if(collisionCheck(player, enemy)) {
      isGameOver = true
    }
  }
}

function itemEnd(){
  if(lastFrameCount + 240 < frameCount && isItemUse){
    isItemUse = false
    isItemGen = false
    player.isAnim = false

  }
}

function enemyGrow(){
  if(score % 4 == 2) isGrown = false
  if(!isGrown && score % 4 == 3){
    isGrown = true
    enemy.rad += 10
  }
}

function itemUse(){
  if(isItemGet){
    player.isAnim = true
    isItemUse = true
    lastFrameCount = frameCount
    isItemGet = false
    player.color = color(255)
  }
}

function itemGen(){
  if(!isItemGen && frameCount % 180 == 0){
    isItemGen = true
    item.pos.x = random(100, width - 100)
    item.pos.y = random(100, height - 100)
  }
}

function getItem(){
  if(isItemGen && collisionCheck(item, player)){
    isItemGet = true
    score++
    item.pos.x = -100
    item.pos.y = -100
  }
}

function itemDraw(){
  if(isItemGet){
    // tint(255,255,255,80)
    image(spriteSheets, width - player.rad , height - player.rad , player.rad, player.rad, 3 * 60, 0, 60, 60)
    // tint(255)
  }
}

function getSun(){
  if(collisionCheck(sun, player)){
    sun.pos.x = random(100, width - 100)
    sun.pos.y = random(100, height - 100)
    score++
    player.speed += 0.7
  }
}

function collisionCheck(a, b){
  if(dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y) < a.rad + b.rad) return true
}

function enemyMove(a, b){
  a.vel.x = (b.pos.x - a.pos.x) / dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y)
  a.vel.y = (b.pos.y - a.pos.y) / dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y)
}

function playerMove(planet){
  planet.vel.x = (mouseX - planet.pos.x) / dist(planet.pos.x, planet.pos.y, mouseX, mouseY)
  planet.vel.y = (mouseY - planet.pos.y) / dist(planet.pos.x, planet.pos.y, mouseX, mouseY)
}

function edgeCheck(planet){
  if(planet.pos.x - planet.rad < 0){
    planet.pos.x = planet.rad
    planet.vel.x *= -1
  } else if(planet.pos.x + planet.rad > width){
    planet.pos.x = width - planet.rad
    planet.vel.x *= -1
  } else if(planet.pos.y - planet.rad < 0){
    planet.pos.y = planet.rad
    planet.vel.y *= -1
  } else if(planet.pos.y + planet.rad > height){
    planet.pos.y = height - planet.rad
    planet.vel.y *= -1
  }
}
function keyPressed(){
  // console.log(keyCode)
  if(keyCode == 49) itemUse()
}

// function mouseDragged(){
// if(dw < dh){
//   itemUse()
//   }
// }
function touchMoved(){
  itemUse()
}
function touchStarted(){
  playerMove(player)
}

function mouseClicked(){
  if(dw > dh){
    playerMove(player)
  }
}
