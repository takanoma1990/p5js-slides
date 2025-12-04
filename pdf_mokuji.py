import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "4-audio-reactive.pdf"
OUTPUT_PDF = "4-audio-reactive_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第4回 クリエイティブ・コーディング入門", 1),
    ("p5.soundライブラリについて", 4),
    ("マイクの入力音を使う", 8),
    ("lerpを使った音量のスムージング", 13),
    ("音源ファイルの利用", 18),
    ("応用：音でパーティクルの大きさや速度を変える", 24)
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
