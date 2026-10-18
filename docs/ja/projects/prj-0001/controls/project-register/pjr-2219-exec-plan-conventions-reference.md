---
specdojo:
  id: prj-0001:pjr-2219-exec-plan-conventions-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:17:43Z"
  due_on: null
---

# PJR-2219 plan の共通の規約を参照にする

## 1. 概要

plan の本文には異常終了の条件と共通の規約の要点だけを残し、詳細は worktree から読める別ファイルを参照させる。PJR-WA3R の決定に基づく

## 2. 完了条件

- plan の本文には、異常終了の条件と、共通の規約のうち守らないと失敗に直結する要点（成果物のリンクの書き方など、数行）だけを残す。
- 共通の規約の詳細は別ファイルにし、plan にはそのパスと、作業を始める前に読むことを書く。
- 参照するファイルが worktree の中から読めることを確かめる。利用者のリポジトリでは原本が `node_modules/specdojo/` の中にあるため、読めない場合は runner が worktree に置く。どちらにしたかを result に書く。
- 要点と詳細の原本は 1 か所にする。要点を詳細から機械的に取り出すか、要点の断片を別に持つかを決めて実装し、理由を result に書く。
- schedule・register・approach のある plan のすべてで、同じ参照の書き方になる。単体テストで、生成した plan に参照のパスと要点が含まれ、詳細の本文が含まれないことを確かめる。
- 既存の plan（履歴）は書き換えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                            | 担当 | 状態 | メモ |
| --- | ------------------------------- | ---- | ---- | ---- |
| 1   | plan の共通の規約を参照へ改める | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wa3r-exec-plan-common-conventions-reference]]（決定）
