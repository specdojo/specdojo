---
specdojo:
  id: prj-0001:pjr-aq9g-exec-plan-angle-placeholder-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T02:24:50Z"
  due_on: "2026-08-31"
---

# PJR-AQ9G plan 生成でも山括弧プレースホルダをインラインコード化する

## 1. 概要

個票の説明文は exec plan の本文へそのまま流し込まれるため、`dct-<domain>.yaml` のような素の山括弧プレースホルダが plan へ現れる。PJR-ZWMH では索引の表セル（register build）と frontmatter の検知を対応したが、plan 生成は対象外だった。実際に PJR-ZWMH 自身の plan が lint:fm の警告として検出されている。register build と同じ規則で plan 本文の展開時にもインラインコード化する。

## 2. 完了条件

- exec plan の本文へ展開する個票由来の値（説明文、タイトル、完了条件など）で、コードスパン外の山括弧プレースホルダがインラインコード化される。
- 変換規則は `register build` と同じものを共有し、実装を二重に持たない。連結範囲は拡張子のドットまで含め、文末の句点はコードの外に置く。
- 既にインラインコードで囲まれた箇所を二重に囲まない。
- 既存の残置 plan（`pjr-zwmh-20260822T140937Z-7efd-plan.md`）が解消され、`npm run lint:fm` が成功する。
- plan を再生成しても同じ結果になる。
- 上記を検証する unit test が追加され、`npm run test:unit` と `npm run lint:fm` が成功する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                          |
| --- | --------------------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | `register build` の変換処理を共有できる形に切り出す | ARC  | done | `src/exec-shared.ts` へ共通関数として移動     |
| 2   | plan 生成の本文展開へ適用する                       | ARC  | done | 個票由来の title / description と name へ適用 |
| 3   | 既存の残置 plan を解消する                          | ARC  | done | PJR-ZWMH と今回の生成済み plan を直接補正     |
| 4   | unit test を追加する                                | ARC  | done | 変換、二重化防止、再生成の安定性を検証        |

## 4. 対応結果

- `src/register.ts` に閉じていた `inlineCodeAnglePlaceholders` を `src/exec-shared.ts` へ移し、`register build` と register plan 生成で同じ変換規則を共有した。
- register plan の title / description と frontmatter の name に共通の Markdown 保護処理を適用した。拡張子を含む連結範囲を一つのコードスパンで囲み、文末のピリオドは外に残す。既存の単一・複数バッククォートのコードスパンは保持する。
- `tests/src/exec-register-plan-escape.test.ts` に、山括弧の変換、既存コードスパンの保持、同じ入力からの再生成が同一結果になることを確認する回帰テストを追加した。
- PJR-ZWMH と PJR-AQ9G の生成済み plan、および `lint:fm` が検出した PJR-DCTG 個票 frontmatter の残置箇所をインラインコード化した。残課題はない。

## 5. 関連ドキュメント

- 索引側の対応: [[prj-0001:pjr-zwmh-register-index-angle-placeholder-escape|PJR-ZWMH 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する]]
- 表記規約: `.github/instructions/markdown.instructions.md` の山括弧プレースホルダの節
- 共有したい実装: `src/register.ts` の `inlineCodeAnglePlaceholders`
- 検知している仕組み: `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`
