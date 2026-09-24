---
specdojo:
  id: prj-0001:pjr-xtan-unify-verdict-vocabulary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-24T14:01:35Z"
  due_on: "2026-10-31"
---

# PJR-XTAN 判定語彙を verdict_definitions へ統一する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.3 を実装する。同じ「判定」を 4 つの語彙で表している状態を解消する。

| 使用箇所                                             | 現在の語彙                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `pm-review-viewpoints.yaml` の `verdict_definitions` | `pass` / `conditional_pass` / `changes_requested` / `blocked` |
| grade の文書 verdict                                 | `pass` / `needs-work` / `fail`                                |
| `xrr-template.md` の `decision.recommendation`       | `approve` / `revise` / `reject`                               |
| `xrr-viewpoint-detail-template.md` の `result`       | `pass` / `fail` / `unclear`                                   |

`verdict_definitions` が正本として存在するにもかかわらず、result テンプレート 2 種は従っていない。`revise` が `conditional_pass` と `changes_requested` のどちらか、`unclear` が `blocked` かは明文化されていない。

`severity_levels`（`blocker` / `major` / `minor` / `note`）は正本が 1 つで grade も従っており、良い前例になっている。

## 2. 完了条件

- grade の文書 verdict が `pass` / `conditional_pass` / `changes_requested` になっている。`blocked` は grade が付けない。
- 対応は `fail` → `changes_requested`、`needs-work` → `conditional_pass`、`pass` は据え置きとする。**判定条件そのものは変えない**（blocker の有無、major の有無、加重スコアの現行ロジックを維持する）。
- `xrr-template.md` の `decision.recommendation` と `xrr-viewpoint-detail-template.md` の `result` が `verdict_definitions` の値を使う。
- sidecar の schema（`grade-result.schema.yaml`）の enum が更新されている。
- 既存の grade 結果 260 件が移行されている。`grade migrate` を使うか、同等の移行経路を用意する。
- `grade list --verdict` の引数が新しい値を受け取る。旧値を渡した場合はエラーメッセージで新値を示す。
- dashboard の表示が新しい語彙になっている。
- 語彙の対応と移行を検証する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                         |
| --- | ---------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | grade の verdict 型と判定結果の語彙を変更する        | DEV  | open | 判定条件は変えない           |
| 2   | schema の enum を更新する                            | DEV  | open | `grade-result.schema.yaml`   |
| 3   | 既存 260 件の移行経路を用意して実行する              | DEV  | open | `grade migrate` の前例がある |
| 4   | `grade list --verdict` と dashboard を追従させる     | DEV  | open | 旧値は分かるエラーにする     |
| 5   | `xrr-*` テンプレート 2 種を `verdict_definitions` へ | DEV  | open | 観点別と総合の両方           |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-kcmh-review-grade-verdict]]
- [[prj-0001:pjr-td1g-grade-review-record-structure]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `src/grade.ts`
