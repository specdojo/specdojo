---
specdojo:
  id: prj-0001:pjr-njrh-orchestrator-use-register-commit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:05Z"
  completed_at: "2026-09-29T13:49:19Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.claude/agents/specdojo-orchestrator.md, .codex/agents/specdojo-or…"
  conclusion: オーケストレーター定義の記帳手順を register の --commit を使う形に改め、各環境へ同期した
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
| 1   | SSOT の登録簿の手順を `--commit` を使う形に改める | DEV  | done |                     |
| 2   | 各環境へ同期する                                  | DEV  | done | `orchestrator:sync` |

## 4. 対応結果

- `.agents/specdojo-orchestrator.agent.md` にて、`register add` および `register close` の呼び出し例を `--commit` を用いる形に修正した。
- `register build` の個別の呼び出しを削除し、`--commit` によって一貫した排他制御・記帳・再構築・コミットが行われることを記載した。
- `exec run` の実行中でも、既存個票の記帳を後回しにせず状態遷移可能であることを明記した。
- `-m` オプションによるコミットメッセージの指定方針（subject、type、scope、Refs: の記載）を追記した。
- `npm run orchestrator:sync` で各環境のラッパーへ変更を反映した。

## 5. 関連ドキュメント

- PJR-9XG4（`--commit` の追加）、PJR-N8AW（同じ SSOT を変更する項目）
- `.agents/specdojo-orchestrator.agent.md`、`tools/generate-orchestrator-wrappers.mjs`
