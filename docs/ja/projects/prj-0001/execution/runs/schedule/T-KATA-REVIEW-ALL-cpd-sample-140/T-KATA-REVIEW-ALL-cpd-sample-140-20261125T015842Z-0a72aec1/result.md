---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cpd-sample-140-20261125t015842z-0a72aec1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cpd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cpd-sample-140/T-KATA-REVIEW-ALL-cpd-sample-140-20261125T015842Z-0a72aec1/plan.md
  started_at: "2026-11-25T01:58:50.951Z"
  completed_at: "2026-11-25T02:11:29.715Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cpd-sample
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`cpd-sample` の事実を `cpd-rulebook`・`cpd-mermaid-rulebook`・`cnd-sample`・`prj-overview-sample`・`gl-sample.yaml`・`clis-sample` と突き合わせた。
- 不一致は1件（概要第2段落の「必要性」由来の記述）で、これを修正した。ほかの主張は一致、または正本がなく確かめ対象外とした。
- runner 検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed。ts 系や `test:unit` などは変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: 概要第2段落の「販売記録の漏れと引き継ぎの確認負担が残る」を「業務が属人化したままになる」に置き換えた。`prj-overview-sample` の「必要性」は店主以外の店番で同じ判断ができず属人化する内容で、販売記録の漏れには触れていないため。1行の変更。

## 3. 申し送り

- 確かめの表（主張ごとの確かめ）は executor の handoff に No1〜No10 として記録されている。reporter としての追加指摘はない。
- 指摘 R4-1（修正済み）: 主張は概要第2段落の「販売記録の漏れと引き継ぎの確認負担が残る」で、prj-overview-sample の「必要性」が根拠とされていた。正本 docs/ja/specdojo/samples/prj-overview-sample.md の「必要性」は、店主以外の店番で同じ判断ができず業務が属人化したままになる、という内容で、販売記録の漏れには触れていない（この言い回しは cnd-sample の概要のもの）。結果は不一致。直し: 「業務が属人化したままになる」に置き換えた。
- 確かめの表 No1: 主張=概要の cpd-rulebook「位置づけと用語定義」の参照 / 正本=docs/ja/specdojo/rulebooks/cpd-rulebook.md / 確かめ方=grep で見出し一覧 / 結果=一致 / 根拠=31行目「## 2. 位置づけと用語定義」に、コンテナ・コンポーネント・依存方向の定義がある
- 確かめの表 No2: 主張=概要の prj-overview-sample「必要性」「基本的な考え方」「期待効果」の参照 / 正本=docs/ja/specdojo/samples/prj-overview-sample.md / 確かめ方=見出しと本文を読んだ / 結果=章は一致（必要性の内容は R4-1 で修正）/ 根拠=5.1 初期公開指標の「作業完遂」「判断の一致」が、販売記録の完遂と両利用者の確認結果の一致に対応する
- 確かめの表 No3: 主張=用語集の「販売」「店主代表」 / 正本=docs/ja/specdojo/samples/gl-sample.yaml / 確かめ方=grep / 結果=一致 / 根拠=tm-sales、tm-shop-owner がある
- 確かめの表 No4: 主張=本図の `REL-01`・`REL-06`・`REL-08` が上位図の `REL-03`・`REL-04`・`REL-05` に対応する / 正本=docs/ja/specdojo/samples/cnd-sample.md の 3.6 / 確かめ方=関係表を読んだ / 結果=一致 / 根拠=画面→サービス、サービス→記録ストア、サービス→印刷基盤
- 確かめの表 No5: 主張=接続は店内 HTTP・ローカルファイル入出力・外部コマンドで、DB 製品を前提にしない / 正本=cnd-sample の 3.3・3.4・3.6 / 確かめ方=読み取り / 結果=一致 / 根拠=80行目、90行目、112〜114行目
- 確かめの表 No6: 主張=詳細の正本名（`kinuya-sales-api`、`kinuya-record-schema`、`kinuya-print-command-contract`）と引き継ぎ先 `kinuya:pjr-a001`〜`a004` / 正本=cnd-sample の 3.6 と 5 / 確かめ方=読み取り / 結果=一致 / 根拠=110〜114行目、144〜147行目。いずれも未同梱の架空名なので、名前が上位図と同じことまでを確かめた
- 確かめの表 No7: 主張=上位図の前提「単一店舗・タブレット1台」 / 正本=cnd-sample の18行目、prj-overview-sample の99行目・105行目 / 確かめ方=grep / 結果=一致
- 確かめの表 No8: 主張=clis-sample は CLI と本部 API を使う別構成 / 正本=docs/ja/specdojo/samples/clis-sample.md / 確かめ方=grep / 結果=一致 / 根拠=27行目の `_ASSUMPTION_`
- 確かめの表 No9: 主張=図の形状と classDef（system・external、境界の style） / 正本=docs/ja/specdojo/rulebooks/cpd-mermaid-rulebook.md の 2・4 / 確かめ方=読み取り / 結果=一致 / 根拠=表現例と配色の定義が同じ。構文の確認は親 runner の lint-mermaid に任せる
- 確かめの表 No10: 主張=架空の文書名（`kinuya-sales-component-design`、`kinuya-infra-design`、`kinuya-sales-operations`）と駄菓子屋の業務上の仮定 / 正本=なし / 結果=確かめられない（対象外）/ 根拠=正本のない学習用の仮定で、共通サンプル文脈と食い違わない

## 4. 進め方と実践の型の適用

sample メンテナンスの R4 として、sample の事実（参照先の章名、上位図の関係 ID の対応、接続方式、前提、詳細の正本名、引き継ぎ先、図の形状と `classDef`）を正本と突き合わせた。 | No | 主張 | 正本 | 結果 | | --- | --- | --- | --- | | 1 | `cpd-rulebook`「位置づけと用語定義」の参照 | `cpd-rulebook` | 一致 | | 2 | `prj-overview-sample` の「必要性」「基本的な考え方」「期待効果」の参照 | `prj-overview-sample` | 章は一致。「必要性」の内容は不一致で修正（R4-1） | | 3 | 用語集の「販売」「店主代表」 | `gl-sample.yaml`（`tm-sales`、`tm-shop-owner`） | 一致 | | 4 | 本図の `REL-01`・`REL-06`・`REL-08` が上位図の `REL-03`・`REL-04`・`REL-05` に対応 | `cnd-sample` の関係表 | 一致 | | 5 | 接続は店内 HTTP・ローカルファイル入出力・外部コマンドで、DB 製品を前提にしない | `cnd-sample` の接続の章 | 一致 | | 6 | 詳細の正本名と引き継ぎ先 `kinuya:pjr-a001`〜`a004` | `cnd-sample` | 名前が上位図と同じことまで一致。未同梱の架空名 | | 7 | 前提「単一店舗・タブレット1台」 | `cnd-sample`、`prj-overview-sample` | 一致 | | 8 | `clis-sample` は CLI と本部 API を使う別構成 | `clis-sample` | 一致 | | 9 | 図の形状と `classDef`（system・external、境界の style） | `cpd-mermaid-rulebook` | 一致。構文は `lint:mermaid` が passed | | 10 | 架空の文書名と駄菓子屋の業務上の仮定 | なし | 確かめられない（対象外）。共通サンプル文脈とは食い違わない | 修正は R4-1 の1件のみで、一致した記述は維持した。根拠不足で見送った finding はない。plan に展開された grade の finding と成果物由来の Kata finding はなかった。`status` は変更していない。
