---
specdojo:
  id: prj-0001:xer-t-data-flow-uc-rewrite-cdfd-uc-routine-020
  type: exec-result
  task_id: T-DATA-FLOW-UC-REWRITE-cdfd-uc-routine-020
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-UC-REWRITE-cdfd-uc-routine-020-plan.md
  started_at: "2026-11-03T10:36:19.021Z"
  completed_at: "2026-11-03T10:52:49.555Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - cdfd-uc-routine
---

# Edit Result

## 1. 実施内容

- `cdfd-uc-routine.md` を `cdfd-uc-rulebook`、`cdfd-uc-recipe`、`cdfd-uc-sample` に基づいて磨き込みました。
- 目的を plan 指定の routine 系向け定義文に差し替え、`cdfd-overview` の凡例に合わせてノードの絵文字を統一しました。
- 共通プロセス領域（P-07・P-08・P-11）を 1 つの「実行サイクル」ノードとして集約し、図を 4 つに再構成して可視性を向上させました。
- 役割表において、個別の実行サイクル行を統合し、重複実行防止やスキップ等の判断条件を保持しつつ整理しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-uc-routine.md`: 目的文の差し替え、ノード絵文字の統一、実行サイクル（P-07/08/11）の 1 ノード化および役割表の統合、図の再構成（4 図への分割）を実施し、未決事項に実行サイクルの正本文書に関する `_UNDECIDED_` を追加しました。

## 3. 申し送り

- 図ごとの線とデータストアの数（非表示の配置制御線は除く）: 5.1 定期処理と Job の定義 = 線 8・データストア 4／5.2 サイクル到来から Job Run の計画まで = 線 8・データストア 7（実行サイクルの入出力 8）／5.3 系統への要求から結果の記録まで = 線 9・データストア 4（実行サイクルの入出力 9）／5.4 例外時の戻り = 線 4・データストア 0。いずれも分割の目安（一図 15 本超、一ノード 10 本以上）の範囲内。
- 画像の大きさは未計測: executor の sandbox で d2 の実行が許可されなかった。runner または人間が `d2 --layout elk` で 4 図を SVG に出力し、viewBox の幅・高さを result に記録する必要がある。
- 削除・統合の根拠: P-07・P-08・P-11 の 3 行の役割表を実行サイクル 1 行に統合し、各行の内容（重複実行防止、busy・利用制限・事前条件によるスキップ、Job 完了と委譲先完了の区別、一度だけの独立評価、人間の完了判断、権限外判断の禁止、人間の停止・再開）は保持した（rulebook の描き方の選択: 共通して通る領域は 1 ノード）。旧 5.3 の評価・完了の図（P-07→P-08→P-11 の内部の流れ）は実行サイクル内部のため削除し、評価結果・判断記録・完了記録への書き込みは 5.3 の実行サイクルの線に集約した。旧 5.4 の実行サイクル内部の戻り 3 本（評価不能・古い評価・未充足の完了条件）は内部の戻りのため削除し、外へ返す P-06・P-05 への戻り 4 本は残した。データストアの『成果物カタログ』行は実行サイクル内部の評価・完了だけで使うため削除し、Kata の利用は P-06 の定義の型に限定した。
- register 系・schedule 系のノードを actor から process に変更し、ラベルを全体概要と同じ『📒 register 系 P-02』『📅 schedule 系 P-03〜P-04・P-09〜P-10』にした（rulebook: 対象範囲内の担当を外部主体にしない）。P-05・P-06 の絵文字は全体概要で routine 系に割り当てられた ⏰ に、実行サイクルは ⚙️ にした。
- 3 文書の絵文字統一の申し送り: cdfd-uc-register / cdfd-uc-schedule は現時点でノード絵文字がなく、P-07・P-08・P-11 も個別ノードで描いている。3 文書をそろえるには、それぞれの磨き込みタスクで同じ割り当て（系統固有の領域はその系統の絵文字、実行サイクルは ⚙️ の 1 ノード）を適用する必要がある。
- 未決事項に『実行サイクルの内部を描く唯一の正本文書』の `_UNDECIDED_` を追加した（決定者 BA・ARC）。rulebook の完成判定では正本を 1 か所に定める必要があるが、全体概要は 1 ノードの図しか持たず、宣言された資料からは正本を決められないため。
- grade finding F001・F002（line 382 の `stsd-job-run` に関する `_TODO_` 行）は、作業開始時点の対象成果物（331 行）にすでに存在せず、未作成の `stsd-job-run`・`stsd-task-execution` はインラインコードで仮置き済みだった。再評価で解消を確認する。
- 参照した文書: cdfd-uc-rulebook、cdfd-uc-recipe、cdfd-uc-sample（形式のみ）、cdfd-overview。cdfd-mermaid-rulebook / cdfd-d2-rulebook は本文を読まず、凡例と既存の D2 記法を踏襲した。cdfd-uc-register / cdfd-uc-schedule は絵文字と実行サイクルの扱いの現状を確認する目的で grep のみ行い、内容は根拠にしていない。prj-overview は読んでいない。
- 未決事項に『実行サイクルの内部を描く唯一の正本文書』の `_UNDECIDED_` を追加した（決定者 BA・ARC）。rulebook の完成判定では正本を 1 か所に定める必要があるが、全体概要は 1 ノードの図しか持たず、宣言された資料からは正本を決められないため。
- grade finding F001・F002（line 382 の `stsd-job-run` に関する `_TODO_` 行）は、作業開始時点の対象成果物（331 行）にすでに存在せず、未作成の `stsd-job-run`・`stsd-task-execution` はインラインコードで仮置き済みだった。再評価で解消を確認する。
- 人の確認が必要: `d2 --layout elk tmp/d2/figN.d2 tmp/d2/figN.svg`（Image size measurement for the 4 figures needs d2 execution, which the sandbox denied; render with ELK and record viewBox sizes in the result）

## 4. 進め方と実践の型の適用

fully-guided
