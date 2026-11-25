---
specdojo:
  id: prj-0001:xer-pjr-xekv-20261125t000411z-a89e6a81
  type: exec-result
  task_id: PJR-XEKV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-XEKV/pjr-xekv-20261125T000411Z-a89e6a81/plan.md
  started_at: "2026-11-25T00:04:11.863Z"
  completed_at: "2026-11-25T00:10:52.474Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 3 件の CLI の不足を直しました。EPIPE を静かに終える処理を `exec queue status` と `exec status` に入れ、列の段に `exec resume --task` を置けるようにし、`--section-file` で `###` の小節見出しを許可しました。単体テストとコマンドリファレンス・ガイドも更新し、個票の対応結果に CHANGELOG の文案を書きました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+8 / -7 行
- `src/exec/commands.ts`: 変更、+2 / -0 行
- `src/exec/queue-command.ts`: 変更、+5 / -1 行
- `src/exec/queue.ts`: 変更、+16 / -4 行
- `src/register/section.ts`: 変更、+9 / -5 行
- `tests/src/exec/queue.test.ts`: 変更、+28 / -0 行
- `tests/src/register/section.test.ts`: 変更、+36 / -0 行
- `src/shared/stdout-epipe.ts`: 追加、+14 / -0 行
- `tests/src/shared/stdout-epipe.test.ts`: 追加、+31 / -0 行

## 3. 申し送り

- 判断: `--section-file` で許す小節見出しは `###` に固定した（章は `##` が標準のため。個票から章の深さを引かない）。`register add` の `--section-file` にも同じ規則が適用される。
- 判断: 列の `exec resume` の段は `--task` 必須で、`--due` と `--dry-run` は拒否する。
- 統合の後に、オーケストレーターが EPIPE・列の段の再開・小節見出し入りの章差し替えを手元で確かめてから close する。
- CHANGELOG に書く事項の文案は個票の対応結果 5.2 に記載済み。保護された設定の変更は不要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
