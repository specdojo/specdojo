---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-reliability-sample-120-20261125t220016z-6017a7a6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-reliability-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-reliability-sample-120/T-KATA-REVIEW-ALL-nfr-reliability-sample-120-20261125T220016Z-6017a7a6/plan.md
  started_at: "2026-11-25T22:00:32.041Z"
  completed_at: "2026-11-25T22:08:55.656Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施しました。`docs/ja/specdojo/samples/nfr-reliability-sample.md` の「概要（対象・目的）」内の段落順を、前提から結論の順に読めるよう並べ替えました。
- 並べ替え後の順序は、対象・目的、可用性要件との境界、業務影響の導入文と箇条書き、基準値の決め方です。文言は変えていません。
- ほかの章の順・粒度・表の配置は rulebook の本文構成と合っているため維持しました。template は未定です。
- grade の F001（`nfr-rel-001` と `nfr-rel-004` の基準が `_UNDECIDED_`）は観点 `vp-qe-verifiability` で、R4 の観点です。そのためこの段では直していません。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要（対象・目的） | 結論の「基準値の厳しさは、この影響と…初期目標から決める」が、前提になる業務影響の箇条書きより前にあり、前提から結論の順に読めない。可用性要件との境界の段落も、対象を定める最初の段落から離れて章の末尾にある。 | 段落を、対象・目的、可用性要件との境界、業務影響の導入文と箇条書き、基準値の決め方の順に並べ替えた（文言は変えていない）。 | `vp-arc-document-structure`、rulebook の「概要（対象・目的）」の記述ガイド（基準値の根拠を業務影響からたどれること） | - |
| R2-2 | R2 | 5. 関連ドキュメント導線 | 「根拠」の 2 行（プロジェクト概要、前提・制約・依存）が、rulebook の「位置づけ」の表の順（`nfr-index`、`nfr-availability`、`sac-*`/`stc-*`、`opd-*`/`opr-*`、`dec-*`）の途中に入っている。 | - | `vp-arc-document-structure`。「根拠」の行を末尾へ移すと rulebook の順になる。ただし `specdojo:nfr-availability-sample` は「根拠」を NFR 全体の入口の直後に置いており、片方だけ直すと兄弟の sample とずれるため変えなかった。NFR の sample で「根拠」の行の位置をそろえるかは R5 で判断してほしい。 | 要判断 |
| R2-3 | R2 | 3. 信頼性要件一覧 | grade の F001（`nfr-rel-001` と `nfr-rel-004` の基準が `_UNDECIDED_` で pass / fail を判定できない）は観点 `vp-qe-verifiability` で、kata-guide の「kata の観点の組」では R4 の観点のため、この段では直さない。基準を決める契機は「適用範囲・前提条件」の技術前提（試用期間の実績から判断する）と「測定・検証方法」の見直しの契機に分かれて書かれており、R4 で備考に判断契機を書く場合はこの 2 か所を参照できる。 | - | `vp-qe-verifiability`（R4 に任せる） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-reliability-sample.md`: 「1. 概要（対象・目的）」の段落を並べ替えました。順序は、対象・目的、可用性要件との境界、業務影響の導入文と箇条書き、基準値の決め方です。基準値の決め方が、前提となる業務影響より後に来ます。文言は変えていません。

## 3. 申し送り

- `prettier --check` と、runner による lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema は passed でした。lint:ts、lint:md、lint:fm、test:integration、typecheck、test:unit は変更種別により `not_applicable` です。
- R2-1: 段 R2 / 箇所 1. 概要（対象・目的） / 指摘: 結論の「基準値の厳しさは、この影響と…初期目標から決める」が、前提になる業務影響の箇条書きより前にあり、前提から結論の順に読めない。可用性要件との境界の段落も、対象を定める最初の段落から離れて章の末尾にある / 直した案: 段落を、対象・目的 → 可用性要件との境界 → 業務影響の導入文と箇条書き → 基準値の決め方の順に並べ替えた（文言は変えていない） / 根拠: `vp-arc-document-structure`、rulebook の「概要（対象・目的）」の記述ガイド（基準値の根拠を業務影響からたどれること） / 印: -
- R2-2: 段 R2 / 箇所 5. 関連ドキュメント導線 / 指摘: 「根拠」の 2 行（プロジェクト概要、前提・制約・依存）が、rulebook の「位置づけ」の表の順（`nfr-index`、`nfr-availability`、`sac-*`/`stc-*`、`opd-*`/`opr-*`、`dec-*`）の途中に入っている / 直した案: - / 根拠: `vp-arc-document-structure`。「根拠」の行を末尾へ移すと rulebook の順になるが、`specdojo:nfr-availability-sample` は「根拠」を NFR 全体の入口の直後に置いており、片方だけ直すと兄弟の sample とずれるため変えなかった。NFR の sample で「根拠」の行の位置をそろえるかは R5 で判断してほしい / 印: 要判断
- R2-3: 段 R2 / 箇所 3. 信頼性要件一覧 / 指摘: grade の F001（`nfr-rel-001`・`nfr-rel-004` の基準が `_UNDECIDED_` で pass / fail を判定できない）は観点 `vp-qe-verifiability` で、kata-guide の「kata の観点の組」では R4 の観点のため、この段では直さない。基準を決める契機は「適用範囲・前提条件」の技術前提（試用期間の実績から判断する）と「測定・検証方法」の見直しの契機に分かれて書かれており、R4 で備考に判断契機を書く場合はこの 2 か所を参照できる / 直した案: - / 根拠: `vp-qe-verifiability`（R4 に任せる） / 印: -

## 4. 進め方と実践の型の適用

根拠は、`vp-arc-document-structure` と、rulebook の「概要（対象・目的）」の記述ガイドです。ガイドは、基準値の根拠を業務影響からたどれることを求めています。この根拠に基づき、概要の段落を前提から結論の順に並べ替えました。rulebook と矛盾する箇所はありません。F001 は R4 の観点のため未対応です。基準を決める契機は、「適用範囲・前提条件」の技術前提と「測定・検証方法」の見直しの契機の 2 か所に書かれています。R4 で備考に判断契機を書く場合は、この 2 か所を参照できます。
