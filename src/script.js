let GameObject = function(position,size,selector){
  this.$el = $(selector)
  this.position = position
  this.size = size
  this.$el.css("position", "absolute")
  this.updateCSS()
}

GameObject.prototype.updateCSS = function(){
  this.$el.css("left", this.position.x)
  this.$el.css("top", this.position.y)
  this.$el.css("width", this.size.width)
  this.$el.css("height", this.size.height)
}
GameObject.prototype.collide = function(otherObject){
  let inRangeX = otherObject.position.x > this.position.x && 
      otherObject.position.x < this.position.x + this.size.width
   let inRangeY = otherObject.position.y > this.position.y && 
      otherObject.position.y < this.position.y + this.size.height
   return inRangeY && inRangeX
}

let Ball = function(){
  this.size ={width:15,height:15}
  this.position = {x:250, y:250}
  this.velocity = {x:-3,y:5}
  GameObject.call(this,this.position, this.size,".ball")
}

Ball.prototype = Object.create(GameObject.prototype)
Ball.prototype.constructor = Ball.constructor
Ball.prototype.update = function(){
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.updateCSS()
  if (this.position.x < 0 || this.position.x>500 - this.size.width){
    this.velocity.x = -this.velocity.x
  }
   if (this.position.y < 0 || this.position.y>500){
    this.velocity.y = -this.velocity.y
  }
}
Ball.prototype.init = function(){
  this.position = {x:250, y:250}
  let speed = 8
  let angle = Math.random()*Math.PI*2
  this.velocity = {
    x: speed * Math.cos(angle),
    y: speed * Math.sin(angle)
  }
  this.update()
}
let ball = new Ball()


//已知板子大小
let Board = function(position, selector){
  this.size = {
    width: 100,
    height: 15
  }
  GameObject.call(this,position,this.size,selector)
}
Board.prototype = Object.create(GameObject.prototype)
Board.prototype.constructor = Board.constructor
Board.prototype.update = function(){
  if (this.position.x < 0) {
    this.position.x = 0
  }
  if (this.position.x + this.size.width > 500) {
    this.position.x = 500 - this.size.width
  }
  this.updateCSS()
}

let board1 = new Board(
  {x:0,y:50},".b1"
)
let board2 = new Board(
  {x:0,y:455},".b2"
)


let Game = function(){
  this.timer = null
  this.grade = 0
  this.initControl()
  this.control = {}
}

Game.prototype.initControl = function(){
  let _this = this  
  $(window).keydown(function(evt){
    console.log(evt.key)
    if(evt.key ==='r') {
       _this.endGame("Restart")
       _this.startGame()
    }
    _this.control[evt.key] = true
    console.log(_this.control)
  })
   $(window).keyup(function(evt){
    _this.control[evt.key] = false
    console.log(_this.control)
  })
}
Game.prototype.startGame = function(){
  let _this = this
  let time = 3
  this.grade = 0
  ball.init()
  $("button").hide()
  let time_count = setInterval(function(){
    $(".infoText").text(time)
    time --
    if (time < 0) {
      clearInterval(time_count)
      $(".info").hide()
      _this.startGameMain()
    }
  },1000)
}
Game.prototype.startGameMain = function(){
  let _this = this
  this.timer = setInterval(function(){
    if (board1.collide(ball)) {
      console.log("hit board 1")
      ball.velocity.y = -ball.velocity.y
      ball.velocity.x *=1.1
      ball.velocity.y *=1.2
      ball.velocity.x += 0.5 - Math.random()
      ball.velocity.y += 0.5 - Math.random()
      
      _this.grade += 100
    }
    if (board2.collide(ball)) {
      console.log("hit board 2")
      ball.velocity.y = -ball.velocity.y
    }
    if (ball.position.y < 0) {
      console.log("board 1 lose")
      _this.endGame("Congratulation! You Win!!!")
    }
    if (ball.position.y + ball.size.height >= 500 ) {
      console.log("board 2 lose")
      ball.position.y = 500 - ball.size.height
      _this.endGame("You lose QaQ")
    }
    if (_this.control["ArrowLeft"]){
      board2.position.x -= 8
    }
    if (_this.control["ArrowRight"]){
      board2.position.x += 8
    }
    
    board1.position.x += ball.position.x > board1.position.x + board1.size.width/2 ? 8 : 0 
    board1.position.x += ball.position.x < board1.position.x + board1.size.width/2 ? -8 : 0 
    board1.update()
    board2.update()
    
    ball.update()
    $(".grade").text(`${_this.grade}---------> r: restart game`)
  },30)
}

Game.prototype.endGame = function(result){
  clearInterval(this.timer)
  $(".info").show()
  $("button").show()
  $(".infoText").html(result+"<br>Score: "+this.grade)
}

let game = new Game()
//game.startGame()
