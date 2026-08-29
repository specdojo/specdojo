---
specdojo:
  id: specdojo:review-guide
  type: guide
  status: ready
---

# レビューガイド

Review Guide

本ドキュメントは SpecDojo における成果物レビューの進め方を定義します。

レビューは「問題なし」を宣言する作業ではありません。どの観点を確認し、どの根拠を見て、何を未確認として残したかを記録する作業です。

**対象読者**

- SpecDojo の成果物をレビューする担当者、review plan を実行するエージェント、品質管理者

**この文書で分かること**

- レビューの入力と確認経路、coverage type、review plan・result、finding の分類、成果物を ready にする条件

**次に読む文書**

- レビュー時の実践の型の使い方は [実践の進め方ガイド](ryu-guide.md)、plan・result の共通ライフサイクルは [plan/resultライフサイクルガイド](plan-result-lifecycle-guide.md) を参照してください。

最初にレビューを実行する場合は、`レビューの位置づけ`、`レビューの観点とパス`、`review plan と review result`、`完了と確定` を読めば実施できます。finding の転記判断は `レビュー結果の記録`、手動でagentへ依頼する場合の文面は `Agent への指示テンプレート` を参照してください。

## 1. レビューの位置づけ

レビューが何を確認する活動か、何を入力とするか、機械検証とどう分担するかを示します。

### 1.1. レビューの役割

SpecDojo のレビューは次を扱います。

| 項目       | 内容                                                               |
| ---------- | ------------------------------------------------------------------ |
| 完全性     | 要求、要件、仕様、設計、運用に抜けがないか                         |
| 整合性     | 成果物間で目的、用語、状態、責務、制約が矛盾していないか           |
| 妥当性     | 上位目的、業務価値、制約、判断方針に合っているか                   |
| 検証可能性 | pass / fail を判断できる完了条件、受入条件、証跡があるか           |
| 追跡可能性 | 上位目的から要求、要件、仕様、設計、テスト、運用まで対応を追えるか |

レビューの合格条件は、対象プロジェクトの成果物カタログに定義された `done_criteria` を正とします。

### 1.2. レビューの入力

レビューでは次を入力として扱います。

| 入力              | 正本ファイル                           | 役割                                                                               |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| 対象成果物        | -                                      | レビュー対象の Markdown / YAML / JSON など                                         |
| 成果物カタログ    | `dct-*.yaml`                           | 成果物、依存関係、`done_criteria`（text / roles / viewpoint）を定義する            |
| rulebook          | `*-rulebook.md`                        | 成果物ごとの構造、必須章、必須キー、禁止事項を定義する                             |
| sample            | `*-sample.*`                           | 期待する成果物の具体例                                                             |
| review viewpoints | 共通正本 + `pm-review-viewpoints.yaml` | Role code 別の観点、severity、verdict、coverage_types とプロジェクト差分を定義する |
| 関連成果物        | -                                      | 上位・下位・隣接成果物、Schedule、RACI、PJR                                        |
| 機械検証結果      | -                                      | lint、schema validation、生成確認、リンク確認                                      |
| 登録簿            | `generated/pjr-index.md`               | 未解決事項、課題、リスク、変更要求、決定の転記先                                   |

### 1.3. 機械検証とレビューの分担

機械で確認できることは、レビュー判断の前に検証します。

| 確認対象               | 主な方法               |
| ---------------------- | ---------------------- |
| YAML / JSON の必須キー | JSON Schema            |
| 型、enum、ID形式       | JSON Schema            |
| Markdown の基本構造    | lint、custom validator |
| リンク、参照先         | custom validator       |
| IDの一意性             | custom validator       |
| 生成物の同期           | generate command、diff |
| 意味の妥当性           | agent / human review   |
| 判断責任               | human approver         |

機械検証で失敗した成果物は、意味レビューの前に修正します。ただし、検証不能な前提や設計判断は review result に残して構いません。

### 1.2.1. 共通観点とプロジェクト差分

レビュー観点の共通正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] です。プロジェクトの `viewpoints_path` は共通正本の全量コピーではなく、次の差分だけを保持します。

