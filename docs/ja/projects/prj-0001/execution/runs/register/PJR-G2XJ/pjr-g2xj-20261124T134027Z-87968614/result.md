---
specdojo:
  id: prj-0001:xer-pjr-g2xj-20261124t134027z-87968614
  type: exec-result
  task_id: PJR-G2XJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-G2XJ/pjr-g2xj-20261124T134027Z-87968614/plan.md
  started_at: "2026-11-24T13:40:29.308Z"
  completed_at: "2026-11-24T13:50:05.877Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- sch-strategy-kata-review-all.yaml（103 件・515 タスク）を作り、owner・agent・流す順の決め方と確かめた結果を個票の対応結果に書いた。track は作っていない。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`: 追加、+1107 / -0 行

## 3. 申し送り

- owner の決め方: sample そのものを `owner_rules` に持つ strategy（kata-wave-3〜6）で 69 件を決めた。残る 34 件は、同じ型を整えた kata の strategy（kata-wave-1・kata-wave-2・business-specs-kata・business-specs-kata-2・project-kata。複数あれば新しいほう）の owner を採った。どれにも無いものは同じ rulebook の sample の owner か rulebook の担当の役割から決めた（opd-sample は OPS、pm-orchestrator-playbook-sample は PM、ifx-api-sample・ifx-msg-sample は ARC、prj-charter-sample は launch の PO）。kata-slim・kata-slim-2 は型をまたいで一律 BA で削る段のため根拠に使わなかった。ifx-cmd-sample は business-specs-kata の ARC より新しい business-specs-kata-2 の BA を採った。
- 流す順: `exec run --auto` は critical-first（slack、最早開始、タスク ID）で選び、依存の無い sample どうしは `local_id` の英字順になるため、`cross_domain_dependencies` で 6 段（grade が pass でない sample → プロジェクトの定義・計画 → 業務 → システム → 試験 → 運用・移行）に分けた。各段の最後の sample（etc-index・dct-index・imp-business・sysd-index・imp-test・imp-operations の各 sample）を区切りにし、区切りは段のほかの sample を、次の段の sample は区切りを待つ。前の段の 1 件だけに依存させると後の段のほうが slack が小さく先に選ばれるため、区切りで止める形にした。
- tsp-index-sample を先頭の段に入れた。カタログの `depends_on` で etc-index-sample が tsp-index-sample を待つため、試験の段に残すと依存が循環するからである。
- 要判断: 区切りで止めるため、区切りの sample の 5 段は段の中で 1 件だけが流れる時間になり、段の 1 件が blocked になると次の段は区切りを通るまで始まらない。順を守ることを優先した。夜通しの実行で止まった場合は、オーケストレーターが blocked の sample を再開するか、track を作る前に該当の `cross_domain_dependencies` を外す。
- `approach_rules` は目合わせの strategy に合わせて `improve-kata`（`kata_target: rulebook`）にした。段の approach は phase の `sample-maintenance` が決める。
- track（`sch-track-kata-review-all.yaml`）は完了条件のとおり作っていない。実行の前にオーケストレーターが作る。CHANGELOG に書く事項はなし（個票の対応結果に小節を作った）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
