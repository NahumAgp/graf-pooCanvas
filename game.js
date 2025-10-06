// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw(color, sumLarge) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height + sumLarge);
    }

    move(direction, sumLarge) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height + sumLarge + sumLarge < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 4);
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true); // Controlado por el jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // Controlado por la computadora
        this.keys = {}; // Para capturar las teclas

        this.ball2 = new Ball(canvas.width / 2, canvas.height / 2, 5, 3, 3);
        this.ball3 = new Ball(canvas.width / 2, canvas.height / 2, 2, 2, 2);
        this.ball4 = new Ball(canvas.width / 2, canvas.height / 2, 15, 1, 1);
        this.ball5 = new Ball(canvas.width / 2, canvas.height / 2, 20, 4, 2);
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Pelotas con nuevos colores
        this.ball.draw('yellow');
        this.ball2.draw('red');
        this.ball3.draw('lime');
        this.ball4.draw('purple');
        this.ball5.draw('cyan');

        // Paletas
        this.paddle1.draw('blue', 100);  // paleta 1 en azul
        this.paddle2.draw('gray', 0);    // paleta 2 en gris
    }

    update() {
        this.ball.move();
        this.ball2.move();
        this.ball3.move();
        this.ball4.move();
        this.ball5.move();

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up', 50);
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down', 50);
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.ball);

        // === Colisiones y reseteo para cada pelota ===
        [this.ball, this.ball2, this.ball3, this.ball4, this.ball5].forEach(ball => {
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height + 100) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();