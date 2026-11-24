---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-index-sample-140-20261124t221213z-89f105a0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-index-sample-140/T-KATA-REVIEW-ALL-dmd-index-sample-140-20261124T221213Z-89f105a0/plan.md
  started_at: "2026-11-24T22:12:22.010Z"
  completed_at: "2026-11-24T22:24:08.136Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、dmd-index-sample の事実を rulebook、schema、関連 sample と突き合わせた。誤り 2 件を直し、判断が要る 2 件は申し送りにした。
- R4-1（直した）: 3 章 `run_id` 規約で `&lt;term&gt;` を「対象の論理名」としていた。正本の dmd-rulebook と dmd-sample では論理名ではないため、「対象の略号」に直した。根拠の viewpoint は `vp-arc-technical-constraints`。
- R4-2（直した）: 4 章の保管期間の記述が、照合表と旧ノートの両方を `mip-index` が委ねた値と読めた。mip-index-sample が委ねているのは旧ノートの保管期間だけなので、その範囲に限定した。根拠の viewpoint は `vp-qe-verifiability`。
- R4-3（要判断、未修正）: 合否の判定者は `mip-index` の成功条件に定めた者とされている。しかし mip-index-sample の受入基準にサンプル照合に当たる項目がなく、判定者が決まっていない。件数照合は開発担当、重要値照合は店主代表と確かめられた。根拠のない判定者を決めないため、F001 の Role code 併記と一緒に R5 で扱う。
- R4-4（要判断、別の kata）: dmd-sample は氏名の表記ゆれを `dmd-index` の許容差としている。dmd-index が許容差とするのは商品名の表記ゆれだけである。直す対象は dmd-sample で、R5 で扱う。
- 確かめた主張は、frontmatter、6 章の構成、`run_id` の命名と連番、略号 `item`・`stock`・`credit`、記録先と照合表の名前、対応する DMD の ID、対象・非対象一覧、Role code `DEV`、取り込みの時間帯である。いずれも一致を確認した。確かめられなかったのは `item`・`stock` の個別 sample がないことだけである。
- 業務の仮定（抽出、変換、除外、冪等性、ログの方針と駄菓子屋の値）は正本がない。共通サンプル文脈と矛盾しないため、確かめの対象外とした。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 3 章で `&lt;term&gt;` の呼び方を「対象の論理名」から「対象の略号」に修正した。4 章の保管期間の記述は、`mip-index` が委ねた範囲を旧ノートの保管期間だけに限定した。差分は 2 行の置換である。

## 3. 申し送り

