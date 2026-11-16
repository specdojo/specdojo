---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sf-index-005-20261113t161432z-452d6806
  type: exec-result
  task_id: T-KATA-WAVE-1-sf-index-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sf-index-005/T-KATA-WAVE-1-sf-index-005-20261113T161432Z-452d6806/plan.md
  started_at: "2026-11-13T16:14:33.146Z"
  completed_at: "2026-11-13T17:47:15.891Z"
  agent: opus-executor
  execution: agent
  approach: bootstrap
  targets:
    - sf-index
    - specdojo:sf-index-rulebook
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- システム化機能一覧（`sf-index.md`）の代表初版を作成し、対応する実践の型（`sf-index-rulebook.md`, `sf-index-sample.md`）を整備しました。
- 代表成果物 `sf-index.md` では、8つの機能領域と13の機能を定義し、業務プロセス仕様（BPS）およびCLIコマンドへのマッピングを行いました。
- `sf-index-rulebook.md` を標準的な章構成で再構築し、機能ID（`SF-&lt;AREA&gt;-&lt;NN&gt;`）の命名規則や記述ガイド（良例・悪例）を整備しました。
- `sf-index-sample.md` を Kinuya 文脈での完全な例として書き換え、rulebook との整合性を確保しました。
- recipe および template は、内容が上流仕様から一義的に定まること、および単一文書構成であることから `not-needed` と判定し、rulebook のfrontmatterに宣言しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`: 既存の不完全な構成から、標準的な章立てに基づいた規定へと再構築。命名規則や判定基準を明確化し、recipe/template を `not-needed` と宣言しました。
- `docs/ja/specdojo/samples/sf-index-sample.md`: rulebook の規定に沿った Kinuya 文脈の完成例として内容を全面的に書き換えました。
- `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`: 代表成果物の初版を作成。機能領域および個別の機能を定義し、BPSやCLIコマンドへの参照を整理しました。

## 3. 申し送り

- Recorded for the result's 進め方と実践の型の適用 section: rulebook was rebuilt because the existing one was a generic scaffold with a broken H1 link and generic sections. Exemplars (form only): specdojo:tsd-index-rulebook / specdojo:tsd-index-sample (ready index type), specdojo:sf-rulebook / specdojo:sf-sample (ready, same family). Kept consistent with sf-sample: function ID SF-POS-01, sf-inventory, and P-04/P-06 delegation.
- recipe set to not-needed: the content follows almost entirely from the upstream BPS / interface specs and the catalog, so there is little room for quality differences between authors (same reasoning as tsd-index). template set to not-needed: sf-index is one document per system, so there is no recurring skeleton to scaffold from.
- Deliverable sf-index: most `depends_on` BPS documents and `clis-index` are not created yet, so rows are provisional and based on catalog definitions (dct-business-model-bps / dct-user-interface-model) and the catalog `evidence_ref` src/specdojo.ts. Tracked as Q-01; BA should reconcile once the BPS documents exist.
- Catalog issue for BA/PM (Q-02): the sf-index `depends_on` in dct-system-functions.yaml does not include the BPS for P-04 (bps-planning-schedule-event-update), P-06 (bps-routine-job-run), P-08 (bps-deliverable-evaluation) or P-14 (bps-routine-register-schedule-cycle), although the list references them. Decide whether to add them or state that only area-representative BPS are dependencies.
- Q-03 (assumption): SF-DEPR-01 maps `deliverable trash` to deprecation/storage; to be confirmed in bps-deprecation-process.
- Polish pass, one round: merged a separate coverage table into the 機能構成 chapter (no duplicate coverage table); replaced the cdfd-overview link with the `depends_on` catalog as the source of the P-xx area IDs; removed an ungrounded 20-row threshold from the rulebook.
- 適用外の検証: `npm run validate:history-links`（No `pjr-*.md,` plan.md or result.md was changed by the executor）
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` file was changed）
- 適用外の検証: `specdojo catalog validate`（The deliverable changes are outside docs/ja/projects/ (product docs and specdojo kata); no catalog file was edited）

## 4. 進め方と実践の型の適用

bootstrap
