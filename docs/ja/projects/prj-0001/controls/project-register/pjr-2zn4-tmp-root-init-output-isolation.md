---
specdojo:
  id: prj-0001:pjr-2zn4-tmp-root-init-output-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T13:48:46Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-5FTV
  autopilot: approved
  commit_type: fix
  commit_scope: test
---

# PJR-2ZN4 テストと検証が /tmp の直下に init の出力を残さないようにする

## 1. 概要

どの処理が /tmp の直下に specdojo init の出力を残したかを確かめ、テストと agent の確認の手順を一時ディレクトリに閉じ込める

## 2. 入力

- PJR-5FTV の修正。今晩の夜間に流す（indie が 2026-11-12 に承認）

## 3. 完了条件

- PJR-5FTV の原因（どのテスト・検証の手順・agent の作業が `/tmp` の直下に `specdojo init` の出力を残したか）を、テストのコードと PJR-0F94 の実行記録から確かめ、個票の対応結果に書いている。確かめきれない場合は、候補と理由を書く。
- `init` を流すテストが、`mkdtemp` で作った一時ディレクトリの中だけに書き込み、`/tmp` の直下や `os.tmpdir()` そのものを cwd や出力先にしない。テストの共通の setup か静的な検査で、これを確かめる（`.github/instructions/vitest.instructions.md` の「ファイル I/O と一時ディレクトリ」に従う）。
- `/tmp` の直下に `.specdojo/`・`specdojo.config.json`・`lefthook.yml` などがあっても、`init` のテストが既存の設定を拾って落ちないことを、回帰テストで確かめている（一時ディレクトリの親を辿って設定を探さない、など、原因に合った形で）。
- agent が「空のリポジトリで確かめる」完了条件を実行するときに一時ディレクトリを使うよう、関連するガイドか exec plan の共通規約の書き方を直す必要があるかを判断し、要る場合は直すか変更案を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                               | 担当     | 状態 | メモ |
| --- | -------------------------------------------------- | -------- | ---- | ---- |
| 1   | 原因を確かめ、テストを一時ディレクトリに閉じ込める | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ftv-tmp-root-init-output-leak]]
