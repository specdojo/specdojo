---
specdojo:
  id: prj-0001:pjr-2bxd-grade-plan-generated-default
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-09-11T22:51:33Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-11T22:53:13Z"
  conclusion: grade plan の既定保存先を execution/grade/generated/plans/`<target>`/ へ変更し、generated/ の規約（git 管理外・索引除外）に揃えた。command-reference と directory-layout-reference を更新し、実行して保存先・gitignore・索引除外を確認した。run-per-document.sh の経路は --out 指定のため影響なし。
---

# PJR-2BXD grade plan の既定保存先を execution/grade/generated/ 配下へ変更する

## 1. 概要

grade plan の既定保存先 `execution/grade/plans/<target>/` は `generated/` の規約（`.gitignore` の `docs/**/generated/*`、`doc-index` の `generated` 除外）の外にあり、8/30 の grade 開発中に手動実行した plan 7 件が commit されたまま陳腐化していた（`b114d998` で削除済み）。plan は対象文書から決定的に再生成でき、同じ対象は同じファイルへ上書きされる派生生成物のため、既定を `execution/grade/generated/plans/<target>/` へ変更して規約に揃える。

`execution/generated/grade/` に集約する案も検討したが、追跡すべき状態（`execution/grade/criteria/`）の隣に生成物を置く `jobs/` と `jobs/generated/` などと同じ配置を採る。routine / job が使う `tools/grade/run-per-document.sh` は `--out` で `logs/` 配下へ書くため影響を受けない。

## 2. 完了条件

- `grade plan` を `--out` なしで実行すると `<execution_path>/grade/generated/plans/<target>/` へ保存される。
- 保存された plan が `.gitignore` により git 管理外となり、`index build` の索引にも含まれない。
- `command-reference` と `directory-layout-reference` の記述が新しい既定と一致している。
- `npm run typecheck`、`npm run lint:ts`、`npm run lint:md`、grade の単体テストが成功する。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                        |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------------------- |
| 1   | `src/grade.ts` の既定保存先を変更する          | ARC  | done | `grade/generated/plans/<target>`            |
| 2   | command-reference の既定保存先の記述を更新する | ARC  | done | generated の性質（git・索引の対象外）も明記 |
| 3   | directory-layout-reference の grade 配下を更新 | ARC  | done | `criteria/` と `generated/plans/` を反映    |
| 4   | 実行して保存先・gitignore・索引除外を確認する  | ARC  | done | mm-rulebook を対象に `grade plan` を実行    |

## 4. 対応結果

- `src/grade.ts` の `grade plan` 既定保存先を `join(executionPath, "grade", "generated", "plans", target)` へ変更した。`--out` の挙動と `run-per-document.sh` の経路は変更していない。
- `command-reference` の `grade plan` 節に新しい既定と、`generated/` が git 管理・索引の対象外である旨を追記した。`directory-layout-reference` の `execution/grade/` 配下を `criteria/` と `generated/plans/<target>/` の構成へ更新した。
- `mm-rulebook` を対象に `grade plan` を実行し、`execution/grade/generated/plans/kata/` へ 2 ファイルが書かれること、`.gitignore:98` で無視されること、`index build` の索引に plan の id が含まれないことを確認した。確認後の出力は削除した。
- `npm run typecheck`、`npm run lint:ts`、`npm run lint:md`、`tests/src/grade.test.ts` と `tests/tools/grade-per-document.test.ts`（59 件）が成功した。
- 残課題はない。

## 5. 関連ドキュメント

- 既定保存先の設計経緯: [[prj-0001:pjr-4tz7-grade-per-document]]
- 保存先の説明: [[specdojo:command-reference]]
- ディレクトリ構成: [[specdojo:directory-layout-reference]]
