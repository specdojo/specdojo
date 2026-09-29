---
specdojo:
  id: prj-0001:pjr-9xg4-register-commit-under-lifecycle-lock
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T23:15:33Z"
  completed_at: "2026-09-29T11:11:52Z"
  conclusion: register の記帳コマンドに --commit を加え、register lifecycle の枠を取って記帳・register build・commit を行うようにした。run と並行した記帳の統合テストを追加した。オーケストレーター定義への取り込みは未実施
---

# PJR-9XG4 register の記帳コマンドに統合と記帳の枠を取って commit するオプションを加える

## 1. 概要

`exec run` は、メインの作業ツリーで register の遷移の記帳と統合の merge を行う。PJR-4HBG で、これらを別プロセスの run の間でも直列化する枠（`exec slots` の `register lifecycle`）を導入した。

一方、orchestrator や利用者が `register add` / `close` / `update` などで記帳し、`git commit` する操作は、この枠を取らない。run と同時に行うと、次の問題が起きうる。

- git の `index.lock` を取り合い、どちらかの commit が失敗する（2026-09-27 に orchestrator の commit が衝突して失敗した）。
- 記帳ファイルが未 commit のまま残ると、統合前の安全確認（統合するファイルと重なる未 commit の変更）が統合を止める。

このため orchestrator は、run の実行中は記帳の commit を後回しにしてきた。2026-09-29 に利用者と相談し、当面の運用として「新しい個票を追加するだけの commit は run と並行してよい。既存のファイルを書き換える記帳（close など）は run の完了後に行う」とした。本項目は、その根本対策である。

## 2. 完了条件

- `register add` / `close` / `reject` / `defer` / `update` / `reopen` などの記帳コマンドに、変更したファイルを commit するオプション（例: `--commit`）がある。
- このオプションは、`register lifecycle` の枠（PJR-4HBG の `CrossProcessMutex`）を取ってから、記帳と `register build` と commit を行い、終わったら枠を解放する。
- commit の対象は、そのコマンドが変更した個票・イベントに限る（生成物は ignore 済み）。ほかの未 commit の変更を巻き込まない。
- commit メッセージの既定値が、既存の記帳 commit（`docs(register PJR-XXXX): ...`）の形に合っている。`-m` で上書きできる。
- run の実行中に `--commit` 付きで記帳しても、run の記帳と統合が失敗しないことを、統合テストで確かめる。
- `register-operation-guide.md` と `command-reference.md` に記載されている。オーケストレーター定義（SSOT）の登録簿の手順も、必要なら `--commit` を使う形に改める（`npm run orchestrator:sync` で同期する）。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                      |
| --- | ------------------------------------------------------ | ---- | ---- | ------------------------- |
| 1   | 記帳コマンドに枠を取って commit するオプションを加える | DEV  | done | PJR-4HBG の枠を再利用した |
| 2   | 統合テストを追加する                                   | DEV  | done | 同じ枠との競合待ちを確認  |
| 3   | ガイド・リファレンス・オーケストレーター定義へ記載する | DEV  | done | ガイドとリファレンス      |

## 4. 対応結果

- `register add` / `update` / `renumber` と全状態遷移コマンドへ `--commit` と `-m` / `--message` を追加した。`--commit` は project の execution path から `register lifecycle` 枠を解決し、枠内で記帳、個票・event の検証、派生ビュー再生成、pathspec 限定 commit を行う。
- コマンド開始前の Git status を基準に、そのコマンドが新たに変更したファイルだけを commit する。対象個票・event・参照文書に既存の未 commit 変更がある場合は、混在を防ぐため書き込み前に停止する。pre-commit hook が対象を変更した場合は同じ commit へ収束させる。
- 既定のcommit件名を `docs(register PJR-XXXX): <command> <title>` とし、`-m` / `--message` で上書きできるようにした。`--dry-run --commit` は表示だけを行う。
- 統合テストで、開始前からある別ファイルの変更を残して個票とeventだけをcommitすること、および exec と同じ `register lifecycle` 枠が使用中の間は記帳・commitを開始せず、解放後に完了することを確認する。
- [[specdojo:register-operation-guide|登録簿運用ガイド]] と [[specdojo:command-reference|SpecDojoコマンドリファレンス]] に利用方法と安全条件を記載した。オーケストレーター SSOT は executor の保護対象と同期先を含むため本実行では変更せず、CLIの利用手順を正本ドキュメントへ反映した。

## 5. 関連ドキュメント

- PJR-4HBG（同時実行枠と `register lifecycle`）、PJR-CTV4（統合時の記帳競合）
- `src/register.ts`、`src/exec-slot-lock.ts`
