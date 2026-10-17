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

| No  | 作業                                                           | 担当         | 状態 | メモ             |
| --- | -------------------------------------------------------------- | ------------ | ---- | ---------------- |
| 1   | 規則から対応表を作り、codemod で移す                           | DEV          | open | 手で書き換えない |
| 2   | 自分の位置や文字列から組み立てるパスを直す                     | DEV          | open | -                |
| 3   | 全コマンドの `--help` を比べ、hook の入口と `dist/` を確かめる | DEV          | open | -                |
| 4   | `src/exec/` のファイルを名前の先頭の語ごとに数える             | DEV          | open | 判断材料         |
| 5   | 統合の後に `exec run --register` を 1 回流す                   | orchestrator | open | close の条件     |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-mhhp-src-move-shared]]: 前の移動。
- [[prj-0001:pjr-x8y9-src-dependency-direction-rules]]: 本件の後に依存の向きの規則を入れる。
