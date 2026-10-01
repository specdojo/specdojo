# Changelog

SpecDojo の利用者に影響する変更を記録します。

## [0.3.0] - 2026-09-29

### 破壊的変更

- SpecDojo 本体および同梱の docs-site、docs-lint の実行に Node 22.13 以上が必要になりました。
  puppeteer 25 と mermaid-cli 12 への更新に伴う変更です（PJR-XMMA）。
- レビュー観点の `evaluation` を、判定主体ではなく判定規準の所在を表す
  `deterministic` / `referential` / `discretionary` に変更しました。旧値の `agent` と
  `human` は読み込み時にエラーになります（PJR-WPWB）。
- レビュー観点の `continuous` を廃止し、文書種別に適用される 28 観点すべてを grade
  の対象にしました。rubric は 9 category の `grade-rubric-v2`、`pass_score` は 75
  になり、v1 の score とは比較できません（PJR-K351）。
- review の完了可否を `complete` / `complete-with-findings` / `incomplete` /
  `grade-stale` / `grade-unavailable` / `changed-during-review` の 6 値に統一しました。
  旧 `verdict_definitions` と旧 reporter 出力は、移行先を示すエラーになります
  （PJR-XTAN）。
- review は成果物を観点ごとに再評価せず、最新の grade を入力としてタスクの完了可否を
  判断する方式になりました。`xrp-*` / `xrr-*` を改訂し、観点別詳細テンプレートを
  削除しました（PJR-N22N、PJR-KCMH）。

- `register close` / `reject` / `defer` は、type が `note` の項目を拒否するようになりました。
  `note` は終端させず `open` のまま追記する記録であり、対応や判断が必要な場合は別の type で
  起票します（PJR-T2M6）。

詳細な対応表と手順は
[v0.3.0 移行ガイド](docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md)を参照してください。

### 追加機能

- 1 つの登録簿項目で、プロジェクトリポジトリと N 個のプロダクトリポジトリを変更できるように
  しました。`specdojo.config.json` の project に `repos` を宣言すると、`exec run --worktree` が
  リポジトリごとの worktree を作り、`targets`・`paths` の `<repo>:<path>` を解決し、親検証を
  `{ id, repo }` でリポジトリへ割り当てます。統合は事前検査の後に宣言順のプロダクト、最後に
  プロジェクトの順で行い、途中で失敗した場合は統合済みのリポジトリを飛ばして再開します
  （PJR-5822、PJR-HQBK、PJR-98G4、PJR-V96B、PJR-0WAA、PJR-69VP）。
- runner が付ける commit の `Refs:` trailer を `<project-id>:<item-id>` に修飾し、プロダクト側の
  commit と merge commit にも付けるようにしました。統合後の commit snapshot は result の
  トレーサビリティ表に記録します（PJR-1SXK、PJR-30SW）。
- `exec run --register --worktree --join` で実行中の run へ項目を追加し、
  `run.max_concurrent_runs` の範囲で並行実行できるようにしました。`exec slots` で実行枠を
  確認でき、項目ごとの executor 指定にも対応しました（PJR-4HBG、PJR-K332）。
- plan / deliverable の実行で executor と reporter を分離でき、review 前には grade の鮮度を
  確認して結果を plan へ提示するようにしました（PJR-E2Q3、PJR-KCMH）。
- grade の再評価対象を内容・依存先・rulebook・rubric の変化から選べるようにしました。
  旧 rubric の結果は `--rubric-outdated` で抽出できます
  （PJR-N03W、PJR-2F3Y、PJR-Z47X、PJR-BVPS）。
- `register` の記帳コマンドに `--commit` を追加しました。記帳用の実行枠を取得し、対象を
  限定して commit します（PJR-9XG4）。
- `config init` が生成物を除外する `.gitignore` を作成・追記するようになりました
  （PJR-HG98）。
- `config scaffold` が provider 別の起動スクリプトを `package.json` へ追加します。
  Antigravity では、差分確認とバックアップを伴う `--global` により、読み取り専用 Git
  コマンドの permission rule を設定できます（PJR-RPSX、PJR-0FK2）。
- `devcontainer scaffold` を追加しました。provider の CLI、Ollama、cron、tmux を選び、
  利用リポジトリ向けの分離環境を生成できます（PJR-2H5F）。
- docs サイトは実行記録をナビゲーションと検索の対象外にし、パス単位でサイドバーを
  分割しました。package 内の kata を一時配置して、eject していない文書も表示します
  （PJR-E8FY、PJR-QQXP、PJR-SJ3X）。
- register 由来の plan で変更対象の網羅性を検証し、関連文書の未解決 grade finding を
  計画へ展開するようにしました（PJR-6WFA、PJR-PPYF、PJR-1JJD）。

