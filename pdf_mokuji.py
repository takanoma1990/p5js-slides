import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "2-color_design.pdf"
OUTPUT_PDF = "2-color_design_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第2回 クリエイティブ・コーディング入門", 1),
    ("RGBモードでの色の指定", 3),
    ("HSBモードでの色の指定", 8),
    ("カラーコードによる配色", 17),
    ("カラーデザインの参考サイト", 24),
    ("応用：グラデーション表現", 27),
    ("演習：制作したグラフィックを画像として保存する", 31)
    
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
