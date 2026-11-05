---
specdojo:
  id: prj-0001:pjr-fma4-evidence-secret-redaction
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-05T22:17:51Z"
  derived_from:
    - PJR-2WC2
---

# PJR-FMA4 実行記録へ書く前の伏せ字を広げ、秘密の混入を検査する

## 1. 概要

生のログを全文残すため、redactSensitiveText の対象を広げ、commit の hook か CI で実行記録への秘密の混入を検査する

## 2. 入力

- 由来: PJR-2WC2 で生のログを全文 Git に残すと決めた。push 先は github.com/specdojo/specdojo で、記録は push される（2026-11-06）
- orchestrator の調査: 追跡中の実行記録（evidence 3,099 件と plans・results・trials・events）に API キー・トークン・秘密鍵・個人のメールアドレスは見つからなかった。`[REDACTED]` は 1 件（2026-11-06）
- orchestrator の調査: `src/shared/text.ts` の `redactSensitiveText` が伏せるのは `Bearer …`、`sk-…`・`gh?_…`、`password=…` などの「名前=値」だけ。AWS・Google・Slack のキー、JWT、秘密鍵、URL に埋め込まれた認証情報は対象外（2026-11-06）
- 委任: 検査に gitleaks などの道具を使うか自前の検査を足すかは executor が選び、理由を個票の対応結果に記録する。`package.json` や hook の設定など保護された設定の変更は、案を個票の対応結果に書き、反映は利用者の承認のもとで行う（2026-11-06）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
