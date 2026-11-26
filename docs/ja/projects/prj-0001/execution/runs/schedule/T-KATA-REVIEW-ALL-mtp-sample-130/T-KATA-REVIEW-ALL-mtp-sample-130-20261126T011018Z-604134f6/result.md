---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mtp-sample-130-20261126t011018z-604134f6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mtp-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mtp-sample-130/T-KATA-REVIEW-ALL-mtp-sample-130-20261126T011018Z-604134f6/plan.md
  started_at: "2026-11-26T01:10:29.117Z"
  completed_at: "2026-11-26T01:18:19.763Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/mtp-sample.md` の文を 3 か所直した（W1・W2・W3・W8、F003 を反映）。
- F001（`vp-dev-change-impact`）は R5 の観点、F002（`vp-qe-verifiability`）は R4 の観点のため、この段では直さず handoff に回した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 2. リハーサル回数とスケジュール | 切替日を「確定するか延期する」主体が読み取れない。 | 「PO が第 2 回の結果を見て確定するか延期する」に直した。 | W1 | - |
| R3-2 | R3 | 5. 合否基準 | 「判定者は件数を…そろえ」で主語と述語がねじれ、2 つの判定者の決め方が 1 文に入っている。 | 件数の判定者とつけ残高・在庫数の判定者を別の文に分けた。 | W2、W3 | - |
| R3-3 | R3 | 8. GO/NO-GO判断プロセス | 条件付き GO の「決定記録」が他の章の `pm-decision-log` と呼称が揺れ、確かめる主体と記録する主体もない。 | 「QE が切替日の前日の読み合わせで直したことを確かめられる」「PO が条件と確認の期限を `pm-decision-log` へ記録して切替日を確定する」に直した。 | F003（`vp-ux-language-consistency`）、W1、W8 | - |
| R3-4 | R3 | 冒頭（frontmatter の `based_on`） | F001: 「関連ドキュメント」章で参照している `specdojo:dmd-sample` が `based_on` にない。 | - | `vp-dev-change-impact` は R5 の観点のため R5 に回す。 | - |
| R3-5 | R3 | 5. 合否基準 | F002: 所要時間の基準に時刻や分数の値がなく、合否を測れない。 | - | `vp-qe-verifiability` は R4 の観点のため R4 に回す。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: 「リハーサル回数とスケジュール」章で、切替日を確定するか延期する主体を PO と明記した。「合否基準」章では、件数の判定者とつけ残高・在庫数の判定者を別の文に分け、主語と述語のねじれを解消した。「GO/NO-GO判断プロセス」章の条件付き GO では、「決定記録」を `pm-decision-log` に統一し、確かめる主体を QE、記録する主体を PO とした。

## 3. 申し送り

- F001 は `based_on` への `specdojo:dmd-sample` の追加、または参照だけに留める理由の記述を、R5 で判断する。
- F002 は所要時間の基準に仮の分数などを添えるかを、R4 で判断する。合否基準には臨時休業の開始時刻を後で決める `_UNDECIDED_` がすでにある。
- R3-1: R3 / 2. リハーサル回数とスケジュール / 切替日を「確定するか延期する」主体が読み取れない / 「PO が第 2 回の結果を見て確定するか延期する」に直した / W1 / -
- R3-2: R3 / 5. 合否基準 / 「判定者は件数を…そろえ」で主語と述語がねじれ、2 つの判定者の決め方が 1 文に入っている / 件数の判定者とつけ残高・在庫数の判定者を別の文に分けた / W2、W3 / -
- R3-3: R3 / 8. GO/NO-GO判断プロセス / 条件付き GO の「決定記録」が他の章の `pm-decision-log` と呼称が揺れ、確かめる主体と記録する主体がない / 「QE が切替日の前日の読み合わせで直したことを確かめられる」「PO が条件と確認の期限を `pm-decision-log` へ記録して切替日を確定する」に直した / F003（`vp-ux-language-consistency`）、W1、W8 / -
- R3-4: R3 / 冒頭（frontmatter の `based_on`）/ F001: §9 で参照している `specdojo:dmd-sample` が `based_on` にない / - / `vp-dev-change-impact` は R5 の観点のため R5 に回す。R5 で `based_on` に足すか、参照だけに留める理由を書くかを決める / -
- R3-5: R3 / 5. 合否基準 / F002: 所要時間の基準に時刻や分数の値がなく、合否を測れない / - / `vp-qe-verifiability` は R4 の観点のため R4 に回す。§5 には臨時休業の開始時刻を後で決める `_UNDECIDED_` がすでにあり、R4 で仮の値を添えるかを判断する / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の docs/ja/specdojo/samples/mtp-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは `*.md` だけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、読みやすさの観点（W1〜W10）で既存の文を見直した。意味や判断に要る背景・例外・制約は変えていない。F003 の呼称の揺れは `pm-decision-log` に統一して解消した。F001 と F002 は別の段の観点のため、この段では扱わなかった。Prettier と runner の検査（`lint:md:changed`、`lint:fm:changed`、`validate:schema`、`test:docs` など）は通っている。