- `extends: specdojo:pm-review-viewpoints` で共通正本を1段だけ継承する。
- `categories`、`coverage_types`、`severity_levels`、`verdict_definitions`、`viewpoints` は `id`、`role_viewpoint_sets` は `role` が同じ項目を全体上書きし、新しいキーを追加する。
- `disabled` は共通項目または追加項目を解決結果から除外する。同じキーの upsert と無効化は同時に宣言できない。
- 解決順序は「共通正本 → プロジェクト upsert → `disabled`」で固定する。多段継承は行わない。

標準ロールは PO、PM、BA、ARC、DEV、QE、UX、OPS です。独自ロールを使うプロジェクトは、その Role code を `pm-roles.yaml` に定義したうえで、同じ role の `viewpoints` と `role_viewpoint_sets` をプロジェクト差分へ追加します。既存の全量形式は互換入力として読み込めますが、`exec scaffold` が新規生成するのは差分形式です。

## 2. レビューの観点とパス

どの方向から成果物をたどり、何の型を確認したかをどう記録するかを扱います。

### 2.1. レビューの基本パス

レビューは 3 つのパスで行います。

#### 2.1.1. 上位から下位へ

上位成果物の目的、要求、制約が下位成果物に展開されているかを確認します。

主に検出するもの

- 上位要求に対応する要件や仕様がない
- 重要な制約が設計や運用に反映されていない
- 非機能、例外、運用、監査の観点が下位成果物で消えている

#### 2.1.2. 下位から上位へ

下位成果物の記述に、上位根拠のない機能、仕様、設計判断が混ざっていないかを確認します。

主に検出するもの

- 根拠のない仕様追加
- スコープ外の設計判断
- agent の推測による機能追加
- 成果物間で説明されていない制約や例外

#### 2.1.3. 横断観点

成果物の種類にかかわらず、抜けやすい観点を横断して確認します。

主に確認するもの

- ステークホルダー
- 利用シーン
- 業務イベント
- 例外・異常系
- 権限・責務
- 状態遷移
- 入出力・データ
- 外部連携
- 非機能要求
- 運用・保守
- 監査・証跡
- 受入条件
- トレーサビリティ

### 2.2. coverage_types の使い方

`coverage_types` は、レビュー時に「何の型を確認したか」を記録するための語彙です。

`coverage_types` は観点そのものではなく、レビュー探索の軸です。たとえば `vp-qe-omissions-consistency` を使う場合でも、実際には `stakeholder`、`exception_case`、`non_functional`、`traceability` など、どの型を確認したかを分けて記録します。

review result では、`レビュー観点別結果` セクションの各 `RVP-NNN` に対して、確認した coverage_types と根拠を記述します。

例

```text
### RVP-003

- result: fail
- evidence: dct-project-definition.yaml の done_criteria / prj-scope.md / prj-success-criteria-and-acceptance-criteria.md
- notes: 例外ケースと非機能要求の展開に不足がある（確認できたのは stakeholder, use_case, exception_case, non_functional。traceability は未確認）。
```

確認できなかった coverage_types は、上記のように `notes` に範囲と理由を明記します。重大な抜けは `findings` に指摘として残します。

### 2.3. 要求・要件・仕様レビュー

要求、要件、仕様のヌケモレや間違いは、成果物単体だけでは検出しにくいものです。必ず隣接成果物との対応を確認します。各概念（要求 / 要件 / 仕様 / 設計 / 実装）の定義と、Why → What → How のトレース欠落・粒度混在などの典型的な失敗は [要求から実装までの考え方](../philosophy/needs-to-implementation-philosophy.md) を正本とし、レビュー観点の土台にします。

| 対象 | 主な確認                                                                         |
| ---- | -------------------------------------------------------------------------------- |
| 要求 | 業務目的、利用者、業務イベント、制約、成功条件、非機能、運用要求が抜けていないか |
| 要件 | 要求から機能・非機能・権限・データ・受入条件へ展開されているか                   |
| 仕様 | 要件に対する画面、API、状態、業務ルール、例外、データ、検証条件が明確か          |
| 設計 | 仕様を実現する構造、制約、責務、データ、外部依存、運用方法が明確か               |
| 運用 | 公開後の変更、問い合わせ、障害対応、監査、保守の扱いが明確か                     |

