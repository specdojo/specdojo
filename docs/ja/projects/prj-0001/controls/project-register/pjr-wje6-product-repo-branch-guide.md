---
specdojo:
  id: prj-0001:pjr-wje6-product-repo-branch-guide
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-10-12T08:53:52Z"
  due_on: "2026-10-31"
---

# PJR-WJE6 ブランチワークフローガイドにプロダクトリポジトリの節を加える

## 1. 概要

PJR-ZDVQ の決定にもとづき、プロダクトリポジトリにはブランチ戦略を求めず、プロダクト側のルールで決めた統合先（integration_branch）を指定することを書く。GitHub flow と git flow での選び方の例と、merge の方式ごとの Refs: の残り方を示す

## 2. 完了条件

- [[specdojo:branch-workflow-guide]] に、プロダクトリポジトリの節がある。次を含む。
  - SpecDojo はプロダクトリポジトリにブランチ戦略を求めず、プロダクト側のルールで決めた統合先を `repos[].integration_branch` に指定すること。ブランチ名に project ID を入れる必要はないこと。
  - GitHub flow（トピックのブランチを統合先にし、`main` へは PR で取り込む）と git flow（`develop` を統合先にする）での選び方の例。
  - merge の方式（merge commit・rebase merge・squash merge）ごとの `Refs:` と SHA の残り方。squash merge では `Refs:` を残す設定にすること。
  - 追跡は trace key（`Refs: <project-id>:<item-id>`）を主にし、`git log --grep` で辿れること。
- 既存の節（プロジェクトリポジトリの `develop` から `main` への統合）と矛盾しない。
- `npm run lint:md` が通る。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                                                         |
| --- | ------------------------------ | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | プロダクトリポジトリの節を書く | BA   | done | [[specdojo:branch-workflow-guide]] の `## 10. プロダクトリポジトリの統合先を指定する` を追加 |

## 4. 対応結果

- [[specdojo:branch-workflow-guide]] に `## 10. プロダクトリポジトリの統合先を指定する` を追加。既存の `## 10. 作業前後のチェックリスト` は `## 11.` に順延した。
- 節の内容: SpecDojo はプロダクトリポジトリにブランチ戦略を求めず、プロダクト側のルールで決めた統合先を `repos[].integration_branch` に指定すること。ブランチ名に project ID を入れる必要はないこと。GitHub flow（トピックのブランチを統合先にし、`main` へは PR で取り込む）と git flow（`develop` を統合先にする）での選び方の例を、`integration_branch` の指定例として示した。merge の方式（merge commit・rebase merge・squash merge）ごとの `Refs:` と SHA の残り方を表で示し、squash merge では `Refs:` を残す設定にすることを明記した。追跡は trace key（`Refs: <project-id>:<item-id>`）を主にし、`git log --grep` で辿れることを示した。
- 既存の節（プロジェクトリポジトリの `develop` から `main` への統合）と矛盾しない。プロジェクトリポジトリ向けの手順はそのまま維持し、プロダクトリポジトリの節は別セクションとして加えた。
- 未完成: むしろ完了。残課題なし。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: 派生元の決定。
- [[specdojo:branch-workflow-guide]]: 追記先。
- [[specdojo:specdojo-config-reference]]: `repos[].integration_branch`。
