---
specdojo:
  id: prj-0001:pjr-mhhp-src-move-shared
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:34Z"
  due_on: null
---

# PJR-MHHP 共通の処理を src/shared へ移す

## 1. 概要

codemod で yaml・git-environment・specdojo-config・spawn-self などの共通の処理を src/shared/ へ移す。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定（3.1 の追加の決定を含む）に基づく 5 件目の移動。コマンドの実装を `src/commands/`、共通の処理を `src/shared/` へ移す。`role-types` は [[prj-0001:pjr-xp0j-src-move-exec]] で `src/exec/` へ移すため本件では移さない。`src/specdojo.ts` は直下に残す。

移す対応表:

| 移す前                                        | 移した後                                             |
| --------------------------------------------- | ---------------------------------------------------- |
| `src/build-command.ts`                        | `src/commands/build.ts`                              |
| `src/init-command.ts`                         | `src/commands/init.ts`                               |
| `src/orchestrator.ts`                         | `src/commands/orchestrator.ts`                       |
| `src/watch.ts`                                | `src/commands/watch.ts`                              |
| `src/agent.ts`                                | `src/commands/agent.ts`                              |
| `src/agent-response.ts`                       | `src/shared/agent-response.ts`                       |
| `src/build-if-stale.ts`                       | `src/shared/build-if-stale.ts`                       |
| `src/dist-freshness.ts`                       | `src/shared/dist-freshness.ts`                       |
| `src/git-environment.ts`                      | `src/shared/git-environment.ts`                      |
| `src/package-paths.ts`                        | `src/shared/package-paths.ts`                        |
| `src/practice-id.ts`                          | `src/shared/practice-id.ts`                          |
| `src/spawn-self.ts`                           | `src/shared/spawn-self.ts`                           |
| `src/specdojo-config.ts`                      | `src/shared/specdojo-config.ts`                      |
| `src/specdojo-gitignore.ts`                   | `src/shared/specdojo-gitignore.ts`                   |
| `src/yaml-schema-modeline.ts`                 | `src/shared/yaml-schema-modeline.ts`                 |
| `src/yaml.ts`                                 | `src/shared/yaml.ts`                                 |
| `tests/src/agent-command.test.ts`             | `tests/src/commands/agent.test.ts`                   |
| `tests/src/build-command.test.ts`             | `tests/src/commands/build.test.ts`                   |
| `tests/src/build-command.integration.test.ts` | `tests/src/commands/build.integration.test.ts`       |
| `tests/src/init-command.test.ts`              | `tests/src/commands/init.test.ts`                    |
| `tests/src/orchestrator-command.test.ts`      | `tests/src/commands/orchestrator.test.ts`            |
| `tests/src/agent-response.test.ts`            | `tests/src/shared/agent-response.test.ts`            |
| `tests/src/dist-freshness.test.ts`            | `tests/src/shared/dist-freshness.test.ts`            |
| `tests/src/git-environment-isolation.test.ts` | `tests/src/shared/git-environment-isolation.test.ts` |
| `tests/src/package-paths.test.ts`             | `tests/src/shared/package-paths.test.ts`             |
| `tests/src/practice-id.test.ts`               | `tests/src/shared/practice-id.test.ts`               |
| `tests/src/spawn-self.test.ts`                | `tests/src/shared/spawn-self.test.ts`                |
| `tests/src/specdojo-config-command.test.ts`   | `tests/src/shared/specdojo-config-command.test.ts`   |
| `tests/src/specdojo-config-env.test.ts`       | `tests/src/shared/specdojo-config-env.test.ts`       |
| `tests/src/specdojo-config-repos.test.ts`     | `tests/src/shared/specdojo-config-repos.test.ts`     |
| `tests/src/specdojo-config.test.ts`           | `tests/src/shared/specdojo-config.test.ts`           |
| `tests/src/specdojo-gitignore.test.ts`        | `tests/src/shared/specdojo-gitignore.test.ts`        |
| `tests/src/yaml.test.ts`                      | `tests/src/shared/yaml.test.ts`                      |

