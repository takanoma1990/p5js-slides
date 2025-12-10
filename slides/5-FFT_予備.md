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

# 第5回　クリエイティブ・コーディング入門
## 音の可視化②（閾値を設定した描画、FFTを使った可視化）



---

## 今日の内容

- クラスをJSファイルに分けて管理する
- 入力音に対する閾値を設定してオブジェクトを生成
    - 広がる円の生成
    - パーティクルの生成
- FFTを使った周波数成分の描画
    - スペクトル・アナライザーの描画
    - アナライザーのアレンジ（色は配置など）
- 応用：複数の要素を組み合わせたオーディオ・ビジュアライザーの作成

---


# p5.FFTについて

---

## p5.FFT

- FFT（Fast Fourier Transform）
  - 周波数ごと成分に分離する方法
- p5.FFT クラス
  - `fft = new p5.FFT([smoothing],[bins]);`でfftのインスタンスを作成
    - smoothingは0~1の範囲で調整．大きいほどスムーズ，デフォルトは0.8
    - bins：FFT の帯域数（64/128/256/512/1024 など 2 のべき乗を使用）
        - デフォルトは1024
  - `fft.setInput([input]);` でマイクや音源を入力する

---

## 値の取得の流れ

- setup関数
    - `fft = new p5.FFT([smoothing],[bins]);`でインスタンス作成
    - `fft.setInput([input])`でインプットを指定（mic or audio File)
- draw関数
    - `fft.analyze()`で入力音を解析
    - `fft.getEnegy(frequency1, [frequency2])`で指定帯域の音量を取得
        - frequency1　→ 数値で周波数を指定 or ストリングで帯域を指定("bass", "lowMid" "mid", "highMid", "treble" など)
        - frequency1, frequency2 → 周波数帯域の範囲を指定
        - 出力値は0~255の範囲

---

# FFTによる周波数帯域の成分を使った描画
### [マイクのサンプル](https://editor.p5js.org/takano_ma/sketches/Dr9Fm-jkA)
### [音源のサンプル](https://editor.p5js.org/takano_ma/sketches/Www-Mgy9s)


---

## 帯域を指定して円の大きさに反映する
- 円の大きさを振幅で操作するコードでFFTを利用する
- **"bass", "mid", "treble"の三つの帯域**の値を取得
- 0~255の出力値をmap関数でellipseの範囲に調整する

---

## p5.FFT の初期設定（micの場合）

```javascript
let mic;
let fft;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);

  // マイク入力の開始
  mic = new p5.AudioIn();
  mic.start();

  // FFT（周波数解析）の準備
  fft = new p5.FFT(0.9, 512);// スムージングを0.9にして、少し滑らかにしておく
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
  fft.analyze();// fftで入力音を解析
  // 帯域ごとの音量（エネルギー）を取得（0〜255）
  let bass   = fft.getEnergy("bass");   // 低音
  let mid    = fft.getEnergy("mid");    // 中音
  let treble = fft.getEnergy("treble"); // 高音
  // 円の直径にマッピング
  let bass_Diameter   = map(bass,   0, 255, 0, 500);
  let mid_Diameter    = map(mid,    0, 255, 0, 500);
  let treble_Diameter = map(treble, 0, 255, 0, 500);
```

---

## 帯域ごとの値を個別の図形の大きさに反映
- 円の描画 + テキストで振幅値の表示

```javascript
  noStroke();
  textSize(30);
  fill(0, 150, 255, 200);
  ellipse(width * 1/4, height / 2, bass_Diameter);
  text(bass.toFixed(1), width * 1/4, height / 2);

  fill(0, 255, 150, 200);
  ellipse(width * 2/4, height / 2, mid_Diameter);
  text(mid.toFixed(1), width * 2/4, height / 2);

  fill(255, 200, 0, 200);
  ellipse(width * 3/4, height / 2, treble_Diameter);
  text(treble.toFixed(1), width * 3/4, height / 2);
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


---
