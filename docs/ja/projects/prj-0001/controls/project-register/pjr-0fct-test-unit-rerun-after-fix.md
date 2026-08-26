---
specdojo:
  id: prj-0001:pjr-0fct-test-unit-rerun-after-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-23T07:24:10Z"
  due_on: "2026-08-31"
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

| No  | 作業                                                  | 担当 | 状態 | メモ                                     |
| --- | ----------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | test 実行に関する3つの記述の関係を整理する            | ARC  | open | 18行目・19行目・31行目の対応表           |
| 2   | 矛盾しない記述へ改め、判断した理由を記録する          | ARC  | open | 設定に依存して意味が変わる記述を残さない |
| 3   | plan への展開を確認し、既存テストの期待値を整合させる | ARC  | open | 文言を変えた場合                         |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 矛盾を生じさせた項目: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxで子プロセスが成立せず検証が常に失敗する問題を解消する]]
- 起票の契機となった事象: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 二重実行のハングを扱った項目: [[prj-0001:pjr-17s7-unit-test-double-run-hang|PJR-17S7 executorがunit testを二度実行しVitestの終了待ちが収束しない]]
- 対象ファイル: `docs/ja/specdojo/templates/xep-common-conventions-template.md`
