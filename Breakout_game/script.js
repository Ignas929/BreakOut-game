var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

const ball = {
  leftCornerX: (canvas.width/2) + Math.floor(Math.random()*41)-10,
  leftCornerY: (canvas.height-30) + Math.floor(Math.random()*41)-10,
  size: 34,
  speed: 6,
  img: (function() {
    var img = new Image();
    img.src = 'ball.jpg';
    return img;
  })()
};

var x = (canvas.width/2) + Math.floor(Math.random()*41)-10;
var y = (canvas.height-30) + Math.floor(Math.random()*41)-10;
var horizontalMovement = ball.speed;
var verticalMovement = -1 * ball.speed;					
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var paddleSpeed = 7;
var rightButton = false;
var leftButton = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var pause = false;
var bricks = [];


initBricks();

function initBricks(){
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {x:0, y:0, status:1};
    }
  }
}

 document.addEventListener("keydown", keyDownHandler);
 document.addEventListener("keyup", keyUpHandler);
 document.addEventListener("mousemove", mouseMoveHandler);

function drawBricks(){
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {

      if (bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095ED";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function keyDownHandler(e){
  if (e.keyCode == 39){
    rightButton = true;
  }
  else if (e.keyCode == 37){
    leftButton = true;
  }
}

function keyUpHandler(e){
  if (e.keyCode == 39){
    rightButton = false;
  }
  else if (e.keyCode == 37){
    leftButton = false;
  }
}

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  if (0 < relativeX - paddleWidth/2 && relativeX + paddleWidth/2 < canvas.width){
    paddleX = relativeX - paddleWidth/2;
  }
}

function drawBall(){
  ctx.drawImage(ball.img, x, y, ball.size, ball.size);
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#4ab05c';
  ctx.fill()
  ctx.closePath();
}

function collisionDetect(){
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          verticalMovement = -verticalMovement;
          b.status = 0;
          score++;
          if (score == 1/*brickRowCount*brickColumnCount*/){
            if (level === maxLevel){
              alert("Victory!");
              document.location.reload();
            }
            else {
              level++;
              brickRowCount++;
              initBricks();
              score = 0;
              horizontalMovement += 2;
              verticalMovement = -verticalMovement;
              verticalMovement -= 2;
              x = (canvas.width/2) + Math.floor(Math.random()*41)-10;
              y = (canvas.height-30) + Math.floor(Math.random()*41)-10;
              paddleX = (canvas.width-paddleWidth)/2;
              pause = true;
              drawPause();
              setTimeout(function(){
                pause = false;
                draw();
              }, 1500)
            }
          }
        }
      }
    }
  }
}

function drawPause(){
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.font = "36px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Level " + (level - 1) + " completed", canvas.width/2-150, canvas.height/2);
  ctx.closePath();
}

function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function drawLevel(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: " + level, 210, 20);
}

function draw(){
  clearScreen();
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  drawLevel();
  collisionDetect();

  if (y + verticalMovement < ball.size){
    verticalMovement = -verticalMovement
  } else if (y + verticalMovement > canvas.height-ball.size){
    if( (x > paddleX) && (x < paddleX + paddleWidth) ){
      verticalMovement = -verticalMovement;
    }
    else{
      if (!lives){
        document.location.reload();
      }
      else {
        lives--;
        x = (canvas.width/2) + Math.floor(Math.random()*41)-10;
        y = (canvas.height-30) + Math.floor(Math.random()*41)-10;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }
  if ( (x + horizontalMovement + ball.size/2 < 0) || (x + (ball.size/2 )+ horizontalMovement > canvas.width) ){
    horizontalMovement = -horizontalMovement;
  }

  if (rightButton && (paddleX < (canvas.width - paddleWidth)) ){
    paddleX += paddleSpeed ;
  }
  else if (leftButton && (paddleX > 0) ){
    paddleX -= paddleSpeed ;
  }
  x += horizontalMovement;
  y += verticalMovement;
  if (!pause){
    requestAnimationFrame(draw);
  }
}

function clearScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

draw();
