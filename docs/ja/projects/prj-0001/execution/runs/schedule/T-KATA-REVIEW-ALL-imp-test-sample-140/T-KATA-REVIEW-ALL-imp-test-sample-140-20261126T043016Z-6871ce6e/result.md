---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-test-sample-140-20261126t043016z-6871ce6e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-test-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-test-sample-140/T-KATA-REVIEW-ALL-imp-test-sample-140-20261126T043016Z-6871ce6e/plan.md
  started_at: "2026-11-26T04:30:26.560Z"
  completed_at: "2026-11-26T04:33:28.326Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample に書かれた事実を rulebook、schema、計算、date コマンドの結果と突き合わせた。誤りは見つからず、sample は変更していない。
- 確かめた主な項目は、Frontmatter の `type` と `rulebook`、`based_on` と `part_of` のキー、章構成と列名、参照先の文書 ID、反映先の `itc-index`・`atc-index`・`tsp-index`、担当ロールの code、転記先の分類、登録項目 ID の形式、日付と件数と割合の計算である。いずれも一致した。
- `based_on` の `cr-2026-004` は、rulebook が入力とする登録簿の変更要求の ID 形式と合わない疑いがある。ほかの imp 系 sample との整合に関わるため、この段では直さず要判断として残した。
- F001 は `vp-pm-plan-feasibility` の観点で、kata のレビューの段では使わない観点に当たるため扱わなかった。F003 は、つけ残高が成功条件から外れていることを確認し、前の段で解消済みと判断した。F002・F004・F005 は executor の確かめでは扱われておらず、この evidence からは解消の有無を判断できない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 正しさ | Frontmatter（`based_on`） | `based_on` の `cr-2026-004` は、rulebook の「位置づけ」が入力とする登録簿の変更要求（`item_type: change-request` の個票）の ID 形式（`PJR-XXXX`、doc id は `&lt;project-id&gt;:pjr-&lt;xxxx&gt;-&lt;topic&gt;`）と合わない。schema の idRef のパターンは満たす。並行する `imp-business-sample` も `cr-2026-004` を使い、`imp-data-sample` は `pjr-c4a1` を使うため、この sample だけを直すと R5 の整合が崩れる。 | - | `vp-arc-technical-constraints`。`docs/ja/specdojo/rulebooks/imp-test-rulebook.md` の「位置づけ」、`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` の ID パターン。選ばなかった案は、この sample だけを `pjr-c4a1` へ置き換えること。imp 系の sample をまとめて `pjr-c4a1` の形へそろえる案を R5 または人が決める。 | 要判断 |
| R4-2 | R4 正しさ | 対応方針（F001） | 重点回帰で欠陥が見つかったときに残り 100 ケースを受入判定前に実行する工数の指摘は、`vp-pm-plan-feasibility` の観点に当たる。kata-guide の「kata の観点の組」が kata の段のレビューでは使わないとする観点なので、この段では扱わない。 | - | kata-guide「kata の観点の組」の除外表 | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- `based_on` の ID 形式の扱いは R5 の整合の段または人が決める。imp 系 sample をまとめて揃える案と、この sample だけを `pjr-c4a1` へ置き換える案がある。
- F002・F004・F005 の解消状況は executor の確かめ表に出ていない。再評価で確認が必要である。
- R4-1: R4 / Frontmatter（`based_on`） / `based_on` の `cr-2026-004` は、rulebook の「位置づけ」が入力とする登録簿の変更要求（`item_type: change-request` の個票）の ID 形式（`PJR-XXXX`、doc id は `&lt;project-id&gt;:pjr-&lt;xxxx&gt;-&lt;topic&gt;`）と合わない。schema の idRef のパターン（`^[a-z0-9][a-z0-9-:]*$`）は満たす / - / `vp-arc-technical-constraints`。`docs/ja/specdojo/rulebooks/imp-test-rulebook.md` の「位置づけ」、`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` の ID パターン。並行する `imp-business-sample` も `cr-2026-004` を使い、`imp-data-sample` は `pjr-c4a1` を使うため、この sample だけを直すと R5 の整合が崩れる。選ばなかった案はこの sample だけを `pjr-c4a1` へ置き換えること。imp 系の sample をまとめて `pjr-c4a1` の形へそろえる案を R5 または人が決める / 要判断
- R4-2: R4 / 対応方針（F001） / 重点回帰で欠陥が見つかったときに残り 100 ケースを受入判定前に実行する工数の指摘は、`vp-pm-plan-feasibility` の観点で、kata-guide の「kata の観点の組」が kata の段のレビューでは使わないとする観点に当たる。この段では扱わない / - / kata-guide「kata の観点の組」の除外表 / -
- 確かめ 1: 主張「`type: project`、`rulebook: specdojo:imp-test-rulebook`」（Frontmatter） / 正本 `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`「推奨 Frontmatter 項目」 / 読み取り / 一致 / 「`type` は `project`、`rulebook` は `specdojo:imp-test-rulebook`」
- 確かめ 2: 主張「`based_on`・`part_of` のキー」（Frontmatter） / 正本 `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 読み取り / 一致 / 両方とも idRefArray で定義されている
- 確かめ 3: 主張「`based_on: cr-2026-004` が入力の変更要求」（Frontmatter、目的と適用範囲） / 正本 imp-test-rulebook「位置づけ」、register-item schema / 読み取り / 不一致の疑い / R4-1 を参照
- 確かめ 4: 主張「参照先 `imp-data`・`imp-business`・`imp-interface`」（目的と適用範囲、未解決事項に関する F005） / 正本 imp-data・imp-business・imp-interface の各 rulebook の「ファイル命名・ID規則」 / ls と grep / 一致 / 文書 ID は `&lt;project-id&gt;:imp-data` などで、sample は project 修飾を省いて書いている
- 確かめ 5: 主張「反映先 `itc-index`（結合テスト）・`atc-index`（業務受入テスト）・`tsp-index`（テスト戦略・方針）」（対応方針） / 正本 itc-index・atc-index・tsp-index の各 rulebook / 読み取り / 一致 / 内部結合テストカタログ概要、受入テストカタログ概要、`tsp-index` が既定の 1 本
- 確かめ 6: 主張「担当 `QE`・`BA`・`DEV`・`PO`」（対応方針、未解決事項） / 正本 `docs/ja/specdojo/templates/pm-roles-template.yaml`、`docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml` / grep で code を確認 / 一致 / どの code も定義されている
- 確かめ 7: 主張「転記先の分類 `risk`・`question`、決定記録」（未解決事項、対応方針） / 正本 register-item schema の ItemType 列挙値と、imp-test-rulebook「未解決事項」の転記条件表 / 読み取り / 一致 / 列挙値に question・risk・decision がある。期限に間に合わない恐れは risk、確認待ちは question、見送り・代替は decision という使い分けも条件表と一致
- 確かめ 8: 主張「登録項目 ID `PJR-T5D1`・`PJR-T5R2`・`PJR-T5Q3`・`PJR-T5Q4`」 / 正本 register-item schema の `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` / パターンとの照合 / 一致 / I・L・O・U を含まない 4 文字になっている
- 確かめ 9: 主張「リリース予定日 2026-06-01 の 2 営業日前が 2026-05-28」（目的と適用範囲） / 正本は date コマンド / `date -d 2026-06-01 +%A` を実行 / 一致 / 月曜日なので、2 営業日前は木曜の 05-28
- 確かめ 10: 主張「重点 20 ケース＝17%、回帰範囲は中」（影響詳細一覧） / 正本はサマリの尺度表 / 計算 / 一致 / 20/120 は 16.7% で、10% 以上 30% 未満の中
- 確かめ 11: 主張「新規 8 ケース＝2×2×2」「合格件数 28 件」（影響詳細一覧、変更要求の概要） / 正本は本文 / 計算 / 一致 / 8 と 8+20=28
- 確かめ 12: 主張「影響度の件数は高 2・中 1・低 1」（影響分析サマリ） / 正本は影響詳細一覧の 4 行 / 集計 / 一致 / 最大値規則の結果と合う
- 確かめ 13: 主張「章の構成と列名」（全章） / 正本 imp-test-rulebook「本文要件」 / 読み取り / 一致 / 6 章の順と必須の列がそろっている
- 確かめ 14: 主張「成功条件の重大度『高』（売上金額の誤り）」（変更要求の概要、F003） / 正本は本文の対象外の範囲（つけ管理） / 読み取り / 一致 / つけ残高を外してあり、F003 は前の段で解消済み
- 確かめ 15: 主張「値引き条件データ、店頭運用側の判定項目など、駄菓子屋の業務の値」 / 正本なし（共通サンプル文脈） / 対象外 / 確かめられない / 正本のない業務の仮定で、共通サンプル文脈と食い違わないため確かめの対象にしない
- 適用外の検証: `npx markdownlint-cli2 docs/ja/specdojo/samples/imp-test-sample.md`（sample を含め、どのファイルも変更していない。Markdown の lint は親 runner が lint:md で実行する）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実の記述を正本と突き合わせた。誤りがなかったため sample は変更しなかった。正本のない駄菓子屋の業務の値は、共通サンプル文脈と食い違わないため確かめの対象外とした。
