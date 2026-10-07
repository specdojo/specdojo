---
specdojo:
  id: prj-0001:pjr-wpr3-exec-run-split-investigation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-10-02T12:14:16Z"
---

# PJR-WPR3 exec-run.ts の分割方針の調査と選択肢の比較

## 1. 概要

exec-run.ts の関数・依存・初回と再開の重複を調べ、モジュールの境界と状態遷移の選択肢と推奨案を exec-run.ts の分割方針の決定の個票へ書く。決定はしない（v0.3.0 の公開後）

## 2. 完了条件

- 調査と比較だけを行い、`src/` のコードは変更しない。決定は [[prj-0001:pjr-q761-exec-run-module-split]] で利用者が行う。
- `src/exec-run.ts`（2026-10-07 時点で 7,948 行、トップレベルの関数 114 個）の関数を、段階（準備・worktree・agent の起動・親検証・reporter・統合・再開・register の記帳・CLI の登録など）ごとに分類した一覧を作る。関数ごとに行数と、主に呼び出す側・呼ばれる側を示す。
- 段階の間の依存と、他のモジュール（`exec-worktree*.ts`・`exec-register*.ts`・`exec-parent-validation.ts`・`exec-reporter.ts` など）への依存を整理し、分割したときに循環依存が生じうる箇所を挙げる。
- 初回の実行と再開（executor・reporter・統合の各段からの再開）の経路で重複している処理を、関数名と行の範囲で具体的に挙げる。
- 現在の暗黙の状態（`pipeline-state.json` の各段の状態と register の状態）の遷移を表にし、初回と再開を 1 つの状態遷移にまとめる場合の形を示す。
- 選択肢を 3 つ以上比べる（例: 段階ごとのモジュールへの分割のみ、分割と明示的な状態遷移の導入、段階的な切り出しの順序づけ）。各選択肢について、利点・懸念・既存のテストへの影響・作業量・切り出しの順序を書く。
- 推奨案を 1 つ示し、最初に切り出す範囲と、振る舞いを変えていないことを確かめる方法（既存の unit / integration テスト、追加すべきテスト）を書く。
- 選択肢の比較を [[prj-0001:pjr-q761-exec-run-module-split]] の「検討した選択肢」に書き、決定内容と承認の欄は `_TODO_` のまま残す。関数の一覧などの詳しい調査結果は本個票の対応結果に書く。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                            |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 関数の分類・依存・重複・状態遷移を調べる | ARC  | open | コードは変更しない              |
| 2   | 選択肢を比べ、推奨案を書く               | ARC  | open | PJR-Q761 の「検討した選択肢」へ |
| 3   | 方針を決める                             | PO   | open | PJR-Q761 で利用者が決める       |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-q761-exec-run-module-split]]（分割方針の決定）
