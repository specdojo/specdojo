---
specdojo:
  id: prj-0001:xer-pjr-tmaw-20261015t145958z-b5ce
  type: exec-result
  task_id: PJR-TMAW
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-tmaw-20261015T145958Z-b5ce-plan.md
  started_at: "2026-10-15T14:59:58.937Z"
  completed_at: "2026-10-15T15:47:33.715Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- PJR-TMAW の原因は、`src/exec-results.ts` が result の frontmatter を文字列連結で書き、`block_reason` を二重引用符で囲むだけだったことです。改行を含む理由では 2 行目以降が字下げされず、YAML として不正になっていました。
- `block_reason` の改行・引用符・バックスラッシュを保持する安全な YAML 直列化を実装しました。回帰テストも追加しました。
- 字下げ不備で `lint:fm` が落ちていた過去 3 件の result を修復しました。executor は、修復前後で `block_reason` の値が一致することと、786 件の result に同形式の不正 YAML が残っていないことを確認したと報告しています。
- runner が実行した検証はすべて passed です。対象は `lint:ts`、`lint:fm`、`lint:md`、`test:integration`、`validate:schema`、`typecheck`、`test:unit` です。`lint:ts` は error 0 件で、既存の `max-lines-per-function` 警告が 25 件ありました。

## 2. 変更ファイル

- `src/exec-results.ts`: result の frontmatter を書く処理で、`block_reason` を改行・引用符・バックスラッシュを保持したまま安全に YAML 直列化するよう修正しました。
- `tests/src/exec-results.test.ts`: `block_reason` に改行・引用符・バックスラッシュを含む場合でも、有効な YAML として出力され値が保たれることを確認する回帰テストを追加しました。

## 3. 申し送り

- executor evidence の `changes` に含まれる変更ファイルは `src/exec-results.ts` と `tests/src/exec-results.test.ts` の 2 件だけです。過去 3 件の result の修復と個票への記入は、`changes` に載っていないため、この範囲では確認できません。executor の final message と Prettier の対象ファイル一覧からそうした作業が行われたことは読み取れますが、変更内容の確認はレビュー時に必要です。
- `test:unit` の出力には `error: unknown option '--reserve'` などの CLI エラー文言や `reporter failedproblem` が含まれていました。ただし終了コードは 0 で、status は passed です。テストが意図的に発生させた出力と思われますが、証拠が省略されているため断定できません。
- 登録簿 `pjr-index.md` の行と個票のステータス項目は、plan の指示どおり変更していません。状態遷移は runner と人間が行ってください。

## 4. 進め方と実践の型の適用

原因は、result の frontmatter 書き出しで `block_reason` を二重引用符で囲むだけにしていたことでした。改行を含むと 2 行目以降が字下げされず、js-yaml 5 で deficient indentation になっていました。そこで `src/exec-results.ts` に安全な YAML 直列化を入れ、`tests/src/exec-results.test.ts` に回帰テストを追加しました。あわせて既存の不正な result 3 件を修復し、修復前後で値が一致することを確認しました。