- fully-guided の edit plan が、rulebook に対応する sample を形式の参考として参照するように
  しました（PJR-AY1R）。
- 用語集（`gl-*.yaml`）の schema を追加し、`validate:schema` で検証できるようにしました
  （PJR-Y06Y）。
- 親 runner の検証（`pipeline.parent_validations`）に `lint-ts`・`lint-fm`・`lint-md` を
  追加し、`npm run lint:ts`・`lint:fm`・`lint:md` を agent の段階で実行できるようにしました
  （PJR-K1Z5）。
- 用語集の `category` と `relatedTerms` が同じ用語集の中の用語 ID を指すことと、用語 ID の
  重複がないことを検証する `glossary-references` を docs-lint に追加し、`validate:schema` に
  組み込みました（PJR-CF15）。
- rulebook に埋め込まれていたサンプル章を sample へ外出ししました。sample を持たなかった
  `tml-rulebook` と `ifx-index-rulebook` には sample を新設しました（PJR-GWYJ）。
- 同梱のオーケストレーター定義に、起票時の対話支援（不足項目の確認と、個票の `_TODO_` の
  内容案の提示）と、記帳の `--commit` を使う手順を加えました（PJR-N8AW、PJR-NJRH）。

### 不具合修正

- `exec run --resume` で reporter 段または統合段から再開するとき、統合先で直した不具合が
  親検証に反映されない問題を、親検証の前に統合先の最新を worktree へ取り込む形で修正しました
  （PJR-GENJ）。
- waiting からの再開時に develop の変更を消す可能性がある merge と、複数回の waiting 後に
  記帳競合が未解決のまま残る問題を修正しました（PJR-R0XA、PJR-CTV4）。
- 並行実行時の親検証と遷移・統合をプロセス間で直列化し、イベント競合は両側の和集合で
  解決するようにしました（PJR-3HHW、PJR-36CN）。
- resume 後の executor が plan の残作業を引き継がない問題と、rate limit 後に executor が
  再起動しない問題を修正しました（PJR-1Y9P、PJR-TDB0）。
- grade が未完了または途中で打ち切られたときに成功扱いになる問題を修正しました
  （PJR-QJAD、PJR-9PZ7）。
- agent の一時ファイルが commit や統合前検査へ混入する問題を、commit 対象を限定して
  修正しました（PJR-FFPK）。
- 統合段の dubious ownership を一度だけ再試行するようにしました（PJR-BX79）。
- CDFD / BPS の不整合、存在しない参照、オーケストレーターの `note` の状態説明を修正しました
  （PJR-5RS9、PJR-6V3D、PJR-XW9M）。

- grade の reporter の出力が、finding の severity による level の上限に反した場合に、違反内容を
  添えて 1 回だけ出し直させるようにしました（PJR-AVSR）。
- 保護設定の検査が、利用上限で止まった直後に再生成可能な生成物を誤検知する問題を修正
  しました。利用上限で止まった場合も検査は行い、止まった理由として利用上限を記録します
  （PJR-GRB5）。
- executor の sandbox で `docs:build` が `tsx` の IPC で失敗する問題を、`docs:generate` を
  `node --import tsx` で実行する形にして回避しました（PJR-M8NA）。
- 個票のタイトルに Markdown のエスケープ（`\*` など）が含まれると、plan・result・job の
  frontmatter の `name` が不正な YAML になる問題を修正しました（PJR-C44H）。
- 文書サイトの mermaid の SVG キャッシュが、mermaid-cli の版と `mermaid-config.json` の変更を
  判定に含めず、更新後も古い SVG を使い回す問題を修正しました（PJR-XMMA）。
- 利用者の環境に入る依存の脆弱性に対応しました。`js-yaml` を 4.3.2 以上、`dotenv` を 18 に
  上げ、docs-site を puppeteer 25 と mermaid-cli 12 に上げました（PJR-6TKA、PJR-XMMA）。
  docs-lint は `markdownlint-cli` を 0.49 に上げ、使われていなかった
  `remark-lint-frontmatter-schema` を依存から外しました（PJR-7GAK）。

### 既知の問題

- docs-site に high 1 件、moderate 1 件の脆弱性が残っています。mermaid 12 が依存する chevrotain 11 が `lodash-es` 4.17.23 を固定している問題と、vite 経由の `esbuild` に起因するものであり、いずれも上流の対応待ちです（PJR-XMMA）。
- docs-lint に moderate 1 件の脆弱性が残っています。`markdownlint-cli` 0.49.1 が `js-yaml` を
  `~5.2.1` に固定しているためで、上流の対応待ちです（PJR-7GAK）。

[0.3.0]: https://github.com/specdojo/specdojo/compare/v0.2.1...v0.3.0
