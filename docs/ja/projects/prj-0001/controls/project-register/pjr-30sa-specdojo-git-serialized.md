---
specdojo:
  id: prj-0001:pjr-30sa-specdojo-git-serialized
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
  registered_at: "2026-11-16T03:13:37Z"
  due_on: null
  completed_at: "2026-11-16T13:29:21Z"
  conclusion: specdojo git を足し、git の書き込みを runner と同じロックに並べた。lefthook の警告とオーケストレーターの方針は承認のもと feature ブランチで反映した
  derived_from:
    - PJR-G90K
  commit_type: feat
  commit_scope: exec
---

# PJR-30SA git の書き込みを runner と同じロックで直列化する specdojo git を足す

## 1. 概要

orchestrator や人の commit・merge も exec-lifecycle のロックの下で流し、runner の統合と順番に並べる

## 2. 入力

- runner の統合と register の記帳は exec-lifecycle のロックで直列化されているが、orchestrator や人が直接流す git commit・merge はロックを取らず、runner の統合と同時に走る。lefthook の hook の実行中は index.lock を長く握るため、runner 側が失敗する（2026-11-15 の sld-090）
- OSS を調べた（2026-11-16）: git 本体に index.lock を待つ設定はない。git-wait（Rust）は空くのを待つだけでロックを持たず、flock は Linux 向け、GNU parallel の sem は Perl に依存し、どれも runner のロックとは別の列になる。そのため specdojo のコマンドとして作り、ロックの部品が足りなければ proper-lockfile（npm）を使う方針とした
- 利用者が 2026-11-16 に起票を依頼した。0.8.0 の後に行う

## 3. 完了条件

- `specdojo git -- <git の引数>` で、書き込みを伴う git 操作（commit・merge・add・rm・restore・checkout など）を exec-lifecycle のロックを取ってから流せる。読み取りの操作（status・log・diff など）はロックなしでそのまま流す。
- lefthook の hook を含む commit の全体がロックの中で流れ、その間 runner の統合はロックを待って失敗しない。
- ロックを握ったまま落ちたプロセスのロックは、時間がたてば取り直せる。
- run の最中に、ロックを取らない手の git commit を pre-commit hook で警告する。
- pm-orchestrator-playbook とオーケストレーターの定義に、orchestrator の commit・merge は `specdojo git` を通すことを書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合（pre-commit hook の追加、オーケストレーターの定義の追記、依存の追加など）は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                                                                                  |
| --- | --------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------- |
| 1   | コマンドの設計（書き込みの判定、ロックの部品の選定）                  | DEV  | done | 読み取りの許可リストと既存の heartbeat 付きロックを採用。判断は5.1節                  |
| 2   | specdojo git を実装し、runner と同じロックを使う                      | DEV  | done | CLI・ロック継承・単体／結合テストを追加。親の検証は runner が実行する                 |
| 3   | pre-commit 警告の部品と playbook を更新し、保護設定の変更案を記録する | DEV  | done | 警告チェックと scaffold を追加。保護設定は変更せず、完了条件に従い5.3節へ具体案を記録 |

## 5. 対応結果

### 5.1. 実装と判断

