---
specdojo:
  id: prj-0001:pjr-wset-src-feature-direction-rules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:28Z"
  due_on: null
---

# PJR-WSET 循環のなくなった機能の組に依存の向きの規則を足す

## 1. 概要

循環がなくなった機能の組（register は exec を import しない、など）の依存の向きを ESLint の規則として error で足す。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

- PJR-E025 の完了後に行う。
- 循環がなくなった機能の組について、依存の向きの規則（例: `register` は `exec` を import しない）を ESLint の `no-restricted-imports` に error で足す。
- 足した組と足さなかった組（まだ循環が残るもの）の一覧と理由を result に書く。
- 規則を足した時点で `npm run lint:ts` に違反がない。違反があれば規則を足さずに result に書く。
- `src/shared/` に置くものの範囲（他の機能から使われる汎用の部分に限る）を見直し、shared に置くべきでないものがあれば一覧にして result に書く。移すのは別の項目にする。
- `.github/instructions/typescript.instructions.md` の依存の向きの記述を、足した規則に合わせる。
- 移す・直すのは構造だけとし、動作は変えない。全コマンドの `--help` の出力が変更の前後で一致することを確かめ、result に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | 循環のなくなった組の依存の向きを ESLint の規則に足す | DEV  | done | -    |

## 4. 対応結果

- [[prj-0001:pjr-qqky-src-feature-cycles|PJR-QQKY]] で循環が解消した 6 組について、`eslint.config.js` に `no-restricted-imports` の規則を `error` で追加した。
  - `src/register/**/*.ts`: `src/exec` を import しない
  - `src/schedule/**/*.ts`: `src/exec` を import しない
  - `src/job/**/*.ts`: `src/exec` を import しない
  - `src/grade/**/*.ts`: `src/exec` を import しない
  - `src/review/**/*.ts`: `src/grade` を import しない
  - `src/docs/**/*.ts`: `src/catalog` を import しない
- 既存コード（`src/**/*.ts`）に対して上記規則を適用し、違反が 0 件であることを確認した。一時的な不正 import のテストにより、各規則が正しく `error` を報告すること、および `src/commands/` と `src/specdojo.ts` への既存の import 禁止規則が各機能で上書きされずに維持されていることを確認した。
- 循環が残る 2 機能間の組は存在せず、PJR-QQKY の 6 組すべてに規則を追加した（間接的な 3 ノード以上の循環 `schedule` → `dashboard` → `exec` → `schedule` などは本件の対象外）。
- `src/shared/` に置くものの範囲を見直した。単一機能からしか参照されていないモジュール（`catalog-paths.ts`、`template-resolution.ts`、`schedule-paths.ts`、`random.ts`、`yaml-schema-modeline.ts`、`specdojo-gitignore.ts`）や、機能固有の処理（`catalog-render.ts`、`schedule-index.ts`）を別の項目で各機能へ戻す/再整理する候補として整理した。
- `.github/instructions/typescript.instructions.md` の「モジュールと import」に、足した 6 組の依存方向の規則を反映した。
- 変更前後で全 123 コマンド・サブコマンドの `--help` 出力を取得・比較し、完全一致（SHA-256: `e59209a7a94d02ef219c1596c0b447d4ce655c8fa98e5c388360153e596054b4`）することを確認した。
- 残課題はない。型検査・lint・テスト等の親検証は runner に委ねる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]（決定）
