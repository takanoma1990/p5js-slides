import pikepdf
from pikepdf import OutlineItem

# 元PDFと出力PDF
INPUT_PDF = "第7回_クリエイティブ・コーディング入門.pdf"
OUTPUT_PDF = "第7回_クリエイティブ・コーディング入門_with_TOC.pdf"

# 目次にしたい項目（タイトル, ページ番号）※ページ番号は「PDFビューアに表示される番号」
toc = [
    ("第7回 クリエイティブ・コーディング入門", 1),
    ("授業コードの一覧", 3),
    ("p5.js のコードをダウンロード", 8),
    ("VS Codeでp5.jsを実行(Live Server)", 12),
    ("ブラウザの描画領域を調整", 19),
    ("まとめ（最終的な成果物に向けて）", 25),
    ("参考資料", 26)
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
