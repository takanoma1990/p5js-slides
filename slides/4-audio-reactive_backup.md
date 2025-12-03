---
marp: true
theme: gradient_v2
paginate: true
class: p5_v2
header: p5.js 授業 第4回
footer: 音の入力と可視化表現
---

<!-- _unsafe: true -->
<style>
.center-img {
  display: block;
  margin: 0 auto;
}
</style>

# 第4回　クリエイティブ・コーディング入門
## 音の可視化①（振幅を使った可視化）

---

## オーディオリアクティブな表現

- リアルタイムで音に反応する視覚表現のこと
- 音の変化を視覚化することで、リアルタイムな変化を強調する
- 様々なビジュアル・プログラミング・ツールで
- 参考事例
  - [Sumberser - audio reactive Quartz Composer](https://www.youtube.com/watch?v=NVTiI9Zye_o)
  - [TouchDesigner AudioVisual](https://www.youtube.com/watch?v=w5RhMsfN6lU)

---

# 全体の流れ

- p5.soundライブラリを使った音の利用
- マイク入力からの音量を使った制御
- 音源(mp3,m4aなど)などの音量を使った制御
- 応用：パーティクルのコードをアレンジ

---

# p5.soundライブラリについて

---

## p5.sound とは

- p5.js で音の処理を行うライブラリ
  - マイク入力・音量解析・周波数解析（FFT）など
  - サウンドファイルの再生・録音も可能
- 使われ方：音による図形の制御 = 可視化
  - 音量を図形・色・動きに変換
  - ピーク検知によるパーティクルや図形の生成

---

## p5.sound の読み込み

- Web Editor は`index.html`内でCDNによってライブラリが読み込まれている
  - CDN :外部サーバーからライブラリを読み込む仕組み
  - `<script src="https://cdn~~/p5.sound.min.js">`の部分

---


## 利用できる主なクラス

- **p5.AudioIn**  
  マイク入力を取得する
- **p5.Amplitude**  
  全体の音量レベルを取得
- **p5.FFT**  
  音を周波数ごとに分析する
- **loadSound / p5.SoundFile**  
  音声ファイルの読み込み・再生

---

## 今回の内容：音量を使った描画

- 入力音のレベル値を使って描画を制御する
- 主に二つの利用方法がある
  ①：音量を使って大きさや色のパラメータを制御
    - ellipseやrectの大きさと色を変える
    - 動いているオブジェクトの大きさを制御する
  ②：閾値を設定して生成のトリガーにする
    - パーティクルやオブジェクトの生成に音量を利用する
- 今回は①の方を扱う
---


# マイクの入力音を使う

---

## マイク入力の音量を円の大きさに反映

- パソコンやスマホのマイク入力を取得する
  - `mic = new p5.AudioIn();`
- `mic.getLevel()` で、その瞬間の **音量の大きさ**（0.0〜1.0の範囲）を取得
- 音量を円の直径に変換するために **map() 関数**を使う
  - map()：ある値を別の範囲へ線形的に変換する関数
  - 使い方：`map(値, 入力最小, 入力最大, 出力最小, 出力最大)`
  - 例：`diameter = map(level, 0, 1, 0, 300);`
  - マイクの音が小さい場合→ 入力最大値を 0.1 などに調整する

---

# マイク入力の音量を円で可視化（[サンプルコード](https://editor.p5js.org/takano_ma/sketches/GH2QTmR3d)）

```javascript
let mic;
function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  // マイク入力を開始
  mic = new p5.AudioIn();
  mic.start(); // ブラウザがマイクへのアクセス許可を求める
}
function draw() {
  background(0);
  let level = mic.getLevel();
  // 音量を円の直径にマッピング
  let diameter = map(level, 0, 0.1, 0, width);
  noStroke();
  fill(0, 127, 255, 200);
  ellipse(width / 2, height / 2, diameter);
}
```

---


# 背景の透明度を下げて残像を残しておく（[サンプルコード](https://editor.p5js.org/takano_ma/sketches/jphz_RyWa)）

- 音量は変化が激しいため、そのままだと描画の変化も激しい
- 背景の透明度を低くすると前フレームの残像が残るので少し滑らかに見える

```javascript
function draw() {
  background(0, 5);//透明度を下げて残像が残るように
  let level = mic.getLevel();
  // 音量を円の直径にマッピング
  let diameter = map(level, 0, 0.1, 0, width);
  noStroke();
  fill(0, 127, 255, 200);
  ellipse(width / 2, height / 2, diameter);
}
```


---

# lerpを使った音量のスムージング
## （[サンプルコード](https://editor.p5js.org/takano_ma/sketches/rZLqwuBFj)）

---

## lerp()で音量の変化を滑らかに

- `getLevel()` の値をそのまま使うと変化が激しくなってしまう
- lerp関数を使って変化を滑らかにする
- `lerp(a, b, t)`：a から b へ t の割合だけ近づける（0〜1）
- 前フレームの値用に `smoothLevel` を用意しておく
- `smoothLevel = lerp(smoothLevel, level, 0.1);`
- 得られた `smoothLevel` を `map()` で円の直径に変換
- t を小さく→ゆっくり滑らか，大きく→すばやく追従

---

## lerp() を使ったコード

- 事前に `let smoothLevel = 0;` を宣言しておく
- draw() の中で：
  - `let level = mic.getLevel();`
  - `smoothLevel = lerp(smoothLevel, level, 0.1);`
  - `diameter = map(smoothLevel, 0, 1, 0, width);`
- あとは `ellipse(width/2, height/2, diameter);` で円を描画


---

## スムージングを用いたコード

```javascript
let mic;
let smoothLevel = 0;   // ← 追加

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  //… 以下省略
}

function draw() {
  let level = mic.getLevel();

  smoothLevel = lerp(smoothLevel, level, 0.1);  // ← 追加
  let diameter = map(smoothLevel, 0, 1, 0, width);  // ← 変更
  //… 以下省略
}

```

---


# 応用：音でパーティクルの大きさや速度を変える
## ([サンプルコード](https://editor.p5js.org/takano_ma/sketches/TkqIoAI6U))

---

## 音でパーティクルを制御する考え方

- mic.getLevel() で「音量（0〜1）」を取得できる  
- 音量は揺れが激しいため **lerp() でスムージング**  
- スムージング後の値を **パーティクルのサイズ・速度の倍率に変換**  
- パーティクルの基本構造は前回扱ったため、今回は「音との連動」に注目

---

## 音量をスムージングして倍率に変換する

```javascript
let smoothed = 0;          // スムージング後の音量
let smoothing_ratio = 0.1; // 小さいほどゆっくり変化
let levelMax = 0.1;        // 想定する最大音量（環境に応じて調整）

function draw() {
  let level = mic.getLevel();           // その瞬間の音量
  smoothed = lerp(smoothed, level, smoothing_ratio);

  // 音量→大きさの倍率に変換
  let sizeScale = map(smoothed, 0, levelMax, 1, 10.0, true);

  // 音量→速度の倍率に変換
  let speedScale = map(smoothed, 0, levelMax, 0.1, 5.0, true);
}
```

---

## パーティクルに倍率を渡して反映させる

- update(scale) で **速度に倍率をかける**
- display(scale) で **大きさに倍率をかける**
- 音が大きいほど速く・大きく動く表現が可能

```javascript
for (let p of particles) {
  p.update(speedScale);   // ← 音量で速さを変える
  p.display(sizeScale);   // ← 音量で大きさを変える
}
```

---

## パーティクルクラス：サイズと速度に scale を反映

```javascript
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = random(0, 360);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.baseSize = random(5, 20); // 基本サイズ
  }

  update(scale) {
    this.x += this.vx * scale;  // 音量倍率で速度UP
    this.y += this.vy * scale;

    // 端で跳ね返る
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display(scale) {
    noStroke();
    fill(this.col, 80, 100, 50);
    let s = this.baseSize * scale; // 音量でサイズUP
    ellipse(this.x, this.y, s, s);
  }
}
```

---

# 応用：パーティクルの動きをアレンジする

---

## ①移動する方向を限定する([サンプルコード](https://editor.p5js.org/takano_ma/sketches/fGRciqTxC))

- パーティクルごとに縦か横のどちらかの移動に限定する
- 初期設定で移動軸を決める変数を用意

```javascript
  constructor(x, y) {
    //...
    this.v = random(-0.5, 0.5);
    this.direction = int(random(2)); //移動する軸を決める
    //...
  }
  update(scale){
    if(this.direction == 0) this.x += this.v*scale; //x軸での移動
    if(this.direction == 1) this.y += this.v*scale; //y軸での移動
    //...
  }
```

---


## ②三角関数を使って波のような動きにする([サンプルコード](https://editor.p5js.org/takano_ma/sketches/uW3PaN_bF))

- パーティクルごとに縦か横のどちらかの移動に限定する
- 初期設定で移動軸を決める変数を用意

```javascript
  constructor(x, y) {
    //...
    this.v = random(-0.5, 0.5);
    this.direction = int(random(2)); //移動する軸を決める
    //...
  }
  update(scale){
    if(this.direction == 0) this.x += this.v*scale; //x軸での移動
    if(this.direction == 1) this.y += this.v*scale; //y軸での移動
    //...
  }
```

---


# 応用：マイク入力で波紋を生成する
## ([サンプルコード](https://editor.p5js.org/takano_ma/sketches/LL8O2Z1nV))

---

## 波紋を表すクラス（Ripple）の作成

- 「波紋」＝  
  - 中心位置（x, y）
  - 大きさ（e_size）
  - 透過度（lifespan）を持つクラス
- `update()` で  
  - 波紋を少しずつ大きくする
  - 透過度を少しずつ下げる
- `display()` で  
  - 枠線だけの円を描画

---

```javascript
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.e_size = 1;
    this.lifespan = 255;
  }

  update() {
    this.e_size += 5;   // 円の大きさを広げる
    this.lifespan -= 2; // だんだん薄くする
  }

  display() {
    noFill();
    strokeWeight(2);
    stroke(255, this.lifespan);
    ellipse(this.x, this.y, this.e_size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}
```

---

## マイク入力で波紋を生成する

- `mic = new p5.AudioIn();` でマイク入力を用意
- `mic.getLevel()` で **現在の音量（0〜1）** を取得
- `lerp()` で音量をスムージングして急な変化を抑える
- スムージング後の値が `threshold` を超えたら  
  波紋クラスを生成して配列に追加

---

```javascript
let mic;
let ripples = [];

let smoothed = 0;          // スムージング用
let smoothing_ratio = 0.2; // 小さいほどゆっくり変化
let threshold = 0.04;      // この音量を超えたら生成

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start(); // クリックで有効化が必要な場合あり
}

function draw() {
  background(0);

  // マイク音量を取得
  let level = mic.getLevel();

  // スムージング（急に跳ねすぎるのを防ぐ）
  smoothed = lerp(smoothed, level, smoothing_ratio);

  // 一定以上の音がきたら波紋を追加
  if (smoothed > threshold) {
    ripples.push(new Ripple(width / 2, height / 2));
  }

  // 波紋の更新＆描画
  for (let p of ripples) {
    p.update();
    p.display();
  }

  // 寿命が尽きた波紋を削除
  for (let i = ripples.length - 1; i >= 0; i--) {
    if (ripples[i].isDead()) {
      ripples.splice(i, 1);
    }
  }
}
```

---

## 矢印キーでしきい値 threshold を調整する

- 波紋が「出すぎる / 出なさすぎる」問題を  
  **矢印キーでリアルタイム調整**できるようにする
- `ArrowUp` キー：threshold を **増やす** → 大きい音でだけ反応
- `ArrowDown` キー：threshold を **減らす** → 小さい音でも反応
- `console.log(threshold);` で現在値を確認

```javascript
function keyPressed(){
  if (key == "f") {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  // 上キーでしきい値アップ
  if (key == "ArrowUp") {
    threshold += 0.001;
    if (threshold > 0.5) {
      threshold = 0.5;
    }
    console.log(threshold);
  }

  // 下キーでしきい値ダウン
  if (key == "ArrowDown") {
    threshold -= 0.001;
    if (threshold < 0.01) {
      threshold = 0.01;
    }
    console.log(threshold);
  }
}
```

---

# 応用：帯域ごとの波紋を出す
## ([サンプルコード](https://editor.p5js.org/takano_ma/sketches/66QiN3n9Q))

---

- FFTで **低音 / 中音 / 高音** のエネルギーを取得
- 帯域ごとに値を**スムージング & 正規化**
- 各帯域にそれぞれ **しきい値（threshold）** を設定
- しきい値を超えた帯域ごとに  
  **位置と色の違う波紋（Ripple）** を生成する

---

## 変数の準備（帯域ごとのスムージングとしきい値）

- `smoothingBass / Mid / Treble`：帯域ごとのスムージング用
- `thresholdBass / Mid / Treble`：帯域ごとのしきい値（0〜1）
- `ripples`：生成された波紋を入れておく配列

```javascript
let mic;
let fft;
let ripples = [];

// 帯域ごとのスムージング用
let smoothingBass = 0;
let smoothingMid = 0;
let smoothingTreble = 0;
let smoothing_ratio = 0.2;

// 帯域別の threshold（0〜1）
let thresholdBass = 0.725;
let thresholdMid = 0.4;
let thresholdTreble = 0.2;
```

---

## setup：マイク入力とFFTの準備

```javascript
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  mic = new p5.AudioIn();
  mic.start(); // クリックで有効化が必要な場合あり

  fft = new p5.FFT();   // FFTの準備
  fft.setInput(mic);    // マイク入力を解析対象にする
}
```

---

## 帯域ごとのスムージングと正規化

- `fft.getEnergy("bass")` などで帯域別の値（0〜255）を取得し，`lerp()`で補完

```javascript
  let bass   = fft.getEnergy("bass");
  let mid    = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // スムージング
  smoothingBass   = lerp(smoothingBass,   bass,   smoothing_ratio);
  smoothingMid    = lerp(smoothingMid,    mid,    smoothing_ratio);
  smoothingTreble = lerp(smoothingTreble, treble, smoothing_ratio);

  // 0〜255 → 0〜1 に正規化
  let bassNorm   = smoothingBass   / 255;
  let midNorm    = smoothingMid    / 255;
  let trebleNorm = smoothingTreble / 255;
```

---

## 帯域ごとの閾値を超えたかの判定

- 各帯域ごとに `bassNorm > thresholdBass` などで判定
- しきい値を超えた帯域に応じて  
  **波紋を出す位置を変える**

```javascript
  // 各帯域の threshold 判定
  if (bassNorm > thresholdBass) {
    ripples.push(new Ripple(width / 2, height / 2, "bass"));
  }

  if (midNorm > thresholdMid) {
    ripples.push(new Ripple(width / 4,         height / 2, "mid"));
    ripples.push(new Ripple(width - width / 4, height / 2, "mid"));
  }

  if (trebleNorm > thresholdTreble) {
    ripples.push(new Ripple(width / 10,          height / 2, "treble"));
    ripples.push(new Ripple(width - width / 10,  height / 2, "treble"));
  }

  // 波紋の更新＆描画
  for (let r of ripples) {
    r.update();
    r.display();
  }
```

---

## 引数に type を入れて色分けする Ripple クラス

- `constructor`に第三引数の`type`を追加
- `type` に `"bass" / "mid" / "treble"` を渡して，`display()`で色を分ける

```javascript
  constructor(x, y, type) {
    this.type = type;"treble"
  }
  display(){
    if (this.type === "bass") {
      stroke(0, 150, 255, this.lifespan);
    } else if (this.type === "mid") {
      stroke(0, 255, 150, this.lifespan);
    } else if (this.type === "treble") {
      stroke(255, 200, 0, this.lifespan);
    }
  }
```

---


# 応用：マイク音量に反応してパーティクルを生成する
## ([サンプルコード](https://editor.p5js.org/takano_ma/sketches/EHtn1B1mf))


- パーティクルクラスをマイク入力のコードに反映
- 生成のタイミングを音量によって操作する


---

## マイク音量を取得してしきい値で判定

- `mic.getLevel()`：マイク入力の音量（0〜1）を取得
-  閾値の変数(`threshold`) を用意して、超えたらパーティクルを生成

```javascript
//コードの初期変数の設定
let mic;
let particles = [];

let smoothed = 0;
let smoothing_ratio = 0.2;
let threshold = 0.04; // 閾値の変数を準備
```

---

## draw() で音量に応じてパーティクルを追加

- 音量がthresholdを超えた際に、particlesの新しいインスタンスを作る

```javascript
  // 音量を取得
  let level = mic.getLevel();
  console.log(level); // threshold の調整に便利

  // スムージング
  smoothed = lerp(smoothed, level, smoothing_ratio);

  // 一定以上ならパーティクル生成
  if (smoothed > threshold) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }
  //以下省略
```
