---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-backup-restore-sample-120-20261125t065214z-1e503a62
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-backup-restore-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-backup-restore-sample-120/T-KATA-REVIEW-ALL-opr-backup-restore-sample-120-20261125T065214Z-1e503a62/plan.md
  started_at: "2026-11-25T06:52:24.230Z"
  completed_at: "2026-11-25T07:07:17.492Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-backup-restore-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として、`opr-backup-restore-sample.md` に構成の直しを 3 件入れた。内容は、演習の前の確認を 6.3 演習へ移したこと、証跡の保管期間の扱いを概要の未決事項の表へまとめたこと、11 章で表と重なる 1 文を削ったことである。
- 章の順と見出しの数は `opr-template` の 1〜12 章どおりで、章を移す・分ける・まとめる直しは不要だった。
- plan の編集対象は `opr-sample.md` と解決されていた。ただし executor は、タスク ID・根拠となる成果物・過去の同種タスクに合わせて `opr-backup-restore-sample.md` を編集し、`opr-sample.md` は変更していない。
- 指摘の一覧（No・段・箇所・指摘・直した案・根拠・印）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 2. 手順適用範囲・前提 → 6.3. 演習 | 演習の前に検証用の環境を上書きする旨の段落が、演習だけに関わる実施条件なのに前提の章に置かれ、演習の手順から離れていた | 段落を 6.3 演習の冒頭（概要の文の後、判定基準の表の前）へ移した。2 章に残して 6.3 から参照する案は選ばなかった | `vp-arc-document-structure` | 要判断 | | R2-2 | R2 | 1. 概要・11. 証跡 | 保管期間が決まるまでの扱いが、バックアップ分は概要の未決事項の表、証跡分は 11 章の本文と 2 か所に分かれていた | 概要の表の行を「バックアップと証跡の保管期間」「バックアップの世代と本書の証跡を消さずに残す」に直した。11 章の本文は概要の表に従う旨だけにした | `vp-qe-omissions-consistency`、`vp-arc-document-structure`。grade F002 の案にも当たる | - | | R2-3 | R2 | 11. 証跡 | 表の前の文が表の参照権限の列と二重になっていた。復元演習の記録の参照権限は `opr-index` の月次点検の記録と違い、表と本文が食い違って読めた | 表の前の文を「次の表は、本書の手順の証跡をどこに残し、どの識別子で照合するかを示す。」だけにした | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - | | R2-4 | R2 | 全体 | 章の順と見出しの数は `opr-template` の 1〜12 章どおりで、6 章も確認・リストア・演習の順に不合格時の判断（6.4）が続く | 章の移動・分割・統合は不要 | `vp-arc-document-structure` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: 構成の直しを 3 点入れた。(1) 演習の前に検証用の環境を上書きする旨の段落を、2 章から 6.3 演習の冒頭へ移した。(2) 概要の未決事項の表の行を「バックアップと証跡の保管期間」に直し、11 章の本文は概要の表に従う旨だけにして、保管期間の扱いを 1 か所にまとめた。(3) 11 章の表の前の文を、参照権限の列と重なる部分を削って 1 文にした。差分は 6 行追加・6 行削除。

## 3. 申し送り

- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata guide の「kata の観点の組」がこのレビューで使わない観点としているため、R2 では扱っていない。
- F002（`vp-qe-verifiability`）は R4 の観点で、構成に関わる部分だけを R2-2 で直した。仮の保管期間を置くかどうかは R4 で判断する。
- F003（`vp-qe-kata-conformance`）は、12 章で `opr-incident` が「予定」のまま `opr-incident-sample` は作成済みという件で、R5 で扱う。
- 検証: `npx prettier --check` は通った。`npx markdownlint-cli2` は `package.json` に依存がないため runner が適用外と判定している。`npm run lint:md:changed` と `npm run lint:fm:changed` は親 runner が実行し、どちらも通った。
- 要判断（実行範囲）: plan の編集対象は rulebook の sample 宣言から docs/ja/specdojo/samples/opr-sample.md と解決されている。一方でタスク ID・根拠となる成果物・kata guide の「直すのは対象の kata だけ」は opr-backup-restore-sample.md を指している。過去の T-KATA-REVIEW-ALL-opr-backup-restore-sample-110 も opr-backup-restore-sample.md を直していたので、こちらを編集し、opr-sample.md は変えていない。編集対象の解決の仕方を見直すかどうかは人が決める。
- R2-1: R2 / 2. 手順適用範囲・前提 → 6.3. 演習 / 表の後の段落「演習で検証用の環境を上書きするため、OPS は演習の前に…」が、演習だけに関わる実施条件なのに前提の章に置かれ、演習の手順から離れていた / 段落を 6.3 演習の冒頭（演習の概要の文の後、判定基準の表の前）へ移した / vp-arc-document-structure（前提→手順の順で、実施条件を該当する手順の直前に置く）。選ばなかった案: 2 章に残して 6.3 から参照する / 要判断（検証用の環境の取り合いを文書全体の前提とみる読み方もありうるため）
- R2-2: R2 / 1. 概要・11. 証跡 / 保管期間が決まるまでの扱いが、バックアップの分は概要の未決事項の表、証跡の分は 11 章の本文と 2 か所に分かれていた / 概要の表の行を「バックアップと証跡の保管期間」「バックアップの世代と本書の証跡を消さずに残す」に直し、11 章の本文は「未決の保管期間の扱いは、概要の未決事項の表に従う」とした（opr-sample の書き方と同じ） / vp-qe-omissions-consistency、vp-arc-document-structure（未決の扱いを 1 つの表にまとめる）。grade F002 の「概要の未決事項の表に保管期間の行を足す」案にも当たる / -
- R2-3: R2 / 11. 証跡 / 表の前の文「参照権限は opr-index の証跡の表に従う」が表の参照権限の列と二重になっていた。復元演習の記録の参照権限（OPS、DEV、PO）は opr-index の月次点検の記録（OPS、PO）と違い、表と本文が食い違って読めた / 表の前の文を「次の表は、本書の手順の証跡をどこに残し、どの識別子で照合するかを示す。」だけにした / vp-arc-document-structure（表と本文の分担）、vp-qe-omissions-consistency / -
- R2-4: R2 / 全体 / 章の順番と見出しの数は opr-template の 1〜12 章どおりで、6 章も template の確認・リストア・演習の順に、不合格時の判断（6.4）が続く。章を移す・分ける・まとめる必要はない / - / vp-arc-document-structure / -
- R2-5: R2 / grade の finding の扱い / F001（vp-po-decision-readiness）と F004（vp-ops-release-readiness）は、kata guide の「kata の観点の組」がこのレビューで使わない観点としているので扱っていない。F002（vp-qe-verifiability）は R4 の観点で、構成に関わる部分だけを R2-2 で直した。仮の保管期間を置くかは R4 で判断する。F003（vp-qe-kata-conformance。12 章で opr-incident が「予定」のまま、opr-incident-sample は作成済み）は R5 で扱う / - / kata-guide「kata の観点の組」 / -
- 適用外の検証（runner の判定）: `npx markdownlint-cli2 docs/ja/specdojo/samples/opr-backup-restore-sample.md`（package.json の dependencies / devDependencies に 'markdownlint-cli2' がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、対象 sample を `opr-template` の章構成と照合した。章の順は template どおりだったため、表と本文の分担と未決事項の置き場所に絞って直した。根拠は `vp-arc-document-structure` と `vp-qe-omissions-consistency` である。`opr-sample` の未決の書き方に揃えた。grade の finding のうち F001・F004 は R2 の観点外として見送り、F002 は構成に関わる部分だけを直し、F003 は R5 に回した。rulebook など sample 以外は変更していない。
