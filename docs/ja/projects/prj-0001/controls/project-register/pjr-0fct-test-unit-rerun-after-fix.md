---
specdojo:
  id: prj-0001:pjr-0fct-test-unit-rerun-after-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: ARC
  registered_at: "2026-08-23T07:24:10Z"
  due_on: "2026-08-31"
  block_reason: 'agent exited with non-zero code: reporter output invalid after 3 format attempts: response is not a single JSON value: Unexpected token ''I'', "I need to "... is not valid JSON'
---

# PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する

## 1. 概要

起票時の課題は「`test:unit` は1回だけ実行する」規約が、失敗を修正した後の再検証まで禁止すると解釈され、executor が失敗を抱えたまま終了する事象であった。この事象は PJR-QVGX により解消している。`test-unit` が親検証へ移り、executor は `npm run test:unit` を実行しなくなったためである。実行3件の evidence でも executor 側は `not_run` で、親 runner が実行している。

一方で `xep-common-conventions-template.md` に記述の矛盾が生じた。

| 行  | 内容                                                                              |
| --- | --------------------------------------------------------------------------------- |
| 18  | 全件 test を求める場合は「全件を1回だけ実行して対象限定の実行を省く」             |
| 19  | 親検証に設定された ID のコマンドは executor が sandbox 内で実行しない（PJR-QVGX） |
| 31  | 対応表で「pipeline executor は `npm run test:unit`」と指示                        |

31行目は19行目と矛盾する。現状は19行目が優先されて動いているが、規約としては不整合である。`parent_validations` の設定を変えた場合（`test-unit` を外した場合など）に、どちらに従うかが定まらない。

なお18行目の「1回だけ」は、親検証に含まれない test script には依然適用される。この記述自体を削除するわけではない。

## 2. 完了条件

- `xep-common-conventions-template.md` の test 実行に関する記述に矛盾がない。親検証に設定された場合とされない場合の双方で、executor が何を実行すべきかが一意に定まる。
- 31行目の対応表と19行目の規約の関係が整理されている。対応表を条件付きの記述に改めるか、親検証の設定に依存しない形へ変えるかは判断してよい。判断した理由を記録する。
- 18行目の「全件を1回だけ実行して対象限定の実行を省く」の適用範囲が明確である。親検証に含まれない test script には引き続き適用されることが分かる。
- `parent_validations` から `test-unit` を外した場合でも、規約が矛盾しない。設定に依存して意味が変わる記述を残さない。
- 生成される plan に規約が正しく展開される。既存テストの期待値が新しい文言と整合していることを確認する。
- `npm run lint:md`、`npm run lint:fm`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態        | メモ                                                     |
| --- | ----------------------------------------------------- | ---- | ----------- | -------------------------------------------------------- |
| 1   | test 実行に関する3つの記述の関係を整理する            | ARC  | done        | 18行目・19行目・31行目の対応表                           |
| 2   | 矛盾しない記述へ改め、判断した理由を記録する          | ARC  | done        | 設定に依存して意味が変わる記述を残さない                 |
| 3   | plan への展開を確認し、既存テストの期待値を整合させる | ARC  | in-progress | `npm run test:unit` は親 runner 実行のため未実行・未検証 |

## 4. 対応結果

- `xep-common-conventions-template.md` の test 実行記述（旧18・19・31行目）を矛盾しない形へ整理した。判断は「下表の31行目の実行指示は、対象の test script が設定済み親検証 ID（`test-unit` 等）に含まれていない場合のみ有効とし、含まれている場合は19行目の二重実行防止優先順位に従う」こととした。理由：起票時点では19行目（親検証へ移して executor は `npm run test:unit` を実行しない）が実際の動作で優先されており、31行目はそれに先立つ一般表であったため、親検証への設定が真の条件として記述を条件化するだけで整合が取れ、既存動作を変えない。
- 31行目（対応表）の `src/`・`tests/`・`docs/ja/specdojo/templates/`・`vitest.config.*` 行を条件付き改め「pipeline executor は、設定済み親検証 ID（`test-unit` 等）に含まれていない場合のみ `npm run test:unit` を実行し、それ以外は `npm test`。親検証に含まれている場合は二重実行防止の優先順位に従い executor は sandbox 内で実行せず親 runner が実行する」とした。
- 18行目の「全件を1回だけ実行して対象限定の実行を省く」は削除せず、その適用範囲を明記し、親検証除外であることを付した（この記述が親検証に設定された test script までの再実行を禁止するわけではない旨）。「1回だけ」は executor が sandbox 内で実行する test script の回数に関する制約であり、親 runner による実行とは別の話であることを明示した。
- 「19行目」「31行目」のようなテンプレートのソース行番号への言及は、生成 plan に注入された読者には無意味であるため、トピック（二重実行防止の優先順位・下表の実行指示）に基づく記述に置換した。
- 既存テストとの整合：`tests/src/exec-plans.test.ts` が期待する「全件を1回だけ実行して対象限定の実行を省く」「executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない」の文言をそのまま保持しているため、テンプレート変更で単体テストは壊れない。テンプレートの全文が plan に injection される（`src/exec-plans.ts` の `injectCommonConventions`）ため、生成 plan への展開も同一テキストとして効く。
- 残課題（作業内容3）：「生成される plan に規約が正しく展開され、既存テストの期待値と整合」ことの最終確認は、`npm run test:unit` が pipeline executor では親 runner 実行に該当するため executor 側で未実行・未検証である。本件では `npx prettier --write` と `npx markdownlint` で静的検査を通過済み。単体テストの実行結果（展開内容との整合確認）は後続の親 runner 実行または人間で要確認。フロントmatter・状態・due_on・title・セクション1は変更していない。

## 5. 関連ドキュメント

- 矛盾を生じさせた項目: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxで子プロセスが成立せず検証が常に失敗する問題を解消する]]
- 起票の契機となった事象: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 二重実行のハングを扱った項目: [[prj-0001:pjr-17s7-unit-test-double-run-hang|PJR-17S7 executorがunit testを二度実行しVitestの終了待ちが収束しない]]
- 対象ファイル: `docs/ja/specdojo/templates/xep-common-conventions-template.md`
