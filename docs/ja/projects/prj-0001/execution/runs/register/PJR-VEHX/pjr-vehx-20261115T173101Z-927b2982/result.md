---
specdojo:
  id: prj-0001:xer-pjr-vehx-20261115t173101z-927b2982
  type: exec-result
  task_id: PJR-VEHX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VEHX/pjr-vehx-20261115T173101Z-927b2982/plan.md
  started_at: "2026-11-15T17:31:24.284Z"
  completed_at: "2026-11-15T18:16:18.572Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - sf-index
---

# Edit Result

## 1. 実施内容

- sf-index を grade 指摘に沿って改訂した。SF-ROUT-02（ジョブ実行、CLI exec）と新設 SF-ROUT-03（ジョブ定義管理、CLI job、P-06）に境界を分け、全機能 ID と業務領域・代表 BPS・テスト対象・検証手段の照合表を追加した。目的と対象範囲（保守・公開範囲・承認前の確認）と未決事項（影響・判断時点・完了条件・追跡先）を補強した。PO の判断、PJR-AK5V の留保、status draft は維持した。個票の対応結果に判断と残課題を記入した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`: 変更、+59 / -27 行

## 3. 申し送り

- `SF-ROUT-02` の意味を変えないため、P-06（ジョブ定義）の機能は新しい ID `SF-ROUT-03`（CLI `job`）として採番した。ジョブ実行（`exec run --job`）は起動元の P-05 に対応付け、`_ASSUMPTION_` として Q-01（PJR-AK5V）の照合に含めた。
- Q-02 の「領域ごとの代表 BPS」は機能領域ごとと解釈した。その結果、機能領域 `ORCH`（P-14）だけ代表の BPS が成果物カタログ `dct-system-functions` の `sf-index` の `depends_on` にない。`bps-routine-register-schedule-cycle` を加えるか対象外とするかを PO が決める必要がある。この判断の PJR は未起票のため、PM の起票が必要。
- 照合表の検証手段（単体／統合テスト）はテスト仕様を作るときの起点の区分で、既存テストの有無は確認していない。
- `grade run --target deliverable` による再 grade は agent の起動と利用枠の消費を伴うため実行していない。runner または人が実行する。BPS 本文との照合（Q-01・Q-03）は PJR-AK5V の留保として未充足のまま残る。
- F004 の Schedule 参照は、追跡先の Schedule タスク ID が宣言資料で確認できなかったため、確定タスク `T-KATA-WAVE-1-sf-index-140` と PJR-AK5V のみ記載した。
- 公開範囲（製品文書として文書サイトで公開する）は `_ASSUMPTION_` とした。PO が承認時に確定する。
- 人の確認が必要: `grade run --target deliverable`（agent を起動し利用枠を消費するため sandbox からは実行しない。改訂後の sf-index の再 grade が必要）

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
