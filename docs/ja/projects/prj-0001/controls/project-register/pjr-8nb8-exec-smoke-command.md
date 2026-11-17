---
specdojo:
  id: prj-0001:pjr-8nb8-exec-smoke-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-17T12:21:33Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-JSEY
  commit_type: feat
  commit_scope: exec
---

# PJR-8NB8 runner の変更の統合後の動作確認（JSEY の手順）を specdojo のコマンドにする

## 1. 概要

確認用の項目の対象一覧への追記・開き直し・exec run・actor の確認を、orchestrator の手作業から 1 つのコマンドへ移す

## 2. 入力

- 運用メモの「JSEY（runner の動作確認）」の手順（対象一覧への ID の追記と commit、register reopen、claude-executor での exec run --register、start から review までと actor の実体名の確認、close）を、orchestrator が毎回手で流している。2026-11-17 も 2 回流した
- 利用者が 2026-11-17 に、npm script にするか specdojo のコマンドに足す案を出し、specdojo のコマンドにする形で起票を依頼した
- orchestrator のスクリプトや手作業は specdojo のコマンドへ移す方針である

## 3. 完了条件

- 確認対象の項目の ID を受け取る 1 つのコマンドで、確認用の項目（JSEY）の対象一覧への ID の追記と記帳、確認用の項目の開き直し、指定の executor での `exec run --register --worktree`、start から review まで通ったことと event の actor に実体名が記録されたことの機械的な確認を、順に行える。コマンドの名前は executor が決める。
- 確認用の項目の ID は、引数か設定で指定する（project ごとに違うため）。
- 確かめた結果を出力と終了コードで返し、失敗したときは止まった段と理由を出す。
- `--dry-run` で、何をするかを実行せずに示せる。
- 確認の後に close まで行うか（たとえば `--close`）は executor が決め、理由を個票の対応結果に書く。
- [[prj-0001:pm-orchestrator-playbook|運用メモ]] の「JSEY（runner の動作確認）」の手順と、[[specdojo:command-reference|コマンドリファレンス]] を新しいコマンドに合わせる。
- 単体テストと結合テストを足す。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | コマンドの設計（名前、引数、確認用の項目の指定、close の扱い） | DEV  | open | -    |
| 2   | コマンドを実装し、テストを足す                                 | DEV  | open | -    |
| 3   | 運用メモとコマンドリファレンスを直す                           | DEV  | open | -    |
| 4   | 統合の後に新しいコマンドで確認を 1 回流す（orchestrator）      | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-jsey-exec-run-split-smoke]]
- [[prj-0001:pm-orchestrator-playbook]]
