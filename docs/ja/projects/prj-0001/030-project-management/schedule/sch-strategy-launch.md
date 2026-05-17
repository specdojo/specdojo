---
id: prj-0001:sch-strategy-launch
type: project
status: draft
rulebook: sch-strategy-rulebook
---

# ローンチフェーズのスケジュール戦略

Launch Phase Schedule Strategy

## 1. 成果物の種類

成果物の範囲は以下;

- `dct-project-definition`
- `dct-project-management`

## 2. 成果物の作成フロー

1. `docs/ja/projects/prj-0001/`配下に`document`がない場合はまずは`documentたたき台`を作成する。
   - 成果物に対応する`rulebook`, `instruction`, `sample`がある場合は参考にする。
2. `documentたたき台`を成果物カタログで定義されている `done_criteria` に基づき、各成果物に指定されたロールがレビューし、修正を依頼する。
3. レビューを踏まえて、`documentたたき台`を`document一次版`として修正する。必要に応じて2, 3を繰り返す。
4. `document一次版`を成果物カタログで定義されている `done_criteria` に基づき、各成果物に指定されたロールがレビューし承認する。
5. 対象ドメイン内のドキュメントに対して、1〜4のフローを繰り返す。
6. 5までで作成したドメイン内のドキュメントの全体整合性を `done_criteria` に基づき、各成果物に指定されたロールがレビューし、修正・承認する。
7. レビューを踏まえて、`document完成版`として整合性を合わせるための修正をおこなう。必要に応じて6, 7を繰り返す。
8. `document完成版`を成果物カタログで定義されている `done_criteria` に基づき、各成果物に指定されたロールがレビューし承認し、完成版として `ready` にする。

## 3. タスクの担当者

- `documentたたき台`の作成: `BA`
- `document一次版`の作成: `BA`
- `document完成版`の作成: `BA`
- レビュー・修正依頼: 各成果物の `done_criteria` に指定されたロール（`PO`, `BA`, `ARC`, `QE` を基本とし、成果物によって `PM`・`DEV`・`UX`・`OPS` が追加される）

## 4. タスクの所用時間

成果物の `kind` に応じて作業区分と所用時間の目安を定める。

| kind | 区分 | 説明 | 目安時間 |
| --- | --- | --- | --- |
| `work` | たたき台作成 | 初版ドラフトを作成する | 1〜2h |
| `work` | レビュー・修正（繰り返し） | `done_criteria` を基にレビューし修正する | 0.5〜1h × 回数 |
| `work` | 完成版仕上げ | ドメイン整合調整・最終承認を経て `ready` にする | 0.5〜1h |
| `control` | 初期登録 | 管理台帳・報告書の初版を作成する | 0.5〜1h |
| `control` | 随時更新 | 課題・変更・報告を都度記録する | 0.1〜0.5h / 件 |
| `generated` | 生成・再生成 | スクリプトまたは手動集計で随時出力する | 0.1〜0.5h / 回 |

## 5. メンバーとロールの対応

`pm-members.yaml` で定義されているメンバーとロールの対応、および担当するタスク区分を以下に示す。

| nickname | type | roles | 主な担当タスク |
| --- | --- | --- | --- |
| `po` | human | `PO`, `PM`, `OPS` | 最終承認・意思決定・公開可否判断 |
| `po-agent` | agent | `PO`, `PM`, `OPS` | 草案作成補助・論点整理・判断材料整理 |
| `ba-agent` | agent | `BA`, `UX` | 成果物たたき台作成・要件整理・受入条件定義 |
| `arc-agent` | agent | `ARC` | 文書体系・構成方針・整合性レビュー |
| `qe-agent` | agent | `QE` | `done_criteria` チェック・品質確認・抜け漏れ検出 |
| `copilot` | agent | - | 機械的更新・`generated` 成果物生成・リファクタリング支援 |

タスク区分ごとの担当:

- たたき台作成: `ba-agent`（主担当）、`copilot`（補助）
- レビュー・修正依頼: `po-agent`、`arc-agent`、`qe-agent`
- 最終承認: `po`（human のみ）
- `generated` 成果物の生成: `copilot`

## 6. 成果物展開順序

依存関係に基づき、ドメインごとの展開順序を示す。同一順序の成果物は並行して進められる。

### 6.1. dct-project-definition の展開順序

