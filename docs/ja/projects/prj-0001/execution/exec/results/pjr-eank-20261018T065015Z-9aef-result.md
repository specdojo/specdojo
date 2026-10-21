---
specdojo:
  id: prj-0001:xer-pjr-eank-20261018t065015z-9aef
  type: exec-result
  task_id: PJR-EANK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-eank-20261018T065015Z-9aef-plan.md
  started_at: "2026-10-18T06:50:15.982Z"
  completed_at: "2026-10-18T06:59:26.267Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- agent-members の schema に実体の `provider`、`model`、`effort` および別名（`alias`）の定義を追加し、実体の循環・不在・無効を検証する仕組みを導入しました。
- Schema、実装、テスト、および関連するガイドと個票を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `exec-config-guide.md` を更新し、schema の変更に関する情報を反映しました。
- `docs/specdojo/schemas/v1/agent-members.schema.yaml`: agent-members の schema に `provider`、`model`、`effort` 、および `alias` を追加しました。
- `src/shared/specdojo-config.ts`: agent-members の新しい schema 定義を読み込むための実装を更新しました。
- `tests/docs/specdojo/schemas/pm-members-schema.test.ts`: 新しい agent-members の schema を検証するためのテストを追加しました。
- `tests/src/shared/specdojo-config.test.ts`: config 読み込みに関するテストを更新しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

1. `docs/specdojo/schemas/v1/agent-members.schema.yaml` を編集し、実体を示す `provider`, `model`, `effort` と、実体を指す `alias` の定義を追加しました。 2. `src/shared/specdojo-config.ts` を更新し、新しい schema 構造に対応させました。 3. `tests/docs/specdojo/schemas/pm-members-schema.test.ts` に schema の正当性を検証するテストを追加しました。 4. 関連するガイド (`docs/ja/specdojo/guides/exec-config-guide.md`) を更新しました。 5. 個票 (`docs/ja/projects/prj-0001/controls/project-register/pjr-eank-agent-members-alias-schema.md`) を整形しました。
