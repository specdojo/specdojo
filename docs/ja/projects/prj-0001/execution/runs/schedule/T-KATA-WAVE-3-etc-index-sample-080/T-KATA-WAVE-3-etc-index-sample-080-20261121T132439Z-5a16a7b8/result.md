---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-etc-index-sample-080-20261121t132439z-5a16a7b8
  type: exec-result
  task_id: T-KATA-WAVE-3-etc-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-etc-index-sample-080/T-KATA-WAVE-3-etc-index-sample-080-20261121T132439Z-5a16a7b8/plan.md
  started_at: "2026-11-21T13:24:44.099Z"
  completed_at: "2026-11-21T13:34:15.857Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:etc-index-sample
  condense_records:
    - location: メモ / 将来課題 の表、_UNDECIDED_ 行の「当面の扱い」
      category: repetition
      action: reference
      reason: 「外部結合テスト共通の境界/依存/環境の扱い」表の「検証用領域が使えない時」と同じ保留規則（2営業日続けば QE が判定を保留）を、その章への参照に置き換えた。この表にしかない「PM が日程を見直す」は残したので意味は変わらない
      cause:
        type: document
    - location: 外部結合テスト共通の境界/依存/環境の扱い の合格基準の例の段落
      category: repetition
      action: retain
      reason: ケース表の記入例の期待値と近いが、数値や状態で判定できる共通の合格基準を示すことは完了条件の必須項目なので残す
      cause:
        type: document
    - location: メモ / 将来課題 の表、_ASSUMPTION_ 行
      category: repetition
      action: retain
      reason: タイムアウト・再送の値と同じだが、仮置きであることと確定の手順を示す未決の記録として必要
      cause:
        type: document
    - location: 本ドキュメントの目的と適用対象 の業務リスク 3 点
      category: repetition
      action: retain
      reason: 採用基準の表の採用理由と重なるが、こちらは適用の根拠、表は観点ごとの採用の根拠で役割が違う
      cause:
        type: document
    - location: ケース表の共通カラム の表の後の段落（case_id の運用）
      category: canonical-restatement
      action: retain
      reason: rulebook の規約をサンプルに当てはめたもので、欠番の扱いとテスト名への含め方というサンプル固有の判断を含む
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 「メモ / 将来課題」表において、`_UNDECIDED_` 行の保留規則を、意味を維持したまま「外部結合テスト共通の境界/依存/環境の扱い」の章への参照に置き換え、冗長さを解消しました。
- その他の箇所（合格基準の例、`_ASSUMPTION_` 行、業務リスク、`case_id` の運用に関する記述）については、判断に要る背景やルールが含まれているため、保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: 「メモ / 将来課題」表における保留規則を、既存の別章への参照に置き換えることで冗長さを整理しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:history-links`（変更したのは samples 配下の sample だけで、pjr 個票・plan・result などの履歴ファイルを変更していない）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `メモ / 将来課題 の表、_UNDECIDED_ 行の「当面の扱い」` | `repetition` | `reference` | `「外部結合テスト共通の境界/依存/環境の扱い」表の「検証用領域が使えない時」と同じ保留規則（2営業日続けば QE が判定を保留）を、その章への参照に置き換えた。この表にしかない「PM が日程を見直す」は残したので意味は変わらない` | `document` |
| `外部結合テスト共通の境界/依存/環境の扱い の合格基準の例の段落` | `repetition` | `retain` | `ケース表の記入例の期待値と近いが、数値や状態で判定できる共通の合格基準を示すことは完了条件の必須項目なので残す` | `document` |
| `メモ / 将来課題 の表、_ASSUMPTION_ 行` | `repetition` | `retain` | `タイムアウト・再送の値と同じだが、仮置きであることと確定の手順を示す未決の記録として必要` | `document` |
| `本ドキュメントの目的と適用対象 の業務リスク 3 点` | `repetition` | `retain` | `採用基準の表の採用理由と重なるが、こちらは適用の根拠、表は観点ごとの採用の根拠で役割が違う` | `document` |
| `ケース表の共通カラム の表の後の段落（case_id の運用）` | `canonical-restatement` | `retain` | `rulebook の規約をサンプルに当てはめたもので、欠番の扱いとテスト名への含め方というサンプル固有の判断を含む` | `document` |
