---
specdojo:
  id: prj-0001:pjr-c4j1-unify-build-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T11:00:20Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-C4J1 区分ごとの build を build --only にまとめる

## 1. 概要

区分ごとの 6 つの build を、利用者には build と build --only で見せる形にまとめる。同じ種類の操作が系統ごとに分かれているため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF のまとめる候補: index・catalog・schedule・register・dashboard・yaml-pages の build を、利用者には build と build --only `<区分>` で見せる。個別のコマンドは内部用か非推奨の別名にする。hook や job が呼ぶ個別の build の入口を確かめてから進める

## 3. 完了条件

- 利用者は `build` と `build --only <区分>` で、区分ごとの生成を流せる。
- hook・job・runner が呼ぶ個別の build の入口が壊れない。
- 個別の build コマンドは内部用か非推奨の別名になり、リファレンスに書かれている。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                                                                                                         |
| --- | ----------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------ |
| 1   | 個別の build の呼び出し元を洗い出す             | DEV  | done | hook・配布 hook・watch・runner・routine を確認。job 定義に対象の直接呼び出しはなかった                       |
| 2   | build --only を実装し、個別のコマンドを整理する | DEV  | done | 6 区分と既存の exec を選択可能にし、旧入口を内部互換用に変更。引数転送・拒否・停止・ヘルプの回帰テストを追加 |
| 3   | 文書を更新する                                  | DEV  | done | コマンドリファレンス・遂行の技活用ガイド・Quick Start を更新                                                 |

## 5. 対応結果

### 5.1. 実装と呼び出し元

- `src/commands/build.ts` に `--only` を追加し、既存の子コマンドへ委譲する。index・yaml-pages の `--root`、index の `--output`、register の `--register-scope`、schedule の `--track`・`--force` を転送し、対象外の組み合わせは実行前に拒否する。
- `lefthook.yml` の register・catalog・index、配布用 `templates/lefthook/tools/specdojo-pre-commit.mjs` の register、`src/commands/watch.ts` の catalog・register・index、runner の `src/exec/run/mode-shared.ts` の index・schedule の呼び出しを確認した。runner の worktree 準備は従来どおり一括 `build` を呼ぶ。
- `rtn-dashboard-refresh.yaml` は `args: [dashboard, build]` を保持する。`src/job/` と project の job 定義には、この 6 入口の直接呼び出しはなかった。旧入口の引数・処理を保ち、これらの呼び出し元の変更は不要とした。保護された設定の変更案はない。

### 5.2. 判断と互換性

- 個別の 6 入口は削除せず、内部互換用としてコマンド一覧から非表示にした。通常の利用者には `build` と `build --only` を案内し、hook・job 等の既存呼び出しには警告出力や引数変更を加えない。個別入口と旧 `build --scope` の扱いは [[specdojo:command-reference|CLIコマンドリファレンス]] に記載した。
- 一括 `build` の順序と register の複数 project 対応を維持した。schedule は track の指定と既存 YAML の上書き判断が必要なため、一括処理には追加せず、`build --only schedule --track <track>` で生成する。既存 track の上書きには `--force` が必要で、実行状態の更新には別途 `exec refresh` を使う。
- `--dry-run` は従来の一括 `build` と同じく、子コマンドの実行予定表示に統一した。内部入口の YAML・Markdown プレビューとは区別してリファレンスに記載した。

### 5.3. 検証

親 runner が実行する lint・schema・型検査・unit/integration test は executor では重複実行しない。完了条件の `npm run check` はこれらを含むため一括実行せず、残る build・実行時 import・catalog・履歴リンク・整形の検査を executor で行い、親の結果と合わせて判定する。親検証の確定結果は reporter / runner が result に記載する。

### 5.4. CHANGELOG に書く事項

- 変更: 区分別の生成を `build --only <区分>` に統合。index・catalog・schedule・register・dashboard・yaml-pages を選択でき、従来の個別 build と `build --scope` は内部互換用として維持する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
