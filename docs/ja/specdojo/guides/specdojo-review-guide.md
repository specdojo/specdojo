---
id: specdojo-review-guide
type: guide
status: draft
---

# SpecDojo レビューガイド

本ドキュメントは SpecDojo における **成果物レビューの進め方**を定義する。

レビューは「問題なし」を宣言する作業ではない。どの観点を確認し、どの根拠を見て、何を未確認として残したかを記録する作業である。

## 1. レビューの役割

SpecDojo のレビューは次を扱う。

| 項目 | 内容 |
| ---- | ---- |
| 完全性 | 要求、要件、仕様、設計、運用に抜けがないか |
| 整合性 | 成果物間で目的、用語、状態、責務、制約が矛盾していないか |
| 妥当性 | 上位目的、業務価値、制約、判断方針に合っているか |
| 検証可能性 | pass / fail を判断できる完了条件、受入条件、証跡があるか |
| 追跡可能性 | 上位目的から要求、要件、仕様、設計、テスト、運用まで対応を追えるか |

レビューの合格条件は、対象プロジェクトの成果物カタログに定義された `done_criteria` を正とする。

## 2. レビューの入力

レビューでは次を入力として扱う。

| 入力 | 役割 |
| ---- | ---- |
| 対象成果物 | レビュー対象の Markdown / YAML / JSON など |
| 成果物カタログ | `done_criteria`、依存関係、成果物の位置づけ |
| rulebook | 必須章、必須キー、禁止事項、構造ルール |
| instruction | agent が成果物を作成・更新するときの指示 |
| sample | 期待する成果物の具体例 |
| review viewpoints | Role code 別の観点、severity、verdict、coverage_types |
| 関連成果物 | 上位・下位・隣接成果物、Schedule、RACI、PJR |
| 機械検証結果 | lint、schema validation、生成確認、リンク確認 |

## 3. レビューの基本パス

レビューは 3 つのパスで行う。

### 3.1. 上位から下位へ

上位成果物の目的、要求、制約が下位成果物に展開されているかを確認する。

主に検出するもの

- 上位要求に対応する要件や仕様がない
- 重要な制約が設計や運用に反映されていない
- 非機能、例外、運用、監査の観点が下位成果物で消えている

### 3.2. 下位から上位へ

下位成果物の記述に、上位根拠のない機能、仕様、設計判断が混ざっていないかを確認する。

主に検出するもの

- 根拠のない仕様追加
- スコープ外の設計判断
- agent の推測による機能追加
- 成果物間で説明されていない制約や例外

### 3.3. 横断観点

成果物の種類にかかわらず、抜けやすい観点を横断して確認する。

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

## 4. coverage_types の使い方

`coverage_types` は、レビュー時に「何の型を確認したか」を記録するための語彙である。

`coverage_types` は観点そのものではなく、レビュー探索の軸である。たとえば `vp-qe-omissions-consistency` を使う場合でも、実際には `stakeholder`、`exception_case`、`non_functional`、`traceability` など、どの型を確認したかを分けて記録する。

review result では、`レビュー観点別結果` セクションの各 `RVP-NNN` に対して、確認した coverage_types と根拠を記述する。

例

```text
### RVP-003

- result: fail
- evidence: dct-project-definition.yaml の done_criteria / prj-scope.md / prj-success-criteria-and-acceptance-criteria.md
- notes: 例外ケースと非機能要求の展開に不足がある（確認できたのは stakeholder, use_case, exception_case, non_functional。traceability は未確認）。
```

確認できなかった coverage_types は、上記のように `notes` に範囲と理由を明記する。重大な抜けは `findings` に指摘として残す。

## 5. 要求・要件・仕様レビュー

要求、要件、仕様のヌケモレや間違いは、成果物単体だけでは検出しにくい。必ず隣接成果物との対応を確認する。

| 対象 | 主な確認 |
| ---- | -------- |
| 要求 | 業務目的、利用者、業務イベント、制約、成功条件、非機能、運用要求が抜けていないか |
| 要件 | 要求から機能・非機能・権限・データ・受入条件へ展開されているか |
| 仕様 | 要件に対する画面、API、状態、業務ルール、例外、データ、検証条件が明確か |
| 設計 | 仕様を実現する構造、制約、責務、データ、外部依存、運用方法が明確か |
| 運用 | 公開後の変更、問い合わせ、障害対応、監査、保守の扱いが明確か |

## 6. 機械検証とレビューの分担

機械で確認できることは、レビュー判断の前に検証する。

| 確認対象 | 主な方法 |
| -------- | -------- |
| YAML / JSON の必須キー | JSON Schema |
| 型、enum、ID形式 | JSON Schema |
| Markdown の基本構造 | lint、custom validator |
| リンク、参照先 | custom validator |
| IDの一意性 | custom validator |
| 生成物の同期 | generate command、diff |
| 意味の妥当性 | agent / human review |
| 判断責任 | human approver |

