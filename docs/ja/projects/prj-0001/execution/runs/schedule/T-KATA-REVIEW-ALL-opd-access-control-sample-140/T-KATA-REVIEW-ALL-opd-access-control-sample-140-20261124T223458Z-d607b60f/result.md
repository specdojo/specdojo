---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-access-control-sample-140-20261124t223458z-d607b60f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-access-control-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-access-control-sample-140/T-KATA-REVIEW-ALL-opd-access-control-sample-140-20261124T223458Z-d607b60f/plan.md
  started_at: "2026-11-24T22:35:08.210Z"
  completed_at: "2026-11-24T22:47:42.725Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-access-control-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`opd-access-control-sample` の主張を schema、rulebook、関連 sample、`pm-roles.yaml` と突き合わせた。
- 誤りは 1 件だった。「緊急権限」の表で P1 の定義元を `opd-index` の障害対応方針としていたが、P1 の条件を定めるのは体制・責任分界の優先度の表である。障害対応方針はその表を参照しているだけなので、定義元を直した。
- 確かめた主張は 12 件だった。11 件は一致し、1 件（No12）は確かめられなかった。No12 は `_ASSUMPTION_` の販売管理システムの機能で、正本がない。駄菓子屋の業務の仮定で、共通サンプル文脈と食い違わないため、確かめの対象外とした。
- 整形のため `npx prettier --write` を実行した。整形後には実行し直していない。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 「緊急権限」の表の「使える場面」を直した。P1 の定義元を「`opd-index` の障害対応方針」から「`opd-index` の体制・責任分界の優先度の表で P1 とした障害」に変えた。変更は 1 行である。

## 3. 申し送り

- 申し送り（範囲外）: `opr-access-control-sample` の付与・区分の変更・剥奪の手順に「`opr-index` の P1」とある。P1 の定義元は `opd-index` の体制・責任分界で、この記述と合わない。このタスクの対象外なので直していない。担当の段で確かめる。
- R4 指摘: 「緊急権限」の表の「使える場面」は P1 の定義元を `opd-index` の障害対応方針としていたが、P1 の条件を定めるのは体制・責任分界の優先度の表で、障害対応方針はその表を参照しているだけ（`opd-index-sample` の障害対応方針の章の冒頭）。「`opd-index` の体制・責任分界の優先度の表で P1 とした障害」に直した。
- R4 確かめの表 No1: frontmatter の `type: operations` / 正本 `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の `deliverableType` と `opd-rulebook` の `deliverable_type` / 読み取り / 一致
- R4 確かめの表 No2: frontmatter の `based_on` と `supersedes` / 正本 `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 読み取り / 一致（`idRefArray` として定義済み）
- R4 確かめの表 No3: frontmatter の `rulebook: specdojo:opd-rulebook` / 正本 `docs/ja/specdojo/rulebooks/opd-rulebook.md` の id と sample 宣言 / 読み取り / 一致
- R4 確かめの表 No4: リンク先 4 件（`opd-index-sample`、`prj-overview-sample`、`opr-index-sample`、`opr-access-control-sample`）の id / 正本 各 sample の frontmatter / grep / 一致
- R4 確かめの表 No5: `OPS` の名称 Operations / Release Manager / 正本 `docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml` / 読み取り / 一致
- R4 確かめの表 No6: 付与の対象は店番担当と `DEV`、共有のアカウントを作らない、承認者は `PO`、操作するのは `OPS` / 正本 `opd-index-sample` の権限・アカウント運用の章と RACI の表（`PO`=A、`OPS`=R） / 読み取り / 一致
- R4 確かめの表 No7: 監査ログの記録対象はログイン・つけ残高の変更・価格の変更、保管期間は 1 年 / 正本 `opd-index-sample` の権限・アカウント運用の表 / 読み取り / 一致
- R4 確かめの表 No8: 棚卸しは月次点検で `OPS` が行い、できない月は翌週に行う / 正本 `opd-index-sample` の定期運用方針の表 / 読み取り / 一致
- R4 確かめの表 No9: P1 の定義元 / 正本 `opd-index-sample` の体制・責任分界の優先度の表と、障害対応方針の章の冒頭 / 読み取り / 不一致のため直した
- R4 確かめの表 No10: 章の構成（概要、差分を持つ章、関連ドキュメント導線） / 正本 `opd-rulebook` の本文構成（標準テンプレ） / 読み取り / 一致
- R4 確かめの表 No11: 3 か月での停止、15 分以内の緊急停止、緊急権限の 24 時間の失効と 1 回の延長、事後の確認 / 正本 `opr-access-control-sample` のアカウント付与・剥奪手順 / 読み取り / 一致
- R4 確かめの表 No12: 販売管理システムの機能（`_ASSUMPTION_` の記述） / 正本なし / 確かめられない（駄菓子屋の業務の仮定で共通サンプル文脈と食い違わないため、確かめの対象外）
- 申し送り（範囲外）: `opr-access-control-sample` の付与・区分の変更・剥奪の手順に「`opr-index` の P1」とあり、P1 の定義元（`opd-index` の体制・責任分界）と合わない。このタスクの対象外なので直していない。担当の段で確かめる。
- 適用外の検証: `npm run validate:history-links`（executor が変更したのは sample だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の sample 1 件だけ）

