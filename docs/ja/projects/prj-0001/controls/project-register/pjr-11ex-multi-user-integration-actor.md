---
specdojo:
  id: prj-0001:pjr-11ex-multi-user-integration-actor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T04:11:05Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-PQG3
  commit_type: docs
  commit_scope: standards
---

# PJR-11EX 複数人で develop を使うときの統合専用 actor の仕組みを決める

## 1. 確認事項

branch protection を入れたあと、exec の統合と register の記帳を develop へ push する統合専用 actor をどう用意するか（決まった 1 台の bot か、各自の runner に資格を持たせるか）を決める

## 2. 入力

- git-branching-standard は、複数人・複数 actor 運用で develop の branch protection、層 2 の Pull Request、統合専用 actor（exec の merge と register の記帳だけに bypass を許可）を必須としている（2026-11-03）
- 今は exec の統合と register の記帳が手元の develop に commit され、利用者が手で push している。branch protection を入れると人の push は拒否されるため、統合専用 actor の資格で push する仕組みが要る（2026-11-03）
- 運用上の注意として、同じ項目や schedule タスクを 2 人が流さないための調整（実行のロックはクローンごと）と、sch-milestones.yaml・tml-index.yaml・`dct-*.yaml`・CHANGELOG.md のような共有ファイルの衝突がある（2026-11-03）
- 利用者は、複数人の運用に移る前に決める question として起票することを選んだ（2026-11-03）

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
