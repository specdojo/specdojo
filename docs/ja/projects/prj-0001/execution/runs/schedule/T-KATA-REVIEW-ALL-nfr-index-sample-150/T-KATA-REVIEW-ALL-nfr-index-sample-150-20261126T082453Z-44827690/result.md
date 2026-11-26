---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-index-sample-150-20261126t082453z-44827690
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-index-sample-150/T-KATA-REVIEW-ALL-nfr-index-sample-150-20261126T082453Z-44827690/plan.md
  started_at: "2026-11-26T08:25:03.847Z"
  completed_at: "2026-11-26T08:31:59.512Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、nfr-index-sample の「関連ドキュメント導線（SAC/STC/OPD/OPR/DEC）」の表と表の後の段落を、個別の NFR sample、`sac-rulebook` の命名、`stc-index-sample` に合わせて直した。
- grade の F001（営業時間外の緊急連絡手段の `_UNDECIDED_`）と F002（監査ログ保管期間の再掲）は、前の段で解消済みだった。追加の変更はしていない。
- 相手側の文書（nfr-reliability・nfr-availability・nfr-integrity・nfr-operations・nfr-usability の各 sample）を直すべき点は変更せず、直す案を findings と handoff に記した。
- executor の prettier 検査と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 受入条件を `sac-store-sales` にまとめていて、各分冊の `sac-reliability`・`sac-availability`・`sac-integrity`・`sac-operations` と `sac-rulebook` の命名（`sac-&lt;term&gt;`）と食い違う。性能には受入条件がなかった。 | 信頼性・可用性・完全性・運用をそれぞれの分冊の `sac-*` に替え、性能に `sac-performance` を足した。 | vp-qe-kata-conformance。`nfr-*-sample` の「関連ドキュメント導線」、sac-rulebook のファイル名の規則、sac-sample（システム受入条件: 性能） | - |
| R5-2 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 性能の総合テストが `stc-cash-sale` だけで、`stc-index-sample` の「代表的な非機能」（`stc-cash-sale`・`stc-credit-balance`・`stc-daily-close`）と食い違う。 | `stc-credit-balance` と `stc-daily-close` を足した。 | vp-qe-kata-conformance。stc-index-sample の「観点の立て方（共通）」 | - |
| R5-3 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 信頼性の運用と判断記録が（なし）で、nfr-reliability-sample の `opd-monitoring`・`opd-incident-management`・`opr-incident`・`dec-reliability-criteria` と食い違う。 | 4 つを足した。 | vp-qe-kata-conformance。nfr-reliability-sample の「関連ドキュメント導線」 | - |
| R5-4 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 保守性の運用に、nfr-maintainability-sample が参照する `opr-incident` がない。 | `opr-incident` を足した。 | vp-qe-kata-conformance。nfr-maintainability-sample の「関連ドキュメント導線」 | - |
| R5-5 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 完全性の運用が `opr-index` で、nfr-integrity-sample が必須とする `opd-integrity-check`・`opr-integrity-check` と食い違う。どちらの文書もまだない。 | `opd-integrity-check`、`opr-integrity-check` に替えた。 | vp-qe-kata-conformance。nfr-integrity-sample の「関連ドキュメント導線」。opd-index-sample・opr-index-sample に整合性チェックの記述はない。 | 要判断（替えずに `opr-index` を残す案もある。選ばなかったのは、分冊が必須とする参照と食い違うため） |
| R5-6 | R5 | 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） | 運用の検証が（なし）で、表の後の段落も「保守性と運用の検証は（なし）」としていた。nfr-operations-sample は `sac-operations` で `nfr-ops-001`〜`nfr-ops-009` の合否を判定する。運用の導線にも、分冊が参照する `opd-index`・`opr-backup-restore`・`opr-incident` がない。 | 検証列を `sac-operations` にし、運用の導線に 3 つを足した。段落を「保守性は受入条件も総合テストも置かず月次点検、運用は受入条件だけで確かめる」に直した。 | vp-qe-kata-conformance、vp-dev-change-impact。nfr-operations-sample の「関連ドキュメント導線」 | - |
| R5-7 | R5 | 関連ドキュメント導線（相手側: nfr-reliability・nfr-availability・nfr-integrity の各 sample） | 分冊の総合テストの ID（`stc-reliability`・`stc-availability`・`stc-integrity`）が、総合テストの系列（stc-index-sample の `stc-cash-sale`・`stc-sale-hold`・`stc-record-recovery` など）にない。 | 相手側を直す案: nfr-reliability-sample は `stc-cash-sale`・`stc-sale-hold`、nfr-availability-sample は `stc-record-recovery`、nfr-integrity-sample は `stc-cash-sale`・`stc-record-recovery` に替える。index は系列の ID を残した。 | vp-qe-kata-conformance。stc-index-sample の分け方（業務シナリオ単位） | 要判断（分冊ごとの `stc-&lt;category&gt;` を正とし、index と stc-index を替える案もある。選ばなかったのは、stc-index の分け方が業務シナリオ単位のため） |
| R5-8 | R5 | 関連ドキュメント導線（相手側: nfr-availability-sample） | index が可用性の判断記録とする `dec-offline-recording` を、分冊が参照していない。 | 相手側を直す案: nfr-availability-sample の未決事項「通信断の頻度と店頭での記録方法」の行か関連ドキュメント導線に `dec-offline-recording` を足す。 | vp-qe-kata-conformance。index と分冊の参照の食い違い | - |
| R5-9 | R5 | 関連ドキュメント導線（相手側: nfr-operations-sample） | index の運用の導線にある `opr-support` を、分冊が参照していない。opr-support-sample にも nfr の参照はない。 | 相手側を直す案: 一次連絡や問い合わせの手順として nfr-operations-sample の関連ドキュメント導線に `opr-support` を足す。足さないなら index から外す。 | vp-qe-kata-conformance。index と分冊の参照の食い違い | 要判断（どちらを正とするか決める材料が sample の中にない） |
| R5-10 | R5 | 関連ドキュメント導線（相手側: nfr-usability-sample） | 分冊が `nfr-usb-005`・`nfr-usb-006` の判定に総合テスト（stc-sample）を挙げる一方、stc-index-sample の「対象外・除外理由（共通）」は操作性を総合テストの対象外として受入テストに任せている。分冊の測定方法も総合テストの終了時のレビューである。 | 相手側を直す案: nfr-usability-sample の総合テストの行を、受入テストかレビューの記録への参照に直す。index の操作性の検証は `sac-store-sales` のままにした。 | vp-qe-kata-conformance。stc-index-sample の「対象外・除外理由（共通）」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-index-sample.md`: 「関連ドキュメント導線」の表で、受入条件を各分冊の `sac-*`（`sac-performance`・`sac-reliability`・`sac-availability`・`sac-integrity`・`sac-operations`）に替えた。性能の総合テストに `stc-credit-balance` と `stc-daily-close` を足した。信頼性・保守性・運用の運用・判断記録の参照を分冊に合わせて補い、完全性の運用を `opd-integrity-check` と `opr-integrity-check` に替えた。運用の検証を `sac-operations` にした。表の後の段落は、保守性は月次点検、運用は受入条件だけで確かめる内容に直した。

## 3. 申し送り

- R5-1: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 受入条件を `sac-store-sales` にまとめていて、各分冊の `sac-reliability`・`sac-availability`・`sac-integrity`・`sac-operations` と `sac-rulebook` の命名（`sac-&lt;term&gt;`、例 `sac-performance`）と食い違う。性能には受入条件がなかった / 信頼性・可用性・完全性・運用をそれぞれの分冊の `sac-*` に替え、性能に `sac-performance` を足した / vp-qe-kata-conformance。`nfr-*-sample` の「関連ドキュメント導線」、sac-rulebook のファイル名の規則、sac-sample（システム受入条件: 性能） / -
- R5-2: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 性能の総合テストが `stc-cash-sale` だけで、`stc-index-sample` の「代表的な非機能」（`stc-cash-sale`・`stc-credit-balance`・`stc-daily-close`）と食い違う / `stc-credit-balance` と `stc-daily-close` を足した / vp-qe-kata-conformance。stc-index-sample の「観点の立て方（共通）」 / -
- R5-3: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 信頼性の運用と判断記録が（なし）で、nfr-reliability-sample の `opd-monitoring`・`opd-incident-management`・`opr-incident`・`dec-reliability-criteria` と食い違う / 4 つを足した / vp-qe-kata-conformance。nfr-reliability-sample の「関連ドキュメント導線」 / -
- R5-4: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 保守性の運用に、nfr-maintainability-sample が参照する `opr-incident` がない / `opr-incident` を足した / vp-qe-kata-conformance。nfr-maintainability-sample の「関連ドキュメント導線」 / -
- R5-5: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 完全性の運用が `opr-index` で、nfr-integrity-sample が必須とする `opd-integrity-check`・`opr-integrity-check` と食い違う / `opd-integrity-check`、`opr-integrity-check` に替えた / vp-qe-kata-conformance。nfr-integrity-sample の「関連ドキュメント導線」。どちらの文書もまだない（opd-index-sample・opr-index-sample に整合性チェックの記述はない） / 要判断（替えずに `opr-index` を残す案もある。選ばなかったのは、分冊が必須とする参照と食い違うため）
- R5-6: R5 / 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 運用の検証が（なし）で、表の後の段落も「保守性と運用の検証は（なし）」としていたが、nfr-operations-sample は `sac-operations` で `nfr-ops-001`〜`nfr-ops-009` の合否を判定する。運用の導線にも、分冊が参照する `opd-index`・`opr-backup-restore`・`opr-incident` がない / 検証列を `sac-operations` にし、運用の導線に 3 つを足した。段落を「保守性は受入条件も総合テストも置かず月次点検、運用は受入条件だけで確かめる」に直した / vp-qe-kata-conformance、vp-dev-change-impact。nfr-operations-sample の「関連ドキュメント導線」 / -
- R5-7: R5 / 関連ドキュメント導線（相手側: nfr-reliability・nfr-availability・nfr-integrity の各 sample） / 分冊の総合テストの ID（`stc-reliability`・`stc-availability`・`stc-integrity`）が、総合テストの系列（stc-index-sample の `stc-cash-sale`・`stc-sale-hold`・`stc-record-recovery` など）にない / - / 相手側を直す案: nfr-reliability-sample は `stc-cash-sale`・`stc-sale-hold`、nfr-availability-sample は `stc-record-recovery`、nfr-integrity-sample は `stc-cash-sale`・`stc-record-recovery` に替える。index は系列の ID を残した / 要判断（分冊ごとの `stc-&lt;category&gt;` を正とし、index と stc-index を替える案もある。選ばなかったのは、stc-index の分け方が業務シナリオ単位のため）
- R5-8: R5 / 関連ドキュメント導線（相手側: nfr-availability-sample） / index が可用性の判断記録とする `dec-offline-recording` を、分冊が参照していない / - / 相手側を直す案: nfr-availability-sample の未決事項「通信断の頻度と店頭での記録方法」の行か関連ドキュメント導線に `dec-offline-recording` を足す / -
- R5-9: R5 / 関連ドキュメント導線（相手側: nfr-operations-sample） / index の運用の導線にある `opr-support` を、分冊が参照していない（opr-support-sample にも nfr の参照はない） / - / 相手側を直す案: 一次連絡や問い合わせの手順として nfr-operations-sample の関連ドキュメント導線に `opr-support` を足す。足さないなら index から外す / 要判断（どちらを正とするか決める材料が sample の中にない）
- R5-10: R5 / 関連ドキュメント導線（相手側: nfr-usability-sample） / 分冊が `nfr-usb-005`・`nfr-usb-006` の判定に総合テスト（stc-sample）を挙げる一方、stc-index-sample の「対象外・除外理由（共通）」は操作性を総合テストの対象外として受入テストに任せている。分冊の測定方法も総合テストの終了時のレビューである / - / 相手側を直す案: nfr-usability-sample の総合テストの行を、受入テストかレビューの記録への参照に直す。index の操作性の検証は `sac-store-sales` のままにした / -
- F001・F002（grade）: 前の段で直っていた。F001 の営業時間外の緊急連絡手段の `_UNDECIDED_` は備考から消えている。F002 の監査ログの保管期間は「`opd-index` と揃える」だけになり、値は残っていない。保管期間 1 年の正本が opd-index-sample の「権限・アカウント運用（棚卸し・監査ログ）」にあることも確かめた。追加の変更はしていない。
- 適用外の検証: `npm run validate:history-links`（変えたのは docs/ja/specdojo/samples/nfr-index-sample.md だけで、plan・result・個票は変えていない）
- 適用外の検証: `npm run validate:schema:file`（変えたファイルに `*.yaml`・`*.yml` がない）

## 4. 進め方と実践の型の適用

根拠にしたのは、nfr-index-sample と同じ接頭辞の個別 NFR sample、`sac-rulebook` の命名規則、`stc-index-sample`、`opd-index-sample`、`opr-index-sample` である。sample 側に食い違いがあれば index を直した。相手側を直すべき点は変更せず、案を findings に残した。F001・F002 は前の段で解消していたため再編集していない。判断材料が sample の中にない点は「要判断」とした。