機械検証で失敗した成果物は、意味レビューの前に修正する。ただし、検証不能な前提や設計判断は review result に残してよい。

## 7. review plan と review result

SpecDojo のレビューは、原則として **review plan を作ってから実施し、review result を残す**。

review plan は `specdojo exec build` が生成する。review result は `specdojo exec claim` 時に scaffold され（`specdojo exec run` が claim を兼ねる場合も含む）、`specdojo exec run` または人の作業によって Frontmatter + Markdown 形式で更新する。

```text
pm-review-viewpoints.yaml
  ↓
dct-*.yaml
  ↓
rulebook
  ↓
exec build → review plan（exec/plans/<task-id>-plan.md）
  ↓
human / agent review（exec run）
  ↓
review result（exec/results/<task-id>-result.md）
  ↓
PJR / 修正 / 再レビュー
```

review plan は「今回のレビューで何を見るか」を固定する。review result は「実際に何を見て、何が分かり、何を未確認として残したか」を記録する。

| 成果物 | 役割 |
| ------ | ---- |
| review plan | 対象成果物、Role code、viewpoint、coverage_required、エビデンス例、完了手順を定義する |
| review result | レビュー観点ごとの判定（pass / fail / unclear）、根拠、findings、decision を記録する |

review result を直接作らず、review plan を挟むことで、レビュー範囲の揺れ、観点の抜け、未実施レビューを検出しやすくする。

### 7.1. review plan の生成

review plan は `specdojo exec build` によって機械生成する（`mode: review` のタスクが対象）。

主な入力

- 成果物カタログの `local_id`、`path`、`depends_on`、`done_criteria`
- `pm-review-viewpoints.yaml` の `viewpoints`、`coverage_types`
- 対応する rulebook
- `sch-strategy-<track>.yaml` が宣言する `mode: review` フェーズ

review plan は、成果物カタログの `done_criteria[].roles` と `done_criteria[].viewpoint` から `レビュー観点` セクションの review item（`RVP-NNN`）を作る。

### 7.2. review plan の配置

review plan は `<execution_path>/exec/plans/<task-id>-plan.md` に生成する。`<execution_path>` はプロジェクトの実行ディレクトリ（例: `030-project-management/execution`）を指す。

例

```text
exec/plans/T-LAUNCH-prj-overview-030-plan.md
```

### 7.3. review plan の構成

review plan は Frontmatter と本文セクションで構成する。

```yaml
id: <project-id>:xrp-<task-id>
type: exec-plan
rulebook: xep-rulebook
task_id: <task-id>
name: <フェーズ名>
mode: review
status: ready
project_id: <project_id>
owner: <Role code>
on_critical_path: true | false
viewpoints_ref: <pm-review-viewpoints.yaml のパス>
```

| セクション | 内容 |
| ---------- | ---- |
| このフェーズで行うこと | 担当ロールが何を判断するか（承認・修正指示・差し戻し） |
| 対象成果物 | 対象パス、rulebook、対応する review result のパス |
| レビュー観点 | `RVP-NNN` 単位の Role code、viewpoint_id、確認基準、coverage_required、チェック観点、エビデンス例 |
| 完了手順 | レビュー観点ごとの判定方法と review result への記入手順 |
| 異常終了の条件 | done_criteria を満たさない場合などに block を記録する条件 |

### 7.4. review execution

人または agent は review plan に従ってレビューする。`<execution_path>/exec/results/<task-id>-result.md` は `specdojo exec claim` の時点で scaffold される（手動 claim でも `exec run` 経由の claim でも同様）ため、agent または人はそこに結果を記入する。

レビューでどこまで rulebook / recipe / sample に照らすかは、タスクに付与された `approach` に従う。詳細は [specdojo-reference-materials-guide](specdojo-reference-materials-guide.md) を参照する。

実行時の原則

- `レビュー観点` の各項目（`RVP-NNN`）を勝手に省略しない。
- plan にない観点で重大な問題を見つけた場合は、`findings` に追加する。
- 確認できない範囲は pass にせず、`unclear` として根拠とともに残す。
- 機械検証の失敗は、意味レビューの結果と分けて記録する。
- agent は最終承認、公開可否判断、説明責任を担わない。

### 7.5. review result の構成

review result は `<execution_path>/exec/results/<task-id>-result.md` に生成・更新する。

