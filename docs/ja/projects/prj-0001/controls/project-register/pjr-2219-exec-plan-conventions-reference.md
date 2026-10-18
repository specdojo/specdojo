---
specdojo:
  id: prj-0001:pjr-2219-exec-plan-conventions-reference
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:17:43Z"
  due_on: null
  completed_at: "2026-10-18T08:12:10Z"
  conclusion: plan の本文には、共通の規約の断片の印で囲んだ要点と、詳細の参照パス・作業前に読む指示だけを載せるようにした。要点は詳細から機械的に取り出し、原本は断片の 1 か所。印のない断片は全文を載せる。参照先は利用者のリポジトリでは node_modules/specdojo の中で、worktree の npm ci で読める
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

| No  | 作業                            | 担当 | 状態 | メモ                    |
| --- | ------------------------------- | ---- | ---- | ----------------------- |
| 1   | plan の共通の規約を参照へ改める | DEV  | open | 実施済み（review 待ち） |

## 4. 対応結果

- 実施内容:
  - 共通の規約の断片 `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を詳細の原本とし、失敗に直結する要点（result の記入、プレースホルダを残さない、リンク記法と表内エスケープ、未作成文書の仮置き、`_` を含む識別子のインラインコード化、`status` を `ready` にしない、相対パス指定、YAML の schema）を `plan-essentials` マーカーの間に集めた。
  - `injectCommonConventions`（`src/exec/plans-core.ts`）は、見出し・詳細の参照パスと作業前に読む指示・要点だけを plan に載せる。review plan では従来どおり review の判断手順も載せる。マーカーの無い断片は従来どおり全文を載せる。
  - schedule・register・job の plan はすべて同じ関数を通るため、同じ参照の書き方になる。
- 判断:
  - 要点は詳細から機械的に取り出す方式を採った。要点の断片を別に持つと、同じ規則が 2 か所に分かれ、詳細を読む agent が要点を見落とすため。
  - 参照パスは `specdojoReferencePath` で利用者リポジトリからの相対パスにする（npm で導入した場合は `node_modules/specdojo/...`）。worktree の準備で `npm ci` を実行するため、worktree の中から読める。runner が worktree に置く処理は追加していない。ただし、`package-lock.json` を追跡していないリポジトリでは worktree に依存が入らないため、参照先が読めない。
- 成果物: `src/exec/plans-core.ts`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`、`tests/src/exec/plans.test.ts`、`tests/src/exec/register-plan-escape.test.ts`、`CHANGELOG.md`。
- 残課題: `package-lock.json` を追跡していないリポジトリで参照先を worktree に置くかは、必要になった時点で判断する。既存の plan（履歴）は書き換えていない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wa3r-exec-plan-common-conventions-reference]]（決定）
