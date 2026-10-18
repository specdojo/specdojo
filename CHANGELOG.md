# Changelog

SpecDojo の利用者に影響する変更を記録します。

## [0.4.0] - 未定

### 追加機能

- 指名した agent が rate limit になったとき、`--on-rate-limit wait|fallback|stop` と executor / reporter 別の fallback 指定で、同じ agent の再開待ちまたは代替 agent への切替を選べるようにしました。`exec-defaults.yaml` の `rate_limit_policy.pinned` でも既定を設定でき、従来互換の既定は `stop` です（PJR-BHMH）。
- `register add` / `update` に `--approach` と繰り返し指定できる `--target` を追加しました。個票で進め方と対象文書を宣言でき、成果物はカタログ、kata は文書索引で解決します。解決できない対象、成果物と kata の種別違い、`approach` と複数対象の組み合わせは書き込み前に拒否します（PJR-ZJXQ）。

### 不具合修正

- `devcontainer scaffold` が親ディレクトリを常に `/workspaces/specdojo-workspace` としていた問題を修正し、ホスト側の親名を反映するようにしました。`--workspace-name` で明示的に固定でき、`specdojo init --devcontainer` からも指定できます。既に生成済みの `.devcontainer/` は、`--force` で作り直すまで従来のままです（PJR-8GQ4）。
- 対話式の `specdojo init` で provider などの入力を誤ると、最初から入力し直しになっていた問題を修正しました。答えを質問ごとに確かめ、誤りがあればその質問だけを聞き直します。非対話（`--yes` や引数での指定）では、従来どおり誤りの理由を出して終えます。Claude Code を選んだときの最後の案内も、`npm run orch:opus` に揃えました（PJR-B3XQ）。
- exec の worktree を作るときに、git が一時的なエラー（dubious ownership など）を返しても実際には作成できていた場合、再試行が「branch がすでにある」で失敗していた問題を修正しました。再試行の前に目的の状態を確かめます（PJR-DT3Q）。
- exec の checkpoint の確認で git が失敗したときに、原因が記録されなかった問題を修正しました。終了コードと stderr を失敗のログとエラーのメッセージに含めます（PJR-CY80）。
- exec の result で、reporter が変更ファイルごとの説明を返さなかった場合に、定型文（「reporter の説明がないため、変更差分を参照。」）の代わりに Git の変更情報（追加・変更・削除・名前の変更、行数）を記録するようにしました。変更ファイルが 50 件を超える場合は、ディレクトリごとに集約して記録します（PJR-8TS6）。
- `register build` が生成する一覧（`pjr-index.md` と派生ビュー）で、個票のタイトル・説明・結論などのセルに含まれるパイプ文字（`|`）と改行をエスケープするようにしました。セル内のパイプ文字で表の列がずれ、markdownlint（MD056）で失敗する問題を解消します（PJR-FXPH）。

### 文書

- README の始め方を、ランディングページ（<https://specdojo.org/>）と同じ `npx specdojo init` の手順と `<アプリ>-workspace/<アプリ>-specdojo` の構成に揃え、specdojo.org へのリンクを加えました（PJR-Y79W）。

### 内部の変更

- `src/` を機能ごとのサブディレクトリ（`exec/`・`register/`・`grade/`・`shared/` など）へ分け、機能の間の依存の向きを ESLint で検査するようにしました。CLI の動作と出力は変わりません（PJR-V23P・PJR-X8Y9 ほか）。

## [0.3.1] - 2026-10-16

同梱パッケージの `@specdojo/docs-lint` と `@specdojo/docs-site` は、この版では公開しません（docs-lint の js-yaml の更新は次の docs-lint の版で公開します）。

### 不具合修正

- `specdojo init` と Antigravity 向け配布雛形・ガイドが、agy 1.3.5 で提供されないモデル ID を指定し、expert agent が `invalid model selection` で起動できない問題を修正しました。利用可能な ID は `agy models` で確認できます（PJR-X60A）。
- exec の result の frontmatter で、改行を含む `block_reason` が字下げされずに書かれ、YAML として不正になる問題を修正しました。値は YAML として正しく引用して書きます（PJR-TMAW）。
- 未追跡のファイルが多い作業場所で、`register --commit` などが原因の分からない `git status failed` で止まる問題を修正しました。git の出力を 1 MiB を超えても受け取り、出力の上限超過や signal による失敗はエラーのメッセージに原因を含めます（PJR-RY4C）。

