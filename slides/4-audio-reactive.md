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

# p5.js で音を「見る」
マイク入力からはじめるサウンド可視化

- この資料は **「音をどう可視化するか」** に焦点を当てます
- まずは **マイク入力の音量 → 円の大きさ** という最小の例から始め、
- そこから **FFT（周波数解析）→ 線・バー・円・色** へ発展させます
- 後半で、マイクではなく **サウンドファイル** を使う可視化も扱います

---

# 全体の流れ

- マイク入力で可視化
  - 音量 → 円の大きさ（最もシンプル）
  - FFT → 線グラフ
  - FFT → バー表示
  - FFT → 円の並び
  - FFT → 色付きの円
- サウンドファイルで可視化
  - ファイルの再生・停止
  - ファイルの音量 → 円の大きさ

---

# マイク入力の音量を円で可視化（説明）

### このスケッチで起こること

- パソコン / スマホの **マイク入力** をリアルタイムに取得します
- `mic.getLevel()` で、その瞬間の **音量の大きさ**（0.0〜0.3 くらい）を取得します
- 得られた音量を、画面中央に描く **円の直径** に変換します
  - 静かなとき：円は小さい
  - 大きな声・手拍子：円が大きく膨らむ

### この可視化でわかること

- 「今この瞬間、どれくらい音があるか」を、直感的に目で確認できます
- 形や色を変えれば、そのまま「音量メーター」や「音に反応するキャラクター」などに応用できます
- ここが、すべての可視化の **一番シンプルな出発点** です

---

# マイク入力の音量を円で可視化（コード）

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

  // 現在の音量（レベル）を取得
  let level = mic.getLevel();
  // console.log(level); // 数値を確認したいときに使う

  // 音量を円の直径にマッピング
  let diameter = map(level, 0, 0.3, 0, width);

  noStroke();
  fill(0, 127, 255);
  ellipse(width / 2, height / 2, diameter);

  fill(255);
  text('声を出す / 手を叩く → 円が大きくなる', width / 2, height / 2);
}
```

---

# 音量 → 図形 への応用アイデア

- 円の色を音量で変える
  - 小さい音：寒色（青）／大きい音：暖色（赤）など
- 図形の種類を変える
  - `rect()` にして縦棒にすると、シンプルなレベルメーターになる
  - `text()` の文字サイズに `diameter` を使うと、文字が膨らんだり縮んだりする
- 軌跡として残す
  - 過去の直径を配列にためて、横にずらして描画すると「横に流れる音量の波形」になる

---

# FFT（周波数解析）のイメージ

- いままでは「音の大きさ（音量）」だけを見ていました
- 次のステップは「**どの高さの音がどれくらい含まれているか**」を見ることです
- p5.js の `p5.FFT` を使うと：
  - 周波数帯ごとの強さが入った **配列**（例：長さ 128）が手に入ります
  - 配列の位置：周波数の低さ〜高さ  
    - 0番あたり：低音（ベース、キックなど）
    - 真ん中：中音（声の中心）
    - 後ろの方：高音（シンバル、ノイズなど）
- これを **線・バー・円・色** に対応させるのが、FFT ビジュアライゼーションです

---

# マイク入力 + FFT：線グラフ（説明）

### このスケッチで起こること

- マイク入力を `p5.FFT` に渡して、周波数ごとの強さの配列を取得します
- 画面の横方向を配列のインデックスに対応させます
  - 左端：低音側のバンド
  - 右端：高音側のバンド
- 各バンドの値（0〜255）を縦方向の位置（Y）に変換し、線でつなぎます

### この可視化でわかること

- 低音が強い音 → 左側が高く持ち上がった形になる
- 高音が強い音 → 右側が高くなる
- 声なのか、手拍子なのか、ノイズなのかで **グラフの形が変わる** のを観察できます

---

# マイク入力 + FFT：線グラフ（コード）

```javascript
let micFFT;
let fft;
let bands = 256; // 周波数帯の数（解像度）

function setup() {
  createCanvas(800, 600);

  // マイク入力
  micFFT = new p5.AudioIn();
  micFFT.start();

  // FFT 解析用オブジェクト
  // 第1引数: 平滑化（0〜1） / 第2引数: バンド数
  fft = new p5.FFT(0.8, bands);
  fft.setInput(micFFT);
}

