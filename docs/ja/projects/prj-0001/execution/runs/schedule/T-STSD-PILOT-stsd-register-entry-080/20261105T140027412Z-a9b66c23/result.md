---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-register-entry-080
  type: exec-result
  task_id: T-STSD-PILOT-stsd-register-entry-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-STSD-PILOT-stsd-register-entry-080/20261105T140027412Z-a9b66c23/plan.md
  started_at: "2026-11-05T14:00:29.529Z"
  completed_at: "2026-11-05T14:14:33.279Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - stsd-register-entry
  condense_records:
    - location: 1. 概要・修正前22行「note は起票済みのまま共有・備忘の記録を更新し続ける」
      category: repetition
      action: delete
      reason: 継続更新は1.1のnote行、状態一覧、4.1の共通条件に残る。終了点を置かない理由と継続状態の判定は保持した。
      cause:
        type: document
    - location: 2. 状態一覧・修正前46行の状態値による判定と未設定・空欄の説明
      category: table-prose
      action: delete
      reason: 1章の一意判定と状態一覧の成立条件に同じ情報がある。open行に読み取り互換の条件を保持した。
      cause:
        type: document
    - location: 2. 状態一覧・修正前46行「担当・期限の未定だけで対応中を否定しない」
      category: repetition
      action: delete
      reason: 4.1の着手・再対応に担当・期限は未定でもよいと明記されている。省略とnullの区別は状態一覧直前に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-02の補足（修正前157行）
      category: repetition
      action: delete
      reason: noteの継続更新と別項目の起票条件は、同節の共通条件および1.1に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-03の補足（修正前158行）
      category: repetition
      action: delete
      reason: 対応経路の記録と担当・期限未定の許容は、着手・再対応の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-04の補足（修正前159行）
      category: repetition
      action: delete
      reason: 共通条件は表の冒頭で全行に適用されており、行内の再案内は不要。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-05、T-13、T-25、T-27の補足
      category: repetition
      action: delete
      reason: 却下理由と完了日時の記録は、終了判断の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-06、T-14、T-26、T-28の補足
      category: repetition
      action: delete
      reason: 延期理由・再評価条件の記録と完了日時を付与しない条件は、終了判断の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-11の補足（修正前166行）
      category: repetition
      action: delete
      reason: 承認者とchange-requestのPR承認証跡は1.1、結論と完了日時は終了判断の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-12の補足（修正前167行）
      category: repetition
      action: delete
      reason: 意思決定者・回答権限者は1.1、結論と完了日時は終了判断の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-15〜T-17の補足
      category: repetition
      action: delete
      reason: 旧結論の保存、履歴への再開理由追記、完了日時の削除は、再開の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-18の補足（修正前173行）
      category: repetition
      action: delete
      reason: 延期理由の保存、再開理由の追記、完了日時の削除は、再開の共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-19〜T-22の補足
      category: repetition
      action: delete
      reason: 終了判断の共通条件に、審査待ちを経由しない場合も確認を省略しない条件がある。各行の直接遷移を保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-23、T-24の補足
      category: repetition
      action: delete
      reason: 待機中からの終了経路は各行に、確認・承認の要件は共通条件に保持した。
      cause:
        type: document
    - location: 4.1. 業務上の条件・T-29〜T-40の補足
      category: repetition
      action: delete
      reason: 再開先ごとの準備条件は共通条件に保持した。直接再開を二段階の遷移と扱わない定義は1章に残り、各行の直接経路も保持した。
      cause:
        type: document
    - location: 4.3. 後続検証へ渡す判定基準・修正前217〜221行
      category: canonical-restatement
      action: reference
      reason: 拒否条件と記録変更の再列挙を4.1・4.2への参照へ集約した。全終端先・再開先の確認、type別分岐、条件不足のfail判定、拒否時の無変更、業務条件とCLIの境界確認は保持した。
      cause:
        type: document
    - location: 3. 状態遷移図と4.1の遷移表に共通するイベント・条件
      category: figure-prose
      action: retain
      reason: 図は俯瞰、遷移表は正本として必要であり、全40遷移を一行ずつ対応させるKata要件を満たすため保持した。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/stsd-rulebook.md §1「状態遷移図は…投影」、§6.4「図にある全遷移を一行ずつ記載」
    - location: 3.1〜3.3の共有状態の宣言
      category: repetition
      action: retain
      reason: 40遷移と状態ごとの入出力数が分割閾値を超える。共有状態の宣言は図の接続に必要であり、三図構成と同じ表示名・内部IDを保持した。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md §3の共有状態宣言、§6.3の分割閾値と共有状態
    - location: 4.1. 業務上の条件・T-07〜T-10の補足
      category: repetition
      action: retain
      reason: 失敗時に残す記録、復旧後の選択、AI成功時の停止点、再審査条件は、各イベント固有の判断に必要なため保持した。
      cause:
        type: document
    - location: 4.2. 現行制約との対応
      category: canonical-restatement
      action: retain
      reason: 4.1の業務上の義務とCLIが強制する範囲には差異がある。承認・理由の省略や直接待機再開などの境界を判断できるよう保持した。
      cause:
        type: document
    - location: 5. 今後の検討メモ・M-01、M-04
      category: unneeded-background
      action: retain
      reason: 未承認経路、依存不足、決定者・時期、次の行動、完了条件、設計・テストの確定を留保する条件を含むため保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書の重複説明を共通条件へ集約しました。