- F001（`vp-ba-stakeholder-clarity`、判定者の Role code 併記）は R4 の観点に当たらないため直していない。R4-3 と同じ箇所なので、R5 でまとめて判断する。
- R4-3 の直す案: 種別ごとに判定者を併記する。件数照合は開発担当（DEV）、重要値照合は店主代表（PO）とし、サンプル照合はどちらが判定するかを決める。
- R4-4 の直す案: dmd-index に顧客の氏名の表記ゆれを許容差として足すか、dmd-sample の許容差の根拠を dmd-sample 自身に書き換える。
- R4-1: R4 / 3. `run_id` 規約（命名/採番/記録/参照方法） / `&lt;term&gt;` を「対象の論理名」としていたが、dmd-rulebook では論理名キーは `credit-data` の形で、本書の対象一覧でも論理名は「商品台帳」などの日本語名である。`item`・`stock`・`credit` は論理名ではない / 「対象の略号」に直した / vp-arc-technical-constraints（正本: docs/ja/specdojo/rulebooks/dmd-rulebook.md のファイル名の項、docs/ja/specdojo/samples/dmd-sample.md の `DMD-20261207-credit-01`） / -
- R4-2: R4 / 4. 検証の共通方針（種別/基準/証跡/保管） / 保管期間の `_UNDECIDED_` が、照合表と旧ノートの両方を `mip-index` が委ねた値と読めた。mip-index-sample が dmd-index に委ねているのは旧ノートの保管期間だけである / 「旧ノートの保管期間は `mip-index` が本書に委ねた値である。」に限定した / vp-qe-verifiability（正本: docs/ja/specdojo/samples/mip-index-sample.md の移行後ハイパーケア方針の「旧ノート」の行） / -
- R4-3: R4 / 4. 検証の共通方針（種別/基準/証跡/保管） / 「合否の判定は `mip-index` の成功条件に定めた判定者が決める」とあるが、mip-index-sample の受入基準にサンプル照合に当たる項目がなく、判定者が決まっていない。件数照合は開発担当、重要値照合（つけ残高・在庫数）は店主代表と確かめられた / -（判定者を新しく決める業務上の判断と F001 の Role code 併記が重なるため、R5 で一緒に扱う） / vp-qe-verifiability。直す案: 種別ごとに判定者（件数照合は開発担当（DEV）、重要値照合は店主代表（PO）、サンプル照合はどちらが判定するかを決めて書く）を併記する。直さなかったのは、根拠のない判定者を R4 で決めないため / 要判断
- R4-4: R4 / 4. 検証の共通方針（種別/基準/証跡/保管） / 別の kata の食い違い: dmd-sample のサンプル照合は、氏名の全角・半角の違いを「`dmd-index` の許容差」としている。dmd-index が許容差として認めるのは商品名の表記ゆれだけである / -（直す対象は dmd-sample） / vp-qe-verifiability。直す案: R5 で dmd-index に顧客の氏名の表記ゆれを許容差として足すか、dmd-sample の許容差の根拠を dmd-sample 自身に書き換える / 要判断
- R4 確かめの表（reporter が指摘の表の後に置く）: No / 主張 / 正本 / 確かめ方 / 結果 / 根拠 — C1 / frontmatter の `type: data`・`rulebook: specdojo:dmd-index-rulebook` / docs/ja/specdojo/rulebooks/dmd-index-rulebook.md の推奨 Frontmatter 項目、docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 読み取り / 一致 / rulebook が `specdojo.type: data` を指定し、schema の type の列挙に `data` がある。rulebook の `sample` も specdojo:dmd-index-sample
- C2 / 章の構成（6 章の順序） / dmd-index-rulebook の本文要件 / 読み取り / 一致 / 見出し 6 つが本文要件の表と同じ順・同じ名前
- C3 / `run_id` の命名 `DMD-YYYYMMDD-&lt;term&gt;-NN` と当日内連番 / dmd-index-rulebook の記述ガイドの `run_id` 規約 / 読み取り / 一致 / 良い例が `DMD-YYYYMMDD-&lt;term&gt;-NN`（当日内連番）
- C4 / `&lt;term&gt;` の値 `item`・`stock`・`credit` / docs/ja/specdojo/samples/dmd-sample.md / grep で読み取り / 一致（呼び方だけ直した） / dmd-sample の識別キーが `DMD-20261207-credit-01`
- C5 / 記録先 `migration/&lt;run_id&gt;/` と照合表の名前 `&lt;run_id&gt;-check-count`・`-sample`・`-value` / docs/ja/specdojo/samples/mtp-sample.md、dmd-sample.md、cop-sample.md / grep で読み取り / 一致 / mtp-sample の証跡の行、dmd-sample のログ保存先の行
- C6 / 対応DMD の ID `dmd-item-data`・`dmd-stock-data`・`dmd-credit-data` / dmd-rulebook のファイル名の項（`dmd-&lt;term&gt;`、例 `order-data`）、cop-sample / 読み取り / 一致（`dmd-credit-data` は cop-sample・mtp-sample と同じ。item・stock の個別 sample はなく確かめられない） / dmd-rulebook が `&lt;term&gt;` を kebab-case の論理名キーとしている
- C7 / 対象・非対象が mip-index の移行対象一覧の「データ」「非対象」の行を受ける / docs/ja/specdojo/samples/mip-index-sample.md の移行対象一覧 / 読み取り / 一致 / データ 3 行と、非対象のうちデータの行（過去の販売ノート・仕入ノート・つけ販売の明細）が一致する。仕入先との連携・会計処理はデータではないため載せていない
- C8 / 担当 `DEV` が Role code である / docs/ja/specdojo/standards/people-and-organization-definition-standard.md、dmd-index-rulebook の対象一覧 / 読み取り / 一致 / Role の表に `DEV`
- C9 / 取り込み直しは切替日の正午の開店前に限る / mip-index-sample の前提・制約とカットオーバー概要 / 読み取り / 一致 / 正午に開店し、取り込みは午前の休業中だけ
- C10 / 合否の判定者は mip-index の成功条件に定めた判定者 / mip-index-sample の項目ごとの受入基準 / 読み取り / 一部不一致 / 件数の一致は開発担当、つけ残高・在庫数は店主代表。サンプル照合に当たる項目はない（R4-3）
- C11 / 保管期間を mip-index が本書に委ねた / mip-index-sample の移行後ハイパーケア方針 / 読み取り / 不一致（直した） / 委ねたのは旧ノートの保管期間だけ（R4-2）
- C12 / 商品名の表記ゆれだけを許容差とする / 同じ系列の dmd-sample / 読み取り / 不一致（相手側） / dmd-sample が氏名の表記ゆれを dmd-index の許容差としている（R4-4）
- C13 / 抽出・変換・除外・冪等性・ログの方針と駄菓子屋の業務の値 / 正本なし（共通サンプル文脈の仮定） / sample-authoring-standard の共通サンプル文脈と食い違わないかを読み取り / 確かめの対象外 / 業務の仮定で、共通サンプル文脈と矛盾しない
- F001（source=grade、`vp-ba-stakeholder-clarity`、判定者の Role code 併記）は R4 の観点（`vp-arc-technical-constraints`・`vp-dev-implementation-readiness`・`vp-dev-testability`・`vp-qe-verifiability`）に当たらないため直していない。R1〜R3 と同じく R5 へ引き継ぐ。R4-3 と同じ箇所なので一緒に判断する。

## 4. 進め方と実践の型の適用

規範は docs/ja/specdojo/rulebooks/dmd-index-rulebook.md、dmd-rulebook、dmd-sample、mip-index-sample、mtp-sample、cop-sample を読み取りで突き合わせた。不一致のうち、正本が明確な 2 件だけを直した。正本が決まらない判定者の割り当てと別の kata との食い違いは、推測で直さず R5 へ引き継いだ。rulebook と矛盾する構成の変更はしていない。
