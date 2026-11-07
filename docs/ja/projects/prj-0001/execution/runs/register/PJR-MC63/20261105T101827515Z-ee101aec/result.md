---
specdojo:
  id: prj-0001:xer-pjr-mc63-20261105t101827z-3b1bbb8b
  type: exec-result
  task_id: PJR-MC63
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MC63/20261105T101827515Z-ee101aec/plan.md
  started_at: "2026-11-05T10:18:30.249Z"
  completed_at: "2026-11-05T10:28:57.808Z"
  agent: sol-executor
  approach: condense
  targets:
    - prj-0001:stsd-task-execution
  condense_records:
    - location: 導入文・修正前15行「SpecDojo におけるタスク実行…状態と状態遷移を定義する」
      category: repetition
      action: delete
      reason: 対象とライフサイクルの範囲は概要の対象・スコープに記載済みのため、導入の繰り返しを削除した。
      cause:
        type: document
    - location: §1 一意判定・修正前27行
      category: table-prose
      action: reference
      reason: 依存充足による未着手・着手可能の判定を状態一覧への参照にまとめた。基本状態が `todo` の場合だけ導出する制約、非永続化、他状態への依存変化の非適用を保持した。依存未充足への戻りは状態一覧と `T-15` に残る。
      cause:
        type: document
    - location: §1 対象範囲の到達点・修正前29行「完了・中止後も記録に基づく状態管理を継続するため」
      category: repetition
      action: delete
      reason: 直前の完了・中止の扱いと継続状態の説明に重なる部分を削除した。差し戻し可能性、補足記録・状態確認の継続、終了イベントがないこと、終了点を置かない判断は保持した。
      cause:
        type: document
    - location: §4 `T-06` 補足・修正前96行
      category: repetition
      action: merge
      reason: 着手解放と基本状態を `todo` に戻す規則を§4冒頭に集約した。再着手可能の判定は同じ行の遷移先・条件で保持し、`release` の対応も残した。
      cause:
        type: document
    - location: §4 `T-07` 補足・修正前97行
      category: repetition
      action: merge
      reason: 中断中の試行の放棄、基本状態の復帰、依存再判定を§4冒頭に集約した。遷移元・遷移先・条件と `release` の対応を保持した。
      cause:
        type: document
    - location: §4 `T-08` 補足・修正前98行「操作権限を持つアクターが完了と検証合格を報告する」
      category: table-prose
      action: delete
      reason: 操作権限は§4冒頭、作業完了・成果物検証成功は同行の条件、報告された状態の意味は状態一覧に残る。重複を削除し、完了イベントが受入承認まで保証しない制約を保持した。
      cause:
        type: document
    - location: §4 `T-09` 補足・修正前99行
      category: repetition
      action: merge
      reason: 完了記録を消さず基本状態を `todo` に戻す規則を§4冒頭に集約した。再作業待ちの条件・遷移先と、後続が中止なら差し戻しを妨げない例外を保持した。
      cause:
        type: document
    - location: §4 `T-11` 補足・修正前101行「着手可能となったが不要となったタスクを恒久的に中止する」
      category: repetition
      action: delete
      reason: 遷移元・遷移先と状態一覧の中止の意味を言い直す説明を削除した。`cancel` の対応と中止条件、`T-10` の直接中止に関する制約は保持した。
      cause:
        type: document
    - location: §4 `T-14` 補足・修正前102行
      category: table-prose
      action: delete
      reason: 開始から着手可能へ直接進むことは同行の遷移元・遷移先に、依存なしを含むことは概要と状態一覧に記載済みのため、補足の再説明を削除した。
      cause:
        type: document
    - location: §4 `T-16` 補足・修正前104行
      category: repetition
      action: merge
      reason: 基本状態を `todo` に戻す規則を§4冒頭に集約した。依存未充足では再着手できないことは同行の条件・遷移先と状態一覧で維持した。
      cause:
        type: document
    - location: §4 `T-17` 補足・修正前105行
      category: repetition
      action: merge
      reason: 中断中の試行の放棄を§4冒頭に集約した。依存待ちへの復帰は同行の遷移先・条件で維持し、`release` の対応を残した。
      cause:
        type: document
    - location: §4 `T-18` 補足・修正前106行
      category: repetition
      action: merge
      reason: 基本状態を `todo` に戻して依存を再判定する規則を§4冒頭に集約した。依存充足後に再着手する制約は同行の条件・遷移先と状態一覧に残る。
      cause:
        type: document
    - location: §3 図の分割説明・修正前45〜47行および63行
      category: figure-prose
      action: retain
      reason: 分割理由、共有状態、対象遷移 ID と図間の読み方は、分割図から到達性を判断するために必要。遷移そのものの言い換えではなく、template の明示要件にも対応するため保持した。Kata の修正提案はない。
      cause:
        type: kata
        kind: template
        location: docs/ja/specdojo/templates/stsd-template.md §3 状態遷移図のコメント「各図が扱う遷移 ID と共有状態を明記する」
    - location: §1 状態の正本・修正前24行の依存充足規則
      category: unneeded-background
      action: retain
      reason: マイルストーン・ゲートの再帰判定、存在しない依存、循環、依存なし、中止は完了の代わりにならないという境界条件は、状態一覧の成立条件を判断するために必要なため保持した。
      cause:
        type: document
    - location: §5 今後の検討メモ・修正前112〜115行
      category: table-prose
      action: retain
      reason: 本文の業務要件を再掲する部分はあるが、未作成の辞書、実装との差異、承認の不足、決定者・決定時期を示す固有の判断情報があるため、全項目を保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` における冗長な記述を `condense` により整理しました。
- 導入文の繰り返しを削除し、状態遷移の補足説明（`T-06`, `T-07`, `T-09`, `T-16`, `T-18`）や、表の二重説明（`T-08`, `T-14`）を §4 冒頭への集約または削除によって整理しました。
- 状態遷移図の分割に関する説明（`figure-prose`）については、`stsd-template.md` の要件に基づき、到達性判断のために必要な情報を保持（`retain`）しています。
- 状態の正本における依存充足の境界条件および、今後の検討事項の判断情報を保持した上で、重複を排除しました。
- 状態・遷移・イベントの数と名前、および重要な業務的制約はすべて維持されています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`: 導入文の繰り返しや、状態遷移の補足説明における冗長な文章を削除・統合して簡潔にしました。また、図の分割に関する説明など、判断に不可欠な情報は保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書の冗長な箇所（繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景）を特定し、`delete`（削除）、`merge`（統合）、`reference`（参照への置き換え）を用いて整理しました。判断に不可欠な背景・制約・例外・完了条件は `retain` として保持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `導入文・修正前15行「SpecDojo におけるタスク実行…状態と状態遷移を定義する」` | `repetition` | `delete` | `対象とライフサイクルの範囲は概要の対象・スコープに記載済みのため、導入の繰り返しを削除した。` | `document` |
| `§1 一意判定・修正前27行` | `table-prose` | `reference` | ``依存充足による未着手・着手可能の判定を状態一覧への参照にまとめた。基本状態が `todo` の場合だけ導出する制約、非永続化、他状態への依存変化の非適用を保持した。依存未充足への戻りは状態一覧と `T-15` に残る。`` | `document` |
| `§1 対象範囲の到達点・修正前29行「完了・中止後も記録に基づく状態管理を継続するため」` | `repetition` | `delete` | `直前の完了・中止の扱いと継続状態の説明に重なる部分を削除した。差し戻し可能性、補足記録・状態確認の継続、終了イベントがないこと、終了点を置かない判断は保持した。` | `document` |
| ``§4 `T-06` 補足・修正前96行`` | `repetition` | `merge` | ``着手解放と基本状態を `todo` に戻す規則を§4冒頭に集約した。再着手可能の判定は同じ行の遷移先・条件で保持し、`release` の対応も残した。`` | `document` |
| ``§4 `T-07` 補足・修正前97行`` | `repetition` | `merge` | ``中断中の試行の放棄、基本状態の復帰、依存再判定を§4冒頭に集約した。遷移元・遷移先・条件と `release` の対応を保持した。`` | `document` |
| ``§4 `T-08` 補足・修正前98行「操作権限を持つアクターが完了と検証合格を報告する」`` | `table-prose` | `delete` | `操作権限は§4冒頭、作業完了・成果物検証成功は同行の条件、報告された状態の意味は状態一覧に残る。重複を削除し、完了イベントが受入承認まで保証しない制約を保持した。` | `document` |
| ``§4 `T-09` 補足・修正前99行`` | `repetition` | `merge` | ``完了記録を消さず基本状態を `todo` に戻す規則を§4冒頭に集約した。再作業待ちの条件・遷移先と、後続が中止なら差し戻しを妨げない例外を保持した。`` | `document` |
| ``§4 `T-11` 補足・修正前101行「着手可能となったが不要となったタスクを恒久的に中止する」`` | `repetition` | `delete` | ``遷移元・遷移先と状態一覧の中止の意味を言い直す説明を削除した。`cancel` の対応と中止条件、`T-10` の直接中止に関する制約は保持した。`` | `document` |
| ``§4 `T-14` 補足・修正前102行`` | `table-prose` | `delete` | `開始から着手可能へ直接進むことは同行の遷移元・遷移先に、依存なしを含むことは概要と状態一覧に記載済みのため、補足の再説明を削除した。` | `document` |
| ``§4 `T-16` 補足・修正前104行`` | `repetition` | `merge` | ``基本状態を `todo` に戻す規則を§4冒頭に集約した。依存未充足では再着手できないことは同行の条件・遷移先と状態一覧で維持した。`` | `document` |
| ``§4 `T-17` 補足・修正前105行`` | `repetition` | `merge` | ``中断中の試行の放棄を§4冒頭に集約した。依存待ちへの復帰は同行の遷移先・条件で維持し、`release` の対応を残した。`` | `document` |
| ``§4 `T-18` 補足・修正前106行`` | `repetition` | `merge` | ``基本状態を `todo` に戻して依存を再判定する規則を§4冒頭に集約した。依存充足後に再着手する制約は同行の条件・遷移先と状態一覧に残る。`` | `document` |
| `§3 図の分割説明・修正前45〜47行および63行` | `figure-prose` | `retain` | `分割理由、共有状態、対象遷移 ID と図間の読み方は、分割図から到達性を判断するために必要。遷移そのものの言い換えではなく、template の明示要件にも対応するため保持した。Kata の修正提案はない。` | `kata:template; location=docs/ja/specdojo/templates/stsd-template.md §3 状態遷移図のコメント「各図が扱う遷移 ID と共有状態を明記する」` |
| `§1 状態の正本・修正前24行の依存充足規則` | `unneeded-background` | `retain` | `マイルストーン・ゲートの再帰判定、存在しない依存、循環、依存なし、中止は完了の代わりにならないという境界条件は、状態一覧の成立条件を判断するために必要なため保持した。` | `document` |
| `§5 今後の検討メモ・修正前112〜115行` | `table-prose` | `retain` | `本文の業務要件を再掲する部分はあるが、未作成の辞書、実装との差異、承認の不足、決定者・決定時期を示す固有の判断情報があるため、全項目を保持した。` | `document` |
