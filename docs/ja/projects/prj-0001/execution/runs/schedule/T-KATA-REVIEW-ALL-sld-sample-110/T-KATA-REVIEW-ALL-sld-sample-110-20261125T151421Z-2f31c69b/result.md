---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sld-sample-110-20261125t151421z-2f31c69b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sld-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sld-sample-110/T-KATA-REVIEW-ALL-sld-sample-110-20261125T151421Z-2f31c69b/plan.md
  started_at: "2026-11-25T15:14:31.530Z"
  completed_at: "2026-11-25T15:24:39.852Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
    - specdojo:sld-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `docs/ja/specdojo/samples/sld-sample.md` に足す差分を 4 件入れた。検品場所の行の管理区分ごとの分割、隣接仕様の対応表への CLIS 行の追加、STSD 行への `sold` の置き場所の追記、空き容量不足の場面への `tmp/` の再作成契機の追記である。
- R1 の観点外の grade finding（F001・F004・F005）は扱う段へ回し、sample には反映していない。F002 は rulebook が求める内容の欠落に当たるため、R1 で同じ箇所を直した。
- `prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。そのほかの検査は変更の種類に当たらず `not_applicable`。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 保管場所一覧（店舗内・母屋の物理保管場所）の検品場所の行 | 処分しない入荷品、綴りへ移す納品伝票、処分する外箱が 1 行に混在していた。rulebook の「共有範囲・寿命・削除可否の判断が同じ区分を 1 行にする」に合わない（grade F003）。 | 検品場所を入荷品（`処分不可`）・納品伝票（`処分不可`、納品伝票綴りへ移す）・外箱（`条件付き処分可`）の 3 行に分けた。 | `vp-qe-kata-conformance`、sld-rulebook の「全体方針」の記載レベル | - |
| R1-2 | R1 | 関連仕様・実装配置との対応と検証（隣接仕様の記録・状態と保管場所の対応） | タブレット内のパスの正本である CLIS が対応表になく、確認の表にしか出ていなかった。rulebook の「パス解決を担う実装・設定との対応を示す」「隣接仕様との分担を 1 つの表にまとめる」を満たしていなかった。 | CLIS の行を足し、`config/store-config.yaml`・`.session/current-tx.json`・`data/sales/`・`receipts/` を CLIS 由来、`data/summary/` と `tmp/` を CLIS にない `_ASSUMPTION_` の仮置きとした。 | `vp-qe-kata-conformance`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」 | - |
| R1-3 | R1 | 関連仕様・実装配置との対応と検証（STSD 行） | 販売済み（`sold`）の置き場所がなく、rulebook の「STSD の状態がどの保管場所に対応するかを追跡できる」を欠いていた（grade F002）。 | `sold` は商品が店を出るため、販売記録として `data/sales/`（現金）と販売ノート（つけ）に残ると追記した。 | `vp-qe-kata-conformance`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」、grade F002 | 要判断（F002 の観点 `vp-qe-omissions-consistency` は R2 の観点だが、rulebook が求める内容の欠落なので R1 で直した。R2 に残す案は選ばなかった） |
| R1-4 | R1 | 削除・退避・復旧の判断基準（場面別の対処と復旧手順） | `削除可` の `tmp/` について、rulebook が求める「削除後の再生成コマンドまたは再作成の契機」がなかった。 | 空き容量不足の行に「`tmp/` は次の保守作業の開始時に DEV が作り直す」を足した。 | `vp-qe-kata-conformance`、sld-rulebook の「削除・退避・復旧の判断要件」 | - |
| R1-5 | R1 | 確認事項と変更影響 | grade F001（`vp-arc-conciseness`、処分の条件の言い直し）と F004（`vp-ux-language-consistency`、店番担当と Role code の表記揺れ）は R3 の観点であり、R1 では直さない。 | - | kata-guide の「kata の観点の組」で R3 に割り当てられている | - |
| R1-6 | R1 | 保管場所一覧（店舗タブレット内の論理保管場所） | grade F005（`vp-ops-operability`、取引セッションが消えたときの対処）は、kata-guide が kata の段のレビューで使わないとしている観点なので直さない。 | - | kata-guide の「kata の観点の組」の外す観点（`vp-ops-operability`）。採るかは人が決める | 要判断（取引セッションが消えたときの対処を場面別の表へ足す案もあるが、外す観点なので選ばなかった） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sld-sample.md`: 検品場所の 1 行を入荷品（`処分不可`）・納品伝票（`処分不可`、納品伝票綴りへ移す）・外箱（`条件付き処分可`）の 3 行に分割した。隣接仕様の対応表に CLIS の行を追加し、`config/store-config.yaml`・`.session/current-tx.json`・`data/sales/`・`receipts/` を CLIS 由来、`data/summary/` と `tmp/` を `_ASSUMPTION_` の仮置きとした。STSD 行に `sold` の置き場所（`data/sales/` と販売ノート）を追記した。空き容量不足の場面に「`tmp/` は次の保守作業の開始時に DEV が作り直す」を追加した。

