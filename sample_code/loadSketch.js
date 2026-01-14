// 背景用 p5.js スケッチの候補
const sketches = [
  "p5/sketch_flowParticle.js",
  "p5/sketch_mouseParticle.js",
  "p5/sketch_randomShapes.js"
  // "p5/sketch_Webcam.js"
];

// ランダムに1つ選ぶ
const chosen = sketches[Math.floor(Math.random() * sketches.length)];

// scriptタグを動的に作る
const script = document.createElement("script");
script.src = chosen;
document.body.appendChild(script);
