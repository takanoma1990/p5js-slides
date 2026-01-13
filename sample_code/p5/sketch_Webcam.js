let video;
let prevPixels;
let threshold = 100;
let skip = 5;
let particles = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-background");
  pixelDensity(1);

  video = createCapture(
  { video: { facingMode: "user"}, audio: false },
  () => console.log("capture ready")
    );
    video.elt.setAttribute("playsinline", ""); // iOS対策
  video.size(160, 120);
  video.hide();
}

function draw() {
  background(0);

  video.loadPixels();
  if (video.pixels.length === 0) {
    return;
  }

  if (!prevPixels) {
    prevPixels = new Uint8ClampedArray(video.pixels.length);
    prevPixels.set(video.pixels);
    return;
  }

  if(frameCount > 120){
    for (let y = 0; y < video.height; y += skip) {
      for (let x = 0; x < video.width; x += skip) {
        let index = (x + y * video.width) * 4;

        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let pr = prevPixels[index + 0];
        let pg = prevPixels[index + 1];
        let pb = prevPixels[index + 2];

        // RGB の距離を変化量として使う
        let diff = dist(r, g, b, pr, pg, pb);

        if (diff > threshold) {
          // ビデオ座標をキャンバスの座標にマッピング
          let sx = map(x, 0, video.width, 0, width);
          let sy = map(y, 0, video.height, 0, height);

          // パーティクルが増えすぎないように制限
          if (particles.length < 10000) {
            particles.push(new Particle(width-sx, sy));
          }
        }
      }
    }
  }

  // 現在のピクセルを次フレーム用に保存
  prevPixels.set(video.pixels);

  // パーティクルの更新＆描画
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

// パーティクルクラス
class Particle {
  constructor(x, y) {
    let pos_random = 50;
    this.pos = createVector(x+random(-pos_random, pos_random), y+random(-pos_random, pos_random));
    let angle = random(TWO_PI);
    let speed = random(-.5, .5);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.life = 255;
    this.size = random(5, 20);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    // this.r = 50;
    // this.g = 100;
    // this.b = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(1);
    this.life -= 3;
  }

  show() {
    strokeWeight(2);
    noFill();
    let alpha = map(this.life, 0, 60, 0, 255);
    // fill(50, 255, 100, alpha);
    stroke(this.r, this.g, this.b, alpha);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}