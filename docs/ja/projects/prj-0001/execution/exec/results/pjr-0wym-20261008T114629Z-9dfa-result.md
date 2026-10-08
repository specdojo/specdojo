---
specdojo:
  id: prj-0001:xer-pjr-0wym-20261008t114629z-9dfa
  type: exec-result
  task_id: PJR-0WYM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-0wym-20261008T114629Z-9dfa-plan.md
  started_at: "2026-10-08T11:46:29.420Z"
  completed_at: "2026-10-08T11:59:53.039Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- SpecDojo の呼称を「仕様道（Spec-Dō）」とし、それに伴う標語や「技（CLI の機能）」「流（`approach`）」の名称体系を以下の対象ドキュメントへ反映しました。
- ・`README.md` | `docs/ja/index.md` | `docs/ja/specdojo/guides/ryu-guide.md` | `docs/ja/specdojo/guides/specdojo-overview-guide.md` | `docs/ja/specdojo/guides/waza-guide.md`
- また、個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-0wym-naming-spec-do-apply.md` の対応結果セクションを更新しました。

## 2. 変更ファイル

- `README.md`: SpecDojo の呼称および説明文の更新
- `docs/ja/index.md`: トップページにおける名称体系の更新
- `docs/ja/specdojo/guides/ryu-guide.md`: 「流（`approach`）」に関する説明の更新
- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: 概要ガイドにおける名称体系の反映
- `docs/ja/specdojo/guides/waza-guide.md`: 「技（CLI の機能）」に関する説明の更新

## 3. 申し送り

- 成果物の編集および、`npx prettier`、`npx markdownlint` による整形・静的検査を完了しています。

## 4. 進め方と実践の型の適用

決定された「仕様道（Spec-Dō）」という呼称に基づき、プロジェクトの主要なドキュメント群（README、インデックス、各種ガイド）の冒頭文および説明文を体系的に書き換えました。あわせて、作業の証跡として個票の更新を行っています。