## 3. 申し送り

- R1-1: R1 / 保管場所一覧（店舗内・母屋の物理保管場所） / 検品場所の 1 行に、処分しない入荷品、綴りへ移す納品伝票、処分する外箱が混在し、rulebook の「共有範囲・寿命・削除可否の判断が同じ区分を 1 行にする」に合わない（grade F003） / 検品場所を入荷品（`処分不可`）・納品伝票（`処分不可`、納品伝票綴りへ移す）・外箱（`条件付き処分可`）の 3 行に分けた / `vp-qe-kata-conformance`、sld-rulebook の「全体方針」の記載レベル / -
- R1-2: R1 / 関連仕様・実装配置との対応と検証（隣接仕様の記録・状態と保管場所の対応） / タブレット内のパスの正本である CLIS が対応表になく、rulebook 5.3 の「パス解決を担う実装・設定との対応を示す」「隣接仕様との分担を 1 つの表にまとめる」を満たしていなかった（CLIS は確認の表にしか出ていない） / CLIS の行を足し、`config/store-config.yaml`・`.session/current-tx.json`・`data/sales/`・`receipts/` を CLIS 由来、`data/summary/` と `tmp/` を CLIS にない `_ASSUMPTION_` の仮置きとした / `vp-qe-kata-conformance`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」 / -
- R1-3: R1 / 関連仕様・実装配置との対応と検証（隣接仕様の記録・状態と保管場所の対応） / STSD 行に販売済み（`sold`）の置き場所がなく、rulebook 5.3 の「STSD の状態がどの保管場所に対応するかを追跡できる」を欠いていた / `sold` は商品が店を出るため、販売記録として `data/sales/`（現金）と販売ノート（つけ）に残ると追記した / `vp-qe-kata-conformance`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」、grade F002 / 要判断（grade F002 の観点 `vp-qe-omissions-consistency` は R2 の観点だが、rulebook が求める内容の欠落なので R1 で直した。R2 に残す案は選ばなかった）
- R1-4: R1 / 削除・退避・復旧の判断基準（場面別の対処と復旧手順） / `削除可` の `tmp/` について、rulebook 5.2 が求める「削除後の再生成コマンドまたは再作成の契機」がなかった / 空き容量不足の行に「`tmp/` は次の保守作業の開始時に DEV が作り直す」を足した / `vp-qe-kata-conformance`、sld-rulebook の「削除・退避・復旧の判断要件」 / -
- R1-5: R1 / 確認事項と変更影響 / grade F001（`vp-arc-conciseness`、処分の条件の言い直し）と F004（`vp-ux-language-consistency`、店番担当と Role code の表記揺れ）は R3 の観点なので、この段では直さない / - / kata-guide の「kata の観点の組」で R3 に割り当てられている / -
- R1-6: R1 / 保管場所一覧（店舗タブレット内の論理保管場所） / grade F005（`vp-ops-operability`、取引セッションが消えたときの対処）は、kata-guide が kata の段のレビューで使わないとしている観点なので直さない / - / kata-guide の「kata の観点の組」の外す観点（`vp-ops-operability`）。採るかは人が決める / 要判断（取引セッションが消えたときの対処を場面別の表へ足す案もあるが、外す観点なので選ばなかった）
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/sld-sample.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ に届いていない）

## 4. 進め方と実践の型の適用

根拠は sld-rulebook（全体方針の記載レベル、関連仕様・実装配置との対応と検証要件、削除・退避・復旧の判断要件）と grade finding の `vp-qe-kata-conformance`・`vp-qe-omissions-consistency` で、いずれも rulebook を正として照合した。R1 に当たる F003 と F002 は解消した。F001（`vp-arc-conciseness`）と F004（`vp-ux-language-consistency`）は kata-guide で R3 に割り当てられた観点のため未対応で、R3 に送る。F005（`vp-ops-operability`）は kata の段で使わない観点なので未対応で、採るかは人が決める。grade result サイドカーは直接編集していない。
