# Changelog

SpecDojo の利用者に影響する変更を記録します。

## [Unreleased]

`@specdojo/docs-lint` 0.3.1 を 2026-10-29 に公開しました（下記の不具合修正のうち PJR-SC8T の修正を含みます）。`specdojo`・`@specdojo/docs-site` の版は変わりません。ほかの項目は次の版で公開します。

### 追加機能

- 本リポジトリの開発用に `node tools/lint-mermaid.mjs '<Markdown のパスまたは glob>'` を追加しました。docs-site と同じ Mermaid で、ブラウザを使わずに図の構文を検査し、エラーの文書・開始行・図の種類と未検査の件数を報告します。引数なしでは `docs/` 全体を検査します。本リポジトリでは `npm run lint:mermaid` として `npm run check` と commit 時の hook（変更した Markdown）に組み込みました（PJR-B5TY）。

- exec の親の検証に `lint-mermaid`（`npm run lint:mermaid`）を追加しました。`pipeline.parent_validations` に指定でき、利用するリポジトリに `lint:mermaid` script が必要です（PJR-B5TY）。

- プロダクトの作業ブランチ名を `repos[].branch_template` と `exec run --branch <repo>=<name>` で選べるようにしました。項目とブランチの対応を runner が記録し、再開・片付けに使います。別項目との名前の重なりは開始前に停止します。`integration_strategy: ff` は merge commit を作らず早送りだけで統合し、分岐した履歴では停止します。未設定時の名前と `merge`・`branch-only` の動作は従来どおりです（PJR-M1DH）。

- プロダクトリポジトリの `repos[].commit_subject_template` と `repos[].merge_message_template` で、register の exec が作る commit と merge commit の書式を選べるようにしました。8 種類の変数と空 scope の括弧除去に対応し、本文末尾の `Refs:` は常に付けます。未設定時の書式と SpecDojo の記帳は従来どおりです（PJR-Z7GX）。

- 個票に `commit_type` と `commit_scope` を追加し、`register add` / `update` に `--commit-type` と `--commit-scope` を追加しました。Conventional Commits の type・scope を個票ごとに指定でき、`update` では `-` で削除できます。未指定時は項目の type から既定の対応（`issue` は `fix`、`todo`・`change-request` は `feat` など）で解決し、`specdojo.config.json` の `projects.<project-id>.commit_types` や `repos[].commit_types` で対応を上書きできます（PJR-TC62）。

- `deliverable scaffold` に `--target <doc-id>` を追加しました。成果物を 1 つだけ指定して雛形を作成できます（`--dct` との併用は不可）。カタログにない成果物は `--target-path` と `--target-rulebook` を指定して作成できます。template のない rulebook でも最小構成の雛形を生成します（PJR-S23T）。

- 文脈を渡して成果物を作成する流れ（scaffold・文脈記入・`draft`・`fully-guided`・`finalize`）と、文脈の置き場所（成果物内の `_CONTEXT_:`、個票の `入力` / `--input`、カタログの `brief`）の使い分けを `exec-operation-guide` と `ryu-guide` にまとめました。あわせて `tsd-recipe` の「作成前に集める情報」に文脈の置き場所の対応を追加し、静的サイト向け TSD の技術選定を指示して作成する例を掲載しました（PJR-6A2B）。

- schedule に `draft` profile を追加しました。`strategy-planning` で `intent: draft-with-context` を宣言すると、雛形作成・文脈記入（human）→ draft → refine → review → finalize（human）を生成します。human は claim / complete で記録し、文脈記入用の result に雛形作成と `_CONTEXT_:` の案内を表示します（PJR-E45K）。

- `register add` / `update` に繰り返し指定できる `--input` を追加しました。対話で得た前提を個票の `入力` 節と event に記録し、register 経由の plan へ完了条件とは別に渡します。update は一覧置換、`--input -` は全削除です（PJR-6DD7）。

- 成果物内の文脈の目印 `_CONTEXT_:` を定めました。`draft` で反映した指示を result に記録し、`fully-guided` では未反映の指示を論点として残します。finalize の確認と文書 lint で残りを検出し、lint は `ready` で error、それ以外で warning とします（PJR-JRSY）。
- `draft` approach を追加しました。文脈で任された範囲を調べて下書きし、選定値を提案として示して出典と選定理由を記録します。register・schedule・plan で使えます（PJR-3MY5）。

- 成果物カタログ（dct）の成果物に `brief` を追加しました。成果物の外から継続して渡す前提（技術スタックや制約など）を記載でき、schedule の task の plan および register 経由の plan に「前提」として反映します。`brief` が無い場合は plan に載せません。複数成果物で共有する場合は YAML アンカーを利用できます（PJR-YKMA）。

### 変更

- `schedule-design-guide`・`xer-human-draft-template`・`plans-planning.ts` に残っていた雛形作成の案内を、成果物を 1 つだけ作成する `deliverable scaffold --project <project-id> --target <doc-id>` の形にそろえました。これに伴い、カタログ全体の未作成成果物も生成される旨の注意事項を案内から削除しました（PJR-73KT）。

- strategy の `guided-pass`（草案作成）の approach を `fully-guided` から `draft` に変更しました。型がそろった未作成成果物を、文脈の記入がなくても template から下書きできます。調査・選定の委任がない範囲は保留し、後続の refine で `fully-guided` による磨き込みを行います。既存 strategy へは再生成時に反映されます（PJR-E45K）。

- `@specdojo/docs-lint` の `_CONTEXT_:` の検出において、`status: ready` 以外の文書では warning ではなく情報（info）として報告するように変更しました。下書き時に `_CONTEXT_:` を残したまま実行しても `--frail` 付きの `npm run lint:fm` が失敗せず、親の検証を妨げません。`status: ready` の文書では従来どおり error として失敗させます（PJR-D0GB）。

- 配布するオーケストレーターの指示に、対話で得た前提・制約・委任範囲を `--input` で個票の `入力` へ記録し、完了条件と分ける扱いを書き足しました（PJR-6DD7）。

- `fully-guided` を既存成果物の磨き込み専用に整理しました。参照は宣言された文書だけとし、対象成果物の `based_on`、個票の `入力`、カタログの `brief` を参照範囲に加えました。`入力`・`brief` の差し込み口は、値が無ければ「なし」と表示します（PJR-3MY5）。

### 不具合修正

- `specdojo-tmux.sh.sample` の `find_container` で、ラベル `devcontainer.local_folder` が一致するコンテナが見つからない場合に `vsc-` で始まる別のコンテナへ誤って接続していた問題を修正しました。ラベルの一致するコンテナだけを検索対象とし、見つからない場合は `devcontainer up` を呼び出して起動するようにしました。あわせて `docker exec` の前にコンテナ内の作業ディレクトリの存在を確認し、存在しない場合は明示的なメッセージで停止するようにしました（PJR-P9ZC）。

