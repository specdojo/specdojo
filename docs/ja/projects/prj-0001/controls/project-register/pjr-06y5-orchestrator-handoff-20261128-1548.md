---
specdojo:
  id: prj-0001:pjr-06y5-orchestrator-handoff-20261128-1548
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: handoff
  item_status: open
  priority: medium
  registered_at: "2026-11-28T15:49:00Z"
  due_on: null
---

# PJR-06Y5 オーケストレーターの引き継ぎ（2026-11-28 15:48 UTC）

## 1. 引き継ぎ元と先

_TODO_: どのセッション・どの LLM から、誰へ引き継ぐかを記載する。

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
  - [[prj-0001:pjr-3r7v-kata-locale-setting|PJR-3R7V]] kata の言語を選ぶ設定 kata\_locale を実装する
  - [[prj-0001:pjr-4n4k-translation-staleness-check|PJR-4N4K]] 日本語版より古くなった翻訳を見つける検査を足す
  - [[prj-0001:pjr-6v26-comprehension-debt-core-message|PJR-6V26]] 理解の負債を中心の課題として、概要・ガイド・philosophy の記述を見直す
  - [[prj-0001:pjr-756e-cdfd-d2-layout-samples|PJR-756E]] CDFD の D2 の記法と 3 つの sample を、囲み・担当のレーン・時系列で描き直す
  - [[prj-0001:pjr-aqje-civic-guide-glossary|PJR-AQJE]] シビックテック入門ガイドに用語の説明とリンクを足す
  - [[prj-0001:pjr-b0b8-agy-session-permissions-multi-repo|PJR-B0B8]] agy のセッション別権限設定に対応し、マルチリポジトリの編集境界を見直す
  - [[prj-0001:pjr-v681-bes-task-ready-selected-refine-grade|PJR-V681]] 代表の bes-task-ready-selected を、grade の指摘で磨き込む
  - [[prj-0001:pjr-vehx-sf-index-rework-grade-findings|PJR-VEHX]] sf-index を grade の指摘で手直しする（P-06 の境界のずれとテスト対象との照合）
  - [[prj-0001:pjr-x1rw-bes-index-rework-grade-findings|PJR-X1RW]] bes-index を grade の指摘で手直しする（イベントからのテストの網羅）

## 4. 判断待ち

- 開いている question:
  - [[prj-0001:pjr-6je3-vscode-extension-separate-repo|PJR-6JE3]] VS Code 拡張を別のリポジトリに分けるか
  - [[prj-0001:pjr-cjnv-routine-resume-timing|PJR-CJNV]] 止めた routine をいつ、どれから再開するか
  - [[prj-0001:pjr-htym-night-20261128-review-followups|PJR-HTYM]] 2026-11-28 の夜の 5 件の review で出た、後続の起票と未決の扱いをどうするか
  - [[prj-0001:pjr-mxqb-gui-wireframe-design-rules|PJR-MXQB]] GUI のワイヤーフレームとデザインのルールをどの型で定めるか
  - [[prj-0001:pjr-nyhf-product-pending-approvals-untracked|PJR-NYHF]] 製品の成果物から外した承認と留保のうち、追跡先のない 5 件をどう決めるか
  - [[prj-0001:pjr-pst5-docs-site-auth-and-delivery|PJR-PST5]] 文書サイトの閲覧の認証と配信（構築環境・配信先・公開範囲）をどうするか
  - [[prj-0001:pjr-y7ff-nightly-mechanisms-roles|PJR-Y7FF]] 夜間の仕組み（orchestrator night・routine・job）の役割をどう分けるか

## 5. 注意点

_TODO_: 会話の中で気づいたことを記載する。決まりになるものは playbook へ移す。ない場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
