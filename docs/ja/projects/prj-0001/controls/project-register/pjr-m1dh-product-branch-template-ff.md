---
specdojo:
  id: prj-0001:pjr-m1dh-product-branch-template-ff
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-31T02:43:00Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
    - PJR-Z7GX
---

# PJR-M1DH プロダクトのリポジトリの作業ブランチの名前を設定で選べるようにし、早送りの統合を足す

## 1. 概要

`repos[].branch_template` で作業ブランチの名前を選べるようにし、run と作業ブランチの対応を runner の記録で持ち、名前の重なりを run の開始時に検査し、統合の形に `ff` を足す。

## 2. 入力

- PJR-BNMV の決定: `repos[].branch_template`（既定は exec/{project}-{id}、例: git-flow は feature/{topic}、GitHub flow は {type}/{topic}）。{id} も {topic} も含まないテンプレートは設定エラー
- ブランチ名が別の項目のものとしてあれば run の開始時に止め、topic を変えるか --branch で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける
- runner は作業ブランチの名前が exec/ で始まることを前提に worktree の片付けや再開をしている（src/exec/worktree-ops-lifecycle.ts など）。run と作業ブランチの対応は、名前の接頭辞ではなく runner の記録で持つ
- 統合の形に ff（merge commit を作らず早送りで積む）を足す。既存の merge・branch-only は変えない

## 3. 完了条件

- `specdojo.config.json` の `repos[]` に任意の `branch_template` を足し、schema と設定の検証を更新する。変数は PJR-Z7GX と同じ（`{branch}`・`{target}` を除く）。`{id}` も `{topic}` も含まないテンプレートと、git のブランチ名として不正になるテンプレートは設定エラーにする。既定は今と同じ `exec/{project}-{id}`。
- プロダクトのリポジトリの作業ブランチをテンプレートの名前で作る。SpecDojo の記録のリポジトリの作業ブランチ（`exec/...`）は変えない。
- run と作業ブランチの対応を、ブランチ名の接頭辞ではなく runner の記録（pipeline の状態や worktree の記録など、置き場所は executor が決める）で持つ。再開（`--resume`）、片付け（`exec worktree prune` など）、`branch-only` で残すブランチの扱いが、テンプレートの名前でも今と同じに動くようにする。
- run の開始時に、作ろうとするブランチ名が別の項目のものとしてあれば止め、topic を変えるか `exec run` の新しい `--branch <repo>=<name>` で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける。
- `repos[].integration_strategy` に `ff` を足す。統合先を作業ブランチの先へ早送りし、早送りできない場合は止めて理由を出す（rebase はしない）。既存の `merge`・`branch-only` は変えない。
- 統合テストを足す。対象は、テンプレートの名前での run・再開・片付け、別の項目と名前が重なったときの停止、`--branch` での指定、`ff` での統合と早送りできない場合の停止、設定がない場合の互換。
- runner の動きが変わるため、統合の後に PJR-JSEY を流して確かめる前提で、本個票の対応結果に確かめ方を書く。
- 設定リファレンスと command-reference に書き、git-flow（`feature/{topic}`）と GitHub flow（`{type}/{topic}`）の設定の例を載せる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                       | 担当     | 状態 | メモ |
| --- | -------------------------------------------------------------------------- | -------- | ---- | ---- |
| 1   | `branch_template` の設定と、run と作業ブランチの対応を記録で持つ形に変える | executor | open | -    |
| 2   | 名前の重なりの検査、`--branch`、`ff` の統合を足す                          | executor | open | -    |
| 3   | 統合テストと文書を足す                                                     | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-tc62-item-commit-type-scope]]
- [[prj-0001:pjr-z7gx-product-commit-message-template]]
