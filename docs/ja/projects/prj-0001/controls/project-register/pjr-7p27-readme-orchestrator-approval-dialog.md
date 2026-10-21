---
specdojo:
  id: prj-0001:pjr-7p27-readme-orchestrator-approval-dialog
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-20T21:11:25Z"
  completed_at: "2026-10-20T21:51:48Z"
  conclusion: README の「会話で操作する」の例を、何をするか・中身・影響を日本語で示して承認を求める形にし、コマンドは求めたときに見せる説明を加えた
  derived_from:
    - PJR-C50G
---

# PJR-7P27 README の会話例でオーケストレーターが内容を日本語で確かめる形にする

## 1. 概要

README の「会話で操作する」の例では、オーケストレーターがコマンドを見せて「次を実行します。よろしいですか。」と聞いている。0.4.1 のオーケストレーター（PJR-C50G）は、何を・どんな内容で・何に影響するかを日本語で聞く形に変わったため、例をそれに合わせる

## 2. 完了条件

- 0.4.1 の範囲とする（2026-10-21、利用者が承認）。
- `README.md` の「会話で操作する」の例で、オーケストレーターの発言を次の順の日本語で示して「よろしいですか？」と聞く形にする（PJR-C50G で決めたオーケストレーターの「承認の聞き方」）。例では、登録簿を用意して最初の todo を起票する場面を保つ。
  - 何をするかを 1 文で（例: 「登録簿を用意し、todo を 1 件起票します」）。
  - 中身（起票なら種類・タイトル・優先度などの要点）。
  - 影響（作られるファイルと commit の先）。
- 例のすぐ後の説明を、コマンドは既定では見せず、求めたときに見せる、という今の動きに合わせる。状態を変える操作は承認を得てから実行し、`git push` や破壊的な操作は行わないことは残す。
- [[specdojo:orchestrator-operation-guide]] と [[specdojo:quick-start-guide]] に同じ形の会話例（コマンドを見せて承認を聞くもの）があれば、同じ聞き方に合わせる。`# チャット:` で利用者の指示を示す書き方は変えない。
- `npm run lint:md` と `npm run docs:build` が通る。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ         |
| --- | ------------------------------------- | ---- | ---- | ------------ |
| 1   | README の会話例の承認の聞き方を改める | DEV  | done | 0.4.1 の範囲 |

## 4. 対応結果

### 実施内容

- `README.md` の「会話で操作する」の例において、オーケストレーターの発言をコマンドの提示から、何をするか（1文）・中身（要点）・影響（作成ファイルと commit 先）を日本語で示して「よろしいですか？」と承認を求める形に改定した。
- 会話例直後の説明文を、コマンドは既定では見せず求めたときに見せること、状態変更操作は承認を得てから実行し `git push` や破壊的操作を行わないことに合わせた。
- `orchestrator-operation-guide.md` および `quick-start-guide.md` を確認し、コマンドを提示して承認を聞く同じ形の会話例が存在しないことを確認した（`quick-start-guide.md` の `# チャット:` の書式は維持）。
- `CHANGELOG.md` の `## [0.4.1] - 未定` の `### 文書` に変更内容を追記した。

### 成果物

- `README.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-7p27-readme-orchestrator-approval-dialog.md`

### 残課題

- なし。

## 5. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide]]
- prj-0002:PJR-ABMP（LP の会話例を同じ聞き方に合わせる）
