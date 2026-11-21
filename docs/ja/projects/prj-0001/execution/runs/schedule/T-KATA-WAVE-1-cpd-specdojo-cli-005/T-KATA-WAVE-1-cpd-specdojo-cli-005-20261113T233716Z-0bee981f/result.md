---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cpd-specdojo-cli-005-20261113t233716z-0bee981f
  type: exec-result
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-005/T-KATA-WAVE-1-cpd-specdojo-cli-005-20261113T233716Z-0bee981f/plan.md
  started_at: "2026-11-13T23:37:17.382Z"
  completed_at: "2026-11-13T23:59:14.980Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-rulebook
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- C4コンポーネント図（SpecDojo CLI）の初版を作成し、それに対応する実践の型（rulebook, recipe, sample, template）を整備しました。
- 既存の `cpd-rulebook.md` および `cpd-sample.md` を最新の標準に沿って改訂し、不足していた `cpd-recipe.md` と `cpd-template.md` を新規作成しました。
- ドキュメントサイトのサイドバー設定を更新し、新設した型のメニューおよび掲載漏れであった既存の CND 関連メニューを追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cpd-rulebook.md`: 境界・責務・依存方向の判断基準を整理し、古い命名やメタ情報、内包されていた完成例を削除して標準的な構成に改訂した。また、`recipe`, `sample`, `template` の ID を宣言した。
- `docs/ja/specdojo/samples/cpd-sample.md`: 図のない概要記述から、販売処理サービスの5責務・9関係および保存と印字の境界を示す具体的な完成例へと全面的に作り直した。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 新設した CPD の `recipe` および `template` メニューを追加し、あわせて掲載漏れであった既存 CND の `recipe` および `template` メニューを補充した。
- `docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`: C4コンポーネント図の初版を新規作成。9つのコンポーネントと19の関係、論理配置、および結合検証の観測点を定義し、内部依存や実装配置を設計仮定として明記した。
- `docs/ja/specdojo/recipes/cpd-recipe.md`: 責務分割や失敗境界の分析など、高品質なコンポーネント図を作成するための問いと手順をまとめた recipe を新規作成した。
- `docs/ja/specdojo/templates/cpd-template.md`: 同系統の成果物で共通して利用する章構成と表の骨組みを定義した template を新規作成した。

## 3. 申し送り

- reporter 記録用：成果物は未作成だったため新規作成。9コンポーネントと19関係、論理配置、結合検証の観測点を定義した。`based_on` は上位の `cnd-specdojo` のみとし, 内部依存・実装配置は確認済みの事実とせず設計仮定として明示した。
- 型の判断：rulebook は境界・責務・依存方向に schema だけでは伝わらない判断があるため必要。recipe は責務分割や失敗境界の分析で品質差が出るため必要。sample は完成例として必要。template は同系統で共通の章・表を使うため必要。それぞれの ID を rulebook frontmatter に宣言し、記法部品を `includes` に追加した。
- 既存評価：rulebook の一コンテナ・責務単位・ラベル付き関係という方針を維持し、古い命名・メタ情報説明と内包した完成例を整理した。sample は図のない概要だったため、販売処理サービスの5責務・9関係、保存と印字の境界を示す完成例へ作り直した。構造・必須要件は rulebook、骨組みは template、手順は recipe、完成例は sample に集約した。
- 手本：同じ CPD 系統の ready 文書は確認できなかった。型の構造・記法の参考に ready の `cdfd-overview-rulebook.md`、`cdfd-overview-recipe.md`、`cdfd-overview-sample.md`、`cdfd-overview-template.md` を参照した。内容は複写せず、CLI の上位図・プロジェクト文脈と CPD 固有の責務へ一般化した。Web 出典は使用していない。
- 仕上げ4操作を1巡実施：不要な旧サンプル章・重複規約を削除し、未確認事項の重複説明を将来課題表へ集約した。対象範囲と担当の段落を分割し、図・関係表・型の章構成、正本と派生物、保存と外部依頼の責務を整合させた。
- 変更ファイル：`docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`、`docs/ja/specdojo/rulebooks/cpd-rulebook.md`、`docs/ja/specdojo/recipes/cpd-recipe.md`、`docs/ja/specdojo/samples/cpd-sample.md`、`docs/ja/specdojo/templates/cpd-template.md`、`packages/docs-site/.vitepress/sidebar-config.ts`。カタログの rulebook 宣言は既に正しく、変更不要だった。
- メニューには新設した CPD recipe・template に加え、同じ C4 欄で掲載漏れだった既存 CND recipe・template も追加した。
- 後続設計への論点：ARC / DEV が内部構成を実装へ照合し、リファレンス・schema・内部契約の具体的な ID を接続する。ARC / QE が外部応答欠落・途中変更・保存失敗後の回復条件を詳細契約へ反映する。各論点の影響・担当・解消条件は成果物の将来課題表に記載済み。
- result は executor 段階の指示に従い編集していない。lint・型検査・schema・単体／統合テスト（sidebar-kata を含む）は親 runner に委ねた。
- reporter 記録用：成果物は未作成だったため新規作成。9コンポーネントと19関係、論理配置、結合検証の観測点を定義した。`based_on` は上位の `cnd-specdojo` のみとし、内部依存・実装配置は確認済みの事実とせず設計仮定として明示した。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML / YML ファイルはない。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更は `docs/ja/projects/` 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存 plan / result を変更していない。）

## 4. 進め方と実践の型の適用

bootstrap
