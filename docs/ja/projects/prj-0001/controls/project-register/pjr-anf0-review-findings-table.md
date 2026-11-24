---
specdojo:
  id: prj-0001:pjr-anf0-review-findings-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-24T17:43:28Z"
  derived_from:
    - PJR-QCJ5
    - PJR-0BGE
---

# PJR-ANF0 レビューの段の指摘を構造で受け取り runner が result に表として描く

## 1. 概要

PJR-QCJ5 で指示の文面（kata-guide と strategy）を直した後も、全件レビュー（PJR-0BGE）の result の指摘の表は 1 行に詰まったまま描かれる（例: `T-KATA-REVIEW-ALL-cxd-sample-110`・`T-KATA-REVIEW-ALL-mip-index-sample-130`、2026-11-24）。原因は runner の側にある。`src/exec/results.ts` の `reporterInlineText` が reporter の文の改行を空白に変え、`reporterBulletList` が 1 文を箇条書き 1 行にするため、文面の指示では表にならない。指摘を構造で受け取り、runner が表を描く形に変える。

## 2. 入力

- QCJ5 の指示の直しの後も、全件レビューの result の表は 1 行に詰まる（2026-11-24 の cxd-sample-110・mip-index-sample-130）
- 原因は src/exec/results.ts の reporterInlineText と reporterBulletList（オーケストレーターの調べ、2026-11-25）
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- reporter の出力（edit の形）に、指摘を構造で渡す任意の欄（例: `findings`。1 件ごとに No・段・箇所・指摘・直した案・根拠・印）を足し、runner がそれを result の `実施内容` の後に Markdown の表として 1 回だけ描く。セルの `|` と改行は runner が正規化する。欄の名前と形は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
- 欄が無い出力は今までどおり描く（既存の result と reporter の出力の互換を保つ）。
- reporter に渡す指示（出力の形の説明）を新しい欄に合わせる。kata-guide の `人への報告の形` と、`sch-strategy-kata-review-calibration.yaml`・`sch-strategy-kata-review-all.yaml` の段の `description` の報告の指示を、新しい欄を使う形に直す。track は直接編集しない。
- reporter の agent の定義など保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 単体テストを足す（表の描き方、セルの `|` と改行の正規化、欄が無いときに変わらないこと、schema の検査）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターがレビューの段を 1 件 `exec run` で流し、result の指摘が Markdown の表として 1 回だけ描かれることを確かめてから close する。runner を変えるため、全件レビュー（PJR-0BGE）の auto loop が止まっている間に統合する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
