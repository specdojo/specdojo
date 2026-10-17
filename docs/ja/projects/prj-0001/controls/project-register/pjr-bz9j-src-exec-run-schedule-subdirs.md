---
specdojo:
  id: prj-0001:pjr-bz9j-src-exec-run-schedule-subdirs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:21:51Z"
  due_on: null
---

# PJR-BZ9J src/exec の run と schedule をサブディレクトリへ分ける

## 1. 概要

src/exec の 74 ファイルのうち、run- の 18 ファイルを src/exec/run/、schedule- の 11 ファイルを src/exec/schedule/ へ codemod で移す。残りは src/exec に置く。PJR-V23P の決定の 4（移した後の実態を見て決める）に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定の 4（`src/exec/` の中をさらに分けるかは移した後の実態を見て決める）に基づく。[[prj-0001:pjr-xp0j-src-move-exec]] の後の `src/exec/` は 74 ファイルで、先頭の語は `run-` が 18、`schedule-` が 11、`worktree-` が 6 などだった。まとまりの大きい `run` と `schedule` だけを分け、残りは `src/exec/` に置く（2026-10-17、利用者が承認）。

対応表の規則（executor が規則から機械的に対応表を作り、`tmp/` に保存して result に件数を記録する）:

| 移す前                                                                    | 移した後                                 |
| ------------------------------------------------------------------------- | ---------------------------------------- |
| `src/exec/run.ts`                                                         | `src/exec/run/run.ts`                    |
| `src/exec/run-<name>.ts`                                                  | `src/exec/run/<name>.ts`                 |
| `src/exec/schedule.ts`                                                    | `src/exec/schedule/schedule.ts`          |
| `src/exec/schedule-<name>.ts`                                             | `src/exec/schedule/<name>.ts`            |
| `tests/src/exec/run-<name>.test.ts`（`.integration.test.ts` を含む）      | `tests/src/exec/run/<name>.test.ts`      |
| `tests/src/exec/schedule-<name>.test.ts`（`.integration.test.ts` を含む） | `tests/src/exec/schedule/<name>.test.ts` |

2026-10-17 時点で、規則のとおりに移しても名前はぶつからない。ソースの名前と対応しないテスト（`run-worker-pool` など）も規則で移す。

条件:

- `tools/src-move-codemod.mjs` で対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- 移す前と後で、`specdojo --help` に出る全コマンドとそのサブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの数と差分がないことを result に記録する。
- 移した後に `node tools/build-if-stale.mjs` が動き、`npm run build` の後に `dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner 自身のコードを移すため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                           | 担当         | 状態 | メモ                                                                                      |
| --- | -------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------------- |
| 1   | 規則から対応表を作り、codemod で移す                           | DEV          | done | 実装29件と明示テスト16件の対応表を生成し、対応テスト1件を含む計46件を codemod で移動した  |
| 2   | 全コマンドの `--help` を比べ、hook の入口と `dist/` を確かめる | DEV          | done | 123コマンドの help が一致し、build・stale 判定と旧 `dist/exec/run*.js` 等の不在を確認した |
| 3   | 統合の後に `exec run --register` を 1 回流す                   | orchestrator | open | close の条件。executor worktree の統合後に実施する                                        |

## 4. 対応結果

`tmp/exec-run-schedule-mapping.json` の対応表を `tools/src-move-codemod.mjs` へ渡し、`src/exec/run.ts` と `run-*.ts` の計18件を `src/exec/run/`、`src/exec/schedule.ts` と `schedule-*.ts` の計11件を `src/exec/schedule/` へ移した。テストは規則に該当する16件に加え、codemod が対応ソースへ追従させた `run.test.ts` の計17件を `tests/src/exec/run/`・`tests/src/exec/schedule/` へ移した。

codemod の残件検出に従い、製品設計書の2パス、`plans-core.ts` の説明用パス、`dist-freshness.test.ts` の模擬パスを新しい配置へ手で更新した。`npm run build` で `dist/` を再生成し、旧配置の出力が残らないことと `node tools/build-if-stale.mjs` の成功を確認した。移動前後の123コマンドの help は `tmp/pjr-bz9j-help-before.json` と `tmp/pjr-bz9j-help-after.json` に保存し、完全一致を確認した。

残課題は、親 runner の検証と統合後に orchestrator が `exec run --register` を1回実行して統合まで完了することの確認である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-xp0j-src-move-exec]]: 前の移動。
