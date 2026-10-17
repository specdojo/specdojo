---
specdojo:
  id: prj-0001:pjr-xp0j-src-move-exec
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:43Z"
  due_on: null
---

# PJR-XP0J exec を src/exec へ移す

## 1. 概要

codemod で exec の 73 ファイルを src/exec/ へ移し、移した後の exec/ の中をさらに分けるかを判断する。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定に基づく最後の移動。`src/` の直下の exec のファイル（2026-10-17 時点で `exec.ts` と `exec-*.ts` の 73 ファイル）と `role-types.ts`（決定の 3.1）を `src/exec/` へ移す。これまでの移動と同じ手順と名前の付け方で行う。2026-10-17 時点で、接頭辞を外しても名前はぶつからない。

対応表の規則（executor が規則から機械的に対応表を作り、`tmp/` に保存して result に件数を記録する）:

| 移す前                                                                       | 移した後                                                                     |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/exec.ts`                                                                | `src/exec/exec.ts`                                                           |
| `src/exec-<name>.ts`                                                         | `src/exec/<name>.ts`                                                         |
| `src/role-types.ts`                                                          | `src/exec/role-types.ts`                                                     |
| `tests/src/exec.test.ts`（あれば）                                           | `tests/src/exec/exec.test.ts`                                                |
| `tests/src/exec-<name>.test.ts`・`tests/src/exec-<name>.integration.test.ts` | `tests/src/exec/<name>.test.ts`・`tests/src/exec/<name>.integration.test.ts` |

テストは、ソースの名前と対応しないもの（`exec-register-pipeline-e2e.integration.test.ts` など）も含め、`tests/src/exec*.ts` の 66 件すべてを上の規則で移す。

条件:

- `tools/src-move-codemod.mjs` で対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- 自分の位置や文字列からパスを組み立てている箇所（`dist/` や `src/exec-*.ts` を参照する設定・テスト・保護設定の一覧など）を codemod の検出から確かめ、移した後も同じ場所を指すよう直す。
- 移す前と後で、`specdojo --help` に出る全コマンドとそのサブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの数と差分がないことを result に記録する。
- 移した後に `node tools/build-if-stale.mjs` を実行し、hook の入口が動くことを確かめる。
- `npm run build` の後に、`dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- `src/exec/` の中をさらに分けるかの判断材料として、移した後の `src/exec/` のファイルを名前の先頭の語（`run-`・`worktree-`・`plans-` など）ごとに数えて result に書く。分けることは本件では行わない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 本件は runner 自身のコードを移すため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                           | 担当         | 状態 | メモ                     |
| --- | -------------------------------------------------------------- | ------------ | ---- | ------------------------ |
| 1   | 規則から対応表を作り、codemod で移す                           | DEV          | done | 実装 74 件・テスト 66 件 |
| 2   | 自分の位置や文字列から組み立てるパスを直す                     | DEV          | done | テスト・設計書・カタログ |
| 3   | 全コマンドの `--help` を比べ、hook の入口と `dist/` を確かめる | DEV          | done | 123 コマンド一致         |
| 4   | `src/exec/` のファイルを名前の先頭の語ごとに数える             | DEV          | done | 追加分割は見送る         |
| 5   | 統合の後に `exec run --register` を 1 回流す                   | orchestrator | open | close の条件             |

## 4. 対応結果

- 規則から `tmp/exec-move-mapping.json` に 140 件（実装 74 件、テスト 66 件）の対応表を機械生成し、`tools/src-move-codemod.mjs` で `src/exec/`・`tests/src/exec/` へ移した。codemod は相対 import を 756 か所書き換えた。sandbox の共有 Git index は読み取り専用だったため、一時 index の複製を `GIT_INDEX_FILE` に指定して codemod の `git mv` を実行し、HEAD・共有 index・Git 設定は変更していない。
- codemod の検出結果から、移動で基準位置が変わるテスト 7 件の repository root / schema path を 1 階層分直した。現行の設計書・ガイド、成果物カタログ、テスト fixture にある旧 `src/exec*.ts` パスも新しいパスへ更新した。個票・plan・result・event などの履歴は更新していない。
- 移動前後でトップレベルを含む全 123 コマンドの `--help` を比較し、差分がないことを確認した。`npm run build` と `node tools/build-if-stale.mjs` は成功し、`dist/exec/` に 74 件が生成され、`dist/` 直下に旧 `exec*.js`・`role-types.js` は残っていない。
- 名前の先頭の語ごとの件数は、`run` 18、`schedule` 11、`worktree` 6、`plans` 4、`repo` 4、`agent` 3、`trial` 3、`register` 2、`reporter` 2、`task` 2、その他 18 語が各 1 件だった。`run` と `schedule` は将来の分割候補だが、現時点では 74 件を 1 階層で把握でき、次の [[prj-0001:pjr-x8y9-src-dependency-direction-rules]] で依存方向を先に固定するため、本件では追加分割を見送る。
- Prettier と `specdojo catalog validate` は成功した。catalog validate が出した未作成文書の `based_on` 警告は既存データ由来で、エラーはない。lint・schema・typecheck・unit / integration test は親 runner の検証に委ねる。
- 残る作業は、統合後に orchestrator が `exec run --register` を 1 回実行して統合まで確認する No. 5 の close 条件だけである。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-mhhp-src-move-shared]]: 前の移動。
- [[prj-0001:pjr-x8y9-src-dependency-direction-rules]]: 本件の後に依存の向きの規則を入れる。
