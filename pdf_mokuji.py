import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "6-Mediapipe.pdf"
OUTPUT_PDF = "6-Mediapipe_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第6回 クリエイティブ・コーディング入門", 1),
    ("外部ライブラリの利用", 3),
    ("MediaPipeを使った手の検出", 7),
    ("応用：手の動きを使って描画を制御", 20),
    ("応用①：手の位置情報を使ってパーティクルを描画", 21),
    ("応用②：dist関数による距離測定による描画", 24),
    ("その他の生体情報の検出", 28)
]

# PDFを開く
pdf = pikepdf.open(INPUT_PDF)

# アウトライン（しおり）編集
with pdf.open_outline() as outline:
    # 既存のしおりがあれば消して新しく作る
    outline.root = []

    for title, page in toc:
        # pikepdfは 0 始まりのページ番号なので -1 する
        page_index = page - 1
        item = OutlineItem(title, page_index)
        outline.root.append(item)

# 保存
pdf.save(OUTPUT_PDF)
print(f"✅ 目次付きPDFを保存しました: {OUTPUT_PDF}")
