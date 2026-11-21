---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-index-sample-080-20261121t155244z-ae2d94fe
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-index-sample-080/T-KATA-WAVE-3-atc-index-sample-080-20261121T155244Z-ae2d94fe/plan.md
  started_at: "2026-11-21T15:52:45.738Z"
  completed_at: "2026-11-21T15:58:16.914Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:atc-index-sample
  condense_records:
    - location: 「対象外・除外理由（共通）」の表、通信不能時の販売継続の行の例外列
      category: canonical-restatement
      action: reference
      reason: 決定後に `atc-sale-hold` へ観点を追加する方針は「メモ / 将来課題」の見直し方針（観点と条件の追加・分配表の更新）と重複していた。同じ行の代替列も「メモ / 将来課題」を指しているので、参照に置き換えても判断情報は失われない
      cause:
        type: document
    - location: 「条件の立て方（共通）」の表の後の段落、在庫と同数の境界と障害経路を AT で作らないとする文
      category: repetition
      action: reference
      reason: 障害経路を AT で扱わないことは「対象外・除外理由（共通）」の障害パターンの行（代替は ET・ST）で定義済み。境界を ST で確定済みとする判断は残し、障害経路はその章への参照にまとめた
      cause:
        type: document
    - location: 「判定の流れ」末尾の段落と「環境/データ/外部依存の扱い（共通）」の証跡の行
      category: repetition
      action: retain
      reason: rulebook は判定の流れ（判定者が実施者・証跡確認者とその記録を辿れること）と証跡（証跡確認者・判定責任者を追跡できること）の両方で記述を求めており、どちらも各章の必須内容なので残す
      cause:
        type: document
    - location: 「合格基準」の表の後の段落、未実施と判定保留を Pass に数えない文
      category: repetition
      action: retain
      reason: P0 の行と一部重なるが、P1・P2 の集計にもかかる共通ルールのため判断に必要
      cause:
        type: document
    - location: 「環境/データ/外部依存の扱い（共通）」の表の後の段落、実在の顧客名とつけ残高を使わない文
      category: repetition
      action: retain
      reason: データの行の架空の常連顧客と近い内容だが、実データを使わない制約と、データ状態が異なる場合の判定保留・再実施という例外の扱いを含み、判断に必要
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 文書 `docs/ja/specdojo/samples/atc-index-sample.md` の冗長さを整理しました。
- 「対象外・除外理由（共通）」および「条件の立て方（共通）」における重複した説明を、既存のセクションへの参照に置き換えることで削減しました。
- 「判定の流れ」や「合格基準」に関連する、判定に不可欠な判断基準や例外ルールは、理由を添えてそのまま保持しています。
- Prettier および `markdownlint` による静的検査を通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 冗長な記述を整理。2箇所の記述（「対象外・除外理由（共通）」の表内の例外事項、および「条件の立て方（共通）」の後の段落）を既存の章への参照に置き換え、3箇所の記述（「判定の流れ」に関する記述、「合格基準」に関する記述、「環境/データ/外部依存の扱い（共通）」に関する記述）を判断に必要であるとして保持しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:history-links`（Only a sample under docs/ja/specdojo/samples/ was changed; no plan/result/pjr ticket was edited）
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` file was changed）

## 4. 進め方と実践の型の適用

「冗長さの整理」の計画に従い、文書内の `repetition` (繰り返し) や `canonical-restatement` (正本の再掲) を特定し、`delete` (削除)・`merge` (集約)・`reference` (参照への置き換え) を行いました。また、判断に要する重要な条件や例外事項については `retain` (保持) としてその理由を記録しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `「対象外・除外理由（共通）」の表、通信不能時の販売継続の行の例外列` | `canonical-restatement` | `reference` | ``決定後に `atc-sale-hold` へ観点を追加する方針は「メモ / 将来課題」の見直し方針（観点と条件の追加・分配表の更新）と重複していた。同じ行の代替列も「メモ / 将来課題」を指しているので、参照に置き換えても判断情報は失われない`` | `document` |
| `「条件の立て方（共通）」の表の後の段落、在庫と同数の境界と障害経路を AT で作らないとする文` | `repetition` | `reference` | `障害経路を AT で扱わないことは「対象外・除外理由（共通）」の障害パターンの行（代替は ET・ST）で定義済み。境界を ST で確定済みとする判断は残し、障害経路はその章への参照にまとめた` | `document` |
| `「判定の流れ」末尾の段落と「環境/データ/外部依存の扱い（共通）」の証跡の行` | `repetition` | `retain` | `rulebook は判定の流れ（判定者が実施者・証跡確認者とその記録を辿れること）と証跡（証跡確認者・判定責任者を追跡できること）の両方で記述を求めており、どちらも各章の必須内容なので残す` | `document` |
| `「合格基準」の表の後の段落、未実施と判定保留を Pass に数えない文` | `repetition` | `retain` | `P0 の行と一部重なるが、P1・P2 の集計にもかかる共通ルールのため判断に必要` | `document` |
| `「環境/データ/外部依存の扱い（共通）」の表の後の段落、実在の顧客名とつけ残高を使わない文` | `repetition` | `retain` | `データの行の架空の常連顧客と近い内容だが、実データを使わない制約と、データ状態が異なる場合の判定保留・再実施という例外の扱いを含み、判断に必要` | `document` |
