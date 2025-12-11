import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "5-FFT.pdf"
OUTPUT_PDF = "5-FFT_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第5回 クリエイティブ・コーディング入門", 1),
    ("閾値を設定して、広がる円を生成", 3),
    ("閾値を利用したパーティクルの描画を追加する", 14),
    ("FFTによるスペクトル・アナライザー", 19),
    ("アレンジ①：アナライザーのデザインを変える", 29),
    ("アレンジ②：アナライザーのデザインを変える", 33)
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
