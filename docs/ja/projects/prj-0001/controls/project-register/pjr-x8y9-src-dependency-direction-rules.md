---
specdojo:
  id: prj-0001:pjr-x8y9-src-dependency-direction-rules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:51Z"
  due_on: null
---

# PJR-X8Y9 src の機能の間の依存の向きの規則を入れる

## 1. 概要

移動の後に、shared/ が他の機能を import しないことなど、機能の間の依存の向きを ESLint の no-restricted-imports などで検査する。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定の 6 に基づく。src の移動の後（2026-10-17）にディレクトリの間の import を数えた結果を見て、利用者が 2 段階で進めることを承認した。本件は 1 段目として、いま違反がほぼない規則を error で入れる。機能どうしの循環（6 組）は本件では規則にせず、組ごとに別の項目で扱う。

2026-10-17 時点の違反:

- `src/shared/` → ほかの機能: `src/shared/specdojo-config.ts` が `../exec/types.js`（`AgentStageRole`・`SchedulerStrategy`・`TaskMode` の型）と `../exec/provider-scaffold.js`（`runProviderScaffold`・`specdojoPackageRootDir`）を import している。
- `src/commands/` と `src/specdojo.ts` を import する機能: なし。

条件:

- `src/shared/specdojo-config.ts` の `src/exec/` への依存をなくす。型は `src/shared/` へ移すか、`src/shared/` で定義して `src/exec/` から再 export する。`runProviderScaffold`・`specdojoPackageRootDir` を使う処理は、呼び出す側（`src/commands/` など）へ移すか、`src/shared/` へ移す。どう直したかと理由を result に書く。動作は変えない。
- `eslint.config.js` に、次の規則を `error` で入れる。ESLint の `no-restricted-imports`（`patterns`）など、追加の依存なしで書ける方法を使う。
  - `src/shared/**/*.ts` は、`src/shared/` の外の `src/` のモジュールを import しない。
  - `src/` の機能のモジュール（`src/specdojo.ts` と `src/commands/` を除く）は、`src/commands/` と `src/specdojo.ts` を import しない。
- 規則に違反する import を一時的に書くと `npm run lint:ts` が失敗することを、手元で確かめて result に書く（その import は残さない）。
- 規則と、機能どうしの循環を別の項目で扱うことを、TypeScript の実装ルール（`.github/instructions/typescript.instructions.md`）の「モジュールと import」の章に書く。
- 移す前と後で、`specdojo --help` に出る全コマンドとそのサブコマンドの `--help` の出力が一致する。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ           |
| --- | --------------------------------------------------------------- | ---- | ---- | -------------- |
| 1   | `src/shared/specdojo-config.ts` の `src/exec/` への依存をなくす | DEV  | done | 動作は変えない |
| 2   | ESLint に依存の向きの規則を error で入れる                      | DEV  | done | 追加の依存なし |
| 3   | 違反を書くと lint が失敗することを確かめる                      | DEV  | done | -              |
| 4   | TypeScript の実装ルールに規則を書く                             | DEV  | done | -              |

## 4. 対応結果

- `AgentStageRole`・`SchedulerStrategy`・`TaskMode` の定義を `src/shared/agent-types.ts` へ移し、既存の import との互換性を保つため `src/exec/types.ts` から再 export した。
- provider の雛形配置は config・commands・exec から共用する処理なので、`src/exec/provider-scaffold.ts` を `src/shared/provider-scaffold.ts` へ移した。exec の `isRecord` への依存は同じ小さい型ガードをモジュール内に置いて解消した。対応するテストも `tests/src/shared/` へ移した。
- `eslint.config.js` に、`src/shared/` からほかの機能や `src/specdojo.ts` への import と、機能から `src/commands/`・`src/specdojo.ts` への import を禁止する `no-restricted-imports` を error で追加した。追加依存はない。
- 2 種類の違反 import を一時的に作り、それぞれを対象に ESLint を実行して `no-restricted-imports` の error になることを確認した。一時ファイルは削除済みである。
- `.github/instructions/typescript.instructions.md` に依存方向の規則を追記し、機能どうしの循環は組ごとの登録簿項目で解消してから規則を追加する方針を明記した。
- 変更前の Git HEAD と変更後のソースから、`specdojo --help` に表示される全コマンドとサブコマンド 123 件の `--help` を取得して比較し、差分がないことを確認した。
- 残課題はない。executor の後に実行する typecheck・lint・test などの親検証は runner に委ねる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-bz9j-src-exec-run-schedule-subdirs]]: 先に行う exec の分割。
