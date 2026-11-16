---
specdojo:
  id: prj-0001:xep-pjr-fmyk-20261104t225913z-fef79d28
  type: exec-plan
  rulebook: none
  task_id: PJR-FMYK
  name: "stsd のカタログを CDFD に合わせて見直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
  approach: catalog-planning
  targets:
    - domain:data-model
---

# Edit Plan: PJR-FMYK カタログの判定計画と生成

## 1. このフェーズで行うこと

stsd の試行（3APD）の最初の段。dct-data-model-stsd.yaml の 5 件を、再編した概念データフロー図と現行の実装に照らして見直す

対象単位・参照資料・実行コマンド・完了条件は「個票の追加完了条件」に展開する。

- result: `docs/ja/projects/prj-0001/execution/exec/results/pjr-fmyk-20261104T225913Z-fef79d28-result.md`

## 2. 完了手順

1. 参照する kata・既存カタログと個票を読み、追加完了条件の手順を実行する。
2. 共通規約に従って必要な整形・静的検査を行う。
3. 個票の作業内容・対応結果を更新し、実行記録に判断根拠・変更ファイル・検証結果を残す。pipeline の executor は result を編集せず報告へ記入する。

## 3. 異常終了の条件

- 入力不足、対象不明、解消できない判定事項、生成・検査失敗があれば停止し、理由と次のアクションを報告する。
- 登録簿と個票のステータスを変更しない。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 対象は dct-data-model-stsd.yaml だけ。data-model のほかの種類（bdd・cdsd・cld・ccd）の分割ファイルは変えない（3APD の範囲）
- カタログは概念データフロー図の再編の前に作った。CDFD は stsd-deliverable・stsd-task-execution・stsd-job-run・stsd-register-entry・stsd-routine-run を状態定義の正本として名指ししている（cdfd-uc-schedule・cdfd-uc-register・cdfd-uc-routine の適用範囲）
- 代表の 1 件は stsd-task-execution を draft で書く（2026-11-05 利用者が決定）

## 個票の追加完了条件

次の生成手順・完了条件と、個票が定める追加条件を満たす。

### 作業単位と既存カタログ

対象: `domain:data-model`（project: `prj-0001`）。既存カタログは読み取り、scope と依存関係の判断に取り込む。

- `prj-0001:dct-architecture`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-architecture.yaml`（domain: `architecture`）
- `prj-0001:dct-business-acceptance-criteria`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-acceptance-criteria.yaml`（domain: `business-acceptance-criteria`）
- `prj-0001:dct-business-model-bes`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bes.yaml`（domain: `business-model`）
- `prj-0001:dct-business-model-bps`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`（domain: `business-model`）
- `prj-0001:dct-business-model-br`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-br.yaml`（domain: `business-model`）
- `prj-0001:dct-current-state`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-current-state.yaml`（domain: `current-state`）
- `prj-0001:dct-data-flow`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`（domain: `data-flow`）
- `prj-0001:dct-data-model-bdd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-bdd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-ccd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-ccd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-cdsd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-cld`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cld.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-stsd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml`（domain: `data-model`）
- `prj-0001:dct-external-interface-specs`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-external-interface-specs.yaml`（domain: `external-interface-specs`）
- `prj-0001:dct-glossary`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-glossary.yaml`（domain: `glossary`）
- `prj-0001:dct-impact-analysis`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-impact-analysis.yaml`（domain: `impact-analysis`）
- `prj-0001:dct-migration-planning`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-migration-planning.yaml`（domain: `migration-planning`）
- `prj-0001:dct-non-functional-requirements`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-non-functional-requirements.yaml`（domain: `non-functional-requirements`）
- `prj-0001:dct-operations`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-operations.yaml`（domain: `operations`）
- `prj-0001:dct-planning`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-planning.yaml`（domain: `planning`）
- `prj-0001:dct-project-definition`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-definition.yaml`（domain: `project-definition`）
- `prj-0001:dct-project-management`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`（domain: `project-management`）
- `prj-0001:dct-system-acceptance-criteria`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-acceptance-criteria.yaml`（domain: `system-acceptance-criteria`）
- `prj-0001:dct-system-design`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-design.yaml`（domain: `system-design`）
- `prj-0001:dct-system-functions`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-functions.yaml`（domain: `system-functions`）
- `prj-0001:dct-test-specs`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test-specs.yaml`（domain: `test-specs`）
- `prj-0001:dct-user-interface-model`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-user-interface-model.yaml`（domain: `user-interface-model`）