### 依存関係

- SpecDojo 本体の js-yaml を 5.4.3 へ更新しました。既存文書との互換性のため、引用符なしの日付と merge key は 4 系と同じ規則で読み込みます（PJR-RCVS）。

### 内部の変更

- 大きくなったソースファイル（`exec-run.ts`・`grade.ts`・`register.ts` など）を責務ごとのモジュールへ分けました。CLI の動作と出力は変わりません（PJR-QCMP・PJR-K6KB・PJR-3W2N・PJR-2JFM・PJR-GBPX・PJR-Y8P9）。

## [0.3.0] - 2026-10-14

同梱パッケージは `@specdojo/docs-lint` 0.2.0 と `@specdojo/docs-site` 0.2.1 を同時に公開します。docs-lint は 0.1.0 以降の変更（下記の lint の追加、依存の更新、脆弱性の修正）を含みます。docs-site 0.2.1 は、先に公開した 0.2.0 の導入時の不具合 2 件（下記の不具合修正の PJR-EA20・PJR-CA0S）を直した版です。

### 破壊的変更

- agent の定義を project ごとの `pm-members.yaml` から repository 共通の保護設定 `.specdojo/agent-members.yaml` へ分離しました。`pm-members.yaml` は人間だけを受け付け、agent が残る場合は `specdojo config migrate-members --dry-run` を案内して読み込みを停止します。移行後は人間名簿を通常成果物として agent が編集でき、agent 定義は `.specdojo/**` の既存保護境界に残ります（PJR-2T63）。

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

- `specdojo orchestrator launch` を追加し、対象 project の `repos` に宣言したプロダクトリポジトリだけを対話型オーケストレーターから参照・変更できるようにしました。`config scaffold` が追加する `orch:*` はこの入口を使います。Claude Code、Codex、Antigravity、GitHub Copilot は exec と同じ追加ルート引数を、OpenCode は実行時の `permission.external_directory` を利用します。起動中の `SIGINT` / `SIGQUIT` では子の終了を待ち、`SIGTERM` / `SIGHUP` は子へ転送します（PJR-ZGJ4、PJR-4Y48）。
- 質問に答えるだけで project、register、人の名簿、provider のオーケストレーター設定、agent
  実行設定、任意の成果物カタログと Dev Container を用意する `specdojo init` を追加しました。
  非対話オプション、既存ファイルの非上書き、`--dry-run` にも対応します。親検証は利用先の
  `package.json` に対応 script があるものだけを設定し、worktree 既定先はリポジトリ名から作ります
  （PJR-6QDA）。
- 人の名簿を設定しない project でも `.specdojo/agent-members.yaml` から agent を読み込めるようにし、
  provider の scaffold が示す配置先とスニペット名を新しい agent 名簿へ統一しました。exec plan の
  共通規約は、利用先に依存・npm script・project 設定がある検査だけを求めるようになりました
  （PJR-WZYW、PJR-44J9）。
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
- grade の reporter の既定を executor の marker の機械変換にし、`grade plan --embed-documents` で
  評価対象と参考資料を行番号付きで埋め込めるようにしました（PJR-E9H3、PJR-26K4）。finding は
  英語の `message` を正本、日本語の `message_ja` を表示用として保存し、severity 上限を超える
  level は下方向だけに補正して記録します。翻訳は各件の仮名とインラインコードを点検し、不合格の
  件だけを再試行します。既定の翻訳 agent は `gemma26-translator` です
  （PJR-27Y0、PJR-JWXK、PJR-WAFC、PJR-PZPA）。
- `exec run --resume --resume-from executor` を追加しました。既存の worktree と未 commit の成果を
  保持して executor 段へ戻り、直前の block 理由や失敗した親検証を prompt へ引き継ぎます。
  executor・reporter・統合のどの段から再開するときも、起動前に統合先の最新を取り込みます
  （PJR-PG6W）。
- executor evidence の検証状態に `requires_human` を追加しました。実 agent CLI、利用枠・課金、
  認証情報、ホスト側の操作など sandbox から実行できない確認を、機械判定で block せず result の
  申し送りへ残せます（PJR-BK4K）。失敗した親検証の stdout / stderr は秘匿処理後に evidence へ
  保存され、要約には出力の先頭と末尾が残ります（PJR-R8WR）。
