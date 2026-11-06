---
specdojo:
  id: prj-0001:pjr-er6j-stsd-task-execution-review-retrofit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-06T11:15:32Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
    - PJR-16T7
    - PJR-8TMF
    - PJR-0QJS
    - PJR-93NK
    - PJR-FS9A
  approach: retrofit
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-ER6J stsd-task-execution をレビューの指摘と新しい Kata に合わせる

## 1. 概要

stsd-task-execution を新しい Kata に合わせ、目的・着手と再開・完了の条件・検討メモをレビューの決定どおりに直す

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）
- 利用者のレビュー: 着手と再開は、agent が違えば別のロールや別のアクターになるため、ロールやアクターを照合しない実装を正とする。完了は、自動の実行では runner が検証と統合の成功後にだけ complete を記録するため、実装を正とする。bdd-exec-state・bdd-exec-event はこれから作るため、未作成のまま確定してよい（2026-11-06 indie が決定）

## 3. 完了条件

- [[prj-0001:stsd-task-execution]] が、PJR-S8EF〜PJR-93NK で直した Kata（[[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]）の必須の章・表・図の規則を満たしている。目的は状態が何を管理し何のために使われるかを書き、文書の読み手や使い方を書いていない。状態の正本と判定の規則は「状態の判定」の章にある。
- 「現行実装（AS-IS）」などのスコープの表記を、TO-BE の文書と並ばない限り書いていない。
- 図の遷移ラベルが `T-<nn> イベント / 条件` で、分けた図ごとにすぐ下へその図の遷移の表がある。図の全遷移が、その図の下の表へ一度ずつ対応している。
- 状態と遷移の中身は、カタログの `evidence_refs` の実装で確かめられる。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` か今後の検討メモで残す。
- 目的が、入力の決定に沿い、タスク実行の状態がスケジュール帳票のタスクの段階（着手前・実行中・中断中・完了・中止）を管理し、人と AI Agent が次に着手できるタスクの選択、止まった作業の引き継ぎ、後続へ進めるかの判断に使う、という内容になっている。
- 適用範囲の対象をスケジュール帳票のタスクに絞るか、プロジェクト登録簿の項目の状態は [[stsd-register-entry]] の側で扱うと 1 文で書いている（`exec run --register` の状態は登録簿の遷移で追うため）。
- 着手（今の `T-03`）の条件が、ロールが違っても着手できる実装に合っている。再開（今の `T-05`）の条件が、中断したアクターと別のアクターでも再開できる実装に合っている。
- 完了（今の `T-08`）の条件が「担当アクターが完了を報告する」で、補足に、自動の実行では runner が executor の成功・result の確認・親の検証と統合の成功の後にだけ記録し、失敗時は中断になると書いている。
- 今後の検討メモの 4 件（bdd の未作成、ロールの一致、再開のアクター、完了の条件）を消し、未決が残らないため章も消している。根拠の `based_on`（`bdd-exec-state`・`bdd-exec-event`）は未作成のまま残している。
- 遷移 ID は [[specdojo:stsd-rulebook]] の規則どおり振り直さない。欠番はそのまま残し、図のラベルと遷移表で同じ ID を使う。
- `stsd-task-execution` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                                               | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 新しい Kata の章立てに合わせる                                     | BA   | open | -    |
| 2   | 目的・適用範囲・着手と再開と完了の条件をレビューの決定どおりに直す | BA   | open | -    |
| 3   | 検討メモを消す                                                     | BA   | open | -    |
| 4   | 検査を通す                                                         | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:stsd-task-execution]]: retrofit の対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: そろえる先
