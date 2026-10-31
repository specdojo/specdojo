---
specdojo:
  id: prj-0001:pjr-73kt-scaffold-target-guidance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T02:04:03Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-S23T
---

# PJR-73KT 雛形作成の案内を deliverable scaffold --target の形にそろえる

## 1. 概要

`schedule-design-guide`・`xer-human-draft-template`・`plans-planning.ts` に残る `deliverable scaffold --project <project-id> --dct <catalog>` の案内を、成果物を 1 つだけ作る `--target` の形に直す。

## 2. 入力

- PJR-E45K が入れた文脈の記入の段の案内は scaffold --dct `<catalog>` で、カタログのほかの未作成成果物まで雛形を作る。PJR-S23T で --target が入り、strategy-profiles.ts だけ直した
- 残っている場所は docs/ja/specdojo/guides/schedule-design-guide.md・docs/ja/specdojo/exec-templates/xer-human-draft-template.md・src/exec/plans-planning.ts の 3 か所

## 3. 完了条件

- 次の 3 か所の雛形作成の案内を、`deliverable scaffold --project <project-id> --target <doc-id>` で対象の成果物だけを作る形に直す。「カタログ内の他の未作成成果物も生成するため出力を確認する」旨の注意は、`--target` では不要になるため外す。
  - `docs/ja/specdojo/guides/schedule-design-guide.md`
  - `docs/ja/specdojo/exec-templates/xer-human-draft-template.md`
  - `src/exec/plans-planning.ts`
- 既存の成果物を上書きしないこと、`--force` を指定しないことの案内は残す。
- 直した後、リポジトリ全体で `deliverable scaffold` の案内に `--dct <catalog>` で 1 件の雛形を作らせる記述が残っていないことを確かめ、結果を本個票の対応結果に書く。カタログ全体の雛形を作る用途の `--dct` の説明（command-reference など）は変えない。
- `plans-planning.ts` の文言を確かめているテストがあれば、新しい文言に合わせる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                           | 担当     | 状態 | メモ |
| --- | ---------------------------------------------- | -------- | ---- | ---- |
| 1   | 3 か所の雛形作成の案内を `--target` の形に直す | executor | open | -    |
| 2   | 残りがないことを確かめ、CHANGELOG と検証を流す | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-s23t-deliverable-scaffold-target]]
- [[prj-0001:pjr-e45k-schedule-context-draft-profile]]
