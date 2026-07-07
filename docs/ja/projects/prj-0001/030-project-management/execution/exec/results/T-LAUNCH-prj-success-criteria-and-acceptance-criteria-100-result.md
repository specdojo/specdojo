---
specdojo:
  id: prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-100
  type: exec-result
  task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100-plan.md
  started_at: "2026-06-29T17:29:47.745Z"
  completed_at: "2026-06-30T13:54:48.988Z"
  agent: claude-edit-agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-success-criteria-and-acceptance-criteria
    - prj-success-criteria-and-acceptance-criteria-recipe
---

# Edit Result

## 1. 実施内容

- `prj-success-criteria-and-acceptance-criteria-recipe.md` を、完成版成果物 `prj-success-criteria-and-acceptance-criteria.md` と review result（task 090）、編集 iteration（task 070-I01/I02、080-I01/I02）の result を根拠に見直した。
- 「証跡の具体性（確認日・確認者・対象条件 ID）」「否決時の是正・再判定の記録」を求める既存記述（4.4. 判定手順と証跡、5. 深掘り手順）は、070-I01/I02 で実際に有効に機能していたため変更せず維持した。
- review result（090）で指摘された「依存文書（`prj-scope.md`）の `_TODO_:` ラベルが、本ルールブックの `_UNDECIDED_:` に変換されないまま転記された」という不整合は、recipe に明示的な指示がなく見落とされやすい観点だったため、次の箇所を追記して補強した。
  - 「3. 全体の作成手順」step 8 に、依存文書側のラベル（例: `_TODO_:`）を `_UNDECIDED_:` へ書き換える旨を追記した。
  - 「4.5. 例外条件と未解決事項」の書き方に、依存文書の未決事項を転記する際のラベル統一ルールを追記した。
  - 「6. 良い例 / 悪い例」に「未解決事項のラベル」の行を追加し、悪い例として依存文書の `_TODO_:` をそのまま転記するケースを示した。
  - 「7. レビュー観点」に「ラベル整合性」の行を追加した。
  - 「8. 仕上げチェック」にラベル統一の確認項目を追加した。
- 成果物固有の事情（駄菓子屋プロジェクトの個別業務内容など）は一般化し、recipe へ持ち込んでいない。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100-result.md`

## 3. 申し送り

- 対象成果物 `prj-success-criteria-and-acceptance-criteria.md` の「5. 例外条件と未解決事項」にある初回公開日は、review（090）で指摘された通り依然として `_TODO_` のままであり、本タスクのスコープ（recipe の見直し）外のため未修正である。後続の対象成果物編集タスクで `_UNDECIDED_:` 形式に修正する必要がある。
- 他プロジェクトに同種の成功基準と受入条件成果物が見つからなかったため、根拠は prj-0001 の完成版・review・編集 iteration のみに限定した。今後他プロジェクトでの作成・レビュー実績が増えた場合は、recipe を再度見直すことが望ましい。

## 4. 参考資料の活用

- `approach: recipe-maintenance` として、見直し対象 recipe（`prj-success-criteria-and-acceptance-criteria-recipe.md`）を実際に読み込み、現状の問い・深掘り手順・レビュー観点を把握した上で編集した。
- 根拠として、完成版成果物 `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md`、review result `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090-result.md`、編集 iteration result（070-I01, 070-I02, 080-I01, 080-I02）を読み込んだ。
- 依存文書 `docs/ja/projects/prj-0001/020-project-definition/prj-scope.md` を読み、初回公開日が `_TODO_:` ラベルで記載されていることを確認し、これが成果物側へそのまま転記された経緯の裏付けとした。
- rulebook（`prj-success-criteria-and-acceptance-criteria-rulebook.md`）の「4.2. 推奨ルール」（`_UNDECIDED_:` を使う）と、sample（`prj-success-criteria-and-acceptance-criteria-sample.md`）の「5. 未解決事項」（`_UNDECIDED_:` を正しく使用）を確認し、recipe の追記内容が rulebook・sample と矛盾しないことを確認した。
- recipe の構成・記述ルールは `docs/ja/specdojo/standards/recipe-authoring-standard.md` に従い、章番号・表・禁止ラベル運用（`_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` のみ使用）を遵守した。
- 複数文書間で矛盾は見つからなかった。rulebook を正として判断し直す必要があった箇所はない。
