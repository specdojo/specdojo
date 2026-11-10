---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-bes-task-ready-selected-005-20261110t004314z-5050aae8
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005-20261110T004314Z-5050aae8/plan.md
  started_at: "2026-11-10T00:43:15.701Z"
  completed_at: "2026-11-10T01:46:42.489Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - bes-task-ready-selected
    - specdojo:bes-rulebook
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物（業務イベント仕様）および、それに紐づく実践の型（rulebook, recipe, sample, template）の初期整備を完了しました。
- 前回の整備内容を引き継ぎつつ、業務課題、利用判定基準、対象範囲などの記述を補足し、未決事項については判断理由を添えて `_UNDECIDED_` として明記しました。
- recipe および template を新規作成し、サイドバーへの登録を行うことで文書体系への統合を完了しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`: 業務課題、利用判定基準、対象範囲、主体の定義を補足し、依存成果物の未整備や判断未了の事項を理由付きの `_UNDECIDED_` として整理しました。
- `docs/ja/specdojo/rulebooks/bes-rulebook.md`: イベント境界などの判断基準を規定し、recipe, sample, template の完全 ID を宣言しました。
- `docs/ja/specdojo/samples/bes-sample.md`: 現金会計確定を文脈とした共通サンプルとして具体性を高め、プロジェクト固有内容の複写を避けて一般化した完成例として整備しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 新規作成した `bes-recipe.md` および `bes-template.md` への導線を登録しました。
- `docs/ja/specdojo/recipes/bes-recipe.md`: 発生単位、観測時点、相関の検討など、品質を左右する深掘り観点を作成し、新規追加しました。
- `docs/ja/specdojo/templates/bes-template.md`: 五章構成の共通骨組みを定義し、再利用可能な雛形として新規追加しました。

## 3. 申し送り

- reporter は以下を result の「進め方と実践の型の適用」へ記録すること。executor は result・plan・grade サイドカー・Git 設定や状態遷移を編集していない。再開指示に従い、業務判断と依存成果物の未整備は理由付きの未決事項として引き継ぎ、本 bootstrap 編集タスクは完了とする。
- 累積変更: docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md、docs/ja/specdojo/rulebooks/bes-rulebook.md、docs/ja/specdojo/samples/bes-sample.md を修正。docs/ja/specdojo/recipes/bes-recipe.md、docs/ja/specdojo/templates/bes-template.md を追加。packages/docs-site/.vitepress/sidebar-config.ts に追加二文書の導線を登録。五文書の `status: draft` を維持した。
- 既存評価: 代表 BES の対象確定・`claim` 分離・発生条件と、前回整備した型を維持した。累積差分では業務課題、利用判定基準、対象範囲、主体の定義、未決事項の確認担当・判断者・時期・記録先を補足。再開では一覧との接続、承認者の識別、モデル未照合の `_TODO_` を理由付きの `_UNDECIDED_` へ変更し、範囲と選択・着手境界を判断できない理由を明記した。
- 型の要否: rulebook はイベント境界など schema だけでは規定できない判断があるため必要。recipe は発生単位・観測時点・相関の検討で品質差が出るため必要。sample は Markdown 系統の完成例として必要。template は五章の共通骨組みを反復利用するため必要。rulebook frontmatter に三種の完全 ID を宣言済み。追加の記法 rulebook は不要。成果物カタログの既存 `rulebook: specdojo:bes-rulebook` は整合しており維持した。
- 手本と一般化: 前回参照した ready の cdfd-overview-rulebook・cdfd-overview-recipe・cdfd-overview-sample・cdfd-overview-template、prj-overview-template の構造と慣行を引き継いだ。clis-sample は完成例の具体性の目安。sample は共通サンプル文脈の現金会計確定とし、プロジェクト固有内容の機械的複写を避けた。Web 出典なし。
- 仕上げ四操作は前回の一巡を引き継いだ。説明用 sample 章と rulebook 内の完成例を削除し、対象範囲・報告経路の重複を統合。未決事項・相関確認例・モデル未照合を関連章内へ分割し、単発にも順位付けするように読めた記述を修正した。意味要件は rulebook、骨組みは template、完成例は sample に揃え、構文・値・構造の詳細は正本へ委譲した。再開で作り直しや観点別の自己レビューの反復は行っていない。
- finding 対応: F007 は業務課題と利用判定基準、F021 は runner の責務と表記を補正。F001・F008・F020 は根拠を説明できる schedule 系と適用未判定の register・routine 系を区別した。最終的な適用範囲の確定を意味しない。
- 業務判断の残件: F002・F004・F006・F010・F022 は確認担当・判断者・時期・報告経路を進め方案として記載したが、割当と業務承認は未了。F003・F011・F016・F019 も未解消。`prj-0001:bes-index` と必要な起点イベント仕様がなく、人間の PO の識別も参照範囲から確定できない。PM が承認者と担当割当を確認し、BA・ARC が適用範囲と一覧の対応・双方向リンクを照合して、人間の PO が実装・ тесто設計への引き渡し前に判断する。結果は本文とレビュー結果に記録し、PM が報告する。
- 選択と `claim` を同じ業務境界にするかは `_UNDECIDED_` のまま維持。`bps-task-selection-preparation` がまだなく、人間の PO の判断も未了である。BA・ARC が必要な依存を宣言して確認し、実装・テスト設計への引き渡し前に人間の PO が判断する。
- 相関の残件: F005・F009・F012・F013・F014・F015・F017・F018・F023 は、論理項目「並列選択要求識別子」、確認例、変更影響、確認経路を記載したがモデル照合は未了。照合先候補 `prj-0001:bdd-exec-event` は成果物がまだなく、本タスクの依存にも未宣言。ARC が正本と所在を確認して依存を宣言し、BA と要求単位を整理する。正本項目との対応と確定件数の観測時点を人間の PO と合意し、QE の相関テスト設計、関連 BPS、発行・利用側へ引き継ぐ。
- 前回の親単体テストは、新規 bes-recipe・bes-template のサイドバー未登録で失敗していた。今回、既存の業務モデル配下に二項目を追加して原因を修正した。親 runner が lint・schema・型検査・単体／結合テストを実行するため、executor は重複実行していない。後続の独立 review と grade plan --changed-only で再評価すること。
- 業務判断の残件: F002・F004・F006・F010・F022 は確認担当・判断者・時期・報告経路を進め方案として記載したが、割当と業務承認は未了。F003・F011・F016・F019 も未解消。`prj-0001:bes-index` と必要な起点イベント仕様がなく、人間の PO の識別も参照範囲から確定できない。PM が承認者と担当割当を確認し、BA・ARC が適用範囲と一覧の対応・双方向リンクを照合して、人間の PO が実装・テスト設計への引き渡し前に判断する。結果は本文とレビュー結果に記録し、PM が報告する。
- 適用外の検証: `npm run validate:schema:file`（executor の成果物変更に YAML・YML ファイルはない。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更は product・specdojo・packages 配下であり、docs/ja/projects/ 配下の成果物は変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor 自身は登録簿個票・既存 plan・result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

前回整備した代表成果物および実践の型の構造を最大限に引き継ぎ、不足していた recipe および template の作成と導線整備を行いました。業務的な未決事項については、憶測で埋めず `_UNDECIDED_` として理由と共に明記することで、 bootstrap フェーズにおける構造的整備を完了させ、具体的な判断を下流の refine-pass や PO による承認プロセスへ委ねる方針で進めました。
