---
specdojo:
  id: prj-0001:pjr-hj99-index-build-not-run-blocks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  registered_at: "2026-10-12T03:32:21Z"
---

# PJR-HJ99 executor が実行できない index build の not_run で run が止まる

## 1. 課題内容

.specdojo/doc-index.json は agent の書き込み禁止対象のため、executor は specdojo index build を not_run と記録するしかない。index は worktree の準備で runner が再生成しているが、その結果は not_run を満たす根拠として扱われず run が止まる（PJR-ADZ6 で発生）。runner が担う検証として満たしたとみなす

## 2. 影響範囲

| 観点         | 影響                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | executor が `specdojo index build` を `not_run` / `not_applicable` と記録した run の判定（`src/exec-reporter.ts`）と、executor への指示 |
| スケジュール | v0.3.0 の公開前に直す（利用者の判断、2026-10-12）                                                                                       |
| コスト       | 文書の id を扱う項目で、成果物に問題がなくても run が止まり、orchestrator が統合する手間が生じる                                        |
| 品質         | 実行できない検証の記録で止まるため、判定の信頼性が下がる                                                                                |
| 関係者       | exec を使う利用者と orchestrator                                                                                                        |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo index build` の出力先 `.specdojo/doc-index.json` は agent の書き込み禁止対象のため、executor は実行できず `not_run` と記録するしかない。index は worktree の準備と統合の前に runner が再生成しているが、その結果は executor の `not_run` を満たす根拠として扱われない。`mechanicallyNotApplicableReason` も、index build を対象外と判定しない                                                                                                                                                                                                                                                                                                                                                                                        |
| 対応策   | (1) `specdojo index build` を runner が担う検証として扱い、executor の `not_run` / `not_applicable` を満たしたとみなす。runner が index の再生成に失敗した場合は満たさない。(2) executor への指示に、`specdojo index build` は runner が実行するため executor は実行も記録もしないことを加える (3) `specdojo catalog validate` の適用可否を、plan の共通規約（`xep-common-conventions-template.md` の検証の表）と同じく変更範囲でも判定する。対象 project に `catalog_path` があっても、変更が `docs/ja/projects/` 配下に及ばない場合は、executor の `not_applicable` を正当と認める                                                                                                                                                           |
| 依存事項 | WP44（`not_applicable` の判定）と同じ判定の箇所を扱う。WP44 は統合済み                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | executor が `specdojo index build`（`npx specdojo index build`・`node --import tsx src/specdojo.ts index build` などの書き方を含む）を `not_run` と記録しても run が止まらないことを単体テストで確認する。ほかの `specdojo` コマンドの `not_run` の扱いは変わらないことも確認する。executor の指示に index build の扱いが入っていることを確認する。exec-config-guide の該当の記述を更新する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する あわせて、`catalog_path` を持つ project でも、変更が `docs/ja/projects/` 配下に及ばない run では `catalog validate` の `not_applicable` が受理され、及ぶ run では従来どおり退けられることを単体テストで確認する（PJR-MTFA の事例） |

## 4. 対応結果

| 項目       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 解決内容   | `src/exec-reporter.ts` に `runnerOwnedValidationReason` を加え、`specdojo index build`（`npx specdojo`・`node --import tsx src/specdojo.ts`・`npx tsx`・`node dist/specdojo.js` の起動形を含む）を runner が担う検証として判定する。`deriveReporterFacts` は executor の `not_run` / `not_applicable` を block の理由にせず、`failed` は従来どおり block する。runner の記録に失敗があれば `failedParentValidationReason` が先に block する |
| 解決内容   | `catalog validate` の適用可否を変更範囲でも判定する。`ReporterFactOptions` に `changedPaths` を加え、runner 管理記録を除いた変更（rename は前後の両方）が `docs/ja/projects/` 配下に及ばない run では、`catalog_path` があっても適用外とする                                                                                                                                                                                                |
| 解決内容   | executor への指示（`src/exec-run.ts` の pipeline executor 指示）に、`specdojo index build` を実行も記録もしないことと、`catalog validate` の変更範囲による適用外を加えた。edit result の申し送りへ「runner が担う検証」を追記する（`src/exec-results.ts`）。exec-config-guide の該当の記述を更新した                                                                                                                                        |
| 確認結果   | 単体テスト（`tests/src/exec-reporter.test.ts`・`tests/src/exec-run.test.ts`）に、index build の各起動形の `not_run` / `not_applicable` が受理されること、ほかの `specdojo` コマンドの `not_run` は block のままであること、変更範囲による `catalog validate` の受理と退け、executor の指示の内容を加えた。統合テストは追加していない。テストの実行結果は runner の親検証を正とする                                                          |
| 再発防止策 | agent が書き込めない生成物を出力する検証は、runner が担う検証として判定と executor への指示の両方で扱う                                                                                                                                                                                                                                                                                                                                     |

## 5. 関連ドキュメント

- [[prj-0001:pjr-adz6-register-run-non-pipeline-agent-fallback]]: 事象が起きた実行
- [[prj-0001:pjr-wp44-not-applicable-reason-criteria]]: 同じ判定の箇所を直した項目
- [[prj-0001:pjr-mtfa-v030-changelog-additions]]: catalog validate の判定で止まった実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
