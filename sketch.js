var player
var enemy
var sun
var item
var bg

var name
var score

var dw
var dh

var bgm
var eatSound
var gameOverSound

var isItemGen
var isItemGet
var isItemUse
var isGameOver
var isGrown
var isPost
var isInput
var isEnter
var isCreatedInput
var isIntroPlayed
var isMobile

var spriteSheets
var spriteIndex

var currentTime
var lastTime
var deltaTime


var lastFrameCount

var font

var jsonUrl
var pwJson

var UIInput


function preload(){
  bg = load("assets/bg.png")
  bgm = loadSound("assets/bgm.mp3")
  eatSound = loadSound("assets/eat.mp3")
  gameOverSound = loadSound("assets/gameoverBgm.mp3")
  font = loadFont("assets/love.ttf")
  spriteSheets = loadImage("assets/spriteSheets.png")
  jsonUrl = 'https://spreadsheets.google.com/feeds/list/1ez-PCsSvKQ2-7e9WvKGa6DSbhr6PbT16yxi5Xj4cAlc/od6/public/values?alt=json'
  pwJson = loadJSON(jsonUrl)
}
function setup() {
  bgm.playMode('restart')
  eatSound.playMode('restart')
  gameOverSound.playMode('restart')
  bgm.play()
  var dd = displayDensity()
  pixelDensity(1)
  dw = displayWidth - 100
  dh = displayHeight - 100
isMobile = false
isInput = true
/*
  if(dw > dh){
    createCanvas(640, 640)
  } else isMobile = true
*/

createCanvas (640,640)

  imageMode(CENTER)
  textFont(font)
  textAlign(LEFT,CENTER)
  background(30)
  score = 0
  name = ''
  lastFrameCount = 0
  // UIInput = new UI(width / 2, height / 2, 120, 20)

  player = new Planet(width - 100, height - 100, 0, 0, 2, 0, false, 4)
  enemy = new Planet(100, 100, 1, 1, 1, 1, false)
  sun = new Planet(random(100, width - 100), random(100, height - 100), 0, 0, 0, 2, false)
  item = new Planet(-100, -100, 0, 0, 0, 3, false)

  isItemGen = false
  isItemGet = false
  isItemUse = false
  isGameOver = false
  isGrown = false
  isPost = false
  isInput = false
  isEnter = false
  isCreatedInput = false
  isIntroPlayed = false

  spriteIndex = 0
  // player.spriteAnimation(10)

  lsatTime = 0
  currentTime = millis()
  deltaTime = 0
  fill(255)
  textSize(64)

}

function draw() {
  if(!isMobile){
  lastTime = currentTime
  currentTime = millis()
  var dt = (currentTime - lastTime)/ 10
  // console.log(dt)
  push()
  if(!isIntroPlayed) intro()
  pop()

  if(!isGameOver && isIntroPlayed){
    background(30)

    // player.pos.add(player.vel)
    if(isItemUse) {
      player.spriteAnimation(10)

      stroke(0)
      strokeWeight(5)
      fill(255)

      rect(player.pos.x - player.rad, player.pos.y + 30, (lastFrameCount - frameCount + 240) / 24 * 6.4, 12)

    } else if(!isItemUse) player.draw()

    player.update(dt)
    enemy.update(dt)
    image(bg,0,0)
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
  if(isGameOver){
    bgm.stop()
    gameOverSound.play()
  }
  if(isGameOver && !isCreatedInput){
    isCreatedInput = true
    var myInput = createInput('')
    myInput.position(width / 2 - myInput.size().width / 2, height / 2)

    myInput.input(myInputEvent)
  }
  if(isGameOver & !isPost){
    if(isInput){
      isPost = true
      var url = 'https://script.google.com/macros/s/AKfycby0VLtnKlOsKmHFA-eiwptlgdW75PyY7ad7sTL4_wP9/dev' + '?name=' + name + '&score=' + score;
      httpDo(url)
    }
  }

  text(score, 30, 50)

}
}
function intro(){
  for(var i =0; i < 10; i++){

    var introText = i + 1 + " : " + pwJson.feed.entry[i].gsx$name.$t + " " + pwJson.feed.entry[i].gsx$score.$t

    fill(255)
    textSize(32)
    text(introText, width / 4, i*32 + height / 5)
  }

}

function myInputEvent(){
  name = this.value()
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
    enemy.speed += 0.5
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
    eatSound.play()
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
    eatSound.play()
    sun.pos.x = random(100, width - 100)
    sun.pos.y = random(100, height - 100)
    score++
    player.speed += 0.3
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

  // UIInput.draw(keyCode)
  // if(UIInput.charIndex > 1 && keyCode == 13){
  //   // name = UIInput.char
  //   for(var i = 0; i<UIInput.char.length; i++){
  //     name += UIInput.char[i]
  //   }
  //   isInput = true
  // }
  // if(isGameOver) UIInput.charArray(key, keyCode)
  if(keyCode == 13 && isGameOver){

    console.log(name)
    isInput = true
    removeElements()

  }
  if(keyCode == 49) itemUse()
}


function touchStarted(){

isIntroPlayed = true

  if(dw > dh){
    playerMove(player)
  }

}
function mouseClicked(){
  isIntroPlayed = true

  if(dw > dh){
    playerMove(player)
  }
}
