---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-overview-006
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-overview-006
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-overview-006-plan.md
  started_at: "2026-08-09T16:00:03.396Z"
  completed_at: "2026-08-09T16:11:26.092Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: bootstrap
  targets:
    - prj-0001:cdfd-overview
    - specdojo:cdfd-overview-rulebook
---

# Edit Result

## 1. 実施内容

概念データフロー図（全体概要）の本文を評価して維持し、overview 専用の rulebook / recipe / sample / template を新設した。共通 Mermaid rulebook には、全体概要と領域別 CDFD の粒度差に必要な規則だけを追加した。

- 主成果物は、九つのプロセス領域、起点イベント、主要入力・出力、データストア、領域間フロー、補助操作の境界、領域別 CDFD への一対一対応、ロール別受入条件が既に完了基準を満たしていたため、本文を維持して準拠先を `specdojo:cdfd-overview-rulebook` へ切り替えた。
- `cdfd-overview-rulebook.md` を新設し、一ノード一領域、一覧表と図の正本分担、必須章、領域一覧の列、対象境界、詳細化対応、受入確認、完成判定、禁止事項を overview 専用規則として定義した。
- `cdfd-overview-recipe.md` を新設し、領域候補の抽出、補助操作の除外、一領域一行・一代表ノードへの整理、領域別 CDFD への割当、重複・欠落の深掘り、BA / PO / ARC / QE のレビュー観点を再利用可能な手順にした。
- `cdfd-overview-sample.md` を新設し、駄菓子屋きぬや販売管理の販売・在庫補充・つけ管理を題材に、三領域の一覧、全体図、対象境界、詳細化対応、受入確認がそろう最小完成例を記述した。
- `cdfd-overview-template.md` を新設し、生成物 Frontmatter、必須章、一覧表、Mermaid 骨格、境界・詳細化・受入確認の表と標準プレースホルダを配置した。
- `cdfd-mermaid-rulebook.md` には、全体概要では一領域を一つの代表プロセスノード、領域別 CDFD では領域内の一プロセスを一ノードとする規則を追加した。既存のノード形状、線種、ラベル規則は維持した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`（準拠 rulebook の切替）
- `docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md`（新規）
- `docs/ja/specdojo/recipes/cdfd-overview-recipe.md`（新規）
- `docs/ja/specdojo/samples/cdfd-overview-sample.md`（新規）
- `docs/ja/specdojo/templates/cdfd-overview-template.md`（新規）
- `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`（共通粒度規則の追加）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-overview-006-result.md`（更新）

検証結果:

- `npx prettier --write <変更 Markdown>`: 成功。
- `npx markdownlint <変更 Markdown>`: 成功。
- `npm run -s lint:md`: 成功。
- `npm run -s lint:fm`: 成功。新設した rulebook / recipe / sample / template と主成果物の Frontmatter を含めてエラーなし。
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001`: 成功。全8カタログが OK。後続成果物が未作成であることによる既存 warning のみ。
- `node --import tsx src/specdojo.ts index build`: 成功。1001エントリを生成。
- `npm test`: 74ファイル・989件中、70ファイル・973件が成功。Git 子プロセスを必要とする worktree 系4ファイル・16件だけが sandbox の `spawnSync git EPERM` で失敗した。
- worktree 系4ファイルを除外した `npx vitest run`: 70ファイル・966件が成功し、今回の変更面に関係する失敗なし。
- `npm run docs:build`: `tsx` CLI が sandbox 内の IPC ソケットを作成できず `listen EPERM` で停止した。`npx vitepress build .` による直接確認も、Mermaid SVG 生成用 Chromium が sandbox で起動できず `Operation not permitted` で停止した。いずれも Markdown、Frontmatter、カタログ、索引の検査エラーではない。

## 3. 申し送り

- 後続の領域別 CDFD は、主成果物の `P-01`〜`P-09` にある起点イベント、主要入力・出力、データストア、委譲境界を引き継ぐ。領域内のコマンド、ファイル、状態遷移、例外経路、実装エビデンスは各領域のタスクで詳細化する。
- 既存の `cdfd-rulebook.md` / `cdfd-recipe.md` / `cdfd-sample.md` / `cdfd-template.md` は本タスクで領域別専用へ変更していない。領域別 Kata を整備する後続タスクで、overview 専用一式との責務分離を確定する。
- `docs:build` と全 worktree 系テストは、Unix domain socket、Chromium、Git 子プロセスの起動が許可された環境で再実行する。今回の失敗による追跡対象ファイルの追加変更はない。

## 4. 進め方と実践の型の適用

approach は bootstrap とし、内容の根拠は対象成果物、成果物カタログの定義・完了条件、プロジェクトコンテキストの [[prj-0001:prj-overview\|プロジェクト概要]] に限定した。プロジェクトレベルの Why は、人と AI Agent が同じ正本を参照して判断と作業を引き継ぐこと、人間が主要判断を担うこと、費用と参加負荷を報告へ渡すことが全体フローへ与える影響だけを反映し、背景や価値仮説を再掲していない。実装ファイルと Web 情報は内容根拠に使用せず、現在動作の詳細は後続 retrofit-pass へ委譲した。

既存物の評価と判断:

- 主成果物は既存本文を実際に確認し、九領域の一覧と図、補助操作の境界、領域別 CDFD への対応、BA / PO / ARC / QE の受入条件が完了基準と overview 専用構造を満たしていると評価した。このため作り直さず、準拠 rulebook の切替だけを行った。
- overview 専用 rulebook / recipe / sample / template は存在しなかったため新規作成した。構造・必須項目・禁止事項は新設 rulebook を正本とし、recipe は問いと深掘り手順、sample は完成最小例、template はプロジェクト固有値を持たない骨組みに一般化した。
- 既存の共通 CDFD 実践一式は、本タスクで領域別専用へ変更しないという plan の境界に従い維持した。共通 Mermaid rulebook だけは、overview と領域別で同じノード形状を使いながら粒度を混在させないため、一ノードが表す単位の差を追加した。
- `upsert-rulebook` Skill を適用し、rulebook authoring standard、rulebook 作業手順、Frontmatter schema と類似 rulebook を確認した。`upsert-sample` Skill を適用し、sample authoring standard、対応 rulebook、共通サンプル文脈、類似 sample を確認した。
- 両 Skill が前提に挙げる `docs/ja/specdojo/guides/docs-contents-guide.md` はリポジトリに存在せず、移動先も見つからなかった。このため、plan が許可する成果物カタログ、対象成果物、プロジェクト概要と、構造規約の各 authoring standard を代替根拠とした。

同種の ready 文書と相互整合:

- 同種の ready CDFD 一式は存在しなかったため、形の手本として `specdojo:prj-overview-rulebook` と `specdojo:pm-plan-rulebook`、対応する ready の recipe / sample / template を参照した。章番号、Frontmatter の参照宣言、本文構成表、問い・深掘り・良い例 / 悪い例・レビュー観点、共通サンプル文脈、`frontmatter_template`、プレースホルダの置き方だけを手本とし、内容は転用していない。
- 新設 rulebook を構造・必須項目・禁止事項の正本とした。主成果物、sample、template は「目的と適用範囲」「プロセス領域一覧」「概念データフロー」「境界と分割方針」に揃え、「対象境界」「領域別 CDFD への対応」「受入確認」を同じ構造にした。
- 領域 ID、業務目的、担当、起点イベント、主要入力・出力、データストア、詳細化先を一覧の共通項目にし、図では一領域を一つの代表ノードへ対応させた。recipe は同じ成果物を作るための問いと判定順へ一般化し、sample は三領域へ縮約し、template は可変値を標準プレースホルダへ置き換えた。
- rulebook / recipe / sample / template の参照は Frontmatter だけで宣言し、rulebook と recipe の本文へ実行不能な相互リンク章を置いていない。sample 内の詳細化先は未作成の例示文書であるため Markdown リンクにせず、バッククォート表記にした。