- 8状態・40遷移、承認条件、例外、CLI制約、未解決事項の必須情報を保持し、整形と差分検査を完了しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md`: 冗長な記述を削除・集約しました。具体的には、1章および2章における状態の判定条件や担当・期限に関する重複説明を削除し、4.1の共通条件へ集約しました。また、4.1における各遷移（T-02〜T-40）の個別補足についても、共通条件への集約により冗長さを排除しました。一方で、状態遷移図と遷移表の対応関係を維持するための図に関する記述や、状態ごとの共有状態の宣言、および業務上の重要な判断に必要な補足事項は、Kataの要件に基づき保持しています。

## 3. 申し送り

- 既存の M-01 は保持。業務条件と CLI の差異・未承認経路について PO・ARC・QE が方針を判断し、PM が登録簿と Schedule へ接続する。
- 既存の M-04 は保持。業務データ辞書の作成後、BA が用語を照合し、許可された `based_on` を追加する。
- 適用外の検証: `npm run validate:schema:file`（変更対象はMarkdownのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル、既存plan、resultを変更していない。）

## 4. 進め方と実践の型の適用

重複する説明（`repetition`）、表と本文の二重説明（`table-prose`）、図をなぞる文（`figure-prose`）を特定し、それらを削除・集約または既存の正本への参照に置き換えました。判断に不可欠な背景・制約・例外・完了条件は、内容の整合性を保ったまま保持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `1. 概要・修正前22行「note は起票済みのまま共有・備忘の記録を更新し続ける」` | `repetition` | `delete` | `継続更新は1.1のnote行、状態一覧、4.1の共通条件に残る。終了点を置かない理由と継続状態の判定は保持した。` | `document` |
| `2. 状態一覧・修正前46行の状態値による判定と未設定・空欄の説明` | `table-prose` | `delete` | `1章の一意判定と状態一覧の成立条件に同じ情報がある。open行に読み取り互換の条件を保持した。` | `document` |
| `2. 状態一覧・修正前46行「担当・期限の未定だけで対応中を否定しない」` | `repetition` | `delete` | `4.1の着手・再対応に担当・期限は未定でもよいと明記されている。省略とnullの区別は状態一覧直前に保持した。` | `document` |
| `4.1. 業務上の条件・T-02の補足（修正前157行）` | `repetition` | `delete` | `noteの継続更新と別項目の起票条件は、同節の共通条件および1.1に保持した。` | `document` |
| `4.1. 業務上の条件・T-03の補足（修正前158行）` | `repetition` | `delete` | `対応経路の記録と担当・期限未定の許容は、着手・再対応の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-04の補足（修正前159行）` | `repetition` | `delete` | `共通条件は表の冒頭で全行に適用されており、行内の再案内は不要。` | `document` |
| `4.1. 業務上の条件・T-05、T-13、T-25、T-27の補足` | `repetition` | `delete` | `却下理由と完了日時の記録は、終了判断の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-06、T-14、T-26、T-28の補足` | `repetition` | `delete` | `延期理由・再評価条件の記録と完了日時を付与しない条件は、終了判断の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-11の補足（修正前166行）` | `repetition` | `delete` | `承認者とchange-requestのPR承認証跡は1.1、結論と完了日時は終了判断の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-12の補足（修正前167行）` | `repetition` | `delete` | `意思決定者・回答権限者は1.1、結論と完了日時は終了判断の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-15〜T-17の補足` | `repetition` | `delete` | `旧結論の保存、履歴への再開理由追記、完了日時の削除は、再開の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-18の補足（修正前173行）` | `repetition` | `delete` | `延期理由の保存、再開理由の追記、完了日時の削除は、再開の共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-19〜T-22の補足` | `repetition` | `delete` | `終了判断の共通条件に、審査待ちを経由しない場合も確認を省略しない条件がある。各行の直接遷移を保持した。` | `document` |
| `4.1. 業務上の条件・T-23、T-24の補足` | `repetition` | `delete` | `待機中からの終了経路は各行に、確認・承認の要件は共通条件に保持した。` | `document` |
| `4.1. 業務上の条件・T-29〜T-40の補足` | `repetition` | `delete` | `再開先ごとの準備条件は共通条件に保持した。直接再開を二段階の遷移と扱わない定義は1章に残り、各行の直接経路も保持した。` | `document` |
| `4.3. 後続検証へ渡す判定基準・修正前217〜221行` | `canonical-restatement` | `reference` | `拒否条件と記録変更の再列挙を4.1・4.2への参照へ集約した。全終端先・再開先の確認、type別分岐、条件不足のfail判定、拒否時の無変更、業務条件とCLIの境界確認は保持した。` | `document` |
| `3. 状態遷移図と4.1の遷移表に共通するイベント・条件` | `figure-prose` | `retain` | `図は俯瞰、遷移表は正本として必要であり、全40遷移を一行ずつ対応させるKata要件を満たすため保持した。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/stsd-rulebook.md §1「状態遷移図は…投影」、§6.4「図にある全遷移を一行ずつ記載」` |
| `3.1〜3.3の共有状態の宣言` | `repetition` | `retain` | `40遷移と状態ごとの入出力数が分割閾値を超える。共有状態の宣言は図の接続に必要であり、三図構成と同じ表示名・内部IDを保持した。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md §3の共有状態宣言、§6.3の分割閾値と共有状態` |
| `4.1. 業務上の条件・T-07〜T-10の補足` | `repetition` | `retain` | `失敗時に残す記録、復旧後の選択、AI成功時の停止点、再審査条件は、各イベント固有の判断に必要なため保持した。` | `document` |
| `4.2. 現行制約との対応` | `canonical-restatement` | `retain` | `4.1の業務上の義務とCLIが強制する範囲には差異がある。承認・理由の省略や直接待機再開などの境界を判断できるよう保持した。` | `document` |
| `5. 今後の検討メモ・M-01、M-04` | `unneeded-background` | `retain` | `未承認経路、依存不足、決定者・時期、次の行動、完了条件、設計・テストの確定を留保する条件を含むため保持した。` | `document` |
