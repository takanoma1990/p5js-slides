import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "3-particle_mouseInteraction.pdf"
OUTPUT_PDF = "3-particle_mouseInteraction_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第3回 クリエイティブ・コーディング入門", 1),
    ("パーティクルによるアニメーション", 4),
    ("パーティクルに寿命をつける", 12),
    ("応用：マウスの位置を使ったパーティクル生成", 21),
    ("演習：パーティクル表現をアレンジしてみる", 26),
    ("補足資料：windowResizedとfullScreen", 34)
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
