---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-incident-management-sample-140-20261125t021441z-fe776f18
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-incident-management-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-incident-management-sample-140/T-KATA-REVIEW-ALL-opd-incident-management-sample-140-20261125T021441Z-fe776f18/plan.md
  started_at: "2026-11-25T02:14:50.489Z"
  completed_at: "2026-11-25T02:27:44.730Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-incident-management-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R4（正しさ）として、`opd-incident-management-sample` の主張を正本（`opd-index-sample`、`opr-incident-sample`、`opd-access-control-sample`、`opd-rulebook`、sample 一覧）と突き合わせた。確かめた主張は 10 件で、一致は 8 件、不一致は 2 件だった。
- 不一致の 2 件は sample を直した。1 件目は、関連ドキュメント導線の 4 件（`opd-monitoring`、`opd-access-control`、`opr-index`、`opr-incident`）の状態が「予定」だったことで、実際は作成済だった。状態を「作成済」に直し、ID を wikilink にした。2 件目は、P2 日次締めの「夜間バックアップ」で、`opd-index-sample` の「閉店後のバックアップ」に直した。
- `opd-access-control-sample` は、確かめた主張がすべて正本と一致したため変更していない。
- この 2 つの sample はコマンド、オプション、schema のキーを書いていない。schema、`src/`、`--help` と突き合わせる主張はなかった。
- Markdown の整形と lint は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-incident-management-sample.md`: 関連ドキュメント導線の 4 件（`opd-monitoring`、`opd-access-control`、`opr-index`、`opr-incident`）の状態を「予定」から「作成済」に直し、ID を wikilink にした。P2 日次締めの「止めないもの」の「夜間バックアップ」を、`opd-index-sample` に合わせて「閉店後のバックアップ」に直した。差分は 14 行の追加と 14 行の削除。

## 3. 申し送り

- `opd-monitoring-sample` にも同じ誤りがある。関連ドキュメント導線の `opd-incident-management`、`opr-index`、`opr-monitoring` が「予定」のままだが、実際は作成済である。本文の「夜間バックアップ」も `opd-index-sample` の「閉店後のバックアップ」と表記が違う。この task では直していない。`opd-monitoring-sample` を扱う段（R5 整合など）で直す。
- 確かめられなかった主張はなかった。正本のない駄菓子屋の業務の値は、共通サンプル文脈と食い違わないため確かめの対象にしていない。
- R4 確かめ No1: 主張=優先度の判定・概要「opd-index は優先度ごとの条件を 1 行で定める」「一次連絡の期限とエスカレーションの連絡先は opd-index を正」/ 正本=docs/ja/specdojo/samples/opd-index-sample.md の体制・責任分界（優先度の表）と SLO の障害の一次連絡 / 確かめ方=読み取り / 結果=一致 / 根拠=P1 15 分・P2 当日の閉店・P3 次の月次点検、連絡先 OPS→PO
- R4 確かめ No2: 主張=停止・切替の判断 P1「判断者 PO、opd-index の切替の期限を過ぎても OPS が再開を確かめられない時点」/ 正本=opd-index-sample の障害対応方針、opr-incident-sample の停止・切替とロールバックの判断 / 確かめ方=読み取り / 結果=一致 / 根拠=「P1 に気付いてから 30 分たっても記録を再開できない場合、PO が紙の販売控えへの切替を決める」
- R4 確かめ No3: 主張=周知「opd-index は来店客への口頭の周知だけを定める」「外部の利用者・取引先は SLA の対象外」/ 正本=opd-index-sample の障害対応方針と SLO・SLA・KPI の SLA 行 / 確かめ方=読み取り / 結果=一致 / 根拠=「会計の待ちが生じる場合だけ店頭で口頭で行う」「SLA 対象外」
- R4 確かめ No4: 主張=「戻した後の転記と照合は opd-index の障害対応方針に従う」/ 正本=opd-index-sample の障害対応方針 / 確かめ方=読み取り / 結果=一致 / 根拠=「復旧後に店番担当が転記し、DEV が件数と金額を照合する」
- R4 確かめ No5: 主張=未決事項の「オフライン時の記録方法」「営業時間外の緊急連絡手段」は opd-index の未決事項 / 正本=opd-index-sample の未決事項の表 / 確かめ方=読み取り / 結果=一致 / 根拠=同名の 2 行があり、決まるまでの扱いが紙の販売控え・翌朝の開店前の連絡で一致
- R4 確かめ No6: 主張=「P1 の復旧で記録の訂正が要る場合は opd-access-control-sample の緊急権限に従う」/ 正本=docs/ja/specdojo/samples/opd-access-control-sample.md の緊急権限 / 確かめ方=読み取り / 結果=一致 / 根拠=緊急権限の使える場面が P1 の復旧で記録の変更が要る場合
- R4 確かめ No7: 主張=関連ドキュメント導線の opd-monitoring・opd-access-control・opr-index・opr-incident が「予定」/ 正本=docs/ja/specdojo/samples/ の各 sample の有無、opd-index-sample の関連ドキュメント導線 / 確かめ方=ls docs/ja/specdojo/samples/ と読み取り / 結果=不一致 / 根拠=4 件とも sample があり opd-index-sample でも作成済。状態を作成済に直し、ID を wikilink にした
- R4 確かめ No8: 主張=停止・切替の判断 P2 日次締めの行「止めないもの: 夜間バックアップ」/ 正本=opd-index-sample のバックアップ・リストア方針 / 確かめ方=読み取り / 結果=不一致 / 根拠=正本は「閉店後の日次締めの後に 1 回」「日次締めを翌朝へ持ち越す場合も閉店後にバックアップを取る」。閉店後のバックアップに直した
- R4 確かめ No9: 主張=見出しの構成（概要（&lt;term&gt;）、差分を持つ章、関連ドキュメント導線（opr 等））と frontmatter の type: operations・rulebook: specdojo:opd-rulebook / 正本=docs/ja/specdojo/rulebooks/opd-rulebook.md の本文構成と推奨 Frontmatter 項目 / 確かめ方=読み取り / 結果=一致 / 根拠=末尾に opr-index と opr-incident の導線がある
- R4 確かめ No10: 主張=opd-access-control-sample の opd-index 参照（体制・責任分界の優先度の表、付与の対象を店番担当と DEV に限る、監査ログの保管期間 1 年、月次点検ができなかった月は翌週）と導線（opr-index-sample・opr-access-control-sample が作成済）/ 正本=opd-index-sample の各章、docs/ja/specdojo/samples/ の一覧 / 確かめ方=読み取り / 結果=一致 / 根拠=該当する記述がすべて正本にあり、sample もある。変更なし
- R4 の対象外: opd-incident-management-sample と opd-access-control-sample はコマンド・オプション・schema のキーを書いていないため、schema・src/・--help と突き合わせる主張はなかった
- ほかの kata への指摘（直していない）: opd-monitoring-sample の関連ドキュメント導線の opd-incident-management・opr-index・opr-monitoring も「予定」と書かれているが、sample はあり作成済。また本文の「夜間バックアップ」は opd-index-sample の「閉店後のバックアップ」と表記が違う。opd-monitoring-sample を扱う段（R5 整合など）で直す

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実主張を正本と 1 件ずつ突き合わせた。plan に展開された grade の finding と、成果物から届いた Kata 起因の finding はなかった。正本は、優先度の条件・一次連絡の期限・切替の判断・バックアップ方針・未決事項・導線の状態を持つ `opd-index-sample`、停止・切替の判断を持つ `opr-incident-sample`、緊急権限を持つ `opd-access-control-sample`、構成と frontmatter を定める `opd-rulebook`、`docs/ja/specdojo/samples/` の実在確認である。確かめ方はいずれも読み取りで、導線の状態は `ls` でも確かめた。判断は次のとおり。優先度、P1 の切替判断、周知の範囲、転記と照合、未決事項、緊急権限、見出し構成は一致したので維持した。導線の状態の誤りと「夜間バックアップ」の表記は正本を正として直した。rulebook と矛盾する記述はなかった。成果物の `status` は `draft` のまま変更していない。
