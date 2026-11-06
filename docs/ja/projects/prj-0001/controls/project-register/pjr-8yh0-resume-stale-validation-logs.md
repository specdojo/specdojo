---
specdojo:
  id: prj-0001:pjr-8yh0-resume-stale-validation-logs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T23:21:32Z"
  derived_from:
    - PJR-TA6W
---

# PJR-8YH0 executor から再開した run に前回の親の検証のログが元の名前で残る

## 1. 課題内容

再開の前の試行の退避が写しを作るだけで元のログを残すため、成功した再開の run に、失敗した前回の親の検証のログが今回の名前のまま commit される

## 2. 入力

- PJR-TA6W の executor からの再開（commit fe25cef49）。run のディレクトリに parent-validation-attempt-1-lint-fm.log と parent-validation-attempt-1-test-integration.log が残り、中身は退避の写し（`*.attempt-1.log`）と同じで exit code 1 を示す。再開後の親の検証はすべて passed で、evidence.json の `log_refs` はこれらを参照しない（2026-11-07 orchestrator の確認）
- 原因の見立て: snapshotRunAttempt（src/shared/run-records.ts）は pipeline-state・evidence・ログを `*.attempt-N.*` へ copyFileSync で写すだけで、元のファイルを消さない。親の検証のログは失敗したときだけ書かれるため、成功した再開では上書きされずに前回のものが残る（2026-11-07）

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
