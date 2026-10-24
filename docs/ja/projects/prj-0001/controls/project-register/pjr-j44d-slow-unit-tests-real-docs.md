---
specdojo:
  id: prj-0001:pjr-j44d-slow-unit-tests-real-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-24T22:18:14Z"
  derived_from:
    - PJR-68KR
---

# PJR-J44D 本リポジトリの文書を丸ごと使う単体テストが時間切れで毎回落ちる

## 1. 課題内容

doc-index.test.ts の登録簿の参照の解決のテストが docs を丸ごと一時のディレクトリへコピーして索引を作るため、文書が増えて単独でも 24 秒かかり上限の 20 秒を超える。register-plan-escape.test.ts の成果物の approach のテストも 5〜15 秒かかり上限の 5 秒の前後にある。develop の test-unit が毎回失敗し、すべての run の親の検証が止まる

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
