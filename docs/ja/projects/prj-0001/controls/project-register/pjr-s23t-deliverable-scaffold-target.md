---
specdojo:
  id: prj-0001:pjr-s23t-deliverable-scaffold-target
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                                              | 担当     | 状態 | メモ                                                          |
| --- | --------------------------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------------- |
| 1   | `deliverable scaffold` に `--target`・`--target-path`・`--target-rulebook` を足す | executor | done | `runGenerateTarget` と `validateDeliverableTargetPath` を実装 |
| 2   | context-pass の説明・command-reference・CHANGELOG を直す                          | executor | done | -                                                             |
| 3   | 単体テストを足して検証を流す                                                      | executor | done | `tests/src/deliverable/scaffold.test.ts` を追加し全件通過     |

## 5. 対応結果

### 実施内容

- `deliverable scaffold` に `--target <doc-id>`、`--target-path <path>`、`--target-rulebook <rulebook>` オプションを追加した。
- `--target` 指定時は 1 成果物のみを生成するようにし、カタログにある成果物はカタログ情報から 1 件生成し、既存ファイルは `--force` がなければスキップするようにした。
- カタログにない成果物は `--target-path` と `--target-rulebook` から生成できるようにした。
- パス検証（リポジトリ内か、ファイル名か、ほかの文書が使っていないか）は `src/register/deliverable-target.ts` に共通関数 `validateDeliverableTargetPath` を切り出し、register と `deliverable scaffold` で同じ関数と規則を共有した。
- `--target` と `--dct` を同時に指定した場合はエラーとする排他制御を実装した。
- `--dry-run` ではファイル書き込みを行わず予定（`Would create: <path>`）のみを表示するようにした。
- 雛形の frontmatter の `id` は project で修飾した doc id（`${projectId}:${local_id}`）とし、`status: draft` と `rulebook` を設定した。
- template のない rulebook の扱い: template が存在しない場合（`template: not-needed` や未定義など）であってもエラーで中断せず、frontmatter（`id`、`type: project`、`status: draft`、`rulebook`）、見出し（`# <local_id>`）、`_TODO_: 本文を記述する`（YAML の場合は frontmatter / マッピングのみ）を含む最小構成の雛形を生成することとした。理由: PJR-65DS の雛形作成→文脈記入のフローにおいて、template 未定義の rulebook や独自文書であっても雛形生成を妨げずに作業を進められるようにするため。
- `src/schedule/strategy-profiles.ts` の context-pass の説明を `deliverable scaffold --project <project-id> --target <doc-id>` に更新した。
- `docs/ja/specdojo/references/command-reference.md` に新しいオプションと解説・使用例を追記した。
- `CHANGELOG.md` の `## [Unreleased]` に追記した。
- `tests/src/deliverable/scaffold.test.ts` に単体テスト（カタログ経由の 1 件生成、カタログ外成果物の生成、`--dct` 併用エラー、既存ファイルの skip と `--force`、リポジトリ外パスのエラー、CLI オプション動作）を追加した。

### 成果物

- `src/register/deliverable-target.ts`
- `src/catalog/generate.ts`
- `src/deliverable/deliverable.ts`
- `src/schedule/strategy-profiles.ts`
- `docs/ja/specdojo/references/command-reference.md`
- `CHANGELOG.md`
- `tests/src/deliverable/scaffold.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-s23t-deliverable-scaffold-target.md`

### 保護された設定

- 変更なし（保護された設定への変更は不要）。

### 残課題

- なし。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6a2b-context-draft-guides]]
- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:command-reference]]
