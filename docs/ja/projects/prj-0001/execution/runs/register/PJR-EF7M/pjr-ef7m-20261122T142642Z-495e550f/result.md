---
specdojo:
  id: prj-0001:xer-pjr-ef7m-20261122t142642z-495e550f
  type: exec-result
  task_id: PJR-EF7M
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EF7M/pjr-ef7m-20261122T142642Z-495e550f/plan.md
  started_at: "2026-11-22T14:26:42.924Z"
  completed_at: "2026-11-22T14:31:03.479Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- post-integration.log を .gitignore（と config init の既定パターン）で git の管理外にした。個票の対応結果に決定理由・既存ログの扱い・CHANGELOG 文案を記載済み。

## 2. 変更ファイル

- `.gitignore`: 変更、+4 / -0 行
- `src/shared/specdojo-gitignore.ts`: 変更、+5 / -1 行
- `tests/src/shared/specdojo-gitignore.test.ts`: 変更、+30 / -0 行

## 3. 申し送り

- 決定: 統合の後の検査のログは commit に含めず、.gitignore で除外した。ログの場所は変えないため、失敗時の案内と冪等性の確認は影響を受けない。理由は、commit に含める案だと統合の後に commit を足す必要があり、runner の動きが増えるため。
- 既存の作業ツリーのログ（61 件）は executor が消していない。.gitignore により git status には出なくなる。不要なら利用者の判断で消してよい。commit 済みのものがあれば git rm --cached で追跡を外す。
- CHANGELOG に書く事項（区分 Fixed）: exec run の統合の後の検査のログ（post-integration.log）が git の管理外のまま作業ツリーに残る問題を、.gitignore と config init の既定の除外に加えて解消した。CHANGELOG.md 自体は変えていない。
- runner の動きに関わる修正のため、統合の後にオーケストレーターが JSEY を流して確かめてから close すること。統合テストは足しておらず、除外は実 git を使う単体テストで確かめた。
- 保護された設定の変更はない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
