---
specdojo:
  id: specdojo:review-guide
  type: guide
  status: ready
---

# レビューガイド

Review Guide

本ドキュメントは SpecDojo における review（レビュー）の進め方を定義します。

review はタスクの成果を判定する作業です。成果物の品質は判定しません。成果物の品質は grade が一度だけ評価し、review はその評価結果（grade・finding）を確定済みの事実として受け取り、このタスクを完了してよいかを判断します。観点ごとに成果物を評価し直すことはしません。

**対象読者**

- SpecDojo の review plan を実行する担当者・エージェント、品質管理者

**この文書で分かること**

- grade と review の分担、review の入力、review plan・result の構成、verdict の記録、改善指示の扱い、成果物を ready にする条件

**次に読む文書**

- レビュー時の実践の型の使い方は [実践の進め方ガイド](ryu-guide.md)、plan・result の共通ライフサイクルは [plan/resultライフサイクルガイド](plan-result-lifecycle-guide.md) を参照してください。

最初に review を実行する場合は、`レビューの位置づけ`、`review plan と review result`、`完了と確定` を読めば実施できます。grade が評価する観点の定義は `grade が評価する観点`、改善指示の転記判断は `レビュー結果の記録`、手動で agent へ依頼する場合の文面は `Agent への指示テンプレート` を参照してください。

## 1. レビューの位置づけ

review が何を判定する活動か、何を入力とするか、grade・機械検証とどう分担するかを示します。

### 1.1. レビューの役割

grade と review は判定する対象が異なります。2 つは重複する評価ではなく、別の問いに答えます。

| 経路   | 判定対象     | 出力                             | 問い                     |
| ------ | ------------ | -------------------------------- | ------------------------ |
| grade  | 成果物       | grade（verdict・score）・finding | この文書の品質はどうか   |
| review | タスクの成果 | verdict（完了可否）・改善指示    | この作業を完了してよいか |

品質が低くても今回のタスクの範囲では完了してよい場合があり、品質が十分でもタスクが要求したことを行っていなければ完了できません。review はこの違いを判断します。

- 同じ対象を同じ基準で 2 回評価しません。完全性・整合性・妥当性・検証可能性・追跡可能性といった成果物の品質は、grade が観点ごとに評価します。
- review は grade の結果を事実として受け取り、観点ごとの判定を付け直したり、grade が検出済みの finding を改めて指摘したりしません。評価結果に疑義がある場合は、疑義の内容と再評価が必要な理由を改善指示に記録します。
- タスクの完了条件は、対象プロジェクトの成果物カタログに定義された `done_criteria` を正とします。充足の判定が評価結果にある場合は、それを事実として用います。

### 1.2. レビューの入力

review では次を入力として扱います。確認に用いる文書は review plan に記載されたものに限ります。

| 入力           | 正本ファイル                   | 役割                                                                           |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| 評価結果       | grade result サイドカー        | grade の verdict・score・観点ごとの level・finding。review plan にも提示される |
| review plan    | `exec/plans/<task-id>-plan.md` | 対象成果物、評価結果、完了条件、進め方を固定する                               |
| 実行記録       | 先行する edit タスクの result  | 何を変更し、どの検証を実行したか                                               |
| 対象成果物     | -                              | 変更内容を確かめる対象の Markdown / YAML / JSON など                           |
| 成果物カタログ | `dct-*.yaml`                   | 成果物、依存関係、`done_criteria`（text / roles / viewpoint）を定義する        |
| 関連成果物     | -                              | `depends_on` 成果物とプロジェクトコンテキスト                                  |
| 登録簿         | `generated/pjr-index.md`       | 未解決事項、課題、リスク、変更要求、決定の転記先                               |

### 1.3. grade・機械検証・review の分担

機械で確認できることと成果物の品質は、review の判断の前に確定させます。

| 確認対象               | 主な方法                |
| ---------------------- | ----------------------- |
| YAML / JSON の必須キー | JSON Schema             |
| 型、enum、ID形式       | JSON Schema             |
| Markdown の基本構造    | lint、custom validator  |
| リンク、参照先         | custom validator        |
| IDの一意性             | custom validator        |
| 生成物の同期           | generate command、diff  |
| 成果物の品質           | grade（観点ごとの評価） |
| タスクの完了可否       | review（verdict）       |
| 判断責任               | human approver          |

