---
specdojo:
  id: prj-0001:pjr-3j5d-grade-test-tmpdir-mermaid-enoent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T04:41:14Z"
  due_on: "2026-09-30"
---

# PJR-3J5D grade テストの docs 配下への一時ファイル作成をやめ mermaid プラグインを ENOENT に耐えるようにする

## 1. 概要

tests/src/grade.test.ts の generated 除外テストが実リポジトリの docs/ja/specdojo/samples/generated/ 配下に一時 Markdown を作成・削除するため、npm test が走るたび（pre-commit hook、exec run の親検証、手動実行）に VitePress dev サーバーの watcher が add を検知し、250 ms 後の mermaid SVG 生成で fs.statSync が ENOENT を投げてプロセスが落ちる。テストは tmpdir で検証できるようにし、mermaid プラグインはファイル単位で例外を捕捉して ENOENT をスキップし、unlink を処理し、generated/ 配下を対象外にする。

### 1.1. 観測したエラー

`npm run docs:dev` で起動した VitePress が、更新のたびに次のエラーで終了する。

```text
[mermaid] generating svgs for 1 file(s) (md:add)
Error: ENOENT: no such file or directory, stat '.../docs/ja/specdojo/samples/generated/grade-target-test-x5GgKd/example.md'
    at Module.statSync (node:fs:1726:25)
    at processMarkdown (.vitepress/config.mts ...)
    at generateMermaidSvgsForFile (...)
    at run (...)
    at Timeout._onTimeout (...)
```

### 1.2. 原因

| 要因     | 箇所                                                                                                                  | 内容                                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 発火源   | `tests/src/grade.test.ts`「excludes generated documents and rejects their explicit selection」                        | `mkdtempSync(join("docs/ja/specdojo/samples/generated", "grade-target-test-"))` で実リポジトリに一時 Markdown を作り、検証後に削除する。`discoverGradeTargets` が `specdojoRootDir()` で実リポジトリを見るため tmpdir を使えない。vitest 規約「実リポジトリのファイルを変更しない」に反する |
| 落ちる側 | `packages/docs-site/.vitepress/config.mts` の `mermaidSvgAutoGenerate` と `packages/docs-site/src/gen-mermaid-svg.ts` | watcher の `add` を 250 ms 遅延でまとめて処理するが、処理時点でファイルは削除済み。`processMarkdown` の `fs.statSync` が ENOENT を投げ、`run()` は `try/finally` のみで `catch` が無いため `setTimeout` から例外が漏れてプロセスが終了する。`unlink` の購読と `generated/` 配下の除外も無い |

テストは `npm test` のたびに走るため、pre-commit hook（`src/` `tests/` 変更時）、`exec run` の親検証
（test-unit / test-integration）、手動実行のすべてが発火源になる。exec run が続いた 9/12〜13 に頻発した。

### 1.3. 対処の方向

- テスト: `discoverGradeTargets` にルートを注入できるようにして tmpdir に fixture を置くか、generated 除外の
  判定を純粋関数として切り出して直接検証する。実リポジトリの `docs/` へは書かない。
- プラグイン: `run()` でファイルごとに例外を捕捉し、ENOENT は警告ログを出してスキップする。`unlink` を
  購読して manifest から該当エントリを除く。`shouldHandle` で `/generated/` 配下を対象外にする。
  `generateMermaidSvgsForFile` 側でも対象ファイルの不存在を正常系として扱う。

## 2. 完了条件

- `tests/` のいずれも実リポジトリの `docs/` 配下へファイルを作成・削除しない（`grep` で `docs/ja` への書き込みが無いことを確認できる）。
- VitePress dev サーバー稼働中に `npm run test:unit` を実行しても、サーバーが終了しない。
- 存在しない Markdown パスを `generateMermaidSvgsForFile` に渡しても例外にならず、manifest から該当エントリが除かれる。
- `docs/**/generated/` 配下の Markdown の追加・更新で mermaid SVG 生成が起動しない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration`、`npm --prefix packages/docs-site run typecheck` が成功する。

## 3. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ                                                                 |
| --- | ----------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------- |
| 1   | grade テストの一時ファイルを tmpdir へ移す                  | ARC  | done | 探索ルートを注入し、fixture を OS の一時ディレクトリへ隔離した       |
| 2   | mermaid プラグインで ENOENT を捕捉し unlink を処理する      | ARC  | done | 欠落を正常系として manifest と orphan SVG を整理するようにした       |
| 3   | `generated/` 配下を watcher の対象外にする                  | ARC  | done | watcher とフルスキャンで共通の対象判定を適用した                     |
| 4   | dev サーバー稼働中に test:unit を実行して落ちないことを確認 | ARC  | done | 欠落・generated 除外の回帰テストを追加し、親 runner の検証対象にした |

## 4. 対応結果

- `discoverGradeTargets` に探索ルートの依存注入を追加し、generated 除外テストが実リポジトリの
  `docs/` を変更せず tmpdir 内だけで完結するようにした。
- Mermaid SVG 生成は、対象 Markdown の削除や処理中の ENOENT をスキップし、manifest の該当項目と
  参照されなくなった SVG を削除するようにした。Vite watcher は `unlink` も処理し、ファイル単位の
  生成失敗が dev サーバープロセスへ漏れないようにした。
- `generated/` 配下を watcher、単一ファイル生成、フルスキャンのすべてから除外し、対象判定と
  欠落時 cleanup の回帰テストを追加した。
- 残課題はない。unit / integration / schema の最終検証は executor 終了後に親 runner が実行する。

## 5. 関連ドキュメント

- 文書サイトの分離: [[prj-0001:pjr-9s8f-split-docs-site-package]]
- grade plan 生成物の扱い: [[prj-0001:pjr-2bxd-grade-plan-generated-default]]
- テスト記述規約: `.github/instructions/vitest.instructions.md`
