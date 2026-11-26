---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-index-sample-150-20261126t070435z-a313a0fd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-index-sample-150/T-KATA-REVIEW-ALL-bes-index-sample-150-20261126T070435Z-a313a0fd/plan.md
  started_at: "2026-11-26T07:04:45.808Z"
  completed_at: "2026-11-26T07:12:10.675Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-index-sample
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `bes-index-sample` を上位 CDFD（`specdojo:cdfd-overview-sample`）と個別 BES（`specdojo:bes-sample`）に照らし、食い違い 4 件を sample 側で直した。
- P-05 の起点イベントを、入荷を除いた販売のみの `bes-sale-recorded` に改めた。この変更は要判断とした。
- P-05 の改名に伴い、未決事項と照合結果の表から P-05 の差を外した。P-07 の客の呼称は上位 CDFD の「常連客」にそろえた。「店番担当」の定義は冒頭に足した。
- 変更は `docs/ja/specdojo/samples/bes-index-sample.md` のみ。executor の `markdownlint-cli2` と `prettier --check` は通過した。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 業務イベント一覧（P-05 の行） | 行が「販売または入荷」を起点にしていた。上位 CDFD は P-05 の起点を「販売が記録された」とし、入荷数量は仕入グループ（P-02）が在庫記録へ反映すると定めており、食い違っていた。 | `bes-stock-movement-recorded` を `bes-sale-recorded`（販売が記録された）に改めた。入荷は P-02 が反映するため含めないと明記し、発生条件と事実データを販売だけに絞った。選ばなかった案は、CDFD の P-05 に入荷も起点として足す案で、相手側の変更になる。旧 ID は run 記録以外から参照されていない。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。起点イベントの文言は上位 CDFD を正本とするため、sample 側を直した。前の段は CDFD と行のどちらを直すかを未決事項として残していた。 | 要判断 |
| R5-2 | R5 | 3.1. 未決事項・3.2. 照合の結果と確定入力として扱う条件 | R5-1 で P-05 の文言差が解消したのに、未決事項と照合の表が P-03・P-05 の 2 件の差として残っていた。 | 未決事項を P-03（会計の申し出と会計確定の差）だけに絞り、照合の表を「文言の差 1 件」に直した。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（R5-1 の波及） | - |
| R5-3 | R5 | 1. 業務イベント一覧（P-07 の行） | イベント名と上位 CDFD の起点は「常連客」なのに、行内では「まだ登録のない客」「客」と別の語になっていた。 | 「顧客台帳に未登録の常連客」「常連客」にそろえた。 | `vp-qe-kata-conformance`（上位 CDFD の P-07 起点イベント） | - |
| R5-4 | R5 | 冒頭の段落 | 「店番担当」を複数の行で使っているが、一覧内で定義していなかった。個別 BES（`specdojo:bes-sample`）は店主代表と家族利用者代表を店番担当と定義している。 | 冒頭に「店番担当は店番に入る店主代表と家族利用者代表を指す」を足した。 | `vp-qe-kata-conformance`（bes-sample の「誰が／何が」、共通サンプル文脈の共通登場人物） | - |
| R5-5 | R5 | 1. 業務イベント一覧（P-04 の行） | 上位 CDFD の P-04 の主な担当は店主代表だが、一覧は「店番担当が申し出を受けた時点」とあり、一見食い違う。 | -（変更なし）。食い違いとみなす場合は、CDFD 側で P-04 の主な担当に家族利用者代表（管理責任: 店主代表）を足す案を検討する。 | `vp-qe-kata-conformance`。CDFD の適用範囲で店主代表が担うのはつけの承認であり、受付は店番担当、承認は店主代表と読めば両立する。`prj-overview-sample` も家族の店番でのつけの受付を課題にしている。 | - |
| R5-6 | R5 | grade finding F001・F002・F003 | F001（`vp-pm-plan-feasibility`）と F002（`vp-pm-control-reporting`）は、kata-guide の「kata の観点の組」でこの段のレビューに使わない観点として外されている。F003 は照合の結果の表と未実施の明記が前の段で入っており、解消済みである。 | - | kata-guide の「kata の観点の組」と 3.2 の照合の結果の表 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: P-05 の行を `bes-stock-movement-recorded`（販売または入荷）から `bes-sale-recorded`（販売）に改め、入荷は P-02 が反映すると明記した。未決事項を P-03 の 1 件に絞り、照合の表を「文言の差 1 件」に直した。P-07 の行は「顧客台帳に未登録の常連客」「常連客」にそろえた。冒頭に「店番担当」の定義を追記した。

