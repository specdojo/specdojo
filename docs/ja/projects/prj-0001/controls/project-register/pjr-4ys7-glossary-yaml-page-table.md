---
specdojo:
  id: prj-0001:pjr-4ys7-glossary-yaml-page-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T13:33:36Z"
  derived_from:
    - PJR-6XQ4
  commit_type: feat
  commit_scope: docs
---

# PJR-4YS7 用語集の YAML の表示用ページを、分類ごとの表で描く

## 1. 概要

yaml-pages が type: glossary の YAML を、コードブロックではなく分類ごとの表で描き、YAML の正本は折りたたんで残す

## 2. 入力

- 用語集の確定の段の前に、表示用ページが YAML をコードブロックに埋めただけでレビューしにくいと indie が気づいた。表示の案を orchestrator が出し、indie が承認した（2026-11-12）

## 3. 完了条件

- `src/docs/yaml-pages.ts` が、`type: glossary` の YAML（`gl.schema.yaml` に従うもの）の表示用ページを次の形で描く。成果物カタログのテンプレートを表で描く既存の分岐にならう。
  - 冒頭に、生成元の注記と、ID・言語・状態・用語の数の表を置く。
  - 用語を分類（`category`）ごとの番号付きの章（`## 1. <分類>` など）に分け、各章を 1 つの表にする。分類のない用語は「その他」の章にまとめる。章の順は YAML の中で分類が最初に現れた順とする。
  - 表の列は、用語（用語 ID を添える）・英語名と別名・定義・補足（`notes`・`example`・`source` をまとめる）・関連（`relatedTerms` を、同じページの用語へのリンクにする）の 5 列とする。
  - セルの中の改行は空白につなぎ、`|` は `\|` に置き換える。表が壊れないことを確かめる。
  - 最後の章に、YAML の正本を `<details>` で折りたたんで残す（今のコードブロックと同じ中身）。
- 用語集以外の YAML の表示は変えない。
- `gl-sample.yaml` と、用語集の 6 件（`docs/ja/product/010-business-specs/060-glossary/`）で、表が正しく描けることを単体テストで確かめている（分類のない用語、改行や `|` を含むセル、関連のリンクを含む）。
- 生成されたページが `npm run lint:md` の決まり（見出しの番号など）に合っている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。文書サイトのビルド（`npm run docs:build`）は orchestrator が統合の後に流して確かめる。

## 4. 作業内容

| No  | 作業                                             | 担当         | 状態 | メモ                                                        |
| --- | ------------------------------------------------ | ------------ | ---- | ----------------------------------------------------------- |
| 1   | 用語集の表示用ページの描き方を足し、テストを足す | executor     | done | 分類別の表・関連リンク・YAML の折りたたみと回帰テストを追加 |
| 2   | 統合の後に文書サイトのビルドで確かめる           | orchestrator | open | -                                                           |
| 3   | 表示を見て確かめる                               | indie        | open | -                                                           |

## 5. 対応結果

### 5.1. 実施内容

- `src/docs/yaml-pages.ts` に `type: glossary` の分岐を追加した。生成元の注記に続くメタ情報表、分類ごとの 5 列の表、同じページ内の関連用語へのリンク、末尾の YAML 正本の折りたたみを描く。セルの改行と区切り文字を整え、YAML は既存の長さ可変フェンスで中身を保つ。
- `tests/src/docs/yaml-pages.test.ts` に、サンプルと実際の用語集 6 件の回帰テストを追加した。GFM として表の行数・列数を調べ、全用語・分類順・関連リンク・正本の保持を確認する。未分類、分類の再登場、英語名・別名、補足、改行・区切り文字、長いフェンス、空の用語集、用語集以外の表示も対象とする。
- 上記 7 件の表示ページを再生成した。`generated/` 配下は既存の運用どおり追跡対象外とする。

### 5.2. 判断と理由

- 分類が同じ用語集の用語 ID を指す場合、章名は「用語名（用語 ID）」にした。分類の意味と YAML の値を照合できるため。通常の文字列はそのまま表示し、未分類の「その他」も最初に現れた位置に置く。
- 関連リンクは用語名を表示し、用語 ID を明示した HTML アンカーへ結ぶ。章番号や用語名が変わってもリンク先を保つため。参照先がない場合は ID をコードで表示し、正当性の判定は既存の参照検査に委ねる。
- 英語名・別名と補足は項目ラベルを添えて同じセルにまとめ、空欄は `-` とした。既存の Markdown と wikilink を保ち、URL 単独の補足は autolink にして Markdown の規則に合わせた。

### 5.3. 検証

- Prettier で変更した TypeScript と本個票を整形した。
- カタログ検査、履歴リンク検査、登録簿の生成検査（`--dry-run`）、実行記録の秘密情報検査を実施した。カタログ検査は既存の再 export 参照・未作成文書に関する警告付きで通過した。
- 単体テスト・型検査・TypeScript lint・Markdown lint などの指定された親検証は runner が実行する。生成した 7 件のページも Markdown lint の検査対象になる。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 行の文案: 用語集 YAML の表示用ページを分類ごとの表に変更し、関連用語へのページ内リンクと YAML 正本の折りたたみ表示を追加した。

### 5.5. 申し送り

- 統合後、orchestrator が `npm run docs:build` を実行し、indie が表・関連リンク・折りたたみの表示を確認する。
- result への記入と親検証の結果反映は reporter / runner が行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[specdojo:gl-rulebook]]