### 2.1. grade と共有する評価属性・rubric

viewpoint は review 専用ではなく、継続品質評価 `specdojo grade` と共有する正本です。各 viewpoint の `evaluation` は判定層（`deterministic` / `agent` / `human`）、`continuous` は grade 対象かを宣言します。`grade_targets` を省略した観点は kata と成果物の両方、指定した観点は列挙対象だけに適用します。grade 専用の別観点 ID は作りません。

`grade_rubric` の level 0-4 は category を跨いで共有し、viewpoint score を `level × 25` とします。review との対応は level 4 が `pass`、level 3 が `conditional_pass`、level 0-2 が `changes_requested` です。`blocked` は前提不足で判定できない状態なので level へ写像しません。

grade は継続監視の最新スナップショット、review result は完成時の合意形成履歴です。grade の結果は schedule assessment の機械収集 `facts` に取り込まれますが、目的・業務価値など `evaluation: human` の観点や最終承認を代替しません。

## 3. review plan と review result

SpecDojo のレビューは、原則として review plan を作ってから実施し、review result を残します。

review plan は `specdojo exec plan` または `specdojo exec run` が必要時に生成します。review result は `specdojo exec claim` 時に scaffold され（`specdojo exec run` が claim を兼ねる場合も含む）、`specdojo exec run` または人の作業によって Frontmatter + Markdown 形式で更新します。

```text
共通レビュー観点 + プロジェクト差分（pm-review-viewpoints.yaml）
  ↓ 解決
dct-*.yaml
  ↓
rulebook
  ↓
exec plan / exec run → review plan（exec/plans/<task-id>-plan.md）
  ↓
human / agent review（exec run）
  ↓
review result（exec/results/<task-id>-result.md）
  ↓
PJR / 修正 / 再レビュー
```

review plan は「今回のレビューで何を見るか」を固定します。review result は「実際に何を見て、何が分かり、何を未確認として残したか」を記録します。

| 成果物        | 役割                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| review plan   | 対象成果物、Role code、viewpoint、coverage_required、エビデンス例、完了手順を定義する |
| review result | レビュー観点ごとの判定（pass / fail / unclear）、根拠、findings、decision を記録する  |

review result を直接作らず、review plan を挟むことで、レビュー範囲の揺れ、観点の抜け、未実施レビューを検出しやすくします。

### 3.1. edit plan の完了の狙い

通常の成果物編集を行う edit plan は、観点別の自己レビューを行いません。代わりに、`done_criteria` を「完了の狙い」として素の箇条書き（観点・coverage なし）で提示し、編集者は rulebook / recipe / sample / template と「進め方」に沿って記述する中で、その狙いを満たすことを目指します。

- 品質の担保は rulebook（必須項目・禁止事項）・recipe（書き方・レビュー観点・仕上げチェック）・sample・template が担います。
- `done_criteria` を満たしているかの多観点での最終判定は、後続の独立した review plan / review result が行います。
- maintenance 系 approach は対象と判定基準が異なるため、完了の狙いの提示は行いません。

edit plan で観点別の自己レビューを行わないのは、各観点を満たそうとして成果物へ過剰な記述を挿入する副作用を避けるためです。多観点での判定と証跡は review task に集約し、review task では成果物を修正せず第三者的な立場で残します。

### 3.2. review plan の生成

review plan は `specdojo exec plan` または `specdojo exec run` によって機械生成します（`mode: review` のタスクが対象）。`exec refresh` は Ready などの実行状態を更新しますが、plan は生成しません。

主な入力

- 成果物カタログの `local_id`、`path`、`depends_on`、`done_criteria`
- 共通正本と `pm-review-viewpoints.yaml` の差分を解決した `viewpoints`、`coverage_types`
- 対応する rulebook
- `sch-strategy-<track>.yaml` が宣言する `mode: review` フェーズ

