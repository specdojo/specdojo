---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-stc-sample-080-20261121t112557z-28cd6536
  type: exec-result
  task_id: T-KATA-WAVE-3-stc-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-stc-sample-080/T-KATA-WAVE-3-stc-sample-080-20261121T112557Z-28cd6536/plan.md
  started_at: "2026-11-21T11:25:58.885Z"
  completed_at: "2026-11-21T11:34:36.815Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:stc-sample
  condense_records:
    - location: 'テスト観点とケース > 観点: 二重確定防止 > 意図（2文目）'
      category: repetition
      action: delete
      reason: 「照合待ちの識別と復元は stc-record-recovery が主担当」は「対象外」の3項目めと同じ主張で、そちらに理由と代わりのテストがあるため削った。意図の本文（販売記録と在庫減算が1回分だけ残ること）は残しており、意味は変わらない。
      cause:
        type: document
    - location: 概要 2段落目（確認と合意、status を ready にする条件）
      category: canonical-restatement
      action: retain
      reason: 役割分担は rulebook 全体方針の「確認と合意」と重なるが、ready にする条件（3者の確認と、P0 の判定を左右する前提の解消）はこの文書だけの完了条件なので残した。
      cause:
        type: document
    - location: 対象外 > 例外（会計確定の応答）
      category: repetition
      action: retain
      reason: 環境や負荷の条件は「境界/環境/依存」やケースと重なるが、rulebook の対象外の節が例外に条件・根拠・環境前提を書くよう求めているため残した。
      cause:
        type: kata
        kind: rulebook
        location: 記述ガイド > 対象外「例外として ST で扱う場合は、条件・根拠・環境前提を書く」
    - location: 境界/環境/依存 > 共通方針との差
      category: repetition
      action: retain
      reason: 測定後にデータを戻して再現性に影響しないという記述は、データ行の「開始時に戻す」と重なるが、rulebook が共通方針から外れる理由と再現性への影響を書くよう求めているため残した。
      cause:
        type: kata
        kind: rulebook
        location: 記述ガイド > 境界/環境/依存「共通方針から外れる場合は、理由と再現性・費用・安全性への影響を書く」
    - location: 境界/環境/依存 > 前提表の前置き文
      category: table-prose
      action: retain
      reason: 確定するまで合格を出口条件の根拠に使わないという制約は表の列にないため、表をなぞる文ではなく残すべき制約と判断した。
      cause:
        type: document
    - location: 目的 6項目め（仮置き基準 95%が2秒以内）
      category: repetition
      action: retain
      reason: 前提表の値と重なるが、目的に合否を判定できる値を書くため残した。
      cause:
        type: document
    - location: 概要 1段落目（確定前の取消・印刷失敗もこの term で扱う）
      category: repetition
      action: retain
      reason: トレース TR-04 の要点と重なるが、概要としてこの term が何を扱うかを示すのに要るため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 「二重確定防止」の意図における、`対象外` の項目と重複していた1文を削除し、文書の冗長さを整理しました。
- その他の検討箇所（概要、対象外、境界/環境/依存、目的）については、`rulebook` の要求事項や、判定基準として必要な情報を維持するために保持（`retain`）することを決定しました。
- Prettier による書式チェックおよび `docs:build` は正常に完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: 「二重確定防止」の意図内で、`対象外` の節と重複していた「照合待ちの識別と復元は stc-record-recovery が主担当」という記述を削除しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

既存の 1 文書の中の冗長さを削る・まとめる・参照に置き換える作業を実施しました。判断に要る背景・制約・例外・完了条件は保持し、新しい内容の追加は行っていません。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `テスト観点とケース > 観点: 二重確定防止 > 意図（2文目）` | `repetition` | `delete` | `「照合待ちの識別と復元は stc-record-recovery が主担当」は「対象外」の3項目めと同じ主張で、そちらに理由と代わりのテストがあるため削った。意図の本文（販売記録と在庫減算が1回分だけ残ること）は残しており、意味は変わらない。` | `document` |
| `概要 2段落目（確認と合意、status を ready にする条件）` | `canonical-restatement` | `retain` | `役割分担は rulebook 全体方針の「確認と合意」と重なるが、ready にする条件（3者の確認と、P0 の判定を左右する前提の解消）はこの文書だけの完了条件なので残した。` | `document` |
| `対象外 > 例外（会計確定の応答）` | `repetition` | `retain` | `環境や負荷の条件は「境界/環境/依存」やケースと重なるが、rulebook の対象外の節が例外に条件・根拠・環境前提を書くよう求めているため残した。` | `kata:rulebook; location=記述ガイド > 対象外「例外として ST で扱う場合は、条件・根拠・環境前提を書く」` |
| `境界/環境/依存 > 共通方針との差` | `repetition` | `retain` | `測定後にデータを戻して再現性に影響しないという記述は、データ行の「開始時に戻す」と重なるが、rulebook が共通方針から外れる理由と再現性への影響を書くよう求めているため残した。` | `kata:rulebook; location=記述ガイド > 境界/環境/依存「共通方針から外れる場合は、理由と再現性・費用・安全性への影響を書く」` |
| `境界/環境/依存 > 前提表の前置き文` | `table-prose` | `retain` | `確定するまで合格を出口条件の根拠に使わないという制約は表の列にないため、表をなぞる文ではなく残すべき制約と判断した。` | `document` |
| `目的 6項目め（仮置き基準 95%が2秒以内）` | `repetition` | `retain` | `前提表の値と重なるが、目的に合否を判定できる値を書くため残した。` | `document` |
| `概要 1段落目（確定前の取消・印刷失敗もこの term で扱う）` | `repetition` | `retain` | `トレース TR-04 の要点と重なるが、概要としてこの term が何を扱うかを示すのに要るため残した。` | `document` |
