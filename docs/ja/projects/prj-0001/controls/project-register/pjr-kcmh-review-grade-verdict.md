---
specdojo:
  id: prj-0001:pjr-kcmh-review-grade-verdict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T05:17:28Z"
  due_on: "2026-11-07"
---

# PJR-KCMH review フェーズで grade を実行し verdict を合成する

## 1. 概要

PJR-2ZVS の決定のうち review 経路を実装する。review フェーズの前段で runner が対象文書へ grade を実行し（content_hash が一致する場合は既存 sidecar を再利用）、level を review_verdict へ写像して初期値とする。human 観点の判定と合成し最も厳しい判定を採る。レビュアが grade 由来の判定を覆す場合は viewpoint ID と理由を review result へ記録させる。xrp-\* テンプレートを更新する。

## 2. 完了条件

- review フェーズの前段で runner が対象文書へ grade を実行する。executor には実行させない。
- 対象文書の `content_hash` が既存 sidecar と一致する場合は grade を再実行せず、既存の結果を使う。
- grade の level が `grade_rubric` の `review_verdict` で verdict へ写像され、review の初期値になっている。
- `human` 観点の判定と合成し、最も厳しい判定（`changes_requested` > `conditional_pass` > `pass`）が採られている。`blocked` は level から写像せず、レビュアの判断だけで付与される。
- レビュアが grade 由来の判定を覆す場合、対象の viewpoint ID と理由が review result へ記録される。記録がない場合は上書きできない。
- `xrp-*` テンプレートに、`agent` / `deterministic` 観点は grade が判定済みであり再評価しない旨が記載されている。
- 合成規則と覆し時の記録を検証する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                            |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | review フェーズ前段の grade 実行を runner へ組み込む | DEV  | open | `content_hash` 一致時はスキップ |
| 2   | level から verdict への写像と合成規則を実装する      | DEV  | open | `blocked` は写像対象外          |
| 3   | 覆し時の viewpoint ID と理由の記録を必須にする       | DEV  | open | 記録がなければ検証で弾く        |
| 4   | `xrp-*` テンプレートへ判定主体の分担を明記する       | DEV  | open | 9 種すべて                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-n03w-grade-role-and-triggers]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `src/review-plan.ts`
