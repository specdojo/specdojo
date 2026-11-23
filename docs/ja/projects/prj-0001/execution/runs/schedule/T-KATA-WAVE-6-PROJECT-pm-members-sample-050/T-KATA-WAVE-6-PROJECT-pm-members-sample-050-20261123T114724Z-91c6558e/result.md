---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-members-sample-050-20261123t114724z-91c6558e
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-members-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-members-sample-050/T-KATA-WAVE-6-PROJECT-pm-members-sample-050-20261123T114724Z-91c6558e/plan.md
  started_at: "2026-11-23T11:47:32.561Z"
  completed_at: "2026-11-23T12:07:27.728Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-sample
---

# Edit Result

## 1. 実施内容

- grade の指摘に基づき、`docs/ja/specdojo/samples/pm-members-sample.yaml` を修正しました。
- F001 に対し、メンバーの稼働条件（時間帯や頻度）を `note` に追記しました。
- F002 に対し、エージェント定義の置き場所に関する重複した説明を解消しました。
- F003 および F006 に対し、`rules` を駄菓子屋プロジェクト固有の制約（公開制約、未成年者の連絡、メンバー交代時の扱い）に絞り込みました。
- F004 に対し、`focus` 内の「条件 ID」を「受入条件 ID」に書き換えました。
- F005 に対し、`display_name` は共通サンプル文脈との整合性を維持しつつ、`note` に役割の独立性に関する説明を追加しました。
- 修正後、schema 検証および Prettier による整形済みであることを確認済みです。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-members-sample.yaml`: grade の指摘（F001–F006）に基づき、メンバーの稼働条件の追記、エージェント定義の重複説明の解消、`rules` のプロジェクト固有ルールへの絞り込み、および `focus` 内の項目の具体化を行いました。

## 3. 申し送り

- F005: the `display_name` は '同行レビュー担当' のままとしています。これは `docs/ja/specdojo/standards/sample-authoring-standard.md` の共通登場人物テーブルで定義されており、他のサンプルとも整合させるためです。代わりに `note` 内に、レビューの独立性に関する説明を記述して対応しています。もし表示名自体を変更する必要がある場合は、共通のサンプル文脈を先に修正し、すべてのサンプルを同時に更新してください。
- F001: `note` フィールドに記載した稼働条件（週次、放課後や週末、月2回、週末のシフト制など）は、今回のサンプル用の仮定値です。もし共通のサンプル文脈においてこれらの具体的な時間設定を採用する場合は、標準側にもこれらを追記することを検討してください。
- F003/F006: `rules` はプロジェクト固有の3行に絞り込みました。rulebook 自体の変更は不要です。なお、`pm-members-template.yaml` には依然として汎用的な `rules` が含まれており、これは rulebook の「運用ルール」セクションと重複しています。これについては別途、テンプレートの修正を行う必要があります。
- F005: the display name stays '同行レビュー担当' because it is fixed in the 共通登場人物 table of sample-authoring-standard.md and used across other samples. Independence is now stated in the `note`. If the name itself must change, change the shared sample context first and update all samples together.
- F001: the participation times and frequencies in the `note` fields (weekly decisions after closing, after school and weekends, weekends, twice-monthly sessions, weekend shop shifts within 30 minutes) are assumed sample values. They are not in the shared sample context. If the sample context adopts them, consider adding them to the standard.
- F003/F006: `rules` is now limited to three project-specific lines: public display names, contact routing for minors, and member replacement. The rulebook needs no change. pm-members-template.yaml still has generic `rules` that restate the common standard, which conflicts with rulebook section 6.3. Consider fixing the template in a separate task.
- 適用外の検証: `npm run validate:history-links`（Only the sample YAML changed; no plan, result, or register file was edited）

## 4. 進め方と実践の型の適用

grade の指摘事項である F001–F006 を解消するように `docs/ja/specdojo/samples/pm-members-sample.yaml` を編集しました。各指摘に対して、稼動条件の追記、説明の重複排除、`rules` のプロジェクト固有化、および用語の具体化を行うことで、駄菓子屋プロジェクトの完成例としての厚みを持たせました。