- executor evidence の検証状態に、理由必須の `not_applicable` を追加しました。適用外の検査は
  result の申し送りへ残しつつ block せず、存在する npm script や導入済み package に対する
  誤申告は機械的に block します。SpecDojo サブコマンドは package の有無ではなく project 設定の
  適用条件で判定し、未導入 package・未定義 npm script・設定上適用外のコマンドを `not_run` とした
  場合も runner が適用外として result へ記録します（PJR-A0NE、PJR-755T）。
- `exec run --register` の実行場所を `run.register_execution` で設定できるようにし、`--in-place` を
  追加しました。設定がない既存 project の既定は従来どおり in-place です（PJR-D0KF）。
- `register` の記帳コマンドに `--commit` を追加しました。記帳用の実行枠を取得し、対象を
  限定して commit します（PJR-9XG4）。
- `config init` が生成物を除外する `.gitignore` を作成・追記するようになりました
  （PJR-HG98）。
- `config scaffold` が provider 別の起動スクリプトを `package.json` へ追加します。
  Antigravity では、差分確認とバックアップを伴う `--global` により、読み取り専用 Git
  コマンドの permission rule を設定できます（PJR-RPSX、PJR-0FK2）。
- 試験的な機能として `devcontainer scaffold` を追加しました。provider の CLI、Ollama、cron、
  tmux を選び、利用リポジトリごとに設定・認証情報を分離した環境を生成できます。Codex の
  sandbox 用 seccomp 設定、OpenCode と GitHub CLI の named volume、既存 dotfiles を上書きしない
  Emacs・Eglot のテンプレートにも対応しました。空の `~/.emacs.d` がある場合も Emacs が読み込む
  `~/.emacs.d/init.el` へテンプレートを配置します。Codex は公式 installer（失敗時は npm）、OpenCode
  は `opencode-ai` で導入します。Codex sandbox と Emacs は生成物の unit test まで完了していますが、
  生成した Dev Container での実機確認は公開前の人の確認事項です
  （PJR-2H5F、PJR-KEQQ、PJR-EZAF、PJR-J7WE、PJR-XBDB）。
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
- 日本語文書へ混入した、日本語と字形の異なる簡体字 20 字を検出する markdownlint の
  `MD061`（`no-chinese-glyphs`）を追加しました。コード、URL、明示的に除外した箇所は対象外です
  （PJR-86JE）。
- rulebook に埋め込まれていたサンプル章を sample へ外出ししました。sample を持たなかった
  `tml-rulebook` と `ifx-index-rulebook` には sample を新設しました（PJR-GWYJ）。
- 同梱のオーケストレーター定義に、起票時の対話支援（不足項目の確認と、個票の `_TODO_` の
  内容案の提示）と、記帳の `--commit` を使う手順を加えました（PJR-N8AW、PJR-NJRH）。
- SpecDojo の呼び方を「仕様道（Spec-Dō）の道場」に改め、記帳・実戦・評定・講評の技と、
  `approach` に対応する流の名前を利用者向け文書へ加えました。標語は「決めて、書いて、
  鍛え続ける。」です（PJR-QGP4、PJR-0WYM、PJR-J29X）。
- Quick Start に、`specdojo init` から question・decision の記帳、設計書の更新、change-request、
  決定ログの確認までを 10 分で体験する「仕様の判断台帳」の手順を追加しました（PJR-XMQH）。
- routine が起動する Job Run を、本体の作業場所ではなく exec の worktree
  （`exec/<project-id>-<run-id>`）で実行できるようにしました。runner が Run の出力だけを
  `chore(routine): …` で exec ブランチへ commit し、`mode: review` の plan・result による review を
  経て、Run が成功し verdict が `complete` / `complete-with-findings` の場合だけ統合先へ `--no-ff` で
  merge します。それ以外は worktree を残して統合せず、理由を Job Run、review result、routine の
  記録へ残します。Job の実行中に本体の作業場所の HEAD は動きません（PJR-VQZA）。
