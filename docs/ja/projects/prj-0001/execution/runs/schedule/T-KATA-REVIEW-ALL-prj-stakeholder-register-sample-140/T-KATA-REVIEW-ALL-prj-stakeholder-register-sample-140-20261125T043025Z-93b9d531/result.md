---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-stakeholder-register-sample-140-20261125t043025z-93b9d531
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-140/T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-140-20261125T043025Z-93b9d531/plan.md
  started_at: "2026-11-25T04:30:34.827Z"
  completed_at: "2026-11-25T04:43:20.786Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`docs/ja/specdojo/samples/prj-stakeholder-register-sample.md` の事実の主張 13 件を、schema・rulebook・関連 sample と突き合わせた。すべて一致し、誤りはなかった。確かめられなかった主張はない。
- 誤りがないため sample は変更しておらず、変更ファイルはない。
- 確かめの表（主張ごと）: | No. | 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | --- | | 1 | `type: project` | deliverable-frontmatter schema の許される値、rulebook の推奨 Frontmatter 項目 | 一致 | | 2 | `status: ready` | common-frontmatter schema の許される値 `draft` / `ready` / `deprecated` | 一致（今回は変更なし） | | 3 | `rulebook: specdojo:prj-stakeholder-register-rulebook` | `rulebookRef` の形式、rulebook の推奨値 | 一致 | | 4 | `based_on` と wikilink の `specdojo:prj-overview-sample` | 参照先の `id` | 一致 | | 5 | 関係者 ID `STH-&lt;KEY&gt;` 形式と、5 ID が全 5 章で同じ | rulebook のドキュメントID の節 | 一致 | | 6 | 関与区分の書き方（区分語、補足語、`/` の併記） | rulebook の関係者一覧の記述ガイド | 一致 | | 7 | 影響度・関心度の値 High / Medium / Low | rulebook の影響度/関心度分析の記述ガイド | 一致 | | 8 | `PO` / `DEV` の定義 | `docs/ja/specdojo/samples/pm-roles-sample.yaml` の `code` | 一致 | | 9 | 店主代表=`PO`、開発担当=`DEV` | `docs/ja/specdojo/samples/pm-members-sample.yaml`（shop-owner `[PO, OPS]`、developer `[PM, BA, DEV]`） | 一致 | | 10 | 記録のある営業日 90% 以上と運用開始後2週間 | prj-overview-sample の短期指標、Sample 記述標準の期待効果の表 | 一致 | | 11 | 代表シナリオの試行（操作説明なし、重大な行き詰まり 0 件、完了・所要時間・支援内容の記録） | prj-overview-sample の初期公開指標 | 一致 | | 12 | 初期公開日の `_UNDECIDED_` | prj-overview-sample の該当段落 | 一致 | | 13 | 技術メンターが CoderDojo の外部協力者 | Sample 記述標準の共通登場人物 | 一致 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5 への申し送り（別の sample との食い違い）: 関係者一覧の前の文「Role code は採用済みの `PO` と `DEV` だけを使う」は、採用済みが 2 つだけとも読める。`pm-roles-sample.yaml` は 8 つの Role code を定義している。`pm-members-sample.yaml` は技術メンターに `ARC`、家族利用者の代表に `UX` を付けているが、この sample の表ではどちらも `-` である。直し方の案は次の 2 つ。(a) 文を「本書では `PO` と `DEV` だけを使う」に直す。(b) 技術メンターに `ARC` を付けるかを決める。rulebook は該当しない外部集団には Role code を付けないとしているため、どちらにするかは R5 か PO が決める。R4 では sample を変更していない。
- R4 の確かめの表（reporter が result の実施内容に 1 回だけ書く）: (1) `type: project`: deliverable-frontmatter schema の許される値と rulebook の推奨 Frontmatter 項目、一致 (2) `status: ready`: common-frontmatter schema の許される値 `draft`/`ready`/`deprecated`、一致（今回は変更なし） (3) `rulebook: specdojo:prj-stakeholder-register-rulebook`: `rulebookRef` の形式と rulebook の推奨値、一致 (4) `based_on` と wikilink の `specdojo:prj-overview-sample`: 参照先の `id` を読み取り、一致 (5) 関係者 ID の `STH-&lt;KEY&gt;` 形式と全章で同じ ID: rulebook のドキュメントID の節、5 ID が全 5 章で同じ、一致 (6) 関与区分の書き方（区分語、補足語、`/` の併記）: rulebook の関係者一覧の記述ガイド、一致 (7) 影響度・関心度の値 High/Medium/Low: rulebook の影響度/関心度分析の記述ガイド、一致 (8) `PO`/`DEV` の定義: `docs/ja/specdojo/samples/pm-roles-sample.yaml` の `code`、一致 (9) 店主代表=`PO`、開発担当=`DEV`: `docs/ja/specdojo/samples/pm-members-sample.yaml`（shop-owner `[PO, OPS]`、developer `[PM, BA, DEV]`）、一致 (10) 記録のある営業日 90% 以上と運用開始後2週間: prj-overview-sample の短期指標と Sample 記述標準の期待効果の表、一致 (11) 代表シナリオの試行（操作説明なし、重大な行き詰まり 0 件、完了・所要時間・支援内容の記録）: prj-overview-sample の初期公開指標、一致 (12) 初期公開日の `_UNDECIDED_`: prj-overview-sample の該当段落、一致 (13) 技術メンターが CoderDojo の外部協力者: Sample 記述標準の共通登場人物、一致。確かめられなかった主張はない。
- R5 への申し送り（別の sample との食い違い）: 関係者一覧の前の文「Role code は採用済みの `PO` と `DEV` だけを使う」は、採用済みが 2 つだけとも読める。`pm-roles-sample.yaml` は 8 つの Role code を定義し、`pm-members-sample.yaml` は技術メンターに `ARC`、家族利用者の代表に `UX` を付けているが、この sample の表ではどちらも `-` である。直し方の案: (a) 文を「本書では `PO` と `DEV` だけを使う」に直す (b) 技術メンターに `ARC` を付けるかを決める。rulebook は該当しない外部集団には Role code を付けないとしているため、どちらにするかは R5 か PO が決める。R4 では sample を変更していない。
- 適用外の検証: `npm run validate:schema:file`（executor は sample を含め、どのファイルも変更しておらず、`*.yaml` / `*.yml` の変更がない）
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample に書かれた事実の主張を schema、rulebook、関連 sample と突き合わせた。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はない。突き合わせた 13 件はすべて一致したため、維持した。誤りの直しの差分は生じず、sample は変更していない。Role code の書き方に関する食い違いは、正しさの誤りではなく別の sample との整合の論点として R5 へ申し送った。
