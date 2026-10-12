---
specdojo:
  id: prj-0001:pjr-mtfa-v030-changelog-additions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-12T06:01:18Z"
---

# PJR-MTFA v0.3.0 の CHANGELOG に 10 月 11 日以降の変更と既知の問題を追記する

## 1. 概要

PJR-HRMS の完了後に入った変更（複数リポジトリの worktree 準備と統合の修正、routine の Job Run の worktree 実行と統合前 review、Job の review agent 指名、register の agent 自動選択、not_applicable と not_run の判定、config init の .gitignore など）と、公開時点で残る既知の問題を CHANGELOG の 0.3.0 へ追記する

## 2. 完了条件

- `CHANGELOG.md` の `## [0.3.0]` に、次の変更が既存の書式（`### 追加機能` / `### 不具合修正` / `### 既知の問題` の区分、項目ごとの記述と登録簿の ID の併記）で追記されている。各項目の内容は、該当する個票の対応結果と、develop に統合された実装から確かめて書く。
  - 追加機能: routine が起動する Job Run を exec の worktree で実行し、runner の commit・review・verdict による統合を経る流れ（PJR-VQZA）。Job Definition の `task.review` による統合前 review の宣言と review agent の指名、routine の `action.commit` の互換の扱い（PJR-MD3C）。block された保護対象の設定変更を申し送りから統合先へ適用するコマンド（PJR-BJH6）。
  - 不具合修正: 複数リポジトリの worktree 準備の順序（PJR-NN43）、複数 project での `specdojo build` の登録簿生成（PJR-WJ83）、register 実行での pipeline 用でない agent の自動選択（PJR-ADZ6）、`not_applicable` の判定（PJR-WP44）、プロダクトリポジトリの検証の `not_run` の扱い（PJR-2GZE）、プロダクト worktree への依存の導入（PJR-86Q5）、再開時の同期での同じ内容の未追跡ファイル（PJR-B2EC）、最上位の新規ファイルと `tmp/` の扱い（PJR-GBVM）、`config init` の `.gitignore` への `node_modules/` の追記（PJR-J2AS）、`index build` の `not_run` で run が止まる問題（PJR-HJ99）。
  - 既知の問題: 負荷の高い一括のテスト実行で時間切れが起きる（PJR-W2EB）。devcontainer scaffold の作るコンテナのマウント先が利用者のフォルダ名によらず固定であることと、`--tmux` などの任意機能が既定で入らないこと（PJR-PV5B）。
- 利用者の手順に影響する変更（`task.review`、`action.commit`、`tmp/` の規則、`config init` の追記）は、[[specdojo:release-v0-3-0-migration-guide]] にも必要な範囲で反映されている。
- 開発用の hook など、利用者に配布されない変更（PJR-GRMK など）は追記しない。
- `npm run lint:md` が通る。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ             |
| --- | ------------------------------------------------ | ---- | ---- | ---------------- |
| 1   | 各項目の個票と実装を確かめ、CHANGELOG に追記する | DEV  | done | CHANGELOG に追記 |
| 2   | 移行ガイドへの反映を確かめる                     | DEV  | done | 表に 3 行を追加  |

## 4. 対応結果

- 実施内容: 2026-10-12 の exec run（claude-expert-executor / claude-reporter）で、`CHANGELOG.md` の 0.3.0 に追加機能 3 件（PJR-VQZA・PJR-MD3C・PJR-BJH6）、不具合修正 9 件、既知の問題を追記した。[[specdojo:release-v0-3-0-migration-guide]] の「更新前に確認する」の表に、`task.review`、`tmp/` の規則、`config init` の `.gitignore` 追記の 3 行を加えた。
- 統合の経緯: 1 回目は、未統合だった PJR-HJ99 の判定（`index build` の `not_run` と、変更範囲による `catalog validate` の `not_applicable`）で止まった。PJR-HJ99 の統合後に `--resume` し、新しい判定で runner が統合した（aebcff031）。
- 追記の補正: executor は PJR-HJ99 を未統合として既知の問題に書いたため、統合後に orchestrator が不具合修正へ移した（38edc7ff1）。PJR-34F2 の用語の整理も orchestrator が追加機能へ追記した（ba3c6790f）。
- 残課題: なし。公開日の記入は公開当日の作業として PJR-HRMS の扱いに従う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-hrms-v030-changelog-finalize]]: 前回の CHANGELOG の最終化
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: 公開の判定基準 6