機械検証で失敗した成果物は、review の前に修正します。grade の評価結果が最新でない場合、review は成果物を自分で評価して補わず、verdict を `grade-stale` として記録します。

### 1.4. 共通観点とプロジェクト差分

レビュー観点の共通正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] です。プロジェクトの `viewpoints_path` は共通正本の全量コピーではなく、次の差分だけを保持します。

- `extends: specdojo:pm-review-viewpoints` で共通正本を1段だけ継承する。
- `categories`、`coverage_types`、`severity_levels`、`verdict_definitions`、`viewpoints` は `id`、`role_viewpoint_sets` は `role` が同じ項目を全体上書きし、新しいキーを追加する。
- `disabled` は共通項目または追加項目を解決結果から除外する。同じキーの upsert と無効化は同時に宣言できない。
- 解決順序は「共通正本 → プロジェクト upsert → `disabled`」で固定する。多段継承は行わない。

標準ロールは PO、PM、BA、ARC、DEV、QE、UX、OPS です。独自ロールを使うプロジェクトは、その Role code を `pm-roles.yaml` に定義したうえで、同じ role の `viewpoints` と `role_viewpoint_sets` をプロジェクト差分へ追加します。既存の全量形式は互換入力として読み込めますが、`exec scaffold` が新規生成するのは差分形式です。

## 2. grade が評価する観点

観点（viewpoint）は grade が成果物を評価するための定義です。本章は、観点がどの方向から成果物をたどり、何の型を確認するかを示します。review はこれらの観点で成果物を評価し直しません。

### 2.1. 評価の基本パス

観点の評価は 3 つのパスで行います。

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

`coverage_types` は、観点が「何の型を確認するか」を表す語彙です。

`coverage_types` は観点そのものではなく、評価の探索軸です。たとえば `vp-qe-omissions-consistency` は、`stakeholder`、`exception_case`、`non_functional`、`traceability` など複数の型にまたがって抜け漏れを確認します。観点定義の `coverage_types` は grade の評価で使われ、review result には記録しません。

### 2.3. 要求・要件・仕様の評価

要求、要件、仕様のヌケモレや間違いは、成果物単体だけでは検出しにくいものです。観点は隣接成果物との対応を確認します。各概念（要求 / 要件 / 仕様 / 設計 / 実装）の定義と、Why → What → How のトレース欠落・粒度混在などの典型的な失敗は [要求から実装までの考え方](../philosophy/needs-to-implementation-philosophy.md) を正本とし、評価観点の土台にします。

| 対象 | 主な確認                                                                         |
| ---- | -------------------------------------------------------------------------------- |
| 要求 | 業務目的、利用者、業務イベント、制約、成功条件、非機能、運用要求が抜けていないか |
| 要件 | 要求から機能・非機能・権限・データ・受入条件へ展開されているか                   |
| 仕様 | 要件に対する画面、API、状態、業務ルール、例外、データ、検証条件が明確か          |
| 設計 | 仕様を実現する構造、制約、責務、データ、外部依存、運用方法が明確か               |
| 運用 | 公開後の変更、問い合わせ、障害対応、監査、保守の扱いが明確か                     |

### 2.4. grade と共有する評価属性・rubric

viewpoint は継続品質評価 `specdojo grade` の正本です。review plan は同じ観点定義から完了条件の適用を判定しますが、観点を評価し直すためではありません。各 viewpoint の `evaluation` は判定の規準がどこにあるか（`deterministic` / `referential` / `discretionary`）を宣言し、判定の実行経路を選ぶためにだけ使います。すべての viewpoint が grade の対象です。grade の対象範囲は `grade_targets` と `document_kinds` だけで決まります。旧フィールド `continuous` は削除済みで、観点定義に残っていると削除済みであることを示すエラーで読み込みに失敗します。`grade_targets` を省略した観点は kata と成果物の両方、指定した観点は列挙対象だけに適用します。`document_kinds` は rulebook ID 単位でさらに適用先を絞り、grade plan と review plan の両方が同じ宣言を使います。grade 専用の別観点 ID は作りません。

`evaluation` は「判定に必要な根拠がどこにあるか」ではなく、「何が正しいかを決める規準がどこにあるか」で区分します。観点を追加するときは、`check` の文言に何と比べるかが書かれているかで判定します。

