---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-sample-140-20261125t020247z-ac778ae4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-sample-140/T-KATA-REVIEW-ALL-dmd-sample-140-20261125T020247Z-ac778ae4/plan.md
  started_at: "2026-11-25T02:02:56.432Z"
  completed_at: "2026-11-25T02:15:26.115Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として dmd-sample の主張 15 件を schema・rulebook・同じ系列の sample と突き合わせた。この段で直す誤りはなく、sample の変更はない（`changes` は空）。
- 主張ごとの確かめの表（結果: 一致 12 件、不一致 2 件、対象外 1 件）: | No | 主張 | 正本 | 結果 | 備考 | | --- | --- | --- | --- | --- | | 1 | frontmatter の `type: data`・`rulebook: specdojo:dmd-rulebook` | `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、dmd-rulebook の推奨 Frontmatter 項目 | 一致 | schema の enum に `data` があり `rulebook` は必須キー。rulebook が両方の値を指定している。 | | 2 | H1 の書式 | dmd-rulebook のファイル命名・ID規則 | 一致 | 書式は `# データ移行設計: &lt;対象名&gt;`。 | | 3 | 1〜10 章の見出しと概要の `credit-data` | dmd-rulebook の本文要件、dmd-index-sample の対象一覧 | 一致 | 10 見出しが順に並び、対応DMD は `dmd-credit-data`。 | | 4 | `run_id` の例 `DMD-20261207-credit-01` と、`NN` を 1 つ進めた別 `run_id` での取り込み直し | dmd-index-sample の `run_id` 規約 | 一致 | 命名は `DMD-YYYYMMDD-&lt;term&gt;-NN`。`credit` は顧客台帳とつけ残高の略号。 | | 5 | 保存先 `migration/&lt;run_id&gt;/` と紙の記録表 | dmd-index-sample の記録先 | 一致 | | | 6 | 証跡名 `&lt;run_id&gt;-check-count/sample/value` | dmd-index-sample の検証の共通方針 | 一致 | 証跡の名前は `&lt;run_id&gt;-check-&lt;種別&gt;`。 | | 7 | 方式はフル、洗い替え、開店後は空にしない | dmd-index-sample の共通方針 | 一致 | | | 8 | 除外条件（取り消し線あり・残高 0 円）と、残高のある顧客を移すこと | dmd-index-sample の共通方針の除外 | 一致 | | | 9 | 成功条件「つけ残高の一致」「業務停止時間」と判定者の店主代表 | mip-index-sample の成功条件の表 | 一致 | | | 10 | 午前の臨時休業、1 週間の並行記録、取り込み直しは午前中に 1 回まで | mip-index-sample の移行方式・フェーズの表・T 当日の行 | 一致 | | | 11 | 手順 1・2 は準備フェーズ、残高は前日の閉店後に読み合わせる | mip-index-sample のフェーズの表 | 一致 | | | 12 | 照合の手順と証跡の取り方は `mtp-index` で定める | dmd-rulebook の検証方法の記述ガイド | 一致 | | | 13 | サンプル照合の許容差は氏名の全角と半角の違いだけ | dmd-index-sample の検証の共通方針 | 不一致（R5 に回す） | dmd-index は長音記号の違いも許容している。 | | 14 | 合否はすべて店主代表が決める | dmd-index-sample の合否の判定 | 不一致（R5 に回す） | 件数照合は開発担当（DEV）が判定する。 | | 15 | 件数・所要時間の見積 | 正本なし | 対象外 | 駄菓子屋の業務の値で、共通サンプル文脈と食い違わない。 | SpecDojo のコマンド・オプション・`src/` の挙動の記述はないため、コマンドは実行していない。
- grade の F001（minor、`vp-pm-plan-feasibility`、移行手順表で手順 1・3・4・5 の担当がない）は、この段の観点に当たらないため扱っていない。runner の検証は、lint:md:changed・lint:fm:changed・lint:mermaid・lint:d2・validate:schema が passed で、そのほかは変更種別により `not_applicable` だった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5 への申し送り（No 13・14）は executor の handoff に記載のとおり。No 13 は許容差を長音記号まで広げる案、No 14 は判定者を種別ごとに書くか `dmd-index` の判定の分担を参照する案である。
- F001 の対応可否（手順表に担当を足すか）は人が判断する。足す場合は R5 で cop-sample の手順表の担当と合わせる。
- R4 確かめの表（reporter が result の実施内容に表として 1 回だけ書く）: 1 frontmatter の `type: data`・`rulebook: specdojo:dmd-rulebook` ／ 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml と dmd-rulebook の推奨 Frontmatter 項目 ／ 読み取り ／ 一致 ／ schema の enum に `data` があり `rulebook` は必須キー、rulebook が両方の値を指定。2 H1 ／ dmd-rulebook のファイル命名・ID規則 ／ 一致 ／ 書式は `# データ移行設計: &lt;対象名&gt;`。3 1〜10 章の見出しと概要の `credit-data` ／ dmd-rulebook の本文要件と dmd-index-sample の対象一覧 ／ 一致 ／ 10 見出しが順に並び、対応DMD は `dmd-credit-data`。4 `run_id` の例 `DMD-20261207-credit-01` と別 `run_id`（`NN` を 1 つ進める）での取り込み直し ／ dmd-index-sample の `run_id` 規約 ／ 一致 ／ 命名は `DMD-YYYYMMDD-&lt;term&gt;-NN`、`credit` は顧客台帳とつけ残高の略号。5 保存先 `migration/&lt;run_id&gt;/` と紙の記録表 ／ 同上の記録先 ／ 一致。6 証跡名 `&lt;run_id&gt;-check-count/sample/value` ／ dmd-index-sample の検証の共通方針 ／ 一致 ／ 証跡の名前は `&lt;run_id&gt;-check-&lt;種別&gt;`。7 方式はフル、洗い替え、開店後は空にしない ／ dmd-index-sample の共通方針 ／ 一致。8 除外条件（取り消し線あり・残高 0 円）と残高のある顧客を移すこと ／ dmd-index-sample の共通方針の除外 ／ 一致。9 成功条件「つけ残高の一致」「業務停止時間」と判定者の店主代表 ／ mip-index-sample の成功条件の表 ／ 一致。10 午前の臨時休業、1 週間の並行記録、取り込み直しは午前中に 1 回まで ／ mip-index-sample の移行方式・フェーズの表・T 当日の行 ／ 一致。11 手順 1・2 は準備フェーズ、残高は前日の閉店後に読み合わせる ／ mip-index-sample のフェーズの表 ／ 一致。12 照合の手順と証跡の取り方は `mtp-index` で定める ／ dmd-rulebook の検証方法の記述ガイド ／ 一致。13 サンプル照合の許容差「氏名の全角と半角の違いだけ（`dmd-index` の許容差）」 ／ dmd-index-sample の検証の共通方針 ／ 不一致（R5 に回す） ／ dmd-index は長音記号の違いも許容。14 合否はすべて店主代表が決める ／ dmd-index-sample の合否の判定 ／ 不一致（R5 に回す） ／ 件数照合は開発担当（DEV）が判定。15 件数・所要時間の見積 ／ 正本なし ／ 対象外 ／ 駄菓子屋の業務の値で、共通サンプル文脈と食い違わない。SpecDojo のコマンド・オプション・`src/` の挙動の記述はないため、コマンドは実行していない。
- R5 への申し送り（No 13）: 検証方法の表のサンプル照合の行は「氏名の全角と半角の違いだけは差分に数えない（`dmd-index` の許容差）」だが、dmd-index-sample は長音記号の違いも許容している。案は「氏名の全角・半角と長音記号の違いは差分に数えない（`dmd-index` の許容差）」。
- R5 への申し送り（No 14）: 検証方法の表の前の文は「合否は `mip-index` の成功条件の判定者（店主代表）が照合表を見て決める」だが、dmd-index-sample は件数照合を開発担当（DEV）、サンプル照合と重要値照合を店主代表（PO）が判定するとしている。案は判定者を種別ごとに書くか、`dmd-index` の判定の分担を参照する文にする。
- F001（minor、`vp-pm-plan-feasibility`、line=59、移行手順表に手順 1・3・4・5 の担当がない）は対応していない。kata-guide の kata の観点の組で `vp-pm-plan-feasibility` は kata の段のレビューに使わない観点とされ、R4 の観点（`vp-arc-technical-constraints`、`vp-dev-implementation-readiness`、`vp-dev-testability`、`vp-qe-verifiability`）にも当たらない。dmd-rulebook も役割の割り当ては適用先のメンバー定義に従うとしている。次のアクションとして、担当を書かせるかは人が判断する（足す場合は R5 で cop-sample の手順表の担当と合わせる）。

## 4. 進め方と実践の型の適用

sample メンテナンスの R4（正しさ）として、sample の事実の主張を schema・dmd-rulebook・dmd-index-sample・mip-index-sample と突き合わせた。確かめられた 12 件は維持した。dmd-index-sample との食い違い 2 件（No 13・14）は R5 の範囲のため直さず申し送りにした。業務の値 1 件は正本がなく、共通サンプル文脈と食い違わないので確かめの対象にしていない。F001 は `vp-pm-plan-feasibility` が kata の段のレビューに使わない観点で、R4 の観点にも当たらないため未対応とした。dmd-rulebook は役割の割り当てを適用先のメンバー定義に従うとしている。次のアクションは人の判断に委ねる。根拠不足による見送りはない。
