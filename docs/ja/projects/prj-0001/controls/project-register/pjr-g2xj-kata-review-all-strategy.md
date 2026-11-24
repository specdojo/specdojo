---
specdojo:
  id: prj-0001:pjr-g2xj-kata-review-all-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-24T13:33:23Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
  depends_on:
    - PJR-E30T
  commit_type: docs
  commit_scope: schedule
---

# PJR-G2XJ 全 sample の段のレビューの strategy を作る

## 1. 概要

書き手と別のモデルの振り分けと流す順を組み、track kata-review-all の strategy を作る

## 2. 入力

- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）
- PJR-0BGE の段取りとして 2026-11-24 の晩の実行の前に行う（利用者、2026-11-24）
- flash が書いた sample は sol に任せる（オーケストレーターの推奨、2026-11-24）

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`（track `kata-review-all`）を作る。scope は `dct-kata` の非推奨でない sample のうち、目合わせを済ませた `prj-overview-sample`・`opr-sample`・`stsd-sample` を除くすべてとする。
- 段の phase set は `sch-strategy-kata-review-calibration.yaml` の `kata-agent-review-pass`（報告の形を直した後の版）を写す。`task_suffix` は文字列のまま保つ。
- agent は、書き手と別のモデルにする決まり（kata-guide の `書き手と別のモデルの組み方`）で `owner_rules` の `phase_overrides[].agent` に書く。codex が書いた sample（`bac-sample`�`bdd-sample`�`cdfd-uc-sample`�`dct-index-sample`�`ifd-sample`�`opd-sample`�`pm-roles-sample`�`sysd-critical-flows-sample`�`sysd-cross-cutting-policy-sample`�`sysd-index-sample`）は `opus-executor`、ほか（claude が書いたもの、および flash が書いた `cdt-sample`�`ifx-cmd-sample`）は `sol-executor` とする。reporter は `sonnet-reporter`。書き手はオーケストレーターが実行の記録から調べた（2026-11-24）。
- owner は、各 sample を整えた既存の strategy（`sch-strategy-kata-wave-*`・`sch-strategy-business-specs-kata` など）の `owner_rules` に合わせる。見つからないものは rulebook の担当の役割から決め、決め方を個票の対応結果に書く。
- 流す順は、grade が pass でない `opd-sample`・`bes-sample`・`ifx-file-sample`・`etc-index-sample` を先にし、残りは型の系列の順（プロジェクトの定義・計画 → 業務 → システム → 試験・運用など）にする。順の付け方（strategy の設定）と理由を個票の対応結果に書く。
- `npm run validate:schema:file`（sch-strategy の schema）を通し、`specdojo schedule build --project prj-0001 --track kata-review-all --dry-run` で sample ごとに 110→120→130→140→150 の順につながることと、タスクの数（sample の数 × 5）を確かめて個票の対応結果に書く。
- track（`sch-track-kata-review-all.yaml`）は作らない。作ると `exec run --auto` の選択に入るため、実行の前にオーケストレーターが作る。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
