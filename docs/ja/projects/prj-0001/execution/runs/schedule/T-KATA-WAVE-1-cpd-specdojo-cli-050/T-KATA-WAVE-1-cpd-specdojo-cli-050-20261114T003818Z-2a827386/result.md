---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cpd-specdojo-cli-050-20261114t003818z-2a827386
  type: exec-result
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-050/T-KATA-WAVE-1-cpd-specdojo-cli-050-20261114T003818Z-2a827386/plan.md
  started_at: "2026-11-14T00:38:23.526Z"
  completed_at: "2026-11-14T00:55:46.061Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- 駄菓子屋のプロジェクトを文脈とした C4 コンポーネント図の完成例 `docs/ja/specdojo/samples/cpd-sample.md` を、現行の `rulebook` および執筆標準に合わせて全面的に改訂しました。
- あわせて、型メニューへの反映として `packages/docs-site/.vitepress/sidebar-config.ts` に CPD/CND の `recipe` および `template` 計4項目を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: C4 コンポーネント図の完成例として、上位 CND との接続、ビジネス目的（利用者の課題・成功基準）、技術制約、判断責任（PO 等）、未決事項の管理、および検証条件を具体化し、現行 `rulebook` の標準構成に準拠させました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 型メニューに、これまで未掲載であった CPD および CND の `recipe` と `template` セクションを追加しました。

## 3. 申し送り

- reporter 記録用の変更ファイル: docs/ja/specdojo/samples/cpd-sample.md、packages/docs-site/.vitepress/sidebar-config.ts。sample に上位 CND・業務目的との接続、分割理由、正常・失敗時の判定条件、判断責任、未決事項の管理、公開・保守条件を補った。成果物本体・grade サイドカー・result は編集せず、status は draft を維持した。
- result の「進め方と実践の型の適用」への記録根拠: sample-authoring-standard、rulebook-authoring-standard、document-metadata-standard のライフサイクル規約、cpd-rulebook、cpd-mermaid-rulebook、cpd-recipe、cpd-template、ryu-guide、共通レビュー観点の該当 check/evidence、PJR-2GD6 を確認した。cpd-specdojo-cli・cnd-specdojo、cnd-sample・prj-overview-sample・clis-sample、specdojo.cpd-sample.yaml と先行メンテナンス result を照合した。plan に成果物由来の grade・condense 記録はない。
- F001・F007〜F009: 対象コンテナ、利用者の課題、上位の成功基準、対象外、確認する結果を具体化した。未同梱の架空上位図への参照を既存 cnd-sample に置き換え、`based_on` と本文を接続した。HTTP・ファイル保存・外部印刷コマンドの前提と詳細化先を上位 CND に揃えた。CLI は別構成の例として区別した。
- F002〜F006・F022・F023: 担当と人間の PO の判断責任、公開範囲、未決事項の区分・判断時点・次アクション・完了条件・後続作業への影響を補った。架空の PJR 登録候補、PM の起票・Schedule 反映、公開前確認、保守窓口・再描画・再検証を具体化した。
- F010〜F015: 技術前提、責務分割の採用理由、正本への委譲、変更影響を補い、正常販売・商品参照失敗も含む観測条件と Pass/Fail/未判定を明記した。文書検査は現行 rulebook の「検証と合意の判定」へ接続し、コマンド・schema・構文の重複を避けた。F016〜F021 は既存の architecture 型・図・標準章構成・自然な日本語を維持し、全9関係に図中 ID を付けて照合した。旧 finding の章名より現行 rulebook と template を正とした。正式な再評価は後続 grade に委ねる。
- recipe は責務分割・障害境界を導く思考手順、template は図・責務表・関係表・検証対象の骨組みに必要と判断し、cpd-rulebook の既存宣言 specdojo:cpd-recipe・specdojo:cpd-template を維持した。完成例は sample に外出し済み。C4 メニューには未掲載だった CPD/CND の recipe・template 計4項目を追加した。
- ホスト側で CPD sample の SVG を生成し、文字・矢印・境界の重なりや切れを目視確認すること。sandbox では Chromium が Operation not permitted で起動できなかった。親 runner 所管の lint・schema・typecheck・unit/integration test は重複実行していない。一時検証スクリプトと描画用ファイルは削除済み。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は sample と sidebar のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（PJR 個票や既存 plan・result を変更していない。）
- 人の確認が必要: `node --import tsx --input-type=module -e 'import { generateMermaidSvgsForFile } from "./packages/docs-site/src/gen-mermaid-svg.ts"; generateMermaidSvgsForFile("docs/ja/specdojo/samples/cpd-sample.md", { outDir: "tmp/cpd-preview", errorMode: "throw" });'`（sandbox が Chromium の起動を拒否したため描画未確認。ホスト側で SVG 生成と目視確認が必要。）

## 4. 進め方と実践の型の適用

C4 コンポーネント図 (CPD) の完成例として、提示された多数の finding (F001-F023) を解消しつつ、現行の `rulebook` および authorship 標準に準拠した再構成を行いました。具体的には、単なる図の例示に留まらず、アーキテクチャ上の判断根拠、PO の承認責任、保守運用手順などの実務的な情報を補完しています。また、ドキュメントサイトのナビゲーション整合性を確保するため、サイドバー設定へのメニュー追加を実施しました。