## 4. 進め方と実践の型の適用

sample メンテナンスの R4（正しさ）として実施した。sample の事実の主張を、正本である `docs/specdojo/schemas/v1/` の schema、`opd-rulebook`、`opd-index-sample`、`opr-access-control-sample`、`pm-roles.yaml` と読み取りや grep で突き合わせた。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はなかった。 主張ごとの確かめの結果は次の表のとおり。 | No | 主張 | 正本 | 方法 | 結果 | | --- | --- | --- | --- | --- | | 1 | frontmatter の `type: operations` | `deliverable-frontmatter.schema.yaml` の `deliverableType`、`opd-rulebook` の `deliverable_type` | 読み取り | 一致 | | 2 | frontmatter の `based_on` と `supersedes` | `common-frontmatter.schema.yaml`（`idRefArray` で定義済み） | 読み取り | 一致 | | 3 | `rulebook: specdojo:opd-rulebook` | `opd-rulebook.md` の id と sample 宣言 | 読み取り | 一致 | | 4 | リンク先 4 件（`opd-index-sample`、`prj-overview-sample`、`opr-index-sample`、`opr-access-control-sample`）の id | 各 sample の frontmatter | grep | 一致 | | 5 | `OPS` の名称 Operations / Release Manager | `pm-roles.yaml` | 読み取り | 一致 | | 6 | 付与の対象は店番担当と `DEV`。共有のアカウントは作らない。承認者は `PO`、操作するのは `OPS` | `opd-index-sample` の権限・アカウント運用の章と RACI の表（`PO`=A、`OPS`=R） | 読み取り | 一致 | | 7 | 監査ログの記録対象はログイン・つけ残高の変更・価格の変更。保管期間は 1 年 | `opd-index-sample` の権限・アカウント運用の表 | 読み取り | 一致 | | 8 | 棚卸しは月次点検で `OPS` が行う。できない月は翌週に行う | `opd-index-sample` の定期運用方針の表 | 読み取り | 一致 | | 9 | P1 の定義元 | `opd-index-sample` の体制・責任分界の優先度の表と、障害対応方針の章の冒頭 | 読み取り | 不一致のため直した | | 10 | 章の構成（概要、差分を持つ章、関連ドキュメント導線） | `opd-rulebook` の本文構成（標準テンプレ） | 読み取り | 一致 | | 11 | 3 か月での停止、15 分以内の緊急停止、緊急権限の 24 時間の失効と 1 回の延長、事後の確認 | `opr-access-control-sample` のアカウント付与・剥奪手順 | 読み取り | 一致 | | 12 | 販売管理システムの機能（`_ASSUMPTION_` の記述） | なし | なし | 確かめられない（確かめの対象外） | 誤りは No9 の 1 件だけで、直しは上記の 1 行である。ほかの記述は根拠と整合するため維持した。矛盾はなく、rulebook を正として扱う場面もなかった。見送った finding もない。
