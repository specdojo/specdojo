---
specdojo:
  id: prj-0001:xer-pjr-gwyj-20260930t033007z-9fd9
  type: exec-result
  task_id: PJR-GWYJ
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-gwyj-20260930T033007Z-9fd9-plan.md
  started_at: "2026-09-30T03:32:04.048Z"
  completed_at: "2026-09-30T04:03:04.458Z"
  agent: agy-expert-executor
  block_reason: "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)"
---

# Edit Result

## 1. 実施内容

- 残りの `rulebook` のサンプル章を `docs/ja/specdojo/samples/` 配下へ外出しし、各 `rulebook` 本文からの参照に切り替えた。
- 外出しに伴い、`ifx-file-sample.md` の MarkdownLint エラー (`MD046`) を修正した。
- Schema 検証エラーが発生していた `tml-sample.yaml` および `ifx-index-sample.yaml` の記述を修正し、すべての Schema 検証をパスさせた。
- 親ランナーによる `test-unit`、`validate-schema`、`typecheck`、`test-integration` の全検証項目が `passed` となっていることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: サンプル章の外出しに伴う参照更新
- `docs/ja/specdojo/rulebooks/tml-rulebook.md`: サンプル章の外出しに伴う参照更新
- `docs/ja/specdojo/samples/atc-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/atc-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/bac-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/bds-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/bes-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/br-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/ccd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cdsd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cld-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cnd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cop-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cpd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/cxd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/dmd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/etc-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/etc-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/ifx-file-sample.md`: サンプル内容の外出しおよび MarkdownLint エラー修正
- `docs/ja/specdojo/samples/itc-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/itc-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/mip-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/mtp-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-availability-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-integrity-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-operations-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-performance-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-reliability-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/nfr-usability-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/otp-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sac-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sf-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sld-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/stc-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/stc-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/stsd-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/sysd-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/tsp-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/uis-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/utc-index-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/utc-sample.md`: サンプル内容の外出し・作成
- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: Schema 検証エラー解消（`none reason=not-implemented` の明記）
- `docs/ja/specdojo/samples/tml-sample.yaml`: Schema 検証エラー解消（フロントマター削除およびモードライン明記）

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

各 `rulebook` のサンプル章を抽出し、`docs/ja/specdojo/samples/` 配下に独立した Markdown および YAML ファイルとして作成した。その後、元の `rulebook` 内の記述を参照形式に書き換えた。抽出後のファイルに対して MarkdownLint および Schema 検証を行い、不整合を修正することで品質基準を満たした。