- `decision`・`note`・`epic` など `入力` の章がない種類の個票へ `--input` を指定した際に、末尾に番号のない `## 入力` が追加されて章番号の連続性規約に違反していた問題を修正しました。最初の章の直後に `## 2. 入力` として挿入し、以降の章番号を 1 つずつ繰り下げます。既存の個票に番号のない `## 入力` がある場合も、同様に番号付きの章として適切な位置へ移動します（PJR-790T）。

- `deliverable scaffold` の一括生成と `--target` において、template のない rulebook の最小の雛形の `type` を rulebook の frontmatter で宣言された `deliverable_type` に合わせるように修正しました（未宣言時は従来どおり `project`）。これにより、template のない rulebook を指定して生成した雛形が docs-lint の `frontmatter-deliverable-type` で警告にならず、コミット時ガードを通過します（PJR-YKYK）。

- `@specdojo/docs-lint` の Markdown / YAML frontmatter 検証において、rulebook 一覧の生成をプロセス内でワークスペースごとに 1 回だけ行いキャッシュするように修正しました。remark のファイルごとのプラグイン読み込みで rulebook 一覧が毎回再生成されて `lint:fm` が著しく低速化していた問題を解消します。本修正は `@specdojo/docs-lint` の次の版（0.3.1）で公開されます（PJR-SC8T）。

## [0.5.0] - 2026-10-29

同梱パッケージは `@specdojo/docs-lint` 0.3.0 と `@specdojo/docs-site` 0.3.0 を同時に公開します。docs-lint 0.3.0 は、rulebook の `deliverable_type` と成果物の `type` の照合、YAML 成果物の旧 type のエラー化（下記の破壊的変更の PJR-484B・PJR-0D0T）を含みます。下記の移行手順の検査には docs-lint 0.3.0 が必要です。docs-site 0.3.0 は、生成物の `.vitepress/` への集約（PJR-9ZN5）と、Mermaid の構文エラーで生成を止めない変更（PJR-N9JC）を含みます。

### 破壊的変更

成果物の `type` を rulebook の宣言と照合するようにし、宣言と違う値や旧値は移行期間なしでエラーになります。次の順で移行してください。詳細は下記の各項目を参照してください。

1. `specdojo` を 0.5.0、`@specdojo/docs-lint` を 0.3.0 に更新する（docs-site を使う場合は `@specdojo/docs-site` も 0.3.0 に更新する）。
2. eject した rulebook に `specdojo.deliverable_type` を追加する。
3. Markdown 成果物・sample・テンプレートの生成物 Frontmatter の `type` を宣言値に書き換え、`lint:fm` を通す。
4. YAML 成果物の旧 type（`domain` / `command` / `message`）を置き換え、`validate:schema:yaml` を通す。
5. `specdojo yaml-pages build` で表示ページを再生成する。

- 成果物の `type` に `requirement`（機能・非機能要件・受入基準）と `glossary`（用語集）を追加し、`project` はプロジェクトの管理文書に限定しました。各 rulebook の `specdojo.deliverable_type` を必須とし、Markdown 成果物・sample・テンプレートの生成物 Frontmatter と `lint:fm` で照合します（PJR-484B）。
- 既存の rulebook には、扱う成果物の `type` を `specdojo.deliverable_type` として追加してください。次に、その rulebook を参照する成果物・sample の `specdojo.type` と、テンプレートの `specdojo.frontmatter_template.specdojo.type` を宣言値に書き換えてください。テンプレート自身の `specdojo.type` は `template` のままにします。`lint:fm` を実行し、エラーに表示される宣言値にそろえてください。移行期間は設けず、従来の `project` や `sample` も宣言と違えばエラーにします。
- YAML 成果物も rulebook の宣言と照合します（PJR-0D0T）。既存の bdd は `type: domain` を `data`、ifx-cmd は `command` を `api`、ifx-msg の `x-spec-meta.type` は `message` を `api` に変更してください。gl には `type: glossary` と `rulebook: specdojo:gl-rulebook` を追加し、OpenAPI / AsyncAPI の `x-spec-meta` と IF 一覧にも対応する `rulebook` を記載してください。YAML テンプレートの `metadata_template.type` も宣言値に合わせ、自身の `type: template` は維持します。`npm run validate:schema:yaml` を実行し、エラーに示された置き換え先へ修正してください。旧値は即時エラーとなり、`specdojo-schema: none` / `validate=false` でもメタ情報は検証します。最後に `specdojo yaml-pages build` で表示ページを再生成してください。表示ページは元 YAML の `type` を引き継ぎます。

### 追加機能

- `repos[].integration_strategy` に `branch-only` を指定すると、プロダクトをローカルで merge せず、commit 済みの exec branch を残してプロダクト側の PR レビューへ渡せるようにしました。既定は従来どおり `merge` です。成功後は worktree を撤去し、プロジェクト側は `review` へ進んで result に未統合・branch 名・trace key を記録します。push と PR 作成は行いません（PJR-EXH2）。

- register の子 todo からカタログの判定・生成を行う `catalog-planning` と、scope・intent の宣言から strategy・track を生成する `strategy-planning` を追加しました。対象は `domain:<domain>` / `track:<track>` で指定します。`timeline build` と strategy 生成は、カタログ作成 todo の完了から `catalog_status` を導き、手書き計画との差を警告します（PJR-WAGY）。

- register に track ごとの仕事を管理する `epic` type と個票テンプレートを追加しました。`add` / `update --track` で担当 track を記録・検証し、`--from` でつないだ子項目と状態を epic 別ビューに表示します。epic 自体は `exec run --register`・filter・夜間 queue の実行対象から外し、完了は子項目と schedule を材料に人が判断します（PJR-B4Y4）。

- 登録項目の実行順序を `depends_on` と `register add` / `update --depends-on` で指定できるようにしました。参照先・自己参照・循環を検証し、先行項目が `done` / `decided` になるまで直接実行を停止、sweep・夜間 queue を理由付きでスキップします。一覧の依存列と後続項目の逆引きビューも追加しました（PJR-6RVJ）。

### 変更

