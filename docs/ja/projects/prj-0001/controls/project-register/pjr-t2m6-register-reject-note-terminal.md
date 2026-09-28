---
specdojo:
  id: prj-0001:pjr-t2m6-register-reject-note-terminal
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T15:26:55Z"
---

# PJR-T2M6 register close・reject・defer で note を拒否する

## 1. 概要

PJR-GDQC の回答（候補 A）を実装する。`pjr-rulebook` は `note` を終端させず `open` のまま追記すると定めているが、`register close` / `reject` / `defer` は type を区別しておらず（`src/register-item.ts` に `note` 固有の扱いがない）、`note` も終端させられる。

2026-09-29 時点で、`note` の個票は 6 件あり、すべて `open` である。終端させた `note` はないため、過去の記録の移行は不要である。

## 2. 完了条件

- `register close` / `reject` / `defer` は、type が `note` の項目を拒否し、終了コード 1 で終わる。エラーには、`note` は終端させないことと、対応や判断が必要なら `todo` / `question` / `decision` など別の type で起票することを示す。
- `note` 以外の type の終端操作は、従来どおり動く。
- `register reopen` など終端以外の操作と、`note` の内容の更新（`register update`）は、従来どおり動く。
- 拒否と、`note` 以外が影響を受けないことを確かめる単体テストがある。
- `register-operation-guide.md` と `command-reference.md` に、`note` の終端操作が拒否されることが書かれている。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                   |
| --- | ------------------------------ | ---- | ---- | ---------------------- |
| 1   | 終端操作で `note` を拒否する   | DEV  | open | close / reject / defer |
| 2   | テストを追加する               | DEV  | open | -                      |
| 3   | ガイドとリファレンスへ記載する | DEV  | open | -                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-GDQC（本項目の回答）、PJR-XW9M（orchestrator 定義の修正）
- [[specdojo:pjr-rulebook]]、[[specdojo:register-operation-guide]]
- `src/register.ts`、`src/register-item.ts`
