const canvas = document.querySelector("canvas");

// Creación del contexto
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

// Establecer medidas
canvas.width = 600;
canvas.height = 600;

// Variables - juego
let counter = 0;

// Balon
const ballRadius = 3;

// Balon - posición
let X = canvas.width / 2;
let Y = canvas.height - 30;

// Balon - velocidad
let DX = -5;
let DY = -5;

// Variables de la paleta
const paddleWidth = 50;
const paddleHeight = 10;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 20;

const PADDLE_SENSITIVITY = 6;

let rightArrowPressed = false;
let leftArrowPressed = false;

// Variables de los ladrillos

const bricksRowCount = 6;
const bricksColCount = 32;
const brickWidth = 30;
const brickHeight = 14;
const bricksPadding = 2;
const brickOffsetTop = 80;
const brickOffsetLeft = 15;
const bricks = [];

const BRICKS_STATUS = {
  DESTROYED: 0,
  ACTIVE: 1,
};

for (let col = 0; col < bricksColCount; col++) {
  // Array vacío por cada columna
  bricks[col] = [];

  for (let row = 0; row < bricksRowCount; row++) {
    // Calcular la posición del ladrillo en la pantalla
    const brickX = col * (brickWidth + bricksPadding) + brickOffsetLeft;
    const brickY = row * (brickHeight + bricksPadding) + brickOffsetTop;

    // Asignar color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8);

    // Guardar la info de cada ladrillo

    bricks[col][row] = {
      x: brickX,
      y: brickY,
      status: BRICKS_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  // Dibujar el trazo
  ctx.beginPath();
  // Dibujar un circulo blanco
  ctx.arc(X, Y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";

  ctx.fill();
  // Cerrar el trazo
  ctx.closePath();
}

function ballMovement() {
  // Rebote lateral de la pelota
  if (
    X + DX > canvas.width - ballRadius || // Rebote derecho
    X + DX < ballRadius // Rebote Izq
  ) {
    DX = -DX;
  }

  // Rebote superior
  if (Y + DY < ballRadius) {
    DY = -DY;
  }

  // la pelota toca la pala
  const isBallSameXAsPaddle = X > paddleX && X < paddleX + paddleWidth;
  const isBallTouchingPaddle = Y + DY > paddleY;

  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    DY = -DY; // Cambio de dirección de la bola
  }
  // La pelota toca el suelo
  else if (Y + DY > canvas.height - ballRadius) {
    console.log("Game overrrrrrrrrrrrrrrrr");
    document.location.reload();
  }

  // Movimiento de la bola
  X += DX;
  Y += DY;
}

function drawPaddle() {
  ctx.fillStyle = "#123456";
  // Hacer un dibujo para la pala, posteriormente sustituiremos por un sprite
  // ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

  // Dibujar una imagen
  ctx.drawImage(
    $sprite, // imagen
    28, // ClipX: coordenadas del recorte
    174, // ClipY: coordenadas del recorte
    paddleWidth, // Tamaño del recorte
    paddleHeight, // Tamaño del recorte
    paddleX, // Posición X del dibujo
    paddleY, // Posición Y del dibujo
    paddleWidth, // Ancho del dibujo
    paddleHeight // Alto del dibujo
  );
}

function drawBricks() {
  for (let col = 0; col < bricksColCount; col++) {
    for (let row = 0; row < bricksRowCount; row++) {
      const currentBrick = bricks[col][row];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;

      ctx.fillStyle = "yellow";
      // ctx.rect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);
      ctx.stroke();
      ctx.fill();

      const clipX = currentBrick.color * 32;
      // Dibujar una imagen
      ctx.drawImage(
        $bricks, // imagen
        clipX, // ClipX: coordenadas del recorte
        0, // ClipY: coordenadas del recorte
        32, // Tamaño del recorte
        14, // Tamaño del recorte
        currentBrick.x, // Posición X del dibujo
        currentBrick.y, // Posición Y del dibujo
        brickWidth, // Ancho del dibujo
        brickHeight // Alto del dibujo
      );
    }
  }
}

function paddleMovement() {
  if (rightArrowPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY;
  } else if (leftArrowPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;

    if (key === "Right" || key === "ArrowRight") {
      rightArrowPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftArrowPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;

    if (key === "Right" || key === "ArrowRight") {
      rightArrowPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftArrowPressed = false;
    }
  }
}

function collisionDetection() {
  for (let col = 0; col < bricksColCount; col++) {
    for (let row = 0; row < bricksRowCount; row++) {
      const currentBrick = bricks[col][row];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick = X > currentBrick.x && X < currentBrick.x + brickWidth;
      const isBallSameYAsBrick = Y > currentBrick.y && Y < currentBrick.y + brickHeight;

      if(isBallSameXAsBrick && isBallSameYAsBrick){
        DY = -DY
        currentBrick.status = BRICKS_STATUS.DESTROYED
      }
    }
  }
}

function draw() {
  cleanCanvas();
  drawBall();
  drawPaddle();
  drawBricks();
  ballMovement();
  paddleMovement();
  collisionDetection();

  window.requestAnimationFrame(draw);
}

draw();
initEvents();