- 配布するオーケストレーターの指示（`templates/` の各環境向け）の type の表に `epic` を加え、track を指定して起票し、子 todo へ分解し、epic 自体は実行しない扱いを書き足しました。
- 配布するオーケストレーターの指示に、`--depends-on` で順番のある項目の先行を記録し、`--from` の由来とは区別する扱いを書き足しました。
- `@specdojo/docs-site` が生成するファイルを `.vitepress/` の下にまとめました。Mermaid の SVG と manifest は `.vitepress/mermaid/`、kata のステージングは `.vitepress/kata-staging/` に出力し、ビルド結果には SVG だけを含めます。利用者の `public/` は変更しません。package 同梱の文書は `/ja/specdojo/...` で公開し、eject 済みの文書は利用リポジトリ側を優先します。`config init` が生成する `.gitignore` に `/.vitepress/dist/`・`/.vitepress/cache/`・`/.vitepress/mermaid/`・`/.vitepress/kata-staging/` を追加しました。旧配置の `public/mermaid/` と `specdojo-kata-staging/` は自動では削除しないため、不要になったら削除してください（PJR-9ZN5）。
- 技術領域別の TSD を作成する `specdojo:tsd-recipe` を追加し、`tsd-rulebook` から参照するようにしました。一冊・分冊の判断、採用値と未決事項の整理、段階的な動作確認、秘密情報の扱いを作業順に辿れます（PJR-05GN）。
- `specdojo:tsd-sample` を新しい `tsd-rulebook` に合わせて見直しました。駄菓子屋きぬや販売管理システムのデータベース詳細定義（PostgreSQL / Prisma）を題材とし、対象環境・前提条件、採用設定、導入手順、動作確認、制約・トラブルシュートを満たす完成例に再構成しました（PJR-EVAE）。
- `specdojo:tsd-index-sample` を新しい `tsd-index-rulebook` に合わせて見直しました。技術スタック一覧に版・正本と適用範囲の列を設け、開発・検証・文書化・運用の技術区分と必須・任意の区別を追加し、詳細 TSD サンプルへのリンクを整備しました（PJR-9SXH）。
- sample の `type` は見本にする成果物の種類とし、sample の識別は `id` とファイル名の `-sample` で行う原則を明文化しました。同梱 sample 5 件の `type` を揃え、既存の `type: sample` は互換性のためスキーマで許容します（PJR-XSM8）。

### 不具合修正

- markdownlint の設定がない利用リポジトリで、result の commit 前検査が日本語の長い行（MD013）を拒否する問題を修正しました。設定がない場合は SpecDojo の基本規則を使い、既存設定は優先します。通常の `init` と `config init` は不足する `.markdownlint.yaml` を上書きせずに生成します（PJR-0QW0）。
- plan に展開する grade の finding の `anchor` と本文を、バッククォートを含む場合も壊れないインラインコードで囲むようにしました。引用元に Markdown リンクがあっても、生成した plan が `validate:history-links` に失敗しません（PJR-H988）。
- `@specdojo/docs-site` の Mermaid 図に構文エラーがあっても、`dev` は対象文書とエラーを警告してほかの図とページの生成を続けるようにしました。`build` と `mermaid` は全図を処理し、失敗した図をまとめて報告してから失敗します。失敗した図の SVG を cache に残さず、修正後の変更検知で再生成します（PJR-N9JC）。
- `register add` / `update` の `sample-maintenance` が成果物の `type` を持つ sample を拒否する問題を修正しました。索引で対象を解決し、`id` の末尾 `-sample` で判定します（PJR-XSM8）。
- `project.repos` の文書の grade 結果を `results/<repo 名>/<文書 ID>.yaml` に分離し、別リポジトリの同じ ID による上書きと前回結果の誤参照を修正しました。plan・apply・run の再開・dashboard なども同じ配置を使い、本リポジトリの既存結果の保存先は維持します（PJR-8NWR）。

## [0.4.7] - 2026-10-26

### 追加機能

- カタログのない project でも、既存文書の索引・frontmatter、または個票の `--target-path`・`--target-rulebook` から成果物の approach plan を作れるようにしました。`fully-guided` などの kata 不足は起票時に検証し、`bootstrap` の未作成 kata と `finalize` 系の個票からのチェック表にも対応します。`cross-deliverable-dedup` は引き続きカタログが必要です（PJR-6WQY）。

- `projects.<id>.run.parent_validations_exclude` で、共有 `exec-defaults.yaml` の親検証から ID と実行先が一致する検証を project ごとに除外できるようにしました。除外後に既存の `parent_validations` を追記し、指定のない project の検証は維持します。未知の ID、共有一覧にない組の除外、重複する組は agent 起動前にエラーになります（PJR-P14M）。

- npm package に `specdojo grade run` を追加しました。文書の選択、評価 plan、名簿に基づく agent 実行、marker の機械変換とサイドカー反映を単段で実行し、同じ `--run-id` で未完了の文書だけを再開します。`--by` の別名は実体名で記録し、`--dry-run` で選択と actor を確認できます（PJR-K87Y）。

### 不具合修正

- review 前の grade を CLI 本体で実行し、開発用の `tools/grade/run-per-document.sh` への依存を解消しました。宣言済み `project.repos` の相対パスを grade で扱い、grade 結果・完了条件サイドカーを worktree 分岐前の checkpoint に含めます。`exec scaffold --project` の共通観点を `defaults/` から解決し、観点未設定時は同梱定義を使います。review plan の完了条件表を MD060 に適合させました（PJR-K87Y）。
- OpenCode の scaffold でローカル Ollama の接続・モデル設定を含む `opencode.json`（provider: `ollama-local`）をリポジトリ直下に配置するようにしました。配布する名簿の雛形・agent 定義・接続設定のモデル指定を整合させ、Gemma および Qwen は文脈長 64k を確保するローカル派生タグ（`*-mlx-work-64k`）を標準としました。派生タグ作成手順、接続先設定手順、既存環境の修正手順を OpenCode テンプレートの README および設定ガイドに追記しました（PJR-MB92）。
- `devcontainer scaffold` で生成する `devcontainer.json` の雛形に `shutdownAction: "none"` を追加し、VS Code などのクライアント切断時にコンテナが停止しないようにしました。既存環境の修正手順を常時稼働ホスト運用ガイドに追記しました（PJR-TVGA）。

## [0.4.6] - 2026-10-25

### 追加機能

- `init --slidev` と `config scaffold --slidev` で、Slidev 本体・Prettier plugin と kata 用の整形・markdownlint 除外設定を追加できるようにしました。既存設定・依存は保持し、追加内容を表示します。`init` の Dev Container preset が `full` の場合は Slidev 導入を既定で選び、`--no-slidev` で解除できます。`full` の VS Code 拡張に `antfu.slidev` を追加しました（PJR-84F7）。

### 変更

