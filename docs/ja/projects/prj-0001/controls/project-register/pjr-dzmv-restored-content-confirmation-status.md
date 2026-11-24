---
specdojo:
  id: prj-0001:pjr-dzmv-restored-content-confirmation-status
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
  registered_at: "2026-11-23T13:11:20Z"
  derived_from:
    - PJR-Y5RD
  commit_type: docs
  commit_scope: standard
---

# PJR-DZMV 復元した内容の確認状態を成果物に持たせる方法を検討する

## 1. 概要

復元した仕様の根拠、確認の状態、誰がいつ確かめたかを成果物にどう持たせるかの案を比べ、推奨を出す

## 2. 入力

- PJR-Y5RD の決定（2026-11-23）: kata による理解の負債の解消で、シビックテックを持続可能にすることを中核の位置づけにする

## 3. 完了条件

- 復元した内容の確認状態を、成果物に持たせる方法を検討する（PJR-Y5RD）。少なくとも、根拠（コードの場所・記録・聞き取り）、確認の状態（推測・根拠で確認・当事者が確定）、誰がいつ確かめたかを、文書のどこにどう書くかの案を出す。今の目印（`_ASSUMPTION_`・`_UNDECIDED_`・`_CONTEXT_`）、frontmatter、登録簿の decision のどれで持つかを比べる。
- 案ごとに、書く手間（Sustainable Participation）、grade や検査で機械的に確かめられるか、復元した仕様の更新のしやすさを表で比べ、推奨を書く。採るかどうかは利用者が決める。
- この項目では実装しない。実装が要る場合は、案を個票の対応結果に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
