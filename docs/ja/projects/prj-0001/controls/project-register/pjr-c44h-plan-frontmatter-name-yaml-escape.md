---
specdojo:
  id: prj-0001:pjr-c44h-plan-frontmatter-name-yaml-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T13:53:49Z"
  block_reason: "integrate failed: git commit failed: hint: to use in all of your new repositories, which will suppress this warning, / hint: to use in all of your new repositories, which will suppress this warning, /…"
---

# PJR-C44H plan の frontmatter の name に個票の H1 のエスケープが残り YAML が不正になる

## 1. 課題内容

register 項目の plan の frontmatter の `name` は、`src/exec-register.ts` で次のように生成している。

- 個票のタイトルに Markdown 用のエスケープ（`escapeMarkdownInline`）をかけ、`"` を `'` に置き換えてから、YAML のダブルクォート文字列として書き出す。
- タイトルに `*` などの Markdown 記号が含まれると、`\*` のようなバックスラッシュが入る。YAML のダブルクォートの中では `\*` は不正なエスケープであり、plan の frontmatter を YAML として読めない。

2026-09-29、PJR-Y06Y（タイトル「用語集（`gl-*.yaml`）の schema を作成する」）の plan で、VitePress の `docs:build` が `unknown escape sequence` で失敗した。orchestrator が plan の該当行を直して回避した（26a959d1）。利用者の環境でも、タイトルに Markdown 記号を含む項目を実行すると同じ失敗が起きる。

## 2. 影響範囲

| 観点         | 影響                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| スコープ     | register 項目の plan の生成。タイトルに `*` `_` `\` などを含む項目        |
| スケジュール | docs サイトのビルドが止まる                                               |
| コスト       | 小                                                                        |
| 品質         | plan の frontmatter を YAML として読む処理（docs サイト、検証）が失敗する |
| 関係者       | register を exec で実行する利用者                                         |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | YAML の文字列に Markdown 用のエスケープをかけ、YAML としての正しいクォートをしていない                                                                                                                                                                                                              |
| 対応策   | frontmatter の値は、Markdown のエスケープをかけずに、YAML として正しい形（YAML ライブラリの出力、または JSON 互換のダブルクォート文字列）で書き出す。`"` を `'` に置き換える処理もやめ、元のタイトルの文字をそのまま保つ。plan 本文の H1 など Markdown として出す箇所のエスケープは従来どおりとする |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                |
| 完了条件 | タイトルに `*` `_` `\` `"` `:` `#` を含む項目の plan の frontmatter が YAML として読め、`name` が元のタイトルと一致することを単体テストで確かめる。result の frontmatter に同じ処理があれば、同じく直す。`npm run check` が成功する                                                                 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `src/exec-register.ts`（plan の frontmatter の生成）
- PJR-Y06Y（発生した項目）、PJR-M8NA（同じ日に docs:build を検証した項目）
