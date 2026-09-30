---
specdojo:
  id: prj-0001:pjr-b7dg-rulebook-sample-coverage-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-30T11:39:31Z"
---

# PJR-B7DG rulebook から削除した例が sample に含まれるかの確認と grade による比較

## 1. 概要

PJR-GWYJ で 52 件の rulebook から削除したサンプル章の要点が既存の sample に含まれるかを確かめ、欠けるものだけを反映する。外出しの前後を grade で比べ、vp-qe-kata-conformance と vp-arc-conciseness の finding を記録する

## 2. 完了条件

- PJR-GWYJ の 1 回目の実行（commit `f940b1b6`）でサンプル章を削除した rulebook のうち、sample を持つものすべてについて、削除した例の要点が対応する sample に含まれるかを確かめ、rulebook・sample・判定（含まれる / 一部欠ける / 欠ける）・対応を表で対応結果に記録する。削除前の内容は `git show f940b1b6~1:<path>` で確かめる。
- 欠けているものだけを、`sample-authoring-standard` に従って sample へ反映する。削除した章を sample の末尾へそのまま貼り付けない。既存の章番号・見出し・frontmatter を壊さず、YAML / JSON の sample の先頭のスキーマ指定を消さない。
- 外出しした rulebook のうち 3 件以上を grade で評価し、外出し前の評価結果（`execution/grade/results/` の履歴）と比べて、`vp-qe-kata-conformance` と `vp-arc-conciseness` の level と finding の件数を対応結果に記録する。実行したコマンドも記録する。
- 反映した sample が `npm run lint:md`、`npm run lint:fm`、`npm run validate:schema` を通る。
- 対象外のファイル（rulebook 本文、対象でない sample）を変更しない。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                     |
| --- | -------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | 削除した例が sample に含まれるかの確認と記録 | ARC  | open | exec run で agent が行う |
| 2   | 欠けている要点だけを sample へ反映する       | ARC  | open | -                        |
| 3   | grade による外出し前後の比較                 | QE   | open | 3 件以上                 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2]]
