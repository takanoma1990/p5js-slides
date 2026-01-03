---
marp: true
theme: gradient_v2
paginate: true
class: p5_v2
header: p5.js 授業 第6回
footer: 音の入力と可視化表現
---

<!-- _unsafe: true -->
<style>
.center-img {
  display: block;
  margin: 0 auto;
}
</style>

# 第6回　クリエイティブ・コーディング入門
## 外部ライブラリの利用（画像認識による生体計測）


---

## 今日の内容

- カメラの入力（+映像の入力）
- 画像認識ライブラリの利用（MediaPipe)
- 外部ライブラリの読み込み方法
- 手や顔、姿勢などの計測
- 応用例：手の位置情報を用いた表現
    - パーティクルの生成
    - 両手距離を使った描画の制御
- 応用例：ジェスチャ認識

---

# 外部ライブラリの利用

---

## p5.jsでの外部ライブラリの利用

- p5.js本体だけでは高度な処理は難しい
- 外部ライブラリで機能を拡張して使う
- scriptタグでCDNから読み込む
- カメラや音、認識処理を簡単に扱える
- 作品制作では複数ライブラリ併用が一般的

---

# MediaPipeについて

---

## MediaPipeとは

- Googleが提供する画像認識ライブラリ
- カメラ映像から人体情報を取得できる
- 機械学習モデルを内部で利用している
- Web・スマホ・PCで幅広く利用可能
- リアルタイム処理に強いのが特徴

---

## 種類（Solution系とTask系）

- MediaPipeには大きく2つの系統がある
- Solution系はシンプルで扱いやすい
- Task系は認識や分類まで行える
- 用途や目的によって使い分ける
- 初学者はSolution系から始めやすい

---

## Solution系（今回は基本的にこれ）

- 手や顔、姿勢などを点群として取得
- 座標情報（landmarks）が主な出力
- scriptタグだけで簡単に使える
- p5.jsとの相性がとても良い
- 計測や可視化表現に向いている

---

## Task系（ジェスチャ認識など）

- 座標に加えて「意味」を認識できる
- ジェスチャや物体の分類が可能
- モデルを切り替えて高度な処理ができる
- module形式での読み込みが基本
- 応用的・発展的な制作向け

---

# 手の位置情報を取得
## [サンプルコード](https://editor.p5js.org/takano_ma/sketches/m9cIM9XnN)

---

## MediaPipeを使う手順

- `createCapture()`でカメラ映像を`cam`として取得する
- `Hands`クラスを使って手の検出モデルを初期化する
- `onResults()`で認識結果を`handsRes`に保存する
- `processFrame()`内で`hands.send()`を繰り返し実行する
- `draw()`関数で手の位置情報を使った描画を行う

```javascript
cam = createCapture(VIDEO, { flipped: true });
hands = new Hands({ locateFile: (file) => base + file });
hands.onResults((res) => (handsRes = res));
```

---

## index.htmlでライブラリを読み込む

- MediaPipe SolutionsはHTMLの`script`タグで読み込む
- Hands用ライブラリを追加すると`Hands`クラスが使える
- CDNを使うことでローカル環境構築が不要になる
- p5.js → MediaPipe → `sketch.js`の順で読み込む
- 読み込み順を間違えるとクラスが未定義になる

```javascript
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js"></script>
<script src="sketch.js"></script>
```

---

## 用意するグローバル変数について

- `cam`はWebカメラ映像を保持するための変数
- `hands`はMediaPipe Handsのインスタンスを指す
- `handsRes`は毎フレーム更新される認識結果を保存する
- `processing`は非同期処理の重複実行を防ぐために使う
- `HAND_CONNECTIONS`は指の骨格構造を表す配列

```javascript
let cam;
let hands;
let handsRes = null;
let processing = false;

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
];
```

---

## setup関数でのカメラの準備

- `setup()`内で`createCapture()`を呼びカメラを起動する
- `{ flipped: true }`で鏡のような左右反転映像にする
- `cam.size()`でカメラ映像と`canvas`サイズを揃える
- `cam.hide()`でHTMLのvideo表示を非表示にする
- `cam.elt`をMediaPipeに渡す入力画像として利用する

```javascript
cam = createCapture(VIDEO, { flipped: true });
cam.size(640, 480);
cam.hide();
```

---

## setup関数でのHandsのセットアップ

- `new Hands()`でHandsクラスのインスタンスを作成する
- `locateFile`でモデルファイルの読み込み先を指定する
- `setOptions()`で最大手数や検出精度を設定する
- `selfieMode: true`で自撮り用の左右解釈に合わせる
- `onResults()`で解析結果を受け取る関数を登録する

```javascript
hands = new Hands({ locateFile: (file) => base + file });

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});

hands.onResults((res) => (handsRes = res));
```

---

## asyncでの読み込みについて（非同期処理）

- `hands.send()`は内部で推論を行うため時間がかかる
- `async / await`を使い処理の完了を待つ
- `processing`フラグで同時実行を防止する
- `requestAnimationFrame()`で更新タイミングを制御する
- 非同期処理により描画と解析を安定させている

