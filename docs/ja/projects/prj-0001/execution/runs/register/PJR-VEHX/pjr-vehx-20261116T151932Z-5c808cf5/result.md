---
specdojo:
  id: prj-0001:xer-pjr-vehx-20261116t151932z-5c808cf5
  type: exec-result
  task_id: PJR-VEHX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VEHX/pjr-vehx-20261116T151932Z-5c808cf5/plan.md
  started_at: "2026-11-16T15:19:41.714Z"
  completed_at: "2026-11-16T15:26:51.271Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - sf-index
---

# Edit Result

## 1. 実施内容

- sf-index の P-05・P-06・P-14 の対応と未決事項の追跡方法を直し、個票の作業内容と対応結果を更新した。再 grade は orchestrator が流すため実行していない。status は draft のまま。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`: 変更、+46 / -41 行

## 3. 申し送り

- F005: `P-05` を定期実行の定義、`P-06` をジョブの定義とし、`SF-ROUT-01`（`routine`）と `SF-ROUT-03`（`job`）に割り当てた。ジョブ定義に従う Run の実行は `P-07` に属するとして、`SF-ROUT-02` の参照先を `bps-task-edit` に改めた。`SF-ROUT-02` は機能 ID の意味を変えないため `ROUT` に残し、ずれは表の後に注記した。
- F006・F007: `P-14` の処理を既存の機能に割り当てた（運転要求の確定は `SF-ROUT-01`、競合判定と PDCA 要求の発行は `SF-EXEC-01`・`SF-ROUT-02`、実行状態の追跡は `SF-REG-01`・`SF-VIEW-01`）。`SF-ORCH-01` は起動とリポジトリの限定だけを担う。理由: 実装の CLI で `P-14` 専用の処理は `orchestrator launch` だけのため。BPS が未作成なので、`Q-01` で BA が `bps-routine-register-schedule-cycle` と照合する必要がある。
- `Q-02`: `ORCH` の代表 BPS の扱いは未起票。PM が PJR に起票し、カタログの `depends_on` へ加えるか対象外とするかを PO が決める必要がある。
- `Q-01`: 照合表の行ごとの照合作業を、PM が PJR-AK5V と Schedule へ接続する必要がある。Schedule のタスク ID は宣言された資料で確かめられないため、本書には書いていない。
- 実装（`src/specdojo.ts`）に `git` コマンドがあるが、一覧に対応する機能の行がない。機能として扱うかは ARC が次の改訂で判断する。
- 個票の作業内容 No.5（再 grade）は open のまま。再 grade（`grade run --target deliverable`）は orchestrator が流す。
- 作業ツリーに `controls/project-register/events/pjr-vehx.yaml` の差分があるが、executor は編集していない。

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
