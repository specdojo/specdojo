---
specdojo:
  id: prj-0001:xer-pjr-5znk-20261107t235318z-26bccd65
  type: exec-result
  task_id: PJR-5ZNK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5ZNK/pjr-5znk-20261107T235318Z-26bccd65/plan.md
  started_at: "2026-11-07T23:53:18.857Z"
  completed_at: "2026-11-08T00:06:18.405Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- ガイドおよびコマンドリファレンスにおける、旧来の実行記録（`plan.md`・`result.md`・`evidence/`）の置き場所に関する記述を、現在の `execution/runs/&lt;origin&gt;/&lt;item&gt;/&lt;run&gt;/` 形式のパスに合わせて更新しました。
- 変更に伴い、`validate:history-links` の適用対象に関する説明を追記しました。
- 一部の文書については、歴史的な文脈や特定の動作説明のために、あえて旧来のパスの記述を保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `validate:history-links` の適用対象の説明に、`execution/runs/` 配下の `plan.md`・`result.md` に関する記述を追記しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: `validate:history-links` の適用対象の説明に、`execution/runs/` 配下の `plan.md`・`result.md` に関する記述を追記しました。

## 3. 申し送り

- 旧来の置き場所を残した箇所とその理由 (1): `docs/ja/specdojo/guides/exec-operation-guide.md`（403 行目）: 旧配置 `&lt;execution_path&gt;/exec/evidence/&lt;task-id&gt;/&lt;run-id&gt;/` に `checkpoint` がある場合の `--resume` の復帰動作を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (2): `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（72 行目）: `exec validate` における旧配置（`execution/exec/plans/`・`results/`・`evidence/`）の検査対象外免除規則を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (3): `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（106 行目）: 旧 `exec/evidence/` 配下の `run` が自動再開の探索対象にならない移行制約を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (4): `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md`（50 行目）: v0.3.0 リリース時の移行対象として旧 `execution/exec/plans/` を挙げている歴史的文書であるため保持。
- 旧来の置き場所を残した箇所とその理由 (5): `docs/ja/specdojo/references/command-reference.md`（646 行目）: `exec validate` が旧 `exec/plans/`・`results/`・`evidence/` の記録をエラー・警告としない免除規則を説明しているため保持。
- `src/exec/run/agent.ts` に残る `validate:history-links` の説明文更新は別チケット `PJR-C4KF` で対応されます。
- 旧来の置き場所を残した箇所とその理由 (1): docs/ja/specdojo/guides/exec-operation-guide.md（403 行目）: 旧配置 `&lt;execution_path&gt;/exec/evidence/&lt;task-id&gt;/&lt;run-id&gt;/` に checkpoint がある場合の `--resume` の復帰動作を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (2): docs/ja/specdojo/guides/plan-result-lifecycle-guide.md（72 行目）: exec validate における旧配置（execution/exec/plans/・results/・evidence/）の検査対象外免除規則を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (3): docs/ja/specdojo/guides/plan-result-lifecycle-guide.md（106 行目）: 旧 exec/evidence/ 配下の run が自動再開の探索対象にならない移行制約を説明しているため保持。
- 旧来の置き場所を残した箇所とその理由 (4): docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md（50 行目）: v0.3.0 リリース時の移行対象として旧 execution/exec/plans/ を挙げている歴史的文書であるため保持。
- 旧来の置き場所を残した箇所とその理由 (5): docs/ja/specdojo/references/command-reference.md（646 行目）: exec validate が旧 exec/plans/・results/・evidence/ の記録をエラー・警告としない免除規則を説明しているため保持。
- src/exec/run/agent.ts に残る validate:history-links の説明文更新は別チケット PJR-C4KF で対応されます。
- 適用外の検証: `npm run validate:schema:file`（変更に YAML ファイル（`*.yaml` / `*.yml`）がない）

## 4. 進め方

ガイドおよびコマンドリファレンスを精査し、旧来の `exec/` 配下を指すパスを新しい `execution/runs/` 配下の構造に書き換えました。ただし、移行の歴史的背景や、特定の検証プロセスにおける免除ルールを説明するために必要な記述については、意図的に旧パスの記述を残す判断を行いました。また、`validate:history-links` の適用範囲を明確にするための追記を行いました。
