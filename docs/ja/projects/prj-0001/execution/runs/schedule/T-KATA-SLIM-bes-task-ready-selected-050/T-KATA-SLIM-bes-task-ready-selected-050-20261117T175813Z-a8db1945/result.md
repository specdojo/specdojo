---
specdojo:
  id: prj-0001:xer-t-kata-slim-bes-task-ready-selected-050-20261117t175813z-a8db1945
  type: exec-result
  task_id: T-KATA-SLIM-bes-task-ready-selected-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bes-task-ready-selected-050/T-KATA-SLIM-bes-task-ready-selected-050-20261117T175813Z-a8db1945/plan.md
  started_at: "2026-11-17T17:58:19.957Z"
  completed_at: "2026-11-17T18:25:32.129Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - bes-task-ready-selected
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- `bes-sample.md` から文書の運用の記述と同じ判断の言い直しを外し、結論は変えずに書き直した。空白・改行と表の区切り行を除いた文字数は 3,003 字から 2,100 字（69.9%）になり、目安の 7 割以下に収まった。
- 追加の変更は行っていない。recipe・template・rulebook は commit の対象外のため変更していない。
- lint:fm、lint:md、lint:mermaid、lint:d2、validate:schema、test:unit、test:integration は runner の検査で通過した。lint:ts と typecheck は、変更が対象パスに当たらないため非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-sample.md`: 承認と役割の段落、冒頭の ID の区別と完成例の断り書き、「いつ」の言い直し、表と重なるシステムの責務の箇条、「発生条件」で表と重なる段落、確認例の後の照合の段落を外した。「定義を利用できると判断する基準」は冒頭へ移した。仮置き ID（`cdsd-order-status`・`bps-sales-order-flow`・`bdd-sales-record`）の参照は、利用への影響・当面の扱い・正本が定まったときに見直す箇所を書いた `_UNDECIDED_` の段落 1 つにまとめた。`schema:sales-record` への参照は外し、委ね先をデータモデル `bdd-sales-record` だけにした。発生の単位、発生時点、主体、成立条件 1〜4、場面ごとの発生有無と回数、事実データの項目と必要になる条件は変えていない。

## 3. 申し送り

- finding の F002 と F004 は、委ね先を仮置きを含む ID で示したので解消したと判断した。
- F001・F003・F005 は確定担当・判断時期・引き渡し前に確定が要るかを求めている。この情報は plan が sample から外すよう指示している担当・追跡先の記述に当たる。そのため sample には影響と当面の扱いだけを書いた。これらの finding は未解消として扱う。再評価で同じ指摘が出た場合は、grade の観点の調整が必要になる可能性がある。
- `bes-template.md` の変更案は次のとおり。 (1) 「何が起きたか」にある、承認する人間・判断時期・承認条件・記録先を求める `_TODO_` を削除する。 (2) 「発生条件」の未決事項の `_TODO_` を「内容、利用への影響、当面の扱い、確定時に見直す箇所」に改め、決定者・確認担当・判断時期・記録先を外す。この変更は commit の対象外のため行っていない。
- 文字数（空白・改行と表の区切り行を除く）: 前 3,003 字、後 2,100 字（69.9%）。
- 外した記述: 「何が起きたか」の末尾にあった承認と役割の段落（PO の承認、開発担当の説明、BA の照合、制限事項の承認と記録）。冒頭の ID の区別と完成例の断り書き。「いつ」の言い直し。「誰が／何が」で表と重なるシステムの責務の箇条。「発生条件」で表と重なる段落。確認例の後の照合の段落。もともと検証の表・未決事項の表はなかった。
- 移した記述: 「定義を利用できると判断する基準」を、rulebook が導入に求めているため冒頭へ移した。仮置き ID（`cdsd-order-status`・`bps-sales-order-flow`・`bdd-sales-record`）の参照は、利用への影響・当面の扱い・正本が定まったときに見直す箇所を書いた `_UNDECIDED_` の段落 1 つにまとめた。`schema:sales-record` への参照は外し、委ね先をデータモデル `bdd-sales-record` だけにした。
- 結論（発生の単位、発生時点、主体、成立条件 1〜4、場面ごとの発生有無と回数、事実データの項目と必要になる条件）は変えていない。
- finding: F002・F004 は委ね先を ID（仮置きを含む）で示したので解消したと判断する。F001・F003・F005 は確定担当・判断時期・引き渡し前に確定が要るかを求めている。この情報は plan が sample から外すよう指示している担当・追跡先の記述に当たり、rulebook の「共通の運用」でドキュメントメタ情報標準と登録簿へ回しているため、sample には影響と当面の扱いだけを書いた。再評価で同じ指摘が出た場合は、grade の観点を調整する必要があるかもしれない。
- template への変更案（commit 対象外のため変更していない）: `docs/ja/specdojo/templates/bes-template.md` の「何が起きたか」にある、承認する人間・判断時期・承認条件・記録先を求める `_TODO_` を削除する。「発生条件」の未決事項の `_TODO_` を「内容、利用への影響、当面の扱い、確定時に見直す箇所」に改め、決定者・確認担当・判断時期・記録先を外す。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bes-sample.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sld の試行と改訂済みの `sld-sample.md` を手本に、sample-maintenance として、役割・承認の段落と同じ判断の言い直しを外した。同じ判断は 1 か所を正として他は参照に置き換え、結論は維持した。利用できると判断する基準は rulebook が導入に求めているため冒頭へ移した。仮置き ID の扱いは `_UNDECIDED_` の段落 1 つに集約した。rulebook と矛盾する箇所はなく、構造と必須項目は rulebook を正として維持した。F001・F003・F005 の確定担当・判断時期は、運用の記述を sample から外す方針と衝突するため見送った。次のアクションは、再評価で同じ指摘が出た場合に grade の観点を見直すことである。