- Job Definition に、統合前 review を宣言する `task.review` を追加しました。宣言した Job は routine
  と手動の `exec run --job` のどちらから起動しても、worktree での実行、runner の commit、review、
  verdict による統合の流れで動きます。review agent は `task.review.agent.executor`（必須）と
  `task.review.agent.reporter`（任意）で nickname 指名でき、`--review-by` / `--reporter-by`、Job の
  指名、自動選択の順に解決します。`exec run --job --dry-run` と `routine run --dry-run` は解決した
  review agent を表示します。routine の `action.commit: true` は互換として読みますが新たには
  推奨せず、Job が `task.review` を宣言している場合は Job を優先します（PJR-MD3C）。
- `agent-config-write` の保護で block された設定変更（プロダクトリポジトリの `package.json` など）を、
  result の申し送りに自動記録された提案差分から統合先へ適用・commit する
  `specdojo exec handoff apply --project <project-id> --register <PJR-ID>` を追加しました。差分を
  表示してから確認を求め、非対話実行では `--yes` がない限り変更しません。保護対象外のパス、
  未宣言のリポジトリ、切り詰められた差分や適用できない差分は commit 前に拒否します。
  `package.json` を適用した場合は lock ファイルの再生成と、続けて実行する `--resume` のコマンドを
  案内します（PJR-BJH6）。

- 文書の用語を整理しました。成果物体系・実践体系・遂行体系の 3 つの体系を、成果物・型（Kata）・技（Waza）に
  改め、流（Ryu、`approach`）をそれらをつなぐ属性として説明します。技は PDCA と register・schedule・
  routine + Job の表で説明します。あわせて標語を「記して、形にして、磨き続ける。」に、プロダクト文書を指す
  「設計書」を「仕様書」に、別リポジトリ構成の親ディレクトリの例を `app1-workspace/` に改めました。
  文書の id は変わりません（PJR-9G9Y、PJR-34F2）。

### 不具合修正

- docs-site の `build` と `dev` が、`docs/en` のないリポジトリでサイドバーの走査に失敗して止まる問題を
  修正しました。`config init` は `docs/ja` だけを作るため、README の手順どおりに導入すると最初の
  ビルドで失敗していました。`docs/<locale>` のない言語は走査しません（PJR-EA20）。
- docs-site のビルド結果と cache が package の中（`node_modules/@specdojo/docs-site/.vitepress/`）へ
  出力され、`npm ci` で消える問題を修正しました。出力先は VitePress の既定と同じ、利用リポジトリ直下の
  `.vitepress/dist` と `.vitepress/cache` です。利用リポジトリの `.gitignore` へ `/.vitepress/dist` と
  `/.vitepress/cache` を加えてください（PJR-CA0S）。
- `npm test` が単体テストと統合テストを同時に実行すると負荷で時間切れになる問題を、
  既存の unit / integration 設定を 2 workers で実行し、統合テストには 30 秒の上限を適用する
  project 構成にして修正しました（PJR-W2EB）。
- `devcontainer scaffold` が利用リポジトリの親ディレクトリをマウントし、別リポジトリ構成の
  `repos` と `worktree_base` をコンテナから利用できるようにしました。親配下の Git リポジトリと
  worktree も `safe.directory` の対象になります（PJR-P08H）。
- 日本語主体のタイトルで `register add` の `--topic` を省略したとき、`item` や混在する英単語だけの意味の薄い topic が作られる場合に警告し、起票時の指定方法と `register update --topic` による変更方法を案内するようにしました。日本語タイトルには英語の topic を指定する運用もガイドに明記しました（PJR-17HH）。

- pre-commit hook が生成コマンドと全テストを並列実行したとき、実リポジトリの生成済み登録簿を
  読むテストが書き換えと競合して一時的に失敗する問題を、テスト fixture へ隔離して修正しました。
  checkpoint と統合段の commit / merge が失敗した場合は、秘匿処理した stdout / stderr の全文を
  run の `integrate.log` へ保存し、短い失敗理由にも Vitest の `FAIL`・集計行を残します（PJR-Q7GJ）。
- `exec run` の worktree checkpoint が、root に無関係な staged 変更があるだけで停止する問題を修正しました。checkpoint 対象と重なる場合だけ停止し、commit hook などで checkpoint または register の runner commit が失敗した場合は、runner 対象だけを unstage して既存の staged 変更を保持します（PJR-PJBN）。
- Claude の edit executor がルート直下の成果物や `app/`・`lib/` などを編集できない問題を修正しました。既定でリポジトリ全体への編集を許可し、agent 設定・CI 設定・`package.json` などの保護対象は Claude の deny と runner の検査で拒否します（PJR-TM1B）。
- `exec run --resume` で reporter 段または統合段から再開するとき、統合先で直した不具合が
  親検証に反映されない問題を、親検証の前に統合先の最新を worktree へ取り込む形で修正しました
  （PJR-GENJ）。
