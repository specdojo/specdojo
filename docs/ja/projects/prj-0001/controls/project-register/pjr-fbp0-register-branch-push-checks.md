---
specdojo:
  id: prj-0001:pjr-fbp0-register-branch-push-checks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:21:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: register
---

# PJR-FBP0 register のブランチへの push を検査する

## 1. 概要

push のたびに記録の形と schema を検査し、register の範囲の外のファイルを含む commit を止める。hook と CI の両方で流せるようにする

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- register のブランチへの push のたびに、記録の形（個票とイベントの対応、schema）を検査し、register の範囲の外のファイルを含む commit を止める検査を用意する（4a）。ローカルの hook（pre-push）と、CI で流せるコマンドの両方を用意する。CI の定義（`.github/`）が要る場合は、案を個票の対応結果に書く。
- 別のプロジェクトから `external_projects` で push された起票も、同じ検査を通す。
- 検査に落ちたときに、どのファイルのどこが違うかと直し方を出す。
- 単体テストを足す（範囲の外のファイル、形の違反、正しい commit）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
