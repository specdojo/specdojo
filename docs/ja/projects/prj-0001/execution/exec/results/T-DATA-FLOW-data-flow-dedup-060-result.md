---
specdojo:
  id: prj-0001:xer-t-data-flow-data-flow-dedup-060
  type: exec-result
  task_id: T-DATA-FLOW-data-flow-dedup-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-data-flow-dedup-060-plan.md
  started_at: "2026-08-09T23:32:20.641Z"
  completed_at: "2026-08-09T23:44:45.450Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: cross-deliverable-dedup
  targets:
    - prj-0001:cdfd-overview
    - prj-0001:cdfd-init
    - prj-0001:cdfd-register-operation
    - prj-0001:cdfd-catalog-planning
    - prj-0001:cdfd-task-execution
    - prj-0001:cdfd-routine
    - prj-0001:cdfd-multi-project
    - prj-0001:cdfd-agent-config-operation
    - prj-0001:cdfd-derived-content
    - prj-0001:cdfd-reporting
---

# Cross-deliverable Dedup Result

## 1. 実施内容

対象10 CDFD、`specdojo:cdfd-overview-rulebook`、`specdojo:cdfd-rulebook`、hook 設定を確認し、同じ状態・生成物・worktree・構成情報を複数領域が詳述していた箇所を責務単位で整理した。

- [[prj-0001:cdfd-overview|概念データフロー図（全体概要）]] に「横断論点の正本」を追加し、九領域の正本と他領域へ残す要約範囲を一意にした。
- 領域別 CDFD には単独可読性と done criteria に必要な入力・出力・停止条件を残し、詳細規則を正本文書への wikilink に置き換えた。
- `exec-cycle` の索引再生成を `P-08 派生生成`、Schedule 検証と state / Ready 再計算を `P-03 計画展開` に分離し、図と委譲表の受け渡しを一致させた。
- Frontmatter の `status`、`based_on`、`supersedes` は変更せず、既存の未決事項も確定情報へ書き換えていない。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-multi-project.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-agent-config-operation.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md`
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-data-flow-dedup-060-result.md`

## 3. 正本へ集約した記述

| 論点                  | 正本文書                                                                 | 集約・明確化した内容                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 領域分割と正本選択    | [[prj-0001:cdfd-overview\|全体概要]]                                     | 九領域の一対一対応に加え、登録簿、計画情報、task 状態、routine / Job、worktree、構成、派生生成、報告の各横断論点について正本と他文書に残す範囲を追加した |
| 初回初期化            | [[prj-0001:cdfd-init\|初期セットアップ]]                                 | register / catalog / provider / exec の初回受け皿作成を正本とし、運用中の生成・構成変更を後続正本へ分離した                                              |
| 登録項目              | [[prj-0001:cdfd-register-operation\|登録簿ライフサイクル]]               | type、状態、日時、結論、履歴、ビューへ載せる意味情報を正本と明記した                                                                                     |
| 計画情報              | [[prj-0001:cdfd-catalog-planning\|カタログ〜計画展開]]                   | Schedule・event から state、Ready、CPM、critical path、timeline を算出する入力関係と検証ゲートを正本と明記した                                           |
| task lifecycle        | [[prj-0001:cdfd-task-execution\|タスク実行ライフサイクル]]               | claim / complete / block / unblock / release / cancel / reopen と actor 制約を正本と明記した                                                             |
| 定期運用              | [[prj-0001:cdfd-routine\|定期運用]]                                      | due、scheduled time、冪等性、routine 状態、Job checkpoint、次回判定を正本と明記し、cycle の索引生成と状態再計算の委譲先を分離した                        |
| branch / worktree     | [[prj-0001:cdfd-multi-project\|複数プロジェクト・ブランチ並行運用]]      | 分離、ベース、同期、commit、統合方向、競合時の保持、後片付けを正本と明記した                                                                             |
| agent / provider 構成 | [[prj-0001:cdfd-agent-config-operation\|agent・provider 構成の運用変更]] | phase、member、provider、権限・認証分離の責務と変更承認を正本と明記した                                                                                  |
| 派生生成              | [[prj-0001:cdfd-derived-content\|成果物・派生ビュー・索引生成]]          | 各正本の意味は再定義せず、生成処理・生成先、一括順序、上書き、部分失敗、陳腐化と再実行を横断正本と明記した                                               |
| 監視・報告            | [[prj-0001:cdfd-reporting\|進捗監視・報告・ログ管理]]                    | 正本・派生情報を同じ基準時点で監視し、人が確定する報告・議事録へ結び付ける規則を正本と明記した                                                           |

