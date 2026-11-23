---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-tsd-sample-080-20261123t171420z-fa6a8c02
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-tsd-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-tsd-sample-080/T-KATA-WAVE-6-DESIGN-tsd-sample-080-20261123T171420Z-fa6a8c02/plan.md
  started_at: "2026-11-23T17:14:24.373Z"
  completed_at: "2026-11-23T17:25:28.823Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:tsd-sample
  condense_records:
    - location: 3. 全体構成と接続経路 の箇条書き 1・2 項目
      category: figure-prose
      action: delete
      reason: 図の矢印と同じ内容の語句（HTTPS、5432 番）を削った。直接接続しないという制約とホスト名は残した
      cause:
        type: document
    - location: 7.2. バックアップの取得 の導入文
      category: canonical-restatement
      action: reference
      reason: 運用方針の wikilink と節名の再掲を、他文書との関係への参照に置き換えた。節名は 1.2 の表に残っている
      cause:
        type: document
    - location: 8.1. 既知の制約事項 の同時接続数
      category: table-prose
      action: merge
      reason: 採用設定一覧と重複する数値の説明を削り、40 を超えない制約に合わせた
      cause:
        type: document
    - location: 4.2. 採用値・推奨値・未決事項の区別
      category: repetition
      action: retain
      reason: 表にない区分と見直しの根拠を示すため残した
      cause:
        type: document
    - location: 4.1. 設定値の反映先
      category: table-prose
      action: retain
      reason: 表にない実行コマンドと手順を含むため残した
      cause:
        type: document
    - location: 6.1. 動作確認一覧 の 2 つの表
      category: table-prose
      action: retain
      reason: 段階ごとの合否と実施状況という別の情報のため残した
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- tsd-sample.md の冗長な 3 箇所を削除・参照置換で整理した。意味と必須情報は維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 「3. 全体構成と接続経路」における図の補足説明を削除し、「7.2. バックアップの取得」の導入文を他文書への参照に置き換えるなど、冗長な記述の整理を行った。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

既存の 1 文書の中から、繰り返し、表と本文の二重説明、図をなぞる文、目的に要らない背景、正本の再掲といった冗長な箇所を特定し、削除・集約・参照置換によって整理を行った。判断に要する制約や完了条件などの必須情報は維持している。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `3. 全体構成と接続経路 の箇条書き 1・2 項目` | `figure-prose` | `delete` | `図の矢印と同じ内容の語句（HTTPS、5432 番）を削った。直接接続しないという制約とホスト名は残した` | `document` |
| `7.2. バックアップの取得 の導入文` | `canonical-restatement` | `reference` | `運用方針の wikilink と節名の再掲を、他文書との関係への参照に置き換えた。節名は 1.2 の表に残っている` | `document` |
| `8.1. 既知の制約事項 の同時接続数` | `table-prose` | `merge` | `採用設定一覧と重複する数値の説明を削り、40 を超えない制約に合わせた` | `document` |
| `4.2. 採用値・推奨値・未決事項の区別` | `repetition` | `retain` | `表にない区分と見直しの根拠を示すため残した` | `document` |
| `4.1. 設定値の反映先` | `table-prose` | `retain` | `表にない実行コマンドと手順を含むため残した` | `document` |
| `6.1. 動作確認一覧 の 2 つの表` | `table-prose` | `retain` | `段階ごとの合否と実施状況という別の情報のため残した` | `document` |
