---
specdojo:
  id: prj-0001:pjr-q2at-exec-parent-validation-aggregate-not-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-14T22:51:42Z"
  block_reason: "parent validation failed: validate-schema"
  commit_type: fix
  commit_scope: exec
---

# PJR-Q2AT 親の検証をまとめた not_run の行で executor の検証を失敗と取り違えない

## 1. 概要

親 runner の検証を 1 行にまとめた not_run を親の検証の結果で読み替える

## 2. 入力

- 2026-11-15 の夜間に cnd-080 が、親の検証 9 件がすべて通ったのに「executor validation failed or not run」で止まった

## 3. 完了条件

- executor の evidence に、親 runner の検証 ID をまとめて書いた 1 行（例: `parent runner: lint-ts, lint-fm, …`）が `not_run` で含まれていても、親の検証がすべて通っていれば「executor validation failed or not run」で止めない。
- まとめた行の判定は、行に挙がった検証 ID がすべて `pipeline.parent_validations` に含まれる場合に限る。設定にない検証や、親 runner の結果がない検証が混じる場合は、今どおり止める。
- 1 件ずつ書いた `not_run` の行と、まとめた 1 行の両方を、回帰テストで確かめている。
- 親の検証を evidence に書くときの決まり（書かない、または 1 件ずつ書く）を、exec plan の共通規約か executor の指示に明記し、まとめた行が生まれにくくしている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | まとめた not_run 行を親の検証の結果で読み替える | DEV  | done | -    |
| 2   | 回帰テストと共通規約の記述を足す                | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/parent-validation.ts` に `isAggregatedParentValidationSatisfied` を足した。executor の行のコマンド末尾にある、区切り（`,` または `、`）で並んだ検証ラベルを取り出し、すべてのラベルに親 runner の記録があり、その記録が `passed` か `not_applicable`（変更の種類で流さなかった検証）のときだけ満たしたものとする。
- `src/exec/reporter.ts` の `deriveReporterFacts` で、executor の `not_run` / `not_applicable` の行をこの判定で読み替える。行に挙がった検証のうち 1 件でも親 runner の記録がない（`pipeline.parent_validations` に設定されていない、または未知の ID）場合や、列を読み取れない場合は、今どおり「executor validation failed or not run」で止める。
- `src/exec/run/agent.ts` の executor の指示と `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md` の共通規約に、親の検証を evidence に含めるときは検査ごとに 1 行ずつ実際のコマンドで書き、まとめないことを足した。
- `tests/src/exec/reporter.test.ts` に、1 件ずつ書いた `not_run` の行、まとめた 1 行（英語の `:` 区切り、日本語の括弧書き）、止める場合（設定にない検証、未知のラベル、`…` を含む列、親 runner の記録がない場合）の回帰テストを足した。`tests/src/exec/run/run.test.ts` で executor の指示の文言を確かめる。

### 5.2. 判断した点

- 親 runner の記録が evidence にある検証を「`pipeline.parent_validations` に設定された検証」とみなした。runner は設定された検証ごとに、流さなかった場合も `not_applicable` で記録を残すため、設定と記録が 1 対 1 に対応する。設定そのものを reporter に渡す変更より小さく済む。
- ラベルは runner の記録と同じ形（プロジェクトリポジトリは `<id>`、製品リポジトリは `<repo>:<id>`）で照合する。
- `npm`・`npx`・`specdojo` などで始まる行はコマンドそのものとして扱い、まとめた行とみなさない（`npm run lint:md` の `lint:md` をラベルと取り違えないため）。
- 例の `lint-ts, lint-fm, …` のように省略記号を含む列は、どの検証を指すか確かめられないため止める側に倒した。
- まとめた行の `not_applicable` も、1 件ずつの行と同じく読み替える対象にした。

### 5.3. CHANGELOG に書く事項

- Fixed: pipeline の executor が親 runner の検証を 1 行にまとめて `not_run` と報告したとき、親の検証がすべて通っていても「executor validation failed or not run」で止まっていた。挙がった検証がすべて親 runner で通っていれば先へ進める。
- Changed: executor の指示と exec plan の共通規約で、親の検証を evidence に含める場合は検査ごとに 1 行ずつ書くよう求める。

### 5.4. 残課題

- なし

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
