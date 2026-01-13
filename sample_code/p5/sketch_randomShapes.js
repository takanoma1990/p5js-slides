let mic;
let smoothed = 0;
let particles = [];
let c1, c2;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-background");
  background(0);
  
  mic = new p5.AudioIn();
  mic.amp(2);
  mic.start();
  rectMode(CENTER);
  angleMode(DEGREES);
  noCursor();
  c1 = color(random(255),random(255),random(255), 100);
  c2 = color(random(255),random(255),random(255), 100);

  for (let y = 0; y < height; y++) {
    let inter = y/height; // 
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }
}

function draw() {
//   background(255, 10);
  // background(0);
  
  for (let y = 0; y < height; y++) {
    let inter = y/height; // 
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }

   
  let level = mic.getLevel();
  smoothed = lerp(smoothed, level, 0.1);
  
  let p_size = map(smoothed, 0.01, 0.2, 5, 100, true);
  let e_size = map(smoothed, 0.001, 0.2, 10, 1500, true);
  
  if(random(10) > 9){
    particles.push( new Particle(random(width), random(height), random(10,50)) );
    particles.push( new Particle(random(width), random(height), random(10,50)) );
    particles.push( new Particle(random(width), random(height), random(10,50)) );
  }
  
  for(p of particles){
    p.update();
    p.display();
  }
  
  for(let i = 0; i < particles.length; i++){
    if( particles[i].isDead() ){
      particles.splice(i,1);
    }
  }
}

class Particle{
  constructor(x,y, e_size){
    this.x = x;
    this.y = y;
    if(this.x <width/2){
      this.vx = random(-1.0, -0.1); 
    }else{
      this.vx = random(0.1, 1.0); 
    }
    this.vy = random(-1., 1.);
    this.direction = int(random(2));
    this.e_size = e_size;
    this.lifespan = 255;
    this.r = random(200,255);
    this.g = random(200,255);
    this.b = random(200,255);
    this.shapeType = int(random(4));
  }
  
  update(){
    if(this.direction ==0 ){
      this.x += this.vx;  
    }else{
      this.y += this.vy;  
    }
    this.lifespan -= 1;
  }
  
  display(){
    noStroke();
    let alpha = map(this.lifespan, 0, 255, -100, 100);
    alpha = map(abs(alpha), 0, 100, 255, 0);
    fill(this.r, this.g, this.b, alpha);
    if(this.shapeType == 0){
      ellipse(this.x, this.y, this.e_size); 
    }else if(this.shapeType == 1){
      rect(this.x, this.y, this.e_size); 
    }else if(this.shapeType == 2){
      drawTwinkleStar(this.x, this.y, this.e_size/2); 
    }else if(this.shapeType == 3){
      drawStar(this.x, this.y, this.e_size, 5); 
    }
  }
  
  isDead(){
    return this.lifespan <= 0;
  }
}

function drawStar(x, y, r, prickleNum) {
  let vertexNum = prickleNum * 2; // 頂点数(トゲの数*2)
  let R; // 中心点から頂点までの距離

  push();
  translate(x, y);
  rotate(-90);

  beginShape();
  for (let i = 0; i < vertexNum; i++) {
    R = i % 2 == 0 ? r : r / 2;

    vertex(R * cos(360 * i / vertexNum), R * sin(360 * i / vertexNum));
  }
  endShape(CLOSE);

  pop();
}


function drawTwinkleStar(x, y, r) {
  push();
  translate(x, y);

  beginShape();
  for (let theta = 0; theta < 360; theta++) {
    vertex(r * pow(cos(theta), 3), r * 1.4 * pow(sin(theta), 3));
  }
  endShape(CLOSE);

  pop();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

