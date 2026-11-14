---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-critical-flows-005-20261114t024622z-83dc1ed9
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-critical-flows-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-critical-flows-005/T-KATA-WAVE-1-sysd-critical-flows-005-20261114T024622Z-83dc1ed9/plan.md
  started_at: "2026-11-14T02:46:23.381Z"
  completed_at: "2026-11-14T04:40:34.508Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-rulebook
    - specdojo:sysd-critical-flows-sample
---

# Edit Result

## 1. 実施内容

- システム設計（重要フロー）の成果物本体および、対応する実践の型（rulebook, recipe, sample, template）を整備し、ドキュメントサイトのメニューへ追加しました。
- 成果物本体では、findingに基づき判断対象、選定理由、受入条件、`Role code`、作業依存関係、変更影響などの記述を補強し、Mermaid図に境界や識別子を明示しました。
- 実践の型として、既存の `rulebook` と `sample` を改訂し、新たに `recipe` と `template` を作成して整合性を確保しました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 重要フロー5件の判断対象、選定理由、受入条件、`Role code`、作業依存関係および変更影響を補強し、図にサービス境界と主要識別子を追加。未解決事項を `CF-U01`〜`CF-U05` として整理しました。
- `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md`: 章構成と記述ガイドを改訂し、完成例を `sample` へ外出しして冗長性を排除しました。
- `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`: 骨組み的な記述から、具体的な会計・印字回復の完成例へと作り直しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 整備した実践の型を型のメニューへ追加しました。
- `docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md`: 事故選定および中断後の判断基準を整理するため、新規に作成しました。
- `docs/ja/specdojo/templates/sysd-critical-flows-template.md`: 再利用可能な5章構成の骨組みとして、新規に作成しました。

## 3. 申し送り

- reporterへ: 変更対象はsysd-critical-flows.md、対応rulebook／sample、新規recipe／template、packages/docs-site/.vitepress/sidebar-config.tsの6ファイル。result・gradeサイドカー・保護設定・Git状態遷移は編集していない。
- 実践の型の判断: 既存成果物の5フローと責務境界は維持して補強。rulebookは章構成と記述ガイドを改訂し、完成例を除去。sampleは説明用の骨組みから、駄菓子屋の会計・印字回復の完成例へ作り直した。事故選定・中断後の判断に品質差が出るためrecipeを、固定5章を再利用するためtemplateを新規作成し、rulebook frontmatterへ完全IDを宣言した。カタログのrulebook宣言は既に一致しているため維持。
- bootstrapの形の手本: 成果物はsysd-job-execution.md、rulebookはtsd-index-rulebook.md, recipeはifx-cmd-recipe.md, sampleはcdfd-sample.md, templateはcdfd-template.mdのready文書を参照。章番号、責務境界、表、生成物メタ情報の分離を参考とし、内容は転用していない。sampleの厚さは指定のclis-sample.mdも参照。Web出典なし。
- 根拠と未解決事項: plan依存の3つのCDFDはarchive内のdeprecated文書だった。比較根拠として読み、成果物の`based_on`は直接依存のsysd-indexへ変更した。現行CDFDとの照合とカタログの旧依存の扱いはCF-U01に残した。PM／ARC／BAが受入前に確認し、必要な依存変更を計画する。
- finding対応: F001〜008, F011, F016〜018について、判断対象・選定理由・受入条件・`Role code`・作業依存・管理記録・変更影響・title・参照導線を補強。F009／015の図の境界・主要識別子・同期非同期・相関範囲を追加した。実装主体と人間の責任を分離し、公開／ready条件も明示した。
- 未解消・根拠不足のfinding: F009／010／014の設定実効条件はCF-U03, F012の既存suiteの網羅性はCF-U04, F013の適合証跡はCF-U01〜05, F019／020の運用充足・閾値・通知・OPRはCF-U05へ接続した。許可された根拠に設定キー・有効値・承認済み運用条件がなく、推測で補っていない。DEV／ARCが正本を特定し、QEが条件と網羅性を確認、OPSが運用条件を提示し、人間のPOが採否を判断する。hosting保護の実効性はCF-U02で人間確認が必要。
- CF-U01〜05は文書内の追跡IDであり、PJR採番済みではない。PMが受入前にissue／risk／change-request／decisionとして登録簿へ移し、実IDとSchedule依存を戻す。未作成OPRや業務判断を確定したとは扱わない。
- 仕上げ4操作を1巡実施: rulebookの不要な完成例・詳細値の再掲を削除し、完成例の正本をsample、骨組みをtemplateへ統合。成果物の参照・検証・未決事項・承認条件を分割した。並列実行の継続条件を整理し、クリティカルパス停止時の新規投入停止と整合させた。成果物と型の意味要件はrulebookを正として揃えた。
- lint・schema・typecheck・単体／統合テストは指定どおり親runnerへ委任。sidebar-kata.test.tsも親の単体テストで確認する。参照確認用の一時スクリプトは削除済み。
- bootstrapの形の手本: 成果物はsysd-job-execution.md、rulebookはtsd-index-rulebook.md、recipeはifx-cmd-recipe.md、sampleはcdfd-sample.md、templateはcdfd-template.mdのready文書を参照。章番号、責務境界、表、生成物メタ情報の分離を参考とし、内容は転用していない。sampleの厚さは指定のclis-sample.mdも参照。Web出典なし。
- finding対応: F001〜008、F011、F016〜018について、判断対象・選定理由・受入条件・Role code・作業依存・管理記録・変更影響・title・参照導線を補強。F009／015の図の境界・主要識別子・同期非同期・相関範囲を追加した。実装主体と人間の責任を分離し、公開／ready条件も明示した。
- 未解消・根拠不足のfinding: F009／010／014の設定実効条件はCF-U03、F012の既存suiteの網羅性はCF-U04、F013の適合証跡はCF-U01〜05、F019／020の運用充足・閾値・通知・OPRはCF-U05へ接続した。許可された根拠に設定キー・有効値・承認済み運用条件がなく、推測で補っていない。DEV／ARCが正本を特定し、QEが条件と網羅性を確認、OPSが運用条件を提示し、人間のPOが採否を判断する。hosting保護の実効性はCF-U02で人間確認が必要。
- 適用外の検証: `npm run validate:schema:file`（executorによるyaml／ymlファイルの変更なし。）
- 適用外の検証: `npm run validate:catalog`（executorによるdocs/ja/projects/配下の成果物変更なし。runner管理ファイルは対象に含めない。）
- 適用外の検証: `npm run validate:history-links`（PJR個票および既存plan／resultを編集していない。）

## 4. 進め方と実践の型の適用

既存成果物の内容を評価し、findingに基づき補強しつつ、対応する実践の型（rulebook, recipe, sample, template）を一貫したセットとして整備しました。構造・記法については同種の `ready` 文書を手本にし、不要な重複を排除する仕上げ操作を実施して整合性を確保しています。
