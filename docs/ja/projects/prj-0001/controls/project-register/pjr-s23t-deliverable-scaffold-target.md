---
specdojo:
  id: prj-0001:pjr-s23t-deliverable-scaffold-target
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-10-30T09:32:07Z"
  derived_from:
    - PJR-6A2B
---

# PJR-S23T deliverable scaffold で成果物を 1 つだけ雛形にできるようにする

## 1. 概要

`--target` で成果物を 1 つだけ指定して雛形を作り、カタログにない成果物は `--target-path` と `--target-rulebook` で作れるようにする。

## 2. 入力

- PJR-65DS の流れ（雛形→人による文脈の記入→draft→fully-guided→finalize）は雛形を成果物 1 つ単位で作れることを前提とするが、現在の deliverable scaffold は --dct でカタログ単位に一括生成するだけで、カタログのない成果物も作れない
- register の --target・--target-path・--target-rulebook の解決とパス検証（src/register/deliverable-target.ts）を使い回す

## 3. 完了条件

- `deliverable scaffold` に `--target <doc-id>` を足す。カタログにある成果物は、カタログの情報（配置・rulebook・template）から 1 件だけ雛形を作る。既存のファイルは、今と同じく `--force` がなければ上書きしない。
- カタログにない成果物は `--target-path` と `--target-rulebook` で作れるようにする。パスの検証（リポジトリの中か、ファイル名か、ほかの文書が使っていないか）は register の `--target-path` と同じ規則とし、できれば同じ関数を使う。
- `--target` と `--dct` を一緒に指定したらエラーにする。`--dry-run` では書き込まずに予定だけを出す。
- 雛形の frontmatter の `id` は project で修飾した doc id とし、`status: draft` と `rulebook` を入れる。template のない rulebook の扱いは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- `src/schedule/strategy-profiles.ts` の context-pass の説明にある `deliverable scaffold --project <project-id> --dct <catalog>` を、`--target` で成果物を指定する形に直す。
- 単体テストを足す。対象は、カタログ経由の 1 件の生成、カタログのない成果物の生成、`--dct` との併用のエラー、既存ファイルの skip、リポジトリの外を指すパスのエラー。
- command-reference の `deliverable scaffold` に新しいオプションを書く。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流して通し、親の検証も通る。
- 保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                              | 担当     | 状態 | メモ |
| --- | --------------------------------------------------------------------------------- | -------- | ---- | ---- |
| 1   | `deliverable scaffold` に `--target`・`--target-path`・`--target-rulebook` を足す | executor | open | -    |
| 2   | context-pass の説明・command-reference・CHANGELOG を直す                          | executor | open | -    |
| 3   | 単体テストを足して検証を流す                                                      | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6a2b-context-draft-guides]]
- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:command-reference]]
