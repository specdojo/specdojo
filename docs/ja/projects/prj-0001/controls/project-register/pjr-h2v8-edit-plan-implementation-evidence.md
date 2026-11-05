---
specdojo:
  id: prj-0001:pjr-h2v8-edit-plan-implementation-evidence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-05T03:42:21Z"
  derived_from:
    - PJR-Q9AW
    - PJR-3APD
---

# PJR-H2V8 書き足す edit の plan で実装の根拠を読めるようにし、未作成の依存で止めない

## 1. 概要

draft・fully-guided・recipe-guided の plan に、カタログの evidence_refs を読み取り専用の実装の根拠として載せる。まだない depends_on の成果物は未作成と示し、異常終了の理由にしない

## 2. 入力

- stsd の試行で、fully-guided の executor が、まだない依存の成果物（bdd-exec-state・bdd-exec-event）を「依存未解決」とみなして止まった。同じ「依存未解決」の条件を持つ draft の executor は止まらず、解釈が executor によって分かれた（PJR-Q9AW、2026-11-05）
- fully-guided の plan が読んでよい資料に実装（src/）は含まれず、カタログの `evidence_refs` を plan に載せるのは retrofit だけ（plans-generation.ts の `_IMPLEMENTATION_EVIDENCE_`）。業務仕様は現行の実装をもとに書く方針（2026-11-04）と合わない
- 利用者は案 B（`evidence_refs` を読める資料に加え、未作成の依存は仮置きにして止まらない）を選んだ（2026-11-05）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