function draw() {
  background(0);

  // 周波数スペクトル（0〜255 の値が bands 個入った配列）を取得
  let spectrum = fft.analyze();
  let w = width / spectrum.length; // 1 バンドあたりの横幅

  noFill();
  stroke(255);
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = i * w;
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text('左：低音 / 右：高音（マイク入力）', 10, 10);
}
```

---

# 線グラフ表示の調整ポイント

- バンド数 `bands` を変える
  - 64 → 粗いが軽い
  - 256 → 細かいが情報量が多い
- 平滑化の値（`new p5.FFT(0.8, bands)` の 0.8）
  - 小さいほど変化が速く、チカチカした印象
  - 大きいほど変化が滑らかで、落ち着いた印象
- 小さい値をカットする
  - ノイズ対策として、`if (spectrum[i] < 10) spectrum[i] = 0;` のようにしきい値を設けると、細かい揺れが減ります

---

# マイク入力 + FFT：バー表示（説明）

### このスケッチで起こること

- 先ほどと同じように FFT でスペクトルを取得します
- 各周波数バンドの値を、「画面の中央から左右に伸びるバーの明るさ」に変換します
  - 中央付近：低音のバー
  - 左右の端に近づくほど：高音のバー
- バーは画面の上下いっぱいに伸びており、**明るさだけ** で強さを表現します

### この可視化でわかること

- 低音のリズムが強いと中央付近が明滅する
- 高音成分が多いと外側が明るくなる
- 線グラフよりも、「どの帯がどれくらい強いか」が一目でわかりやすい表現になります

---

# マイク入力 + FFT：バー表示（コード）

```javascript
let micBar;
let fftBar;
let barBands = 128;

function setup() {
  createCanvas(800, 600);
  noStroke();

  micBar = new p5.AudioIn();
  micBar.start();

  fftBar = new p5.FFT(0.8, barBands);
  fftBar.setInput(micBar);
}

function draw() {
  background(0);

  let spectrum = fftBar.analyze();
  // 中央から左右に並べるので、バンド数×2 で割る
  let w = width / (barBands * 2);

  for (let i = 0; i < barBands; i++) {
    let value = spectrum[i];          // 0〜255
    let brightness = value * 2.0;     // 明るさを少し強調

    fill(brightness);

    // 右側のバー
    rect(width / 2 + i * w, 0, w, height);
    // 左側のバー
    rect(width / 2 - i * w, 0, w, height);
  }
}
```

---

# バー表示の発展案

- バーの高さも変える
  - 今は「画面全体の高さ」ですが、`height` を `value` に応じて変えると、一般的な棒グラフ型スペクトラムにもできます
- 色を付ける
  - 低音ほど暖色、高音ほど寒色にすると、視覚的に周波数帯の違いがわかりやすくなります
- バーに丸みやグラデーションを付ける
  - 角を丸くしたり、上下にグラデーションをかけることで、映像作品としての質感が変わります

---

# マイク入力 + FFT：円の並び（説明）

### このスケッチで起こること

- FFT の各周波数バンドを、左右両側に並ぶ **円の直径** に変換します
- 中央から右方向へ順に円を並べ、同じものを左右対称に描きます
- 各円は
  - X 位置：周波数帯
  - 直径：その周波数帯の強さ
  で決まります

### この可視化でわかること

- バー表示と同じ情報を、**粒子が揺れているような見た目** で表現できます
- 低音が強いと中央付近の円が大きく、高音が強いと外側の円が大きくなります
- 配置やスケールを変えることで、より抽象的なアニメーションに発展させることができます

---

# マイク入力 + FFT：円の並び（コード）

```javascript
let micCircle;
let fftCircle;
let circleBands = 128;
let circleScale = 3.0; // 円の大きさの倍率

function setup() {
  createCanvas(800, 600);
  noStroke();

  micCircle = new p5.AudioIn();
  micCircle.start();

  fftCircle = new p5.FFT(0.8, circleBands);
  fftCircle.setInput(micCircle);
}

function draw() {
  background(0);

  let spectrum = fftCircle.analyze();
  let w = width / (circleBands * 2);

  fill(200);
  for (let i = 0; i < circleBands; i++) {
    let diameter = spectrum[i] * circleScale;

    // 右側の円
    ellipse(width / 2 + i * w, height / 2, diameter);
    // 左側の円
    ellipse(width / 2 - i * w, height / 2, diameter);
  }
}
```

---

# マイク入力 + FFT：色付きの円（説明）

### このスケッチで起こること

- さきほどの「円の並び」に **色の情報** を追加します
- 周波数バンドのインデックスを、色相（Hue）の値に対応させます
  - 低音側：赤〜オレンジ
  - 中音：緑〜シアン
  - 高音側：青〜紫
- 円の大きさは FFT の値（強さ）で決まります

### この可視化でわかること

- 高さ（周波数）と色を対応させることで、
  - 「どの高さの音が強いか」が色の流れとしても読み取れます
- モノクロのスペクトラムに比べて、音のキャラクターが視覚的に豊かになります

---

# マイク入力 + FFT：色付きの円（コード）

```javascript
let micColor;
let fftColor;
let colorBands = 128;
let colorScale = 5.0;

