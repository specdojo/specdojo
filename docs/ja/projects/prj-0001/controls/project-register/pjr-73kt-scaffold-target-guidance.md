---
specdojo:
  id: prj-0001:pjr-73kt-scaffold-target-guidance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                           | 担当     | 状態 | メモ                                                                            |
| --- | ---------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------------- |
| 1   | 3 か所の雛形作成の案内を `--target` の形に直す | executor | done | `schedule-design-guide`、`xer-human-draft-template`、`plans-planning.ts` を修正 |
| 2   | 残りがないことを確かめ、CHANGELOG と検証を流す | executor | done | リポジトリ全体の確認、テスト 2 件修正、`CHANGELOG.md` 追記                      |

## 5. 対応結果

### 実施内容

- `docs/ja/specdojo/guides/schedule-design-guide.md` の雛形作成の案内を `specdojo deliverable scaffold --project <project-id> --target <doc-id>` に修正し、成果物 1 件のみを対象とする形に直した。`--target` では不要となった「カタログ内の他の未作成成果物も生成するため出力を確認する」旨の注意書きを削除し、既存成果物を上書きしないことと `--force` を指定しない案内の記述を維持した。
- `docs/ja/specdojo/exec-templates/xer-human-draft-template.md` の雛形作成の案内を `specdojo deliverable scaffold --project <project-id> --target <doc-id>` で対象成果物の雛形を作成する形に更新した。既存成果物は上書きしないことと `--force` を指定しない案内の記述を維持した。
- `src/exec/plans-planning.ts` の `strategy-planning` 完了条件案内にある雛形作成コマンドを `specdojo deliverable scaffold ${projectArg} --target <doc-id>` に更新した。既存成果物は上書きしない案内の記述を維持した。
- 上記文言の変更に伴い、文言を検証している単体テスト `tests/src/exec/results.test.ts` および `tests/src/register/planning.test.ts` を `--target <doc-id>` の期待値に合わせて更新した。
- リポジトリ全体で `deliverable scaffold` の案内に `--dct <catalog>` で 1 件の雛形を作らせる記述が残っていないことを確認した。カタログ全体の雛形を作る用途の `--dct` の説明（`command-reference.md`、`waza-guide.md` 等）は維持した。
- `CHANGELOG.md` の `## [Unreleased]` 節（`### 変更`）に本対応内容を追記した。

### 成果物

- `docs/ja/specdojo/guides/schedule-design-guide.md`
- `docs/ja/specdojo/exec-templates/xer-human-draft-template.md`
- `src/exec/plans-planning.ts`
- `tests/src/exec/results.test.ts`
- `tests/src/register/planning.test.ts`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-73kt-scaffold-target-guidance.md`

### 保護された設定

- 変更なし（保護された設定への変更は不要）。

### 残課題

- なし。

## 6. 関連ドキュメント

- [[prj-0001:pjr-s23t-deliverable-scaffold-target]]
- [[prj-0001:pjr-e45k-schedule-context-draft-profile]]
