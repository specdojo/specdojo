---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-sf-task-execution-050-20261110t005514z-0da077f7
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-sf-task-execution-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-sf-task-execution-050/T-BUSINESS-SPECS-KATA-sf-task-execution-050-20261110T005514Z-0da077f7/plan.md
  started_at: "2026-11-10T00:55:18.571Z"
  completed_at: "2026-11-10T01:13:56.911Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - sf-task-execution
    - specdojo:sf-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/sf-sample.md` を現行の `sf-rulebook` に準拠した「商品販売機能仕様」の完成例として更新しました。
- grade result の finding に基づき、ビジネス価値、機能要件、受入観点、未決事項の詳細などを具体化し、実装・テスト準備が整った状態のサンプルに再構成しました。
- 冗長性を排除するため、正本の再掲を避け、詳細への参照形式を採用しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-sample.md`: 現行 `sf-rulebook` に沿った商品販売機能の仕様例へ更新。ビジネス課題、4つの機能要件、8つの受入観点を具体化し、未決事項に影響・リスクと判断責任者を明記したほか、重複記述を整理して正本参照形式に修正しました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ本報告を反映すること。変更ファイルは docs/ja/specdojo/samples/sf-sample.md のみ。成果物本体・rulebook・grade サイドカー・result は変更していない。
- 根拠規範: sf-rulebook、sf-index-rulebook、sample-authoring-standard、rulebook-authoring-standard、document-metadata-standard、ryu-guide のメンテナンス手順、defaults/pm-review-viewpoints.yaml の各 finding と同じ観点の check・evidence を確認した。package.json、SpecDojo 設定、lefthook.yml で検査の適用条件も確認した。
- 根拠成果物・記録: sf-task-execution とその grade result、specdojo.sf-sample.yaml、直前の T-BUSINESS-SPECS-KATA-sf-task-execution-040 の result、PJR-2GD6、clis・uis・bdd・stsd・cdfd-overview・prj-overview・組織・ロールの sample を確認した。代表成果物から責務境界・部分失敗・再開・承認条件の判断を抽出し、駄菓子屋の現金販売へ置き換えた。
- source=grade の F001・F010・F015〜F020 は旧規範に基づく指摘。現行 sf-rulebook は個別機能仕様と `type: requirement` を規定し、一覧ハブは sf-index-rulebook の責務であるため、個別仕様・現行メタ情報・8章構成を維持した。一覧表や旧 `type: domain` へ戻さず、タイトルを商品販売機能仕様に統一した。
- F003・F006〜F008・F011〜F014 は、利用者の課題と上位目的、対象・対象外、確認ロール、4つの機能要件、業務領域・画面・データ契約との対応、8つの受入観点で対応した。入力不備、数量・預かり金の境界、部分失敗、再送、印刷失敗について期待結果・証跡・確認ロールを示した。F009 は説明の重複を避け、事後条件の詳細を処理要件・例外表への参照に集約した。
- F002・F004・F005・F021・F022 は、未決事項 Q-01・Q-02 に影響・リスク、担当と判断者、判断時点、次アクション、PJR 起票候補、Schedule への依存、承認保留条件を追加して対応した。問い合わせ・変更管理の導線と人間の PO の承認責任を明記した。未作成契約はコード表記にし、確定済みとは扱っていない。Q-01・Q-02 は完成例内の未決事項であり、本タスクで架空の関連成果物を作成する要求ではない。
- 既存の販売題材・章構成・`draft`・論理的な入出力を維持し、共通文脈と UIS に合わせて単一店舗の現金販売へ範囲を限定した。在庫不足でも販売する記述、根拠のない200ms保証・1000件のオフライン保存保証は取り除いた。値・構文・構造は正本参照に寄せ、未合意の応答値・代替運用は判断条件付きの未決事項とした。
- T-BUSINESS-SPECS-REPS-sf-task-execution-080 の condense result も確認した。前提・事後条件の反復をまとめた記録は `cause.type=document` であり、本 plan に sample 原因の source=condense 記録はない。判断条件を残しながら詳細への参照で重複を減らす方針を適用した。根拠不足による改訂見送りはない。
- recipe・template は現行 frontmatter の not-needed 宣言を維持する。章別ガイドで判断できるため独立した recipe は不要であり、本文要件・推奨表から開始でき、機能に応じた構成が必要なため固定 template も不要と判断した。Markdown・Frontmatter 等の指定された親検証は runner が実施し、本 executor では重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、変更した YAML・YML ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（登録簿の履歴ファイルおよび既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下へ及ばない。）

## 4. 進め方と実践の型の適用

現行 `sf-rulebook` の定義（個別機能仕様としての責務）を正として、grade result および representative 成果物から抽出した具体的判断基準を反映させ、完成例としての品質を向上させました。具体的には、ビジネス価値の明文化、詳細な受入観点の設定、管理可能な未決事項への拡充を行い、同時に正本の再掲を避けることで簡潔性を確保しました。