- 同梱のオーケストレーターの本文で、register の完了条件の記録の書き先を「個票の対応結果」と報告の `handoff` にし、close の前に result だけでなく個票の対応結果も確かめるようにしました（PJR-R1FB）。
- `specdojo init --exec` が書く agent の名簿の雛形を、GPT-6 の系統と normal・expert の 2 段にそろえました。codex の normal は `gpt-6-luna` の `luna-executor`・`luna-review-executor`・`luna-reporter`、expert は `gpt-6.1-sol` の `sol-executor`・`sol-review-executor` です。claude には expert の `opus-executor`・`opus-review-executor` を加えました。別名 `claude-expert-executor`・`claude-expert-review-executor`・`codex-expert-executor`・`codex-expert-review-executor` を加え、`codex-executor` などの既存の別名は `luna-*` を指します。振り分けの表（`routing`）は hard を expert の別名、medium と easy と reporter を normal の別名にします。`init` と `config scaffold` が加える codex の起動スクリプトは `orch:sol`（`gpt-6.1-sol`）と `orch:luna`（`gpt-6-luna`）になり、`orch:terra` は作りません（PJR-9482）。
- 配布する `templates/codex/agents/*.toml` のモデルを名簿の雛形と同じ GPT-6 の系統へ引き上げました。`codex-executor`・`codex-review-executor` は `gpt-6-luna`（`medium`）、`codex-expert-executor`・`codex-expert-review-executor` は `gpt-6.1-sol`（`high`）、`specdojo-orchestrator` は `gpt-6.1-sol`（`medium`）です。既存の `.codex/agents/*.toml` は上書きされないため、移行する場合は `specdojo config scaffold --provider codex --force` で再配置するか、各ファイルの `model` を手動で書き換えます（PJR-EVAQ）。
- 既存の `.specdojo/agent-members.yaml`・`.specdojo/exec-defaults.yaml`・`package.json` は書き換えません。新しい名前へそろえる場合は、名簿の `terra-*` を `luna-*`（`model: gpt-6-luna`）へ、`sol-*` の `model` を `gpt-6.1-sol` へ変え、`aliases` の向き先を合わせます。`package.json` の `orch:terra` は `orch:luna`（`-m gpt-6-luna`）へ、`orch:sol` は `-m gpt-6.1-sol` へ手で直します。手順は exec 設定ガイドの `agent の名簿の 2 段構成と移行` にあります。

### 不具合修正

- 登録簿に項目が 1 件もないとき、`register build` が生成する担当者別と状態別の派生ビューの空の章で空行が連続し、markdownlint の `MD012` に当たる問題を直しました。項目のない章には「該当なし」を書きます。項目がある場合の生成物は変わりません（PJR-ZG0A）。
- `init --lefthook` と `config scaffold --lefthook` の基本設定を `.markdownlintrc` に変更し、これを読み込む `.markdownlint-cli2.yaml` も生成するようにしました。VS Code で CLI2 のファイル別 overrides が効き、`--slidev` は kata の glob に Slidev 用の規則を当てます。commit hook と result 検査は markdownlint-cli を使い続けます。既存設定は保持し、追加例と移行手順を案内します（PJR-50YH）。
- executor の報告に省略可能な `completion_status`（`complete` / `incomplete`）を追加しました。未完了を申告した register 項目は終了コード 0 でも `waiting` となり、理由と残作業、worktree を保持して統合を止めます。`--resume --resume-from executor` で再開でき、欄のない既存報告は従来どおり扱います（PJR-XTE6）。
- `kata list`・`kata status` の kata 候補と `kata eject` の ID 選択を `.md`・`.mdx`・`.yaml`・`.yml`・`.json` にそろえ、同名 CSS などを別の kata として扱わないようにしました。`kata eject`・`kata install --all` は同名の付属ファイルと同名ディレクトリ内の画像などもコピーし、`--dry-run`・`--force` をファイルごとに適用します。付属ファイルだけの差分も親 kata の `modified` に含めます（PJR-6HS2）。
- `register update` で approach・target・source を変更しない場合、記録済みの組み合わせを再検証しないようにしました。authoring の kata が作成された後も、担当・期限・優先度などの更新を続けられます。approach 関連の値を変更する場合と `register add` では従来どおり検証します（PJR-JJBY）。
- executor の報告に省略可能な `handoff`（申し送り）を追加し、reporter の処理後に runner が edit result の申し送りへ確実に転記するようにしました。register の plan も、result への記載を求める完了条件を個票の対応結果と報告の `handoff` に記録するようにしました。`handoff` のない既存の報告も引き続き受け付けます（PJR-R1FB）。
- `external_projects` で SpecDojo 自身のリポジトリへ起票できるようにしました。相手に `node_modules/.bin/specdojo` がなく、`package.json` の `name` が `specdojo` の場合は `node <相手>/dist/specdojo.js` を使います。未ビルドの場合は `npm run build` を案内して停止します（PJR-PM2R）。
- 着手の checkpoint・待ち状態の記帳・統合の commit が hook で失敗したとき、空白を含む step 名（`lint Markdown documentation` など）でも、成功した Prettier の step ではなく、失敗印の付いた step と最初の error の行を要約するようにしました。checkpoint の失敗要約を補足説明より前に置き、`block_reason` にも原因を残します（PJR-68KR）。
- owner の role に当てはまるレビュー観点がないとき（カタログや `pm-roles.yaml`・`pm-review-viewpoints.yaml` がない project など）、edit plan のレビュー観点の欄を `_MISSING_` だけの段落ではなく箇条書きの 1 項目（`- _MISSING_`）にしました。`rulebook-maintenance` などの kata の見直しの plan が、着手の checkpoint の commit で hook の markdownlint（MD036）に止められていました（PJR-SS72）。

## [0.4.5] - 2026-10-24

### 追加機能

- kata authoring の手本を `register add` / `register update` の繰り返し可能な `--source` で指定できるようにしました。文書索引の doc id、プロジェクトリポジトリのファイル・ディレクトリ・glob、`repos` で宣言したプロダクトリポジトリの `<repo>:<path>` を使え、カタログがない project でも authoring plan を生成できます（PJR-ZV60）。

## [0.4.4] - 2026-10-24

### 変更

- 利用者が作る kata の配置を `docs/ja/kata/<種類>s/` から `docs/ja/specdojo/<種類>s/<kata_authority>/` へ変更しました。0.4.4 のあいだは旧配置も警告付きで読み、新旧に同じ ID がある場合は新配置を優先します（PJR-EKRW）。

### 不具合修正

- `init --catalog small` が生成する、成果物がまだない領域の空の `groups` を `catalog build`・`catalog validate`・`specdojo build` が受理するようにしました。`groups` の省略や配列以外の値は引き続きエラーにします（PJR-C95G）。
- `register build` が生成する登録簿一覧・派生ビュー・PM ログで、自由記述セルの素の HTTP(S) URL を autolink にするようにしました。全角の括弧や句読点、半角の閉じ括弧は URL の外へ残し、既存の autolink・Markdown link・コードスパンは保持するため、markdownlint（MD034）で止まりません（PJR-4J4A）。
- 同梱のオーケストレーターの本文の冒頭に、この文書そのものが指示の全体であり、同じ名前の Skill や agent の定義のファイルを別に探さないことを加えました。codex で起動したときに、存在しない `SKILL.md` を読もうとして警告が出ていました（PJR-YYSD）。

## [0.4.3] - 2026-10-23

### 追加機能

