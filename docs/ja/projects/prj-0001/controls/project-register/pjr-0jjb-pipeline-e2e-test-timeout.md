---
specdojo:
  id: prj-0001:pjr-0jjb-pipeline-e2e-test-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T02:21:23Z"
  due_on: null
---

# PJR-0JJB pipeline-e2e の統合テストが負荷で 20 秒の上限を超えて親の検証を落とす

## 1. 課題内容

tests/src/exec/pipeline-e2e.integration.test.ts の再開のテストは 1 件あたり約 2 秒で、単独なら 16 件が 36 秒で通るが、テストの中で 20 秒の上限を指定しているため、並行の run やローカル LLM と重なると上限を超える。2026-10-18 に BHMH・FXPH・H06F・JSEY の親の検証や統合の hook がこれで落ちた。W2EB の統合テスト全体の 30 秒の上限も、テストの中の指定で上書きされている

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
