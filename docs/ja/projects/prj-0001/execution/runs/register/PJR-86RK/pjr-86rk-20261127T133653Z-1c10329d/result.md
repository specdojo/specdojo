---
specdojo:
  id: prj-0001:xer-pjr-86rk-20261127t133653z-1c10329d
  type: exec-result
  task_id: PJR-86RK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-86RK/pjr-86rk-20261127T133653Z-1c10329d/plan.md
  started_at: "2026-11-27T13:39:02.789Z"
  completed_at: "2026-11-27T13:46:42.392Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 幅 960〜1279 で本文が帯 2 つ分ずれる原因を特定して直した。前回足した `.VPLocalNav` の上書きが VitePress の scoped 規則（詳細度 0,2,0）に負けて効いておらず、local nav の `padding-top` と `.VPContent.has-sidebar` の `margin-top` で帯の高さが二重に足されていた。セレクタを `html .Layout &gt; .VPLocalNav`（詳細度 0,2,1）に変えて上書きを効かせ、単体テストと個票の対応結果を更新した。ブラウザでの実測は未実施。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/theme/NextChannelBanner.vue`: 変更、+2 / -1 行
- `tests/packages/docs-site/layout-top-height.test.ts`: 変更、+2 / -1 行

## 3. 申し送り

- 幅 960〜1279 の直し方は CSS と詳細度からの推定である（`_ASSUMPTION_`）。オーケストレーターがヘッドレスのブラウザで、幅 960・1280・1440・640 の本文の上端の差が帯の高さ（約 38px）になることを確かめる必要がある（個票の作業 3 は `open` のまま）。
- CHANGELOG に書く事項は個票の「CHANGELOG に書く事項」の小節のとおり（区分: Fixed）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
