---
specdojo:
  id: prj-0001:pjr-8nrn-orchestrator-handoff-20261128-1324
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: handoff
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-28T13:24:15Z"
  due_on: "2026-11-30"
---

# PJR-8NRN オーケストレーターの引き継ぎ（2026-11-28 13:24 UTC）

## 1. 引き継ぎ元と先

- 引き継ぎ元: 2026-11-28 の対話のオーケストレーターのセッション（Claude Code、Opus 5.5）。v0.10.0 のリリース（PJR-VDHC）までを行った。
- 引き継ぎ先: 次のオーケストレーターのセッション（LLM は問わない）。受け取ったら、受け取った主体を `--by` にして close する。

## 2. 有効な承認の範囲

_TODO_: 夜の間に close してよい条件、使わない agent など、引き継ぎ先が従う承認の範囲を記載する。長く効くものは playbook や個票の入力へ移す。ない場合は `-` とする。

## 3. 進行中

- 流している列（`exec queue`）:
  - `docs-dev-2026-11-21`（pending、0/1）
  - `kra-day1-2026-11-25`（running (runner not alive)、0/1、現在: `specdojo exec run --auto --project prj-0001 --track kata-review-all --parallel 4 --loop --max-rounds 1000 --if-busy wait --on-rate-limit fallback --fallback-executor-by sol-executor --reporter-by sonnet-reporter`）
  - `kra-night1-2026-11-24`（running (runner not alive)、0/1、現在: `specdojo exec run --auto --project prj-0001 --track kata-review-all --parallel 4 --loop --max-rounds 1000 --if-busy wait --on-rate-limit wait --reporter-by sonnet-reporter`）
  - `kra-night1b-2026-11-25`（running (runner not alive)、0/1、現在: `specdojo exec run --auto --project prj-0001 --track kata-review-all --parallel 4 --loop --max-rounds 1000 --if-busy wait --on-rate-limit wait --reporter-by sonnet-reporter`）
  - `rerun-70ss-2026-11-21`（running (runner not alive)、0/1、現在: `specdojo exec run --register PJR-70SS --executor-by flash-high-executor --fallback-executor-by opus-executor --worktree --if-busy wait --on-rate-limit fallback --reporter-by gemma26-reporter --fallback-reporter-by sonnet-reporter --exec-defaults tmp/orchestrator/exec-defaults-claude-fallback.yaml --project prj-0001`）
  - それより前に止まった列: 9 件（`exec queue status` で見る）
- in-progress の項目:
  - [[prj-0001:pjr-6pd7-cdfd-overview|PJR-6PD7]] 詳細 CDFD をプロセスグループ別・ユースケース別へ再作成する
- review の項目:
  - [[prj-0001:pjr-b0b8-agy-session-permissions-multi-repo|PJR-B0B8]] agy のセッション別権限設定に対応し、マルチリポジトリの編集境界を見直す
  - [[prj-0001:pjr-v681-bes-task-ready-selected-refine-grade|PJR-V681]] 代表の bes-task-ready-selected を、grade の指摘で磨き込む
  - [[prj-0001:pjr-vehx-sf-index-rework-grade-findings|PJR-VEHX]] sf-index を grade の指摘で手直しする（P-06 の境界のずれとテスト対象との照合）
  - [[prj-0001:pjr-x1rw-bes-index-rework-grade-findings|PJR-X1RW]] bes-index を grade の指摘で手直しする（イベントからのテストの網羅）

## 4. 判断待ち

- 開いている question:
  - [[prj-0001:pjr-6je3-vscode-extension-separate-repo|PJR-6JE3]] VS Code 拡張を別のリポジトリに分けるか
  - [[prj-0001:pjr-mxqb-gui-wireframe-design-rules|PJR-MXQB]] GUI のワイヤーフレームとデザインのルールをどの型で定めるか
  - [[prj-0001:pjr-nyhf-product-pending-approvals-untracked|PJR-NYHF]] 製品の成果物から外した承認と留保のうち、追跡先のない 5 件をどう決めるか
  - [[prj-0001:pjr-pst5-docs-site-auth-and-delivery|PJR-PST5]] 文書サイトの閲覧の認証と配信（構築環境・配信先・公開範囲）をどうするか
  - [[prj-0001:pjr-y7ff-nightly-mechanisms-roles|PJR-Y7FF]] 夜間の仕組み（orchestrator night・routine・job）の役割をどう分けるか

## 5. 注意点

_TODO_: 会話の中で気づいたことを記載する。決まりになるものは playbook へ移す。ない場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
