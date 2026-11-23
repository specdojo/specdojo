---
specdojo:
  id: prj-0001:pjr-n5j8-register-commit-to-register-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:21:36Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-SJC7
    - PJR-EKGQ
  commit_type: feat
  commit_scope: register
---

# PJR-N5J8 register の記帳を register のブランチへ書いて push する

## 1. 概要

`register --commit` と schedule の実行のイベント、`external_projects` からの起票を、設定で register のブランチへ commit して push する。non-fast-forward は `pull --rebase` で解く。

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- `register` の記帳のコマンド（`add`・`update`・`close`・`reject`・`defer`・`reopen` など）の `--commit` が、設定で register のブランチを使うとき、記帳を register のブランチ（`project/<project-id>/register`、別の worktree）へ commit して push する。non-fast-forward のときは `pull --rebase` して push し直す。設定がなければ今の動き（現在のブランチへの commit）を変えない。
- schedule の実行のイベント（`execution/exec/events/` の claim・complete など）の記帳も、同じ設定で register のブランチへ書いて push する（1b）。
- 別のプロジェクトから `external_projects` で起票する経路も、register のブランチへ push する（利用者の依頼、2026-11-23。個人の運用でも別のプロジェクトから specdojo へ起票することが多いため、早めに使えるようにする）。
- 設定のキー（register のブランチを使うか、ブランチの名前、リモート）を `specdojo.config.json` の project に足し、設定リファレンスに書く。
- push に失敗したとき（ネットワーク、権限、rebase の衝突）は、記帳をローカルに残したまま失敗の理由と次にすべきことを出して止まる。記帳を失わない。
- register のブランチがまだないときに作る手順（またはコマンド）を用意する。
- 実 Git の一時リポジトリとリモートで、並行の記帳の push と `pull --rebase` の解決を確かめる統合テストを足す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                                                       |
| --- | -------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------ |
| 1   | 設定と専用ブランチの同期処理を実装           | DEV  | done | 型・schema、共通ロック、worktree、rebase と push、失敗時の記帳保持を追加                   |
| 2   | register・schedule・外部起票の経路を接続     | DEV  | done | 同期未設定時の動作を維持。外部 CLI の対応版も確認                                          |
| 3   | 実 Git の統合テストと設定の単体テストを追加  | DEV  | done | 並行 push、拒否、衝突、元の作業の保持、外部 CLI を対象に追加。実行は親 runner の検証に委任 |
| 4   | 関連文書と個票を更新し executor の検査を実施 | DEV  | done | 初期作成・復旧手順と CHANGELOG 文案を記載。親検証は runner が実行                          |

## 5. 対応結果

### 5.1. 実施内容

- `src/shared/register-branch.ts` に Git 同期の共通接点を追加した。リモートの記帳を取り込み、専用 worktree を再利用して更新する。non-fast-forward だけ `pull --rebase` と push を再試行する。
- `src/register/register.ts`・`cross-project.ts` で `--commit` を専用ブランチへ接続した。記帳前と push 前に対象範囲を検査し、元の worktree の差分は取り込まない。`src/register/external-project.ts` では同期を有効にした相手に v0.10.0 以上を要求する。
- `src/exec/events.ts` で schedule のイベントの読み書きを同期先へ接続した。claim 済みタスクへの追加 claim は、書き込み前と push 再試行前に拒否する。run の記録・grade・成果物は転送しない。
- `src/shared/specdojo-config.ts` と config schema に `register_sync` を追加した。設定リファレンス、CLI リファレンス、登録簿運用ガイド、Git ブランチ運用標準を更新した。
- `tests/src/register/register-branch.integration.test.ts` に実 Git と bare remote・別 clone による統合テストを追加した。設定の型検証は `tests/src/shared/register-sync-config.test.ts`、外部 CLI の対応版の検証は既存の `external-project.test.ts` に追加した。

### 5.2. 決めた内容と運用への申し送り

- 設定は project の `register_sync` にまとめ、`enabled` の既定を `false`、`branch` を `project/<project-id>/register`、`remote` を `origin` とした。既存利用者の commit 先と外部起票の互換性を保つため、明示した場合だけ切り替える。実際の `.specdojo/` の設定変更はしていない。有効化する場合の変更案は `projects.<project-id>.register_sync = { "enabled": true }` とする。
- worktree は Git 共通ディレクトリ配下に保持し、リポジトリ共通のロックで同期を直列化する。schedule の同期 API は既存の同期呼び出しを保つため、busy 時は終了して再実行を案内する。別プロセスが使用中の worktree を削除しない。
- push は最大 3 回とし、ネットワーク・権限の失敗や rebase 衝突を無制限に再試行しない。未公開の記帳を伴う失敗は復旧待ちとして保持し、後続のコマンドによる意図しない公開を止める。手動で復旧・push した後、clean な HEAD がリモートに含まれることを確認して再開する。
- 初期ブランチは設定を含む develop から人が作成・push する手順とした。既にリモートにある場合のローカルブランチ・worktree は CLI が作成する。hook の依存関係や追跡外の入力が必要な場合は、既存の専用 worktree を準備してセットアップする。
- register の外の参照文書を変える改名・再採番は、専用ブランチでは停止して通常の feature と PR で扱う。記帳専用の範囲を守るためである。runner の対応結果の転送、develop への自動取り込み、hook・CI の保護と、v0.10.0 の版上げは本タスクで有効化せず、後続の移行・リリース手順へ引き継ぐ。

### 5.3. 検証

- 変更ファイルの Prettier 整形、`npm run check:src-imports`、config schema の個別検証、履歴リンク検証、`register build` が通過した。カタログ検証もエラーなしで通過した（既存の参照先についての警告あり）。
- 型検査、TypeScript・Markdown・frontmatter の lint、schema 検証、単体・統合・文書テストは pipeline の親検証へ委任した。executor 内での重複実行はしていない。実行結果は親 runner が evidence に追記する。
- result は executor から編集せず、実施内容と判断事項を報告の `handoff` から reporter に渡す。

### 5.4. CHANGELOG に書く事項

- 区分: Added（v0.10.0）
- 行の文案: project の `register_sync` 設定により、register の `--commit`、schedule の実行イベント、外部 project からの起票を専用ブランチへ commit・push できる。non-fast-forward は rebase 後に再試行し、失敗時はローカルの記帳と復旧手順を保持する（PJR-N5J8）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0 の決定]]
- [[specdojo:specdojo-config-reference|設定リファレンス]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
