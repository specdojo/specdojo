---
id: prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-110
type: exec-result
task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110-plan.md
started_at: "2026-06-30T14:31:07.902Z"
completed_at: "2026-06-30T14:34:33.856Z"
agent: claude-edit-agent
approach: rulebook-maintenance
---

# Edit Result

## 1. 実施内容

- `approach: rulebook-maintenance` に従い、参照の向きを「成果物 → rulebook」に切り替え、`prj-success-criteria-and-acceptance-criteria-rulebook.md` の章構成・必須項目・禁止事項・判定基準を、完成版成果物 [[prj-0001:prj-success-criteria-and-acceptance-criteria|成功基準と受入条件]]、review result（task 090）、編集 iteration（task 010, 070-I01, 070-I02, 080-I01, 080-I02, 100）の result と照合した。
- 章構成（判定対象と適用範囲／成功基準／受入条件／判定手順と証跡／例外条件と未解決事項の5章構成）、Frontmatter 必須項目（`id` / `type` / `status` / `rulebook` / `based_on`）、本文構成の必須表（成功基準: ID・対応する業務価値・条件・判定基準・測定方法・判定時期・確認者、受入条件: ID・対応する業務価値・種別・条件・合格基準・証跡・確認者・承認者）、禁止事項（曖昧語禁止、業務価値非対応禁止、Agent への最終判断委譲禁止など）は、いずれの edit iteration でも構造面の矛盾や不足が指摘されておらず（080-I01/I02 では「明確な矛盾は確認されなかった」と明記）、成果物の実態と整合していたため維持した。
- 唯一の実質的な不整合として、「3.1. 配置（推奨）」が `docs/ja/projects/<project-id>/020-プロジェクトスコープ/` 配下という誤った（存在しない）ディレクトリ名を案内していた。実際の対象成果物は `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md` に配置されており、姉妹 rulebook（`prj-scope-rulebook.md`、`prj-charter-rulebook.md`）も同種の成果物を `020-project-definition/` 配下にファイル名込みで案内している。この記述は陳腐化（または記述当初からの誤り）と判断し、実態およびガイド（`docs-structure-guide.md` の `020-project-definition/` 表記）と一致する記述へ修正した。
- review result（090）で指摘された「依存文書の `_TODO_:` がそのまま `_UNDECIDED_:` へ変換されずに転記された」問題は、rulebook の「4.2. 推奨ルール」に既に「閾値が未確定の場合は `_UNDECIDED_:` を使い、確定期限と担当を記載します」という構造的要求が存在しており、不足していたのは「依存文書のラベルをそのまま転記しない」という作成手順（how-to）の観点だった。これは task 100（recipe-maintenance）で recipe 側に既に反映済みであり、rulebook 側の構造・必須項目・禁止事項としては追加変更を要しないと判断した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110-result.md`

## 3. 申し送り

- 対象成果物 `prj-success-criteria-and-acceptance-criteria.md` の「5. 例外条件と未解決事項」にある初回公開日は、review（090）以降も `_TODO_` のまま残っている。本タスクは rulebook の見直しのみが対象のため、対象成果物本文の修正は行っていない。後続の対象成果物編集タスクで `_UNDECIDED_:` 形式に修正する必要がある。
- sample（`prj-success-criteria-and-acceptance-criteria-sample.md`）は、章タイトルが rulebook の本文構成（「1. 判定対象と適用範囲」「5. 例外条件と未解決事項」）と異なり、それぞれ「1. 目的と適用範囲」「5. 未解決事項」になっている。本タスクは `rulebook-maintenance`（見直し対象は rulebook）のため sample 自体は変更していないが、`sample-maintenance` タスクで rulebook の章タイトルに合わせる修正が望ましい。

## 4. 参考資料の活用

- `approach: rulebook-maintenance` として、見直し対象 rulebook（`prj-success-criteria-and-acceptance-criteria-rulebook.md`）を実際に読み込み、現状の章構成・必須項目・Frontmatter 規約・禁止事項を把握した。
- 根拠として、完成版成果物 `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md`、review result `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090-result.md`、編集 iteration result（010, 070-I01, 070-I02, 080-I01, 080-I02）、recipe-maintenance result（100）を読み込み、いずれの iteration でも rulebook の構造・必須項目・禁止事項との矛盾が指摘されていないことを確認した。
- sample（`prj-success-criteria-and-acceptance-criteria-sample.md`）と template（`prj-success-criteria-and-acceptance-criteria-template.md`）を読み込み、rulebook の「5. 本文構成（標準テンプレ）」「4. 推奨 Frontmatter 項目」と突き合わせた。template は rulebook の章構成・Frontmatter と一致していた。sample は内容粒度・表構成は rulebook と整合する一方、章タイトルの表記ゆれ（上記「申し送り」参照）があったため、矛盾箇所は rulebook を正とし、sample 側の修正要否を申し送りに記録するにとどめた（本タスクのスコープ外のため sample 自体は変更していない）。
- 姉妹 rulebook（`prj-scope-rulebook.md`、`prj-charter-rulebook.md`）の「3.1. 配置（推奨）」の記述を、同種文書の配置慣行の根拠として参照し、本 rulebook の配置記述の誤りを特定した。
- 本書の構成・記述ルールは `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に従い、章番号・章タイトル直下の英語名と目的、Frontmatter 規約、禁止ラベル運用を維持した。
- 変更後、`npx prettier --write` と `npx markdownlint` を対象ファイルに実行し、整形・静的検査が成功することを確認した。
- 複数文書間で rulebook を正として判断し直す必要があった箇所は「3.1. 配置（推奨）」のみであり、それ以外は既存記述が根拠と整合していたため維持した。
