---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-issues-and-approach-sample-140-20261125t073355z-99f92925
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-140/T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-140-20261125T073355Z-99f92925/plan.md
  started_at: "2026-11-25T07:34:04.294Z"
  completed_at: "2026-11-25T07:48:23.604Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-issues-and-approach-sample
    - specdojo:prj-issues-and-approach-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、sample の事実を概要・スコープ・前提制約依存の各 sample や rulebook、schema と突き合わせた。誤り 2 件（見直しの契機の指標の種類、機能名の表記）を直した。
- F001（A-01 の対応課題に P-04 を含める件）は、現行の記述が既に「P-01、P-02、P-04（記録の蓄積のみ）」と限定されており、解消済みだった。R4 の観点外のため追加の修正はしていない。
- 要判断が 1 件残っている（トレードオフ/リスクの 1 行目の軽減策の時期。申し送り R4-3 を参照）。
- frontmatter の `status` は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-issues-and-approach-sample.md`: 見直しと変更管理の章の契機を「短期指標を判定した」から「中長期指標を判定した」に直し、スコープの sample のスコープ外の記述と本書の解決策候補の章に合わせた。次の検討事項（ToDo）の完了条件の機能名を「顧客とつけ管理」から「顧客・つけ管理」に直し、スコープの対象システムの表記に合わせた。あわせて prettier の整形で表の列幅が変わった（9 行追加・9 行削除）。

## 3. 申し送り

- 要判断（R4-3）: トレードオフ/リスクの 1 行目の軽減策「短期指標の判定後に記録の継続を妨げないかで採否を決める」は、仕入れ支援についてはスコープの「中長期指標を判定した後に再検討」と食い違う可能性がある。一方、会計連携と分析にはスコープ側に時期の定めがない。対象ごとに条件を分けると記述が長くなり、「中長期指標」へ一律に置き換えると会計連携の根拠がない。選ばなかった案は、「スコープ外の再検討条件に従い」と参照に置き換える案。PO の判断を要する。
- R4-1: R4 / 7. 見直しと変更管理 / 契機「短期指標を判定した、または仕入れ支援がスコープに入った」が、スコープの sample の「仕入れ数量の自動提案」の後続条件「記録が蓄積し、中長期指標を判定した後に再検討する」および本書の解決策候補の章「中長期指標の判定後に扱う」と食い違う / 「中長期指標を判定した」に直した / `docs/ja/specdojo/samples/prj-scope-sample.md` のスコープ外の章（仕入れ数量の自動提案の行） / -
- R4-2: R4 / 6. 次の検討事項（ToDo） / 完了条件の機能名「顧客とつけ管理」が、スコープの「対象システム」の機能名「顧客・つけ管理」と一致しない / 「顧客・つけ管理」に直した / `docs/ja/specdojo/samples/prj-scope-sample.md` の対象システムの章（顧客・つけ管理の行） / -
- R4-3: R4 / 5. トレードオフ/リスク / 1 行目の軽減策「短期指標の判定後に記録の継続を妨げないかで採否を決める」は、仕入れ支援についてはスコープの「中長期指標を判定した後に再検討」と食い違う。会計連携（既存手順で代替）と分析（記録が安定した後の次フェーズ）にはスコープ側に時期の定めがない / - / スコープの sample のスコープ外の章と境界の判断基準の章。迷った理由: 対象ごとに条件を分けると記述が長くなり、「中長期指標」へ一律に置き換えると会計連携の根拠がない。選ばなかった案: 「スコープ外の再検討条件に従い」と参照に置き換える案 / 要判断
- 確かめの表 1: 主張=frontmatter `type: project`・`rulebook: specdojo:prj-issues-and-approach-rulebook` / 正本=`docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md` の推奨 Frontmatter 項目の章、`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook の推奨 Frontmatter 項目の章が type project と rulebook ID を指定し、schema の deliverableType の enum に project がある
- 確かめの表 2: 主張=frontmatter `based_on`・`supersedes` / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、rulebook の推奨 Frontmatter 項目の章 / 確かめ方=grep / 結果=一致 / 根拠=common schema に `based_on`・`supersedes` が定義され、rulebook は概要・スコープ・前提制約依存の ID を記載するとしている
- 確かめの表 3: 主張=wikilink の参照先 specdojo:prj-overview-sample・specdojo:prj-scope-sample・specdojo:prj-assumptions-constraints-dependencies-sample が存在する / 正本=`docs/ja/specdojo/samples/` 配下の各ファイルの id / 確かめ方=grep 'id: ...' / 結果=一致 / 根拠=3 ファイルと rulebook の id が見つかった
- 確かめの表 4: 主張=優先度 High/Medium/Low、関係 代替/補完、原因区分 事実/仮説、区分 トレードオフ/リスク / 正本=rulebook の本文構成の章と記述ガイドの章 / 確かめ方=grep / 結果=一致 / 根拠=rulebook の本文構成の章（課題一覧の行）と記述ガイドの章（課題一覧・解決策候補・トレードオフ/リスクの節）
- 確かめの表 5: 主張=ACD-D01（タブレット）・ACD-A02（通信断）・ACD-A01（記録継続の前提） / 正本=`docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md` / 確かめ方=grep / 結果=一致 / 根拠=ACD-D01 はタブレット1台の継続提供、ACD-A02 は通信断、ACD-A01 は現行手順に近い操作なら記録を継続できるという前提
- 確かめの表 6: 主張=課題一覧の影響の頻度（欠品は週1回程度、廃棄は月に数品目、残高確認は月に数件、家族の店番日は保留） / 正本=`docs/ja/specdojo/samples/prj-overview-sample.md` の背景の章 / 確かめ方=読み取り / 結果=一致 / 根拠=背景の章の表の 4 行
- 確かめの表 7: 主張=判断軸の順は概要の基本的な考え方の Record First と Simple Operation の順 / 正本=概要の sample の基本的な考え方の章 / 確かめ方=grep / 結果=一致 / 根拠=1. Record First、2. Simple Operation の順
- 確かめの表 8: 主張=つけ残高を1分以内で確認・店番の追加操作時間 1日10分以内・欠品削減の判定は運用開始後6か月 / 正本=概要の sample の期待効果の章 / 確かめ方=grep / 結果=一致 / 根拠=初期公開指標のつけ管理は1分以内、短期指標の操作負担は1日あたり合計10分以内、中長期指標の欠品削減は運用開始後6か月
- 確かめの表 9: 主張=ベースライン測定は運用開始前1か月 / 正本=概要の sample の背景の章 / 確かめ方=grep / 結果=一致 / 根拠=「実測値は運用開始前1か月のベースライン測定で置き換える」
- 確かめの表 10: 主張=初期対象は店頭販売・在庫・つけ管理、機能は販売登録・在庫管理・顧客・つけ管理 / 正本=スコープの sample の対象業務の章と対象システムの章 / 確かめ方=grep / 結果=不一致→修正（R4-2） / 根拠=スコープの機能名は「顧客・つけ管理」
- 確かめの表 11: 主張=仕入れ数量の自動提案はスコープ外で、中長期指標の判定後に扱う / 正本=スコープの sample のスコープ外の章 / 確かめ方=読み取り / 結果=解決策候補の章は一致、見直しと変更管理の章は不一致→修正（R4-1）、トレードオフ/リスクの章は要判断（R4-3） / 根拠=「記録が蓄積し、中長期指標を判定した後に再検討する」
- 確かめの表 12: 主張=オフライン時の記録方法は未決（`_UNDECIDED_`）、初期運用の開始前に店主代表が決める / 正本=スコープの sample のスコープ外の章の直後の段落 / 確かめ方=読み取り / 結果=一致 / 根拠=「記録方法は `_UNDECIDED_:` 初期運用の開始前に店主代表（`PO`）が決め」
- F001（vp-qe-omissions-consistency）: 現行の A-01 の対応課題は既に「P-01、P-02、P-04（記録の蓄積のみ）」と限定され、指摘は解消済み。R4 の観点外のため扱っていない。
- sample の frontmatter の status は ready のまま変更していない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan / result / 個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` が含まれない）

## 4. 進め方と実践の型の適用

根拠とした資料は、概要・スコープ・前提制約依存の各 sample、`prj-issues-and-approach-rulebook`、`deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`、kata-guide の R4 の定義である。主張ごとの確かめは次の表のとおり。 | # | 主張 | 正本 | 方法 | 結果 | | --- | --- | --- | --- | --- | | 1 | frontmatter の `type: project` と `rulebook` の ID | rulebook の推奨 Frontmatter 項目の章、`deliverable-frontmatter.schema.yaml` | 読み取り | 一致 | | 2 | frontmatter の `based_on` と `supersedes` | `common-frontmatter.schema.yaml`、rulebook | grep | 一致 | | 3 | wikilink の参照先 3 件の存在 | `docs/ja/specdojo/samples/` 配下の各 id | grep | 一致 | | 4 | 優先度、関係、原因区分、区分の列挙値 | rulebook の本文構成と記述ガイドの章 | grep | 一致 | | 5 | ACD-D01、ACD-A02、ACD-A01 の内容 | 前提制約依存の sample | grep | 一致 | | 6 | 課題一覧の影響の頻度 | 概要の sample の背景の章 | 読み取り | 一致 | | 7 | 判断軸の順（Record First、Simple Operation） | 概要の sample の基本的な考え方の章 | grep | 一致 | | 8 | 1 分以内、1 日 10 分以内、6 か月の指標 | 概要の sample の期待効果の章 | grep | 一致 | | 9 | ベースライン測定は運用開始前 1 か月 | 概要の sample の背景の章 | grep | 一致 | | 10 | 機能名（顧客・つけ管理） | スコープの sample の対象システムの章 | 読み取り | 不一致のため修正（R4-2） | | 11 | 仕入れ数量の自動提案は中長期指標の判定後に扱う | スコープの sample のスコープ外の章 | 読み取り | 解決策候補の章は一致。見直しと変更管理の章は不一致のため修正（R4-1）。トレードオフ/リスクの章は要判断（R4-3） | | 12 | オフライン時の記録方法は未決で、店主代表（`PO`）が初期運用の開始前に決める | スコープの sample のスコープ外の章の直後の段落 | 読み取り | 一致 | F001 は解消済みと確認した。要判断の R4-3 は未解消のままで、次のアクションは PO による軽減策の時期の条件の判断である。rulebook と sample に矛盾はなく、rulebook を正として覆した箇所はない。
