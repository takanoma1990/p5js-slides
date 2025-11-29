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
## 音の入力と可視化表現

---



# 全体の流れ

- マイク入力で可視化
  - 音量 → 円の大きさ
  - FFT → 線グラフ
  - FFT → バー表示
  - FFT → 円の並び
  - FFT → 色付きの円
- サウンドファイルで可視化
  - ファイルの再生・停止
  - ファイルの音量 → 円の大きさ


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

------

# FFTで帯域ごとに可視化

- FFT（Fast Fourier Transform）
  - 音を「時間」ではなく「周波数（高さ）ごと」に分解する
- p5.FFT クラス
  - `fft = new p5.FFT();`
  - `fft.setInput(mic);` でマイク入力を解析対象にする
- 周波数帯域ごとのエネルギーを取得
  - `fft.getEnergy("bass")`（低音）
  - `fft.getEnergy("mid")`（中音）
  - `fft.getEnergy("treble")`（高音）
- ここでは「低音・中音・高音」を3つの円の大きさとして表示する

---

## p5.FFT の準備（setup内）

- setup()での設定
  - キャンバスの作成と文字揃え
  - マイク入力の開始
  - FFTインスタンスの作成と入力の設定

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

## p5.FFT の利用（draw内）

- draw()での利用
  - `fft.analyze()` で周波数ごとのエネルギーを計算
  - `getEnergy("bass" / "mid" / "treble")` で各帯域の値を取得
  - `map()` で値（0〜255）を円の直径に変換
  - 低音・中音・高音の円を左右に並べて描画

```javascript
function draw() {
  background(0);

  // 周波数ごとのエネルギーを解析
  fft.analyze();

  // 帯域ごとの音量（エネルギー）を取得（0〜255）
  let bass   = fft.getEnergy("bass");   // 低音
  let mid    = fft.getEnergy("mid");    // 中音
  let treble = fft.getEnergy("treble"); // 高音

  // 円の直径にマッピング
  let bassDia   = map(bass,   0, 255, 0, 200);
  let midDia    = map(mid,    0, 255, 0, 200);
  let trebleDia = map(treble, 0, 255, 0, 200);

  noStroke();

  // 低音（左の円）
  fill(0, 150, 255, 200);
  ellipse(width * 1/4, height / 2, bassDia);

  // 中音（中央の円）
  fill(0, 255, 150, 200);
  ellipse(width * 2/4, height / 2, midDia);

  // 高音（右の円）
  fill(255, 200, 0, 200);
  ellipse(width * 3/4, height / 2, trebleDia);
}
```

---