| `evaluation`    | 規準の所在                                                                      | `check` の文型の例                                    | grade での実行経路                     |
| --------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| `deterministic` | 機械可読な規則（schema、lint）                                                  | schema と整合しているか、文書体系と整合しているか     | コードで判定する                       |
| `referential`   | 他の文書、宣言された定義（`done_criteria` など）、または `check` 自身が書く規準 | …と矛盾していないか、`done_criteria` を満たしているか | agent へ渡す。突き合わせ先を指示する   |
| `discretionary` | 判定者が持ち込む。文書に規準がない                                              | 必要な範囲で明示されているか、使える粒度か、分かるか  | agent へ渡す。判定の安定性は保証しない |

「必要十分」「適切な粒度」のような十分性の語を含む観点でも、`check` が判定規準を書き込んでいれば `referential` です。`discretionary` の観点は、`check` に規準を書き込むことで `referential` へ移せます。`evaluation` は実行主体を表しません。grade はすべての区分の観点を判定し、review はどの区分の観点も判定し直しません。旧値 `agent` / `human` は削除済みで、読み込むと新しい値を示すエラーで失敗します。

文書の種類は Frontmatter の `specdojo.rulebook` を正本とします。rulebook 文書は自身の `specdojo.id`、template 文書は `frontmatter_template.specdojo.rulebook` から種類を解決するため、同じ実践の型に属する rulebook / recipe / sample / template / 成果物は同じ rulebook ID で判定されます。`rulebook: none`、未設定、`undecided`、`not-needed` は未分類です。未分類文書は既定で観点を適用し、`document_kinds.unclassified: exclude` を明示した観点だけ除外します。

`document_kinds.include` は列挙した種類だけへ適用し、`document_kinds.exclude` は列挙した種類を除外します。二つは同時に指定できません。宣言を省略した観点は全種類へ適用します。`grade_targets` は kata / deliverable という評価経路の大分類、`document_kinds` は rulebook ID による文書種類の細分類であり、両方を指定した場合は双方を満たす文書だけを対象にします。

`include` または `exclude` で rulebook ID を列挙した観点は、すべての rulebook について扱いを判断済みにします。列挙していない rulebook を既定の結果（`exclude` の観点では適用、`include` の観点では対象外）のままにすると判断した場合は、`document_kinds.confirmed_default` へ列挙します。`confirmed_default` は判断の記録で、適用判定は変えません。同じ rulebook を `include` / `exclude` と重ねて書くことはできません。`src/viewpoint-document-kinds-check.ts` の検証は、どこにも載っていない rulebook、存在しない rulebook ID、重複した判断を観点 ID と rulebook ID の組で error として報告します。この検証は `npm test`（`npm run check` に含まれる）で実行され、`npx tsx src/viewpoint-document-kinds-check.ts` で単独でも実行できます。`unclassified` だけを宣言した観点は全種類へ適用するため、検証の対象外です。

`grade_rubric` の level 0-4 は category を跨いで共有し、viewpoint score を `level × 25` とします。`grade_rubric` には level ごとの `review_verdict`（level 4 が `complete`、level 3 が `complete-with-findings`、level 0-2 が `incomplete`）が定義されています。これは grade の level を review の入力にする写像であり、review はこの対応で観点を判定し直しません。写像の使い方は `grade の結果を review の入力にする規則` に示します。

文書の score は、category ごとの score（観点の level 平均 × 25）を `grade_rubric.weights` の重みで加重平均した値です。重みは kata と成果物で別に持ち、どちらも 9 category すべてに重みを置きます。文書に適用される観点が 1 つもない category は、その文書の加重平均から外します。観点の category に重みがない rubric は、grade の実行時にエラーで失敗します。verdict は blocker があれば `fail`、major があるか score が `pass_score` 未満なら `needs-work`、それ以外は `pass` です。`pass_score` は level 3（軽微な課題）の score に合わせて 75 とし、major のない文書が category の数や重みに関係なく満たす下限にしています。

rubric は `grade-rubric-v2` です。v1 は 4 category（architecture / consistency / quality / usability）だけで score を計算していました。v2 は 28 観点すべてと 9 category で計算するため、v1 の grade result とは score・verdict を比較できません。同じ文書でも、目的・計画・業務価値・実装・運用の観点が加わることで score が変わります。grade result の `rubric` が `grade-rubric-v1` の結果は旧基準の値として扱い、現在品質の根拠や傾向比較に使う前に `grade list --rubric-outdated` で列挙して再評価します。`--changed-only` は rubric の違いを検出しません。