## 4. 要約・参照へ置き換えた重複

| 対象文書                                                                 | 置換前の重複論点                                                                | 置換後の要約と参照先                                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [[prj-0001:cdfd-init\|初期セットアップ]]                                 | 初期生成後の登録簿ビュー生成・運用構成変更                                      | 初回 scaffold の成果だけを残し、生成順・上書き・再実行は `P-08`、運用中構成変更は `P-07` を参照した                            |
| [[prj-0001:cdfd-register-operation\|登録簿ライフサイクル]]               | worktree の準備・同期・commit・統合失敗の詳細                                   | 登録項目へ返す `review` / `waiting`、result、再開条件だけを残し、保持・復旧は [[prj-0001:cdfd-multi-project\|P-06]] を参照した |
| [[prj-0001:cdfd-catalog-planning\|カタログ〜計画展開]]                   | `exec refresh` の一括生成・陳腐化規則と task event 遷移                         | 計画算出を正本として残し、生成順・陳腐化は `P-08`、event 遷移は `P-04` を参照した                                              |
| [[prj-0001:cdfd-task-execution\|タスク実行ライフサイクル]]               | branch / worktree の作成、依存導入、commit、merge、後片付けと provider 構成詳細 | task 状態へ反映する成功・失敗境界を残し、worktree 詳細は `P-06`、構成・権限は `P-07` を参照した                                |
| [[prj-0001:cdfd-routine\|定期運用]]                                      | task の block 情報保持・再開規則と索引・状態再計算の混在                        | due 選択と委譲結果の扱いを残し、task lifecycle は `P-04`、索引生成は `P-08`、state / Ready 再計算は `P-03` を参照した          |
| [[prj-0001:cdfd-multi-project\|複数プロジェクト・ブランチ並行運用]]      | task 内部状態遷移と登録項目 ID 復旧                                             | 分離環境と統合結果の受け渡しに限定し、task lifecycle は `P-04`、登録項目 ID は `P-02` を参照した                               |
| [[prj-0001:cdfd-agent-config-operation\|agent・provider 構成の運用変更]] | 実行時 nickname 選択・task 状態と計画再展開                                     | 構成の責務・承認を残し、task 実行は `P-04`、Schedule / Ready 再展開は `P-03` を参照した                                        |
| [[prj-0001:cdfd-derived-content\|成果物・派生ビュー・索引生成]]          | state / Ready / CPM の算出規則、登録項目状態、task 状態                         | 生成処理の入出力と編集境界だけを正本とし、意味・状態は `P-03`、`P-02`、`P-04` を参照する既存分担を明文化した                   |
| [[prj-0001:cdfd-reporting\|進捗監視・報告・ログ管理]]                    | 計画情報の検証・算出、派生生成の失敗復旧                                        | 報告確定の停止と基準時点確認だけを残し、計画検証は `P-03`、再生成範囲・順序は `P-08` を参照した                                |

## 5. 意図的に残した重複