| 順序 | `local_id` | 成果物名 | 依存先 |
| --- | --- | --- | --- |
| 1 | `prj-overview` | プロジェクト概要 | なし |
| 2 | `prj-stakeholder-register` | ステークホルダー登録簿 | `prj-overview` |
| 2 | `prj-scope` | プロジェクトスコープ | `prj-overview` |
| 3 | `prj-charter` | プロジェクト憲章 | `prj-overview`, `prj-stakeholder-register` |
| 3 | `prj-assumptions-constraints-dependencies` | 前提・制約・依存関係 | `prj-scope` |
| 3 | `prj-success-criteria-and-acceptance-criteria` | 成功基準と受入条件 | `prj-scope` |
| 4 | `prj-issues-and-approach` | プロジェクト課題と解決アプローチ | `prj-scope`, `prj-assumptions-constraints-dependencies` |
| 5 | `prj-comparison-of-alternatives` | 代替案比較 | `prj-scope`, `prj-issues-and-approach` |

### 6.2. dct-project-management の展開順序

#### 6.2.1. 管理計画

| 順序 | `local_id` | 成果物名 | 依存先 |
| --- | --- | --- | --- |
| 1 | `pm-plan` | プロジェクト管理計画 | なし |
| 2 | `pm-communication-plan` | コミュニケーション計画 | `pm-plan` |
| 2 | `pm-quality-management-plan` | 品質管理計画 | `pm-plan` |

#### 6.2.2. 組織体制

`pm-organization` は `dct-project-definition` の `prj-overview` 完了後に着手する。

| 順序 | `local_id` | 成果物名 | 依存先 |
| --- | --- | --- | --- |
| 1 | `pm-organization` | 組織定義 | `prj-overview`（dct-project-definition） |
| 2 | `pm-roles` | ロール定義 | `pm-organization` |
| 2 | `pm-raci` | RACI | `pm-organization` |
| 3 | `pm-members` | メンバー定義 | `pm-organization`, `pm-roles` |

#### 6.2.3. スケジュール

スケジュール成果物は相互依存がないため、並行して作成できる。

| 順序 | `local_id` | 成果物名 | 依存先 |
| --- | --- | --- | --- |
| 1 | `sch-milestones` | マイルストーン定義 | なし |
| 1 | `sch-defaults` | スケジュールデフォルト定義 | なし |
| 1 | `sch-track-launch` | Launch スケジュール定義 | なし |
| 1 | `sch-config-launch` | Launch スケジュール設定 | なし |
| 1 | `sch-agent-overrides-launch` | Launch スケジュールエージェント上書き設定 | なし |

#### 6.2.4. 管理台帳

`control` 種別のため、プロジェクト開始と同時に開設し、随時更新する。

| 順序 | `local_id` | 成果物名 | 依存先 |
| --- | --- | --- | --- |
| 1 | `pjr-index` | プロジェクト登録簿 | なし |
| 随時 | `pjr-NNNN-TERM` | プロジェクト登録項目 | `pjr-index` |

#### 6.2.5. 管理台帳補助ビュー・管理ビュー

`generated` 種別のため、`pjr-NNNN-TERM` が更新されるたびに再生成する。

| `local_id` | 成果物名 | 依存先 |
| --- | --- | --- |
| `pjr-open-items` | 未完了項目一覧 | `pjr-index`, `pjr-NNNN-TERM` |
| `pjr-by-owner` | 担当者別一覧 | `pjr-index`, `pjr-NNNN-TERM` |
| `pjr-by-priority` | 優先度別一覧 | `pjr-index`, `pjr-NNNN-TERM` |
| `pjr-by-status` | 状態別一覧 | `pjr-index`, `pjr-NNNN-TERM` |
| `pm-risk-register` | リスク登録簿 | `pjr-NNNN-TERM` |
| `pm-issue-log` | 課題ログ | `pjr-NNNN-TERM` |
| `pm-change-request-log` | 変更要求ログ | `pjr-NNNN-TERM` |
| `pm-decision-log` | 決定記録 | `pjr-NNNN-TERM` |

## 7. ドメイン間の依存関係と展開方針

`dct-project-definition` と `dct-project-management` の間にドメインをまたぐ依存が1件ある。

- `pm-organization`（dct-project-management）は `prj-overview`（dct-project-definition）に依存する。

展開は以下の方針で進める。

1. `prj-overview` を最優先で完成させる。
2. `prj-overview` 完了後、`dct-project-definition` の残成果物と `dct-project-management` の全グループを並行して進める。
3. 管理台帳（`control`）はプロジェクト開始と同時に開設し、随時記録する。
4. 管理補助ビュー・管理ビュー（`generated`）は台帳が更新されるたびに再生成する。
