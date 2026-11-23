---
specdojo:
  id: prj-0001:pjr-4vd6-runner-transitions-to-register-branch
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
  registered_at: "2026-11-23T00:21:39Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: exec
---

# PJR-4VD6 runner の状態遷移と対応結果を register のブランチへ書く

## 1. 概要

exec run --register の start・review・waiting と対応結果を register のブランチへ書き、exec のブランチには個票の変更を含めない

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- `exec run --register` の runner が書く状態の遷移（start・review・waiting など）と対応結果を、register のブランチを使う設定のとき register のブランチへ書いて push する。exec のブランチには個票の変更を含めない（2a）。設定がなければ今の動きを変えない。
- 個票の対応結果を executor が書く今の流れと、exec のブランチから個票を外す流れの関係を設計し、個票の対応結果に書く（executor の書いた対応結果を、統合の段で register のブランチへ移すなど）。
- 並行の run が同じ register のブランチへ書いても、lock と `pull --rebase` で失われないことを統合テストで確かめる。
- runner の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の `exec run --register` を 1 回流して確かめてから close する。
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