review plan は、成果物カタログの `done_criteria[].roles` と `done_criteria[].viewpoint` から `レビュー観点` セクションの review item（`RVP-NNN`）を作ります。

### 3.3. review plan の配置

review plan は `<execution_path>/exec/plans/<task-id>-plan.md` に生成します。`<execution_path>` はプロジェクトの実行ディレクトリ（例: `execution`）を指します。

例

```text
exec/plans/T-LAUNCH-prj-overview-030-plan.md
```

### 3.4. review plan の構成

review plan は Frontmatter と本文セクションで構成します。

```yaml
specdojo:
  id: <project-id>:xrp-<task-id>
  type: exec-plan
  rulebook: none
  task_id: <task-id>
  name: <フェーズ名>
  mode: review
  status: ready
  project_id: <project_id>
  owner: <Role code>
  on_critical_path: true | false
```

| セクション             | 内容                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| このフェーズで行うこと | 担当ロールが何を判断するか（承認・修正指示・差し戻し）                                            |
| 対象成果物             | 対象パス、rulebook、対応する review result のパス                                                 |
| レビュー観点           | `RVP-NNN` 単位の Role code、viewpoint_id、確認基準、coverage_required、チェック観点、エビデンス例 |
| 完了手順               | レビュー観点ごとの判定方法と review result への記入手順                                           |
| 異常終了の条件         | done_criteria を満たさない場合などに block を記録する条件                                         |

### 3.5. review execution

人または agent は review plan に従ってレビューします。`<execution_path>/exec/results/<task-id>-result.md` は `specdojo exec claim` の時点で scaffold される（手動 claim でも `exec run` 経由の claim でも同様）ため、agent または人はそこに結果を記入します。

レビューでどこまで rulebook / recipe / sample / template に照らすかは、タスクに付与された `approach` に従います。詳細は [実践の進め方ガイド](ryu-guide.md) を参照してください。

実行時の原則

- `レビュー観点` の各項目（`RVP-NNN`）を勝手に省略しません。
- plan にない観点で重大な問題を見つけた場合は、`findings` に追加します。
- 確認できない範囲は pass にせず、`unclear` として根拠とともに残します。
- 機械検証の失敗は、意味レビューの結果と分けて記録します。
- agent は最終承認、公開可否判断、説明責任を担いません。

### 3.6. review result の構成

review result は `<execution_path>/exec/results/<task-id>-result.md` に生成・更新します。

```yaml
specdojo:
  id: <project-id>:xrr-<task-id>
  type: exec-result
  task_id: <task-id>
  mode: review
  status: in_progress | complete | blocked
  project_id: <project_id>
  plan_ref: exec/plans/<task-id>-plan.md
  started_at: <ISO8601>
  completed_at: <ISO8601>
  agent: <member nickname>
```

| セクション         | 内容                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| レビュー観点別結果 | `RVP-NNN` ごとの `result`（pass / fail / unclear）、`evidence`、`notes` |
| findings           | 指摘事項（severity、対象箇所、概要、修正方針を含めて記述する）          |
| decision           | `recommendation`（approve / revise / reject）と承認要否                 |

## 4. レビュー結果の記録

review result に何をどう残し、findings をどう分類し、どこへ引き継ぐかを扱います。

### 4.1. レビュー結果の残し方

レビュー結果は、成果物単位、フェーズ単位、Role code 単位で記録します。review result は必ず review plan に対応させ、Frontmatter の `plan_ref` で参照します。

`レビュー観点別結果` セクションには、`RVP-NNN` ごとに次を記入します。

| 項目     | 内容                                                                     |
| -------- | ------------------------------------------------------------------------ |
| result   | `pass` / `fail` / `unclear`                                              |
| evidence | 確認した根拠（参照箇所、具体的な記述）                                   |
| notes    | 判定根拠の補足、coverage_required のうち確認できた範囲とできなかった範囲 |

