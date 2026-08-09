---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-register-operation-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-register-operation-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-register-operation-010-plan.md
  started_at: "2026-08-09T16:42:51.636Z"
  completed_at: "2026-08-09T16:51:47.023Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-register-operation
---

# Edit Result

## 1. 実施内容

対象成果物が存在せず、成果物カタログに path、rulebook、depends_on、done_criteria が定義済みであったため、判断を「新設」とした。[[prj-0001:cdfd-register-operation|概念データフロー図（登録簿ライフサイクル）]] を TO-BE の領域別 CDFD として新設し、次を表と Mermaid 図へ反映した。

- `todo`、`question`、`risk`、`issue`、`change-request`、`decision`、`note` の登録判断と、成果物カタログ・依存から展開済みの計画作業を Schedule だけで管理する境界。
- 個票 Frontmatter・本文を正本とする起票、担当・方針設定、人または AI Agent による対応、`open` / `in-progress` / `waiting` / `review` / `done` / `decided` / `rejected` / `deferred` の状態、終了・再開の流れ。
- 登録日時・完了日時の UTC 保存とプロジェクトタイムゾーンでの表示日導出、結論・待機理由・再評価条件の記録。
- 登録項目一覧、状態別・優先度別・担当者別、リスク・課題・変更要求・決定の派生ビュー生成と、Git 履歴からの `register history` 再構成。
- type 別の承認者、`review` から close / reject / defer / wait に相当する判断、既定 commit と限定 PR の境界。
- Agent 実行失敗、個票不正、重複 ID・命名不整合、renumber、worktree の同期・統合失敗について、停止範囲と継続・再開条件。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`（新規）: `P-02 登録簿運用` の領域別 CDFD。
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-register-operation-010-result.md`: retrofit の照合結果、判断根拠、検査結果、申し送りを記録。

## 3. 申し送り

- `src/register.ts` の `register close` は `--conclusion` を省略できるが、[[specdojo:register-operation-guide|登録簿運用ガイド]] は close 前の結論記入を要求し、本成果物も終了判断に必要な情報として結論を要求した。意図された仕様へ実装を合わせてコマンドまたはスキーマで必須化するか、未記入を許容する条件を文書へ定める後続判断が必要である。
- Agent 実行の成功時 `review`・失敗時 `waiting` と worktree の準備・同期・commit・統合失敗は、完了条件と [[specdojo:register-operation-guide|登録簿運用ガイド]] を意図された仕様として成果物へ反映した。ただし実際の遷移・worktree 制御は列挙された evidence_refs の外にある実行オーケストレーションが担うため、現在動作の確認には `src/exec-run.ts`、`src/exec-worktree.ts`、`src/exec-worktree-ops.ts` を evidence_refs に追加した後続 review が必要である。
- [[specdojo:register-operation-guide|登録簿運用ガイド]] は register の worktree / parallel 実行を記載する一方、[[specdojo:exec-operation-guide|exec運用ガイド]] の実行経路表は register を in-place のみとしている。成果物カタログの done_criteria と登録簿固有ガイドを優先して本成果物へ worktree 結果の経路を定義したが、両ガイドの現行仕様を統一する必要がある。
- `register renumber` の列挙エビデンスで確認できた更新対象は、個票、Markdown 文書の完全一致 doc ID 参照、Markdown の実行 plan / result にある `targets`、派生ビューである。非 Markdown の event JSON などを「実行記録」に含めて更新する要件は確認できなかったため、必要なら対象範囲を決定して別タスクで実装・文書化する。

## 4. 進め方と実践の型の適用

approach は `retrofit` とし、実装エビデンスを現在動作、先行 CDFD・運用ガイド・決定記録を意図された仕様、成果物カタログの done_criteria を完了目的として分離して照合した。文書構造は [[specdojo:cdfd-rulebook|概念データフロー図（領域別）作成ルール]]、Mermaid 記法は同 rulebook が include する [[specdojo:cdfd-mermaid-rulebook|Mermaid を用いた概念データフロー図 作成ルール]] に従った。

### 4.1. 参照した実装エビデンスと抽出した現在動作