- waiting からの再開時に develop の変更を消す可能性がある merge と、複数回の waiting 後に
  記帳競合が未解決のまま残る問題を修正しました（PJR-R0XA、PJR-CTV4）。
- 並行実行時の親検証と遷移・統合をプロセス間で直列化し、イベント競合は両側の和集合で
  解決するようにしました。一部の項目が失敗しても遷移を項目ごとに記録し、ほかの項目の統合を
  妨げません（PJR-3HHW、PJR-36CN、PJR-7MF6）。
- resume 後の executor が plan の残作業を引き継がない問題と、rate limit 後に executor が
  再起動しない問題を修正しました（PJR-1Y9P、PJR-TDB0）。
- 再開前の同期で未 commit の成果と統合先の変更が重なる場合に成果を退避・復元し、統合済みの
  product repository は再度取り込まないようにしました。Git の一時的な
  `dubious ownership`、`Not a git repository`、index lock は、対象に `.git` がある場合だけ
  同じ上限で再試行します（PJR-H9R2、PJR-6RN3、PJR-GHKD、PJR-VX97）。
- executor が親 runner へ委ねた `not_run` は、project で同じコマンドが成功していれば満たされた
  ものと扱います。`npm run check` のような合成コマンドも、その構成要素が runner または executor
  で成功していれば block しないようにしました（PJR-979N、PJR-SDWF）。
- reporter が説明した変更ファイルの件数や順序に依存せず、変更パス、outcome、`block_reason` を
  evidence から機械生成するようにしました（PJR-GBEV、PJR-0ECY）。
- runner が適用外と判定した検証と、executor が変更した runner 管理記録を reporter へ明示し、
  矛盾する確認依頼を防ぎました。引数付きの `npm run` も、script が存在すれば適用外の申告を
  反証します（PJR-2GFH）。
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
  （PJR-GRB5）。OpenCode の導入ファイルは Git で無視されている場合だけ検査対象から除外します
  （PJR-K1ZD）。
- executor の sandbox で `docs:build` が `tsx` の IPC で失敗する問題を、`docs:generate` を
  `node --import tsx` で実行する形にして回避しました（PJR-M8NA）。
- 個票のタイトルに Markdown のエスケープ（`\*` など）が含まれると、plan・result・job の
  frontmatter の `name` が不正な YAML になる問題を修正しました（PJR-C44H）。
- `register add` / `update` のタイトルと説明にある山括弧のプレースホルダを自動でインライン
  コード化しました。waiting 以外への遷移では古い `block_reason` を消し、自動 commit の subject は
  commitlint の長さの上限内に収めます（PJR-A9NC、PJR-SMET、PJR-DAW8）。
- 文書サイトの mermaid の SVG キャッシュが、mermaid-cli の版と `mermaid-config.json` の変更を
  判定に含めず、更新後も古い SVG を使い回す問題を修正しました（PJR-XMMA）。
- 利用者の環境に入る依存のうち、修正版を利用できる脆弱性に対応しました。`js-yaml` を 4.3.2 以上、`dotenv` を 18 に
  上げ、docs-site を puppeteer 25 と mermaid-cli 12 に上げました（PJR-6TKA、PJR-XMMA）。
  docs-lint は `markdownlint-cli` を 0.49 に上げ、使われていなかった
  `remark-lint-frontmatter-schema` を依存から外しました（PJR-7GAK）。
- `fast-glob` を、本体では Node 標準 API による再帰走査、docs-lint では `tinyglobby` に置き換え、
  `micromatch` 経由の `braces` の high の脆弱性を本体の実行時依存から除きました（PJR-HQKV）。
- `repos` を宣言した project の `exec run --worktree` で、`project/` の worktree の `specdojo build` が
  兄弟のプロダクト worktree より先に設定を読み、`repos[].path` の存在検査で失敗する問題を修正
  しました。プロダクト worktree を作成（または再利用）してから build します（PJR-NN43）。
