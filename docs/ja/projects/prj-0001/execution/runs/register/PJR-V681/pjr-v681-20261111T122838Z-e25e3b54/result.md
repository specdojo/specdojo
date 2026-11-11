---
specdojo:
  id: prj-0001:xer-pjr-v681-20261111t122838z-e25e3b54
  type: exec-result
  task_id: PJR-V681
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V681/pjr-v681-20261111T122838Z-e25e3b54/plan.md
  started_at: "2026-11-11T12:28:43.803Z"
  completed_at: "2026-11-11T12:42:44.336Z"
  agent: sol-executor
  approach: fully-guided
  targets:
    - prj-0001:bes-task-ready-selected
---

# Edit Result

## 1. 実施内容

- イベント仕様の適用範囲の重複を `1.1` 節へ統合し、整理を行いました。
- 並列選択の件数について、発生時点での「確定時点までの累計」として観測する規則を明文化し、具体的な観測例（発生時点で観測可能なら 1, 2 とし、観測不能な場合は省略する）を追記することで、`F003` および `F008` の指摘に対応しました。
- 業務の適用範囲に関する前提として、`schedule` 系を対象に含めることを `_ASSUMPTION_` として明示し、`F006` の指摘に対応しました。
- その他の `grade` 指摘（`F001`, `F002`, `F004`, `F005`, `F007`, `F009`, `F010`, `F011`）については、参照範囲外の事項や未決定事項として `_UNDECIDED_` または `_ASSUMPTION_` を用いて論点を残しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`: イベント仕様の適用範囲の重複を整理して統合し、並列選択の件数に関する観測規則の追記、および業務適用範囲の前提（`_ASSUMPTION_`）の追加を行いました。

## 3. 申し送り

- reporter は個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-v681-bes-task-ready-selected-refine-grade.md` の `5.1`〜`5.3` 節を result の「進め方と実践の型の適用」へ転記すること。rulebook は必須要件・禁止事項、recipe は発生単位と観測時点、sample は前提の記載形式に使用した。対象成果物、`cdfd-overview.md`、`stsd-task-execution.md`、`prj-overview.md`、共通規約を実読した。template と未宣言の文書・実装は参照していない。
- F002・F004・F005・F007 は未解消。実行記録モデルと対応 schema は宣言された参照範囲に含まれず、正本上の相関項目の有無を確認できないため `_UNDECIDED_` を維持した。ARC が `prj-0001:bdd-exec-event`・`prj-0001:bdd-exec-state` と対応 schema の所在・利用可否を確認し、参照範囲へ宣言して照合する必要がある。実行 ID による代用や新規項目の追加は断定していない。
- F003・F008 は既存の「発生時点で観測可能な範囲」と rulebook を根拠に、当該対象を含む確定時点の累計として明確化した。A, 次に B の確定では観測可能なら 1, 2 とし、観測不能時は省略する。最終件数で過去の値を補完・更新しない。累計と省略条件の正本上の表現は相関項目と併せて照合すること。
- F006 は `schedule` 系を記述上の前提として `_ASSUMPTION_` に明示した。3 系統への適用と担当割当は人間の PO が確定の段で判断する。F001 の PO 識別、F009・F010 の未作成 `bes-index` との双方向接続は未解消。F011 の業務範囲の前提は追加完了条件に従って残しており、全目印を解消済みとは扱わない。対象成果物は `status: draft` を維持した。
- 変更は対象 BES と個票の対応結果のみ。適用範囲の重複を `1.1` 節へ統合し、件数の未決記述を観測規則に置き換えた。型・他成果物・カタログ・`CHANGELOG.md`・result・grade サイドカーは変更していない。個票 `5.4` 節の「CHANGELOG に書く事項」は「なし」。
- 指定の Markdown lint・frontmatter lint・schema 検証等は親 runner に委譲した。統合後の grade 再実行と pass の確認は orchestrator が行うこと。登録簿生成は `npx tsx` が IPC の `EPERM` で起動できなかったため、共通規約の `node --import tsx` に切り替えて成功した。
- reporter は個票 docs/ja/projects/prj-0001/controls/project-register/pjr-v681-bes-task-ready-selected-refine-grade.md の 5.1〜5.3 節を result の「進め方と実践の型の適用」へ転記すること。rulebook は必須要件・禁止事項、recipe は発生単位と観測時点、sample は前提の記載形式に使用した。対象成果物、cdfd-overview、stsd-task-execution、prj-overview、共通規約を実読した。template と未宣言の文書・実装は参照していない。
- F003・F008 は既存の「発生時点で観測可能な範囲」と rulebook を根拠に、当該対象を含む確定時点の累計として明確化した。A、次に B の確定では観測可能なら 1、2 とし、観測不能時は省略する。最終件数で過去の値を補完・更新しない。累計と省略条件の正本上の表現は相関項目と併せて照合すること。
- F006 は schedule 系を記述上の前提として `_ASSUMPTION_` に明示した。3 系統への適用と担当割当は人間の PO が確定の段で判断する。F001 の PO 識別、F009・F010 の未作成 `bes-index` との双方向接続は未解消。F011 の業務範囲の前提は追加完了条件に従って残しており、全目印を解消済みとは扱わない。対象成果物は `status: draft` を維持した。
- 変更は対象 BES と個票の対応結果のみ。適用範囲の重複を 1.1 節へ統合し、件数の未決記述を観測規則に置き換えた。型・他成果物・カタログ・CHANGELOG.md・result・grade サイドカーは変更していない。個票 5.4 節の「CHANGELOG に書く事項」は「なし」。
- 指定の Markdown lint・frontmatter lint・schema 検証等は親 runner に委譲した。統合後の grade 再実行と pass の確認は orchestrator が行うこと。登録簿生成は `npx tsx` が IPC の EPERM で起動できなかったため、共通規約の `node --import tsx` に切り替えて成功した。

## 4. 進め方と実践の型の適用

既存の課題（`F002`〜`F011`）を解決するため、並列処理における件数カウントの観測規則を具体化し、業務範囲の適用に関する前提条件を `_ASSUMPTION_` として記述しました。また、重複していた記述を統合して整理しました。
