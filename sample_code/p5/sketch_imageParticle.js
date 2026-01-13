let particles = [];
let c1, c2;

let imgs = [];
let imgPaths = [
  // ★imgフォルダのpngを全部ここに書く
  "img/Mediapipe_Hand_Particle.png",
  "img/webcamera_particle.png",
  "img/カレイドスコープ.png",
];

function preload() {
  // 画像を全部読み込む
  imgs = imgPaths.map(p => loadImage(p));
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-background");
  rectMode(CENTER);
  angleMode(DEGREES);
  imageMode(CENTER);

  c1 = color(random(255), random(255), random(255), 100);
  c2 = color(random(255), random(255), random(255), 100);
}

function draw() {
  // グラデ背景
  for (let y = 0; y < height; y++) {
    let inter = y / height;
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }

  // 生成
  if (random(10) > 9.5 && imgs.length > 0) {
    for (let k = 0; k < 3; k++) {
      particles.push(new Particle(random(width), random(height), random(20, 120)));
    }
  }

  // 更新＆描画
  for (let p of particles) {
    p.update();
    p.display();
  }

  // 間引き削除（後ろから消すのが安全）
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

class Particle {
  constructor(x, y, e_size) {
    this.x = x;
    this.y = y;
    this.e_size = e_size;
    this.lifespan = 255;

    // 速度
    if (this.x < width / 2) this.vx = random(-1.0, -0.1);
    else this.vx = random(0.1, 1.0);
    this.vy = random(-1., 1.);
    this.direction = int(random(2));

    // ★このパーティクルが使う画像を1枚決める
    this.img = random(imgs);

    // 回転と回転速度（オマケ）
    this.rot = random(360);
    this.rotSpd = random(-2, 2);
  }

  update() {
    if (this.direction === 0) this.x += this.vx;
    else this.y += this.vy;

    this.rot += this.rotSpd;
    this.lifespan -= 2; // 速度調整
  }

    display() {
    let alpha = map(this.lifespan, 0, 255, -100, 100);
    alpha = map(abs(alpha), 0, 100, 255, 0);

    // 画像の縦横比
    const ar = this.img.width / this.img.height;

    // 長辺が this.e_size になるようにw/hを決める
    let w, h;
    if (ar >= 1) {         // 横長
        w = this.e_size;
        h = this.e_size / ar;
    } else {               // 縦長
        h = this.e_size;
        w = this.e_size * ar;
    }

    push();
    translate(this.x, this.y);
    // rotate(this.rot);

    tint(255, alpha);
    image(this.img, 0, 0, w, h);
    noTint();
    pop();
    }


  isDead() {
    return this.lifespan <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