```javascript
async function processFrame() {
  if (!cam?.elt || processing) return requestAnimationFrame(processFrame);

  processing = true;
  await hands.send({ image: cam.elt });
  processing = false;

  requestAnimationFrame(processFrame);
}
```

---

## draw関数での手の位置情報の読み込み

- `draw()`ではまず`image(cam, ...)`で映像を描画する
- `handsRes.multiHandLandmarks`があれば手が検出されている
- `landmark.x`と`landmark.y`は0〜1の正規化座標である
- `width`と`height`を掛けてcanvas座標に変換する
- 点や線として描画し表現やインタラクションに使う

```javascript
image(cam, 0, 0, width, height);

if (handsRes?.multiHandLandmarks) {
  for (const lm of handsRes.multiHandLandmarks) {
    for (const [a, b] of HAND_CONNECTIONS) {
      line(lm[a].x * width, lm[a].y * height,
           lm[b].x * width, lm[b].y * height);
    }
    for (const p of lm) {
      circle(p.x * width, p.y * height, 8);
    }
  }
}
```

---

# 姿勢情報の検出
## [サンプルコード](https://editor.p5js.org/takano_ma/sketches/rD96sGTJ3)

---

## MediaPipeを使う手順（Pose）

- `createCapture()`でカメラ映像を`cam`として取得する
- `Pose`クラスを生成して姿勢推定モデルを初期化する
- `onResults()`で結果を`poseRes`に保存して共有する
- `processFrame()`で`pose.send()`を毎フレーム実行する
- `draw()`で`poseLandmarks`を点や線にして可視化する

```javascript
cam = createCapture(VIDEO, { flipped: true });
pose = new Pose({ locateFile: (file) => base + file });
pose.onResults((res) => (poseRes = res));
```

---

## index.htmlでライブラリを読み込む（Pose）

- MediaPipe Solutionsは`script`タグで読み込んで使う
- Pose用ライブラリを追加すると`Pose`クラスが使える
- CDNを使うとファイル管理なしで実行できる
- p5.js → MediaPipe Pose → `sketch.js`の順が安全
- 読み込み順が崩れると`Pose is not defined`になる

```javascript
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js"></script>
<script src="sketch.js"></script>
```

---

## 用意するグローバル変数について（Pose）

- `cam`はWebカメラ映像（p5のキャプチャ）を保持する
- `pose`はMediaPipe Poseのインスタンスを保持する
- `poseRes`は姿勢推定の結果（landmarks等）を保存する
- `processing`は非同期処理の二重実行を防ぐフラグ
- `POSE_CONNECTIONS`は骨格線を描くための接続情報

```javascript
let cam;
let pose;
let poseRes = null;
let processing = false;

const POSE_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,7],
  [0,4],[4,5],[5,6],[6,8],
  [9,10],
  [11,12],
  [11,13],[13,15],
  [12,14],[14,16],
  [11,23],[12,24],
  [23,24],
  [23,25],[25,27],
  [24,26],[26,28],
  [27,31],[28,32],
  [29,31],[30,32],
  [27,29],[28,30]
];
```

---

## setup関数でのカメラの準備（Pose）

- `setup()`内で`createCapture()`を呼びカメラを起動する
- `{ flipped: true }`で鏡のような左右反転映像にする
- `cam.size()`で映像サイズを`canvas`と揃える
- `cam.hide()`でHTMLのvideo表示を非表示にする
- `cam.elt`をMediaPipeの入力画像として渡せるようにする

```javascript
cam = createCapture(VIDEO, { flipped: true });
cam.size(640, 480);
cam.hide();
```

---

## setup関数でのPoseのセットアップ

- `new Pose()`でPose推定のインスタンスを作成する
- `locateFile`でモデル等の読み込み先（CDN）を指定する
- `modelComplexity`で精度と速度のバランスを調整できる
- `smoothLandmarks`で点のブレを抑えた結果を得られる
- `onResults()`で解析結果を`poseRes`に保存する

```javascript
const base = "https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/";
pose = new Pose({ locateFile: (file) => base + file });

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});

pose.onResults((res) => (poseRes = res));
```

---

## asyncでの読み込みについて（非同期処理・Pose）

- `pose.send()`は内部で推論処理を行うため時間がかかる
- `async / await`で処理完了を待ってから次へ進む
- `processing`フラグで同時に複数回`send()`しないようにする
- `requestAnimationFrame()`でブラウザ更新と同期して回す
- 推論と描画を安定させるために非同期制御が重要になる

```javascript
async function processFrame() {
  if (!cam?.elt || processing) return requestAnimationFrame(processFrame);

  processing = true;
  try {
    await pose.send({ image: cam.elt });
  } catch (e) {
    console.error(e);
  }
  processing = false;

  requestAnimationFrame(processFrame);
}
```

---

## draw関数での姿勢情報の読み込み

