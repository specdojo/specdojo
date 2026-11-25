---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-sample-120-20261125t005426z-8977a86d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-sample-120/T-KATA-REVIEW-ALL-itc-sample-120-20261125T005426Z-8977a86d/plan.md
  started_at: "2026-11-25T00:54:34.987Z"
  completed_at: "2026-11-25T01:04:18.345Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `itc-sample` を見直した。rulebook の本文構成（1〜6章の順・観点配下の見出し構成）との一致を確認し、章の順・粒度は維持した。
- 「テスト観点とケース」の導入段落が4つの観点の型の扱いと不採用の理由・代わりを1段落に詰め込んでいた（grade F003）。そこで前置き1文と「観点の型／本書での扱い／理由・代わり」の表に分けた。
- grade F001 は R1 の版で理由と代わりのケース（`it-sales-checkout-persistence-integrity-010`）が足されており解消済みと確認した。
- grade F002 は index 側との整合の判断で R5 の段に属するため、直す案を申し送りに残した。
- template は rulebook で undecided のため照合対象なし。runner 検査（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は passed。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 「テスト観点とケース」の導入段落を、前置き1文と「観点の型／本書での扱い／理由・代わり」の表に分割した。itc-index の観点の型6つ（「データ永続化の整合性」「トランザクション境界」を追加）と本書の観点の対応を明示した。本文の主張は変えていない。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 6. テスト観点とケース / 導入段落 | 4つの観点の型の扱いと不採用の理由・代わりが1段落に詰め込まれ、型と観点・ケースの対応が読み取りにくい | 前置き1文と「観点の型／本書での扱い／理由・代わり」の表に分けた | `vp-arc-document-structure`、grade F003（`vp-ux-readability`） | - | | R2-2 | R2 | 6. テスト観点とケース / 導入段落 | F001（補完後の確定への遷移の理由と代わりのケースがない）は R1 の版で理由と代わりが足されており解消済み | 変更なし | `vp-qe-omissions-consistency`、grade F001 | - | | R2-3 | R2 | 6.1. 観点: 販売記録と在庫の一致 | ケース表の行の並びが代表（010）→重大例外の再送（020）→境界（030）で、rulebook の「代表→境界→重大例外の順で増やす」と合わない。ただし rulebook が決めているのはケースを増やす順で、表の行の順ではない。`case_id` は変更禁止のため、取れる案は行の並べ替えだけで、並べ替えると番号の順が崩れる | 変更せず。選ばなかった案は、行を 010・030・020 の順に並べ替えること | `vp-arc-document-structure` | 要判断 | | R2-4 | R2 | 6. テスト観点とケース | `itc-index-sample` は本対象の「依存障害時の挙動」を「DB 停止時に未保存を成功表示しない、応答欠落時の照合待ちの識別」としている。本書は DB 停止を不採用にして更新拒否で代え、応答欠落時の照合待ちには触れず、不採用の理由もない | 案1: `docs/ja/specdojo/samples/itc-index-sample.md` の該当セルを「DB の更新拒否時に未保存を成功表示しない」に改める。案2: 本書の表に応答欠落時の照合待ちの扱い（採るなら観点、採らないなら理由・代わり）を足す。どちらを正にするかは index と対象別の整合の判断で R5 の段に属する | `vp-qe-omissions-consistency`、grade F002（`vp-qe-kata-conformance`、R5 の扱い） | 要判断 |
- R2-1: R2 / 6. テスト観点とケース / 導入段落に 4 つの観点の型の扱いと不採用の理由・代わりのケースが 1 段落に詰め込まれ、型と観点・ケースの対応が読み取りにくい / 前置きの 1 文と「観点の型／本書での扱い／理由・代わり」の表に分け、itc-index の観点の型 6 つ（「データ永続化の整合性」「トランザクション境界」を追加）と本書の観点の対応を明示した。本文の主張は変えていない / `vp-arc-document-structure`、grade F003（`vp-ux-readability`） / -
- R2-2: R2 / 6. テスト観点とケース / F001（補完後の確定への遷移の理由と代わりのケースがない）は R1 の版で理由（補完後の購入は通常の会計確定と同じ入力）と代わり（`it-sales-checkout-persistence-integrity-010`）が足されており解消済み / - / `vp-qe-omissions-consistency`、grade F001 / -
- R2-3: R2 / 6.1. 観点: 販売記録と在庫の一致 / ケース表の行の並びが代表（010）→重大例外の再送（020）→境界（030）で、rulebook の「代表→境界→重大例外の順で増やす」と合わない / - / `vp-arc-document-structure`。迷った理由: rulebook が決めているのはケースを増やす順で、表の行の順ではない。`case_id` は変更禁止のため取れる案は行の並べ替えだけで、並べ替えると番号の順が崩れる。選ばなかった案: 行を 010・030・020 の順に並べ替える / 要判断
- R2-4: R2 / 6. テスト観点とケース / itc-index-sample の「観点の立て方（共通）」は本対象の「依存障害時の挙動」を「DB 停止時に未保存を成功表示しない、応答欠落時の照合待ちの識別」としている。本書は DB 停止を不採用にして更新拒否で代え、応答欠落時の照合待ちには触れず不採用の理由もない（grade F002 と抜け） / - / `vp-qe-omissions-consistency`、grade F002（`vp-qe-kata-conformance`、R5 の扱い）。相手側の直す案: `docs/ja/specdojo/samples/itc-index-sample.md` の該当セルを「DB の更新拒否時に未保存を成功表示しない」に改める。または本書の表に応答欠落時の照合待ちの扱い（採るなら観点、採らないなら理由・代わり）を足す。迷った理由: どちらを正にするかは index と対象別の整合の判断で R5 の段に属する / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/itc-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、rulebook の本文構成を正として章の順・粒度・表と本文の配置を照合した。R1 が直した版を読み、R1 の指摘は繰り返していない。grade F003 は導入段落を表に分けて解消した。F001 は R1 の版で解消済みと確認し、維持した。F002 は index との整合の判断で R5 の段に属するため、sample 以外は変更せず直す案を申し送りに残した。grade result サイドカーは直接編集していない。frontmatter の `status` は `draft` のまま据え置いた。
