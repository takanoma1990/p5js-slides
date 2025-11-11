---
marp: true
theme: gradient_v2
paginate: true
class: p5_v2
header: p5.js 授業 第2回
footer: 色のデザイン
---


<!-- _unsafe: true -->
<style>
.twocol {
  display: flex;
  justify-content: center;
  align-items: center;
  gap:30px;              /* ← ここで間隔を調整 */
  width: 85%;
  margin: 0 auto;
}
.twocol .geometric_pattern_1 {
  width: 40%;     /* ← 左の画像のサイズ */
}
.twocol .geometric_pattern_2 {
  width: 50%;     /* ← 右の画像のサイズ */
}
.footer {
  font-size: 0.75em !important;
  color: yellow;
}
.footer a {
  color: black;
  text-decoration: none;
}

</style>


<!-- _unsafe: true -->
<style>
.center-img {
  display: block;
  margin: 0 auto;
}
</style>


# 第2回　クリエイティブ・コーディング入門
## 色のデザイン

---

## 今日の内容

- RGBモードでの色の指定
   - 基本・透明度・ランダム配色  
- HSBモードでの色の指定
   - H/S/Bパラメータの意味と活用例  
- カラーコードによる配色
   - Webカラー / 配色のコツ / 統一デザイン  
- グラデーション表現
   - `lerpColor()` / HSBによる滑らかな色変化  

---

# 1. RGBモードでの色の指定

---

## RGBとは？

- 光の三原色(**R (Red)**、**G (Green)**、**B (Blue)**)
- 三つの光を混ぜて、さまざまな色を作る
- 各値を **0〜255** の範囲で指定  
- `(255, 0, 0)` は赤
- `(0, 255, 0)` は緑
- `(0, 0, 255)` は青  
- p5.jsでは色の指定のデフォルトがRGBになっている

![bg right:30% w:8cm](./img/第二回/RGB.png)

---

## RGBの基本的な使い方
- 赤、緑、青の`rect`を描画

```javascript
function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  rectMode(CENTER);
  fill(255, 0, 0);
  rect(100, height/2, 80, 80);
  fill(0, 255, 0);
  rect(200, height/2, 80, 80);
  fill(0, 0, 255);
  rect(300, height/2, 80, 80);
}
```


![bg right:40% w:9cm](./img/第二回/赤緑青の図形.png)


---

## 透明度（RGBA）で重なりを表現する

- 第4引数で透明度（Alpha値）を指定
- 値が小さいほど透明に（0〜255の範囲）
- 図形同士の重なりが見えるようになる

```javascript
function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  fill(255, 0, 0, 150);
  ellipse(150, 200, 200);
  fill(0, 0, 255, 150);
  ellipse(250, 200, 200);
}
```

![bg right:35% w:9cm](./img/第二回/透明度を指定した図形の描画.png)

---

## RGBでランダムな配色を作る

```javascript
function setup() {
  createCanvas(800, 400);
  background(0);
  noStroke();
  for (let i = 0; i < 200; i++) {
    fill(random(255), random(255), random(255), 200);
    ellipse(random(width), random(height), random(20, 60));
  }
}
```

<img src="./img/第二回/ランダムなRGB配色.png"  width="1000" class="center-img">

---

# HSBモードでの色の指定

---

## HSBとは

- **Hue（色相）**：色味（0〜360°）
  - 例：赤=0°, 緑=120°, 青=240°
  - 色相を変えると“虹の順番”で色が変化
- **Saturation（彩度）**：鮮やかさ（0〜100）
  - 0付近=淡い色、100付近=はっきりした色
- **Brightness（明度）**：明るさ（0〜100）
  - 0で黒、100でその色の最も明るい状態  

<div class="footer">
  <a href="https://www.dic-color.com/knowledge/business/what_rgb_03.html">参考：<u>―HSLとHSBの色空間構造の違いと彩度調整方法のコツ―</u></a>
</div>

