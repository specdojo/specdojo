---
specdojo:
  id: prj-0001:xer-pjr-0wym-20261008t114629z-9dfa
  type: exec-result
  task_id: PJR-0WYM
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-0wym-20261008T114629Z-9dfa-plan.md
  started_at: "2026-10-08T11:46:29.420Z"
  completed_at: "2026-10-08T11:53:52.778Z"
  agent: codex-expert-executor
  block_reason: "agent exited with non-zero code: executor validation failed or not run: npm run check"
---

# Edit Result

## 1. 実施内容

- 仕様道（Spec-Dō）の呼称、標語、技・流の名称体系を対象6文書へ反映し、個票の対応結果を更新しました。

## 2. 変更ファイル

- `README.md`: READMEにおける「仕様道（Spec-Dō）」に基づいた説明文の更新。
- `docs/ja/index.md`: トップページにおける「仕様道（Spec-Dō）」に基づいた説明文の更新。
- `docs/ja/specdojo/guides/ryu-guide.md`: 「流（approach）」に関する説明を「仕様道（Spec-Dō）」の名称体系に合わせて更新。
- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: 概要ガイドにおける「仕様道（Spec-Dō）」に基づいた説明文の更新。
- `docs/ja/specdojo/guides/waza-guide.md`: 「技（feature）」に関する説明を「仕様道（Spec-Dō）」の名称体系に合わせて更新。

## 3. 申し送り

- 成果物の更新が完了しました。`pjr-index.md` の状態遷移およびレビューは人間が行ってください。

## 4. 進め方と実践の型の適用

決定された「仕様道（Spec-Dō）」の名称体系（技・流および道場としての名称）を、プロジェクトの主要な説明文書（README、トップページ、概要ガイド、および各ガイド）に適用しました。各ファイルに対して、`npx prettier` による整形と `npx markdownlint` による静的検査を実施し、品質を確保しています。
