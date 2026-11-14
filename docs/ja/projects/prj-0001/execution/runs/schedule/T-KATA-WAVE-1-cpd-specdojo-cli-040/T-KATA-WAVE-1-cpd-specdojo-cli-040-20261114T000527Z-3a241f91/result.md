---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cpd-specdojo-cli-040-20261114t000527z-3a241f91
  type: exec-result
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-040/T-KATA-WAVE-1-cpd-specdojo-cli-040-20261114T000527Z-3a241f91/plan.md
  started_at: "2026-11-14T00:05:33.346Z"
  completed_at: "2026-11-14T00:21:56.840Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-rulebook
---

# Edit Result

## 1. 実施内容

- CPD rulebook を見直し、判断責任、未決事項の管理、公開・確定条件、検証方法、変更影響の確認規則を追記しました。
- C4 型メニューの掲載漏れ（CPD および既存 CND の recipe/template）を `packages/docs-site/.vitepress/sidebar-config.ts` へ補完しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cpd-rulebook.md`: 判断責任、未決事項の管理（区分・判断者・報告先）、公開・確定条件（POによる承認等）、検証コマンドおよび期待結果、変更時の影響確認規則を追記し、記述ガイドを充実させました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: C4 型メニューに CPD および CND の recipe と template を追加し、非 `deprecated` な Kata の掲載漏れを解消しました。

## 3. 申し送り

- reporter 記録用の変更ファイル: docs/ja/specdojo/rulebooks/cpd-rulebook.md、packages/docs-site/.vitepress/sidebar-config.ts。成果物本体、sample・recipe・template 本文, grade サイドカー, result は変更していません。status は draft を維持しました。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard のライフサイクル規約、people-and-organization-definition-standard、共通レビュー観点の該当16観点、PJR-2GD6、ryu-guide、CPD の関連 Kata、cpd-specdojo-cli、cnd-specdojo、specdojo.cpd-rulebook.yaml を確認しました。実装・schema・リファレンスへの詳細委譲と、一コンテナの論理分割という既存方針を維持しました。plan に成果物由来の grade・condense 記録はありません。
- finding 対応: F001・F005 は未決事項の判断者・判断時点・区分・報告先・PJR 接続、F002・F016 は公開前確認と人間の PO による承認条件、F003・F007 は作業別の担当と確認時点、F004 は上位 CND の接続と依存変更の波及管理、F006 は上位の業務目的・成功基準への参照と構成採用理由、F009・F017 は更新契機・影響先・保守窓口・再検証、F010・F011 は検証コマンド・期待結果・失敗時対応と図表照合条件を補いました。F008・F012〜F015 は現行版ですでに完成例の外出し、章構成の統一、sample の type・主 rulebook の修正が済んでいることを確認しました。正式な再評価は後続の grade に委ねます。
- recipe と template は必要と判断し、既存の完全 ID 宣言を維持しました。recipe は責務分割・障害境界を導く問い、template は図・関係表・観測点の骨組みを提供するためです。後続の Kata 整合段では、業務目的の参照、確認者・公開範囲、未決事項の区分・判断者・判断時点・承認への影響、検証・変更管理への接続を今回の rulebook に合わせて補ってください。完成例は既存 cpd-sample を正本として維持しました。
- 型メニューの静的確認で CPD に加えて既存 CND の recipe・template も未掲載と判明したため、同じ C4 メニューへ計4項目を追加しました。変更後は非 `deprecated` Kata の掲載漏れがないことを確認しました。親 runner 所管の lint・schema・typecheck・unit/integration test は重複実行していません。
- reporter 記録用の変更ファイル: docs/ja/specdojo/rulebooks/cpd-rulebook.md、packages/docs-site/.vitepress/sidebar-config.ts。成果物本体、sample・recipe・template 本文、grade サイドカー、result は変更していません。status は draft を維持しました。
- 型メニューの静的確認で CPD に加えて既存 CND の recipe・template も未掲載と判明したため、同じ C4 メニューへ計4項目を追加しました。変更後は非 deprecated Kata の掲載漏れがないことを確認しました。親 runner 所管の lint・schema・typecheck・unit/integration test は重複実行していません。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがありません。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は rulebook と sidebar のみで、docs/ja/projects/ 配下の成果物を変更していません。）
- 適用外の検証: `npm run validate:history-links`（PJR 個票や既存 plan・result を変更していません。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
