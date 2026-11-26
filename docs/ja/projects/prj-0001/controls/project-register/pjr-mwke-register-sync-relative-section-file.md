---
specdojo:
  id: prj-0001:pjr-mwke-register-sync-relative-section-file
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-26T22:39:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-VM2S
---

# PJR-MWKE register_sync を有効にすると --section-file の相対パスが専用ブランチの作業場所から解決される

## 1. 課題内容

register_sync を有効にした project で register update/add の --section-file に相対パスを渡すと、呼び出し元ではなく専用ブランチの worktree から解決され、Cannot read section file で止まる。呼び出し元の cwd から解決されるようにする。

## 2. 入力

- 2026-11-26、PJR-4EJC の register update --section-file tmp/orchestrator/4ejc-memo.md --commit が Cannot read section file で止まった。絶対パスにすると通った
- 記帳は失われなかった（エラー時に専用ブランチの worktree を保持する案内が出た）
- 相対パスで使えないと困る（indie、2026-11-26）。担当 DEV・期限 2026-11-30 は indie の指示

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
