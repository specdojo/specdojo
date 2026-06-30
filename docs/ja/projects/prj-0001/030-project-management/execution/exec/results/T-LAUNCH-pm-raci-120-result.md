---
id: prj-0001:xer-t-launch-pm-raci-120
type: exec-result
task_id: T-LAUNCH-pm-raci-120
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-pm-raci-120-plan.md
started_at: "2026-06-29T18:34:37.278Z"
completed_at: "2026-06-30T14:49:00.726Z"
agent: opencode-edit-agent
approach: sample-maintenance
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/pm-raci-sample.md` を最終調整し、sample 同士の参照に揃えた。
- `based_on` に `pm-roles-sample` と `pm-members-sample` を追加し、本文中の組織定義・メンバー定義・見直し条件の参照先を sample 側へ寄せた。
- 見直し条件と禁止事項の表現を sample の導線に合わせ、表セル内の wiki link は `|` をエスケープして崩れないようにした。
- `npx prettier --write` と `npx markdownlint` を実行し、対象 Markdown の整形・静的検査が通ることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-raci-sample.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-120-result.md`

## 3. 申し送り

- `pm-raci-sample` は sample 群の参照に揃えたため、今後 `pm-organization-sample` / `pm-roles-sample` / `pm-members-sample` の表現方針が変わる場合は、同じ参照粒度で再調整する。
- `pm-raci.md` 本体の見直しが必要になった場合は、この sample ではなく project 側の成果物と review result を優先して扱う。

## 4. 参考資料の活用

- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md` を一次根拠として、本文構成、RACI 列、1 行 1 `A`、禁止事項を確認した。
- `docs/ja/specdojo/standards/sample-authoring-standard.md` と `.github/instructions/sample.instructions.md` で、sample の構成・記述ルール・禁止事項を再確認した。
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-090-result.md` と `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-080-I01-result.md` を、既存 sample の粒度と表の書き方が妥当かを見る補助根拠として参照した。review 結果では sample の構造自体は妥当とされていたため、今回は参照先表記の整備と最小限の文言調整に留めた。
