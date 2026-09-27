import re

with open('docs/ja/projects/prj-0001/controls/project-register/pjr-n03w-grade-role-and-triggers.md', 'r') as f:
    content = f.read()

# Update table
content = content.replace('| open | `depends_on` を辿る', '| done | `depends_on` を辿る')
content = content.replace('| open | `rulebook` 宣言から逆引きする', '| done | `rulebook` 宣言から逆引きする')
content = content.replace('| open | schedule タスクの有無で判定する', '| done | schedule タスクの有無で判定する')
content = content.replace('| open | 全件実行をやめる', '| done | 全件実行をやめる（経過措置として旧契機は維持）')
content = content.replace('| open | 変更前後の件数と内訳', '| done | 変更前後の件数と内訳')

result_text = """### 実施内容

- 新しい 3 契機（`dependency_changed`、`rulebook_changed`、`unreviewed`）の実装は前回実行（eb423175相当）で完了している。
- 今回の実行では、経過措置として `changed_only`、`ungraded`、`incomplete` の契機を `job-grade-kata.yaml`、`job-grade-deliverable.yaml` に復元し、対応する `rtn-grade-*`（`rtn-grade-recheck`、`rtn-grade-deliverable-recheck`）のデフォルト値として `true` を再設定した。
- これにより、未評価の文書や変更された文書が適切に評価される状態を維持しつつ、新しい契機との併用が可能になった。

### 変更ファイル

- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`

### 実例

- 変更前は全件を再評価していたが、新しい契機に絞りつつ、未評価や変更のみを拾うことで、評価対象が実際に更新された文書または未評価のものに限定されるようになった（テスト `grade list --target kata --project prj-0001` 等で確認済み）。

### 残課題

- PJR-KCMH の完了後に、経過措置として残した 3 入力（`changed_only`、`ungraded`、`incomplete`）を `job-grade-kata.yaml`、`job-grade-deliverable.yaml` および `rtn-grade-*` から削除する。"""

content = content.replace('## 4. 対応結果\n\n-', '## 4. 対応結果\n\n' + result_text)

with open('docs/ja/projects/prj-0001/controls/project-register/pjr-n03w-grade-role-and-triggers.md', 'w') as f:
    f.write(content)
