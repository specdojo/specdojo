---
specdojo:
  id: prj-0001:xer-pjr-2q86-20261123t032621z-e7d6d33d
  type: exec-result
  task_id: PJR-2Q86
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2Q86/pjr-2q86-20261123T032621Z-e7d6d33d/plan.md
  started_at: "2026-11-23T03:26:25.228Z"
  completed_at: "2026-11-23T03:38:31.687Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- register に種類 handoff（状態は open / done）を追加した。CLI の状態の制限、schema、個票の template、生成ビュー generated/pjr-handoffs.md、pjr-rulebook とガイド・リファレンスを直し、exec と夜の実行から外れることを単体テストで確かめた。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/quick-start-guide.md`: 変更、+11 / -10 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+21 / -6 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 変更、+8 / -2 行
- `docs/ja/specdojo/templates/pjr-index-template.md`: 変更、+1 / -0 行
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`: 変更、+11 / -0 行
- `packages/docs-site/.vitepress/sidebar-kata-config.ts`: 変更、+3 / -0 行
- `src/exec/register.ts`: 変更、+1 / -1 行
- `src/register/core.ts`: 変更、+7 / -0 行
- `src/register/item.ts`: 変更、+18 / -0 行
- `src/register/update.ts`: 変更、+3 / -0 行
- `src/register/views.ts`: 変更、+25 / -0 行
- `tests/src/commands/night-orchestrator.test.ts`: 変更、+1 / -0 行
- `tests/src/exec/register.test.ts`: 変更、+12 / -1 行
- `tests/src/register/commands.test.ts`: 変更、+68 / -0 行
- `tests/src/register/register.test.ts`: 変更、+112 / -1 行
- `docs/ja/specdojo/templates/pjr-handoff-template.md`: 追加、+44 / -0 行
- `docs/ja/specdojo/templates/pjr-handoffs-template.md`: 追加、+27 / -0 行

## 3. 申し送り

- handoff の状態は open と done だけに限り、start / wait / review / reject / defer と close --status decided は個票・event を書く前にエラーにした。理由: PJR-5RY7 が状態を受け取り待ち・受け取ったの 2 つと決めており、例外終端を許すと『開いている handoff = まだ読まれていない引き継ぎ』が崩れるため。
- 開いている handoff を見つける手段として、状態別ビューへの追加ではなく専用の生成ビュー `generated/pjr-handoffs.md`（受け取り待ち / 受け取り済み）を足した。理由: 状態別ビューの open にはほかの種類が混ざり見つけにくいため。
- `exec run --register`（`registerItemCategory`）と `orchestrator night`（`selectApprovedNightItems`）は許可リストで選ぶため、コードを変えずに handoff は外れる。除外を単体テストで確認した。
- CHANGELOG に書く事項（区分 Added）: `register` に新しい種類 `handoff` を追加。セッションや LLM を切り替えるときの引き継ぎを起票し、受け取ったら `register close` で `done` にする。状態は `open` と `done` だけで、`exec run --register` と `orchestrator night` の対象外。`register build` が受け取り待ちと受け取り済みの一覧 `generated/pjr-handoffs.md` を生成する。
- 保護された設定の変更は不要だった。`specdojo orchestrator handoff` と playbook・オーケストレーター指示の修正は PJR-5RY7 の後続のもう 1 件の todo で扱う。
- `events/pjr-2q86.yaml` に executor が行っていない引用符書式の差分（runner の start 時のもの）があり、触らずに残した。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
