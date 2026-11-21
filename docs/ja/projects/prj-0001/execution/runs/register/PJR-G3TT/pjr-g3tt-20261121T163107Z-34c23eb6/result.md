---
specdojo:
  id: prj-0001:xer-pjr-g3tt-20261121t163107z-34c23eb6
  type: exec-result
  task_id: PJR-G3TT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-G3TT/pjr-g3tt-20261121T163107Z-34c23eb6/plan.md
  started_at: "2026-11-21T16:31:08.422Z"
  completed_at: "2026-11-21T22:50:52.113Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- reporter の JSON 出力でバッククォートがバックスラッシュ付きでエスケープされ、runner の `reporterFreeText` がそのまま result 本文へ書いて MD038 になる原因を特定した。runner 側で、バッククォートがすべてエスケープされている文に限り戻す `unescapeBackticksWhenUniform` を追加し、`reporterFreeText` から呼ぶ。単体テストを 3 件追加した。個票の対応結果と CHANGELOG 文案を記入した。

## 2. 変更ファイル

- `src/exec/results.ts`: 変更、+2 / -1 行
- `src/exec/shared.ts`: 変更、+1 / -0 行
- `src/shared/text.ts`: 変更、+11 / -0 行
- `tests/src/shared/text.test.ts`: 変更、+19 / -0 行

## 3. 申し送り

- 直し方は runner 側の復元を選んだ。理由は、reporter への指示だけでは LLM の出力を保証できず再発するため。
- エスケープなしのバッククォートが混ざる文は、code span 内の意図したバックスラッシュを壊さないよう復元しない。この場合は MD038 を防げない。
- CHANGELOG 文案（区分 Fixed）は個票の `### 5.1. CHANGELOG に書く事項` に記載した。`CHANGELOG.md` は変更していない。
- reporter ごとの発生回数と、どの reporter agent で起きるかは未集計。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