```yaml
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

| セクション | 内容 |
| ---------- | ---- |
| レビュー観点別結果 | `RVP-NNN` ごとの `result`（pass / fail / unclear）、`evidence`、`notes` |
| findings | 指摘事項（severity、対象箇所、概要、修正方針を含めて記述する） |
| decision | `recommendation`（approve / revise / reject）と承認要否 |

## 8. レビュー結果の残し方

レビュー結果は、成果物単位、フェーズ単位、Role code 単位で記録する。review result は必ず review plan に対応させ、Frontmatter の `plan_ref` で参照する。

`レビュー観点別結果` セクションには、`RVP-NNN` ごとに次を記入する。

| 項目 | 内容 |
| ---- | ---- |
| result | `pass` / `fail` / `unclear` |
| evidence | 確認した根拠（参照箇所、具体的な記述） |
| notes | 判定根拠の補足、coverage_required のうち確認できた範囲とできなかった範囲 |

`findings` セクションには、確認した中で見つかった指摘事項を次の観点で記述する。

| 項目 | 内容 |
| ---- | ---- |
| severity | `blocker` / `major` / `minor` / `note` |
| category | `purpose` / `planning` / `business` / `architecture` / `implementation` / `quality` / `usability` / `operations` / `consistency` |
| location | 見出し、行、キー、またはファイル全体 |
| summary | 指摘概要 |
| recommendation | 修正方針 |

`decision` セクションには、レビュー全体としての判断（`approve` / `revise` / `reject`）と、PO 判断が必要かどうかを記述する。

## 9. finding の分類

| 種別 | 内容 |
| ---- | ---- |
| missing | 必要な要求、要件、仕様、章、キー、参照がない |
| inconsistency | 成果物間で矛盾している |
| unsupported | 上位根拠のない記述がある |
| ambiguous | 判断、実装、検証に必要な具体性が不足している |
| unverifiable | pass / fail を判断できない |
| risk | 後続作業、公開、運用で問題になる可能性がある |
| policy_violation | 禁止事項、承認責任、agent 委任境界に違反している |

## 10. PJR への転記

すべてのレビュー指摘を PJR に転記しない。review result には詳細を残し、プロジェクト管理対象だけを PJR に転記する。

PJR に転記する条件

- PO 判断が必要
- 後続成果物、Schedule、公開判断に影響する
- スコープ、責任分担、成果物追加に影響する
- 重大な矛盾によりレビュー継続ができない
- 将来リスクとして監視する必要がある

## 11. Agent への指示テンプレート

### 11.1. 単体レビュー

```text
review plan に従って対象成果物をレビューしてください。
各 review_items について pass / fail / skip を判定し、plan_item_id、viewpoint_id、coverage_checked、evidence、findings、unverified_scope、verdict を含めてください。
```

### 11.2. トレーサビリティレビュー

```text
対象成果物を単体でレビューせず、上位成果物と下位成果物の対応を確認してください。
上位から下位への未展開、下位から上位への根拠なし、横断観点の抜けを findings として整理してください。
```

### 11.3. 差分レビュー

```text
前回レビュー結果と現在の成果物を比較してください。
解消済み、未解消、新規発生、再発を分類し、再レビューが必要な viewpoint_id を明示してください。
```

### 11.4. 再レビュー

```text
前回 findings の対応結果だけでなく、修正により新しい矛盾や抜けが発生していないかを確認してください。
変更箇所、関連成果物、coverage_types を根拠付きで記録してください。
```

## 12. 完了条件

レビューを完了とするには、次を満たす。

- review result が review plan の全 `review_items` に対応している。
- 対象成果物の `done_criteria` に対応する観点を確認している。
- 使用した `plan_item_id`、`viewpoint_id`、`coverage_checked` が記録されている。
- pass / fail の根拠となる `evidence` が記録されている。
- 未確認範囲がある場合は `unverified_scope` に残している。
- `blocker` と `major` の未解決指摘が扱われている。
- PO 判断が必要な事項は PJR または decision に接続されている。
- agent が最終承認者になっていない。

## 13. 成果物 ready 化条件

成果物を完成版または `ready` 候補にするには、次をすべて満たすこと。

- 対象成果物の `done_criteria` に対応する全 Role code のレビューが完了している。
- `blocker` と `major` の未解決指摘が 0 件である。
- `conditional_pass` の条件が PO により許容または対応済みと判断されている。
- 関連する PJR がある場合、対応方針、担当 Role code、期限が記録されている。
- `npm run -s lint:md`、必要な YAML schema 検証、生成物再作成など、対象成果物に必要な機械検証が完了している。
- 最終承認、公開可否判断、説明責任を人間の `PO` が担っている。

## 14. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| `pm-review-viewpoints.yaml` | Role code 別の観点、severity、verdict、coverage_types を定義する |
| `dct-*.yaml` | 成果物、依存関係、done_criteria（text / roles / viewpoint）を定義する |
| `*-rulebook.md` | 成果物ごとの構造、必須項目、禁止事項を定義する |
| `pjr-index.md` | プロジェクト管理対象の未解決事項、課題、リスク、変更要求、決定を管理する |
