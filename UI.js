function UI(x, y, w, h){
  this.pos = createVector(x, y)
  this.textIndex = 0
  this.textSize = 16
  this.char = []
  this.charIndex = 0

  this.charArray = function(key, keyCode){
    if(keyCode == 8 && this.charIndex > 0){
      console.log("backspace")
      this.char.splice(this.charIndex - 1)
      this.charIndex --
    } else if(keyCode != 8 && keyCode != 16 && keyCode != 17 && keyCode != 18 && keyCode != 19 && keyCode != 9 && keyCode != 91 && keyCode != 32 && keyCode != 27){
    this.char[this.charIndex] = key
    this.charIndex ++
    console.log(this.char)
    }
  }
  this.draw = function(){
    push()
    textSize(16)
    fill(255)
    noStroke()
    rect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    fill(255,0,0)
    textSize(16)
    for(var i = 0; i < this.char.length; i++){
      textAlign(CENTER,CENTER)

      text(this.char[i], this.textSize + this.pos.x - w / 2 + i * this.textSize, this.pos.y)
    }
    pop()
    // for(var i =0; i<this.char.length; i++{
    //   text(this.char[i], this.pos.x + i*this.textSize, this.pos.y)
    // }
  }
  this.img = function(){}
  this.label = function(){}
  this.button = function(){}
}
