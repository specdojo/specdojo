---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-sample-080-20261121t125616z-b09aefa1
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-sample-080/T-KATA-WAVE-3-utc-sample-080-20261121T125616Z-b09aefa1/plan.md
  started_at: "2026-11-21T12:56:19.117Z"
  completed_at: "2026-11-21T13:02:11.847Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:utc-sample
  condense_records:
    - location: '## 3. 対象外 の印刷失敗の項目の後半文「本書では印刷要求の送信回数と内容だけを Mock で確認する。」'
      category: repetition
      action: delete
      reason: 境界/依存の表の receipt-print 行（Mock で送信回数と送信内容を検証する）と TR-05 の要点に同じ内容があり、削っても判断情報は残る
      cause:
        type: document
    - location: '## 4. 境界/依存 の表の直後の「共通方針から外れる依存の扱いはない。」'
      category: repetition
      action: merge
      reason: 表の直前の「共通の扱いに従い」と同じ主張なので、その文に「（外れる扱いはない）」としてまとめた。例外がないという宣言は残している
      cause:
        type: document
    - location: '## 5. トレース の TR-05 の備考「印刷失敗時の会計維持は `PATH-05`」'
      category: repetition
      action: delete
      reason: '同じ内容を ## 3. 対象外 の項目（代替: 外部結合テスト PATH-05）が正本として持ち、要点の「UT は要求データのみ」で範囲も分かる'
      cause:
        type: document
    - location: '## 1. 概要 の DEV・QE の分担の文'
      category: unneeded-background
      action: retain
      reason: ケースを追加・実装する人と照合する人という前提を示し、rulebook の概要の要件（読み手が前提を把握できること）を満たすため
      cause:
        type: document
    - location: '## 1. 概要 と ## 2. 責務 の重なり'
      category: repetition
      action: retain
      reason: rulebook が両方の章を必須と定め、概要は要約、責務は観測点つきの詳細と粒度が違うため
      cause:
        type: document
    - location: '## 6. の各ケース表の証跡列に同じ文言が並ぶ点'
      category: table-prose
      action: retain
      reason: 1 行が 1 テストの表で証跡は必須の列なので、行ごとに書く必要があるため
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/utc-sample.md` の冗長さを整理しました。
- 具体的には、重複していた説明の削除（2件）と、既存の記載への統合（1件）を行い、計3件の修正を実施しました。
- 検討の結果、意思決定や必須となる背景情報を維持するために保持すべき箇所（`retain`）を3件特定しました。
- 全ての修正において、`rulebook` が定める意味と必須情報は維持されています。
- Prettier および `markdownlint` による静的検査に合格していることを確認済みです。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: `repetition`（繰り返し）を解消するため、`## 3. 対象外` 内の冗長な一文を削除し、`## 4. 境界/依存` 内の重複した宣言を `merge`（統合）して整理しました。また、`## 5. トレース` 内の不要な背景説明を削除しました。一方で、`## 1. 概要` や `## 2. 責務` の記述、および各ケース表の `証跡` 列については、意味の維持と要件充足のために `retain`（保持）しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

文書内の `repetition`（繰り返し）、`table-prose`（表と本文の二重説明）、`unneeded-background`（不要な背景）を特定し、`delete`（削除）、`merge`（統合）、`reference`（参照への置き換え）を用いて整理しました。判断に不可欠な制約や完了条件は `retain`（保持）として記録に残しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `## 3. 対象外 の印刷失敗の項目の後半文「本書では印刷要求の送信回数と内容だけを Mock で確認する。」` | `repetition` | `delete` | `境界/依存の表の receipt-print 行（Mock で送信回数と送信内容を検証する）と TR-05 の要点に同じ内容があり、削っても判断情報は残る` | `document` |
| `## 4. 境界/依存 の表の直後の「共通方針から外れる依存の扱いはない。」` | `repetition` | `merge` | `表の直前の「共通の扱いに従い」と同じ主張なので、その文に「（外れる扱いはない）」としてまとめた。例外がないという宣言は残している` | `document` |
| ``## 5. トレース の TR-05 の備考「印刷失敗時の会計維持は `PATH-05`」`` | `repetition` | `delete` | `同じ内容を ## 3. 対象外 の項目（代替: 外部結合テスト PATH-05）が正本として持ち、要点の「UT は要求データのみ」で範囲も分かる` | `document` |
| `## 1. 概要 の DEV・QE の分担の文` | `unneeded-background` | `retain` | `ケースを追加・実装する人と照合する人という前提を示し、rulebook の概要の要件（読み手が前提を把握できること）を満たすため` | `document` |
| `## 1. 概要 と ## 2. 責務 の重なり` | `repetition` | `retain` | `rulebook が両方の章を必須と定め、概要は要約、責務は観測点つきの詳細と粒度が違うため` | `document` |
| `## 6. の各ケース表の証跡列に同じ文言が並ぶ点` | `table-prose` | `retain` | `1 行が 1 テストの表で証跡は必須の列なので、行ごとに書く必要があるため` | `document` |