- `--project` なしの `specdojo build` が `current_project` の登録簿しか生成せず、project が複数ある
  生成物のない worktree で index build が失敗する問題を修正しました。`project_register_path` を
  持つすべての project の登録簿を生成してから index build へ進みます（PJR-WJ83）。
- `exec run --register` で agent を指定しない場合に、pipeline 用でない agent（翻訳専用の agent など）が
  owner・role から自動選択される問題を修正しました。既定は pipeline 実行とし、`stage_role` が
  executor・reporter の agent から `priority` 順に選びます。該当する agent がない段は明示の指定を
  求めるエラーになります（PJR-ADZ6）。
- `not_applicable` の判定で、`<repo>:<path>` を引数に含むコマンドと `--prefix <repo>` 付きの
  コマンドをプロダクトリポジトリの `package.json` で判定するようにしました。
  `specdojo catalog validate` は `--project`、run の対象 project、`current_project` の順に対象を
  決めて `catalog_path` を判定します（PJR-WP44）。
- executor がプロダクトリポジトリの検証（`npm --prefix <repo> run <script>`）を `not_run` とした
  場合、同じリポジトリに割り当てた同じコマンドの親検証が成功したときだけ満たされたものと扱う
  ようにしました。project リポジトリや別のプロダクトリポジトリの成功では代用しません
  （PJR-2GZE）。
- プロダクト worktree の作成時に、追跡されている `package-lock.json` がないため依存を導入しな
  かったことが分からない問題に対応し、`Skipping worktree dependencies: …` をログへ出すように
  しました。lock を持つプロダクト worktree では従来どおり `npm ci` を実行します（PJR-86Q5）。
- `--resume` の同期で、統合先に入った内容と同じ未追跡ファイルが worktree に残ると再開を拒否する
  問題を修正しました。同じ内容なら解消して再開し、内容が異なる場合はパスを示して拒否し、元の
  worktree を復元します（PJR-B2EC）。
- register 由来のタスクで、worktree の最上位に新規作成したファイル（`.gitignore`、設定、README
  など）が `targets` なしでは commit されず統合前検査で止まる問題を修正しました。最上位の新規
  ファイルを commit 対象に含め、run の `integrate.log` と result の申し送りへ記録します。`tmp/`
  配下は `.gitignore` の有無によらず commit 対象と統合前検査から除外し、exec plan の共通規約は
  作業用のファイルを `tmp/` かリポジトリ外へ置くよう指示します（PJR-GBVM）。
- `config init` が `.gitignore` に `node_modules/` を追記するようにしました。既存の `.gitignore` に
  同じ意味の行がある場合は追記しません（PJR-J2AS）。
- executor が実行できない `specdojo index build` を `not_run` と記録すると、index を runner が
  再生成していても run が止まる問題を直しました。index build は runner が担う検証として扱い、
  executor には実行も記録もしないよう指示します。あわせて、`specdojo catalog validate` の適用を、
  exec plan の共通規約と同じく変更範囲でも判定し、`docs/ja/projects/` 配下を変えない run の
  `not_applicable` を受理します（PJR-HJ99）。

### 既知の問題

- v0.3.0 の grade は試験的な機能です。npm package では `grade list` / `plan` / `apply` /
  `validate` / `result` などの部品を利用できますが、通しの実行に使う SpecDojo 本体リポジトリの
  開発用スクリプト `tools/grade/run-per-document.sh` は package に含まれません。成果物の grade
  には project の `catalog_path` が必要です（PJR-DJFT）。
- docs-site に high 1 件、moderate 1 件の脆弱性が残っています。mermaid 12 が依存する chevrotain 11 が `lodash-es` 4.17.23 を固定している問題と、vite 経由の `esbuild` に起因するものであり、いずれも上流の対応待ちです（PJR-XMMA）。
- docs-lint に moderate 1 件の脆弱性が残っています。`markdownlint-cli` 0.49.1 が `js-yaml` を
  `~5.2.1` に固定しているためで、上流の対応待ちです（PJR-7GAK）。
- 試験的な `devcontainer scaffold` が生成するコンテナは、利用リポジトリの親フォルダを利用者の
  フォルダ名によらず `/workspaces/specdojo-workspace` にマウントします。また、`--tmux` などの
  任意機能は指定しないと入らず、完了時の案内にも表示されません（PJR-PV5B）。

[0.3.0]: https://github.com/specdojo/specdojo/compare/v0.2.1...v0.3.0