![bg right:38% w:90mm](./img/第二回/HSB_図.jpg)

---

## HSBモードの指定

- `colorMode(HSB)`で指定

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  noStroke();
  for (let i = 0; i < 10; i++) {
    let h = i * 36;
    fill(h, 80, 100);
    rect(i * 40, 0, 40, height);
  }
}
```

![bg right:43% w:100mm](./img/第二回/hsb_rect.png)

---

## 透明度付きのHSBモードを指定

- `colorMode(HSB,360, 100, 100, 100)`で指定

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB,360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 10; i++) {
    let h = i * 36;
    fill(h, 80, 100, 50);//透明度50%
    rect(i * 40, 0, 40, height);
  }
}
```

![bg right:43% w:100mm](./img/第二回/hsb_rect_alpha.png)

---

## 色相,彩度,明度をランダムに変える

- `random()`で色相の範囲を指定して、統一感のある配色に

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

![bg right:25% w:70mm](./img/第二回/HSB_Random_Ellipse.png)

---

## 彩度, 明度でトーンを統一する

- **トーン(色調)**：
  彩度と明度による明暗・濃淡のグループ
- トーンを統一することで、調和した配色に
- トーンの設定イメージ
  - **ビビッド**：`彩度 = 100`, `明度 = 100`  
  - **ソフト**：`彩度 = 50`, `明度 = 70`  
  - **ダーク**：`彩度 = 50`, `明度 = 30`  


<div class="footer">
  <a href="https://zokeifile.musabi.ac.jp/%E8%89%B2%E8%AA%BF/">参考：<u>武蔵野美術大学 造形ファイル</u></a>
</div>

![bg right:40% w:120mm](./img/第二回/トーン・グループ.jpg)

---

## トーンを揃えた描画

```javascript
function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  background(255);
  for (let i = 0; i < 150; i++) {
    let h = random(0, 360); // ランダムな色相
    fill(h, 50, 70); //ソフトなトーンに
    ellipse(random(width),random(height),random(10, 50));
  }
}
```

![bg right:30% w:60mm](./img/第二回/tone.png)

---

# カラーコードによる配色

---

## カラーコードとは？

- Webなどで使われる **16進数表記の色指定**
- RGB値を16進に変換したもの  
- 例：
  - `#FF0000` → 赤
  - `#00FF00` → 緑
  - `#0000FF` → 青  

![bg right:41% w:120mm](./img/第二回/色見本大辞典の一部.png)

---

## カラーコードを使う例

- string型で色の引数として利用
- 例：`background("#FFFFFF"`) = 白背景

```javascript
function setup() {
  createCanvas(400, 400);
  background("#FFFFFF");
  noStroke();
  fill("#FF595E");
  ellipse(100, height/2, 80);
  fill("#1982C4");
  ellipse(200, height/2, 80);
  fill("#6A4C93");
  ellipse(300, height/2, 80);
}
```

![bg right:40% w:120mm](./img/第二回/color_mode_ellipse.png)

---

## 複数色をまとめたカラーパレット

- 配列にカラーコードをまとめて指定
- 色のパターンを固定してランダムに

```javascript
let palette = ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"];
function setup() {
  createCanvas(800, 800);
  background("#F9F9F9");
  noStroke();
  for (let i = 0; i < 200; i++) {
    fill(random(palette));
    ellipse(random(width), random(height), random(20, 60));
  }
}
```

<!-- 
![bg contain opacity:0.2](./img/第二回/color_code_random.png) -->

---

## 2色または3色で統一したデザイン

```javascript
let colors = ["#2E86AB", "#F6C667", "#E63946"];
function setup() {
  createCanvas(800, 800);
  noStroke();
  background("#F1FAEE");
  for (let i = 0; i < 400; i++) {
    fill(random(colors));
    rect(random(width), random(height), random(10, 50));
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

# 応用：グラデーション表現

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

---

## 補足：制作したグラフィックを画像として保存する