### 参照する実践の型

- rulebook: `docs/ja/specdojo/rulebooks/dct-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/dct-sample.yaml`
- template: `_MISSING_`

### 判定・生成手順と完了条件

- domain の雛形: `specdojo:dct-data-model-bdd-template`（`docs/ja/specdojo/templates/dct-data-model-bdd-template.yaml`）
- domain の雛形: `specdojo:dct-data-model-ccd-template`（`docs/ja/specdojo/templates/dct-data-model-ccd-template.yaml`）
- domain の雛形: `specdojo:dct-data-model-cdsd-template`（`docs/ja/specdojo/templates/dct-data-model-cdsd-template.yaml`）
- domain の雛形: `specdojo:dct-data-model-cld-template`（`docs/ja/specdojo/templates/dct-data-model-cld-template.yaml`）
- domain の雛形: `specdojo:dct-data-model-sld-template`（`docs/ja/specdojo/templates/dct-data-model-sld-template.yaml`）
- domain の雛形: `specdojo:dct-data-model-stsd-template`（`docs/ja/specdojo/templates/dct-data-model-stsd-template.yaml`）

1. `specdojo catalog plan prompt --project prj-0001 --domain data-model` を実行し、その入力文書・判定規約に従う。データフローがない場合は、個票が指定する上流資料を `--input <path>` で明示する。入力不足なら停止して必要資料を申し送る。
2. agent の判定を YAML に出力する。インスタンス・根拠・除外・未確定事項を記録する。既存カタログと kata を優先して参照し、テンプレート由来の構造を独自に再作成しない。
3. `specdojo catalog plan scaffold --project prj-0001 --domain data-model --from <agent-output>.yaml` で `docs/ja/projects/prj-0001/010-deliverables-catalog/plans/dct-plan-data-model.yaml` に検証保存する。prompt に入力を追加した場合は同じ `--input` を渡す。
4. `specdojo catalog plan validate --project prj-0001 --domain data-model` を通す。blocking な `open_questions` を解消する。
5. `specdojo catalog scaffold --project prj-0001 --domain data-model --plan` で `dct-data-model.yaml`（物理分割時は全 part）を生成する。`dct-index.yaml` の `size` がない場合は個票の範囲に合わせて `--size <small|medium|large>` を明示する。既存ファイルは差分を確認し、必要な場合だけ `--force` を使う。
6. `specdojo catalog validate --project prj-0001` を通す。先に `dct-index.yaml` の全 domain の索引を整備し、生成した domain を登録する（物理分割も同じ domain の一項目とする）。判定計画とカタログの保存、参照・依存・完了条件の整合を完了基準とする。
7. 個票の作業内容・対応結果と実行記録に判断・検証結果を記録する。todo の close は runner と人が行う。close 後の `timeline build` が domain を `primary` と導く。`tml-index.yaml` は変更しない。

- `dct-data-model-stsd.yaml` の 5 件それぞれについて、状態を持つ対象・`overview`・`depends_on`・`evidence_refs`（実装のパスと目的）が、概念データフロー図（[[cdfd-overview]]・[[cdfd-uc-register]]・[[cdfd-uc-routine]]・[[cdfd-uc-schedule]]）と現行の実装に合っているかを確かめ、合わないものを直している。`evidence_refs` のパスは実在するファイルを指している。
- CDFD が状態の正本として名指しする対象に、カタログで欠けているものや余分なものがないかを確かめている。足す・除く・分ける・まとめる判断をした場合は、理由を個票の対応結果に書いている。
- `local_id` を変えた場合は、CDFD など既にある文書からの参照を一覧にして個票の対応結果に書いている。参照している文書そのものはこの項目では直さない。`stsd-task-execution` は代表の 1 件として次の段で使うため、変える場合はその理由も書く。
- `dct-data-model-stsd.yaml` 以外のカタログと、成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s validate:catalog` と `npm run -s lint:md` が通っている。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
- 冗長さの判定は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を正本とする。
- 同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲は書かず、既存の記述は削る・まとめる・参照に置き換える。
- 判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
