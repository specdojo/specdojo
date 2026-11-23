---
specdojo:
  id: prj-0001:pjr-1jf6-register-branch-merge-into-develop
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
  registered_at: "2026-11-23T00:21:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: register
---

# PJR-1JF6 register のブランチを develop へ一方向に取り込む

## 1. 概要

register のブランチを develop へ merge し続け、develop で register のファイルを直接変えないことを検査する

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- register のブランチを develop へ一方向に取り込み続ける仕組みを作る（3a）。GitHub Actions で push のたびに merge するか、CLI と runner が develop の作業の前に取り込むかを executor が決め、理由を個票の対応結果に書く。Actions の定義（`.github/`）が要る場合は、案を個票の対応結果に書く。
- develop では register のファイル（register のブランチに置くもの）を直接変えないことを検査する（hook など）。設定がなければ検査しない。
- 取り込みで衝突しないこと（register のファイルは register のブランチだけが変える）を統合テストで確かめる。
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
