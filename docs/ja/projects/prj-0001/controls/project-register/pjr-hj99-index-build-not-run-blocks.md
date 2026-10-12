---
specdojo:
  id: prj-0001:pjr-hj99-index-build-not-run-blocks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
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

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo index build` の出力先 `.specdojo/doc-index.json` は agent の書き込み禁止対象のため、executor は実行できず `not_run` と記録するしかない。index は worktree の準備と統合の前に runner が再生成しているが、その結果は executor の `not_run` を満たす根拠として扱われない。`mechanicallyNotApplicableReason` も、index build を対象外と判定しない                                                                                                                                                     |
| 対応策   | (1) `specdojo index build` を runner が担う検証として扱い、executor の `not_run` / `not_applicable` を満たしたとみなす。runner が index の再生成に失敗した場合は満たさない。(2) executor への指示に、`specdojo index build` は runner が実行するため executor は実行も記録もしないことを加える                                                                                                                                                                                                              |
| 依存事項 | WP44（`not_applicable` の判定）と同じ判定の箇所を扱う。WP44 は統合済み                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 完了条件 | executor が `specdojo index build`（`npx specdojo index build`・`node --import tsx src/specdojo.ts index build` などの書き方を含む）を `not_run` と記録しても run が止まらないことを単体テストで確認する。ほかの `specdojo` コマンドの `not_run` の扱いは変わらないことも確認する。executor の指示に index build の扱いが入っていることを確認する。exec-config-guide の該当の記述を更新する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-adz6-register-run-non-pipeline-agent-fallback]]: 事象が起きた実行
- [[prj-0001:pjr-wp44-not-applicable-reason-criteria]]: 同じ判定の箇所を直した項目
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
