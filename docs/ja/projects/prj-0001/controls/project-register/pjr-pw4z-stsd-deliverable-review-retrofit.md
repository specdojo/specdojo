---
specdojo:
  id: prj-0001:pjr-pw4z-stsd-deliverable-review-retrofit
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
  registered_at: "2026-11-06T11:16:56Z"
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
    - prj-0001:stsd-deliverable
---

# PJR-PW4Z stsd-deliverable を新しい Kata に合わせる

## 1. 概要

stsd-deliverable を新しい章立てと遷移 ID 入りのラベルに合わせる

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- [[prj-0001:stsd-deliverable]] が、PJR-S8EF〜PJR-93NK で直した Kata（[[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]）の必須の章・表・図の規則を満たしている。目的は状態が何を管理し何のために使われるかを書き、文書の読み手や使い方を書いていない。状態の正本と判定の規則は「状態の判定」の章にある。
- 「現行実装（AS-IS）」などのスコープの表記を、TO-BE の文書と並ばない限り書いていない。
- 図の遷移ラベルが `T-<nn> イベント / 条件` で、分けた図ごとにすぐ下へその図の遷移の表がある。図の全遷移が、その図の下の表へ一度ずつ対応している。
- 状態と遷移の中身は、カタログの `evidence_refs` の実装で確かめられる。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` か今後の検討メモで残す。
- 文書は確定前（`status: draft`）のため、PJR-FS9A で直した規則に従い、遷移 ID を図と表の順に `T-01` から欠番なく振り直している。図のラベルと遷移表で同じ ID を使い、旧 ID と新 ID の対応を個票の対応結果に書いている。
- 今後の検討メモの各項目を見直し、実装で決まったものは本文へ反映して消し、残すものは理由を個票の対応結果に書く。
- `stsd-deliverable` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 新しい Kata の章立てに合わせる | BA   | open | -    |
| 2   | 遷移ラベルと表を直す           | BA   | open | -    |
| 3   | 検討メモを見直す               | BA   | open | -    |
| 4   | 検査を通す                     | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:stsd-deliverable]]: retrofit の対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: そろえる先
- [[prj-0001:stsd-task-execution]]: レビューした代表の 1 件