| パス                      | 抽出した現在動作                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/register.ts`         | 個票の起票、`start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen`、登録・完了日時、派生ビュー生成、個票検証、ID 採番、renumber を確認した。close は decision / question を既定 `decided`、他 type を既定 `done` とし、reject とともに完了日時を記録する。defer は完了日時を記録せず、reopen は完了日時を削除する。 |
| `src/register-item.ts`    | 個票 Frontmatter を構造化フィールドの正本とし、表示 ID をファイル名、タイトルを H1、説明を本文から導出する。全8状態、全7 type、終端状態、重複表示 ID、ファイル名と Frontmatter 文書 ID の不整合検出を確認した。                                                                                                                    |
| `src/register-history.ts` | 個票の Git 履歴から追加・更新・削除を古い順に再構成し、一覧列相当の変更、状態遷移、rename による ID 変更をイベント化する。生成物を除外し、ID・期間・状態遷移だけの絞り込みと JSON 出力へ渡せることを確認した。                                                                                                                     |
| `src/exec-register.ts`    | `todo` / `issue` / `change-request` を edit、`question` / `risk` を investigate とし、`decision` / `note` と終端状態を実行対象外にする。複数 ID の重複除去、成否・`review` / `waiting` 遷移・commit 結果の要約型、対象個票と実行 plan の解決を確認した。                                                                           |
| `src/register-date.ts`    | `registered_at` / `completed_at` を UTC・RFC 3339・秒精度へ正規化し、config の IANA タイムゾーン（既定 UTC）で一覧表示日を導出する。タイムゾーンなし入力と不正なタイムゾーンを拒否し、期限は暦日のまま扱うことを確認した。                                                                                                         |

### 4.2. 照合結果と新設判断

- 一致: 七つの type、八つの状態、個票 Frontmatter 正本、日時の保存・表示、派生ビュー、Git 履歴、重複 ID・命名不整合検出、renumber の主要経路は、意図された仕様と列挙実装で一致したため成果物へ反映した。
- 一致: type 別承認者、commit / PR 境界、Schedule との非二重管理は、[[specdojo:register-operation-guide|登録簿運用ガイド]]、[[specdojo:git-branching-standard|Git ブランチ運用標準]]、承認済みの [[prj-0001:pjr-0161-register-approval-workflow-policy|PJR-0161]] と done_criteria が一致したため成果物へ反映した。
- 乖離: 終了時の結論必須という意図に対して `register close` / `register reject` の CLI は結論省略を許容する。意図された仕様を成果物に保持し、実装または文書の変更候補として申し送った。
- 実装から確認不能: Agent 成功・失敗時の実際の状態書き込み、worktree の準備・同期・統合は `src/exec-register.ts` の型と補助処理だけでは完結せず、列挙外コードに委譲されている。成果物には承認済み運用と done_criteria が示す境界を記載し、現在動作としては未確認に分類した。
- 既存成果物が無く、局所更新の対象がない。カタログの path・done_criteria と rulebook がそろい、`based_on` に指定できる依存先も存在したため「新設」を選択した。frontmatter の `status` は人間承認前の `draft` とし、`based_on` は depends_on の `prj-0001:cdfd-init` だけに限定した。

### 4.3. 未確認範囲

- 列挙された5パスはすべて読み取り、調査できなかった evidence_refs はない。
- Agent runner のプロセス起動、実際の成功・失敗遷移、worktree の Git 操作、pre-commit 収束、merge 失敗時の保持・再開は列挙外コードのため未確認である。
- Git 履歴の収集と renumber はコード分岐を確認したが、実リポジトリで意図的な重複 ID、rename、worktree 統合失敗を発生させる破壊的な実地試験は行っていない。
- 外部 Git hosting の branch protection、CODEOWNERS、PR approve はリポジトリ外設定のため、方針文書だけを確認し、実設定は未確認である。

### 4.4. 整形・静的検査

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: CLI 起動時の IPC ソケット作成が実行環境で `EPERM` となり、検証本体の開始前に失敗した。
- `node --import tsx src/specdojo.ts catalog validate`: 成功。全 DCT が `OK`。未生成の別成果物に関する既存 warning のみで、本成果物のエラーはない。
- `node --import tsx src/specdojo.ts index build`: 成功。1013 文書を索引へ生成した。
- result 更新後に、変更した2つの Markdown へ Prettier と markdownlint を再実行し、catalog validate と index build を pre-commit 相当として再確認した。
