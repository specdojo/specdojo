---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-backup-restore-sample-080-20261123t182757z-c2c6e092
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-backup-restore-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-backup-restore-sample-080/T-KATA-WAVE-5-opr-backup-restore-sample-080-20261123T182757Z-c2c6e092/plan.md
  started_at: "2026-11-23T18:27:59.876Z"
  completed_at: "2026-11-23T18:37:25.905Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:opr-backup-restore-sample
  condense_records:
    - location: 1. 概要 末尾の段落（障害対応・アラート対応・バッチ再実行・運用変更・権限・問い合わせは opr-index の手順で完結…）
      category: repetition
      action: delete
      reason: 4・5・7・9・10 章が同じ内容を各章で述べており、判断に要る情報は失われない
      cause:
        type: document
    - location: 12. 関連ドキュメント導線 末尾の文（RTO/RPO や保管期間が決まった場合は…同時に見直す）
      category: repetition
      action: delete
      reason: 1章の未決事項の表の直前の説明（値が決まった時点で表を差し替える）と同じ主張の繰り返し
      cause:
        type: document
    - location: 6.1. 確認
      category: repetition
      action: retain
      reason: 3章の日次点検の行と重なるが、rulebook が求める手順の構成（実施条件・手順・完了条件）に必要
      cause:
        type: document
    - location: 11. 証跡 末尾の「保管期間が決まるまでは証跡を消さない」
      category: repetition
      action: retain
      reason: 未決事項の表の扱いを証跡側で具体化する文で、保管期間が決まるまでの運用判断に要る
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 文書内の冗長な記述を整理しました。
- 「1. 概要」末尾の、各章の記述が `opr-index` の内容と重複している旨を述べる段落を削除しました。
- 「12. 関連ドキュメント導線」末尾の、値が決まった際に表を見直す旨の、1章の説明との重複を削除しました。
- 「6.1. 確認」の記述は、`rulebook` が求める構成要素として必要であるため保持しました。
- 「11. 証跡」末尾の記述は、未決事項の扱いに関する具体的な運用判断であるため保持しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: 「1. 概要」末尾の重複説明の削除、「12. 関連ドキュメント導線」末尾の重複文の削除を行いました。また、「6.1. 確認」および「11. 証跡」末尾の記述は、判断に要る情報として保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

文書内の繰り返し（`repetition`）を特定し、削除・統合を行うことで簡潔にしました。判断の根拠や完了条件に関わる重要な情報は、`rulebook` の構成に則り、意味を損なわないよう保持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `1. 概要 末尾の段落（障害対応・アラート対応・バッチ再実行・運用変更・権限・問い合わせは opr-index の手順で完結…）` | `repetition` | `delete` | `4・5・7・9・10 章が同じ内容を各章で述べており、判断に要る情報は失われない` | `document` |
| `12. 関連ドキュメント導線 末尾の文（RTO/RPO や保管期間が決まった場合は…同時に見直す）` | `repetition` | `delete` | `1章の未決事項の表の直前の説明（値が決まった時点で表を差し替える）と同じ主張の繰り返し` | `document` |
| `6.1. 確認` | `repetition` | `retain` | `3章の日次点検の行と重なるが、rulebook が求める手順の構成（実施条件・手順・完了条件）に必要` | `document` |
| `11. 証跡 末尾の「保管期間が決まるまでは証跡を消さない」` | `repetition` | `retain` | `未決事項の表の扱いを証跡側で具体化する文で、保管期間が決まるまでの運用判断に要る` | `document` |