`findings` セクションには、確認した中で見つかった指摘事項を次の観点で記述します。

| 項目           | 内容                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| severity       | `blocker` / `major` / `minor` / `note`                                                                                           |
| category       | `purpose` / `planning` / `business` / `architecture` / `implementation` / `quality` / `usability` / `operations` / `consistency` |
| location       | 見出し、行、キー、またはファイル全体                                                                                             |
| summary        | 指摘概要                                                                                                                         |
| recommendation | 修正方針                                                                                                                         |

`decision` セクションには、レビュー全体としての判断（`approve` / `revise` / `reject`）と、PO 判断が必要かどうかを記述します。

### 4.2. finding の分類

| 種別             | 内容                                             |
| ---------------- | ------------------------------------------------ |
| missing          | 必要な要求、要件、仕様、章、キー、参照がない     |
| inconsistency    | 成果物間で矛盾している                           |
| unsupported      | 上位根拠のない記述がある                         |
| ambiguous        | 判断、実装、検証に必要な具体性が不足している     |
| unverifiable     | pass / fail を判断できない                       |
| risk             | 後続作業、公開、運用で問題になる可能性がある     |
| policy_violation | 禁止事項、承認責任、agent 委任境界に違反している |

### 4.3. PJR への転記

すべてのレビュー指摘を PJR に転記しません。review result には詳細を残し、プロジェクト管理対象だけを PJR に転記します。

PJR に転記する条件

- PO 判断が必要です。
- 後続成果物、Schedule、公開判断に影響します。
- スコープ、責任分担、成果物追加に影響します。
- 重大な矛盾によりレビュー継続ができません。
- 将来リスクとして監視する必要があります。

## 5. Agent への指示テンプレート

### 5.1. 単体レビュー

```text
review plan に従って対象成果物をレビューしてください。
各 RVP-NNN について result（pass / fail / unclear）を判定し、viewpoint_id、確認した coverage_types、evidence、notes を記入し、指摘は findings、全体判断は decision（recommendation: approve / revise / reject）に記録してください。
```

### 5.2. トレーサビリティレビュー

```text
対象成果物を単体でレビューせず、上位成果物と下位成果物の対応を確認してください。
上位から下位への未展開、下位から上位への根拠なし、横断観点の抜けを findings として整理してください。
```

### 5.3. 差分レビュー

```text
前回レビュー結果と現在の成果物を比較してください。
解消済み、未解消、新規発生、再発を分類し、再レビューが必要な viewpoint_id を明示してください。
```

### 5.4. 再レビュー

```text
前回 findings の対応結果だけでなく、修正により新しい矛盾や抜けが発生していないかを確認してください。
変更箇所、関連成果物、coverage_types を根拠付きで記録してください。
```

## 6. 完了と確定

レビューを完了と見なす条件と、成果物を `ready` へ昇格させる条件を扱います。

### 6.1. 完了条件

レビューを完了とするには、次を満たします。

- review result が review plan の全 `RVP-NNN` に対応しています。
- 対象成果物の `done_criteria` に対応する観点を確認しています。
- 確認した `viewpoint_id` と `coverage_types` が記録されています。
- pass / fail の根拠となる `evidence` が記録されています。
- 未確認範囲がある場合は `notes` に残しています。
- `blocker` と `major` の未解決指摘が扱われています。
- PO 判断が必要な事項は PJR または decision に接続されています。
- agent が最終承認者になっていません。

### 6.2. 成果物 ready 化条件

成果物を完成版または `ready` 候補にするには、次をすべて満たすことが必要です。

- 対象成果物の `done_criteria` に対応する全 Role code のレビューが完了しています。
- `blocker` と `major` の未解決指摘が 0 件です。
- 条件付き合格とした指摘が PO により許容または対応済みと判断されています。
- 関連する PJR がある場合、対応方針、担当 Role code、期限が記録されています。
- `npm run -s lint:md`、必要な YAML schema 検証、生成物再作成など、対象成果物に必要な機械検証が完了しています。
- 最終承認、公開可否判断、説明責任を人間の `PO` が担っています。
