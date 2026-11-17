---
specdojo:
  id: prj-0001:xer-t-kata-slim-sf-index-050-20261117t161901z-2fe86e55
  type: exec-result
  task_id: T-KATA-SLIM-sf-index-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-sf-index-050/T-KATA-SLIM-sf-index-050-20261117T161901Z-2fe86e55/plan.md
  started_at: "2026-11-17T16:19:10.253Z"
  completed_at: "2026-11-17T16:57:17.641Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - sf-index
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/sf-index-sample.md` から、文書の運用の記述と同じ判断の言い直しを外した。
- 外したのは、役割の表と段落、公開範囲の段落、一覧の完成判定の章、再照合と申し送りの節、未決事項の表の担当・判断時期・追跡先の列。
- 結論（判断の基準、値、例外、未決事項の論点）は変えていない。
- 空白と表の区切り行を除いた文字数は 5,409 字から 3,016 字（約 56%）になり、目安の 7 割以下を満たした。
- runner の検査（`lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration`）はすべて passed だった。`lint:ts` と `typecheck` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-index-sample.md`: sld の試行と改訂済み sld-sample に倣い、運用の記述と判断の言い直しを削った（13 行追加、55 行削除）。外した内容は、採用ロールの参照と役割の段落、公開範囲の段落、「一覧の完成判定」の章（担当ごとの判定条件の表と `draft` を維持する段落）、「再照合と申し送り」の節。未決事項の表からは担当・判断時期・追跡先の列を外し、論点と当面の扱いは残した。

## 3. 申し送り

- 「一覧の完成判定」の章を外したため、個別機能の試験条件は個別仕様へ委ねるという結論も sample から消えた。executor はこの結論が rulebook の全体方針と重なると判断している。
- 「ARC を独立した主担当にしない」という分担の結論も、役割の段落と一緒に外れた。executor はこれを運用の記述として扱っている。
- 大きさ（空白と表の区切り行を除いた文字数）: 前 5,409 字、後 3,016 字（約 56%）。数え方は sld の試行と同じ。
- 「一覧の完成判定」の章（担当ごとの判定条件の表と `draft` を維持する段落）を丸ごと外した。理由は 2 つ: rulebook の本文要件にない章であり、rulebook の「完成判定と継続保守」と重なり、承認の運用でもあるため。個別機能の試験条件は個別仕様へ委ねるという結論も外れたが、rulebook の全体方針と重なる。
- 「再照合と申し送り」の節を外した。再照合の契機は rulebook の「未決事項」の記述ガイドが担い、機能 ID を再利用しないことは rulebook の命名規則が担う。
- 採用ロールの参照（組織定義・メンバー定義・RACI）と公開範囲の段落を外した。「ARC を独立した主担当にしない」という分担の結論も、運用の記述として一緒に外れた。
- 未決事項の追跡先（`kinuya-issue-log/SF-01` など）と担当・判断時期の列は、登録簿で追跡する方針に従って外した。論点と当面の扱い（設計・受入の保留）は残した。
- rulebook の `recipe` と `template` が `not-needed` なので、変更案はない。rulebook の全体方針にはすでに「共通の運用」がある。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の手順に沿い、rulebook を正として sample だけを編集した。手本は sld の試行と改訂済みの sld-sample である。rulebook の `recipe` と `template` が `not-needed` のため、変更案はない。docs の変更のため、整形（prettier）と markdownlint を実行し、runner の検査も通っている。
