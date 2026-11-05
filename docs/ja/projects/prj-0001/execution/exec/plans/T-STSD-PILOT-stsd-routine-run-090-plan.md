---
specdojo:
  id: prj-0001:xrp-t-stsd-pilot-stsd-routine-run-090
  type: exec-plan
  rulebook: none
  task_id: T-STSD-PILOT-stsd-routine-run-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: retrofit
  targets:
    - stsd-routine-run
---

# Review Plan: T-STSD-PILOT-stsd-routine-run-090

## 1. このフェーズで行うこと

PJR-PT5N（[[prj-0001:pjr-pt5n-stsd-kata-confirm]]）で確定した stsd の Kata に従う。
図は [[specdojo:stsd-mermaid-rulebook]] の閾値を超える場合だけ分け、小さな図は分けない。
完成版を変更せず、`evidence_refs` が示す現在動作、意図された仕様、`done_criteria` を照合する。
実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: ステータス定義（定期処理の実行結果）
- `depends_on`:
  - [[bdd-routine-definition]]
- `overview`: 定期処理の実行結果（running / success / partial / failure / skipped）が取り得る状態と実行開始から結果確定までの遷移を一覧・図で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-STSD-PILOT-stsd-routine-run-090-result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/routine/routine.ts`（implementation）: routine 実行結果（last_result＝running/success/partial/failure/skipped）の判定・更新規則
- `src/routine/definition.ts`（implementation）: routine 実行状態・実行結果の型定義（RoutineStateResult, RoutineExecutionResult）

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/stsd-routine-run.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-STSD-PILOT-stsd-routine-run-090-20261105T151544Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 92
- `graded_at`: 2026-11-05T15:20:26.823Z（`graded_by`: sol-review-executor）
- finding 件数: blocker 0 / major 3 / minor 1 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 2 | 50 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 2 | 50 |
| `vp-ops-release-readiness` | 4 | 100 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 4 | 100 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=15]: 成果物カタログが依存先とする `bdd-routine-definition` が未作成で `based_on` も空のため、主要な状態・遷移を上位の業務定義から必要と説明できる参照を追加する必要がある。
- `F002` [major/`vp-arc-cross-document-consistency`; line=15]: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml` は `depends_on: bdd-routine-definition` を宣言する一方、対象の Frontmatter は `based_on: []` で本文も同文書を未作成としており、カタログと成果物の依存関係が一致していない。
- `F003` [major/`vp-dev-testability`; line=117]: 状態遷移変更後に実行するテスト、lint、schema または生成コマンド、対象ファイル、期待結果、失敗時対応が記載されておらず、実装変更の確認手順として利用できない。
- `F004` [major/`vp-ops-operability`; line=115]: 試行記録後に例外終了して `running` 相当で残った routine の検知方法、確認証跡、再試行または結果補正の手順、実施担当、問い合わせ・エスカレーション先を定義する必要がある。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | ステータス名・意味・成立条件と、遷移・イベント・条件が業務観点で正確に定義されていること |
| DC-002 | PO | vp-po-purpose-alignment | 状態遷移の業務的妥当性を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | 状態遷移実装の基礎として参照できること |
| DC-004 | QE | vp-qe-verifiability | 状態ベースのテスト設計に活用できること |
| DC-005 | DEV | vp-dev-implementation-readiness | 状態管理実装の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 6. 進め方

retrofit のタスクは、既存の実装を根拠に成果物を意図された仕様へ合わせることを求めた。成果物の内容の品質は grade が評価済みである。review は成果物を読み直して判定せず、実装との対応が記録されているかを確認する。

1. フェーズ説明と完了条件が求めた作成・更新が、対象成果物に行われたかを確認する。
2. 実行記録に、「実装エビデンス」に列挙された各パスについて、成果物の記述との対応と判定（一致・乖離・確認不能・未確認）が残っているかを確認する。記録のないパスは未充足事項とする。
3. 乖離ごとに修正対象候補（実装・文書・意思決定）と根拠が記録されているか、調査できなかった範囲が明示されているかを確認する。
4. 実装から目的・業務判断・将来方針を推測して成果物へ書いた形跡が finding にある場合は、このタスクの完了を妨げるかを判断する。

本タスクの実行に必要な retrofit の確認方針は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 7. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には実装エビデンスの対応記録の確認結果と未確認範囲を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式、実装参照はリポジトリルート相対パスで記載し、絶対パスを使わない。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 8. 異常終了の条件

