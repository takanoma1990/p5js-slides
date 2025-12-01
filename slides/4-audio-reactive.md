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
## 音の可視化①（FFTを使った可視化）

---



# 全体の流れ

- マイク入力で可視化
  - 音量 → 円の大きさ
  - FFT → 線グラフ
  - FFT → バー表示
  - FFT → 円の並び
  - FFT → 色付きの円


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


# 利用できる主なクラス

- **p5.AudioIn**  
  マイク入力を取得する
- **p5.Amplitude**  
  全体の音量レベルを取得
- **p5.FFT**  
  音を周波数ごとに分析する
- **loadSound / p5.SoundFile**  
  音声ファイルの読み込み・再生

---

## 利用例：マイク入力

- setup()での設定
  - `mic = new p5.AudioIn();` でマイクを作成
  - `userStartAudio(); mic.start();` で入力開始

- draw()での利用
  - `level = mic.getLevel();` で音量(0〜1)を取得
  - 図形の大きさ・色などに反映させて可視化

---

## 利用例：FFT

- setup()での設定
  - `mic = new p5.AudioIn(); mic.start();`
  - `fft = new p5.FFT(); fft.setInput(mic);` で解析対象に設定

- draw()での利用
  - `spectrum = fft.analyze();` で周波数分布を取得
  - `wave = fft.waveform();` で波形データ取得・描画に利用

---

## 利用例：音源の読み込み・再生

- setup()での設定
  - `sound = loadSound("music.mp3");` で音声ファイルを読み込む
  - `sound.play();` や `sound.loop();` で再生を開始

- draw()での利用
  - `sound.isPlaying()` を使って状態を確認
  - 再生中は図形を動かす・反応させるなどの演出が可能

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

## lerp()で音量の変化を滑らかに

- `getLevel()` の値をそのまま使うと変化が激しくなってしまう
- lerp関数を使って変化を滑らかにしてあげる
- `lerp(a, b, t)`：a から b へ t の割合だけ近づける（0〜1）
- 前フレームの値用に `smoothLevel` を用意しておく
- `smoothLevel = lerp(smoothLevel, level, 0.1);`
- 得られた `smoothLevel` を `map()` で円の直径に変換
- t を小さく→ゆっくり滑らか，大きく→すばやく追従

---

## lerp() を使ったコードパターン

- 事前に `let smoothLevel = 0;` を宣言しておく
- draw() の中で：
  - `let level = mic.getLevel();`
  - `smoothLevel = lerp(smoothLevel, level, 0.1);`
  - `diameter = map(smoothLevel, 0, 1, 0, width);`
- あとは `ellipse(width/2, height/2, diameter);` で円を描画


---

## スムージングを用いたコード（[サンプルコード](https://editor.p5js.org/takano_ma/sketches/rZLqwuBFj)）

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

# FFTによる周波数帯域の成分を使った描画

---

## FFTで帯域ごとに可視化([サンプルコード](https://editor.p5js.org/takano_ma/sketches/Dr9Fm-jkA))

- FFT（Fast Fourier Transform）
  - 周波数ごと成分に分離する方法
- p5.FFT クラス
  - `fft = new p5.FFT();`でfftのインスタンスを作成
  - `fft.setInput(mic);` でマイク入力を解析対象にする

---

## p5.FFT の初期設定（setup内）

```javascript
let mic;
let fft;

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  // マイク入力の開始
  mic = new p5.AudioIn();
  mic.start();
  // FFT（周波数解析）の準備
  fft = new p5.FFT();
  fft.setInput(mic);
}
```

---

## 帯域ごとの成分を分けて抽出する

- `fft.analyze()` で周波数ごとのエネルギーを計算
- `getEnergy("bass" / "mid" / "treble")` で各帯域の値を取得
- `map()` で値（0〜255）を円の直径に変換

```javascript
function draw() {
  background(0);

  // 周波数ごとのエネルギーを解析
  fft.analyze();

  // 帯域ごとの音量（エネルギー）を取得（0〜255）
  let bass   = fft.getEnergy("bass");   // 低音
  let mid    = fft.getEnergy("mid");    // 中音
  let treble = fft.getEnergy("treble"); // 高音
  //次のページへ
```

---

