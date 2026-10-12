---
specdojo:
  id: prj-0001:pjr-bjtc-job-review-not-run-blocks
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:51:26Z"
  completed_at: "2026-10-12T10:59:30Z"
  conclusion: Job Run の review では executor の not_run で止めず、verdict で統合を判断するようにした
---

# PJR-BJTC Job Run の review で executor の not_run が統合を止める

## 1. 課題内容

Job Run の review（mode: review）でも、executor が実行しなかった任意の確認を not_run と記録すると edit と同じ規則で run が止まり、verdict が complete-with-findings でも統合されない。review では verdict で統合を判断し、not_run では止めない

## 2. 影響範囲

| 観点         | 影響                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| スコープ     | `task.review` を宣言した Job の Job Run の review（`mode: review`）の統合の判定 |
| スケジュール | 今夜（2026-10-13 01:00）の定期実行の前に直す                                    |
| コスト       | review が統合してよいと判断しても `waiting` になり、人が統合する                |
| 品質         | 統合の判断が verdict ではなく、review の任意の確認の記録に左右される            |
| 関係者       | 定期実行を使う利用者と orchestrator                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner の判定（`src/exec-reporter.ts` の `deriveReporterFacts`）は、`mode` によらず executor の `not_run` を「検証が済んでいない」として止める。review の executor は判断の材料として任意の確認を行い、行わなかったものを `not_run` と記録することがある。2026-10-12 の試し実行（`JBR-grade-kata-00dbd070eb0e`）では、verdict が `complete-with-findings` でも `grade list --dependency-changed` の `not_run` で止まった                                                                                    |
| 対応策   | (1) Job Run の review（`mode: review`）では、executor の `not_run` と `not_applicable` で止めず、統合は verdict で判断する。`failed` は従来どおり止める。(2) review の executor への指示に、実行しなかった確認は `validations` に書かず、result の「確認できなかった範囲」に書くことを加える。edit の判定は変えない                                                                                                                                                                                         |
| 依存事項 | PJR-4VAC（review の result の整形）と同じ流れを扱う。PJR-4VAC は統合済み                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 完了条件 | review の executor の `validations` に `not_run` があっても、verdict が `complete` / `complete-with-findings` なら統合へ進み、`incomplete` などでは `waiting` になることを単体テストまたは統合テストで確認する。`failed` があれば従来どおり止まることも確認する。edit の run の `not_run` の判定は変わらないことを確認する。review の executor の指示に上記の規則が入っていることを確認する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する |

## 4. 対応結果

- `deriveReporterFacts` に task mode を渡し、`review` では executor の `not_run` / `not_applicable` を pipeline の停止条件から除外した。runner の検証失敗と executor の `failed` は従来どおり停止条件とし、`edit` の判定も変更していない。
- review executor の指示へ、実行しなかった任意確認を `validations` に記録せず、「確認できなかった範囲」として reporter へ渡し、result と verdict に反映する規則を追加した。
- 単体テストで mode 別の検証判定と prompt を固定し、Job Run の統合テストへ `not_run` があっても `complete` / `complete-with-findings` は統合、`incomplete` と executor の `failed` は waiting になるケースを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqza-routine-commit-after-run]]: 統合前 review の流れ
- [[prj-0001:pjr-4vac-job-review-result-trailing-newline]]: 同じ流れで直した項目