grade は継続監視の最新スナップショット、review result は完成時の合意形成履歴です。Kata の grade は schedule strategy の approach 導出に使われますが、完成時の合意形成や最終承認を代替しません。

#### 2.4.1. 成果物 grade と review result の責務境界

成果物の現在品質と変更後の再評価は `grade --target deliverable` を正とします。成果物カタログの `done_criteria` は grade plan に取り込まれ、score とは独立して条件ごとの充足を判定します。充足数・総数・未充足条件の担当 Role code・詳細参照は grade result サイドカーに置き、条件文と不足理由は成果物ごとの grade 詳細ファイルに記録します。

評価が現在内容に対するものかは、保存された `content_hash` と現在の成果物ファイル全体のハッシュが一致するかで判断します。不一致の grade と、実行後に成果物が変更された review result は、どちらも現在品質の根拠には使いません。`grade list --target deliverable --changed-only` と定期 routine は、この不一致を再評価対象として検出します。成果物カタログやメンバー定義など他の文書と突き合わせる観点は、観点定義の `comparison_sources` で突き合わせ先を宣言します。突き合わせ先の hash がサイドカーの `source_hashes` と異なる grade も、本文が変わっていなくても現在品質の根拠に使わず、`--changed-only` で再評価対象になります。

review result は特定時点に誰が何を確認し、どの合意を行ったかを残す不変の履歴です。既存 review result は削除・移行せず、最新状態の判定には利用しません。090 の review タスクと `G-*-review-pass` は人の合意形成・最終承認のゲートとして維持し、継続品質の再評価は grade が担います。これにより二つの結果を同じ最新状態として同期させる必要をなくします。

`vp-arc-single-responsibility` は、異なる主題を一つの文書へ同居させている状態を検出します。章を独立して参照・更新できるか、対象読者と利用時点が異なるか、別々の sample・recipe・template に対応するかを組み合わせて判断します。長さや対応する実践の型の数だけでは fail にしません。複数主題の案内自体を責務とする index、catalog、overview は `document_kinds.exclude` で対象外にし、判定文へ例外を混在させません。同じ主張の反復や正本の過剰な再掲は `vp-arc-conciseness` で扱います。

分割が必要な場合、finding には独立する主題と境界候補、参照・カタログへの影響を記録します。grade はファイル作成や ID 採番を行わず、人が finding を確認して分割の採否と PJR 起票を判断します。起票後は新規ファイル、成果物カタログ、参照元、対応する sample・recipe・template の変更を通常の edit task として扱います。

## 3. review plan と review result

SpecDojo の review は、review plan を作ってから実施し、review result を残します。

review plan は `specdojo exec plan` または `specdojo exec run` が必要時に生成します。review result は `specdojo exec claim` 時に scaffold され（`specdojo exec run` が claim を兼ねる場合も含む）、`specdojo exec run` または人の作業によって Frontmatter + Markdown 形式で更新します。

```text
edit タスク（成果物を作る・直す）
  ↓
grade（成果物を評価する。評価結果が最新なら再実行しない）
  ↓
exec plan / exec run → review plan（exec/plans/<task-id>-plan.md。評価結果を提示する）
  ↓
human / agent review（タスクの完了可否を判断する）
  ↓
review result（exec/results/<task-id>-result.md）
  ↓
完了 / 再評価 / 再計画
```

review plan は「このタスクの完了可否を何に基づいて判断するか」を固定します。review result は「どの評価結果と実行記録を照合し、どの verdict を選んだか」を記録します。

| 成果物        | 役割                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| review plan   | 対象成果物、評価結果（grade の verdict・finding）、完了条件、進め方、完了手順を定義する   |
| review result | 評価結果の確認、判断根拠、未充足事項・改善指示、approach に応じた確認、verdict を記録する |

### 3.1. edit plan の完了の狙い

通常の成果物編集を行う edit plan は、観点別の自己レビューを行いません。代わりに、`done_criteria` を「完了の狙い」として素の箇条書き（観点・coverage なし）で提示し、編集者は rulebook / recipe / sample / template と「進め方」に沿って記述する中で、その狙いを満たすことを目指します。

