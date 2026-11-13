---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sf-index-040-20261113t185239z-1dad80dd
  type: exec-result
  task_id: T-KATA-WAVE-1-sf-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sf-index-040/T-KATA-WAVE-1-sf-index-040-20261113T185239Z-1dad80dd/plan.md
  started_at: "2026-11-13T18:52:43.577Z"
  completed_at: "2026-11-13T19:12:26.149Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sf-index
    - specdojo:sf-index-rulebook
---

# Edit Result

## 1. 実施内容

- `sf-index-rulebook` の本文要件および記述ガイドを改訂し、承認プロセス、公開責任、検証基準、変更管理および継続保守に関する判断基準を明確化しました。
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md` 等の規範に基づき、階層ごとの連番付与や構成の見直しを行い、具体的にどのような状態が「判定可能」であるかという検証観点を整理しました。
- recipe および template は、入力情報の定義と本文要件の構成表によって作成が可能であり、独立した手順書は不要であると判断し、`not-needed` を維持しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`: 本文要件および記述ガイドを改訂し、POによる承認基準、公開範囲のガイドライン、機能領域ごとの照合単位、Role別の合否条件、および変更契機に伴う追従先などの判断基準を具体化しました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ本報告を反映すること。変更ファイルは docs/ja/specdojo/rulebooks/sf-index-rulebook.md のみ。executor は result・grade サイドカー・成果物本体を編集していない。
- 判断根拠: docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、guides/docs-structure-guide.md、ryu-guide.md、defaults/pm-review-viewpoints.yaml の全 finding 対応観点、関連する sf-rulebook.md、sf-index-sample.md、clis-sample.md、代表成果物 docs/ja/product/010-business-specs/050-system-functions/sf-index.md、prj-0001 の dct-system-functions.yaml・pm-roles.yaml・PJR-2GD6 個票、T-KATA-WAVE-1-sf-index-005 の result、sf-index-rulebook と sample の grade サイドカーを確認した。plan の成果物由来 finding・condense 記録はなし。旧 Kata grade には cause の記録がないため、旧 anchor と現行本文を照合した。
- F001・F007・F009・F020 は位置づけ・本文要件・記述ガイドで入力、対象者の業務課題、確認者、保守担当を明確化。F002・F003・F022 は人間の PO による承認・保留・差し戻し、公開範囲、非公開情報の除外を規定。F004・F005・F006・F013・F023 は機能領域ごとの照合単位、変更契機、Role ごとの追従先、PJR・Schedule・実行記録への接続を規定。代表成果物の Q-01〜Q-03 を、暫定対応・依存範囲の差・責務境界を追跡する必要性の根拠とした。
- F010・F012・F014・F015 は入力の特定、正本への参照、役割別の合否条件、適用検査と証跡・失敗時対応を明確化した。schema の値・構造や機能受入条件の詳細を一覧へ複製せず、既存のメタ情報標準・schema・接点仕様・個別機能仕様に委ねる判断を維持した（PJR-2GD6、vp-arc-conciseness）。
- F008・F011・F016・F017・F018・F019・F021 の旧 anchor にあった汎用指示文、誤った H1 リンク、本文構成の矛盾は初期整備で置き換わっていることを確認した。現行のタイトル、章別要件、良い例・悪い例、階層ごとの連番、sample への完成例の外出し、一覧と個別仕様の境界を維持した。新たなサンプル章や完成例の再掲は追加していない。finding の正式な再評価は後続段で行う。
- recipe: not-needed、template: not-needed、sample: specdojo:sf-index-sample の宣言を維持した。recipe は入力となる上流仕様・カタログと章別判断基準で作成を進められ、独立した問いの手順を必要としないため不要。template はシステムにつき単一の一覧であり、本文要件の構成表で開始できるため不要。既存 sample は具体的な機能領域・9機能・責務分担・未決事項を持つ完成例として確認した。
- 計画どおり sample・recipe・template の整合は後続段で扱う。sample-maintenance では、今回明確化した公開範囲・保守担当・承認への影響・追跡先の例を補完すること。既存代表成果物の Q-01〜Q-03 も引き続き担当者の判断対象であり、本タスクでは変更していない。新規 Kata 文書はなく、sidebar-config.ts には既存 rulebook と sample の登録を確認したため変更不要。
- 適用外の検証: `npm run validate:schema:file`（executor の変更に `*.yaml`・`*.yml` ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（executor は PJR 個票、既存 plan、result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