## 帯域ごとの値を分けて図形のサイズを変える

```javascript
  // 円の直径にマッピング
  let bass_Diameter   = map(bass,   0, 255, 0, 200);
  let mid_Diameter    = map(mid,    0, 255, 0, 200);
  let treble_Diameter = map(treble, 0, 255, 0, 200);

  noStroke();

  fill(0, 150, 255, 200);
  ellipse(width * 1/4, height / 2, bass_Diameter);

  fill(0, 255, 150, 200);
  ellipse(width * 2/4, height / 2, mid_Diameter);

  fill(255, 200, 0, 200);
  ellipse(width * 3/4, height / 2, treble_Diameter);
}
```

---

## 帯域ごとに値をスムージング([サンプルコード](https://editor.p5js.org/takano_ma/sketches/nsJ18D6Fr))

```javascript
let smoothingBass = 0;
let smoothingMid = 0;
let smoothingTreble = 0;
let smoothing_ratio = 0.2; //lerpの補間係数を用意（小さいほどゆっくり変化）

function draw() {
  …
  let bass   = fft.getEnergy("bass");
  let mid    = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // 帯域ごとに滑らかにする
  smoothingBass   = lerp(smoothingBass,   bass,   smoothing_ratio);
  smoothingMid    = lerp(smoothingMid,    mid,    smoothing_ratio);
  smoothingTreble = lerp(smoothingTreble, treble, smoothing_ratio);
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
##([サンプルコード](https://editor.p5js.org/takano_ma/sketches/66QiN3n9Q))

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


---

# (来週用)FFTによるスペクトル・アナライザー

---


## FFTでスペクトルを可視化

- FFTで **周波数ごとの強さ（0〜255）** を配列として取得
- 配列のインデックスが **左＝低音 → 右＝高音**
- 各要素を **棒グラフの位置と高さ** に対応させて描画
- `bin_size` で「何個ごとに描画するか」（バーの間隔と太さ）を調整する

---

## スペクトラムアナライザーとは

- 音を **周波数ごとの成分** に分解して強さを棒グラフで表示するもの
- 左から右に向かって **低音 → 中音 → 高音** の順に並ぶ
- 棒の高さ = その帯域のエネルギーの大きさ（p5.jsでは 0〜255）
- p5.FFTで `fft.analyze()` を使うと，この「周波数ごとの強さの配列」が取得できる
- その配列の値を，**x座標（位置）と高さ（h）にマッピングして描画**すると，
  自作のスペクトラムアナライザーになる

---

## p5.FFT とマイクの準備（setup内）

```javascript
let mic;
let fft;
let bin_size = 10; // 棒グラフ1本あたりの間隔と太さ

function setup(){
  createCanvas(windowWidth, 500);
  
  mic = new p5.AudioIn();
  mic.amp(1); // マイク入力の音量を調整
  mic.start();
  
  fft = new p5.FFT(0.9); // FFTのインスタンス作成，0.0〜1.0でスペクトルのスムージング
  fft.setInput(mic);

  colorMode(HSB, 360, 100, 100, 100); // HSBモード→ビンごとに色相を変えられる
}
```

---

## FFTでスペクトルを取得する

```javascript
function draw(){
  background(0);

  // このフレームの入力音をFFT解析して，
  // 周波数ごとの強さ（0〜255）を配列で取得
  let spectrum = fft.analyze();

  noStroke();
  for (let i = 0; i < spectrum.length; i += bin_size){
    // i番目のビンの位置を，
    // 配列のインデックス→画面のx座標にマッピング
    // （左が低音，右が高音）
    let x = map(i, 0, spectrum.length, 0, width);
    // 次のページへ…
```

---

## ビンの振幅を高さと色に対応させる

```javascript
    // 各ビンの振幅（0〜255）をバーの高さ（0〜height）に変換し，
    // 上方向に伸びるように負の値にする
    let h = -map(spectrum[i], 0, 255, 0, height);

    // ビンの位置（周波数）に応じて
    // 色相を0〜360度に対応させる
    let Hue = map(i, 0, spectrum.length, 0, 360);
    fill(Hue, 50, 100, 100);

    // 画面下から上に向かって棒グラフを描画
    rect(x, height, bin_size, h);
  }
}
```