- 全体概要の領域一覧・全体図と各領域別 CDFD の起点、主要入力、主要出力、データストアは、overview / area rulebook と各 done_criteria が要求する追跡点のため残した。
- 各領域のプロセス一覧と Mermaid 図に同じプロセス ID・名称・主要フローを残した。表を用語・入出力の正本、図を順序・分岐の正本として併用する CDFD rulebook 上の必要な重複である。
- `cdfd-task-execution` の worktree 準備・統合失敗、`cdfd-routine` の task 返却結果、`cdfd-reporting` の派生情報名は、各文書の done_criteria と単独可読性に必要な短い要約として残した。branch 操作、task 遷移、算出・再生成の詳細はそれぞれの正本へ委譲した。
- `cdfd-register-operation`、`cdfd-derived-content`、`cdfd-reporting` に登録項目ビューの名称を残した。前者は項目の意味、中央は生成先、後者は監視入力という異なる責務を示すためであり、状態規則や生成失敗規則は重複させていない。
- 既存の _UNDECIDED_ は根拠不足を追跡する各文書固有の情報であり、今回の dedup では削除・統合しなかった。

## 6. 維持確認

| 対象                          | done_criteria・責務・追跡性の確認                                                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cdfd-overview`               | 九領域の一覧・図・一対一対応を維持し、正本一覧を追加した。overview の based_on は空のまま維持した                                                   |
| `cdfd-init`                   | 必須三プロセス、条件付き provider / exec、生成先、既存・不足・失敗分岐を維持した。`cdfd-overview` への based_on を維持した                          |
| `cdfd-register-operation`     | 七 type、Schedule 境界、個票状態・日時・結論、Agent 成否、renumber、審査・承認を維持し、worktree 内部だけを P-06 参照へ短縮した                     |
| `cdfd-catalog-planning`       | validate → schedule build → exec refresh、dct / strategy / Schedule / event と計画情報、三停止ゲートを維持した                                      |
| `cdfd-task-execution`         | 正常経路、human / agent、in-place / worktree、単発 / 自動 / 並列、状態訂正、利用制限、worktree 失敗、ready 人間ゲートを維持した                     |
| `cdfd-routine`                | routine / register / Schedule / cycle / Job の境界、due、結果、busy・対象なし・失敗・重複・取りこぼしを維持し、索引と状態再計算の委譲先を明確化した |
| `cdfd-multi-project`          | project develop / feature / exec の作成・作業・同期・統合・後片付け、統合方向、競合停止・復旧を維持した                                             |
| `cdfd-agent-config-operation` | 構成案、権限確認、承認、設定変更、検証、四構成正本、認証分離、安全対策、差し戻しを維持した                                                          |
| `cdfd-derived-content`        | scaffold、五派生処理、一括 build / watch、正本・生成先・編集境界、停止・再実行を維持した                                                            |
| `cdfd-reporting`              | Ready / CPM / milestone / doing / blocked / 登録項目の監視、エスカレーション、報告・議事録、管理記録整合確認を維持した                              |

全10成果物の Frontmatter `status: draft`、`based_on`、`supersedes` は変更していない。新しい本文参照は存在を確認した project 修飾 ID だけを `[[id|title]]` で記載し、表セル内の区切りは `\|` でエスケープした。`based_on` を追加していないため `depends_on` 推移閉包の範囲も変更していない。

検査結果:

- `npx prettier --write <対象10 CDFD と本 result>`: 成功。
- `npx markdownlint <対象10 CDFD と本 result>`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が tsx の IPC socket を許可しないため、内容検証の開始前に `listen EPERM` で停止した。
- `node --import tsx src/specdojo.ts catalog validate`: 終了コード 0。全8カタログが `OK`。未作成の別成果物に関する既存 warning のみで、対象10 CDFD のエラーはなかった。
- `npx tsx src/specdojo.ts index build`: 同じ sandbox 制約により、内容検証の開始前に `listen EPERM` で停止した。
- `node --import tsx src/specdojo.ts index build`: 終了コード 0。`.specdojo/doc-index.json` に 1034 entries を生成した。
- `git diff --check`: 成功。

## 7. 申し送り

既存の各 CDFD に記録されている _UNDECIDED_ は今回の重複整理では解消していない。新たな仕様判断を要する矛盾や未記入プレースホルダはなく、後続 review では全体概要の「横断論点の正本」を基準に、詳細規則が非正本文書へ再流入していないかを確認する。
