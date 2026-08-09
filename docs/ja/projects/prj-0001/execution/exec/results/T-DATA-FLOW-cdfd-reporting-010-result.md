---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-reporting-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-reporting-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-reporting-010-plan.md
  started_at: "2026-08-09T21:24:23.499Z"
  completed_at: "2026-08-09T21:34:36.918Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-reporting
---

# Edit Result

## 1. 実施内容

対象成果物が存在しなかったため、判断は「新設」とした。指定された実装エビデンス四件を実際に確認し、先行 CDFD、全体概要、プロジェクトコンテキスト、成果物カタログの done_criteria、CDFD rulebook、既存のプロジェクト管理・コミュニケーション方針と照合して `P-09 報告` の TO-BE フローを作成した。

- 監視入力の有効性確認、進捗・滞留検知、対応・エスカレーション整理、進捗報告、会議・議事録、報告・管理記録整合確認を `P-09-01`〜`P-09-06` として表と図で対応させた。
- Ready、`doing`、`blocked`、CPM・critical path、マイルストーン、登録項目について、遅延・滞留・更新漏れを判定する条件と、task / 項目 owner、PM、type 別承認者、QE、PO への引き渡しを定義した。
- 人が作る進捗報告・議事録と、`register build` が生成する登録項目一覧・状態別・優先度別・担当者別ビュー・課題・リスク・変更要求・決定ログ、および `register history` が再構成する監査履歴の責務を分離した。
- 古い生成ビュー、未報告の状態変化、未転記の決定・アクションを検出した場合に、報告確定を止め、正本更新と再生成へ戻す経路を定義した。
- 実装から確認できない自動遅延判定、報告・議事録の自動生成、共通の鮮度表示は現行動作として記載せず、未決事項と申し送りへ残した。
- 定例報告を設けないコミュニケーション計画と、無効化された週報 Routine が併存するため、周期報告の採否を未決事項とした。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md`（新設）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-reporting-010-result.md`

