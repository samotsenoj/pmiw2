let imgMontania;
let soundBg;

function preload() {
     imgMontania = loadImage("data/imagesisifo.png");
     soundBg = loadSound("data/audiofondo.mp3");

}

class Player {
     constructor(positionsX, y) {
          this.positionsX = positionsX;
          this.index = 1;
          this.w = 60;
          this.h = 60;
          this.y = y;
     }

     show() {
          push();
          translate(this.positionsX[this.index], this.y);

          fill(0);
          ellipse(0, -20, 30, 30);

          stroke(0);
          strokeWeight(3);
          line(0, -5, 0, 20);

          line(0, 0, -15, 10);
          line(0, 0, 15, 10);

          noStroke();
          fill(90);
          ellipse(18, 10, 21, 19);

          pop();
     }

     moveLeft() {
          if (this.index > 0) this.index--;
     }

     moveRight() {
          if (this.index < this.positionsX.length - 1) this.index++;
     }

     getBounds() {
          return {
               x: this.positionsX[this.index] - this.w / 2,
               y: this.y - this.h / 2,
               w: this.w,
               h: this.h
          };
     }
}

class Rock {
     constructor(x, y, speed) {
          this.x = x;
          this.y = y;
          this.size = random(40, 70);
          this.speed = speed;
     }

     update() {
          this.y += this.speed;
     }

     show() {
          push();
          fill(160, 40, 40);
          stroke(120, 0, 0);
          strokeWeight(2);
          ellipse(this.x, this.y, this.size, this.size * 0.85);
          pop();
     }

     offscreen() {
          return this.y > height + 50;
     }

     hits(playerBounds) {
          let px = playerBounds.x + playerBounds.w / 2;
          let py = playerBounds.y + playerBounds.h / 2;
          let distX = this.x - px;
          let distY = this.y - py;
          let distance = sqrt(distX * distX + distY * distY);
          return distance < this.size / 2 + 25;
     }
}

class Particle {
     constructor(x, y, type) {
          this.x = x;
          this.y = y;
          this.size = random(3, 7);
          this.speed = random(1, 3);
          this.type = type;
     }

     update() {
          this.y += this.speed;
     }

     offscreen() {
          return this.y > height + 10;
     }

     show() {
          noStroke();
          if (this.type === "green") fill(40, 140, 60);
          else fill(150, 100, 60);
          ellipse(this.x, this.y, this.size, this.size * 0.6);
     }
}

class Game {
     constructor() {
          this.player = null;
          this.rocks = [];
          this.particles = [];
          this.positionsX = [];
          this.score = 0;
          this.spawnTimer = 0;
          this.spawnInterval = 980;
          this.gameOver = false;
     }

     init() {
          this.positionsX = [width * 0.25, width * 0.5, width * 0.75];
          this.player = new Player(this.positionsX, height - 80);

          this.rocks = [];
          this.particles = [];
          this.score = 0;
          this.spawnTimer = 0;
          this.spawnInterval = 1200;
          this.gameOver = false;
     }

     update() {
          // partículas decorativas
          if (!this.gameOver && random() < 0.5) {
               let tipo = random() < 0.6 ? "brown" : "green";
               this.particles.push(new Particle(random(width), -10, tipo));
          }

          for (let i = this.particles.length - 1; i >= 0; i--) {
               this.particles[i].update();
               this.particles[i].show();
               if (this.particles[i].offscreen()) this.particles.splice(i, 1);
          }

          // aparición de rocas
          if (!this.gameOver) {
               this.spawnTimer += deltaTime;
               if (this.spawnTimer > this.spawnInterval) {
                    this.spawnTimer = 0;
                    let x = random(40, width - 40);
                    let baseMin = 5 + this.score / 300;
                    let baseMax = 7 + this.score / 300;
                    let speed = random(baseMin, baseMax);
                    this.rocks.push(new Rock(x, -60, speed));
               }
          }

          for (let i = this.rocks.length - 1; i >= 0; i--) {
               this.rocks[i].update();
               this.rocks[i].show();

               if (this.rocks[i].hits(this.player.getBounds()) && !this.gameOver) {
                    this.gameOver = true;
                    soundBg.stop();
               }

               if (this.rocks[i].offscreen()) this.rocks.splice(i, 1);
          }

          this.player.show();

          if (!this.gameOver) {
               this.score++;
          }
     }

     drawUI() {
          // marco
          stroke(0);
          strokeWeight(4);
          noFill();
          rect(0, 0, width, height);

          fill(0);
          textSize(20);
          textAlign(RIGHT, TOP);
          text("Score: " + this.score, width - 10, 10);

          if (this.gameOver) {
               textAlign(CENTER, CENTER);
               fill(255, 0, 0);
               textSize(28);
               text("PERDISTE - Presioná R para reiniciar", width / 2, height / 2);
          }

          this.drawIndicators();
     }

     drawIndicators() {
          push();
          noFill();
          stroke(0);
          strokeWeight(2);
          let y = height - 20;
          let w = 70, h = 30;
          rectMode(CENTER);
          for (let i = 0; i < this.positionsX.length; i++) {
               rect(this.positionsX[i], y, w, h, 4);
          }
          pop();
     }
}

// ---------------------

let game;

function setup() {
     createCanvas(640, 480);
     game = new Game();
     game.init();

     soundBg.setLoop(true);
     soundBg.setVolume(1);
     soundBg.play();
}
function mousePressed() {
     if (!soundBg.isPlaying()) {
          soundBg.play();
     }
}
function draw() {
     image(imgMontania, 0, 0, width, height);
     game.update();
     game.drawUI();
}

function keyPressed() {
     if (keyCode === LEFT_ARROW && !game.gameOver) {
          game.player.moveLeft();
     } else if (keyCode === RIGHT_ARROW && !game.gameOver) {
          game.player.moveRight();
     } else if (key === 'r' || key === 'R') {
          game.init();
     }
}
