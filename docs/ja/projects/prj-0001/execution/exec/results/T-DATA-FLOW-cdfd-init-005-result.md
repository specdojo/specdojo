---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-init-005
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-init-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-init-005-plan.md
  started_at: "2026-08-09T16:17:13.828Z"
  completed_at: "2026-08-09T16:32:34.749Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: bootstrap
  targets:
    - prj-0001:cdfd-init
    - specdojo:cdfd-rulebook
    - specdojo:cdfd-recipe
    - specdojo:cdfd-sample
    - specdojo:cdfd-template
---

# Edit Result

## 1. 実施内容

`P-01 初期セットアップ` の領域別 CDFD を新設し、既存の共通 CDFD 実践一式を overview 兼用から領域別専用へ再構成した。overview 専用一式と Mermaid 共通記法は変更していない。

- `cdfd-init.md` を新設し、config init、register scaffold、catalog scaffold を必須、provider 設定初期化と exec scaffold を個別の条件付きプロセスとして定義した。
- 一ノード一プロセスの領域内フローに、起動条件、主要入力、生成物、正本・生成先、必須性を対応付けた。必須三プロセスの完了を `P-03 計画展開` の開始条件として引き渡し、任意設定は承認時だけ追加で渡す構造にした。
- 既存ファイル・領域がある場合、入力が不足する場合、生成・検証に失敗する場合を主要例外とし、自動置換の禁止、停止範囲、継続・再開条件を定義した。
- 登録簿運用、計画展開、タスク実行、運用開始後の構成変更を領域外委譲として分離し、引き渡す情報と本領域へ戻す条件を記載した。
- BA、PO、ARC、QE の受入条件を置き、owner の狙いと下流入力の最低ラインを表と図から判定できるようにした。
- `cdfd-rulebook.md` を領域別専用へ作り直し、領域内プロセス一覧、主要例外、領域外委譲、受入確認を必須構造にした。
- `cdfd-recipe.md` を領域別 CDFD の問い、作成順、深掘り、良い例 / 悪い例、レビュー観点、仕上げチェックへ再構成した。
- `cdfd-sample.md` を、共通サンプル文脈の「つけ精算」一領域を扱う最小完成例へ差し替えた。
- `cdfd-template.md` を、領域別構造と一ノード一プロセスの Mermaid 骨格、例外・委譲・受入表を持つ雛形へ差し替えた。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md`（新規）
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`（領域別専用へ再構成）
- `docs/ja/specdojo/recipes/cdfd-recipe.md`（領域別専用へ再構成）
- `docs/ja/specdojo/samples/cdfd-sample.md`（領域別の最小完成例へ差し替え）
- `docs/ja/specdojo/templates/cdfd-template.md`（領域別の雛形へ差し替え）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-init-005-result.md`（実施内容と検証結果を記録）

検証結果:

- `npx prettier --write <変更 Markdown>`: 成功。
- `npx markdownlint <変更 Markdown>`: 成功。
- `npm run -s lint:md`: 成功。
- `npm run -s lint:fm`: 成功。
- `git diff --check`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: tsx CLI が sandbox 内の IPC ソケットを作成できず `listen EPERM` で停止した。代替の `node --import tsx src/specdojo.ts catalog validate` は終了コード 0 で、全8カタログが `OK`。未作成の後続成果物に対する既存 warning のみだった。
- `node --import tsx src/specdojo.ts index build`: 成功。`.specdojo/doc-index.json` に1006件を生成した。
- `npm test`: 74ファイル・989件中、70ファイル・973件が成功。Git 子プロセスを必要とする worktree 系4ファイル・16件だけが sandbox の `spawnSync git EPERM` で失敗した。
- worktree 系4ファイルを除外した `npx vitest run`: 70ファイル・966件が成功し、今回の変更面に関係する失敗はなかった。
- `npm run docs:build`: `tsx` CLI が sandbox 内の IPC ソケットを作成できず `listen EPERM` で停止した。`node --import tsx src/specdojo.ts build` も内部で起動する `tsx` 子プロセスが同じ制約で停止した。
- `npx vitepress build .`: Mermaid SVG 生成用 Chromium が sandbox で起動できず `Operation not permitted` で停止した。新設 `cdfd-init.md` の Mermaid 抽出開始後のブラウザ起動時に停止しており、Markdown、Frontmatter、カタログ、索引の検査エラーではない。

## 3. 申し送り

- 後続の retrofit-pass では、provider 設定の物理的な保持箇所、各 scaffold の既存ファイル処理、部分生成時の確定単位、再試行・検証の現在動作を実装エビデンスから確認する。本 bootstrap では、業務上必要な入力・生成物・例外境界だけを TO-BE として定義した。
- `P-02`、`P-03`、`P-04`、`P-07` の領域別 CDFD は、本書の委譲表にある引き渡し情報を入力として扱い、自領域の内部プロセスと例外を詳細化する。
- overview 専用の `cdfd-overview-rulebook.md` / recipe / sample / template と `cdfd-mermaid-rulebook.md` は plan の境界どおり変更していない。全体概要は一ノード一領域、今回の共通 `cdfd-*` 一式は一ノード一プロセスを正とする。
- 全テストと docs build は、Git 子プロセス、Unix domain socket、Chromium の起動が許可された環境で再実行する。今回の失敗に起因する追跡対象ファイルの追加変更はない。

## 4. 進め方と実践の型の適用

approach は bootstrap とした。内容の根拠は edit plan、対象実践一式、[[prj-0001:cdfd-overview|概念データフロー図（全体概要）]]、プロジェクトコンテキストの [[prj-0001:prj-overview|プロジェクト概要]] に限定した。Web 情報と実装エビデンスは内容根拠に使用していない。

プロジェクトレベルの Why からは、人と AI Agent が同じ正本を参照して判断と作業を引き継ぐこと、人間が社会課題・期待価値・主要判断・公開可否に責任を持つことだけを初期化境界へ反映した。背景と価値仮説の全文は再掲せず、プロジェクトコンテキストを `based_on` へ追加していない。主成果物の `based_on` は、直接の `depends_on` である `prj-0001:cdfd-overview` だけとした。

既存物の評価と判断:

- 主成果物 `cdfd-init.md` は存在しなかったため新規作成した。全体概要の `P-01` から、開始承認、プロジェクト文脈・初期方針、プロジェクト定義・構成、成果物カタログ、運用開始条件、`P-03` への委譲を引き継いだ。
- `cdfd-rulebook.md` は全体概要と領域別を兼用する内容だった。overview 専用一式が既に分離されているため、全体概要の規則を残さず、領域内プロセス、主要例外、領域外委譲を扱う rulebook へ作り直した。
- `cdfd-recipe.md` も領域分割と詳細化先の作り方が中心だったため、領域内のプロセス分割、条件付きプロセス、例外の停止・再開、領域外委譲を深掘りする手順へ作り直した。
- `cdfd-sample.md` は販売・在庫補充・つけ管理の三領域を扱う全体概要の例だったため、領域別 sample として維持できず、共通サンプル文脈の「つけ精算」一領域へ差し替えた。
- `cdfd-template.md` は全体概要向けの領域一覧と詳細化先表を持っていたため、領域内プロセス一覧、主要例外、領域外委譲、受入確認の骨組みへ差し替えた。

実践の型の適用:

- `upsert-rulebook` Skill を適用し、rulebook authoring standard、rulebook 作業手順、Frontmatter schema、既存 `cdfd-rulebook`、構造の近い `cdfd-overview-rulebook`、ready の `prj-overview-rulebook` を確認した。Frontmatter の recipe / sample / template と Mermaid rulebook の `includes` は維持し、本文には実践の型へのリンク章を置いていない。
- `upsert-sample` Skill を適用し、sample authoring standard、sample 作業手順、対応する更新後 rulebook、共通サンプル文脈、既存 `cdfd-sample`、`cdfd-overview-sample`、ready の `prj-overview-sample` を確認した。人物名を使わず、未作成の委譲先は Markdown リンクにせずバッククォートで記載した。
- 両 Skill が前提に挙げる `docs/ja/specdojo/guides/docs-contents-guide.md` はリポジトリに存在せず、移動先も見つからなかった。このため、plan が許可する対象成果物、依存成果物、プロジェクト概要と各 authoring standard を代替根拠とした。
- recipe は recipe authoring standard の8章構成に合わせ、問い・深掘り・良い例 / 悪い例・レビュー観点を領域別 CDFD の作成手順へ一般化した。
- template は template authoring standard に従い、生成物 Frontmatter を `frontmatter_template` に分離し、可変値を `_UPPER_SNAKE_` と共通の未記入ラベルで表した。生成結果が rulebook の本文構成と一致するよう、同じ章・表を配置した。

同種の ready 文書と相互整合:

- 同種の ready CDFD 一式は存在しなかった。形の手本には、同じ Markdown 成果物と実践の型の ready 一式である `prj-overview-rulebook.md` / recipe / sample / template を使用した。章番号、Frontmatter、本文構成表、問い・レビュー表、共通サンプル文脈、`frontmatter_template`、プレースホルダの置き方だけを手本とし、内容は転用していない。
- 内容上の境界は既存 `cdfd-overview.md` と overview 専用一式から引き継いだが、これらは `status: draft` であるため ready の手本としては扱っていない。
- 構造・必須項目・禁止事項は更新後 `cdfd-rulebook.md` を正とした。主成果物、sample、template を「目的と適用範囲」「領域内プロセス一覧」「概念データフロー」「主要例外と領域外への委譲」にそろえ、「主要例外」「領域外への委譲」「受入確認」を同じ下位構造にした。
- rulebook の一覧列を主成果物・sample・template で一致させ、図では一覧の一行を一つのプロセスノードへ対応させた。recipe は同じ成果物を作る問いと判定順へ一般化し、sample は三プロセスの完成例、template は一プロセス行の雛形へ縮約した。
- 旧実践一式に残っていた全体概要の「一ノード一領域」「領域別 CDFD への一対一対応」と、新しい領域別の「一ノード一プロセス」が矛盾する箇所は、overview 専用 rulebook を全体概要の正本、更新後 `cdfd-rulebook.md` を領域別の正本として責務を分離した。
