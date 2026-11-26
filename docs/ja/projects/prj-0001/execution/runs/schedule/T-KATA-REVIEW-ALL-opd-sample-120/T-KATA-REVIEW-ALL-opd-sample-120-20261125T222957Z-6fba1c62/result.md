---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-sample-120-20261125t222957z-6fba1c62
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-sample-120/T-KATA-REVIEW-ALL-opd-sample-120-20261125T222957Z-6fba1c62/plan.md
  started_at: "2026-11-25T22:30:06.529Z"
  completed_at: "2026-11-25T22:40:36.928Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を `opd-access-control-sample` に対して実施した。章の順（概要、差分を持つ章、関連ドキュメント導線）と見出しは opd-rulebook の本文構成および `opd-index` の章名に一致しており、章の移動・分割・統合は不要だった。
- 指摘は 1 件で、棚卸しの節にある実施時期の段落を、照合と合否より前へ移した。
- executor が実行した prettier と markdownlint は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2.6. 棚卸し / 月次点検ができなかった月の扱い（実施時期の前提） | 実施時期の前提の段落が節の末尾にあり、照合・合否・差異の処理の後に読むことになっていた。 | 段落を節の冒頭の「月次点検で `OPS` が行う」の直後へ移した。 | `vp-arc-document-structure`（前提から結論の順） | - |
| R2-2 | R2 | 全体（概要・権限・アカウント運用・関連ドキュメント導線） | 章の順と見出しは opd-rulebook の本文構成（標準テンプレ）と `opd-index` の章名に一致していた。節の順も、前の節で決めたことを後の節が使う順になっていた。opd-rulebook は `template: not-needed` のため template とは照合していない。 | - | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - |
| R2-3 | R2 | 1. 概要（access-control） | 未決事項の表を概要に置く形は opd-incident-management-sample・opd-monitoring-sample と同じで、表の「影響する節」の値も節名と一致していたため移さなかった。各節へ分ける案は、同じ系列の sample との揃いが崩れるため採らなかった。 | - | `vp-qe-omissions-consistency` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 「2.6. 棚卸し」で、月次点検ができなかった月の扱い（実施時期の前提）の段落を、節の末尾から冒頭の「月次点検で `OPS` が行う」の直後へ移した。前提から結論の順に読めるようにした（2 行追加、2 行削除）。

## 3. 申し送り

- rulebook など sample 以外は変更していない。R2-2 のとおり、opd-rulebook は `template: not-needed` のため template とは照合していない。
- R2-1: R2 / 2.6. 棚卸し / 月次点検ができなかった月の扱い（実施時期の前提）が節の末尾にあり、照合・合否・差異の処理の後に読むことになっていた / 段落を節の冒頭の「月次点検で `OPS` が行う」の直後へ移した / `vp-arc-document-structure`（前提から結論の順） / -
- R2-2: R2 / 全体（概要・権限・アカウント運用・関連ドキュメント導線） / 章の順（概要 → 差分を持つ章 → 関連導線）と見出しは opd-rulebook の本文構成（標準テンプレ）と `opd-index` の章名に一致していた。節の順も前の節で決めたことを後の節が使う順になっていた。opd-rulebook は `template: not-needed` のため template とは照合していない / - / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / -
- R2-3: R2 / 1. 概要（access-control） / 未決事項の表を概要に置く形は opd-incident-management-sample・opd-monitoring-sample と同じで、表の「影響する節」の値も節名と一致していたため移さなかった。各節へ分ける案は、同じ系列の sample との揃いが崩れるため採らなかった / - / `vp-qe-omissions-consistency` / -

## 4. 進め方と実践の型の適用

根拠は opd-rulebook の本文構成（標準テンプレ）、`opd-index` の章名、同系列の sample（opd-incident-management-sample、opd-monitoring-sample）である。観点は `vp-arc-document-structure` と `vp-qe-omissions-consistency`。章の順と見出しは整合していたため維持した。棚卸しの節で、実施時期の前提が結論より後ろにあった 1 箇所だけを移した。未決事項の表を概要に置く形は、同じ系列の sample と揃っており、表の「影響する節」の値も節名と一致していた。そのため各節へ分ける案は採らなかった。
