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



function draw() {
  drawBall();
  drawPaddle();
  ballMovement();

  window.requestAnimationFrame(draw);
}

draw();