- 既存成果物を手本に kata だけを新規作成する `rulebook-authoring` / `recipe-authoring` / `sample-authoring` / `template-authoring` approach を追加しました。利用者の kata はリポジトリ単位の `kata_authority` と `docs/ja/kata/` 配置で同梱 kata から分離し、手本の未決参照は同じ実行で新しい ID へ更新します（PJR-CT6G）。
- Dev Container の preset に、provider の CLI と最低限だけを入れる `minimal` と、推奨構成に開発ツール・Ollama 接続・cron を加える `full` を追加しました。`specdojo init` では `minimal` / `recommended` / `full` を選択でき、既定は従来どおり `recommended`、従来の `none` は `minimal` の別名として利用できます（PJR-47S6）。
- Dev Container の推奨 preset に GitHub CLI（`gh`）を加え、コンテナ内で行ったログインをリポジトリ別の名前付き volume に保存するようにしました。ホストの認証情報はマウントせず、自動ログインもしません。共有された認証を agent が使ってリモートを書き換えないよう、Claude Code・Codex・OpenCode・Antigravity の配布権限では `git push` と `gh` の書き込みを拒否します。pipeline executor と reporter は全 `gh` を拒否し、Claude Code と OpenCode の対話型オーケストレーターだけは専用権限で読み取りを許可します（PJR-ZH7Q）。
- `specdojo.config.json` の `external_projects` で別リポジトリの project を別名付きで宣言し、`register add --project <別名> --commit` から相手にインストールされた SpecDojo へ起票を委譲できるようにしました。`--from <別名>:PJR-XXXX` は相手の実 project ID へ変換し、`orchestrator launch` は宣言した外部リポジトリにも編集許可を付けます（PJR-5B42）。

### 変更

- ドキュメントサイトの Mermaid 12 で既定のレイアウトを Dagre から ELK へ切り替え、複雑な図を層状・直角配線で描くようにしました。日本語と絵文字のフォントを描画環境へ揃え、図中の絵文字が欠けないようにしました。文書編集ガイドには、辺が多い図の分割、中心へ矢印を集める `architecture` 図、格子状に並べる `block` 図の書き方を追加しました（PJR-QF45）。

### 文書

- Quick Start ガイドを register のユースケース別の実行例を中心に組み替え、`difficulty` と approach、統合後 review、夜間実行、再開、別 project への起票を「こんなとき」「チャットでの頼み方」「コマンド」の順で追加しました。成果物カタログ、Schedule、worktree、routine は発展手順として後段にまとめました（PJR-98SQ）。

## [0.4.2] - 2026-10-22

### 追加機能

- `specdojo init --lefthook` と `specdojo config scaffold --lefthook` で、利用リポジトリ向けの `lefthook.yml`、SpecDojo 文書向けの markdownlint 設定と agent 定義の除外、依存なしの入口スクリプトを生成できるようにしました。pre-commit は staged の Markdown・YAML に対する Prettier、Markdown に対する markdownlint、設定済みパスの変更に対する `register build`・`catalog validate` を実行します。既存ファイル・npm script・依存は上書きせず、package への追加内容を先に表示します（PJR-7H7N）。
- 別 project の作業ツリーから `register add --project <project-id> --commit` を実行し、対象 project の統合ブランチへ直接起票できるようにしました。統合ブランチは project の `integration_branch` で指定でき、省略時は `project/<project-id>/develop` です。project 修飾した `--from` は参照先 project の統合ブランチから存在を確認します（PJR-W93C）。

### 変更

- ドキュメントサイトでは exec の plan / result をページ生成の対象から外し、実行記録一覧などからのリンクを GitHub 上の正本へ置き換えるようにしました。元の実行記録と dead link 検査は維持したまま、ページ数とビルド時のメモリ使用量を削減します（PJR-98P8）。
- `templates/init-agent-members.yaml` で配布する OpenCode の `gemma-reporter` の既定モデルを 26b（`ollama-local/gemma4:26b`）にし、`gemma-executor`・`gemma-review-executor` および対話型オーケストレーターのモデル名からローカル固有のタグ（`-mlx-work-64k`）を除いて利用者が `ollama pull` で取得できるタグ名（`ollama-local/gemma4:31b`）に改めました。また `templates/opencode/README.md` に文脈長拡張のための Modelfile 手順と既存名簿の書き換え案内を追記しました（PJR-2ASZ）。

### 不具合修正

- plan / result の stem、アーカイブ済み plan、実行 event の乱数部分を2バイトから4バイトへ広げ、同じ slug・UTC秒・乱数が重複した場合は連番で別名にするようにしました。event は排他的な新規作成で既存履歴を上書きせず、旧形式の plan 名も引き続き読み取れます（PJR-CNNT）。
- `templates/lefthook/tools/specdojo-pre-commit.mjs` で、commit したファイルが `.markdownlintignore` や `.prettierignore` で除外されて検査対象がなくなった場合に、markdownlint や Prettier を呼ばずに成功で終えるようにしました。除外ファイルのみを commit したときに markdownlint の使い方の説明（Usage）が出力される問題を解消します（PJR-62T2）。
- `register build` が生成する登録簿一覧・派生ビュー・PM ログで、自由記述セルのアスタリスクとアンダースコアをエスケープするようにしました。既存のコードスパンとエスケープ済みの記号は保持し、`orch:*` のような記述が複数ある場合も markdownlint（MD037）で止まりません（PJR-6SQH）。

### 文書

- `templates/opencode/README.md` に、Mac の Apple シリコン向けに Ollama の公式 mlx 版（`gemma4:26b-mlx`・`gemma4:31b-mlx`）を利用する場合の指定方法と Modelfile での文脈拡張の案内を追記しました（PJR-STB4）。

## [0.4.1] - 2026-10-21

### 追加機能

- `.specdojo/specdojo.config.json` の `projects.<id>.run.parent_validations` で、共有 `exec-defaults.yaml` の `pipeline.parent_validations` に project 固有の親検証を追加できるようにしました。`{ id, repo }` も指定でき、プロダクトリポジトリを持つ project だけに検証を加えても、同じ defaults を使うほかの project には影響しません（PJR-HE9R）。
- `specdojo config scaffold --workspace` で、`repos` の設定から VS Code のマルチルートワークスペース（`<project-id>.code-workspace`）を生成できるようにしました。プロジェクトリポジトリ自身と `repos` で宣言された各プロダクトリポジトリを `folders` に宣言順で並べ、別リポジトリ構成でも 1 つのウィンドウで開発できます。`--project` で対象 project を指定でき（省略時は `current_project`）、既存のワークスペースファイルは `--force` を指定しない限り上書きしません（PJR-87XS）。
- `exec run --register --worktree` に、プロダクトリポジトリの統合先を run ごとに上書きする繰り返し可能な `--integration-branch <repo>=<branch>` を追加しました。指定は `repos[].integration_branch` より優先し、指定がなければ従来どおり設定値または現在のブランチを使います。並列実行では各 item run に適用し、再開時は checkpoint に保存した値を再利用して途中変更を拒否します（PJR-XRAB）。
- register 個票に `difficulty`（`hard` / `medium` / `easy`）を追加し、`exec-defaults.yaml` の `routing` で難易度ごとの executor・reporter・rate limit 対応・fallback を選べるようにしました。`exec run --register` と夜間 orchestrator が同じ表を使い、CLI 指定は表より優先し、難易度または表がない既存個票は従来の `priority` 自動選択を維持します。`specdojo init --exec` も選択した provider に合う表を生成します（PJR-5HYP）。

