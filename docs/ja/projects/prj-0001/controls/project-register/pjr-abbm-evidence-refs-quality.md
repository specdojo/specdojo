---
specdojo:
  id: prj-0001:pjr-abbm-evidence-refs-quality
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T22:52:17Z"
  derived_from:
    - PJR-PSXJ
---

# PJR-ABBM 根拠にならない evidence_refs を警告し、見直しの段で本体のファイルを確かめる

## 1. 概要

catalog validate が存在しないパスと re-export だけのファイルを指す evidence_refs を警告し、catalog-planning の手順に本体のファイルの確認を足す

## 2. 入力

- 由来: PJR-PSXJ の決定（A 案）。候補 (2) の置き換えと (3)〜(5) は対象外（2026-11-06）
- orchestrator の調査: 成果物 203 件のうち 93 件に `evidence_refs` があり参照は 181 件。src/exec/exec.ts は 2 行の re-export で 56 回引かれている（2026-11-06）

## 3. 完了条件

- `catalog validate`（`src/catalog/build.ts` の `evidence_refs` の検査）が、中身が re-export（`export … from` と型の re-export）だけのファイルを指す参照を警告する。警告で終了コードを変えない。存在しないパス・広すぎるパス・重複の既存のエラーは変えない。
- 警告に、カタログのファイル、成果物の `local_id`、参照のパス、理由（re-export だけ）を含める。
- prj-0001 で `catalog validate` を実行し、警告の件数と、`src/exec/exec.ts` を指す参照が警告に出ることを個票の対応結果に書く。参照の置き換えは行わない。
- catalog-planning の plan の手順（`src/exec/plans-planning.ts`）に、状態遷移・判定・検証の本体を含むファイルが `evidence_refs` にあるかを確かめ、re-export だけのファイルを根拠にしない手順を足す。対応する recipe・ガイドがあれば同じ確認を書く。
- 単体テストを足す（re-export だけのファイルで警告が出る、通常のファイルで出ない、re-export と本体が混ざるファイルで出ない）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                           | 担当     | 状態 | メモ |
| --- | ---------------------------------------------- | -------- | ---- | ---- |
| 1   | re-export だけのファイルの判定と警告を足す     | executor | open | -    |
| 2   | catalog-planning の手順と recipe・ガイドを直す | executor | open | -    |
| 3   | テストと CHANGELOG を足す                      | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-PSXJ: 由来の decision
