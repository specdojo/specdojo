---
id: prj-0001:xer-t-launch-prj-scope-120
type: exec-result
task_id: T-LAUNCH-prj-scope-120
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-scope-120-plan.md
started_at: "2026-06-29T19:11:23.215Z"
completed_at: "2026-06-30T15:06:47.054Z"
agent: claude-edit-agent
approach: sample-maintenance
---

# Edit Result

## 1. 実施内容

`approach: sample-maintenance` に従い、完成版成果物 `prj-scope.md`、直近の review result（`T-LAUNCH-prj-scope-090-result.md`）、その後の rulebook / recipe 最終調整（`T-LAUNCH-prj-scope-110-result.md` / `T-LAUNCH-prj-scope-100-result.md`）を根拠に `prj-scope-sample.md` を見直した。

1. `prj-scope-sample.md` を読み込み、章構成（1. 対象業務〜6. スコープ変更方針）、表の書き方、未確定事項の表記を確認した。
2. `prj-scope-rulebook.md`（最新版）・`prj-scope-recipe.md`（最新版）と突き合わせ、必須章・推奨表・禁止事項に抵触していないかを確認した。
3. review result（090）で指摘された軽微差分「対象期間の未確定表記が成果物では `_TODO_:`、recipe・sample では `_UNDECIDED_:`」について、当該差分は recipe（100）・rulebook（110）の側で `_UNDECIDED_:` 優先の方針として解消済みであり、sample（37行目「具体的な日付は `_UNDECIDED_:` プロジェクト計画で決定する。」）は既にこの方針に整合していることを確認した。
4. 対象システム表（推奨2列「対象｜内容」）、スコープ外表（「対象（Out）｜理由｜補足」）、スコープ変更方針表（「項目｜内容」）など、rulebook 6.3/6.5/6.7 の推奨表構成と sample の表構成が一致していることを確認した。実成果物 `prj-scope.md` は対象システム表に「境界」列を追加しているが、これは rulebook が定める最小推奨（2列）を超えた実成果物固有の拡張であり、sample を最小記述例として維持する方針（sample-authoring-standard 6章「rulebook の本文を丸写しせず」「実成果物の丸写しを避ける」）に沿って sample 側へは反映しないと判断した。
5. `npx markdownlint` と `npx prettier --check` を実行し、エラーがないことを確認した。

以上の確認の結果、`prj-scope-sample.md` は現行の rulebook / recipe / 完成版成果物 / review result と矛盾せず、最小記述例として妥当であるため、本文の修正は不要と判断した（変更なし）。

## 2. 変更ファイル

本タスクでは成果物の変更なし（見直しの結果、維持を判断）。確認のため以下を読み込んだ。

| ファイル                                                                                                   | 種別          | アクション |
| ---------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| `docs/ja/specdojo/samples/prj-scope-sample.md`                                                             | 見直し対象    | 維持       |
| `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`                                                         | rulebook      | 参照のみ   |
| `docs/ja/specdojo/recipes/prj-scope-recipe.md`                                                             | recipe        | 参照のみ   |
| `docs/ja/projects/prj-0001/020-project-definition/prj-scope.md`                                            | 完成版成果物  | 参照のみ   |
| `docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`                                         | 依存成果物    | 参照のみ   |
| `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-scope-090-result.md` | review result | 参照のみ   |
| `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-scope-100-result.md` | edit result   | 参照のみ   |
| `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-scope-110-result.md` | edit result   | 参照のみ   |

## 3. 申し送り

なし。`_TODO_:` / `_UNDECIDED_:` の表記方針は rulebook（110）・recipe（100）・sample のいずれも `_UNDECIDED_:` 優先で整合済みである。実成果物 `prj-scope.md` の対象期間記載が `_TODO_:` のまま残っている点は、本タスクの対象外（成果物本体の編集は別タスクの責務）のため変更していない。

## 4. 参考資料の活用

`sample-maintenance` として、進め方 4 章の手順に従い、参照の向きを「成果物 → sample」に切り替えて見直した。

- `prj-0001:prj-scope`（完成版成果物）を、sample の粒度・文体・表の書き方が完成例として妥当かを判断する一次根拠として参照した。対象業務（利用者・利用場面・利用者影響）、対象システム（表＋外部連携境界の段落）、対象期間（`_TODO_:` のまま）、スコープ外、境界の判断基準、スコープ変更方針のいずれも、sample が同じ章構成・同等の粒度で書けていることを確認した。
- `T-LAUNCH-prj-scope-090-result.md`（review result）を、BA owner が重視する観点（業務価値との対応、要件・受入条件の充足、関係者・利用場面の明確性）が成果物側で満たされていたかの根拠として参照した。findings に記録された軽微差分（`_TODO_:` / `_UNDECIDED_:` の表記ゆれ）以外に、sample の改訂を要する指摘は確認できなかった。
- `prj-scope-rulebook.md`（最新版、110 で `_UNDECIDED_:` 優先方針を明記済み）を、sample が満たすべき必須章・禁止事項・推奨表の正本として参照した。sample は本文構成（1〜6章の連番見出し）、禁止事項（設計詳細・曖昧表現・スコープ外未記載なし）のいずれにも抵触していなかった。
- `prj-scope-recipe.md`（最新版、100 で `_UNDECIDED_:` 優先方針を明記済み）を、各章の良い例・悪い例・仕上げチェックとの整合確認に使用した。sample の対象業務（店主代表以外でも同じ手順で確認できる状態）は recipe 6章の「良い例」と同一パターンであり、対象期間の `_UNDECIDED_:` 表記は recipe 8章の仕上げチェック「未確定の日付やイベントは `_UNDECIDED_:` を優先」と一致していた。
- `prj-overview.md`（依存成果物）を、sample の共通文脈（`prj-overview-sample` を `based_on` に持つ）と実プロジェクトの背景・必要性の対応関係の確認に使用した。直接の改訂根拠にはしていない。
- `sample-authoring-standard.md` を、sample が「rulebook の必須要素を満たす最小記述例」であるべきという方針の根拠として使用し、実成果物 `prj-scope.md` の対象システム表にある追加列「境界」を sample へ反映しないと判断する根拠にした（実成果物の丸写し回避）。
- 参照資料間に rulebook を正として解消すべき明確な矛盾はなかった。`_TODO_:` / `_UNDECIDED_:` の表記差異は review（090）時点では軽微差分だったが、recipe（100）・rulebook（110）の更新により既に解消されており、sample 側の追加対応は不要だった。