- `devcontainer scaffold --preset recommended` を追加しました。端末版 Emacs と Vim、tmux、SpecDojo の文書作業向け VS Code 拡張・保存時整形・YAML schema 関連付けをまとめて設定し、同じ拡張を `.vscode/extensions.json` にも推薦します。個別の `--editor`・`--tmux` と併用でき、既存のエディタ設定は上書きしません。`specdojo init` では Dev Container を選んだ場合だけ推奨 preset の利用を質問し、`--yes --devcontainer` では利用します（PJR-EN6M）。

- 親 runner の検証（`pipeline.parent_validations`）の固定許可リストに `build`（`npm run build`）と `format-check`（`npm run format:check`）を追加しました。別リポジトリ構成などでプロダクトリポジトリのビルドと整形の検証を親 runner に委譲できます（PJR-NS8Y）。
- `exec run --register --post-review`（または `exec-defaults.yaml` の `register_post_review: true`）で、統合の後に review の agent が完了条件・result・差分・検証の結果を照らして判定するようにしました。`complete`・`complete-with-findings` なら todo と issue を close し、`incomplete` なら `waiting` に戻します。decision と question、SpecDojo 自身のコードを変えた項目は自動では close しません（PJR-T46Y）。
- `register update --autopilot approved` で夜間に流してよい個票に印を付け、`specdojo orchestrator night` が印のある `open` の todo と issue だけを、worktree・統合後の review・並行で流すようにしました。1 晩の件数・並行数・連続した失敗での停止・rate limit のときの切り替えを指定でき、close したもの・`waiting` に戻したもの・新しく起票した承認待ちを朝の報告にまとめます（PJR-6DHY）。

### 変更

- `specdojo init` と `config scaffold` が追加するオーケストレーター起動スクリプトをモデルの系統名へ揃えました。Codex は `orch:sol`（`gpt-5.6-sol`）と `orch:terra`（`gpt-5.6-terra`）、Antigravity は `orch:flash`（`gemini-3.8-flash-high`）を追加し、旧 `orch:codex`・`orch:agy` は作りません。既存の `package.json` のスクリプトは上書き・削除しないため、scaffold の再実行後に新しい名前で起動を確認してから旧スクリプトを手動で削除してください。Claude Code と、利用環境ごとにモデルが異なる OpenCode の名前は変わりません（PJR-16S0）。
- 同梱のオーケストレーターの本文に、承認の聞き方（コマンドではなく、何をするか・中身・影響を日本語で示す）、実行の運び方、close の前の確かめ方、止まったときの対処の表、完了条件の書き方、agent の選び方を加えました（PJR-C50G）。

### 不具合修正

- `register` の `--by` を人・agent の名簿と予約 actor の一覧に照合し、agent alias は実体名へ解決して event に記録するようにしました。未知の名前や `PO` などの Role code は書き込み前に拒否し、省略時は予約 actor の `SpecDojo` を使います。対話型オーケストレーターの名前は `specdojo-orchestrator` に統一しました（PJR-3K1X）。
- exec の result へ executor / reporter の自由記述を描くとき、アスタリスクやアンダースコアを含む ASCII トークンをコードの書式にして、Markdown の強調と誤解釈されないようにしました。既にコードの書式で囲まれた部分は保持します。検証の適用外理由に `*.yaml` と `*.yml` を並べても markdownlint（MD037）で統合前に止まりません（PJR-A6PV）。
- ローカル LLM や provider API へ接続できず、`Cannot connect to API`・`ECONNREFUSED` などで指名した executor / reporter が失敗した場合に、`--fallback-executor-by` / `--fallback-reporter-by` で指定した agent へ切り替えるようにしました。接続不能の文言は provider ごとの `connection_error_detection` で設定し、`--on-rate-limit` の値とは独立して1回だけ fallback します。切替履歴は rate limit と同じく pipeline state・evidence・result に記録します（PJR-DKD8）。
- devcontainer の scaffold で生成する `post-create.sh` で、volume のマウント先の親（`~/.local`・`~/.local/share`・`~/.config`）の所有者をコンテナの利用者へ戻し、`~/.local/bin` を作成して `PATH` に加えるようにしました。Docker が親ディレクトリを root 所有で作成した環境でも Claude Code などのインストーラが失敗しないようにします。また、常時稼働ホスト接続サンプル `specdojo-tmux.sh.sample` の `docker exec` に `-u` で利用者（`devcontainer.json` の `remoteUser`、既定は `node`）を渡し、コンテナの既定の root で入らないようにしました（PJR-GHBP）。
- devcontainer の scaffold で生成する `devcontainer.json` に `remoteEnv` を設定し、`/home/<remoteUser>/.local/bin`（既定は `/home/node/.local/bin`）を `PATH` の先頭に追加するようにしました。コンテナ作成後に開く端末や VS Code のターミナルで `~/.local/bin` が `PATH` に入らず、Claude Code などの CLI が見つからない問題を解消します。常時稼働ホスト運用ガイドに既存環境の修正手順を追記しました（PJR-5JRJ）。
- 常時稼働ホスト接続サンプル `specdojo-tmux.sh.sample` で、`node_bin_dir` を設けて `/opt/homebrew/bin`・`/usr/local/bin` とともに既定で `PATH` の先頭へ追加し、冒頭コメントに `dirname "$(command -v devcontainer)"` による確かめ方と Homebrew・nvm・mise の例を記載しました。また、`devcontainer` と `docker` が見つからない際のエラー案内にその時点の `PATH` と置き場所の確かめ方を表示し、`ssh-config.sample` と常時稼働ホスト運用ガイドに `RemoteCommand` では端末の `PATH` 設定が読み込まれない注意と `ssh <host> 'command -v devcontainer'` による確認方法を記載しました（PJR-EJ4F）。

