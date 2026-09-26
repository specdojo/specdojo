---
specdojo:
  id: prj-0001:xer-pjr-t3nn-20260926t021808z-b9be
  type: exec-result
  task_id: PJR-T3NN
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-t3nn-20260926T021808Z-b9be-plan.md
  started_at: "2026-09-26T02:18:08.992Z"
  completed_at: "2026-09-26T02:35:33.923Z"
  agent: codex-expert-executor
  block_reason: "integrate failed: git merge failed: CONFLICT (content): Merge conflict in docs/ja/projects/prj-0001/controls/project-register/events/pjr-t3nn.yaml; automatic git merge --abort failed; run git merge --…"
---

# Edit Result

## 1. 実施内容

- `bps-rulebook.md` および `bps-sample.md` を `rulebook-authoring-standard.md` に準拠する形式で再構成した。
- 個票 `pjr-t3nn-bps-rulebook-rulebook-authoring-standard.md` の実施内容を更新した。
- `prettier` による整形および `markdownlint` による静的検査を完了し、カタログ検証 (`specdojo catalog validate`) および登録簿生成 (`specdojo register build`) を通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bps-rulebook.md`: 標準準拠の章構成・書式への再構成（bootstrap相当）
- `docs/ja/specdojo/samples/bps-sample.md`: Frontmatter 形式および内容の標準準拠化
- `docs/ja/projects/prj-0001/controls/project-register/pjr-t3nn-bps-rulebook-rulebook-authoring-standard.md`: 対応結果の記述更新

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

現行の `rulebook-authoring-standard.md` との乖離（章構成、Frontmatter、見出し番号）を解消するため、部分修正ではなく `bootstrap` 相当の再構成を実施した。変更後、共通規約に基づき `prettier`、`markdownlint`、`catalog validate` および `register build` を実行して整合性を検証した。
