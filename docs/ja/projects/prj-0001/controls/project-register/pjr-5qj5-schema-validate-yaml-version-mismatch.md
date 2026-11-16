---
specdojo:
  id: prj-0001:pjr-5qj5-schema-validate-yaml-version-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:12Z"
---

# PJR-5QJ5 validate:schema:file と strategy のテストで、YAML の読み方が違う

## 1. 課題内容

task_suffix の 090（引用符なし）を validate:schema:file は文字列として受け、strategy のテストは数値として落とした

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 影響範囲

| 観点         | 影響                                                                |
| ------------ | ------------------------------------------------------------------- |
| スコープ     | `validate:schema:file` と schedule の strategy を読むテスト・コード |
| スケジュール | 同じ YAML の値が、検証では通り、テストや実装では落ちる              |
| コスト       | 食い違いの調査に時間がかかる                                        |
| 品質         | `task_suffix: 090` のような値で検査の結果が食い違う                 |
| 関係者       | DEV                                                                 |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `validate:schema:file` と strategy のテスト（とその読み込み）で、YAML の読み方（YAML 1.1 と 1.2 の数値の解釈など）が違う。引用符のない `090` を一方は文字列、他方は数値として読む                                                    |
| 対応策   | YAML の読み込みを共通の設定（同じライブラリ・同じ schema の版）にそろえる。`schedule strategy generate` が書く `task_suffix` は文字列として引用符を付けて書く                                                                        |
| 依存事項 | なし                                                                                                                                                                                                                                 |
| 完了条件 | 引用符のない `task_suffix: 090` を、`validate:schema:file`・strategy のテスト・実装の読み込みが同じ型として扱うことを回帰テストで確かめる。strategy generate の出力の `task_suffix` に引用符が付く。`npm run check` と親の検証が通る |

## 5. 対応結果

- 原因: `validate:schema:file`（`packages/docs-lint/src/yaml.ts`）と実装（`src/shared/yaml.ts` 経由の `readYaml`）は js-yaml 5 の `YAML11_SCHEMA` で読み、引用符のない `090` を文字列 `"090"` とする。strategy のテストは `js-yaml` の `load` を直接 import しており、js-yaml 5 の既定（core schema）で数値 `90` として読んでいた。
- 対応: strategy を読むテスト（`tests/docs/specdojo/schemas/sch-strategy-schema.test.ts`、`tests/src/schedule/strategy-generate.test.ts`、`tests/src/schedule/command.test.ts`、`tests/src/schedule/build.test.ts`）と schema 検証の helper（`tests/helpers/schema.ts`）の YAML の読み書きを `src/shared/yaml.ts` に切り替えた。
- 回帰テスト: 引用符のない `task_suffix: 090` を docs-lint の読み込み・テストの読み込み・`loadStrategyDocument` がいずれも `"090"` と読み、schema を通ることを `sch-strategy-schema.test.ts` で確かめる。`schedule strategy generate` の出力の `task_suffix` がすべて `"NNN"` の形で引用符付きになることを `strategy-generate.test.ts` で確かめる（`dumpStrategy` はすでに引用符を付けていたため、実装は変えていない）。
- 申し送り: ほかのテストにも `js-yaml` の `load` を直接 import するものが残る（`tests/src/catalog/**` など）。再発を防ぐには、テストでの `js-yaml` の直接 import を ESLint の `no-restricted-imports` で禁じる別の項目を起票するとよい。

## 6. 関連ドキュメント

- [[prj-0001:pjr-v2gh-strategy-generate-keep-modeline]]
