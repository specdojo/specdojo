---
specdojo:
  id: prj-0001:pjr-8c6e-branch-guide-product-section-fixes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T15:12:21Z"
  completed_at: "2026-10-18T16:05:04Z"
  conclusion: branch-workflow-guide の 10 の節で、GitHub flow の例を feature/`<topic>` に直し、内部の事情（派生項目として起票中）と登録簿への参照を消し、git log の例を仮の値にした。ほかの記述は変えていない
  derived_from:
    - PJR-WJE6
---

# PJR-8C6E ブランチ運用ガイドのプロダクトリポジトリの節の誤りを直す

## 1. 概要

WJE6 で足した branch-workflow-guide の「10. プロダクトリポジトリの統合先を指定する」に、GitHub flow の統合先の例が main になっている誤り、プロジェクトの内部の事情（派生項目として起票中）と登録簿の項目への参照、実在の項目 ID を使った git log の例が残っている。配布するガイドなので、利用者の環境で意味が通る形に直す

## 2. 完了条件

- [[specdojo:branch-workflow-guide]] の「10. プロダクトリポジトリの統合先を指定する」で、次の 4 点だけを直す。ほかの節と、10 の節のほかの記述は変えない。
  - 冒頭の段落の末尾の、登録簿の項目への参照 `（[[prj-0001:pjr-zdvq-product-repo-branch-strategy]]）` を消す。文はそのまま残す。
  - 10.1 の表の GitHub flow の行で、`repos[].integration_branch` の指定例を「トピックのブランチ名（例: `main`）」から「トピックのブランチ名（例: `feature/<topic>`）」に改める。
  - 10.1 の表の下の段落の「（これは派生項目として起票中）」を消し、文として通るように直す（例: 「GitHub flow では、トピックごとに `integration_branch` を書き換えて使います。」）。
  - 10.3 の `git log --grep` の例の `Refs: prj-0001:PJR-WJE6` を `Refs: <project-id>:<item-id>` に改める。
- `npx prettier --check` と `npm run lint:md` が通る。
- CHANGELOG には記載しない。

## 3. 作業内容

| No  | 作業                | 担当 | 状態 | メモ |
| --- | ------------------- | ---- | ---- | ---- |
| 1   | ガイドの 4 点を直す | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wje6-product-repo-branch-guide]]（元の項目）
- [[specdojo:branch-workflow-guide]]（対象）
