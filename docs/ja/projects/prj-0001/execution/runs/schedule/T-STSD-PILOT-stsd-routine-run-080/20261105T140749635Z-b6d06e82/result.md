---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-routine-run-080
  type: exec-result
  task_id: T-STSD-PILOT-stsd-routine-run-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-STSD-PILOT-stsd-routine-run-080/20261105T140749635Z-b6d06e82/plan.md
  started_at: "2026-11-05T14:07:52.109Z"
  completed_at: "2026-11-05T14:20:39.042Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - stsd-routine-run
  condense_records:
    - location: 1. 概要、第1段落「結果と確認要否」「状態が一意に分からなければ」
      category: repetition
      action: merge
      reason: 判断目的を結果と完了確認・再実行の要否へ集約した。利用者、確認・引継ぎの負担軽減、BV-03 との対応を維持した。
      cause:
        type: document
    - location: 1. 概要、第2段落の BA・PO の確認分担、および5. 今後の検討メモの最終段落
      category: repetition
      action: merge
      reason: BA の辞書照合と PO の正常・例外経路の確認を末尾の業務承認条件へ集約した。概要には BA の状態・遷移の説明責任と ARC・QE・DEV の利用目的を残した。
      cause:
        type: document
    - location: 1. 概要、「一意判定」の冒頭2文
      category: table-prose
      action: reference
      reason: 現在状態の判定説明を2. 状態一覧の成立条件への参照に置き換えた。未実行の結果値を書き込まない制約は T-01 に残し、開始時更新と不正・旧記録の扱いも維持した。
      cause:
        type: document
    - location: 1.1. due 判定と実行機会の選択、末尾段落「次回も現在分の一致と処理済み時刻を比較する」
      category: table-prose
      action: delete
      reason: 同節の cron 行にある現在分と処理済み時刻の比較と重複するため削除した。取りこぼし時に状態・履歴を記録しない制約と T-05 との区別は残した。
      cause:
        type: document
    - location: 4. 遷移の説明、T-05 補足「一部の段が成功していてもこの結果になる」
      category: repetition
      action: delete
      reason: 2. 状態一覧のスキップ行に成功した段を伴う場合も含むと明記され、1.2 の集約優先順も保持されている。同じ実行機会を消化済みとする制約は残した。
      cause:
        type: document
    - location: 4. 遷移の説明、T-06・T-07・T-08・T-10・T-11 の補足「開始条件は T-02 と同じ」および T-06 の記録更新説明
      category: repetition
      action: merge
      reason: 各行の共通説明を表直前の T-02 補足への参照へ集約した。開始条件と記録更新の適用範囲を明記し、再評価・即時再試行・試行中の再開始に関する固有の制約は各行に維持した。
      cause:
        type: document
    - location: 4. 遷移の説明、T-09 補足「スキップが含まれていても部分完了を優先する」
      category: repetition
      action: delete
      reason: 1.2 の集約優先順と2. 状態一覧の部分完了行に同じ意味があるため削除した。遷移条件は変更していない。
      cause:
        type: document
    - location: 1. 概要、実装エビデンスと未作成の先行辞書に関する段落、および5. 今後の検討メモの M-04
      category: table-prose
      action: retain
      reason: 概要は業務整合が未確認であることと `based_on` が空である根拠、M-04 は辞書作成・照合・承認の担当と完了条件を担う。判断と後続作業に必要なため保持した。
      cause:
        type: document
    - location: 3. 状態遷移図、二図の共有状態と4. 遷移の説明との対応
      category: repetition
      action: retain
      reason: 図と遷移表は全体像と詳細の対応に必要。6状態・11遷移でも試行中への接続数が6を超えるため二図を保持し、共有状態・遷移範囲の説明も残した。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md、6.3. 図の分割：一つの業務状態に接続する入出力遷移の合計が6を超える場合の分割と共有状態の指定
    - location: 5. 今後の検討メモ、M-01 の表行と表後の運用案
      category: table-prose
      action: retain
      reason: 表は復旧案の選択肢・影響・承認条件、本文は生存確認、証跡候補、ARC への調査依頼、PO の判断範囲を示す。確定手順が未定である制約を含め、例外時の引き渡しに必要なため保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- stsd-routine-run.md における冗長な記述を整理しました。