- `validate:schema:file`・Prettier・markdownlint の `not_applicable` を、script や依存 package の有無だけでなく executor が変更したファイルの種類も含めて判定するようにしました。対象種類の変更がない run は適用外として受理し、対象変更がある run の誤申告は従来どおり拒否します（PJR-8WBN）。
- executor が親検証と同じコマンドを `not_applicable` または `not_run` と報告しても、同じリポジトリで親 runner が実行した結果を正とするようにしました。親検証が成功している run が executor の重複報告によって `waiting` で止まる問題を解消し、親検証でない誤った `not_applicable` は従来どおり拒否します（PJR-7AW0）。
- exec の雛形を展開するときに、2 行以上続く空行を 1 行にまとめるようにしました。夜間の承認の印（autopilot）がない個票の register の plan では制約の段落が空に展開されて空行が重なり、plan を commit する hook の markdownlint（MD012）で `exec run --register` が止まっていました。agent の Job の plan や保守系の plan など、ほかの雛形で段落が空に展開される場合も同じくまとめます（PJR-283N）。
- runner の git の操作が `.git/index.lock` の取り合い（`Unable to create '...index.lock': File exists`、日本語のメッセージを含む）で失敗した場合のやり直しを、合計 0.75 秒ほどから 1.5 秒間隔で最大 10 回へ広げ、やり直すたびに警告を出すようにしました。並行の run の統合や記帳と重なっただけで統合が止まり run が `waiting` になる問題を減らします。上限に達した場合は従来どおり失敗として報告し、残っていたロックのファイルのパスをメッセージの先頭に含めます。ロックのファイルは消しません（PJR-G90K）。
- result（edit・review・post-review）で reporter が返した文を箇条書きに描くとき、文の先頭の `1.`・`1)`・`-` などのリスト記号を外すようにしました。review の agent が判断の根拠に自分で番号を付けると `- 1. ...` が入れ子の番号付きリストになり、post-review の記帳の commit が hook の markdownlint（MD029）で失敗して、close の記帳が作業ツリーに残っていました（PJR-0EFN）。
- commit の失敗を hook の出力から要約するとき、最初に出力された step ではなく、lefthook の summary で失敗の印が付いた step と、その出力のうち error を含む最初の行を報告するようにしました。post-review の記帳の commit が失敗したときは、失敗した hook の名前・最初のエラーの行・作業ツリーに残った記帳のファイル・hook の全出力のログ（`post-review-commit.log`）を runner のログに出します（PJR-0EFN）。
- `not_applicable` の判定で、プロダクトリポジトリを `$SPECDOJO_REPO_<NAME>`・`${SPECDOJO_REPO_<NAME>}` で指すコマンドを、そのリポジトリのコマンドとして扱うようにしました（PJR-E412）。

### 文書

- README・ドキュメントサイトのトップ・全体概要ガイド・遂行の技活用ガイドで、呼び方の表記を「Spec道（仕様道）の道場」に揃えました（PJR-EVAX）。
- Quick Start ガイドの導入手順で、Dev Container を作成し推奨 preset（tmux・Emacs・Vim・推奨の VS Code 拡張と設定・`.vscode/extensions.json`）を適用する対話例と、`devcontainer scaffold --preset recommended` の例に揃えました。コンテナを開く方法や、Dev Container を使わずに進める手順、`init --yes --devcontainer` で推奨 preset が入る説明も補記しました（PJR-SVHF）。
- README の「会話で操作する」の例で、オーケストレーターの発言をコマンドの提示から、何をするか・中身・影響を日本語で示して承認を求める形に改めました。コマンドは既定では見せず求めたときに見せる説明に合わせました（PJR-7P27）。

## [0.4.0] - 2026-10-18

同梱パッケージは `@specdojo/docs-lint` 0.2.1 を同時に公開します。docs-lint は 0.2.0 以降の変更（js-yaml の 5.4.3 への更新。引用符なしの日付と merge key は 4 系と同じ規則で読み込みます。PJR-RCVS）を含みます。`@specdojo/docs-site` は、この版では公開しません。

### 追加機能

- devcontainer の scaffold（`specdojo init --devcontainer` を含む）で、常時稼働ホスト接続用のサンプルスクリプト（`specdojo-tmux.sh.sample`）と接続元 SSH 設定サンプル（`ssh-config.sample`）を `.devcontainer/remote-host/` に生成するようにしました。`devcontainer.json` に設定された公開ポート（`appPort`・`forwardPorts`）に応じた `LocalForward` も含め、scaffold 完了時に置き場所とコピー先を案内します。`init --devcontainer` ではスクリプトの前提となるコンテナ内 tmux も自動で有効化します（PJR-CCXN）。
- agent 名簿の alias を `--by`・`--executor-by`・`--reporter-by`・fallback の指定、Schedule / Job / routine の指名で実体へ解決し、実体の `model` を provider の `command_template` の `{model}` へ渡すようにしました。event と result の actor には実体名を記録します（PJR-YK1C）。
- 登録項目の起票元を個票 Frontmatter の `derived_from` に記録できるようにし、`register add` / `update` の繰り返し指定可能な `--from`、元項目から派生先を辿る生成ビュー、`register history` の変更履歴に対応しました。decision から起票した todo の追跡にも同じ関係を使えます（PJR-7WME）。
- 指名した agent が rate limit になったとき、`--on-rate-limit wait|fallback|stop` と executor / reporter 別の fallback 指定で、同じ agent の再開待ちまたは代替 agent への切替を選べるようにしました。`exec-defaults.yaml` の `rate_limit_policy.pinned` でも既定を設定でき、従来互換の既定は `stop` です（PJR-BHMH）。
- `register add` / `update` に `--approach` と繰り返し指定できる `--target` を追加しました。個票で進め方と対象文書を宣言でき、成果物はカタログ、kata は文書索引で解決します。解決できない対象、成果物と kata の種別違い、`approach` と複数対象の組み合わせは書き込み前に拒否します（PJR-ZJXQ）。
- `exec run --register` は、個票に `approach` があれば、schedule のタスクと同じ plan の作り方（approach のテンプレート、kata の参照、DCT の `done_criteria`）を使うようにしました。個票の完了条件は追加の条件として plan に載り、owner には個票の `owner` を使います（PJR-H06F）。
- agent 名簿（`agent-members.yaml`）に、実体の `model`・`effort` と、実体を指す別名（`aliases`・`alias_of`）を書けるようにしました。別名の循環、存在しない実体や無効な実体を指す別名は、名簿の読み込み時にファイルと名前を示してエラーにします。今の 1 段の名簿もそのまま使えます（PJR-EANK）。
- Job Run で、Job 定義の `partial_exit_code` に一致する終了を部分成功（`partial`）として記録し、review の判定が `complete-with-findings` なら評価できた分を統合するようにしました。grade の Job は、一部の文書の評価が失敗したときに 2 で終わります。全件の失敗・上限・中断は従来どおり `waiting` で止まります。`routine list` にも `partial` が表示されます（PJR-VGNG）。

### 変更

