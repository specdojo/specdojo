---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cpd-sample-080-20261123t093837z-40df539d
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cpd-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cpd-sample-080/T-KATA-WAVE-6-NOTATION-cpd-sample-080-20261123T093837Z-40df539d/plan.md
  started_at: "2026-11-23T09:38:39.852Z"
  completed_at: "2026-11-23T16:34:05.232Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:cpd-sample
  condense_records:
    - location: §3.2 コンポーネントと論理配置 表後の段落「販売可否の判断を共通の記録接点へ移さない。」
      category: table-prose
      action: delete
      reason: 定義表の記録アクセス行(販売可否を判断しない)と同内容の重複で、削除しても意味は変わらない。
      cause:
        type: document
    - location: §4.1 技術前提・制約 / §4.2 検証対象 / §5 メモ・将来課題
      category: repetition
      action: retain
      reason: 各所の記述は制約・失敗時の判定・引き継ぎ条件として役割が異なり、判断に要るため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `cpd-sample.md` の冗長さを整理した。§3.2 の表の後ろにあった、定義表の記録アクセス行と同内容の 1 文を削除した。
- §4.1、§4.2、§5 の似た記述は、制約・失敗時の判定・引き継ぎ条件として役割が異なる。判断に要るため `retain` とした。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: §3.2「コンポーネントと論理配置」の表の後にある 1 文「販売可否の判断を共通の記録接点へ移さない。」を削除した。定義表の記録アクセス行(販売可否を判断しない)と重複していたため、意味は変えていない。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

condense。冗長さの候補を洗い出し、表と本文が二重になっていた 1 件を `delete` で直した。繰り返しに見える 1 件は役割が異なるため `retain` とし、いずれも原因は `document` と記録した。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `§3.2 コンポーネントと論理配置 表後の段落「販売可否の判断を共通の記録接点へ移さない。」` | `table-prose` | `delete` | `定義表の記録アクセス行(販売可否を判断しない)と同内容の重複で、削除しても意味は変わらない。` | `document` |
| `§4.1 技術前提・制約 / §4.2 検証対象 / §5 メモ・将来課題` | `repetition` | `retain` | `各所の記述は制約・失敗時の判定・引き継ぎ条件として役割が異なり、判断に要るため残した。` | `document` |
