---
specdojo:
  id: prj-0001:pjr-1tyg-queue-stop-after-failure-resume
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-25T21:58:24Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-32PN
---

# PJR-1TYG exec stop の前に失敗したタスクがあると、列が再開できない状態で終わる

## 1. 課題内容

exec stop で止めたループの段が、止める前に失敗したタスクがあると failed になり、列が completed_with_failures で終わる。同じ exec queue run で止めた段から再開できない。

## 2. 入力

- 2026-11-25 夜、kra-night2 と kra-night3 の列で観測（止める前に止まったタスクがあり、どちらも `completed_with_failures` で終わった）。
- PJR-32PN の完了条件「同じ exec queue run で止めた段から再開できる」は、失敗が無い場合は確かめ済み。

## 3. 影響範囲

| 観点         | 影響                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| スコープ     | 予約の列（`src/exec/queue.ts`）と、`exec stop` で止めたループの終わり方 |
| スケジュール | 止めた列を同じコマンドで再開できず、列を作り直す手間がかかる            |
| コスト       | 残りの段を新しい列に入れ直す手作業                                      |
| 品質         | 止めただけの列が失敗の列として記録される                                |
| 関係者       | DEV（実装）、オーケストレーター（列の運用）                             |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 列は `exec stop` 用の終了コードで終わった段だけを止めた段として扱う。止める前に失敗したタスクがあるとループが失敗の終了コードで終わり、段が failed になる |
| 対応策   | `exec stop` で止めたことを、失敗したタスクの有無に依らず列が見分けられるようにする                                                                        |
| 依存事項 | なし                                                                                                                                                      |
| 完了条件 | 「完了条件」の章のとおり                                                                                                                                  |

## 5. 完了条件

- `exec stop` で止めたループの段は、止める前に失敗したタスクがあっても止めた扱いにする。段を pending に戻し、列を `stopped` にする。
- 同じ `exec queue run` で、止めた段から再開できる。
- 止める前に止まったタスクは止まったまま残し、再開で勝手に流し直さない。
- 止めずに失敗だけがあった場合は、今と同じ扱い（`completed_with_failures`、`on_failure: stop` の段では `stopped`）のままにする。
- 単体テストで、上の 4 つを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/exec-defaults.yaml`・オーケストレーターの本文など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 6. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