- 品質の担保は rulebook（必須項目・禁止事項）・recipe（書き方・レビュー観点・仕上げチェック）・sample・template が担います。
- 成果物の品質と `done_criteria` の一次判定は grade、タスクの完了可否は後続の独立した review plan / review result が判断します。
- maintenance 系 approach は対象と判定基準が異なるため、完了の狙いの提示は行いません。

edit plan で観点別の自己レビューを行わないのは、各観点を満たそうとして成果物へ過剰な記述を挿入する副作用を避けるためです。review task では成果物を修正せず、第三者的な立場で完了可否を判断します。

### 3.2. review 前段の grade

`specdojo exec run` は、`mode: review` のタスクの plan を生成する前に、runner 自身が評価対象へ grade を実行します。executor（review を行う agent）には grade を実行させません。評価の独立性を保つためです。

- 評価対象は成果物です。`approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合は、見直した実践の型そのものが評価対象になります（`--target kata`）。
- 評価対象の `content_hash` が既存の評価結果サイドカーの `content_hash` と一致する場合は、grade を再実行せず既存の評価結果を使います。どちらの場合も評価は 1 回です。
- grade は `tools/grade/run-per-document.sh` を評価対象 1 件に絞って実行します。スクリプトがないリポジトリ、評価対象を解決できない場合、`--dry-run` の場合は実行しません。
- grade が失敗しても review は止めません。実行の結果と評価結果の鮮度を review plan に示し、review が verdict（`grade-stale` / `grade-unavailable` など）として記録します。

### 3.3. review plan の生成

review plan は `specdojo exec plan` または `specdojo exec run` によって機械生成します（`mode: review` のタスクが対象）。`exec refresh` は Ready などの実行状態を更新しますが、plan は生成しません。`exec plan` は grade を実行せず、その時点の評価結果を提示します。

主な入力

- 成果物カタログの `local_id`、`path`、`depends_on`、`done_criteria`
- 評価対象の評価結果サイドカー（grade result）
- 共通正本と `pm-review-viewpoints.yaml` の差分を解決した `viewpoints`（完了条件の適用判定に使う）
- 対応する rulebook
- `sch-strategy-<track>.yaml` が宣言する `mode: review` フェーズ

review plan の `評価結果` 章には、評価結果を確定済みの事実として次を提示します。

- runner の grade 実行の結果（実行した / 評価結果が最新のため省略した / 失敗した / 実行していない）
- 鮮度（評価対象の `content_hash` と評価結果の `content_hash` が一致するか）。一致しない場合は、提示する評価結果が変更前の内容に対するものであることを明示する
- grade の `verdict`、`score`、`graded_at`、finding 件数
- grade が判定した全観点の level と score。観点の区分（`evaluation`）で提示を絞らない
- finding（ID、severity、観点、行、内容）

### 3.4. review plan の配置

review plan は `<execution_path>/exec/plans/<task-id>-plan.md` に生成します。`<execution_path>` はプロジェクトの実行ディレクトリ（例: `execution`）を指します。

例

```text
exec/plans/T-LAUNCH-prj-overview-030-plan.md
```

### 3.5. review plan の構成

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

| セクション             | 内容                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| このフェーズで行うこと | フェーズ説明。このタスクが何を求めたか                                                     |
| 対象成果物             | 対象パス、`depends_on`、rulebook、対応する review result のパス                            |
| 評価結果               | 評価対象、`--target`、評価結果サイドカー、runner の grade 実行結果、鮮度、評価値と finding |
| 完了条件               | `done_criteria` を完了条件として照合する表（観点ごとに評価し直すための表ではない）         |
| 進め方                 | `approach` に応じた確認と、参照してよい文書の範囲                                          |
| 完了手順               | 鮮度確認、verdict の選択、review result への記入手順                                       |
| 異常終了の条件         | review 自体を完了できない場合の扱い                                                        |

判断の手順と verdict の定義は、plan に注入される共通規約の `review の判断手順` を正本とします。

### 3.6. review execution

人または agent は review plan に従って review します。`<execution_path>/exec/results/<task-id>-result.md` は `specdojo exec claim` の時点で scaffold される（手動 claim でも `exec run` 経由の claim でも同様）ため、agent または人はそこに結果を記入します。

review で `approach` に応じて何を確かめるかは、plan の `進め方` と [実践の進め方ガイド](ryu-guide.md) に従います。

実行時の原則

- 最初に評価結果の鮮度を確認します。最新でなければ成果物を自分で評価して補わず、verdict を `grade-stale` とします。
- 成果物を再評価しません。観点ごとの判定を付け直したり、評価結果の判定を自分の判断で置き換えたりしません。
- 変更内容・plan・実行記録・完了条件・最新の finding を照合し、このタスクの範囲と完了条件を満たすかを判断します。
- finding が残っていても、このタスクの範囲と完了条件を満たしていれば完了できます。その場合は finding が完了を妨げない理由と改善指示を残します。
- 判断の根拠は、実際に読んで得た具体的な事実に限ります。executor の最終メッセージや result の自己申告を根拠にしません。
- agent は最終承認、公開可否判断、説明責任を担いません。

### 3.7. review result の構成

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

| セクション            | 内容                                                                  |
| --------------------- | --------------------------------------------------------------------- |
| 評価結果の確認        | 鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数 |
| 判断根拠              | 照合した内容と verdict を選んだ理由                                   |
| 未充足事項・改善指示  | 未充足事項と、再計画・改善・再評価に使う改善指示                      |
| approach に応じた確認 | `approach` に応じて確認した内容                                       |
| decision              | `verdict`（タスク完了可否の 6 値。値の一覧は次のとおり）              |

`verdict` は `complete` / `complete-with-findings` / `incomplete` / `grade-stale` / `grade-unavailable` / `changed-during-review` のいずれかです。`pm-review-viewpoints.yaml` の `verdict_definitions` も同じ 6 値を定義します。各値を選ぶ条件は共通規約の `review の判断手順` を正本とします。verdict が `complete` 以外でも、review result を記録できた場合は正常終了します。runner は verdict に応じて再評価または再計画へ進みます。

### 3.8. grade の結果を review の入力にする規則

grade と review は違う対象を判定します。判定の語彙は判定対象ごとに分け、同じ対象を判定する語彙だけを一つにします。

| 語彙                                                                             | 判定対象               | 値                                                                                                                   |
| -------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| grade の文書 `verdict`                                                           | 成果物の品質           | `pass` / `needs-work` / `fail`                                                                                       |
| grade の観点 level                                                               | 観点ごとの成果物の品質 | 0-4                                                                                                                  |
| review result の `verdict`、`pm-review-viewpoints.yaml` の `verdict_definitions` | タスクの完了可否       | `complete` / `complete-with-findings` / `incomplete` / `grade-stale` / `grade-unavailable` / `changed-during-review` |

タスクの完了可否は review result の `verdict` と `verdict_definitions` の同じ 6 値だけで表します。grade の語彙は review の語彙へ統一しません。grade の結果は、次の規則で review の入力になります。

- grade の結果は review にとって確定済みの事実です。review は level や grade の `verdict` を付け直しません。
- `grade_rubric` の `review_verdict` は、観点の level が review の判断に与える起点です。level 4 は `complete`、level 3 は `complete-with-findings`、level 0-2 は `incomplete` を起点とします。
- review は、このタスクの範囲と完了条件に関わる観点の level から最も制限の強い起点を選び、変更内容・plan・実行記録・完了条件と照合して verdict を確定します。
- 起点と異なる verdict を選ぶ場合は、理由を判断根拠に記録します。たとえば level 2 の finding がこのタスクの範囲外で完了を妨げない場合は `complete-with-findings` を選び、その理由を記録します。起点が `complete` でも、plan または完了条件に未充足事項があれば `incomplete` とします。
- `grade-stale` / `grade-unavailable` / `changed-during-review` は grade の level からは決まらないため、写像に含めません。鮮度の確認と評価不能の判定で決めます。

旧来の語彙は読み込み時に移行先の値を示すエラーで失敗します。`verdict_definitions` と `review_verdict` の旧値は `pass` → `complete`、`conditional_pass` → `complete-with-findings`、`changes_requested` → `incomplete`、`blocked` → `grade-stale` / `grade-unavailable` / `changed-during-review` のいずれかへ移ります。review result の旧 `decision.recommendation` は `verdict` へ置き換わり、`approve` は `complete` または `complete-with-findings`、`revise` と `reject` は `incomplete` へ移ります。

## 4. レビュー結果の記録

review result に何をどう残し、未充足事項をどう分類し、どこへ引き継ぐかを扱います。

### 4.1. レビュー結果の残し方

review result はタスク単位で記録します。review result は必ず review plan に対応させ、Frontmatter の `plan_ref` で参照します。

- `評価結果の確認` には、鮮度確認で実行したコマンドと出力、grade の `verdict` / `score` / finding 件数を書きます。評価結果が最新でない、または評価不能の場合は、その事実と理由を書きます。
- `判断根拠` には、照合した変更内容・plan・実行記録・完了条件・finding と、verdict を選んだ理由を書きます。
- `未充足事項・改善指示` には、未充足事項と改善指示を書きます。grade の finding を書き写すのではなく、このタスクの完了に何が足りないか、次に何をすべきかを書きます。
- `decision` には `verdict` を書きます。PO 判断が必要な事項は、判断根拠に明記し PJR へ接続します。

### 4.2. 未充足事項の分類

未充足事項や改善指示を書くときは、次の種別で性質を示します。grade の finding を分類し直すためのものではありません。

| 種別             | 内容                                             |
| ---------------- | ------------------------------------------------ |
| missing          | 必要な要求、要件、仕様、章、キー、参照がない     |
| inconsistency    | 成果物間で矛盾している                           |
| unsupported      | 上位根拠のない記述がある                         |
| ambiguous        | 判断、実装、検証に必要な具体性が不足している     |
| unverifiable     | 完了を判断できない                               |
| risk             | 後続作業、公開、運用で問題になる可能性がある     |
| policy_violation | 禁止事項、承認責任、agent 委任境界に違反している |

### 4.3. PJR への転記

すべての未充足事項を PJR に転記しません。review result には詳細を残し、プロジェクト管理対象だけを PJR に転記します。

PJR に転記する条件

- PO 判断が必要です。
- 後続成果物、Schedule、公開判断に影響します。
- スコープ、責任分担、成果物追加に影響します。
- 重大な矛盾によりレビュー継続ができません。
- 将来リスクとして監視する必要があります。

## 5. Agent への指示テンプレート

### 5.1. 単体レビュー

```text
review plan に従って、このタスクを完了してよいかを判断してください。
成果物を再評価せず、plan の「評価結果」に示された grade の結果を事実として受け取ってください。
最初に評価結果の鮮度を確認し、変更内容・plan・実行記録・完了条件を照合して、verdict（complete / complete-with-findings / incomplete / grade-stale / grade-unavailable / changed-during-review）を review result に記録してください。
```

### 5.2. 再計画後の再レビュー

```text
前回の review result の未充足事項・改善指示が、今回の変更と最新の評価結果で解消しているかを確認してください。
成果物を再評価せず、解消した事項、未解消の事項、新たに生じた未充足事項を根拠付きで記録してください。
```

### 5.3. 評価結果に疑義がある場合

```text
評価結果の内容に疑義がある場合も、review で観点を評価し直さないでください。
疑義の内容、対象の finding または観点、再評価が必要な理由を未充足事項・改善指示に記録してください。
```

## 6. 完了と確定

review を完了と見なす条件と、成果物を `ready` へ昇格させる条件を扱います。

### 6.1. 完了条件

review を完了とするには、次を満たします。

- 評価結果の鮮度を確認したコマンドと出力が記録されています。
- verdict が 6 値のいずれかで記録され、選んだ理由が判断根拠に書かれています。
- 完了条件（`done_criteria`）の照合結果が判断根拠に書かれています。
- finding が残るのに完了とした場合は、完了を妨げない理由と改善指示が記録されています。
- PO 判断が必要な事項は PJR または decision に接続されています。
- agent が最終承認者になっていません。

### 6.2. 成果物 ready 化条件

成果物を完成版または `ready` 候補にするには、次をすべて満たすことが必要です。

- 対象成果物の review タスクが `complete` または `complete-with-findings` で完了しています。
- `blocker` と `major` の未解決指摘が 0 件です。
- 条件付き合格とした指摘が PO により許容または対応済みと判断されています。
- 関連する PJR がある場合、対応方針、担当 Role code、期限が記録されています。
- `npm run -s lint:md`、必要な YAML schema 検証、生成物再作成など、対象成果物に必要な機械検証が完了しています。
- 最終承認、公開可否判断、説明責任を人間の `PO` が担っています。
