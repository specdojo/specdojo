---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-sld-specdojo-005-20261115t022048z-76843b70
  type: exec-result
  task_id: T-KATA-WAVE-2-sld-specdojo-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-sld-specdojo-005/T-KATA-WAVE-2-sld-specdojo-005-20261115T022048Z-76843b70/plan.md
  started_at: "2026-11-15T02:20:50.357Z"
  completed_at: "2026-11-15T03:53:00.461Z"
  agent: argon-executor
  execution: agent
  approach: bootstrap
  targets:
    - sld-specdojo
    - specdojo:sld-rulebook
    - specdojo:sld-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物である「保管場所一覧（SpecDojo）」の新規作成および、それに紐づく実践の型（`rulebook` と `sample`）の整備を完了しました。
- `recipe` および `template` については、`rulebook` 内の記述ガイドと構成定義で十分であり、別文書化は冗長であると判断し `not-needed` と宣言しました。
- `sld-specdojo.md` では、リポジトリ内の各ディレクトリや端末側の状態ディレクトリ、実装モジュールとの対応関係を具体化し、運用の判断基準となる標準6列形式で整理しました。
- `sld-rulebook.md` および `sld-sample.md` は、`specdojo:rulebook-authoring-standard` に準拠させ、階層連番の付与や完成例の外出しを行い、同種の `ready` 文書（`cdt-rulebook` 等）と整合させました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sld-rulebook.md`: 既存文書を全面改訂。`specdojo:rulebook-authoring-standard` に従い、5章構成への整理、階層連番の付与、完成例の外出しを実施し、`recipe` と `template` を `not-needed` と宣言しました。
- `docs/ja/specdojo/samples/sld-sample.md`: 既存文書を作り直し。共通サンプル文脈（駄菓子屋きぬや）を用い、物理6区分と論理4区分の具体例を示す完成例として整備しました。
- `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`: 代表成果物として新規作成。SpecDojo の物理・論理保管場所と実装モジュールの対応を定義し、`done_criteria` に基づき置くもの・共有有無・寿命・処分の可否を記述しました。

## 3. 申し送り

- 【実践の型の要否判断（`kata-guide.md` 基準）】`rulebook`（`specdojo:sld-rulebook`）は保管場所の区分・標準6列・削除可否3区分・CDSD や実装配置との責務分離を規定するため「必要（既存を改訂）」と判断した。`sample`（`specdojo:sld-sample`）は rulebook を持つ Markdown 成果物として粒度・文体・表の書き方を示すため「必要（既存を作り直し）」と判断した。一方、`recipe` と `template` は同種のデータモデル領域の型（`specdojo:cdsd-rulebook`、`specdojo:cdt-rulebook`）と同様に、5章構成と標準6列・記述ガイド・サンプルで作成手順と骨格が十分に定まり、別文書に分けると二重管理になるため不要と判断し、`sld-rulebook.md` の frontmatter に `recipe: not-needed` および `template: not-needed` を宣言した。
- 【参考にした `status: ready` 文書】同カテゴリ（`deliverable_type: data`）で `status: ready` の `docs/ja/specdojo/rulebooks/cdt-rulebook.md`（`specdojo:cdt-rulebook`）および `docs/ja/specdojo/samples/cdt-sample.md`（`specdojo:cdt-sample`）、ならびに隣接仕様の `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`・`docs/ja/specdojo/samples/cdsd-sample.md`・`docs/ja/specdojo/samples/clis-sample.md` を参照し、見出しの階層連番、記述ガイドの判断基準・良い例・悪い例、およびサンプルの具体度（約90〜120行）の水準を揃えた。
- 【既存文書の評価と改訂・既存 finding の解消】既存の `sld-rulebook.md` は旧 ID プレフィックス `sll-` や `type` の不一致、サンプル章の埋め込み、階層番号欠落があったため、`specdojo:rulebook-authoring-standard` に合わせて全面改訂し、完成例を `sld-sample.md` へ外出しした。既存の `sld-sample.md` はプレースホルダ的なメタ説明（「何か」「どこから来てどこへ行くか」等）のみであったため、共通サンプル文脈（駄菓子屋きぬやの販売・在庫・記録管理）で物理保管場所6区分と店舗タブレット内論理保管場所4区分を具体化した完成例へ作り直した。
- 【一般化と具体化の役割分担】`specdojo:sld-rulebook` には物理現物・紙帳票・ソフトウェアディレクトリのいずれにも適用できる5章構成・標準6列・削除可否3区分（`削除不可` / `条件付き削除可` / `削除可`）とロール別検証観点を一般化して定義した。`sld-specdojo.md` には SpecDojo 固有の保管場所（リポジトリ内の `docs/`・`controls/`・`execution/`・`generated/`・`.specdojo/doc-index.json`・`execution/exec/.locks/`・`archive/`、端末ローカルの `${XDG_STATE_HOME:-~/.local/state}/specdojo/&lt;repo-hash&gt;/routines/&lt;routines-hash&gt;/`、`&lt;worktree_base&gt;/&lt;task-name&gt;/`、`tmp/`）と実装モジュール（`src/shared/run-records.ts`、`src/routine/storage.ts`、`src/shared/local-state.ts`、`src/exec/worktree.ts`、`.gitignore`）の対応を記述した。
- 【4つの品質チェックオペレーションの確認結果】1) 章構成と責務の適合: `sld-rulebook.md` の必須5章（概要、保管場所一覧、削除・退避・復旧の判断基準、関連仕様・実装配置との対応と検証、確認事項と変更影響）と `sld-sample.md`・`sld-specdojo.md` の章構成が完全一致していることを確認。2) 用語・粒度・メタデータの一致: 標準6列（保管場所、置くもの、関連プロセス・操作、共有の有無、寿命・管理頻度、削除・処分の可否と条件）、`type: data`、`rulebook: specdojo:sld-rulebook`、階層連番（`## 1.`、`### 1.1.`）が3文書で統一されていることを確認。3) 一般化と具体化の境界: rulebook・sample に `prj-0001` 固有の判断が混入しておらず、`sld-specdojo.md` にプレースホルダが残っていないことを確認。4) 完了条件の充足: `sld-specdojo` の `done_criteria`（ARC: 実装配置との一致、BA: 置くもの・共有の有無・寿命・消してよいかの記述、OPS: 消してよい場所と残すべき場所の判断可能性）を満たしていることを確認。
- 【未決事項・今後の引き継ぎ（`_UNDECIDED_` / `_TODO_`）】`cdsd-execution` で未決とされている「監視結果・費用作業記録の物理保管先と保持期間」は推測で確定せず、`sld-specdojo.md` の第5章に `_UNDECIDED_`（追跡先候補 `prj-0001:pjr-monitoring-storage`）として記録した。また、`cdsd-planning`・`cdsd-execution`・`cdsd-sharing` で追加候補（`_TODO_`）とされているデータストア群（タスク実行状態、実行計画と実行結果、実行証跡、タスク実行 worktree、成果物本体、ドキュメントインデックス、プロジェクト構成定義、成果物カタログ）は実装配置が確定しているため `sld-specdojo.md` で保管場所を定義したうえで、CDSD 側の正式登録後の参照同期を `_TODO_`（追跡先候補 `prj-0001:pjr-cdsd-store-sync`）として第5章に記録した。
- 適用外の検証: `npm run validate:schema:file`（今回の変更対象は Markdown ファイルのみであり、YAML（`*.yaml` / `*.yml`）ファイルの変更を含まないため適用外。）
- 適用外の検証: `npm run validate:catalog`（今回の変更対象は `docs/ja/product/` および `docs/ja/specdojo/` 配下であり、`docs/ja/projects/` 配下の成果物・カタログの変更を含まないため適用外。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（`pjr-*.md` や既存の `plan.md` / `result.md`）の変更を含まないため適用外。）

## 4. 進め方と実践の型の適用

bootstrap
