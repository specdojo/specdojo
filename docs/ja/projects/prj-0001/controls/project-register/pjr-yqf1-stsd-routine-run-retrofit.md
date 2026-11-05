---
specdojo:
  id: prj-0001:pjr-yqf1-stsd-routine-run-retrofit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T11:24:58Z"
  completed_at: "2026-11-05T12:10:02Z"
  conclusion: 部分反映。5 章と T-01〜T-08 を保ち、partial・結果の集約・再実行の経路と T-09〜T-11 を実装に合わせた
  derived_from:
    - PJR-3APD
    - PJR-PT5N
  depends_on:
    - PJR-PT5N
  approach: retrofit
  targets:
    - prj-0001:stsd-routine-run
---

# PJR-YQF1 stsd-routine-run を確定した Kata と実装に合わせる（retrofit）

## 1. 概要

3APD の段 8。ステータス定義（定期処理の実行結果）を、確定した stsd の Kata と現行の実装（カタログの evidence_refs）に合わせて retrofit する。成果物は既にある

## 2. 入力

- Kata は PJR-PT5N で確定した。代表の 1 件 stsd-task-execution（PJR-Q9AW・PJR-MC63）を書き方の参考にできるが、宣言された資料ではないため、根拠には実装とカタログを使う
- 図の分割は stsd-mermaid-rulebook の閾値を超える場合だけ行い、閾値以下の図は 1 つのままにする（PJR-PT5N）

## 3. 完了条件

- [[stsd-routine-run]] が、[[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]] の必須の章・表・図の規則を満たしている（終了点を置くか置かないかと、置かない場合の「概要」の書き方を含む）。
- 状態一覧の状態と遷移の説明の各行が、カタログの `evidence_refs` の実装で確かめられる。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` か今後の検討メモで残す。既存の記述と実装が食い違う場合は、どちらに合わせたかと理由を result に書く。
- 図の分割は、図の rulebook の閾値を超える場合だけ行っている。
- 遷移 ID を振り直していない（既存の文書の場合）。
- `stsd-routine-run` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに result の申し送りに書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 実装と既存の記述を照らし、維持・部分反映・作り直し・新設を決める | BA   | open | -    |
| 2   | 文書を直し、検査を通す                                           | BA   | open | -    |

## 5. 対応結果

- 判断: 部分反映。対象成果物の5章構成と既存の遷移 ID `T-01`〜`T-08` を保持し、`partial`、結果集約、試行中の明示記録、再実行経路を更新した。実装・Kata・他の業務成果物は変更していない。
- 根拠: `src/routine/routine.ts` の `recordRoutineStart`・`recordRoutineCompletion`・`spawnSelf`・`aggregateRoutineActionResults`・実行ループと、`src/routine/definition.ts` の結果型・due 判定を照合した。開始時の `running` 記録と、失敗・部分完了・スキップ・成功の優先順はカタログの対象範囲とも一致する。既存の「試行中に前回結果が残る」という記述は現在動作に合わせた。
- 反映: `T-09`〜`T-11` を追加し、状態一覧・図・遷移表を対応させた。cron の `missed_run: skip` と探索制約、終了点を置かない理由も補った。試行中の入出力遷移が分割閾値を超えるため二図を維持した。
- 申し送り: 例外後の復旧、`policy.overlap: skip` の扱い、古い lock の取得し直し、旧記録・欠損記録の復旧は未決事項として保持した。実装修正を伴う場合は、PO・PM・ARC・QE の判断後に別タスクとする。業務データ辞書 `bdd-routine-definition` は未作成で照合できず、作成後に用語・境界と `based_on` を確認する。委譲先内部のスキップ理由・成果物生成有無は指定エビデンスから確定できないため断定を外した。
- 検証: executor で Prettier 整形・整形確認、差分確認、カタログ検証、履歴リンク検証を実施し、すべて成功した。カタログには未作成文書の警告がある。`lint:md`・`lint:fm`・`lint:mermaid` 等の親検証は runner に委ね、結果は reporter が result に記録する。

## 6. 関連ドキュメント

- `stsd-routine-run`: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 確定した Kata（PJR-PT5N）
