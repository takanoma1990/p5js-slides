const num = 250;
const node_dist = 80;
const dot_alpha_max = 255;
const dot_alpha_min = 40;
const line_alpha_max = 220;
const line_alpha_min = 0;
const over = 200;  // 画角外の余白

let particles = [];
let x_min, x_max, y_min, y_max;

let mouseP = [];
let p_speed = 0.5;

let c1, c2;
let bg; // 背景用バッファ


let pre_mouse;

function setup() {
    // ★ 背景コンテナに canvas を追加
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("p5-background");
    noStroke();
    initBounds();
    initParticles();

    pre_mouse = createVector(width/2, height/2);

    c1 = color(random(200),random(200),random(200));
    c2 = color(random(200),random(200),random(200));

    makeGradient();
}

function draw() {
    image(bg, 0, 0);

    const nearest = new Array(particles.length).fill(Infinity);

    for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        if (d < nearest[i]) nearest[i] = d;
        if (d < nearest[j]) nearest[j] = d;

        if (d < node_dist) {
        const alpha = map(d, 0, node_dist, line_alpha_max, line_alpha_min, true);
        stroke(255, alpha);
        strokeWeight(1);
        line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        noStroke();
        }
    }
    }

    for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.update();
    p.bounce();
    const d = nearest[i];
    const alpha = isFinite(d)
        ? map(d, 0, node_dist, dot_alpha_max, dot_alpha_min, true)
        : dot_alpha_min;
    p.draw(alpha);
    }


    let randomize = 50;
    // 新しいパーティクルを中央から追加
    if(dist(mouseX, mouseY, pre_mouse.x, pre_mouse.y) > 10){
    mouseP.push(new mouseParticle(mouseX, mouseY));  
    mouseP.push(new mouseParticle(mouseX+random(-randomize,randomize), mouseY+random(-randomize, randomize)));
    }
    

    // 全てのパーティクルを更新・描画
    for (let p of mouseP) {
    p.update();
    p.display();
    }

    // 後ろから順に消えてるものを削除
    for (let i = mouseP.length - 1; i >= 0; i--) {
    if (mouseP[i].isDead()) {
        mouseP.splice(i, 1);
    }
    }

    pre_mouse = createVector(mouseX, mouseY);
}

class mouseParticle {
    constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-p_speed, p_speed);
    this.vy = random(-p_speed, p_speed);
    this.e_size = random(5, 20);
    this.life = 255; // 寿命（透明度として使う）
    this.r = random(200, 255);
    this.g = random(200, 255);
    this.b = random(200, 255);
    }

    update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 2;
    }

    display() {
    noStroke();
    // fill(this.r, this.g, this.b, this.life);
    fill(255, this.life);
    ellipse(this.x, this.y, this.e_size);
    }

    isDead() {
    return this.life <= 0;
    }
}

class Particle {
    constructor(x, y, d, vx = 0, vy = 0) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.d = d;
    }
    update() {
    this.vel.limit(2.5);
    this.pos.add(this.vel);
    }
    bounce() {
    const r = this.d * 0.5;
    const reflect = 0.9;

    if (this.pos.x < x_min + r) {
        this.pos.x = x_min + r;
        this.vel.x *= -reflect;
    }
    else if (this.pos.x > x_max - r) {
        this.pos.x = x_max - r;
        this.vel.x *= -reflect;
    }
    if (this.pos.y < y_min + r) {
        this.pos.y = y_min + r;
        this.vel.y *= -reflect;
    }
    else if (this.pos.y > y_max - r) {
        this.pos.y = y_max - r;
        this.vel.y *= -reflect;
    }
    }

    draw(a) {
    fill(255, a);
    ellipse(this.pos.x, this.pos.y, this.d, this.d);

    }
}

function initBounds() {
    x_min = -over;
    x_max = width + over;
    y_min = -over;
    y_max = height + over;
}

function initParticles() {
    particles = [];
    for (let i = 0; i < num; i++) {
    const p = new Particle(
        random(x_min, x_max),
        random(y_min, y_max),
        random(5, 10),
        random(-1, 1),
        random(-1, 1)
    );
    particles.push(p);
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initBounds();
    makeGradient();
}