- `evidence_refs` 欠落、実装エビデンス不存在、対象ファイル不明、result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xrp-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。

### review の判断手順

review plan に共通で適用する。review はタスクの成果を判定し、成果物の品質は判定しない。成果物の品質は grade が一度だけ評価する。review はその評価結果（grade・finding）を事実として受け取り、このタスクを完了してよいかを判断する（[[bps-task-completion]]）。

- 成果物を再評価しない。観点ごとの pass / fail を付け直したり、評価結果の判定を自分の判断で置き換えたりしない。評価結果の内容に疑義がある場合は、疑義の内容と再評価が必要な理由を改善指示に記録する。
- 評価結果の鮮度を最初に確認する（`E-01`）。plan の「評価結果」章に示す評価対象と `--target` を使い、`specdojo grade list --target <対象種別> --path <評価対象> --changed-only` を実行する。`--target deliverable` の場合は `--dependency-changed` でも同様に実行する。いずれかが評価対象のパスを出力した場合、または評価結果サイドカーが存在しない場合は、評価結果が最新でない。成果物を自分で評価して補わず、verdict を `grade-stale` とする。
- 評価結果を確定できない場合（`E-02`）は、verdict を `grade-unavailable` とする。サイドカーを読み取れない場合と、`specdojo grade list --target <対象種別> --path <評価対象> --incomplete` が評価対象のパスを出力する場合（評価パイプラインが未完了）が該当する。
- 評価結果が最新であれば、サイドカーの `verdict` / `score` / `finding_counts` / `findings`、および `done_criteria`（存在する場合）を読み取る。
- 変更内容・この plan・実行記録・完了条件・最新の finding を照合し、このタスクの範囲と完了条件を満たすかを判断する（`S-02`）。完了条件の充足は、評価結果に判定がある場合はそれを事実として用いる。評価結果が扱わない事項を review で確かめる。対象は、フェーズ説明が求めた変更が行われたか、対象外の変更が混入していないか、実行記録の検証結果が成功しているかである。実行記録（先行する edit タスクの result）を特定できない場合は、確認できなかったことを判断根拠に記録する。
- finding が残っていても、このタスクの範囲と完了条件を満たしていれば完了できる。その場合は finding を消去・再評価せず、完了を妨げない理由と必要な改善指示を記録する。
- 判断の根拠は、評価結果・成果物・plan・実行記録を実際に読んで得た具体的な事実に限る。executor の最終メッセージや result の自己申告を、そのまま、または言い換えて根拠にしない。
- verdict を記録する直前に鮮度の確認を再実行する。最初の確認の後に成果物が変更されて評価結果が最新でなくなった場合は、verdict を `changed-during-review` とする（review 中の成果物変更）。

verdict は次の 6 値から 1 つを選ぶ。各値は [[bps-task-completion]] の検証・受入観点と一対一に対応する。

| verdict                  | 受入観点                | 選ぶ条件                                                                          | 記録すること                                               |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `complete`               | 完了可能                | 評価結果が最新で、plan と完了条件を満たし、完了を妨げる未充足事項がない           | 照合した根拠                                               |
| `complete-with-findings` | 品質 finding を伴う完了 | 評価結果に finding があるが、このタスクの範囲と完了条件は満たしている             | finding が完了を妨げない理由と改善指示                     |
| `incomplete`             | 品質良好だが未完了      | plan または完了条件に未充足事項がある（grade の良否は問わない）                   | 未充足事項と、再計画に使う改善指示                         |
| `grade-stale`            | 評価結果が最新でない    | 評価結果がない、`content_hash` が一致しない、または評価コンテキストの変化が未反映 | 鮮度確認のコマンドと出力。完了可否は判断しない             |
| `grade-unavailable`      | 評価不能                | 評価結果を読み取れない、または評価パイプラインが未完了で grade・finding が未確定  | 評価不能の理由と不足情報。完了は保留する                   |
| `changed-during-review`  | review 中の成果物変更   | 最初の鮮度確認の後に成果物が変更され、評価結果が最新でなくなった                  | 変更を検知した確認の出力。verdict を確定せず再評価を求める |

- verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。runner は verdict に応じて再評価または再計画へ進む。
- review result の章立ては `評価結果の確認`、`判断根拠`、`未充足事項・改善指示`、`approach に応じた確認`、`decision` である。`decision` の `verdict` は必ず上表の値で埋める。
