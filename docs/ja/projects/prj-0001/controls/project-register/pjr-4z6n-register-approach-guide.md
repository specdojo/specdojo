---
specdojo:
  id: prj-0001:pjr-4z6n-register-approach-guide
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:17:29Z"
  due_on: null
  completed_at: "2026-10-18T07:21:40Z"
  conclusion: exec-operation-guide に、register の todo から approach で成果物と kata を作る・直す手順の節を加えた。approach と target の指定、kata の approach の選び方、組み合わせの誤りのエラー、exec run --deliverable との違いを書き、register-operation-guide から参照した
---

# PJR-4Z6N register から approach で実行する手順をガイドに書く

## 1. 概要

register の todo から approach を使って成果物と kata を作る・直す手順と、exec run --deliverable との違いを exec のガイドに書く。PJR-H72A の決定に基づく

## 2. 完了条件

- [[specdojo:exec-operation-guide]] に、register の todo から approach を使って成果物と kata を作る・直す手順の節がある。次を含む。
  - 個票の frontmatter の `approach` と `targets`、`register add --approach <approach> --target <id>` での指定の仕方。
  - 成果物（local_id）と kata（`specdojo:pjr-rulebook` などの id）の対象の書き方と、kata の approach（`rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance`）の選び方。
  - plan に DCT の `done_criteria` と個票の完了条件の両方が載ること、owner には個票の `owner` を使うこと。
  - approach と対象の組み合わせが合わない場合は起票と実行の時点でエラーになること。
  - `exec run --deliverable`（in-place）との違い（worktree・統合・review・登録簿の記帳）と、register の経路を勧めること。
- 手順の例のコマンドが、実際の CLI の `--help` と一致する。
- [[specdojo:register-operation-guide]] など、approach に触れる既存の文書と矛盾しない。必要なら参照を足す。
- `npm run lint:md` が通る。親の検証が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ |
| --- | ------------------------------------------------- | ---- | ---- | ---- |
| 1   | exec のガイドに register の approach の手順を書く | DEV  | done | -    |

## 4. 対応結果

- [[specdojo:exec-operation-guide]] に「4. register の todo から approach で成果物・kata を作る・直す手順」を追加した。
  - `exec run --deliverable`（in-place）との違い（worktree 隔離、統合ブランチへの merge commit、review 状態への遷移、登録簿の記帳）を整理し、安全な隔離と台帳管理ができる register の経路を推奨した。
  - 個票 Frontmatter の `approach` と `targets`（1 件必須）、および `register add` / `update` の `--approach` と `--target` による指定方法を記載した。
  - 成果物（成果物カタログの doc id または canonical `local_id`）と kata（`specdojo:pjr-rulebook` などの doc id）の対象の書き方、kata 保守の進め方（`rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance`）の選び方を記載した。
  - `approach` と対象の組み合わせ誤りや解決不能な対象が起票・更新時および実行時に検証されエラーになることを記載した。
  - plan 生成時に DCT の `done_criteria` と個票の完了条件の両方が載ること（DCT を基本とし個票完了条件を追加）、owner に個票の `owner` を使うことを記載した。
  - 一連の実行手順例（起票 -> plan 確認 -> worktree 実行 -> close）を CLI の `--help` と一致するコマンドで記載した。
- [[specdojo:register-operation-guide]] に `--approach` と `--target` の指定に関する記述と、exec 運用ガイドへの参照を追加した。
- `CHANGELOG.md` の未公開版節（`## [0.4.0] - 未定`）の「文書」に本対応（PJR-4Z6N）の変更内容を記録した。
- 残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-h72a-register-approach-execution]]（決定）
- [[prj-0001:pjr-h06f-register-approach-plan-generation]]（実装）