- 対話式の `specdojo init` から成果物カタログの質問を除き、`--catalog <size>` を明示した場合にだけ作成するように変更しました。導入直後の混乱を防ぎ、成果物が定まってから `catalog scaffold` で追加できるようにします。初期化の最後の案内でも `catalog scaffold` と `catalog_path` の設定手順を示します（PJR-G5AB）。
- approach のない実行（register の todo・issue など）の result で、第 4 章の見出しを「4. 進め方」にし、記入の指示をどう進めたか・根拠にした文書や規約に改めました。approach のある実行（schedule のタスク、approach を持つ個票）は「4. 進め方と実践の型の適用」のままです（PJR-S9QF）。
- `specdojo init --exec` と `config scaffold` が配布する agent の名簿と定義を、実体と別名の 2 段構成に改めました。実体は model の系統と役割で名付け（`sonnet-executor`・`terra-executor`・`gemma-executor`・`flash-executor` など）、`model` を持ちます。従来の名前（`claude-executor`・`codex-executor`・`opencode-executor`・`agy-executor` など）は `aliases` の別名として残し、init は選んだ provider の別名だけを書きます。claude と opencode の agent の定義は役割ごとの 1 ファイルにまとめて `model` を外し、`command_template` は `--agent {agent} --model {model}` と `command_params.by_mode` で組み立てます（`claude-expert-review-executor.md` は配布しません）。codex と antigravity の `command_params` からも `model` を外しました（PJR-8TGQ）。
- 既存の 1 段の名簿と `--agent {nickname}` の `command_template` は変更しなくても動きます。init は既存の名簿を上書きせず、scaffold も `--force` なしでは既存の定義を上書きしません。`--force` で役割ごとの定義に置き換える場合は、exec 設定ガイドの「agent の名簿の 2 段構成と移行」の手順（実体の名前と `model` を加える、従来の名前を `aliases` へ移す、`command_params` の `model` を外す、`command_template` を改める、`--dry-run` で確かめる）で 2 段へ移してください（PJR-8TGQ）。
- exec の plan で、共通の規約（記法・成果物規約）の全文を本文に差し込むのをやめ、守らないと失敗に直結する要点だけを残すようにしました。詳細は plan に記したパス（npm で導入した場合は `node_modules/specdojo/docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`）を作業前に読むよう指示します。要点は同じファイルの `plan-essentials` マーカーの間から取り出します。既存の plan は書き換えません（PJR-2219）。要点には検査の扱い（`package.json` と hook の設定を読んで適用条件から実行する検査を決める、当てはまらない検査は `not_applicable` と理由を報告する、`not_run` は実行できたのに実行しなかった検査だけに使う）も含めます。npm script も Markdown の lint もない新しいリポジトリで、executor が詳細を読まずに `not_run` と報告し、最初の実行が止まる問題を防ぎます（PJR-Z104）。

### 不具合修正

- `devcontainer scaffold` が親ディレクトリを常に `/workspaces/specdojo-workspace` としていた問題を修正し、ホスト側の親名を反映するようにしました。`--workspace-name` で明示的に固定でき、`specdojo init --devcontainer` からも指定できます。既に生成済みの `.devcontainer/` は、`--force` で作り直すまで従来のままです（PJR-8GQ4）。
- 対話式の `specdojo init` で provider などの入力を誤ると、最初から入力し直しになっていた問題を修正しました。答えを質問ごとに確かめ、誤りがあればその質問だけを聞き直します。非対話（`--yes` や引数での指定）では、従来どおり誤りの理由を出して終えます。Claude Code を選んだときの最後の案内も、`npm run orch:opus` に揃えました（PJR-B3XQ）。
- exec の worktree を作るときに、git が一時的なエラー（dubious ownership など）を返しても実際には作成できていた場合、再試行が「branch がすでにある」で失敗していた問題を修正しました。再試行の前に目的の状態を確かめます（PJR-DT3Q）。
- exec の checkpoint の確認で git が失敗したときに、原因が記録されなかった問題を修正しました。終了コードと stderr を失敗のログとエラーのメッセージに含めます（PJR-CY80）。
- exec の result で、reporter が変更ファイルごとの説明を返さなかった場合に、定型文（「reporter の説明がないため、変更差分を参照。」）の代わりに Git の変更情報（追加・変更・削除・名前の変更、行数）を記録するようにしました。変更ファイルが 50 件を超える場合は、ディレクトリごとに集約して記録します（PJR-8TS6）。
- `register build` が生成する一覧（`pjr-index.md` と派生ビュー）で、個票のタイトル・説明・結論などのセルに含まれるパイプ文字（`|`）と改行をエスケープするようにしました。セル内のパイプ文字で表の列がずれ、markdownlint（MD056）で失敗する問題を解消します（PJR-FXPH）。
- register の plan テンプレート（`xep-register-template`・`xep-register-investigate-template`）の対象項目からサイズが大きくパスも古かった登録簿一覧（`pjr-index.md`）を外し、進め方の最初を個票のみを読む指示に改めました。文脈長の小さい agent が一覧を読んで文脈を消費し停止する問題を防ぎます（PJR-SJ0G）。
- `routine run` の実行中に、`routine list` などが前回の結果と理由をそのまま表示していた問題を修正しました。開始時に `last_result` を `running` にし、終了時に今回の結果で上書きします（PJR-2CQR）。
- `exec run --on-rate-limit wait` で、codex の usage limit（`try again at 11:17 PM`）の解除まで待たずに止まっていた問題を修正しました。agent の出力の全体（codex が表示した設定ファイルなどの内容を含む）から最初に見つかった時刻を使っていたため、設定ファイルの例の `resets 4:10am (UTC)` を解除の時刻と読んでいました。解除の時刻は出力の末尾の行から読みます。agy の `Resets in 4h36m50s` のような相対の形も読みます。待機を飛ばすときのログは、解除の時刻を読めない場合（元の出力の行を表示）、過ぎている場合、上限を超える場合で分けました（PJR-NJ6J）。

- `npm init` が `package.json` に入れる仮の `test` script（`echo "Error: no test specified" && exit 1`）があるリポジトリで、executor が `npm test` を `not_applicable` と報告しても runner が退け、最初の実行が `waiting` で止まっていた問題を修正しました。仮の `test` script（引用符や空白だけが違う変種を含む）は script がないものとみなし、共通の規約の検査の表にも同じ扱いを書きました。本物の test script がある場合は従来どおり退けます。`specdojo init` は利用者の `package.json` を書き換えません（PJR-6EF8）。

### 文書

- README の始め方を、ランディングページ（<https://specdojo.org/>）と同じ `npx specdojo init` の手順と `<アプリ>-workspace/<アプリ>-specdojo` の構成に揃え、specdojo.org へのリンクを加えました（PJR-Y79W）。
- exec 運用ガイドに、登録簿（register）の todo から approach を使って成果物や kata（実践の型）を作成・修正する手順を追加しました。個票での approach と target の指定方法、kata 保守の approach の選び方、plan 生成内容、組み合わせ検証、および `exec run --deliverable` との違いと推奨経路を記載しました（PJR-4Z6N）。
- オーケストレーター運用ガイドに、Claude Code などの plan モードの plan と register の使い分けと、plan の下書きを decision と todo へ書き写す流れを加えました（PJR-YFBW）。

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
