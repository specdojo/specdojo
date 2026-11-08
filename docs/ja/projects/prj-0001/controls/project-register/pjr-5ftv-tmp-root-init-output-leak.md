---
specdojo:
  id: prj-0001:pjr-5ftv-tmp-root-init-output-leak
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-08T15:50:44Z"
  derived_from:
    - PJR-FTRC
---

# PJR-5FTV テストか agent が /tmp の直下に init の出力を残し、ほかのテストを落とす

## 1. 課題内容

/tmp の直下に specdojo init の出力（.markdownlint.yaml・.specdojo/・docs/ja/projects/prj-1234・lefthook.yml など）が残り、/tmp の下に一時ディレクトリを作るテスト（init.test.ts など）が既存の設定を見つけて落ちた。どの処理が残したかを特定し、再発を防ぐ

## 2. 入力

- 2026-11-09 00:25 と 00:33 に作られた。prj-1234 は tests/src/commands/init.test.ts が使う project ID。同じ時間帯に PJR-0F94 の executor（agy）が「空のリポジトリで dashboard build を確かめる」完了条件のために作業していた。どちらが残したかは確かめていない。
- PJR-FTRC の親の検証で test-unit と test-integration が落ち、develop でも同じテストが落ちた。orchestrator が /tmp の直下の出力を消すと init.test.ts の 31 件が通った。/tmp/.git（空、2026-11-05 作成）は残している。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