条件:

- `tools/src-move-codemod.mjs` で上の対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- 次の、自分の位置や文字列からパスを組み立てる箇所を、移した後も同じ場所を指すよう直す。
  - `tools/build-if-stale.mjs` が `src/build-if-stale.ts` を文字列のパスで起動している。merge と checkout の hook（`lefthook.yml` の `build-if-stale`）の入口であり、ずれると dist が更新されず runner が古いコードで動くため、必ず直す。
  - `src/shared/build-if-stale.ts`・`src/shared/package-paths.ts`・`src/shared/yaml.ts` の `import.meta.url` からのパス。
  - `src/shared/spawn-self.ts` と `src/shared/dist-freshness.ts` の `dist/specdojo.js` の位置の求め方（`src/specdojo.ts` は直下に残るため、`dist/specdojo.js` の位置は変わらない）。
  - `tests/setup/git-environment.ts` の import と、`.github/instructions/vitest.instructions.md` の `src/git-environment.ts` の記載。
- 移す前と後で、全コマンドの `--help` の出力が一致する（`build`・`init`・`watch`・`agent`・`config` などコマンドの実装を移すため、`specdojo --help` に出る全コマンドとそのサブコマンドを比べる）。前後の出力を `tmp/` に保存して比べ、比べたコマンドの数と差分がないことを result に記録する。
- 移した後に `node tools/build-if-stale.mjs` を実行し、hook の入口が動くことを確かめる。
- `npm run build` の後に、`dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 本件は runner が使う共通の処理（`spawn-self` など）を移すため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                           | 担当         | 状態 | メモ                            |
| --- | -------------------------------------------------------------- | ------------ | ---- | ------------------------------- |
| 1   | codemod で対応表のとおりに移す                                 | DEV          | done | 実装 16 件、テスト 17 件        |
| 2   | 自分の位置や文字列から組み立てるパスを直す                     | DEV          | done | `tools/build-if-stale.mjs` ほか |
| 3   | 全コマンドの `--help` を比べ、hook の入口と `dist/` を確かめる | DEV          | done | help 123 対象で差分なし         |
| 4   | 統合の後に `exec run --register` を 1 回流す                   | orchestrator | open | close の条件                    |

## 4. 対応結果

- `tools/src-move-codemod.mjs` に対応表を渡し、コマンド実装 5 件を `src/commands/`、共通処理 11 件を `src/shared/`、対応テスト 17 件を `tests/src/commands/`・`tests/src/shared/` へ移した。相対 import の書き換えも codemod の出力を反映した。
- codemod の検出結果に基づき、`tools/build-if-stale.mjs` の委譲先と対応テスト、`src/shared/build-if-stale.ts` と `src/shared/package-paths.ts` の package root、移動したテスト 2 件の repository root を手動で補正した。`src/shared/yaml.ts` の `createRequire(import.meta.url)`、`src/shared/spawn-self.ts`、`src/shared/dist-freshness.ts` は移動後も同じ対象を指すため変更不要と確認した。
- `.github/instructions/vitest.instructions.md`、製品設計書、運用ガイド、設定 schema、成果物カタログに記載された旧 `src/...` パスを新配置へ更新した。
- CLI ルートを含む全 123 help 対象の出力を移動前後で比較し、差分がないことを確認した。`npm run build` で `dist/` を全消去して再生成し、旧直下出力が残らず `dist/commands/`・`dist/shared/` に新配置どおり出力されることを確認した。`node tools/build-if-stale.mjs` も終了コード 0 で完了した。
- `catalog build`・`catalog validate`・`register build` を実行し、更新したカタログと個票から生成物を再生成できることを確認した。catalog 検証は成功し、既存の未作成文書に対する `based_on` 警告だけを報告した。
- 親 runner の検証は executor 終了後に実行される。統合後の `exec run --register` は orchestrator が実施する close 条件として残る。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-yh9q-src-move-grade-register]]: 前の移動。
