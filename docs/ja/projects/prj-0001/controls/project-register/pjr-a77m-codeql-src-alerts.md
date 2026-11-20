---
specdojo:
  id: prj-0001:pjr-a77m-codeql-src-alerts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-19T22:05:49Z"
  due_on: null
  derived_from:
    - PJR-P318
---

# PJR-A77M CodeQL が見つけた src の 5 件を直す

## 1. 課題内容

CodeQL が PR #34 で出した src の alert 5 件を直す。trash.ts の正規表現への local_id の埋め込み、change-scope.ts の ReDoS、repo-trace.ts と dashboard/shared.ts の表のセルのエスケープ、exec/shared.ts の何もしない replace

## 2. 入力

- 利用者の決定（2026-11-20）: 案 A。0.9.0 はこのまま出し、src の 5 件は 0.9.1 で直す。テストの 3 件は理由を付けて dismiss する
- orchestrator の調べ（2026-11-20）: high js/regex-injection src/deliverable/trash.ts:90、high js/redos src/exec/run/change-scope.ts:234、high js/incomplete-sanitization src/exec/repo-trace.ts:135 と src/dashboard/shared.ts:16、medium js/identity-replacement src/exec/shared.ts:23
- orchestrator の見立て（2026-11-20）: どれも利用者が自分のリポジトリで動かす CLI への入力に関するもので、外からの攻撃の経路は見当たらない。0.9.0 で入れた変更ではなく、既存のコードが初めて解析されたもの

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
