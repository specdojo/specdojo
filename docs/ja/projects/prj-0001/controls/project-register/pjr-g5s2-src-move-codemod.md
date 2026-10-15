---
specdojo:
  id: prj-0001:pjr-g5s2-src-move-codemod
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:11:53Z"
  due_on: null
---

# PJR-G5S2 src の移動の codemod を作る

## 1. 概要

移す前後のパスの対応表を入力に、git mv による src と tests のファイルの移動、相対 import の書き換え、dist のパスを参照する箇所の検出を機械的に行うスクリプトを作る。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定の 1 件目。後続の移動（PJR-W9RK・PJR-KECW・PJR-SMK5・PJR-YH9Q・PJR-MHHP・PJR-XP0J）で使う codemod を作る。本件ではファイルを移さない。

- `tools/` に codemod のスクリプトを作る。入力は「移す前のパス → 移した後のパス」の対応表（JSON か TSV）とし、次を機械的に行う。
  - `git mv` による `src/` のファイルの移動と、対応する `tests/src/` のテスト（`<name>.test.ts`・`<name>.integration.test.ts`）の移動。テストは `src/` と同じ構成にする（`.github/instructions/vitest.instructions.md`）。
  - `src/`・`tests/`・`tools/`・`scripts/` の TypeScript の相対 import（`import`・`export ... from`・`import()`・`vi.mock` などの文字列）の書き換え。拡張子 `.js` の指定は保つ。
  - `import.meta.url`・`import.meta.dirname`・`__dirname` から相対パスを組み立てている箇所の検出と報告（2026-10-16 時点で `build-if-stale`・`package-paths`・`viewpoint-document-kinds-check`・`routine`・`yaml`・`specdojo` の 6 ファイル）。階層が変わるとパスがずれるため、自動では直さず一覧を出す。
  - `dist/` のパスや `src/<name>.ts` のパスを文字列で参照している箇所（設定・テスト・文書）の検出と報告。
- `--dry-run` で、移動と書き換えの予定を変更せずに表示できる。
- 実行前に作業ツリーに未 commit の変更があれば止まる。
- codemod の単体テストを加える。一時ディレクトリに小さなリポジトリを作り、2〜3 ファイルを移して、import の書き換え、テストの移動、`import.meta.url` の検出を確かめる（`git` の起動は Vitest の規約どおり `env: gitEnvironment()` を渡す）。
- 移した後に `dist/` に古いファイルが残らないよう、`npm run build` が `dist/` を作り直す（または codemod が古い出力を消す手順を案内する）ことを確かめ、result に書く。
- 使い方（対応表の書き方、`--dry-run`、検出の一覧の扱い）を `tools/` の README かスクリプトの先頭の説明に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                       | 担当 | 状態 | メモ                          |
| --- | -------------------------- | ---- | ---- | ----------------------------- |
| 1   | codemod のスクリプトを作る | DEV  | done | 移動・import の書き換え・検出 |
| 2   | 単体テストを加える         | DEV  | done | 一時リポジトリで確かめる      |
| 3   | 使い方を書く               | DEV  | done | スクリプト先頭に記載          |

## 4. 対応結果

- `tools/src-move-codemod.mjs` を追加した。JSON または TSV の対応表を入力し、`src/` と対応する `tests/src/` を `git mv` で移動して、TypeScript の相対 import を構文木に基づいて書き換える。
- `--dry-run`、作業ツリーの未 commit 変更の拒否、`import.meta.url`・`import.meta.dirname`・`__dirname`・`dist/`・`src/*.ts` 参照の報告を実装した。検出箇所は自動修正せず、移動ごとに確認する。
- `tests/tools/src-move-codemod.integration.test.ts` を追加し、一時 Git リポジトリで source と test の移動、静的・動的 import と `vi.mock` の書き換え、パス依存箇所の検出、dry run、dirty worktree の拒否を確認する。
- スクリプト先頭に対応表の形式、実行方法、検出結果の扱いを記載した。移動後は `npm run build` を実行するよう案内する。既存の build script は最初に `dist/` 全体を削除してから再生成するため、移動前の出力は残らない。
- 残課題はない。後続の移動項目で対応表を作り、dry run の検出結果を確認してから適用する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-w9rk-src-move-dashboard]]: 最初の移動。
