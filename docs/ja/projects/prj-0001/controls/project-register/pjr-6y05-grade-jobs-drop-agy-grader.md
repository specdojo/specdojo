---
specdojo:
  id: prj-0001:pjr-6y05-grade-jobs-drop-agy-grader
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  registered_at: "2026-11-21T22:55:36Z"
  derived_from:
    - PJR-XA6Y
---

# PJR-6Y05 grade の job が使えなくなった agy の評価者を固定している

## 1. 概要

job-grade-kata と job-grade-deliverable が grade run に --by agy-expert-executor を固定で渡しており、agy を名簿から外したため流すと止まる。評価者を job の入力にする。

## 2. 入力

- agy の member は PJR-N6FQ で名簿から外した（2026-11-21）。
- 評価者は未定。routine（rtn-grade-kata・rtn-grade-recheck・rtn-grade-deliverable-recheck）はすべて enabled: false。
- job の評価者の変更は indie の依頼（2026-11-22）。

## 3. 完了条件

- `job-grade-kata` と `job-grade-deliverable` に、評価者の入力 `by`（必須・既定値なし）を足し、`grade run --by` へ渡す。`--by agy-expert-executor` の固定をなくす。
- `by` を渡さずに job を流すと、`grade run` を起動する前に、入力が足りないことを示すエラーで止まる。
- 既存の入力 `fallback_by`（PJR-XA6Y）は今までどおり渡せる。
- 両 job の `description` と判断の観点から、agy の語を外す（評価者に依らない書き方にする）。`generated/` の job の表示ページを作り直す。
- routine（`rtn-grade-kata`・`rtn-grade-recheck`・`rtn-grade-deliverable-recheck`）は変えない。評価者が決まっていないため `enabled: false` のままにする。routine の `inputs` に `by` を足す案は、個票の対応結果と報告の `handoff` に書く。
- job の実行を 1 回確かめる。`by` に名簿の有効な agent を渡し、`grade run` の `--dry-run` 相当で評価者が表示されることを確かめた手順と結果を、個票の対応結果に書く。
- `CHANGELOG.md` は変えない。prj-0001 の運用だけの変更のため、個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ                    |
| --- | ------------------------------------- | ---- | ---- | ----------------------- |
| 1   | 両 job に入力 `by` を足し固定を外す   | DEV  | open | 既定値なし              |
| 2   | `description` と観点から agy を外す   | DEV  | open | `generated/` を作り直す |
| 3   | 入力なしで止まること・実行を確かめる  | DEV  | open | 結果を対応結果に書く    |
| 4   | routine の案と CHANGELOG の扱いを書く | DEV  | open | routine は変えない      |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
