---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-performance-sample-040-20261123t115724z-44e69948
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-performance-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-performance-sample-040/T-KATA-WAVE-4-nfr-performance-sample-040-20261123T115724Z-44e69948/plan.md
  started_at: "2026-11-23T11:57:31.729Z"
  completed_at: "2026-11-23T12:04:57.818Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔にするため、既存の「サンプル」章を削除し、代わりに判断基準や良い例・悪い例を含む「本文要件」へと再構成しました。
- grade による指摘事項（F001〜F006, F008）に基づき、負荷条件の根拠提示、ファイル命名や配置、成果物 ID の整合性、検証方法の再現性、および関連ドキュメントの導線に関する記述を修正しました。
- F007（サンプル構成の不一致）については、サンプル自体の変更をこのフェーズでは行わないため、未決事項として扱っています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-performance-rulebook.md`: 「サンプル」章を削除し、記述ガイド（良い例・悪い例）を含む「本文要件」へと章立てを再構成しました。また、F001〜F006, F008 の指摘に基づき、負荷条件の定義、ファイル配置、ドキュメント ID の命名規則、測定方法、および関連文書への導線の記述を修正しました。

## 3. 申し送り

- F007: `nfr-performance-sample` が rulebook の「本文要件」の 6 章（概要・適用範囲と負荷条件・性能要件一覧・測定と検証方法・関連ドキュメント導線・未決事項）に揃っていない。sample を作り直す段（recipe・template・sample の段）で対応する必要がある。rulebook の全体方針に `_UNDECIDED_` として、`ready` にする前提条件と書いた。
- 直さなかった箇所: 禁止事項の表（3 件）と「未決事項」の記述ガイドは、grade の指摘も冗長な点もないため変えていない。
- F001 は PJR-76N9 の決まりに沿い、合意した関係者（役割）を本文に書かせる形にはせず、ピーク条件の根拠の文書（`based_on`）と本文に根拠を示す形で直した。
- F005 は完全性の rulebook と同じく、プロダクト文書のため名前空間を付けない `nfr-performance` に確定した（根拠を本文に書いた）。
- 適用外の検証: `npm run validate:history-links`（履歴ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整理しました。具体的には、完成例としての「サンプル」章を削除し、執筆者が判断基準に沿って記述できるように「本文要件」としてのガイドライン（良い例・悪い例）を整備しました。また、指摘された各種の整合性および具体性の欠如を解消しました。