- 概要セクションにおいて、判断目的を結果と完了確認・再実行の要否へ集約し、BA・PO の役割分担と ARC・QE・DEV の利用目的を整理しました。
- 状態一覧の判定説明を、2. 状態一覧の成立条件への参照に置き換えることで、本文と表の二重説明を解消しました。
- 実行機会の選択に関する説明を、cron 行の記述との重複を避けるため削除しました。
- 状態遷移の説明において、共通する開始条件や記録更新の説明を、各行の記述から T-02 補足への参照へ集約しました。
- 状態遷移図の保持については、`stsd-mermaid-rulebook.md` のルールに基づき、接続数が閾値を超えるため維持しています。
- 業務整合が未確認である旨の背景および、検討項目 M-01〜M-04 に関する情報は、後続の業務判断に不可欠なため保持しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`: 冗長な説明（繰り返し、表と本文の二重説明、図をなぞる文）を削除・集約・参照に置き換え、意味と必須情報を維持したまま構成を整理しました。

## 3. 申し送り

- 既存の業務承認条件として、検討項目 M-01〜M-04 の解消が引き続き必要。復旧方針、重複起動、旧・欠損記録、先行辞書との整合に関する判断条件は対象文書に保持した。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown 一文書のみで、YAML・YML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の exec plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下への変更がない。）

## 4. 進め方と実践の型の適用

PJR-PT5N で確定した Kata に従い、`stsd-mermaid-rulebook.md` の閾値に基づき図の分割を判断しつつ、1 文書内の冗長さを `delete`（削除）、`merge`（集約）、`reference`（参照への置き換え）によって整理しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `1. 概要、第1段落「結果と確認要否」「状態が一意に分からなければ」` | `repetition` | `merge` | `判断目的を結果と完了確認・再実行の要否へ集約した。利用者、確認・引継ぎの負担軽減、BV-03 との対応を維持した。` | `document` |
| `1. 概要、第2段落の BA・PO の確認分担、および5. 今後の検討メモの最終段落` | `repetition` | `merge` | `BA の辞書照合と PO の正常・例外経路の確認を末尾の業務承認条件へ集約した。概要には BA の状態・遷移の説明責任と ARC・QE・DEV の利用目的を残した。` | `document` |
| `1. 概要、「一意判定」の冒頭2文` | `table-prose` | `reference` | `現在状態の判定説明を2. 状態一覧の成立条件への参照に置き換えた。未実行の結果値を書き込まない制約は T-01 に残し、開始時更新と不正・旧記録の扱いも維持した。` | `document` |
| `1.1. due 判定と実行機会の選択、末尾段落「次回も現在分の一致と処理済み時刻を比較する」` | `table-prose` | `delete` | `同節の cron 行にある現在分と処理済み時刻の比較と重複するため削除した。取りこぼし時に状態・履歴を記録しない制約と T-05 との区別は残した。` | `document` |
| `4. 遷移の説明、T-05 補足「一部の段が成功していてもこの結果になる」` | `repetition` | `delete` | `2. 状態一覧のスキップ行に成功した段を伴う場合も含むと明記され、1.2 の集約優先順も保持されている。同じ実行機会を消化済みとする制約は残した。` | `document` |
| `4. 遷移の説明、T-06・T-07・T-08・T-10・T-11 の補足「開始条件は T-02 と同じ」および T-06 の記録更新説明` | `repetition` | `merge` | `各行の共通説明を表直前の T-02 補足への参照へ集約した。開始条件と記録更新の適用範囲を明記し、再評価・即時再試行・試行中の再開始に関する固有の制約は各行に維持した。` | `document` |
| `4. 遷移の説明、T-09 補足「スキップが含まれていても部分完了を優先する」` | `repetition` | `delete` | `1.2 の集約優先順と2. 状態一覧の部分完了行に同じ意味があるため削除した。遷移条件は変更していない。` | `document` |
| `1. 概要、実装エビデンスと未作成の先行辞書に関する段落、および5. 今後の検討メモの M-04` | `table-prose` | `retain` | ``概要は業務整合が未確認であることと `based_on` が空である根拠、M-04 は辞書作成・照合・承認の担当と完了条件を担う。判断と後続作業に必要なため保持した。`` | `document` |
| `3. 状態遷移図、二図の共有状態と4. 遷移の説明との対応` | `repetition` | `retain` | `図と遷移表は全体像と詳細の対応に必要。6状態・11遷移でも試行中への接続数が6を超えるため二図を保持し、共有状態・遷移範囲の説明も残した。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md、6.3. 図の分割：一つの業務状態に接続する入出力遷移の合計が6を超える場合の分割と共有状態の指定` |
| `5. 今後の検討メモ、M-01 の表行と表後の運用案` | `table-prose` | `retain` | `表は復旧案の選択肢・影響・承認条件、本文は生存確認、証跡候補、ARC への調査依頼、PO の判断範囲を示す。確定手順が未定である制約を含め、例外時の引き渡しに必要なため保持した。` | `document` |
