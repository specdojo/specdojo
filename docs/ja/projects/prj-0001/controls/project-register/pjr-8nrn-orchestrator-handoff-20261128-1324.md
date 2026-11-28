---
specdojo:
  id: prj-0001:pjr-8nrn-orchestrator-handoff-20261128-1324
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: handoff
  item_status: done
  priority: medium
  owner: PO
  registered_at: "2026-11-28T13:24:15Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-28T14:14:52Z"
---

# PJR-8NRN オーケストレーターの引き継ぎ（2026-11-28 13:24 UTC）

## 1. 引き継ぎ元と先

- 引き継ぎ元: 2026-11-28 の対話のオーケストレーターのセッション（Claude Code、Opus 5.5）。v0.10.0 のリリース（PJR-VDHC）までを行った。
- 引き継ぎ先: 次のオーケストレーターのセッション（LLM は問わない）。受け取ったら、受け取った主体を `--by` にして close する。

## 2. 有効な承認の範囲

- codex（sol・terra・luna・watch-diagnoser）は、2026-12-01 1:00 JST まで使わない（indie の依頼、週間の利用上限が近いため）。代わりは opus-executor と sonnet-executor、reporter は sonnet-reporter。
- routine はすべて止めている（`enabled: false`）。再開は indie の指示による（[[prj-0001:pjr-cjnv-routine-resume-timing|PJR-CJNV]] で判断を待つ）。
- push は `npx specdojo guarded-push` だけで行う。先に `--dry-run` で範囲と件数を示し、送るたびに indie の承認を得る。直接の `git push`、main・タグへの push は行わない。
- PJR-6PD7 は今のまま、PJR-B0B8 は範囲外として review に残す（indie の決定）。

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

- 手動で選んだ schedule のタスクの run（`exec run --task`）は、`--track-state` を付けないと claim・complete が記帳されない。
- `worktrees/` の下に作る作業ツリーでは、prj-0002 の `repos` の相対パス（`../specdojo-lp` など）が解決できない。commit の hook は、`packages/*` の `node_modules` と、git 管理外の登録簿の一覧（`register build`）がないと止まる。
- 古い列（runner が動いていない `kra-day1`・`kra-night1`・`kra-night1b`・`rerun-70ss` など）の片づけ方は、まだ決めていない。
- 12 月末が期限の主な項目: PJR-SVKR（docs-site の型検査を `check:release` に入れる）、PJR-AQJE（入門ガイドの用語）、PJR-0M82（メモの置き場の決定、担当と期限は未定）、PJR-3R7V（kata_locale）、期限を延ばした BA の 7 件。
- handoff の起票の後に行ったこと（2026-11-28）:
  - 定期実行と過去の run が残した実行の記録（job run・報告・見張りの記録・予約の列・止まった schedule の run）を develop に commit した（45bde8702e）。
  - [[prj-0001:pjr-6v26-comprehension-debt-core-message|PJR-6V26]] の入力・完了条件・作業内容・関連ドキュメントを書いた。範囲は日本語の 4 文書（README・英語版は含めない）、略称は CSpE（CSE は使わない）。indie の LP の文案の全文を入力に載せ、4 つの症状・人と AI の分担・既存の道具との関係・小さく始めること・「未来の誰かが理解できるように」を完了条件に振り分けた。exec に流す前に完了条件を indie が確かめる。
  - prj-0002 に PJR-9GB9（specdojo-lp を理解の負債を中心のメッセージに書き直す、BA・2026-12-31）を `--from prj-0001:PJR-6V26` で起票し、入力に文案の全文、完了条件に PJR-T1TH の条件を入れた。PJR-T1TH は 9GB9 に含めて reject した。別のリポジトリへの `register add` は `--section` を使えないため、章は prj-0002 の作業ツリーで書いた。
  - [[prj-0001:pjr-dm1n-cdfd-diagram-layout|PJR-DM1N]] で CDFD の図の描き方を決めた（全体概要は業務のまとまりの囲み、プロセスグループ別は担当ごとのレーンと受け渡しの番号、ユースケース別は D2 の `sequence_diagram`）。反映は [[prj-0001:pjr-756e-cdfd-d2-layout-samples|PJR-756E]]（PJR-PYS2 の子、BA・2026-12-31）で、まず型の sample と `cdfd-d2-rulebook` を直す。製品の CDFD は PJR-T1D1 でそろえる。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]
- [[prj-0001:pjr-vdhc-release-v0-10-0|PJR-VDHC]] v0.10.0 のリリース
- [[prj-0001:pjr-gdmb-guarded-push-entry|PJR-GDMB]] 範囲を守る push の入口
- [[prj-0001:pjr-svkr-check-release-docs-site-typecheck|PJR-SVKR]] docs-site の型検査
- [[prj-0001:pjr-cjnv-routine-resume-timing|PJR-CJNV]] routine の再開の時期
- [[prj-0001:pjr-6v26-comprehension-debt-core-message|PJR-6V26]] 理解の負債を中心の課題として記述を見直す
- [[prj-0001:pjr-dm1n-cdfd-diagram-layout|PJR-DM1N]] CDFD の図の描き方
- [[prj-0001:pjr-756e-cdfd-d2-layout-samples|PJR-756E]] CDFD の D2 の記法と sample の描き直し
