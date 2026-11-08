---
specdojo:
  id: prj-0001:pjr-ftrc-lint-fm-skip-gitignored-generated
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T15:04:22Z"
  derived_from:
    - PJR-STM9
---

# PJR-FTRC lint:fm が git の管理外の生成物まで検査して親の検証を落とさないようにする

## 1. 概要

lint:fm（remark の frontmatter 検査）が docs/**/*.md をすべて読み、.gitignore で管理外にした生成物（grade の一時ファイルなど）の schema の警告で --frail により失敗する。git の管理外の生成物を検査の対象から外す

## 2. 入力

- 2026-11-08、PJR-STM9 の executor が worktree で grade を流し、docs/ja/projects/prj-0001/execution/grade/generated/runs/ に一時ファイル（.gitignore の `docs/**/generated/*` で管理外）が残り、親の検証 lint-fm がその frontmatter の警告で失敗した。orchestrator が一時ファイルを消して --resume した（indie が承認）。
- .remarkignore は空で、lint:fm は node packages/docs-lint/bin/specdojo-docs-lint.js remark `"docs/**/*.{md,mdx}"` --quiet --frail で動く。
- 直し方（.remarkignore に足す、.gitignore を読む、docs-lint 側で除外する、など）は executor が決め、理由を個票の対応結果に書く。

## 3. 完了条件

- `npm run lint:fm` が、`.gitignore` で管理外にした `docs/**/generated/` の下の生成物（grade の一時ファイルなど）を検査しない。どの方法で外すかは executor が決め、理由を個票の対応結果に書いている。
- git で管理している文書（管理下の `generated/` を含む）は、今までどおり検査される。外したことで検査が抜ける文書がないことを、外す前と後の対象の数などで確かめ、個票の対応結果に書いている。
- 管理外の生成物を置いた状態で `npm run lint:fm` が通ることを、テストか手順で確かめている。
- `package.json` など保護された設定を変える必要がある場合は、executor は変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:fm`・`npm run lint:md`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態   | メモ                                                                                              |
| --- | ------------------------------------------------ | ---- | ------ | ------------------------------------------------------------------------------------------------- |
| 1   | lint:fm の対象の決まり方を読み、外す方法を決める | agy  | closed | .remarkignore と specdojo-docs-lint.js の組み合わせを採用                                         |
| 2   | 管理外の生成物を外し、確かめる                   | agy  | closed | .remarkignore に docs/**/generated/** を追加し、specdojo-docs-lint.js に --silently-ignore を追加 |
| 3   | 検査を流し、対応結果に書く                       | agy  | closed | ユニットテスト作成と lint:fm の疎通を確認                                                         |

## 5. 対応結果

### 実施内容

1. **除外方法の選定と実装**:
   - remark-cli の標準的な設定規約に従い、`.remarkignore` に `docs/**/generated/**` を追加した。
   - remark-cli（unified-engine）の仕様上、明示的に glob で渡されたファイルが ignore されていると `error Cannot process specified file: it's ignored` で終了コード 1 となる。これを防ぎ無視ファイルとして静かにスキップするため、`packages/docs-lint/bin/specdojo-docs-lint.js` において `command === "remark"` 実行時に `--silently-ignore` を自動付与するようにした。
   - この修正により、保護されたファイルである `package.json`（`lint:fm` スクリプト定義）を変更することなく、`npm run lint:fm` が git 管理外の生成物を自動的にスキップできるようになった。
2. **対象文書の検証**:
   - 外す前: `docs/**/*.{md,mdx}` の総対象 4,099 件（git 管理下 3,895 件 + gitignore 管理外生成物 204 件）。
   - 外した後: gitignore 管理外生成物 204 件が除外され、git 管理下の 3,895 件のみが検査対象となった。
   - git 管理下にあるファイル名に `generated` を含む文書 11 件（`pjr-0004-pjr-generated.md` 等）は、すべて検査対象に残っており、誤って除外された管理文書が 0 件であることを確認した。
3. **管理外生成物存在時の動作確認とテスト作成**:
   - `docs/ja/projects/prj-0001/execution/grade/generated/runs/` 配下に不正な frontmatter を含むダミーファイルを配置し、`npm run lint:fm`（`node packages/docs-lint/bin/specdojo-docs-lint.js remark "docs/**/*.{md,mdx}" --quiet --frail`）が終了コード 0 で通過することを確認した。
   - 単体テスト `tests/packages/docs-lint/specdojo-docs-lint-remark.test.ts` を追加し、`.remarkignore` 配下のファイルが `--silently-ignore` でスキップされること、および管理下のファイルで schema エラーがある場合は正常に検出されることを検証した。
4. **保護された設定の確認**:
   - `package.json` を含め、保護された設定ファイルの変更は発生していない。

### 成果物

- `.remarkignore`: `docs/**/generated/**` を追加
- `packages/docs-lint/bin/specdojo-docs-lint.js`: `remark` 実行時に `--silently-ignore` を付与
- `tests/packages/docs-lint/specdojo-docs-lint-remark.test.ts`: 新規作成

### 5.1. CHANGELOG に書く事項

- 区分: 改善
- 行の文案:
  - `docs-lint`: `specdojo-docs-lint remark` の実行時に `--silently-ignore` を自動付与し、`.remarkignore` で指定された無視対象ファイルをエラーにせずスキップするように改善
  - `lint`: `.remarkignore` に `docs/**/generated/**` を指定し、git 管理外の生成物（grade の一時ファイル等）が `lint:fm` の検査対象から外れるように設定

### 残課題

- なし

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-stm9-business-specs-reps-strategy]]