## 3. 申し送り

- F001（`vp-pm-plan-feasibility`）と F002（`vp-pm-control-reporting`）は R5 の観点ではないため、この段では扱っていない。F003 は前の段で照合の結果の表が入っており、解消済みと executor が判断した。
- R5-1: R5 / 1. 業務イベント一覧（P-05 の行） / 行が「販売または入荷」を起点にしていたが、上位 CDFD（specdojo:cdfd-overview-sample）は P-05 の起点を「販売が記録された」とし、入荷数量は仕入グループ（P-02）が在庫記録へ反映すると定めており食い違う / `bes-stock-movement-recorded`（販売または入荷が記録された）を `bes-sale-recorded`（販売が記録された）に改め、入荷は P-02 が反映するため含めないと明記し、発生条件・事実データを販売だけに絞った / vp-qe-kata-conformance、vp-dev-change-impact。sample の冒頭が起点イベントの文言を上位 CDFD を正本とするため sample 側を直した。迷った理由: 前の段が CDFD と行のどちらを直すかを未決事項として残していた。選ばなかった案は、CDFD の P-05 に入荷も起点として足す案（相手側の変更になる）。旧 ID は docs/src 配下の run 記録以外から参照されていない / 要判断
- R5-2: R5 / 3.1. 未決事項・3.2. 照合の結果と確定入力として扱う条件 / R5-1 で P-05 の文言差が解消したのに、未決事項と照合の表が P-03・P-05 の 2 件の差として残っていた / 未決事項を P-03（会計の申し出と会計確定の差）だけに絞り、照合の表を「文言の差 1 件」に直した / vp-qe-kata-conformance、vp-dev-change-impact（R5-1 の波及） / -
- R5-3: R5 / 1. 業務イベント一覧（P-07 の行） / イベント名と上位 CDFD の起点は「常連客」なのに、行内では「まだ登録のない客」「客」と別の語になっていた / 「顧客台帳に未登録の常連客」「常連客」にそろえた / vp-qe-kata-conformance（上位 CDFD の P-07 起点イベント） / -
- R5-4: R5 / 冒頭の段落 / 「店番担当」を複数の行で使っているが一覧内で定義しておらず、個別の BES（specdojo:bes-sample）は店主代表と家族利用者代表を店番担当と定義している / 冒頭に「店番担当は店番に入る店主代表と家族利用者代表を指す」を足した / vp-qe-kata-conformance（bes-sample の 3. 誰が／何が、共通サンプル文脈の共通登場人物） / -
- R5-5: R5 / 1. 業務イベント一覧（P-04 の行） / 上位 CDFD の P-04 の主な担当は店主代表、一覧は「店番担当が申し出を受けた時点」で、一見食い違う / - / vp-qe-kata-conformance。CDFD の適用範囲で店主代表が担うのはつけの承認であり、受付は店番担当、承認は店主代表と読めば両立する。prj-overview-sample も家族の店番でのつけの受付を課題にしているため、直さない。食い違いとみなす場合は、CDFD の P-04 の主な担当に家族利用者代表（管理責任: 店主代表）を足す案を CDFD 側で検討する / -
- R5-6: R5 / grade finding F001・F002・F003 / F001（vp-pm-plan-feasibility）・F002（vp-pm-control-reporting）は kata-guide の「kata の観点の組」でこの段のレビューに使わない観点として外されている。F003 は照合の結果の表と未実施の明記が前の段で入っており解消済み / - / kata-guide の「kata の観点の組」と 3.2 の照合の結果の表 / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bes-index-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown ファイルだけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

根拠にしたのは、上位 CDFD の「プロセス領域」と P-05 の起点、個別 BES の「誰が／何が」、Sample 記述標準の共通サンプル文脈である。起点イベントの文言は上位 CDFD を正本とする方針のため、食い違いは sample 側で直した。P-04 の担当の見え方は両立すると読めたので維持し、直す案は findings に残した。迷った P-05 は「要判断」の印を付けた。F001・F002 は kata-guide の観点の組でこの段の対象外とした。F003 は 3.2 の照合の結果の表で解消済みである。
