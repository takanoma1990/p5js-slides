---
marp: true
theme: gradient_v2
paginate: true
class: p5_v2
header: p5.js 授業 第6回
footer: 画像認識による生体計測
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

# 第7回　クリエイティブ・コーディング入門
## 作品ページの作成


---

## 今日の内容

- サンプルコード一覧のWebページ
- 作品・デザイン案
- p5.js のコードをダウンロード
- VS Codeでp5.jsを実行(Live Server)
- ブラウザの描画領域を調整
- 予備：GitHub を使った公開ページの作成
- まとめ

---

# p5.js のコードをダウンロード

---

## Web Editorで作ったコードをダウンロード
- Web Editorから任意のコードを選ぶ
  - 自分のアカウントでも人のアカウントでも良い
- 上部のメニューから File → Downloadを選択
- html, css, jsがまとまったZipが保存される

![bg right:40% w:90%](./img/第七回/Editorのファイルメニューからダウンロード.png)

---

## ダウンロードファイルの中身
- htmlなど以外のCDNのライブラリも保存される
- html内のコードはCDNのままなので、オフライン実行の際に利用できる
- このフォルダでVS Codeでコーディングと実行ができるようになる
<img src="./img/第七回/ダウンロードファイルの中身.png" class="center-img" width="1000">

---

# VS Codeでp5.jsを実行(Live Server)

---


## VS Codeで新規ウィンドウを開く
- VS Codeを立ち上げる、もしくはメニューから「新しいウィンドウ」
- 左側のメニューの一番上のファイル・アイコンを選択
- 「フォルダーを開く」でp5jsのフォルダを指定、もしくはフォルダをドラッグ&ドロップ

![bg right:40% w:90%](./img/第七回/VSCodeの起動画面でフォルダ選択.png)


--- 
## フォルダを信頼するかの確認画面
- 確認画面が出るので、「はい、作成者を信頼します」を選択

<img src="./img/第七回/フォルダの信頼画面.png" class="center-img" width="700">

---

## フォルダの表示

- 確認画面で信頼するを選択後、左側にファイル一覧が表示される
- 任意のファイルを選ぶとコードを確認・修正ができる

![bg right:40% w:90%](./img/第七回/フォルダの内容.png)


---

## Live Serverをインストール

- ローカルで簡単にWebサイトをプレビューできる拡張機能
- 左側の拡張機能のアイコンを選択し「Live Server」を検索してインストール
  - 既に入れている場合は、次のページで実行してみる

<img src="./img/第七回/LiveServerのインストール.png" class="center-img" width="1500">

---

## Live Serverで実行してみる

- Live Serverのインストールが終わったら、サーバーを起動してみる
- ファイル内のindex.htmlを右クリック
- 「Open with Live sever」を選択
  - ブラウザ上でp5.jsのプログラムが動くようになる

![bg right:40% w:90%](./img/第七回/LiveServerの実行.png)


---

## ブラウザでの描画

- Live Serverを実行すると、自動的にブラウザが起動する
- エディタなしでキャンバスの部分のみ描画される

<img src="./img/第七回/LiveServer実行結果.png" class="center-img" width="600">

---

# ブラウザの描画領域を調整


---

## デフォルトのキャンバス位置

- エディタのコードをそのまま使うと、ブラウザの左側に描画される
- 描画範囲の調整、CSSの変更などで描画位置を調整する
<img src="./img/第七回/通常のキャンバスの位置.png" width="600" class="center-img">

---

## Canvasをウィンドサイズにしておく
- `setup`関数で最初からウィンドウサイズにしておく
- `windowResized`関数でウィンドサイズが変わっても自動調整されるようにする
- これらを入れることで、フルスクリーン描画もしやすくなる

```javascript
function setup(){
  createCanvas(windowWidth, windowHeight);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
```

---

## ウィンドサイズに合わせた際の描画

<img src="./img/第七回/ウィンドサイズにキャンバスを合わせる.png" width="800" class="center-img">

---

## CSSを調整してキャンバスを中央に配置
- `style.css`を下記のコードに書き換えると、canvasをブラウザ中央に配置できる
```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
body {
  display: flex;
  justify-content: center; /* 横中央に指定*/
  align-items: center;     /* 縦中央に指定*/
}
canvas {
  display: block;
}
```

---

## CSSでCanvasを中央にした際の描画
<img src="./img/第七回/CSSでセンターに表示.png" width="700" class="center-img">


---


## 作品一覧のサイト


---


# GitHub を使った公開ページの作成


---