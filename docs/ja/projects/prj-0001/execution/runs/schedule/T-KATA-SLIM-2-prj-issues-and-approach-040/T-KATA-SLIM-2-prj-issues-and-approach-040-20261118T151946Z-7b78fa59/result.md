---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-issues-and-approach-040-20261118t151946z-7b78fa59
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-issues-and-approach-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-issues-and-approach-040/T-KATA-SLIM-2-prj-issues-and-approach-040-20261118T151946Z-7b78fa59/plan.md
  started_at: "2026-11-18T15:19:56.936Z"
  completed_at: "2026-11-18T15:50:52.108Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-issues-and-approach
    - specdojo:prj-issues-and-approach-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md` から、共通の運用に関する記述（役割、ステータス管理、承認・改訂手順、品質検査、未決事項の台帳管理等）を削除し、ドキュメントメタ情報標準およびメンバー定義への参照に置き換えました。
- finding F001 に基づき、課題一覧の必須記載項目を「課題・影響・優先度」に統一しました。
- finding F002 に基づき、導入部に目的、承認者、利用ロールごとの利用目的、合意対象・非合意対象の記述を必須要件として追加し、記述ガイドに導入部の節を設けました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`: 共通運用記述の削除と参照化、finding F001・F002 の反映、および不要な用語定義の削除に伴う章名変更（第 2 章）を実施しました。

## 3. 申し送り

- 大きさ: 空白と表の区切り行を除く文字数で 4,992 字から 3,819 字（76.5%）。区切り行を含めると 5,511 字から 4,243 字（77.0%）。
- rulebook の章名の変更: 第 2 章を「位置づけと用語定義」から「位置づけ」に変えた。用語の表が本文構成と記述ガイドの言い直しで、rulebook 作成標準の用語定義を省く条件に当たるため。成果物の章名と必須・任意の区分は変えていない。
- F001 の対応: 課題一覧の要件を「各課題に課題・影響・優先度を記載する」に統一した。
- F002 の対応: 本文構成に「導入部（H1 直下）」の必須行（目的、承認者と利用ロールごとの利用目的、合意対象と合意対象外）を足し、記述ガイドに導入部の節を加えた。recipe「全体の作成手順」の 1 と template の導入部の `_TODO_` と対応する。
- 本文構成の表が空行で分断されて表として成立していなかったため、1 つの表に組み直した。
- 変更案（recipe）: 「見直しと変更管理」の書き方にある「記録先と、監視・取りまとめ・最終判断のロールを示す」を外し、記録は共通の運用（ドキュメントメタ情報標準）に従う形にする。「全体の作成手順」の 1 のロール例（PO・BA・ARC・PM）は、適用先のメンバー定義に従う書き方にするかを検討する。
- 変更案（template）: 7 章の `_TODO_` にある「記録先と責任ロールを添える」を外す。
- 判断の保留: 次の検討事項（ToDo）の表の「責任ロール」の列は残した。展開の一覧の「未決事項の表の担当の列」に近いが、template・sample・既存の成果物がこの列を持ち、今回は rulebook しか直せないため。外すかどうかは recipe・template・sample の段で判断する。
- 共通の正本（ドキュメントメタ情報標準）への追記は不要と判断した。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、個票・plan・result などの履歴蓄積ファイルを変更していない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T15:21:49.901Z に再開

## 4. 進め方と実践の型の適用

共通運用記述を削除し、`docs/ja/specdojo/standards/document-metadata-standard.md` 等の正本へ参照を向けさせるとともに、抽出された finding (F001, F002) を反映して rulebook の整合性と簡潔性を向上させました。
