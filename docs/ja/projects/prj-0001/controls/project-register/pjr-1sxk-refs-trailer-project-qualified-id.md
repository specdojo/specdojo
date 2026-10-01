---
specdojo:
  id: prj-0001:pjr-1sxk-refs-trailer-project-qualified-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-01T03:53:15Z"
---

# PJR-1SXK Refs trailer の ID を <project-id>:<item-id> に修飾する

## 1. 背景

commit message の `Refs:` trailer は、登録簿の ID（`PJR-XXXX`）だけで書いてきた。登録簿の ID はプロジェクトごとに乱数で振るため、プロジェクトの中でしか一意ではない。1 つのプロジェクトリポジトリには複数のプロジェクトを置ける。また、別リポジトリ構成（既定）では、プロダクトリポジトリの履歴から登録簿の項目へたどるときに、どのプロジェクトの項目かを特定できない。

文書の ID（`prj-0001:pjr-36qg-...`）と exec の worktree・branch 名は、すでにプロジェクトで修飾している。

## 2. 検討した選択肢

| 選択肢 | 内容                                                    | 利点                                         | 懸念                                                         |
| ------ | ------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| A      | 現状のまま `Refs: PJR-XXXX`                             | 短く、過去の履歴と同じ書式                   | 複数プロジェクトやプロダクトリポジトリから所属を特定できない |
| B      | プロダクトリポジトリだけ `Refs: <project-id>:<item-id>` | プロジェクトリポジトリ内の書式を変えずに済む | 2 つの書式が混在し、複数プロジェクトの曖昧さが残る           |
| C      | 両方のリポジトリで `Refs: <project-id>:<item-id>`       | 書式が 1 つになり、文書の ID とも一貫する    | 過去の履歴の書式と異なる                                     |

## 3. 決定内容

- 選択肢 C を採択する。`Refs:` trailer の値は `<project-id>:<item-id>`（例: `Refs: prj-0001:PJR-36QG`）とする。
- プロダクトリポジトリとプロジェクトリポジトリの両方に適用する。1 つの commit が複数の項目に関わる場合は、`Refs:` を項目ごとに 1 行ずつ書く。
- 過去の commit の `Refs: PJR-XXXX` は書き換えない。検索するときは、修飾形と修飾なしの両方を対象にする。
- プロダクトリポジトリから参照される project-id は、別々のプロジェクトリポジトリの間で重ならないよう、意味のある名前（例: `app1`）にすることを guide で勧める。

## 4. 採択理由

- 登録簿の ID はプロジェクト内でのみ一意であり、修飾しなければ複数プロジェクトの構成で参照が曖昧になる。
- 文書の ID と exec の worktree・branch 名がすでにプロジェクトで修飾しており、`Refs:` だけを例外にする理由がない。
- 書式を 1 つにすると、`git log --grep` による追跡とツールでの自動付与の実装が単純になる。

## 5. 承認

| 項目     | 内容                                |
| -------- | ----------------------------------- |
| 決定者   | 利用者（orchestrator の提案を承認） |
| 決定日   | 2026-10-01                          |
| 承認方式 | commit                              |
| 証跡     | 本個票を close する commit          |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| 影響範囲   | commit message の書式、orchestrator の定義、`docs-structure-guide` の「result によるトレーサビリティ」 |
| 必要な対応 | orchestrator の定義を修飾形へ直す。guide の書式・`git log --grep` の例は PJR-30SW で直す               |
| 追跡先     | [[prj-0001:pjr-30sw-multi-repo-refs-trace]]                                                            |

## 7. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
- [[specdojo:docs-structure-guide]]
