---
specdojo:
  id: prj-0001:pjr-adz6-register-run-non-pipeline-agent-fallback
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T08:39:33Z"
---

# PJR-ADZ6 register の実行で pipeline 用でない agent が自動で選ばれる

## 1. 課題内容

exec run --register を --executor-by/--reporter-by なしで起動すると、owner の role で agent が見つからない場合に stage_role を持たない翻訳専用の agent（gemma26-translator）が選ばれる

## 2. 影響範囲

| 観点         | 影響                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register` を `--by`・`--executor-by`・`--reporter-by` なしで起動した場合の agent 選択 |
| スケジュール | 影響なし                                                                                          |
| コスト       | 不適切な agent での実行と、その中断・やり直しの手間                                               |
| 品質         | 調査や実装に向かない agent（翻訳専用など）が成果物を書き、品質が落ちる                            |
| 関係者       | exec を起動する利用者と orchestrator                                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec-run.ts` の `resolveRegisterCommand` は、owner の role に合う agent がない場合に `selectCandidates` の先頭を選ぶ。この候補に `stage_role` を持たない agent（`gemma26-translator`）が含まれる。agent の roles は規約上空配列のため、owner からの選択はほぼ常にこの経路に落ちる。 |
| 対応策   | 推奨案は (b)。pipeline の指定がない場合も、`stage_role: executor` と `stage_role: reporter` の agent から自動で選んで 2 段階で実行する。該当する agent がいない場合は `--executor-by` / `--reporter-by` を求めるエラーにする。代替案 (a) は、自動選択をやめて常にエラーにする。          |
| 依存事項 | command-reference の `--register` の agent 選択の記述（owner・role からの自動選択は行わない旨）の改訂                                                                                                                                                                                    |
| 完了条件 | pipeline の指定なしで `stage_role` を持たない agent が自動で選ばれないことをテストで確認する。pm-members の規約「agent は全員 `stage_role` を持つ」と、command-reference の記述が実装と一致する。                                                                                        |

## 4. 対応結果

推奨案 (b) で対応した。

- 解決内容: `src/exec-run.ts` の `isRegisterPipelineRequested` は、`--by` を指定しない場合に常に pipeline 実行を選ぶ。`resolveRegisterPipelineCommand` は、`--executor-by` / `--reporter-by` がどちらも無い場合に `stage_role: executor`（`mode: edit` または未指定）と `stage_role: reporter` の agent から `priority` 順に自動で選ぶ。該当する agent がいない段がある場合は、明示指定を求めるエラーにする。`resolveRegisterCommand` は `--by` 指定時の単一 agent 実行だけを扱い、owner・role・汎用候補からの自動選択を廃止した。
- 確認結果: `tests/src/exec-register.test.ts` に、`stage_role` の無い agent（`priority` が最も小さい翻訳専用 agent を想定）と `mode: review` の executor を候補から除外して選ぶテスト、`stage_role` の無い agent しかいない場合はエラーになるテスト、`--by` が無いと owner 一致の agent を自動選択しないテストを追加した。
- 文書: [[specdojo:command-reference]] の `--register` の agent 選択の記述（既定は pipeline、`stage_role` からの自動選択、owner・role からは選ばない）を実装に合わせて改訂した。
- 再発防止策: register の自動選択は、`stage_role` で段を指定する `selectCandidates` だけを経由する。`stage_role` を持たない agent は段指定の選択で除外されるため、自動選択の対象にならない。
- 残課題: `.specdojo/agent-members.yaml` 冒頭の規約コメント「`type: agent` のメンバーは全員 `stage_role` を持つ」に対し、`gemma26-translator` は `stage_role` を持たない（`agent run --by` 専用）。同ファイルは agent の書き込み禁止対象のため、例外の明記または規約の見直しは人が行う。

## 5. 関連ドキュメント

- prj-0002 の PJR-G4QN（`project/prj-0002/develop` 上）: 事象が起きた実行（1 回目に `gemma26-translator` が選ばれ、中断した）。
- [[specdojo:command-reference]]: `--executor-by` / `--reporter-by` と agent 選択の記述。