- `draw()`ではまず`image(cam, ...)`で映像を表示する
- `poseRes.poseLandmarks`があれば姿勢点が推定されている
- `landmark.x/y`は0〜1なので`width/height`で座標変換する
- `POSE_CONNECTIONS`に沿って線を引くと骨格が見える
- 肩・肘・膝などの点を使い動きで表現を制御できる

```javascript
image(cam, 0, 0, width, height);

const lm = poseRes?.poseLandmarks;
if (!lm) return;

stroke(255, 0, 255);
strokeWeight(3);
for (const [a, b] of POSE_CONNECTIONS) {
  const pa = lm[a], pb = lm[b];
  if (!pa || !pb) continue;
  line(pa.x * width, pa.y * height, pb.x * width, pb.y * height);
}

noStroke();
fill(255, 0, 255);
for (const p of lm) {
  circle(p.x * width, p.y * height, 8);
}
```

---

# 顔の検出
## [サンプルコード](https://editor.p5js.org/takano_ma/sketches/FS6Svkff2)

---

## MediaPipeを使う手順（FaceMesh）

- `createCapture()`でカメラ映像を`cam`として取得する
- `FaceMesh`クラスを生成して顔ランドマーク推定を初期化する
- `onResults()`で結果を`faceRes`に保存して`draw()`で共有する
- `processFrame()`で`faceMesh.send()`を毎フレーム実行する
- `draw()`で`multiFaceLandmarks`を点として描画し可視化する

```javascript
cam = createCapture(VIDEO, { flipped: true });
faceMesh = new FaceMesh({ locateFile: (file) => base + file });
faceMesh.onResults((res) => (faceRes = res));
```

---

## index.htmlでライブラリを読み込む（FaceMesh）

- MediaPipe SolutionsはHTMLの`script`タグで読み込める
- FaceMesh用ライブラリを追加すると`FaceMesh`クラスが使える
- CDNを使えばローカルにモデルを置かずに動かせる
- p5.js → MediaPipe FaceMesh → `sketch.js`の順で読み込む
- 読み込み順を誤ると`FaceMesh is not defined`になりやすい

```javascript
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js"></script>
<script src="sketch.js"></script>
```

---

## 用意するグローバル変数について（FaceMesh）

- `cam`はWebカメラ映像を保持するための変数
- `faceMesh`はMediaPipe FaceMeshのインスタンスを保持する
- `faceRes`は顔推定結果（landmarks等）を保存する変数
- `processing`は非同期処理の二重実行を防ぐフラグ
- 顔は点数が多いので描画コストにも注意する

```javascript
let cam;
let faceMesh;
let faceRes = null;
let processing = false;
```

---

## setup関数でのカメラの準備（FaceMesh）

- `setup()`内で`createCapture()`を呼びカメラを起動する
- `{ flipped: true }`で鏡のような左右反転映像にする
- `cam.size()`で映像サイズを`canvas`と揃える
- `cam.hide()`でHTMLのvideo表示を非表示にする
- `cam.elt`をMediaPipeの入力画像として渡せるようにする

```javascript
cam = createCapture(VIDEO, { flipped: true });
cam.size(640, 480);
cam.hide();
```

---

## setup関数でのFaceMeshのセットアップ

- `new FaceMesh()`で顔推定のインスタンスを作成する
- `locateFile`でモデル等の読み込み先（CDN）を指定する
- `maxNumFaces`で同時に検出する顔の数を設定する
- `refineLandmarks`で目や口周りを高精細にする（重くなる）
- `onResults()`で解析結果を`faceRes`に保存する

```javascript
const base = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/";
faceMesh = new FaceMesh({ locateFile: (file) => base + file });

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});

faceMesh.onResults((res) => (faceRes = res));
```

---

## asyncでの読み込みについて（非同期処理・FaceMesh）

- `faceMesh.send()`は推論処理を行うため時間がかかる
- `async / await`で処理完了を待ってから次へ進む
- `processing`フラグで同時に複数回`send()`しないようにする
- `requestAnimationFrame()`でブラウザ更新と同期して回す
- 点数が多いので非同期制御で安定動作させる

```javascript
async function processFrame() {
  if (!cam?.elt || processing) return requestAnimationFrame(processFrame);

  processing = true;
  try {
    await faceMesh.send({ image: cam.elt });
  } catch (e) {
    console.error(e);
  }
  processing = false;

  requestAnimationFrame(processFrame);
}
```

---

## draw関数での顔情報の読み込み

- `draw()`ではまず`image(cam, ...)`で映像を表示する
- `faceRes.multiFaceLandmarks`があれば顔が検出されている
- `landmark.x/y`は0〜1なので`width/height`で座標変換する
- 468点以上の点群を描くのでサイズや間引きで調整する
- 目や口の一部だけ使うと表現に応用しやすい

```javascript
image(cam, 0, 0, width, height);

if (!faceRes?.multiFaceLandmarks) return;

noStroke();
fill(255, 255, 0);

for (const lm of faceRes.multiFaceLandmarks) {
  for (const p of lm) {
    circle(p.x * width, p.y * height, 2);
  }
}
```

---