- `src/commands/git.ts` に `specdojo git [--project <id>] -- <Git の引数>` を追加した。同じ worktree・project の `registerLifecyclePoolPath` を使い、runner の統合・register の記帳と排他する。hook を含む Git 子プロセスの終了まで保持し、標準入出力・終了コード・終了シグナルを引き継ぐ。
- `status`・`log`・`diff`・`show` など、読み取りと判断できる操作だけロックを省略し、`GIT_OPTIONAL_LOCKS=0` で任意の index 更新を抑える。alias・未知のサブコマンド、`--output`、`-c` / `--config-env` は書き込み扱いとした。alias や設定による追加処理を読み取りと誤判定しないためである。
- Git の `-C`・`--git-dir`・`--work-tree` は対象 worktree の解決にも使う。未知のグローバルオプションと bare repository への書き込みは、別の場所を誤ってロックしないよう実行前に拒否する。書き込み時は設定が必要で、読み取り時は不要。`.env` はロードせず、Git のリポジトリ固有環境変数は既存の隔離規約に従う。
- 既存の `CrossProcessMutex` と atomic mkdir・別プロセスの heartbeat を再利用した。heartbeat 停止後30秒で stale ロックを回収できるため、proper-lockfile などの依存追加は不要と判断した。
- `specdojo git --warn-unlocked` は、選択 project の primary / join run が動いている間のロックなし commit を警告する。`CrossProcessMutex` の非同期コンテキストから `gitEnvironment()` へ保持中 token を渡し、runner と wrapper の hook は有効な lifecycle ロックとの照合で警告対象から外す。環境変数をプロセス全体で書き換えないため、別の非同期処理へ保持情報が漏れない。
- lefthook の生成処理と配布 hook スクリプトに警告チェックを追加した。既存の `lefthook.yml` と agent 定義は保護対象なので変更していない。[[prj-0001:pm-orchestrator-playbook|運用メモ]] と [[specdojo:command-reference|コマンドリファレンス]] には使い方を反映した。直接の Git 呼び出しや別 project のロックとの排他は対象外である。

### 5.2. 検証

- `npm run build`、`npm run check:src-imports`、`npm run validate:history-links`、hook と同じカタログ検証、`register build --project prj-0001` が成功した。カタログ検証には未作成文書・re-export 参照など既存の警告があるが、エラーはない。CLI の help とロックを使わない `git status --short` も成功した。変更ファイルは Prettier で整形した。
- 単体テストには書き込み判定、Git 引数の保持、project のパス解決、primary / join run の警告、有効な token の照合と非同期コンテキストからの解放を追加した。
- 結合テストには別プロセスの CLI が runner のロックを待つこと、pre-commit 実行中に runner が取得できないこと、hook 終了後の取得、失敗時の解放、残留ロックの回収、`-C` の対象解決、設定なしの読み取り／書き込み拒否、警告だけで終了することを追加した。
- `typecheck`・`lint:ts`・`test:unit`・`test:integration`・`lint:md` など、指定済みの親検証は executor 内で実行せず runner に委ねる。実行結果は親の evidence を正とする。

### 5.3. 保護設定への反映案と統合後の確認

完了条件の例外に従い、以下は変更案として申し送る。利用者の承認後、feature ブランチで反映する。

1. 既存の `lefthook.yml` の `pre-commit.commands` に次を追加する。終了コードは常に0であり、警告で commit を止めない。

   ```yaml
   git-lock-warning:
     run: node --import tsx src/specdojo.ts git --project prj-0001 --warn-unlocked
   ```

2. `.agents/specdojo-orchestrator.agent.md` の Git 方針へ次の本文を追加し、`npm run orchestrator:sync` と `npm run lint:orchestrator-sync` で配布テンプレートを含む全ラッパーへ同期する。

   > orchestrator の commit・merge・add・rm・restore・checkout など、書き込みを伴う Git 操作は `specdojo git --project <id> -- <Git の引数>` を通し、runner の統合と同じ lifecycle ロックで直列化する。既存の承認・ブランチ方針を守る。register の記帳は引き続き `register ... --commit` を使う。

3. [[prj-0001:pm-orchestrator-playbook|運用メモ]] 6.1節に従い、統合後の PJR-JSEY で確認する。保護設定を反映した後、run 中の直接 commit では警告し、`specdojo git` と runner の commit では警告しないことも確認する。executor は Git commit・設定反映・実 agent の起動を行わない。

### 5.4. CHANGELOG に書く事項

- 追加: `specdojo git -- <Git の引数>` で Git の書き込みを runner と同じ lifecycle ロックに並べ、hook の実行中も排他する。読み取りはロックを待たず、lefthook scaffold は run 中のロックなし commit を警告する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-g90k-integrate-index-lock-retry]]
- [[prj-0001:pjr-964d-git-index-lock-wait-longer]]
