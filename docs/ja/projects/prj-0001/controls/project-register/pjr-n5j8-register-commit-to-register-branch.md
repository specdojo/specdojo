---
specdojo:
  id: prj-0001:pjr-n5j8-register-commit-to-register-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

register --commit と schedule の実行のイベント、external_projects からの起票を、設定で register のブランチへ commit して push する。non-fast-forward は pull --rebase で解く

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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
