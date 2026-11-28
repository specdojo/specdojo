---
specdojo:
  id: prj-0001:xer-pjr-fbp0-20261123t235232z-3d5d2830
  type: exec-result
  task_id: PJR-FBP0
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FBP0/pjr-fbp0-20261123T235232Z-3d5d2830/plan.md
  started_at: "2026-11-23T23:52:34.399Z"
  completed_at: "2026-11-24T00:01:31.440Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- register branch-check（範囲の外のパスと個票・イベントの形の検査）、pre-push の入口 tools/check-register-push.mjs、単体テスト、関連文書と個票を更新した。lefthook.yml と .github/ は保護のため変更案のみ。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -0 行
- `docs/ja/specdojo/standards/git-branching-standard.md`: 変更、+1 / -1 行
- `src/register/branch-commands.ts`: 変更、+44 / -0 行
- `src/register/push-check.ts`: 追加、+150 / -0 行
- `tests/src/register/push-check.test.ts`: 追加、+118 / -0 行
- `tests/tools/check-register-push.test.ts`: 追加、+106 / -0 行
- `tools/check-register-push.mjs`: 追加、+93 / -0 行

## 3. 申し送り

- lefthook.yml の pre-push protect-main.run の末尾へ `&& printf '%s\n' "$input" | node tools/check-register-push.mjs --project prj-0001` を足す（保護のため未変更）。
- CI の案: .github/workflows/check-register-push.yml を新設し、`project/*/register` への push で `node --import tsx src/specdojo.ts register branch-check --project prj-0001 --commit "$GITHUB_SHA" --base "${{ github.event.before }}" --remote-ref "$GITHUB_REF"` を流す（fetch-depth: 0）。全文は個票の対応結果 5.3。
- 決定: 入口は branch-guard と別の branch-check にした。形の検査は個票とイベントに限り、epic・依存・`derived_from` の横断検証は含めない。
- 実 Git を通る統合テストは未追加（executor は test:integration を流せない）。
- CHANGELOG に書く事項: 区分 Added。文案は個票の対応結果 5.5。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
