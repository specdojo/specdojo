---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-performance-sample-150-20261126t084355z-650d9c25
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-performance-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-performance-sample-150/T-KATA-REVIEW-ALL-nfr-performance-sample-150-20261126T084355Z-650d9c25/plan.md
  started_at: "2026-11-26T08:44:05.939Z"
  completed_at: "2026-11-26T08:50:55.979Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として性能要件 sample を、関連する sample 群と突き合わせて見直した。
- 運用後の監視の記述が `specdojo:opd-monitoring-sample`（自動監視はホスティング環境の死活と閉店後のバックアップに限り、応答時間は対象外）と食い違っていたため、sample 側を直した。
- 未決事項に「運用後に基準を超えたときの扱い」を追加した。
- 相手側の sample を直すべき点や判断が要る点は変更せず、案を findings に記載した。
- F001（`vp-qe-verifiability`）は R4 の観点で、R5 では扱わない。現行本文が `nfr-perf-002` と `nfr-perf-004` を基準の確定まで判定せず値の記録のみとする旨を記載済みのため、解消済みと判断した。
- 検査では `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed になった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 測定・検証方法、関連ドキュメント導線、未決事項 | 本書は「運用後は基準を監視の閾値として扱い、超えた場合は運用方針・設計: 監視の手順で対応する」としていた。しかし `specdojo:opd-monitoring-sample` は自動の監視をホスティング環境の死活と閉店後のバックアップに限り、応答時間を監視していない。 | 運用後は判定時期の確認で求めた値を基準と比べ、超過時の扱いは未決事項で決める文に改めた。導線の運用監視の目的は「運用後の監視の対象。応答時間を監視に加えるときの変更先」にした。未決事項に「運用後に基準を超えたときの扱い」（当面は値を記録するだけで通知と初動には使わない）を追加した。 | `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` | - |
| R5-2 | R5 | 関連ドキュメント導線 | `specdojo:nfr-index-sample` の検証導線は、性能の検証先に `stc-cash-sale`・`stc-credit-balance`・`stc-daily-close` を挙げている。本書の導線は `specdojo:stc-sample`（店頭の現金販売）だけで、`nfr-perf-005`・`nfr-perf-006` の総合テスト先を示していない。 | - | `vp-qe-kata-conformance`。つけ残高・日次締めの stc の sample が存在しないため、wikilink を足せない。相手側の案は 2 つある。nfr-index-sample の検証導線を sample の範囲（`stc-cash-sale`）に絞る。または、stc の sample を足す時に本書の導線へ行を加える。存在しない id をバッククォートで仮置きして行を足す案は、完成例に未作成の参照が増えるため選ばなかった。 | 要判断 |
| R5-3 | R5 | 性能要件一覧（`nfr-perf-001` の備考） | 「1 会計を 90 秒以内で終える業務目標」の出典は `specdojo:imp-business-sample` の成功条件（平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内）である。しかし本書の `based_on` にも関連ドキュメント導線にも、その出典がない。 | - | `vp-dev-change-impact`。値は食い違っていないため直さなかった。案は、導線の根拠に imp-business-sample の行を足すか、`based_on` に加えることである。`based_on` は rulebook の上位入力の定めに従うため、R5 の判断だけで足すのは避けた。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-performance-sample.md`: 測定・検証方法の「運用後は基準を監視の閾値として扱う」という記述を、判定時期の確認で求めた値を基準と比べ、超過時の扱いは未決事項で決める文に改めた。関連ドキュメント導線の運用監視の目的を「運用後の監視の対象。応答時間を監視に加えるときの変更先」にした。未決事項に「運用後に基準を超えたときの扱い」（当面は値を記録するだけで、通知と初動には使わない）を追加した。

## 3. 申し送り

- `specdojo:nfr-index-sample` の検証導線に関する R5-2 と、`specdojo:imp-business-sample` の出典に関する R5-3 は、要判断として findings に残した。この 2 件は sample を変更していない。
- R5-1: 段 R5 / 箇所 測定・検証方法、関連ドキュメント導線、未決事項 / 指摘 本書は「運用後は基準を監視の閾値として扱い、超えた場合は運用方針・設計: 監視の手順で対応する」としていたが、`specdojo:opd-monitoring-sample` は自動の監視をホスティング環境の死活と閉店後のバックアップに限り、応答時間を監視していない / 直した案 運用後は判定時期の確認で求めた値を基準と比べ、超過時の扱いは未決事項で決める文に改め、導線の運用監視の目的を「運用後の監視の対象。応答時間を監視に加えるときの変更先」にし、未決事項に「運用後に基準を超えたときの扱い」（当面は値を記録するだけで通知と初動に使わない）を追加した / 根拠 `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` / 印 -
- R5-2: 段 R5 / 箇所 関連ドキュメント導線 / 指摘 `specdojo:nfr-index-sample` の検証導線は性能の検証先に `stc-cash-sale`・`stc-credit-balance`・`stc-daily-close` を挙げるが、本書の導線は `specdojo:stc-sample`（店頭の現金販売）だけで `nfr-perf-005`・`nfr-perf-006` の総合テスト先を示していない / 直した案 - / 根拠 `vp-qe-kata-conformance`。つけ残高・日次締めの stc の sample が存在しないため wikilink を足せない。相手側の案として、nfr-index-sample の検証導線を sample の範囲（`stc-cash-sale`）に絞るか、stc の sample を足す時に本書の導線へ行を加える。選ばなかった案は存在しない id のバッククォート仮置きで行を足すこと（完成例に未作成の参照が増えるため） / 印 要判断
- R5-3: 段 R5 / 箇所 性能要件一覧（`nfr-perf-001` の備考） / 指摘 「1 会計を 90 秒以内で終える業務目標」の出典は `specdojo:imp-business-sample` の成功条件（平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内）だが、本書の `based_on` にも関連ドキュメント導線にもない / 直した案 - / 根拠 `vp-dev-change-impact`。値は食い違っていないため直さなかった。案として、導線の根拠に imp-business-sample の行を足すか、`based_on` に加える。選ばなかった理由は、`based_on` は rulebook の上位入力の定めに従うため、R5 の判断だけで足すのを避けた / 印 要判断
- F001（`vp-qe-verifiability`）は R4 の観点で、R5 では扱わない。現行本文は `nfr-perf-002`・`nfr-perf-004` を基準の確定まで判定せず値の記録のみとする旨を測定・検証方法の合格条件と末尾の段落に記載済みで、指摘は解消済みと判断した。
- 適用外の検証: `npm run lint:md`（pipeline の parent validation として親 runner が実行するため）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の sample 群、`specdojo:opd-monitoring-sample`、`specdojo:imp-business-sample`、`specdojo:nfr-index-sample` と、各 sample の frontmatter の参照先である。食い違いが見つかった運用監視の記述は sample 側を直し、相手側を直すべき点は変更せず案を findings に書いた。維持した記述は、値が相手側と食い違っていないもの（90 秒の業務目標など）である。F001 は R4 の観点であり、現行本文で解消済みと判断した。rulebook と矛盾する箇所はなく、rulebook を正として直した箇所もない。
