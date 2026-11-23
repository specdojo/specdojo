---
specdojo:
  id: prj-0001:pjr-sjc7-branching-standard-register-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:21:30Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  commit_type: docs
  commit_scope: standard
---

# PJR-SJC7 git-branching-standard を register のブランチの方式（PJR-2TX0）に改訂する

## 1. 概要

標準が置き換え前の PJR-11EX の方式（統合専用 actor）のままなので、2TX0 の方式に直し、11EX に置き換えを記録する

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）

## 3. 完了条件

- `git-branching-standard` を PJR-2TX0 の決定（D、1b・2a・3a・4a）に合わせて改訂する。register を専用のブランチ（`project/<project-id>/register`）に置いてリモートを正本とすること、そこに置くもの（登録簿の個票とイベント、schedule の実行のイベント）、runner が状態の遷移をそのブランチへ書くこと、develop へ一方向に merge すること、`register ... --commit` が push まで行うことを書く。
- 「developへ入る3層の変更経路」の層 3 と、「運用規模ごとの必須条件」の統合専用 actor の記述を、2TX0 の方式に直す。PJR-11EX の方式（GitHub App の統合専用 actor）を前提にした記述を残さない。
- 単独の運用の間は今の方式（develop への直接の記帳）でよいこと、移る準備の項目（PJR-2TX0 の後続）が終わってから既定を切り替えることを書く。
- 別のプロジェクトから `external_projects` で specdojo へ起票する場合も、register のブランチへ push する経路になることを書く。
- PJR-11EX の個票の対応結果（または関連ドキュメント）に、PJR-2TX0 で置き換えたことを書く。11EX の状態は変えない。
- 標準のほかに、同じ前提で書かれたガイド（`register-operation-guide` など）があれば、食い違う箇所の一覧を個票の対応結果に書く。直すのは標準だけとする。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
