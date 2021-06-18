let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let min = 1 ;
let max = 255 ;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;

function reset(){
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 2;
    dy = -2;
    document.location.reload();
}

/**
 * ブロックの位置情報
 * @var Object[]
 */
let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// let r = Math.floor( Math.random() * (max + 1 - min) ) + min ;
// let g = Math.floor( Math.random() * (max + 1 - min) ) + min ;
// let b = Math.floor( Math.random() * (max + 1 - min) ) + min ;

/**
 * ボールの描画
 */
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    x += dx;
    y += dy;
}
/**
 * パドルの描画
 */
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    collisionDetection()
}
/**
 * ブロックの描画
 */
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
/**
 * 描画する
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawPauseOrResumeButton();
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("がんばれ！！もう一回挑戦だ");
            reset()
        }
    }
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
/**
 * パドルが動く
 * @param {Event} e 押されたキー情報
 */
function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}
/**
 * パドルが動いた後に止まる
 * @param {Event} e 押されたキー情報
 */
function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("mousemove", mouseMoveHandler, false);
/**
 * マウス操作
 */
 function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
/**
 * 衝突検知
 */
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("すごい！！！！大変よくできました！！");
                        reset()
                    }
                }
            }
        }
    }
}

/**
 * スコア描画
 */
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

/**
 * 一時停止と再開ボタン描画
 */
function drawPauseOrResumeButton() {
    let bottomLeft = { x: canvas.width - 20, y: 20 };
    if (pauseHandle != null) {
        drawResumeButton();
    } else {
        drawPauseButton();
    }
    function drawPauseButton() {
        let rectL = {
            x: bottomLeft.x,
            y: bottomLeft.y - 15,
        };
        let rectR = {
            x: bottomLeft.x + 10,
            y: bottomLeft.y - 15,
        }
        let w = 5, h = 15;
        ctx.fillRect(rectL.x, rectL.y, w, h);
        ctx.fillRect(rectR.x, rectR.y, w, h);
    }
    function drawResumeButton() {
        ctx.beginPath();
        ctx.moveTo(bottomLeft.x, bottomLeft.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y - 15);
        ctx.lineTo(bottomLeft.x + 15, bottomLeft.y - 7.5);
        ctx.fill();
    }
}
canvas.addEventListener('click', function(mouseEvent) {
    if (pauseOrResumeButtonIsClicked()) {
        gamePauseOrResume();
    }
    function pauseOrResumeButtonIsClicked() {
        return mouseEvent.offsetX > (canvas.width - 20) &&
            mouseEvent.offsetY < 20;
    }
}, false);

/**
 * ゲーム開始と一時停止用Handle
 */
let pauseHandle = null;

/**
 * ゲーム開始
 */
function gameStart() {
    pauseHandle = setInterval(draw, 10);
}

/**
 * ゲーム一時停止と再開
 */
function gamePauseOrResume() {
    if (pauseHandle != null) {
        clearInterval(pauseHandle);
        pauseHandle = null;
    } else {
        gameStart();
    }
}

gameStart();
