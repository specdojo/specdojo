---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-maintainability-sample-120-20261125t214941z-83dd6ce1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-maintainability-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-maintainability-sample-120/T-KATA-REVIEW-ALL-nfr-maintainability-sample-120-20261125T214941Z-83dd6ce1/plan.md
  started_at: "2026-11-25T21:49:51.051Z"
  completed_at: "2026-11-25T21:55:50.663Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として sample を見直した。「概要（対象・目的）」にあった未決事項の段落と表（`nfr-mnt-003` の MTTR 上限と、決まるまでの扱い）を、「保守性要件一覧」の要件の表の直後へ移した。
- 概要より先に要件 ID と未決の扱いが出ていたため、前提から結論の順に読めなかった。移動後は概要を対象・業務影響・目的に絞れる。
- 「測定・検証方法」にあった「概要の表の扱い」への参照は、移動先に合わせて直した。
- grade の F001 と F002 は R2 の観点ではないため、この段では扱わず申し送った。rulebook など sample 以外は変更していない。
- executor が実行した prettier と markdownlint は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要（対象・目的）→ 3. 保守性要件一覧 | 概要に未決事項の段落と表（`nfr-mnt-003` の MTTR の上限と、決まるまでの扱い）があった。概要は対象・業務影響・目的を 2〜3 文で書く章である。要件一覧より先に要件 ID と未決の扱いが出るため、前提から結論の順に読めなかった。 | 段落と表を「保守性要件一覧」の要件の表の直後へ移した。中核の要件を指す ID（`nfr-mnt-001`・`002`・`004`）を明記した。「測定・検証方法」の参照も合わせて直した。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`、rulebook の「本文要件」と「記述ガイド」の概要（対象・目的） | 要判断（同じ系列の nfr-availability と nfr-performance の sample は、未決事項を独立した章 6 に置いている。保守性の rulebook は 5 章を順序固定と定めているため、章を足す案は採らなかった。nfr-reliability の sample のように、決まるまでの扱いを要件の表の備考へ入れる案もある。） |
| R2-2 | R2 | 3. 保守性要件一覧（grade F001） | F001 は R2 の観点（`vp-qe-kata-conformance`）ではないため、この段では扱わない。指摘は `nfr-mnt-004` が `_UNDECIDED_` だという内容だが、本文では `nfr-mnt-004` に閾値があり、未決は中核の要件ではない `nfr-mnt-003`（MTTR）である。指摘が古いか、行を取り違えている可能性がある。 | - | R1・R5 の `vp-qe-kata-conformance` で再評価する。 | - |
| R2-3 | R2 | 3. 保守性要件一覧 `nfr-mnt-001`（grade F002） | 原因の範囲が、sample は「アプリ・データ・端末・通信」、rulebook の用語定義は「アプリ・データ・端末・外部」で食い違う。R2 の観点ではないため直さない。 | - | R3 の `vp-ux-language-consistency` で扱う。sample を「外部」に揃えるか、rulebook の用語定義を「通信」に寄せるかは R3 か R5 で判断する。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: 「概要（対象・目的）」の未決事項の段落と表を「保守性要件一覧」の要件の表の直後へ移した。移した段落では中核の要件（`nfr-mnt-001`・`002`・`004`）の ID を明記した。「測定・検証方法」の参照を「『保守性要件一覧』の未決事項の表の扱い」に直した。

## 3. 申し送り

- R2 の finding のうち、F001（`nfr-mnt-004` が `_UNDECIDED_` という指摘）の行取り違えの可能性と、F002（原因の範囲の用語差）の扱いは、findings の R2-2 と R2-3 に記した。
- R2-1: R2 / 1. 概要（対象・目的）→ 3. 保守性要件一覧 / 概要に未決事項の段落と表（`nfr-mnt-003` の MTTR の上限と、決まるまでの扱い）があった。rulebook の記述ガイドでは概要は対象・業務影響・目的を 2〜3 文で書く章であり、要件一覧より先に要件 ID と未決の扱いが出るため、前提から結論の順に読めなかった / 段落と表を「保守性要件一覧」の要件の表の直後へ移した。移した段落では、中核の要件を指す ID（`nfr-mnt-001`・`002`・`004`）を明記した。「測定・検証方法」の参照「概要の表の扱い」は「『保守性要件一覧』の未決事項の表の扱い」に直した / `vp-arc-document-structure`、`vp-qe-omissions-consistency`、rulebook の「本文要件」と「記述ガイド」の概要（対象・目的） / 要判断（迷った理由: 同じ系列の nfr-availability と nfr-performance の sample は、未決事項を独立した章 6 に置いている。選ばなかった案は章 6「未決事項」を足す案で、保守性の rulebook が 5 章を順序固定と定めているため採らなかった。nfr-reliability の sample のように、決まるまでの扱いを要件の表の備考へ入れる案もある）
- R2-2: R2 / 3. 保守性要件一覧（grade F001） / F001 は R2 の観点（`vp-qe-kata-conformance`）ではないため、この段では扱わない。指摘は `nfr-mnt-004` が `_UNDECIDED_` だという内容だが、本文では `nfr-mnt-004` に閾値があり、未決は中核の要件ではない `nfr-mnt-003`（MTTR）である。指摘自体が古いか、行を取り違えている可能性がある / - / R1・R5 の `vp-qe-kata-conformance` で再評価する / -
- R2-3: R2 / 3. 保守性要件一覧 `nfr-mnt-001`（grade F002） / 原因の範囲が、本文は「アプリ・データ・端末・通信」、rulebook の用語定義は「アプリ・データ・端末・外部」で食い違う。R2 の観点ではないため直さない / - / R3 の `vp-ux-language-consistency` で扱う。sample を「外部」に揃えるか、rulebook の用語定義を「通信」に寄せるかは R3 か R5 で判断する / -

## 4. 進め方と実践の型の適用

根拠は、rulebook の「本文要件」と「記述ガイド」の概要（対象・目的）、および `vp-arc-document-structure` と `vp-qe-omissions-consistency` である。概要を対象・業務影響・目的に絞り、未決事項は要件の表の直後に置いた。同じ系列の nfr-availability と nfr-performance の sample は未決事項を独立した章 6 に置いている。保守性の rulebook は 5 章を順序固定と定めているため、章を足す案は採らなかった。F001 は R2 の観点ではなく、本文では `nfr-mnt-004` に閾値がある。そのため、未解消の理由と次のアクションを申し送りとして残した。F002 は R3 の `vp-ux-language-consistency` で扱う。
