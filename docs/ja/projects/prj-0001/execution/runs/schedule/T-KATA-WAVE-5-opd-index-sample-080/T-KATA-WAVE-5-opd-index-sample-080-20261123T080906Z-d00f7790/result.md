---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-index-sample-080-20261123t080906z-d00f7790
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-index-sample-080/T-KATA-WAVE-5-opd-index-sample-080-20261123T080906Z-d00f7790/plan.md
  started_at: "2026-11-23T08:09:14.713Z"
  completed_at: "2026-11-23T08:33:42.140Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:opd-index-sample
  condense_records:
    - location: 2. 運用の範囲・前提 導入文の 2 文目
      category: table-prose
      action: delete
      reason: 対象外の列挙が直後の表の「対象外」行と同一で、削っても意味は変わらない
      cause:
        type: document
    - location: 3. SLO・SLA・KPI 導入文の「SLA は初期リリースでは置かない」
      category: table-prose
      action: delete
      reason: 表の SLA 行（対象外）が同じ内容を示しているため
      cause:
        type: document
    - location: 8. バックアップ・リストア方針 末尾の RPO 補足文
      category: repetition
      action: retain
      reason: 表にない当日分の戻し方という判断情報を含むため
      cause:
        type: document
    - location: 6. 障害対応方針 冒頭の優先度の参照文
      category: canonical-restatement
      action: retain
      reason: 再掲ではなく正本の表への参照で、判断に必要な導線であるため
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- opd-index-sample.md の冗長な 2 文を削除（表との二重説明）。意味・必須情報は維持。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-index-sample.md`: 「2. 運用の範囲・前提」の導入文における対象外の列挙、および「3. SLO・SLA・KPI」の導入文における SLA に関する記述を、直後の表との重複を避けるために削除しました。

## 3. 申し送り

- 適用外の検証: `npm run lint:md`（親 runner が実行する allowlist 検査のため executor では実行しない）

## 4. 進め方と実践の型の適用

対象文書 `docs/ja/specdojo/samples/opd-index-sample.md` を読み、繰り返しや表・本文の二重説明などの冗長さを特定しました。具体的には、「2. 運用の範囲・前提」の導入文と「3. SLO・SLA・KPI」の導入文における、直後の表と内容が重複する記述を削除することで、意味や判断に必要な情報を維持したまま簡潔な構成に整理しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `2. 運用の範囲・前提 導入文の 2 文目` | `table-prose` | `delete` | `対象外の列挙が直後の表の「対象外」行と同一で、削っても意味は変わらない` | `document` |
| `3. SLO・SLA・KPI 導入文の「SLA は初期リリースでは置かない」` | `table-prose` | `delete` | `表の SLA 行（対象外）が同じ内容を示しているため` | `document` |
| `8. バックアップ・リストア方針 末尾の RPO 補足文` | `repetition` | `retain` | `表にない当日分の戻し方という判断情報を含むため` | `document` |
| `6. 障害対応方針 冒頭の優先度の参照文` | `canonical-restatement` | `retain` | `再掲ではなく正本の表への参照で、判断に必要な導線であるため` | `document` |
