---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-monitoring-sample-110-20261125t002649z-c97448c9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-monitoring-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-monitoring-sample-110/T-KATA-REVIEW-ALL-opd-monitoring-sample-110-20261125T002649Z-c97448c9/plan.md
  started_at: "2026-11-25T00:26:59.526Z"
  completed_at: "2026-11-25T00:39:11.617Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-monitoring-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `opd-monitoring-sample` を確認し、rulebook の記述ガイド「差分を持つ章」が求める差分の種類（補足・具体化）が書かれていない 3 節に、その種類を書き足した。大きな欠落や不要な内容は見つからなかった。
- plan の編集対象は `opd-access-control-sample` と解決されていた。executor は、タスクと根拠成果物の `path` が `opd-monitoring-sample.md` であることから誤った解決とみなし、レビュー対象の `opd-monitoring-sample` だけを編集した。`opd-access-control-sample` は編集していない。
- executor が実行した prettier と markdownlint は成功した。runner が実行した `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` も成功した。変更種別により、`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は対象外になった。
- 指摘は 6 件ある。内訳は、直した 3 件、要判断 2 件（No 4、No 6）、R5 へ申し送り 1 件（No 5）。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 「監視対象と守る業務」「初動の時限と完了条件」「閾値の見直し」の 3 節で、`opd-index` に対する差分の種類（補足・具体化）が分かるように導入文を書き換えた、または書き足した。変更は 4 行追加・2 行削除。

## 3. 申し送り

- R1 の指摘一覧。No 1〜3 は反映済み、No 4〜6 は未反映。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | 1 | R1 | 「監視対象と守る業務」の表の前の 1 文 | 差分の種類（補足・具体化・例外）が示されていない | 「`opd-index` は監視対象と閾値だけを定める。次の表は、監視対象ごとに守る業務と検知しなかった場合の影響を示す（補足）。」に置き換えた | `specdojo:opd-rulebook` 記述ガイド「差分を持つ章」、`vp-qe-kata-conformance` | 直した | | 2 | R1 | 「初動の時限と完了条件」の表の前の 1 文 | 差分の種類が示されていない | 「次の表は、`opd-index` の初動を、通知を受けてから監視としての初動を終えるまでの時限と、未解決のときの引き継ぎ先へ具体化する。」に置き換えた | `specdojo:opd-rulebook` 記述ガイド「差分を持つ章」、opd-index-sample「監視・アラート方針」の初動の列 | 直した | | 3 | R1 | 「閾値の見直し」の冒頭 | 節が `opd-index` のどの統制への差分か、差分の種類が示されていない | 冒頭に「`opd-index` は閾値の見直しの契機を定めていない。本節は見直しの契機と進め方を定める（補足）。」を加えた | `specdojo:opd-rulebook` 記述ガイド「差分を持つ章」と禁止事項「差分の根拠となる `opd-index` の章を示さずに例外を書く」 | 直した | | 4 | R1 | 「概要（monitoring）」の未決事項の表の 3 行目（営業時間内の稼働率の目標） | `opd-index` の SLO の未決事項を言い直している。本書に稼働率の達成を判定に使う記述はなく、要らない内容の可能性がある | 編集していない。行を削り、判断は `opd-index` の未決事項に任せる案 | `specdojo:opd-rulebook` 禁止事項「`opd-index` と同じ統制を差分として示さずに再掲する」、`done_criteria`「opd-index の方針を言い直していないこと」 | 要判断 | | 5 | R1（R5 へ申し送り） | 「関連ドキュメント導線（`opr` 等）」の表、および「初動の時限と完了条件」の `opd-incident-management` の参照 | `opr-index`・`opr-monitoring`・`opd-incident-management` が「予定」でバッククォートの仮置きになっている。対応する sample は存在する。ほかの文書との整合なので R5 で扱う | 編集していない。wikilink に変えて備考を「作成済」にする案 | Sample 記述標準「リンクはファイルがある場合に記載し」、opd-index-sample の関連ドキュメント導線の書き方 | R5 へ | | 6 | R1 | plan の「根拠となる成果物と編集対象」 | 編集対象が `opd-access-control-sample.md` と解決されているが、タスクと根拠成果物の `path` は `opd-monitoring-sample.md`。rulebook の `sample` 宣言の先頭を拾った解決の誤りとみられる | plan の生成で、レビュー対象の sample をタスクの成果物 `path` から解決するよう直す案（SpecDojo 本体の課題として起票を検討） | plan frontmatter の `targets`、kata-guide「kata を agent でレビューする」の「直すのは対象の kata だけ」 | 要判断 |
- 判断が要るのは No 4 と No 6 である。No 4 は、稼働率の目標の行を `opd-index` に任せて削るかどうかを決める。No 6 は、plan 生成の編集対象の解決誤りを SpecDojo 本体の課題として起票するかどうかを決める。No 5 は R5 の段で扱う。
- No: 1 / 段: R1 / 箇所: opd-monitoring-sample「監視対象と守る業務」の表の前の 1 文 / 指摘: rulebook の記述ガイド「差分を持つ章」が求める差分の種類（補足・具体化・例外）が示されていない / 直した案: 「`opd-index` は監視対象と閾値だけを定める。次の表は、監視対象ごとに守る業務と検知しなかった場合の影響を示す（補足）。」に置き換えた / 根拠: specdojo:opd-rulebook 記述ガイド「差分を持つ章」の「各記述は補足・具体化・例外のどれかが分かるように書き」、vp-qe-kata-conformance / 印: 直した
- No: 2 / 段: R1 / 箇所: opd-monitoring-sample「初動の時限と完了条件」の表の前の 1 文 / 指摘: 差分の種類が示されていない / 直した案: 「次の表は、`opd-index` の初動を、通知を受けてから監視としての初動を終えるまでの時限と、未解決のときの引き継ぎ先へ具体化する。」に置き換えた / 根拠: specdojo:opd-rulebook 記述ガイド「差分を持つ章」、opd-index-sample「監視・アラート方針」の初動の列 / 印: 直した
- No: 3 / 段: R1 / 箇所: opd-monitoring-sample「閾値の見直し」の冒頭 / 指摘: 節が `opd-index` のどの統制への差分なのか、差分の種類が示されていない / 直した案: 冒頭に「`opd-index` は閾値の見直しの契機を定めていない。本節は見直しの契機と進め方を定める（補足）。」を加えた / 根拠: specdojo:opd-rulebook 記述ガイド「差分を持つ章」と禁止事項「差分の根拠となる `opd-index` の章を示さずに例外を書く」 / 印: 直した
- No: 4 / 段: R1 / 箇所: opd-monitoring-sample「概要（monitoring）」の未決事項の表の 3 行目（営業時間内の稼働率の目標） / 指摘: `opd-index` の SLO の未決事項を本書で言い直している。本書には稼働率の達成を判定に使う記述もなく、要らない内容の可能性がある / 直した案: 編集していない。行を削り、判断は `opd-index` の未決事項に任せる案 / 根拠: specdojo:opd-rulebook 禁止事項「`opd-index` と同じ統制を差分として示さずに再掲する」、`done_criteria`「opd-index の方針を言い直していないこと」 / 印: 要判断
- No: 5 / 段: R1（R5 へ申し送り） / 箇所: opd-monitoring-sample「関連ドキュメント導線（`opr` 等）」の表 / 指摘: `opr-index`・`opr-monitoring`・`opd-incident-management` が「予定」でバッククォートの仮置きになっているが、opr-index-sample・opr-monitoring-sample・opd-incident-management-sample は存在する。「初動の時限と完了条件」の `opd-incident-management` の参照も同じ。ほかの文書との整合なので R5 で扱う / 直した案: 編集していない。wikilink に変えて備考を「作成済」にする案 / 根拠: Sample 記述標準「リンクはファイルがある場合に記載し」、opd-index-sample の関連ドキュメント導線の書き方 / 印: R5 へ
- No: 6 / 段: R1 / 箇所: plan の「根拠となる成果物と編集対象」 / 指摘: 編集対象が opd-access-control-sample.md と解決されているが、task と根拠の成果物の `path` は opd-monitoring-sample.md。rulebook の `sample` 宣言の先頭を拾った解決の誤りとみられる。opd-access-control-sample は編集していない / 直した案: plan の生成で、レビュー対象の sample をタスクの成果物 `path` から解決するよう直す案（SpecDojo 本体の課題として起票を検討） / 根拠: plan frontmatter の `targets`、kata-guide「kata を agent でレビューする」の「直すのは対象の kata だけ」 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

approach は `sample-maintenance`。レビュー対象の `opd-monitoring-sample` を、`specdojo:opd-rulebook` の記述ガイド「差分を持つ章」と禁止事項、`opd-index-sample` の監視・アラート方針に照らして確認した。補足・具体化・例外のどれかが分からない 3 節の導入文を直し、記述内容が rulebook と整合する箇所は維持した。grade と condense 由来の finding はなかった。rulebook と sample が矛盾した箇所はなく、rulebook は変更していない。frontmatter の `status` は `draft` のままで、`ready` へは変更していない。根拠が不足する指摘（No 4、No 6）は推測で改訂せず、案だけを残した。
