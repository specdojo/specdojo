---
id: prj-0001:xer-t-launch-pm-plan-070-i01
type: exec-result
task_id: T-LAUNCH-pm-plan-070-I01
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-pm-plan-070-I01-plan.md
started_at: "2026-06-25T15:18:22.414Z"
completed_at: "2026-06-25T15:21:58.006Z"
agent: codex-expert-edit-agent
approach: fully-guided
---
## 1. 実施内容

PM 視点で [[prj-0001:pm-plan|プロジェクト管理計画]] を磨き込んだ。既存記述は rulebook の章構成（1 概要〜7 継続確認事項）・必須表・サブセクション構成をすべて満たし、禁止事項にも抵触していなかったため、全面的な書き直しは行わず既存記述を尊重した。

done_criteria の充足を確認した結果は次のとおり。

- owner（PM）の狙い「計画・進捗・リスク・変更管理の方針が計画運用に使える粒度」: 章 2〜5 が管理単位・運用方針・最終判断・逸脱時対応・記録先を表で具体化しており充足。
- 下流 [PO] 承認可能な粒度: 意思決定表（4.2）と GO / Not GO 判断（5.3）で PO が承認・判断できる材料が整理されており充足。
- 下流 [ARC] 憲章・組織定義・RACI と整合: 採用 Role code 8 件が [[prj-0001:pm-roles|ロール定義]] の `roles[].code` と一致し、RACI（4.3）も [[prj-0001:pm-raci|RACI]] へ委譲しつつ `pm-plan` 行のみ再掲しており整合。

唯一の補強として、rulebook「記述ガイド」の関連ドキュメント節が求める「正本・委譲先・管理台帳を分けて記載する」に合わせ、章 6 のフラットな箇条書きを「正本 / 委譲先 / 管理台帳」の 3 区分へグルーピングした。既存の `[[id|title]]` リンクと説明文は変更せず保持した。

参照した全 wikilink（pm-organization / pm-roles / pm-members / pm-raci / sch-track-launch / pjr-index / pm-quality-management-plan / pm-communication-plan）について、実ファイルの存在と frontmatter `id` の一致を確認し、すべて有効であることを検証した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`: 章 6「関連ドキュメント」を正本・委譲先・管理台帳の 3 区分へグルーピング。

## 3. 申し送り

- 章 7 の「初回公開判断」は `_UNDECIDED_`（公開可否・公開範囲・公開前確認の最終判断が未了、判断者 `PO`）のまま残置している。GO / Not GO 判断時に `PO` が確定する想定。本タスクの範囲では決定情報が plan 記載文書に存在しないため変更しない。

## 4. 参考資料の活用

- approach は `fully-guided`。rulebook / recipe / sample / template を実ファイルで読み込んで使い分けた。
  - rulebook（`pm-plan-rulebook`）: 章構成・必須表・サブセクション構成・禁止事項の適合基準として使用。既存文書が全要件を満たすことを確認。
  - recipe（`pm-plan-recipe`）: 各章の問い・深掘り手順・レビュー観点に照らして内容の過不足を点検。リスク（将来）と課題（発生済み）の分離、owner 語彙の限定などが満たされていることを確認。
  - sample（`pm-plan-sample`）: 粒度・文体・表記の比較に使用。既存文書は sample と同等以上の粒度で完成しており、本プロジェクト文脈（個人・小規模運用）に即していたため文体・粒度の調整は不要と判断。
  - template（`pm-plan-template`）: 章骨格の対応確認に使用。`_TODO_` 等のプレースホルダは既存文書に残っていないことを確認。
- 文書間の矛盾は確認されなかったため、rulebook を正として上書きした箇所はない。章 6 のグルーピングは template/sample と rulebook 記述ガイドの粒度差を、rulebook の記述ガイドに寄せた整形であり、内容の改変は伴わない。
- 参照範囲は plan 記載の rulebook / recipe / sample / template と depends_on（pm-organization / pm-roles）に限定した。欠落・内容の薄い参考資料はなく、`参考資料が存在しない・内容が薄い場合` の代替手順は適用していない。
- depends_on との整合確認: Role code 語彙は pm-roles.yaml と一致、最終判断の PO 集約方針は pm-organization.md と整合。明確な矛盾は検出されなかったため最小限修正の対象は発生していない。
- 検証: `npm run -s lint:md`（対象ファイル）で終了コード 0。
