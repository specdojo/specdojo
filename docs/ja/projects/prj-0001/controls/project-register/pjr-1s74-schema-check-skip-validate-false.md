---
specdojo:
  id: prj-0001:pjr-1s74-schema-check-skip-validate-false
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T21:03:15Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-1S74 YAML の変更に求める schema の検査から、検査しない印の付いた template を外す

## 1. 概要

runner は変えた YAML すべてに validate:schema:file を求め、validate=false の template（pm-members-template.yaml）でも検査が無いとして止める。印の付いた YAML を外す

## 2. 入力

- 第 6 波の T-KATA-WAVE-6-PROJECT-pm-members-sample-060 が、template に validate=false があるのに「executor validation failed or not run: npm run validate:schema:file」で止まった（2026-11-24）
- pm-members の template の `scheduler_strategy` は固定の値に戻す（利用者の判断、2026-11-24）

## 3. 完了条件

- `src/exec/reporter.ts` の `CHANGE_SCOPED_VALIDATIONS` で、YAML の変更に `npm run validate:schema:file` を求める判定から、先頭に `specdojo-schema: validate=false`（`src/kata/yaml-schema-modeline.ts` の書式）を持つ YAML を外す。`specdojo-schema: none` の扱いも同じ考え方で揃え、決めた扱いと理由を個票の対応結果に書く。
- `npm run validate:schema:file` に `validate=false` の YAML を渡したときは、検査を飛ばしたことと理由を出して終了コード 0 で終える（`validate:schema:yaml` の「validation skipped: template」と同じ扱い）。すでにそうなっている場合は、確かめた結果を書く。
- 単体テストで、`validate=false` の template だけを変えた場合は検査が求められないこと、ふつうの YAML を変えた場合は今までどおり求められることを確かめる。
- 統合の後、止まっている `T-KATA-WAVE-6-PROJECT-pm-members-sample-060` を `exec resume --task T-KATA-WAVE-6-PROJECT-pm-members-sample-060 --resume-from executor` で流し直し、通ることを確かめる。そのとき、template の `scheduler_strategy` を空欄（`_SCHEDULER_STRATEGY_`）から固定の値 `critical-first` に戻すよう指示する（利用者の判断、2026-11-24）。この再開はオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通す。

## 4. 作業内容

| No  | 作業                                                           | 担当               | 状態 | メモ                                                                                |
| --- | -------------------------------------------------------------- | ------------------ | ---- | ----------------------------------------------------------------------------------- |
| 1   | `CHANGE_SCOPED_VALIDATIONS` の YAML 判定から印付き YAML を外す | DEV                | done | `src/exec/reporter.ts`                                                              |
| 2   | 単体テストの追加                                               | DEV                | done | `tests/src/exec/reporter-schema-check-skip.test.ts`                                 |
| 3   | 止まった task の `exec resume` での流し直し                    | オーケストレーター | open | 統合後にオーケストレーターが行う（`scheduler_strategy` は `critical-first` に戻す） |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/reporter.ts` で、`npm run validate:schema:file` を求める YAML の判定から、先頭に `specdojo-schema:` の directive と `reason=` を持つ YAML を外した。変更が印付き YAML だけなら、検査は適用外として扱う。
- `specdojo-schema: none` も同じ扱いにした。`validate:schema:file` はどちらも `reason=` があれば検査を飛ばして終了コード 0 で終えるため、求めても止めるだけになる。`reason=` のない directive は同コマンドが失敗するので、今までどおり検査を求める。
- YAML の先頭は `ReporterFactOptions.repoRoot`（未指定は `process.cwd()`）を基準に読む。読めない・存在しない場合は今までどおり求める。
- 確かめた結果: `validate:schema:file` は `validate=false` の YAML に「validation skipped: `<reason>`」を出して終了コード 0 で終える（`packages/docs-lint/src/validate-yaml-schema.ts`）。変更は不要だった。
- 単体テスト（`tests/src/exec/reporter-schema-check-skip.test.ts`）で、印付き YAML だけの変更は求めず、ふつうの YAML・`reason=` なしの directive・混在の変更は求めることを確かめた。

### 5.2. CHANGELOG に書く事項

- 区分: Fixed
- 文案: runner が、`specdojo-schema: validate=false` または `none`（`reason=` 付き）の YAML だけを変えた task に `validate:schema:file` を求めて止めていたのを直した。

### 5.3. 残課題

- 統合後に、オーケストレーターが `exec resume --task T-KATA-WAVE-6-PROJECT-pm-members-sample-060 --resume-from executor` で流し直す。template の `scheduler_strategy` は `_SCHEDULER_STRATEGY_` から `critical-first` に戻すよう指示する。

## 6. 関連ドキュメント

- `src/kata/yaml-schema-modeline.ts`（directive の書式）と `src/exec/reporter.ts`（検査要否の判定）
