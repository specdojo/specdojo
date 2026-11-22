---
specdojo:
  id: prj-0001:pjr-e73z-docs-generate-fresh-per-step
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
  registered_at: "2026-11-22T23:45:26Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BBTW
  depends_on:
    - PJR-BEQ8
    - PJR-XHS8
  commit_type: perf
  commit_scope: docs-site
---

# PJR-E73Z docs:generate:fresh を段ごとの判定にする

## 1. 概要

docs/ のどれかが新しいと build の 6 段を全部作り直す。入力が変わった段だけを作り直す

## 2. 入力

- docs:dev の起動を速くする（利用者の依頼、2026-11-23）。devcontainer を作り直した後の 2 回目の起動で 58.4 秒だった

## 3. 完了条件

- `docs:generate:fresh`（`specdojo-docs-site generate --skip-if-fresh`）は、今は `.specdojo/doc-index.json` より新しいファイルが `docs/` にあると `specdojo build` の 6 段（exec refresh・catalog・register・yaml-pages・dashboard・index）を全部作り直す。段ごとに入力を見て、入力が変わった段だけを作り直すようにする。
- 段ごとの入力（どのファイルが変わるとどの段を作り直すか）と、判定の方法（更新時刻か内容のハッシュか）を設計し、個票の対応結果に表で書く。段の間の依存（例: register の生成物を dashboard が読む）を落とさない。
- 判定を誤って古い生成物で起動しないことを優先する。判定できないときは、その段を作り直す。`specdojo build`（全部作り直す経路）は変えない。
- register の個票を 1 件直した後と、何も変えていない後の 2 つの場合で、`docs:generate:fresh` の時間を直す前と直した後で測り、個票の対応結果に書く。
- 単体テストを足す（段ごとの判定、判定できないときに作り直すこと）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
