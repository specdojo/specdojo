---
specdojo:
  id: prj-0001:pjr-vysc-timeline-from-epics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T22:56:13Z"
  due_on: "2026-11-30"
  commit_type: docs
  commit_scope: register
---

# PJR-VYSC timeline を epic とその依存関係から作る形に変える

## 1. 背景

手書きの tml-index.yaml の track 計画をやめ、epic を全体計画の単位とし、epic の depends_on・状態・schedule の予定と実績から timeline を作る。tml-index.yaml の役割と、未着手の計画や古い track の扱いを決める

## 2. 入力

- tml-index.yaml には 22 の track があり、order・`parallel_group`・`depends_on` は「初期案。人が見直す」のまま更新されておらず、全体スケジュールの管理に使われていない（2026-11-04）
- epic は 1 つの track を担い、epic 同士は register の `depends_on` で順番を持てる。tml-index.yaml の track の `depends_on` と二重になっている。epic を起票するには先に tml-index.yaml に track を書く必要がある（2026-11-03 の data-flow-uc-rewrite でも手で足した）。timeline の期間はカタログの推定日数から計算し、schedule の予定や実績が反映されない（2026-11-04）
- 利用者の提案: epic を起票し、epic 間の依存関係を timeline として表示する（2026-11-04）
- 論点: (1) 未着手の計画の表し方（open の epic を先に起票するか）、(2) epic のない古い track（data-flow・data-flow-pdca など）の扱い、(3) tml-index.yaml に残す内容（起点の日付やカレンダーなどの設定だけにするか、生成物にするか）、(4) 未着手の epic の期間（推定日数の項目を足すか）、(5) 表示の場所と形（dashboard の timeline のガントなど）（2026-11-04）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
