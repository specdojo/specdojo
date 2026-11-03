---
specdojo:
  id: prj-0001:pjr-fyn5-resume-executor-claim-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T12:53:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-FYN5 executor から再開して executor を替えると統合の前に止まる

## 1. 課題内容

exec resume --resume-from executor --executor-by で別の agent に替えても claim が元の agent のまま残り、完了の前の確認で「別の actor が作業中」として止まる

## 2. 入力

- 2026-11-03 に T-DATA-FLOW-UC-REWRITE-cdfd-uc-schedule-020 を opus-executor の claim のまま exec resume --resume-from executor --executor-by sol-executor で再開したところ、executor・親の検証・reporter は通ったが、「completion preflight failed: task is being worked on by another actor: opus-executor」で統合の前に止まった
- その後、--executor-by なしの exec resume --task で再開すると、claim の持ち主の opus-executor で executor から流し直して完了した（2026-11-03）
- 直し方の案: executor を替えて再開するときは claim を新しい agent へ移す（release と claim の event を残す）、または完了の確認で再開時に指定した executor を許す。PJR-RKHR で入れた --resume-from executor の動きに関わる（2026-11-03）

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
