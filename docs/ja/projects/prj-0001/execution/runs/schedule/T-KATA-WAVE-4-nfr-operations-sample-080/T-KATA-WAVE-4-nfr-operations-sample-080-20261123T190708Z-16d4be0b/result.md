---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-operations-sample-080-20261123t190708z-16d4be0b
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-operations-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-operations-sample-080/T-KATA-WAVE-4-nfr-operations-sample-080-20261123T190708Z-16d4be0b/plan.md
  started_at: "2026-11-23T19:07:10.599Z"
  completed_at: "2026-11-23T19:16:25.930Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:nfr-operations-sample
  condense_records:
    - location: 3. 運用要件一覧 nfr-ops-001 の備考
      category: canonical-restatement
      action: reference
      reason: 「5 分の無応答で通知する」は適用範囲・体制前提の段階 1 の表に既にある。段階 1 の閾値を前提とする、という参照に置き換えた。前提という意味は維持した。
      cause:
        type: document
    - location: 3. 運用要件一覧 nfr-ops-003 の備考
      category: table-prose
      action: reference
      reason: 「暦日ごとに 1 回と数える」は、測定・検証方法の「成功日数 ÷ 暦日数」と同じ内容。算出は測定方法に従う、という参照に置き換えた。
      cause:
        type: document
    - location: 1. 概要の業務影響の箇条書き 4 件
      category: repetition
      action: retain
      reason: 運用要件とサービス停止・店主不在時の運営への影響を結び付ける完了条件にあたる。要件ごとに内容が異なるため残した。
      cause:
        type: document
    - location: 5. 関連ドキュメント導線の表
      category: table-prose
      action: retain
      reason: 各要件の判定先と文書の対応を示す導線で、他の章に同じ対応はない。必須情報のため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 運用要件一覧の備考2箇所を、正本への参照に置き換えることで冗長さを解消しました。
- 「1. 概要」の業務影響に関する記述および「5. 関連ドキュメント導線の表」については、要件の意図や必須情報を維持するため、そのまま保持しています。
- 修正後の文書は、共通規約に従い整形および静的検査（`markdownlint` 等）を通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: `nfr-ops-001` および `nfr-ops-003` の備考欄における冗長な説明を、既存の定義への参照に置き換えました。また、概要の業務影響に関する箇条書きと、関連ドキュメントの導線表を保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書の冗長な記述（繰り返し、表と本文の二重説明など）を特定し、削る・まとめる・参照に置き換えることで、意味と必須情報を維持したまま簡潔化を行いました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `3. 運用要件一覧 nfr-ops-001 の備考` | `canonical-restatement` | `reference` | `「5 分の無応答で通知する」は適用範囲・体制前提の段階 1 の表に既にある。段階 1 の閾値を前提とする、という参照に置き換えた。前提という意味は維持した。` | `document` |
| `3. 運用要件一覧 nfr-ops-003 の備考` | `table-prose` | `reference` | `「暦日ごとに 1 回と数える」は、測定・検証方法の「成功日数 ÷ 暦日数」と同じ内容。算出は測定方法に従う、という参照に置き換えた。` | `document` |
| `1. 概要の業務影響の箇条書き 4 件` | `repetition` | `retain` | `運用要件とサービス停止・店主不在時の運営への影響を結び付ける完了条件にあたる。要件ごとに内容が異なるため残した。` | `document` |
| `5. 関連ドキュメント導線の表` | `table-prose` | `retain` | `各要件の判定先と文書の対応を示す導線で、他の章に同じ対応はない。必須情報のため残した。` | `document` |
