---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-security-safety-sample-110-20261125t135959z-69ff504f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-security-safety-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-security-safety-sample-110/T-KATA-REVIEW-ALL-nfr-security-safety-sample-110-20261125T135959Z-69ff504f/plan.md
  started_at: "2026-11-25T14:00:12.506Z"
  completed_at: "2026-11-25T14:02:22.061Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を行い、sample の「関連ドキュメント導線」に、rulebook が求める `stc-*` への導線を 1 行足した。総合テストは置かず、権限・暗号化・秘匿は受入条件で判定する旨を書いた。
- ほかに要る内容の欠けや要らない内容は見当たらなかった。grade の F001・F005 は kata guide の観点の割り当てにより R1 では扱わず、F002 は R4、F003 は R2 に任せた。
- executor の検査は prettier と markdownlint が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 6. 関連ドキュメント導線 | rulebook の本文要件（関連ドキュメント導線の受入条件）は `stc-*` への導線を求めている。しかし表には `stc-*` の行も、`stc-*` を置かない旨の記述もない（grade F004）。 | 総合テストの行を足した。検証先は `（なし）`、目的は「権限・暗号化・秘匿は受入条件で判定するため、`stc-*` を置かない」とした。 | `vp-qe-kata-conformance`（種別の責務）。rulebook の本文要件の表を正とした。`nfr-index-sample` の導線表で機密性・安全性の検証が `sac-store-sales` だけになっていることに合わせた。F004 の観点 `vp-qe-omissions-consistency` は R2 の観点だが、rulebook が求める内容の欠けなので R1 で扱った。 | 要判断（R2 に任せる案は選ばなかった） |
| R1-2 | R1 | 3. 機密性・安全性要件一覧（`nfr-sec-012`） | grade F001・F005 は、未決の日数に決定者・期限・解消条件がないと指摘している。 | - | kata guide の「kata の観点の組」は、`vp-po-decision-readiness` と `vp-ops-release-readiness` を kata の段のレビューでは使わないとしている。kata の承認と ready 化は登録簿で追うため、R1 では直さなかった。 | - |
| R1-3 | R1 | 5. 例外運用・4. 測定・検証方法 | grade F002（`nfr-sec-ex-001` の期限が相対表現）は `vp-qe-verifiability` の観点なので R4 に、F003（`nfr-sec-003` の測定方法に管理と本部連携の主体がない）は `vp-qe-omissions-consistency` の観点なので R2 に任せる。 | - | kata guide の「kata の観点の組」の段と観点の割り当て。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: 「関連ドキュメント導線」の表に総合テストの行を 1 行追加した。検証先は `（なし）` とし、目的は「権限・暗号化・秘匿は受入条件で判定するため、`stc-*` を置かない」とした。rulebook が求める `stc-*` への導線を満たし、`nfr-index-sample` の導線表とも合わせた。

## 3. 申し送り

- grade F002（`nfr-sec-ex-001` の期限が相対表現）は `vp-qe-verifiability` の観点なので R4 に、F003（`nfr-sec-003` の測定方法に管理と本部連携の主体がない）は `vp-qe-omissions-consistency` の観点なので R2 に任せている。
- R1-1: R1 / 6. 関連ドキュメント導線 / rulebook の本文要件（関連ドキュメント導線の受入条件）は `stc-*` への導線を求めるが、表に `stc-*` の行も置かない旨の記述もない（grade F004） / 総合テストの行を足した。検証先は `（なし）`、目的は『権限・暗号化・秘匿は受入条件で判定するため、`stc-*` を置かない』とした / `vp-qe-kata-conformance`（種別の責務）。rulebook の本文要件の表を正とした。`nfr-index-sample` の導線表で機密性・安全性の検証が `sac-store-sales` だけになっていることに合わせた。F004 の観点 `vp-qe-omissions-consistency` は R2 の観点だが、rulebook が求める内容の欠けなので R1 で扱った / 要判断（R2 に任せる案は選ばなかった）
- R1-2: R1 / 3. 機密性・安全性要件一覧（`nfr-sec-012`） / grade F001・F005 は、未決の日数に決定者・期限・解消条件がないと指摘している / - / kata guide の『kata の観点の組』は、`vp-po-decision-readiness` と `vp-ops-release-readiness` を kata の段のレビューでは使わないとしている。kata の承認と ready 化は登録簿で追うため、R1 では直さなかった / -
- R1-3: R1 / 5. 例外運用・4. 測定・検証方法 / grade F002（`nfr-sec-ex-001` の期限が相対表現）は `vp-qe-verifiability` なので R4 に、F003（`nfr-sec-003` の測定方法に管理と本部連携の主体がない）は `vp-qe-omissions-consistency` なので R2 に任せる / - / kata guide の『kata の観点の組』の段と観点の割り当て / -

## 4. 進め方と実践の型の適用

根拠にしたのは、rulebook の本文要件（関連ドキュメント導線の受入条件）、kata guide の「kata の観点の組」、`nfr-index-sample` の導線表。矛盾があれば rulebook を正とする。F004 は rulebook が求める内容の欠けなので R1 で直した。F001・F005 は `vp-po-decision-readiness` と `vp-ops-release-readiness` の観点で、kata guide ではこの 2 つを kata の段のレビューに使わないため、R1 では直していない。kata の承認と ready 化は登録簿で追う。frontmatter の `status` は `draft` のまま据え置いた。
