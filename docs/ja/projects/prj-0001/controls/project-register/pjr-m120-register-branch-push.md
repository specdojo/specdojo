---
specdojo:
  id: prj-0001:pjr-m120-register-branch-push
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  registered_at: "2026-11-24T23:14:51Z"
---

# PJR-M120 登録簿の専用ブランチへの push を受け持つ register branch-push を足す

## 1. 概要

登録簿の同期（`register_sync`）では、`register ... --commit` と `exec run` が専用ブランチへ自動で push する。一方、初回の専用ブランチの作成と push、同期に失敗したときの復旧は、ガイドで素の `git branch`・`git pull --rebase`・`git push` を手で打つ手順になっている。素の `git push` はどのブランチへも push できるため、オーケストレーターには許していない。push を、設定の remote と branch だけに絞った専用のコマンドで受け持ち、オーケストレーターが素の `git push` を打たずに同期を始め・直せるようにする。

## 2. 入力

- 利用者の要望（2026-11-25）: 起票を専用ブランチへ push する運用を、prj-0001 と prj-0002 の間で始めたい
- 利用者の提案と判断（2026-11-25）: register の git の push は specdojo の専用コマンドを作った方がよい。コマンドを作ってから同期を始める（案 B）。全件レビュー（PJR-0BGE）は止めずに並行して進める
- 同期の設定（2 つの project の specdojo.config.json・CLAUDE.md・オーケストレーターの本文・check-register-push.yml・lefthook.yml）の差分は、オーケストレーターが ../worktrees/feature-prj-0001-register-sync と ../worktrees/feature-prj-0002-register-sync に用意してある（未 commit）。この項目では変えない
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- `specdojo register branch-push --project <project-id>` を足す。push の先は、その project の `register_sync` の `remote` と `branch` だけとし、ほかの ref を引数で指せないようにする。`register_sync.enabled` が `true` でない project では、何もせずに理由を出して終了コード 1 で止まる。
- 初回: 専用ブランチが手元にもリモートにも無ければ、その project の統合のブランチ（`integration_branch`、省略時は `project/<project-id>/develop`）から作って push する。リモートにだけあれば、手元のブランチを作るだけにする。専用の worktree が無ければ、今の同期と同じ置き場に用意する。
- 復旧: 同期が止まった専用の worktree（未 push の commit がある、rebase の途中など）を、`pull --rebase` から push の順で流し直す。衝突が残っていれば、ファイルと直し方を出して終了コード 1 で止まる。記帳済みのファイルとローカルの commit は消さない。
- push の前に、`register branch-check` と同じ検査（register の範囲の外のファイル、個票とイベントの形）を流し、違反があれば push しない。
- 今の同期と同じロックの中で動き、同期中の別の記帳と取り合わない。`--dry-run` では、作るブランチ、push する commit の範囲、検査の結果だけを示して何も変えない。
- 単体テストと統合テストを足す（初回の作成と push、リモートにだけあるとき、復旧、衝突で止まること、検査の違反で止まること、無効の project で止まること、`--dry-run`、ほかの ref を指せないこと）。git を使うテストは `vitest.instructions.md` の決まり（一時ディレクトリ、`gitEnvironment()`）に従う。
- 登録簿運用ガイドの「専用ブランチへの同期」と設定リファレンス、コマンドリファレンスを、手で打つ `git branch`・`git push`・`git pull --rebase` の手順をこのコマンドに替える形に直す。
- 破壊的な変更をしない（PJR-T2X5）。今の同期の動き、`branch-merge`・`branch-guard`・`branch-check` の引数と出力は変えない。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`CLAUDE.md`・`lefthook.yml`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。統合の後に、オーケストレーターが試しのリポジトリ（裸のリモートを持つ一時のリポジトリ）で初回・復旧・`--dry-run` を確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
