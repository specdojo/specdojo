---
specdojo:
  id: prj-0001:pjr-kfmb-stsd-task-execution-opening
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
  registered_at: "2026-11-05T13:05:55Z"
  completed_at: "2026-11-05T17:58:34Z"
  conclusion: stsd-task-execution の冒頭を頭書き・目的・適用範囲へ、図の表示名を 状態名`<br>`値 へ合わせた
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-SWRE
    - PJR-P9SW
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-KFMB stsd-task-execution の冒頭と図の表示名を新しい Kata に合わせる

## 1. 概要

stsd-task-execution の「概要」を頭書き・目的・適用範囲に分け、状態遷移図の表示名を状態名と値の 2 行にする。内容は変えない

## 2. 入力

- PJR-VNT1 の決定に合わせて手入れした stsd の Kata（PJR-F1FD・PJR-NEPD・PJR-YSST・PJR-SWRE・PJR-P9SW）に合わせる。状態・遷移・条件などの中身は schedule の磨き込み・condense・review を通った内容を保つ

## 3. 完了条件

- [[stsd-task-execution]] の冒頭が、H1 直下の 1〜2 行の頭書き、「1. 目的」「2. 適用範囲」になっている。これまでの「概要」の内容は、意味を変えずに目的か適用範囲へ移している（落とさない、足さない）。
- 状態遷移図の表示名が、値がある状態は`状態名<br>値`、値が `-` の状態は状態名だけになっている。2 行目の値は状態一覧の値と一致する。分割図で共有する状態は同じ表示名である。
- 状態・遷移・遷移 ID・条件の数と中身は変えていない（schedule の磨き込み・condense・review を通った内容を保つ）。章番号が変わったことによる本文中の章の参照は、章のタイトルで直している。
- `stsd-task-execution` 以外の成果物と Kata は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ |
| --- | ------------------------------------ | ---- | ---- | ---- |
| 1   | 冒頭を頭書き・目的・適用範囲に分ける | BA   | open | -    |
| 2   | 図の表示名を直し、検査を通す         | BA   | open | -    |

## 5. 対応結果

- 実施内容: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] の冒頭を頭書き・目的・適用範囲へ再構成し、両図の表示名を状態一覧の状態名と値の 2 行にした。概要の記述、状態 6 件、遷移 16 件、遷移 ID、条件は保持した。本文に章番号による参照はなかった。
- 検証: 対象文書と本個票を Prettier で整形し、内容保持の照合と差分の空白検査に合格。カタログ検査は未作成文書に関する警告付きで終了コード 0、履歴リンク検査も終了コード 0。Markdown・frontmatter・Mermaid の全体検査は pipeline の親 runner が実行する。
- 実践の型: 指定の主 rulebook を章構成、Mermaid rulebook を表示名の基準とし、recipe で目的・範囲の配置、sample で既存にない頭書きの形式を確認した。業務内容の転記、既存内容の削除・統合、Kata の変更は行っていない。プロジェクト概要にある記録による分担・継承の意図は、既存の利用目的を保持して整合させた。template と未宣言の資料は参照していない。
- F001: AS-IS の宣言と `T-03`・`T-05` の業務要件の差は残る。内容保持条件と、未作成の `bdd-exec-state`・`bdd-exec-event` による承認根拠の不足から、今回は受入基準を新設しない。BA・PO が観測動作と要求の位置づけ、受入を支配する規則を合意する必要がある。
- F002・F004・F008: `src/exec/events.ts` の `foldEventsToState` は `note`・`link`・`estimate` を含む全イベントで `last_by` を更新し、`canCompleteTask`・`canBlockTask`・`canReleaseTask` はその値と要求者を比較する。A の着手後に B が補足記録を加えると B が権限判定の対象になる。承認のない実装への追従や権限条件の変更は行わず、BA・PO・ARC が担当者の確立・保持・移転、再開、人間の強制操作、補足記録時の扱いを合意してから別途反映する。
- F005・F007: 上記の影響は `T-05` に加えて `T-04`・`T-06`・`T-07`・`T-08`・`T-16`・`T-17`、再生時のメタデータ、完了・中断・解放の判定に及ぶ。他者による補足記録を含む既存履歴の権限が変わる互換性も判断が必要。`DC-001`・`DC-003`・`DC-005` に対する受入差分は未解消として後続の合意へ申し送る。これら DC の定義は宣言された資料では確認できず、推測による具体化は行っていない。
- F003・F009: 同時刻再生の根拠は `src/exec/events.ts` の `readAllEventFiles`・`orderSameTimestampEventsByState`・`isTransitionValidForState`、着手・再開・完了判定の根拠は同ファイルの `canClaimTask`・`canUnblockTask`・`canCompleteTask`。型別優先順、パスによる同順位判定、有効候補の先頭選択と候補なし時の先頭選択を確認した。本文の内容保持条件から追記は見送り、後続で根拠への導線と同時刻順序の契約を補う。
- F006: 検証手順の本文追記は内容保持条件により見送った。後続で `exec validate`、`tests/src/exec/events.test.ts`、文書の静的検査の対象と期待結果を明示する。テストファイルは宣言された読み取り範囲に含まれないため参照しておらず、個別ケースの充足は断定しない。
- F010: 本文の PO 展開名は既存のまま保持した。plan の指摘では Project Owner とされているが、`pm-roles.yaml` は宣言された参照範囲に含まれないため独自に読んで変更せず、後続で参照を宣言したうえで名称を確認・統一する。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 手入れした Kata（PJR-VNT1）