検証結果:

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-reporting-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-reporting-010-result.md`: 成功。
- `npx remark docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-reporting-010-result.md --quiet --frail`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が IPC socket の listen を許可しないため、起動前に `EPERM` で停止した。代替の `node --import tsx src/specdojo.ts catalog validate` は終了コード 0 で、全 8 カタログが `OK`。未作成の別成果物に関する既存 warning のみだった。
- `npx tsx src/specdojo.ts index build`: 同じ IPC 制約のため単独実行せず、代替の `node --import tsx src/specdojo.ts index build` は終了コード 0 で、`.specdojo/doc-index.json` に 1028 entries を生成した。
- `git diff --check`: 成功。

## 3. 申し送り

### 3.1. 未反映の乖離

| ID     | 分類                    | 乖離                                                                                                                                                                                     | 今回の判断                                                                                                                           | 変更候補                                                                                                      |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `G-01` | evidence purpose との差 | `src/exec-task-view.ts` は Schedule と任意の `ready.json` から一 task の表示情報と実行属性を再構成するが、`doing` / `blocked` の現在状態、滞留時間、遅延判定は同ファイル内で生成しない。 | 状態は先行 CDFD が定める state と実行 event を意図された入力として保持し、指定実装だけで確認できない自動判定は現行動作としなかった。 | state / Ready の集約実装を別調査で確認し、成果物カタログの evidence purpose を実装パスと整合させる。          |
| `G-02` | 現在動作と目的の差      | `src/exec-schedule-cpm.ts` は依存と期間から ES / EF / LS / LF、slack、critical path を計算するが、現在状態、実績、マイルストーンの目標時点、報告時点との比較は行わない。                 | CPM は計画判断材料とし、state と報告時点を人が照合するプロセスを定義した。期限・確認時点がなければ遅延と断定しない `E-03` を置いた。 | 実績反映、マイルストーン確認時点、滞留閾値の決定後、自動検知を別タスクで設計する。                            |
| `G-03` | 現在動作と成果物名の差  | `src/register-history.ts` の監査履歴は Git から都度再構成して標準出力または JSON へ返す参照結果であり、永続的な管理ログファイルを更新しない。                                            | 監査履歴を報告・議事録の正本や人が編集する管理ログとはせず、追加・変更・削除・状態遷移を照合する読み取り入力として記載した。         | 永続化が必要なら、保存先、生成責任、再生成可能性、直接編集可否を決定して別成果物・実装タスクにする。          |
| `G-04` | 運用文書間の不一致      | コミュニケーション計画は定例会議・定期報告を設けない一方、週報 Job と毎週金曜日起動用 Routine が存在する。ただし Routine は `enabled: false` である。                                    | 状態変化・節目・判断・明示要求を現行の報告契機とし、週報の自動起動は現行動作に含めず `U-01` とした。                                 | PM と PO が周期報告の採否を決定し、有効化する場合は対象期間、確認者、missed run、重複実行、公開先を承認する。 |
| `G-05` | 実装から確認不能        | 指定実装には進捗報告・議事録の生成・保存・確認処理、および派生ビューへ共通の生成基準時点を付けて陳腐化を自動警告する処理がない。                                                         | 報告・議事録は人が作成・確認し、鮮度は正本更新、生成結果、差分から確認する TO-BE とした。自動化の有無を推測せず `U-03` とした。      | 報告機能を実装する場合は、先に人間の確認ゲート、保存先、公開範囲、鮮度メタデータを設計する。                  |

### 3.2. 未確認範囲

- state、Ready、timeline の全体生成、`doing` / `blocked` の集約、実行 event の検証は evidence_refs 外のため、先行 CDFD の意図だけを入力境界として採用し、現在実装の分岐は未確認とした。
- マイルストーンの達成判定・日付変換・遅延通知は evidence_refs 外であり、`sch-milestones.yaml` の `depends_on` と報告時点を人が照合する範囲だけを定義した。
- 進捗報告・議事録のテンプレート、保存先、公開処理、承認ワークフローは指定実装から確認できない。
- 週報 Job / Routine の実行エンジン、missed run、overlap、失敗後の再実行は指定実装から確認していない。既存設定は報告周期の意図と現行の無効状態を確認するためだけに参照した。
- ファイル更新時刻または生成メタデータによる派生ビューの自動鮮度判定と、外部通知先は未確認である。

## 4. 進め方と実践の型の適用

`retrofit` として、実装エビデンスを現在動作、先行 CDFD・全体概要・プロジェクト管理文書を意図、成果物カタログを完了目的、rulebook を構造・記法の基準として分離した。対象成果物が未作成だったため新設し、実装と意図が一致する監視入力、生成ビュー、監査履歴を反映した。実装に存在しない業務判断・報告自動化は推測せず、人間の責務、未決事項、未反映の乖離として区別した。

実際に参照した実装エビデンスと抽出した現在動作:

| 実装パス                   | 抽出した現在動作                                                                                                                                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/exec-task-view.ts`    | Schedule から対象 task を取得し、`generated/ready.json` が存在して対象 task を含む場合はその表示情報を採用する。local ID、phase、mode、execution、approach、capability、proficiency が不足していれば Schedule・strategy から補完する。task が Schedule にない場合は失敗する。現在 state、遅延、報告要否は算出しない。 |
| `src/exec-schedule-cpm.ts` | 依存グラフをトポロジカルソートし、循環があれば失敗する。Schedule の duration と track start floor から ES / EF、逆方向計算で LS / LF、slack を算出し、slack 0 の node から連続する critical path を決定する。task の現在 state、実績日、マイルストーン確認時点、報告契機は入力・出力に含まれない。                    |
| `src/register.ts`          | 個票 Frontmatter を正本として全項目を読み、登録項目一覧、状態別、優先度別、担当者別ビューと、risk・issue・change-request・decision の type 別管理ビューを生成する。個票検証不合格なら build を失敗させる。生成ビューは正本ではなく、報告・議事録を生成または更新しない。                                              |
| `src/register-history.ts`  | 個票の Git log を古い順・merge 除外で読み、追加・更新・削除・rename を項目単位の event へ再構成する。status、title、description、type、priority、owner、registered、due、completed、conclusion の差分を扱い、期間、ID、状態遷移だけへの絞り込みができる。`generated/` は除外し、履歴を永続ファイルへ書き込まない。    |

判断は「新設」である。対象パスに既存成果物がなく、成果物カタログに path、rulebook、done_criteria が定義され、全体概要に `P-09` の境界が存在したため、局所更新や維持では完了条件を満たせなかった。

`specdojo:cdfd-rulebook` の必須構成に従って、目的と適用範囲、プロセス一覧、Mermaid 図、主要例外、領域外委譲、確認者別受入条件を記載した。`specdojo:cdfd-mermaid-rulebook` に従い、一つの業務目的を一プロセスノードとし、イベント・正本・外部主体を形状で分け、すべてのエッジへ情報ラベルを付けた。プロジェクトコンテキストからは、同じ正本を人と AI Agent が参照できること、人の作業と判断を引き継げること、費用と参加負荷を判断材料にすること、人間が主要判断を担うことだけを反映し、`based_on` には追加していない。
