---
specdojo:
  id: prj-0001:pjr-wzyw-agent-members-onboarding-gap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T12:38:03Z"
  due_on: null
---

# PJR-WZYW agent の定義の分離が、新しい利用者の導入の経路に追従していない

## 1. 課題内容

公開物（npm pack の tarball）での実地の確認（2026-10-08）で判明。(1) loadMemberRoster は project に members_path がないと何も読まずに返すため、config init の既定の設定では .specdojo/agent-members.yaml の agent が読まれず、exec で agent を使えない。(2) templates の codex・copilot・antigravity の README と pm-members-snippet.yaml が、agent の定義を pm-members.yaml へ書くよう案内したままで、そのとおりにすると読み込みがエラーになる。(3) 名簿の schema 違反などの読み込みのエラーを exec run が「agent nickname not found」とだけ表示し、原因が利用者に伝わらない。

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
