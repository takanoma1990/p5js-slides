---
marp: true
theme: ./slides/themes/gradient_v2.css
paginate: true
class: p5_v2
header: p5.js 授業 第2回
footer: 色のデザイン
---

# 第2回　クリエイティブ・コーディング入門
## 色のデザイン

---

## 今日の内容

1. **RGBモードでの色の指定**
   - 基本・透明度・ランダム配色  
2. **HSBモードでの色の指定**
   - H/S/Bパラメータの意味と活用例  
3. **カラーコードによる配色**
   - Webカラー / 配色のコツ / 統一デザイン  
4. **グラデーション表現**
   - `lerpColor()` / HSBによる滑らかな色変化  

---

# 1. RGBモードでの色の指定

---

## RGBとは？

- **R (Red)**、**G (Green)**、**B (Blue)** の3つの光の三原色で色を表す  
- 各値を **0〜255** の範囲で指定  
- `(255, 0, 0)` は赤、`(0, 255, 0)` は緑、`(0, 0, 255)` は青  

---

## RGBの基本的な使い方

```javascript
function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  fill(255, 0, 0);
  rect(30, 100, 80, 200);
  fill(0, 255, 0);
  rect(160, 100, 80, 200);
  fill(0, 0, 255);
  rect(290, 100, 80, 200);
}
```

---

## 透明度（RGBA）で重なりを表現する

- 第4引数で透明度（Alpha値）を指定  
- 値が小さいほど透けて見える（0〜255）

```javascript
function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  fill(255, 0, 0, 150);
  ellipse(160, 200, 200);
  fill(0, 0, 255, 150);
  ellipse(240, 200, 200);
}
```

---

## ランダムな配色を作る

```javascript
function setup() {
  createCanvas(400, 400);
  background(0);
  noStroke();
  for (let i = 0; i < 80; i++) {
    fill(random(255), random(255), random(255), 200);
    ellipse(random(width), random(height), random(20, 60));
  }
}
```

---

# 2. HSBモードでの色の指定

---

## HSBとは？

- **Hue（色相）**：色味（0〜360°）  
- **Saturation（彩度）**：鮮やかさ（0〜100）  
- **Brightness（明るさ）**：明るさ（0〜100）  
- RGBよりも「直感的」に色の変化を扱いやすい  

---

## HSBモードの指定方法

```javascript
function setup() {
  createCanvas(400, 200);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  for (let i = 0; i < 10; i++) {
    let h = i * 36;
    fill(h, 80, 100);
    rect(i * 40, 50, 40, 100);
  }
}
```

---

## 色相だけをランダムに変える（統一感のある配色）

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  background(0, 0, 15);
  for (let i = 0; i < 100; i++) {
    let h = random(200, 260); // 青〜紫系で統一感
    fill(h, random(40, 100), random(60, 100));
    ellipse(random(width), random(height), random(10, 50));
  }
}
```

---

## 彩度や明度を操作して印象を変える

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  for (let y = 0; y < height; y++) {
    let s = map(y, 0, height, 0, 100);
    fill(200, s, 100); // 彩度だけを変化
    rect(0, y, width, 1);
  }
}
```

---

# 3. カラーコードによる配色

---

## カラーコードとは？

- Webなどで使われる **16進数表記の色指定**
- 例：
  - `#FF0000` → 赤
  - `#00FF00` → 緑
  - `#0000FF` → 青  
- RGB値を16進に変換したもの  
  `#RRGGBB`（各2桁）

---

## カラーコードを使う例

```javascript
function setup() {
  createCanvas(400, 200);
  background("#F9F9F9");
  noStroke();
  fill("#FF595E");
  rect(50, 50, 80, 100);
  fill("#1982C4");
  rect(160, 50, 80, 100);
  fill("#6A4C93");
  rect(270, 50, 80, 100);
}
```

---

## 複数色をまとめたカラーパレット

```javascript
let palette = ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"];
function setup() {
  createCanvas(400, 400);
  background("#F9F9F9");
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(random(palette));
    ellipse(random(width), random(height), random(20, 60));
  }
}
```

---

## 2色または3色で統一したデザイン

```javascript
let colors = ["#2E86AB", "#F6C667", "#E63946"];
function setup() {
  createCanvas(400, 400);
  noStroke();
  background("#F1FAEE");
  for (let i = 0; i < 200; i++) {
    fill(random(colors));
    rect(random(width), random(height), random(10, 30));
  }
}
```

---

## 色の配色のコツ①：色相をそろえる

- 同系色（Hueが近い）でまとめると**安定感が出る**
- 明度や彩度の差で変化を出す

---

## 色の配色のコツ②：補色の活用

- 補色とは、**色相環で反対側の色**  
  例：青とオレンジ、赤と緑  
- コントラストが強く、印象的なデザインに

---

## 色の配色のコツ③：トーンを意識する

- 明度・彩度をそろえると全体の雰囲気が統一される  
- 高彩度：ポップ、にぎやか  
- 低彩度：落ち着き、上品  

---

## 色の配色のコツ④：アクセントカラーを使う

- 全体を中間〜低彩度にして  
  一部に強い色を置くと視線が集まりやすい  
- 例：グレー背景に赤い円  

---

# 4. グラデーション表現

---

## lerpColor()で色を補間する

```javascript
function setup() {
  createCanvas(400, 400);
  noStroke();
  let c1 = color(255, 100, 100);
  let c2 = color(100, 100, 255);
  for (let i = 0; i < width; i++) {
    let inter = map(i, 0, width, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(i, 0, i, height);
  }
}
```

---

## HSBで滑らかな色の変化を作る

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  for (let y = 0; y < height; y++) {
    let h = map(y, 0, height, 0, 360);
    stroke(h, 80, 100);
    line(0, y, width, y);
  }
}
```

---

# まとめ

- **RGBモード**：光の三原色。数値で正確に指定できる  
- **HSBモード**：色味・鮮やかさ・明るさを直感的に調整  
- **カラーコード**：デザインやWebと親和性が高い  
- **配色のコツ**を意識してバランスを取る  
- **グラデーション**で滑らかな色のつながりを表現できる  

---

# 演習課題

1. RGBとHSBの両方でランダムな色のパターンを作ってみる  
2. 自分の好きな3色を決めてパターンを構成する  
3. 補色やトーンを意識した配色を試す  
4. グラデーション背景を活かした作品を作る
