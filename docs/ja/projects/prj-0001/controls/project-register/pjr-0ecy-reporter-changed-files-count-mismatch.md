---
specdojo:
  id: prj-0001:pjr-0ecy-reporter-changed-files-count-mismatch
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-04T20:39:02Z"
  due_on: null
  completed_at: "2026-10-06T10:43:22Z"
  conclusion: reporter の changed_files をパスと説明の組にし、runner がパスで突き合わせるようにした。件数・順序のずれで result 作成が失敗しない。orchestrator がテストの fixture と runner 管理パスの除外（exec/ 全体）を補修した
---

# PJR-0ECY reporter の変更ファイルの説明の件数がずれると、結果の作成が失敗する

## 1. 課題内容

PJR-GBEV で、changed_files のパスは runner が evidence から作り、reporter は同じ件数・同じ順序の説明だけを返す契約にした。LLM の reporter は件数をそろえるのが苦手で、2026-10-05 の並列実行で gemma26-reporter が 4 件に対し 3 件、14 件に対し 6 件を返し、reporter result rendering failed で PJR-86JE と PJR-27Y0 が waiting になった。変更ファイルが多い exec ほど失敗し、今後のすべての exec に影響する

## 2. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | LLM の reporter を使うすべての exec。変更ファイルが多いほど件数がずれやすい         |
| スケジュール | executor と親検証が成功しても、reporter の段階で waiting になり、再実行が必要になる |
| コスト       | 成功した作業の再実行と調査                                                          |
| 品質         | 成果物は worktree に残り失われないが、状態と事実が食い違う                          |
| 関係者       | DEV、exec を実行する利用者                                                          |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | reporter の `changed_files` を説明の配列（パスなし）とし、runner が evidence の変更と件数・順序で対応づける契約にしたため、件数がずれると対応づけられない                                                                                               |
| 対応策   | reporter が説明をファイルのパスと対で返し、runner がパスで突き合わせる。説明のないファイルには既定の文（差分を参照する旨）を入れ、evidence にないパスの説明は捨てる。件数や順序がずれても結果の作成を失敗させない。説明が欠けたことは result に記録する |
| 依存事項 | [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]                                                                                                                                                                                                       |
| 完了条件 | reporter の説明が不足・過剰・順序違いでも結果が作成され、事実項目（パス、outcome、block_reason）は runner の値のまま変わらない。unit test と integration test で確認し、`npm run check` が通る                                                          |

## 4. 対応結果

- reporter の `changed_files` をパスと説明の組に変更し、runner が evidence のパスを正本として説明を突き合わせるようにした。順序は問わず、説明不足には差分参照を促す既定文を記録し、evidence にないパスの説明は捨てる。
- 件数一致による描画失敗を廃止し、説明の不足・過剰・順序違いでも result を作成できる unit test と pipeline integration test を追加した。パス、`outcome`、`block_reason` は引き続き evidence から機械生成する。
- reporter の runtime schema、公開 JSON Schema、prompt、exec 運用ガイドを同じ契約へ更新し、件数・順序への依存が再導入されないようにした。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]: 事実項目の機械生成を入れた項目。
- [[prj-0001:pjr-86je-docs-lint-chinese-glyphs]]、[[prj-0001:pjr-27y0-grade-english-canonical-translation]]: 本件で waiting になった実行。
- `src/exec-reporter.ts`、`src/exec-results.ts`、`docs/specdojo/schemas/v1/exec-reporter-output.schema.yaml`
