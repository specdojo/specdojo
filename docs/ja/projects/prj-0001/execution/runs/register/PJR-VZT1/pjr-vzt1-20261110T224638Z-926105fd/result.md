---
specdojo:
  id: prj-0001:xer-pjr-vzt1-20261110t224638z-926105fd
  type: exec-result
  task_id: PJR-VZT1
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VZT1/pjr-vzt1-20261110T224638Z-926105fd/plan.md
  started_at: "2026-11-10T22:48:55.896Z"
  completed_at: "2026-11-10T23:21:19.921Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# Edit Result

## 1. 実施内容

- uis-rulebook の標準章構成と章別ガイドを整備し、uis-sample を GUI 販売登録の完成例として厚みのある内容に更新しました。
- フロントマターの `type` プロパティの不整合および `part_of` プロパティの混入といった指摘事項を解消しました。
- 整形・登録簿生成・履歴リンク・カタログ検証の各工程を通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/uis-rulebook.md`: 標準の章構成に合わせ、構成を `##` から `####` の連番形式へ変更しました。各章（概要、対象ユーザー、表示項目、操作、遷移、バリデーション、エラー表示と回復操作）における判断基準および、良い例・悪い例の記述を追加しました。また、フロントマターの `type` 指定の不整合を修正しました。
- `docs/ja/specdojo/samples/uis-sample.md`: 駄菓子屋の販売管理システムにおける GUI 画面の完成例として、具体的な表示項目、操作、遷移を詳細に記述しました。会計結果の具体例（合計326円、預かり金500円、釣銭174円）や、接続不能時の業務継続に関する仮定を盛り込み、`clis-sample` 程度の厚みに整備しました。

## 3. 申し送り

- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-vzt1-uis-kata-polish.md` の対応結果に、実施内容、参照規範、旧 `finding` の照合結果、判断理由、検証、CHANGELOG 文案を記録済みです。reporter は実行結果へ転記してください。
- recipe と template は、本文要件・章別ガイド・完成例で記述を支援できるため、双方 `not-needed` と判断しました。入力がある画面のバリデーションは条件付き必須としました。
- sample は会計結果不明時に同じ取引番号を照会して復帰する仕様とし、二重登録を防ぐ操作制限を具体化しました。金額例は合計326円・預かり金500円・釣銭174円です。接続不能時の紙による営業継続は、店主が判断する仮定として明示しました。
- 実 `grade` は実 agent CLI の起動と利用枠の消費を伴うため `requires_human` です。下記コマンドをホスト側で実行し、両文書の `pass` を確認してください。指摘が残る場合は修正または対応理由を個票へ追記してください。lint・単体テスト等の指定済み親検証は runner が実行します。
- CHANGELOG の区分は「変更」。文案は「画面仕様（uis）の型を標準章構成へ整理し、章別の判断基準と良い例・悪い例、入力境界・会計結果確認・回復操作まで含む GUI 販売登録画面の完成例を整備」。
- 個票 docs/ja/projects/prj-0001/controls/project-register/pjr-vzt1-uis-kata-polish.md の対応結果に、実施内容、参照規範、旧 finding の照合結果、判断理由、検証、CHANGELOG 文案を記録済みです。reporter は実行結果へ転記してください。
- recipe と template は、本文要件・章別ガイド・完成例で記述を支援できるため、双方 not-needed と判断しました。入力がある画面のバリデーションは条件付き必須としました。
- 実 grade は実 agent CLI の起動と利用枠の消費を伴うため `requires_human` です。下記コマンドをホスト側で実行し、両文書の pass を確認してください。指摘が残る場合は修正または対応理由を個票へ追記してください。lint・単体テスト等の指定済み親検証は runner が実行します。
- 人の確認が必要: `node --import tsx src/specdojo.ts grade run --project prj-0001 --target kata --path docs/ja/specdojo/rulebooks/uis-rulebook.md --path docs/ja/specdojo/samples/uis-sample.md --run-id pjr-vzt1-uis-polish-20261111`（実 agent CLI を起動するためホスト側で実行し、両文書の pass を確認する必要があります。）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → rulebook」に切り替え、`uis-rulebook` を `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に基づいて再構成しました。`finding` で示された Frontmatter の `type` 項目や `part_of` プロパティに関する不整合を解消し、`uis-sample` を実態に即した厚みのある実装例（販売登録の完成例）へと磨き込みました。
