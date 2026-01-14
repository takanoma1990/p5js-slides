let particles = [];
let c1, c2;
let bg;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-background");
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }

  c1 = color(random(255),random(255),random(255));
  c2 = color(random(255),random(255),random(255));

  makeGradient();
}

function draw() {

  image(bg, 0, 0);

  for (let y = 0; y < height; y++) {
    let inter = y/height; // 
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height+50, height/2);//上半分から描画
    this.vx = random(-0.3, 0.3);//左右の動きは小さくする
    this.vy = random(-0.2, -0.8);//下方向のみに移動
    this.size = random(5, 20);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) {
      //一番下まで行ったら、上部の位置に更新
      this.y = random(height, height+50);
      this.x = random(width);
    }
  }

  display() {
    noStroke();
    fill(255, 180);
    ellipse(this.x, this.y, this.size);
  }
}

function makeGradient() {
  bg = createGraphics(width, height);
  bg.noFill();
  for (let y = 0; y < height; y++) {
    let inter = y / height;
    bg.stroke(lerpColor(c1, c2, inter));
    bg.line(0, y, width, y);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  makeGradient();
}