function setup() {
  createCanvas(800, 600);
  noStroke();

  // HSB 色空間で色を指定する
  // hue: 0〜360, saturation/brightness/alpha: 0〜100
  colorMode(HSB, 360, 100, 100, 100);

  micColor = new p5.AudioIn();
  micColor.start();

  fftColor = new p5.FFT(0.8, colorBands);
  fftColor.setInput(micColor);
}

function draw() {
  background(0);

  let spectrum = fftColor.analyze();
  let w = width / (colorBands * 2);

  for (let i = 0; i < colorBands; i++) {
    let hue = map(i, 0, colorBands, 0, 360);
    let diameter = spectrum[i] * colorScale;

    // 透明度を低めにして、重なりで色が混ざるようにする
    fill(hue, 100, 100, 20);

    ellipse(width / 2 + i * w, height / 2, diameter);
    ellipse(width / 2 - i * w, height / 2, diameter);
  }
}
```

---

# サウンドファイルの再生と可視化に進む

ここまでは **マイク入力** を使って可視化してきました。  
次は、マイクではなく **サウンドファイル** を使うパターンです。

- 共通する考え方：
  - 「どこから音を取るか」だけが変わり、
  - 可視化のロジック（音量 → 図形・FFT → 図形）は同じです。

---

# サウンドファイルの再生（説明）

### このスケッチで起こること

- `loadSound('sound.mp3')` で音声ファイルを読み込みます
- 画面をクリックすると
  - 再生していなければ：ループ再生を開始
  - 再生中であれば：停止
- 画面中央のテキストで「再生中かどうか」を表示します

### 何のためのスケッチか

- 可視化を始める前に、「ファイルの再生がきちんと動くか」を確認するための最小コードです

---

# サウンドファイルの再生（コード）

```javascript
let soundFile;

function preload() {
  // プロジェクトに置いた音声ファイル名に合わせて変更する
  soundFile = loadSound('sound.mp3');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  fill(255);

  if (!soundFile.isPlaying()) {
    text('クリックで再生', width / 2, height / 2);
  } else {
    text('再生中：クリックで停止', width / 2, height / 2);
  }
}

function mousePressed() {
  if (!soundFile.isPlaying()) {
    soundFile.loop(); // ループ再生
  } else {
    soundFile.stop();
  }
}
```

---

# サウンドファイルの音量を円で可視化（説明）

### このスケッチで起こること

- サウンドファイルを再生し、その音量を `p5.Amplitude` で解析します
- `amp.getLevel()` で、現在の音量レベルを取得します
- 音量を画面中央の円の直径に変換します

### マイク版との違い・共通点

- マイク版との違い：
  - 入力元が「マイク」ではなく「ファイル」になっているだけ
- 共通点：
  - 「音量 → 円の大きさ」という可視化部分のロジックは同じ
  - 可視化コードをほぼそのまま再利用できる、というのがポイントです

---

# サウンドファイルの音量を円で可視化（コード）

```javascript
let soundFile2;
let ampFile;

function preload() {
  soundFile2 = loadSound('sound.mp3');
}

function setup() {
  createCanvas(800, 600);

  // ファイル用の音量解析オブジェクト
  ampFile = new p5.Amplitude();
  ampFile.setInput(soundFile2);
}

function draw() {
  background(0);

  // 現在の音量レベルを取得
  let level = ampFile.getLevel();
  let diameter = map(level, 0, 0.5, 0, width);

  noStroke();
  fill(0, 150, 255);
  ellipse(width / 2, height / 2, diameter);

  fill(255);
  textAlign(LEFT, TOP);
  text('クリックで再生 / 停止', 10, 10);
}

function mousePressed() {
  if (!soundFile2.isPlaying()) {
    soundFile2.loop();
  } else {
    soundFile2.stop();
  }
}
```

---

# まとめ

- マイク入力で：
  - 音量 → 円の大きさ
  - FFT → 線・バー・円・色
- サウンドファイルでも：
  - 入力先を変えるだけで、同じ可視化ロジックを使い回せる
- 本質はつねに：
  - **「音の情報（音量や周波数）を、図形や色のパラメータにどう対応させるか」**

まずはここにあるいずれかのスケッチを土台にして、  
- 形（circle → rect や text）
- 色（音量や周波数で変化）
- 配置（画面全体にばらまく、軌跡を残す）

などを自分なりに変えてみてください。
