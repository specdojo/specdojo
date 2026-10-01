---
specdojo:
  id: prj-0001:pjr-0waa-multi-repo-integration-resume
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:55Z"
  block_reason: rate limit reached
---

# PJR-0WAA 複数リポジトリの統合と再開

## 1. 概要

commit 対象の算出と統合をリポジトリごとに行い、宣言順（プロダクト先行）で統合する。統合済みの範囲を pipeline state に記録し、失敗した位置から再開する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- 統合の前に、全リポジトリで commit 対象の算出と merge 可否を確かめる。いずれかで不可なら、どのリポジトリも統合しない。
- 宣言順にプロダクトを統合し、最後にプロジェクトを統合する。commit 対象の算出と統合をリポジトリごとに行う。
- `stages.integrate` の下にリポジトリ別の状態（統合済みか、commit、時刻）を任意項目で記録し、旧形式の pipeline state を読める。
- 途中で失敗したら `waiting` に戻し、統合済みと未統合のリポジトリを `block_reason` に書く。`--resume` で統合済みのリポジトリを飛ばし、失敗した位置から再開する。
- プロダクトが 2 つの構成で、1 つ目・2 つ目・プロジェクトのそれぞれで失敗したときの部分状態と再開を、実 Git を使う統合テストで確かめる。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 事前検査                                 | DEV  | open | -    |
| 2   | 宣言順の統合とリポジトリ別の commit 対象 | DEV  | open | -    |
| 3   | pipeline state のリポジトリ別記録と再開  | DEV  | open | -    |
| 4   | 失敗位置ごとの統合テスト                 | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
