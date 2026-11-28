---
specdojo:
  id: prj-0001:xer-pjr-qcj5-20261128t095754z-60f0dc3d
  type: exec-result
  task_id: PJR-QCJ5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-QCJ5/pjr-qcj5-20261128T095754Z-60f0dc3d/plan.md
  started_at: "2026-11-28T09:57:59.775Z"
  completed_at: "2026-11-28T10:08:34.329Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- runner に指摘の重複除去を実装し、回帰テスト、kata-guide、5 段の指示、個票を更新した。整形・Markdown lint・schema・catalog・履歴リンク検査は合格。型検査・TS lint・単体テストは親 runner が実行する。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml`: 変更、+5 / -5 行
- `docs/ja/specdojo/guides/kata-guide.md`: 変更、+1 / -1 行
- `src/exec/reporter.ts`: 変更、+4 / -2 行
- `src/exec/results.ts`: 変更、+27 / -1 行
- `tests/src/exec/reporter.test.ts`: 変更、+2 / -0 行
- `tests/src/exec/results.test.ts`: 変更、+79 / -1 行

## 3. 申し送り

- 決定: reporter の差し戻しではなく runner の描画時に除去する。executor と reporter 双方の `handoff` が転記されるため、同じ描画箇所で処理する。規定の指摘書式で No・段が `findings` と一致する項目だけ除き、番号への言及、検証結果、要判断の理由は保持する。
- ホスト側で track を再生成し、`exec refresh` を再実行する。sandbox では検証部分は合格したが、共有 Git ディレクトリのロック作成が EROFS で停止した。個票の作業行は理由付きで open とした。
- 統合後にオーケストレーターが R5（opr-sample）を再実行し、指摘表が 1 回だけ描かれ、申し送りに指摘が重ならず、指摘以外の申し送りが残ることを確認してから close する。
- 保護された設定の変更案はなし。CHANGELOG の Fixed 区分の文案を個票の対応結果に記載した。
- 人の確認が必要: `node --import tsx src/specdojo.ts exec refresh --project prj-0001`（検証部分は合格。共有 Git ディレクトリのロック作成が EROFS で停止したため、ホスト側で再実行が必要。）
- 人の確認が必要: `node --import tsx src/specdojo.ts exec run --project prj-0001 --task T-KATA-REVIEW-CALIBRATION-opr-sample-150`（統合後に実 agent で再実行し、表 1 回・申し送りの重複なし・通常の申し送りの保持を確認する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
