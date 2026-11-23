---
specdojo:
  id: prj-0001:pjr-2q86-register-type-handoff
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T01:52:50Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5RY7
  depends_on:
    - PJR-5RY7
  commit_type: feat
  commit_scope: register
---

# PJR-2Q86 register に新しい種類 handoff を足す

## 1. 概要

PJR-5RY7 の決定のとおり、受け取ったら close する種類 handoff を足す。template・pjr-rulebook・一覧と view・exec と夜の実行の除外を含む

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

-

## 3. 完了条件

- register に新しい種類 `handoff` を足す（PJR-5RY7 の決定）。状態は open と done で、終わりの状態は done とする。`register add --type handoff` と `register close` が使える。
- 個票の template を足し、章は PJR-5RY7 の「決定内容」の表のとおり（引き継ぎ元と先・有効な承認の範囲・進行中・判断待ち・注意点）にする。
- `pjr-rulebook` の type 別の扱いに `handoff` を足す（いつ起票し、いつ close するか、判断待ちを `question` として別に起票すること）。
- `exec run --register` と夜の実行（`orchestrator night`）の対象から外す（note・epic と同じ扱い）。外したことを単体テストで確かめる。
- 一覧と view（`register build` の生成物）に `handoff` が出る。開いている handoff を一目で見つけられるようにする（例: 状態ごとの view）。
- register の schema（type の enum など）を直し、既存の個票の検査が通ることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
