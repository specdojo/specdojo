---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-cop-sample-050-20261123t133242z-ee50ac8b
  type: exec-result
  task_id: T-KATA-WAVE-5-cop-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-cop-sample-050/T-KATA-WAVE-5-cop-sample-050-20261123T133242Z-ee50ac8b/plan.md
  started_at: "2026-11-23T13:32:52.265Z"
  completed_at: "2026-11-23T13:47:31.821Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-sample
---

# Edit Result

## 1. 実施内容

- rulebook の 10 章構成に従い、`docs/ja/specdojo/samples/cop-sample.md` を駄菓子屋きぬやの切替日（`cop-cutover-day`）の完成例として厚く書き直しました。
- 具体的なタイムラインや判定ポイント、作業対象、および `_UNDECIDED_` を用いた未決定事項を盛り込み、`mip-index-sample` や `dmd-sample` と整合性を取っています。
- `prettier` による整形と `lint:md:changed` による検証をパスしています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-sample.md`: rulebook の構成（見出し 1〜10）を適用し、駄菓子屋の販売管理システムの切替における具体的な作業手順、タイムライン、判定基準、および未決定の事項（`_UNDECIDED_`）を記述して、完成例としての厚みを持たせました。

## 3. 申し送り

- 決める必要のある値: 臨時休業の開始時刻は `_UNDECIDED_` のまま残した（遅くとも T-180m の前提）。店主代表がリハーサルの結果を見て決める。切替日も決まっていないが、本書は相対時刻だけで書いている。
- F003（PO の最終承認を明記する）: GO/NO-GO の判断者は店主代表と書いた。文書そのものの承認の範囲は、PJR-76N9 の決まりにより sample 本文に書いていない。
- 関連 sample の `cop-index-sample`・`mtp-sample` はまだ短く、`otp-sample` は業種がきぬやの話とずれている。今回の `cop-sample` と揃えるために書き直しが必要。
- rulebook の変更案: 本文要件の章名『概要（`&lt;term&gt;`）』に、sample で何を書くかの例（例: `cutover-day`）を示すと分かりやすくなる。

## 4. 進め方と実践の型の適用

rulebook に従い、`docs/ja/specdojo/samples/cop-sample.md` を「駄菓子屋きぬや」の具体的な切替手順を示す完成例として拡充しました。具体的な値は `mip-index-sample` 等と整合させ、決定すべき事項は `_UNDECIDED_` を用いて残すことで、指示通りの「厚い sample」を作成しました。
