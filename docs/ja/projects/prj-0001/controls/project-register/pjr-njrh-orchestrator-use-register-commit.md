---
specdojo:
  id: prj-0001:pjr-njrh-orchestrator-use-register-commit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:05Z"
---

# PJR-NJRH オーケストレーター定義の記帳手順で register の --commit を使う

## 1. 概要

PJR-9XG4 で、`register add` / `close` / `reject` / `defer` / `update` / `reopen` などの記帳コマンドに `--commit` が入った。`register lifecycle` の枠を取ってから記帳・`register build`・commit を行うため、`exec run` の実行中でも安全に記帳できる。

一方、オーケストレーター定義（SSOT は `.agents/specdojo-orchestrator.agent.md`）の「登録簿（register）の使い方」は、記帳のあとに `git commit` を手で行う前提のままである。orchestrator は、run の実行中は既存の個票を書き換える記帳を後回しにする運用をしている（新しい個票の追加だけは並行してよいとした）。

## 2. 完了条件

- オーケストレーター定義の登録簿の手順（起票・状態遷移・close）が、`--commit` を使う形に改められている。
- run の実行中でも、`--commit` を使えば記帳を後回しにしなくてよいことが書かれている。
- commit メッセージの方針（subject は日本語、conventional commit の type と scope、本文に「なぜ」と `Refs: PJR-XXXX`）を `--commit` と組み合わせて守る方法（`-m` の使い方など）が書かれている。
- `npm run orchestrator:sync` で各環境のラッパーと配布テンプレートへ同期し、`npm run lint:orchestrator-sync` が通過している。
- `npm run -s lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                |
| --- | ------------------------------------------------- | ---- | ---- | ------------------- |
| 1   | SSOT の登録簿の手順を `--commit` を使う形に改める | DEV  | open | PJR-N8AW の後に着手 |
| 2   | 各環境へ同期する                                  | DEV  | open | `orchestrator:sync` |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-9XG4（`--commit` の追加）、PJR-N8AW（同じ SSOT を変更する項目）
- `.agents/specdojo-orchestrator.agent.md`、`tools/generate-orchestrator-wrappers.mjs`
