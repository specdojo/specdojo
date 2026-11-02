---
specdojo:
  id: prj-0001:pjr-5q7r-cdfd-overview-orchestrator-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-02T06:56:59Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-05QS
---

# PJR-5Q7R 全体概要の Orchestrator を指示の図にし、線のない区分を外す

## 1. 概要

cdfd-overview の Orchestrator の調整の表を、Orchestrator から 6 区分への指示と、Orchestrator が直接読み書きするデータストアへの線の図に置き換え、トランザクションデータの図から 3.1、マスタ・構成データの図から 3.6 を外す

## 2. 入力

- PJR-05QS の後、トランザクションデータの図では 3.1、マスタ・構成データの図では 3.6 に線がない。利用者はこれらを図から外すよう求めた（2026-11-02）
- 利用者の考え: Orchestrator は register 系・schedule 系・routine 系・実行サイクル・3.1・3.6 に指示を出す。Orchestrator が直接触るデータストアには線をつなぎ、それ以外のデータストアは各区分が CLI 経由で扱う（2026-11-02）
- 5.3 の Orchestrator の調整の表は、この図に置き換えて不要にする

## 3. 完了条件

- [[prj-0001:cdfd-overview]] の「トランザクションデータの流れ」の図から「プロジェクト構成の構築・管理」（3.1）のノードを、「マスタ・構成データの流れ」の図から「文書の廃棄（非推奨化・保管）」（3.6）のノードを外している。ほかのノードと線は変えない
- 「Orchestrator の調整」の表を、同じ題の図に置き換えている。図には次を描く
  - Orchestrator（3.7）から 6 区分（3.1〜3.6）への指示の線。ラベルは指示の内容を 1〜2 語の名詞で書く
  - Orchestrator が直接読み書きするデータストアと、その線。どのデータストアが「直接」かは、実装（`src/` の orchestrator・runner・exec の処理）と運用ガイドを根拠に決め、specdojo の CLI のコマンドを通じて各区分が扱うものは Orchestrator から線を引かない。データストアごとの判断と根拠を個票の対応結果に表で記録する
  - 6 区分の位置は、ほかの 2 つの図にそろえ、Orchestrator を一番上に置く
- 図の説明は 1 文までとする。表は残さない
- 2 つの図に加えて 3 つ目の図を `d2 --layout elk` で SVG に出力し、並びと図の大きさを個票の対応結果に記録する
- 「プロセス領域」と「データストア」の表、「詳細 CDFD 一覧」、「凡例（本プロダクト共通）」は変えない。status は変えない（draft のまま）。詳細の CDFD の文書は変えない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                                  |
| --- | ---------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------- |
| 1   | 2 つの図から線のない区分を外す                                   | BA   | done | T の 3.1 と M の 3.6 を除き、業務ノードと業務線を保存 |
| 2   | Orchestrator の調整の表を指示の図に置き換える                    | BA   | done | 6 区分への指示と運転に直接使う 13 ストアを図示        |
| 3   | 直接読み書きするデータストアの判断と根拠、並び・大きさを記録する | BA   | done | 15 ストアの判断、ELK 出力の座標・寸法と検証結果を記録 |

## 5. 対応結果

### 5.1. 実施内容と判断の範囲

[[prj-0001:cdfd-overview|全体概要]] の「Orchestrator の調整」を、Orchestrator を一番上に置いた D2 図に置き換えた。3.1〜3.6 への指示は「構成要求」「登録要求」「計画要求」「定義要求」「実行要求」「廃棄要求」の名詞ラベルとし、図の説明は 1 文にした。T（トランザクションデータ）から 3.1、M（マスタ・構成データ）から 3.6 の業務ノードを削除した。

「直接」は、対話型 agent と自動運転 runner の運転フローが、運転対象の選択・委譲準備・起動・追跡のために読む・書くものとした。runner が内部関数で行う plan 生成、評価の鮮度確認、文書 ID の解決も含め、別の CLI や作業 agent に任せる生成・編集・評価の読み書きは含めない。[[specdojo:orchestrator-operation-guide|Orchestrator 運用ガイド]] の「オーケストレーターの位置づけ」と [[specdojo:exec-operation-guide|exec 運用ガイド]] の「exec の関心事」「実行経路の使い分け」を踏まえ、以下の実装の呼出し経路で直接・委譲を区別した。

### 5.2. データストアごとの判断と根拠

データストア表の全 15 ストアについて判断した。矢印は図上の情報の向きであり、参照はストアから Orchestrator、記録は Orchestrator からストアへ向けた。

| データストア             | 3.7 の線   | 判断と根拠                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 稼働構成                 | 参照       | `src/commands/orchestrator.ts` の `resolveOrchestratorLaunch` が project 設定と宣言済みリポジトリを読み、`src/exec/run/schedule-mode.ts` と `src/exec/run/job.ts` が実行既定値・名簿を読む。運転設定・agent の選択として直接参照する。                                                                                     |
| Kata / kata              | 参照       | `src/exec/run/schedule-prepare.ts` の `prepareSingleTask` が `generateSinglePlan` を内部呼出しし、`src/exec/plans-generation.ts` の `loadPlanTemplate` が Kata の plan テンプレートを読む。`src/review/grade.ts` は Kata の review 前にも評価対象本文を読む。型の配置・版の更新は 3.1 へ委譲し、3.7 には読取りだけを描く。 |
| 成果物カタログ / catalog | 参照       | `prepareSingleTask` → `generateSinglePlan` → `src/exec/plans-core.ts` の `findDeliverableInfo` で、委譲する作業の対象・完了条件を読む。カタログ作成・更新は 3.3 に残し、runner の計画準備における直接の読取りだけを描く。                                                                                                  |
| スケジュール戦略         | 参照       | `src/exec/run/schedule-mode.ts` の `runManualMode` が `buildPhaseModeIndex` を呼び、`src/exec/strategy.ts` が実行方式・agent 指定を読む。計画の書換え・track 生成は 3.3 のまま、起動方式の解決だけを直接参照として描く。                                                                                                   |
| 定期実行定義 / routine   | 参照・記録 | `src/routine/routine.ts` の run 処理が `loadRoutines`・`isRoutineDue`・`cronOccurrences` で発火条件を読み、`writeRoutineState` で次回判定用の開始・完了状態を記録する。[[specdojo:routine-operation-guide\|routine 運用ガイド]] のトリガー層に対応し、定義の作成・変更は 3.4 に残す。                                      |
| ジョブ定義 / job         | 参照       | `src/exec/run/job.ts` の `runJobMode` が `loadJobDefinition`・`jobRunUsesReviewedIntegration` で review 付きの起動経路を決める。`src/routine/routine.ts` の dry-run でも委譲方式を参照する。Job の定義変更は 3.4、手順の遂行は 3.5 が扱う。                                                                                |
| 登録簿 / register        | 参照       | `src/commands/night-orchestrator.ts` が `loadRegisterItems`・`selectApprovedNightItems` と依存判定で承認済みの運転対象を選び、各 wave の前にも読み直す。書込みは `register add` や `exec run --register` 経由で各区分へ委譲するため、3.7 からの更新線は引かない。                                                          |
| Schedule（track）        | なし       | 3.3 の `schedule build` が正本を生成する。自動運転が読む実行候補は `exec refresh` の生成した Ready であり、track 自体を直接扱う線にはしない（`src/exec/run/schedule-mode.ts` の `prepareReadyTasks`）。                                                                                                                    |
| 実行計画 / plan          | 参照・記録 | `src/exec/run/schedule-prepare.ts` が `generateSinglePlan` を内部呼出しし、`src/exec/plans-generation.ts` が plan を書く。`src/exec/run/agent.ts` の `loadPrompt` → `loadPlan` と `src/exec/run/job.ts` の plan 読取りで作業 agent へ委譲するため、準備と読取りの両方向を描く。                                            |
| 実行記録                 | 参照・記録 | `src/exec/run/agent-pipeline.ts` が pipeline の state と executor evidence を更新し、reporter の起動と結果を追跡する。`src/exec/run/schedule-task.ts` の checkpoint 読取り・再開も含む。成果物の編集結果は 3.5、運転状態の追跡は 3.7 として描く。                                                                          |
| 成果物 / deliverable     | 参照       | `gradeBeforeReviewPlan` → `src/review/grade.ts` の `reviewGradeFreshness` が本文を直接読み、保存済み grade とハッシュを比較して評価の起動要否を決める。`generateSinglePlan` も対象本文を読む。編集は 3.5、非推奨化は 3.6 へ委譲するため、3.7 からの更新線は引かない。                                                      |
| 保管庫（trash） / trash  | なし       | 3.6 が非推奨化・退避を担う。Orchestrator は廃棄要求を出し、保管文書を直接読み書きする線は引かない。全体概要の既存の廃棄 → 保管庫の線を維持した。                                                                                                                                                                           |
| 評価結果                 | 参照       | `src/exec/run/schedule-prepare.ts` の `gradeBeforeReviewPlan` → `src/review/grade.ts` の `ensureReviewGrade` が sidecar を内部関数で直接読み、評価の起動要否を決める。その後の `grade` CLI による判定・更新は 3.5（P-08）へ委譲し、3.7 には読取りだけを描く。                                                              |
| 進捗報告                 | 参照・記録 | `src/exec/run/schedule-mode.ts` の `prepareReadyTasks`・`runManualMode` が `execution/generated/ready.json` から候補を読む。`src/commands/night-orchestrator.ts` が運転結果の朝報告を `execution/reports/night-orchestrator/` に書く。一般の進捗ビュー生成は 3.3 へ委譲し、図には実行候補と運転報告だけを描いた。          |
| 派生ビュー・索引         | 参照       | `src/exec/run/agent.ts` の `expandPromptRefs` → `src/docs/doc-index.ts` の `replaceDocIndexRefs` が文書索引を読み、委譲する plan の文書 ID をパスに解決する。`src/exec/run/schedule-mode.ts` の `spawnIndexBuild` による索引・ビューの生成は `index build` CLI を通じて 3.3 に委譲するため、3.7 からの更新線は引かない。   |

### 5.3. SVG 出力と配置・寸法

D2 0.9.0 で Markdown の先頭 3 コードブロックを抽出し、次のコマンドで SVG にした。寸法は SVG の `viewBox` の幅×高さ、座標はプロセス矩形の左上である。

```bash
d2 --layout elk tmp/pjr-5q7r/transaction.d2 tmp/pjr-5q7r/transaction.svg
d2 --layout elk tmp/pjr-5q7r/master.d2 tmp/pjr-5q7r/master.svg
d2 --layout elk tmp/pjr-5q7r/orchestrator.d2 tmp/pjr-5q7r/orchestrator.svg
```

| 図                     | 修正前（px） | 修正後（px） | 業務ノード数                        |
| ---------------------- | ------------ | ------------ | ----------------------------------- |
| トランザクションデータ | 2116×2239    | 2116×2257    | 5 区分＋9 ストア＝14                |
| マスタ・構成データ     | 2784×1754    | 2414×1704    | 5 区分＋6 ストア＝11                |
| Orchestrator の調整    | 表           | 3797×1669    | Orchestrator＋6 区分＋13 ストア＝20 |

| 区分             | T の座標（x, y） | M の座標（x, y） | Orchestrator 図の座標（x, y） |
| ---------------- | ---------------- | ---------------- | ----------------------------- |
| Orchestrator     | —                | —                | 1586, 12                      |
| 構成の構築・管理 | 削除             | 765, 12          | 91, 802                       |
| register 系      | 420, 192         | 530, 274         | 41, 1023                      |
| schedule 系      | 946, 192         | 928, 274         | 245, 1023                     |
| routine 系       | 1503, 192        | 1366, 274        | 515, 1023                     |
| 実行サイクル     | 837, 1154        | 826, 786         | 282, 1235                     |
| 文書の廃棄       | 379, 1706        | 削除             | 421, 1397                     |

3 図とも 3 系統は同段かつ左から register・schedule・routine、実行サイクルはその下、文書の廃棄がある図ではさらに下に位置する。構成の構築・管理は 3 系統より上、Orchestrator は新図の最上部に位置する。

T は 3.1 の削除で孤立した routine が下へ動くため、業務上の意味を持たない非表示の配置用基点を置いて 3 系統を同段にした。これにより高さは修正前より 18px 増えた。M は業務線の宣言順を 2 行入れ替えて左右順を合わせ、3.6 に接続した透明線の末尾だけを削った。その他の業務ノードの名称・領域 ID・形状と、T の 24 本・M の 18 本の業務線の相手・方向・ラベルはすべて保存した。配置制御は D2 内に受け渡しではない旨をコメントした。SVG と検証用ファイルは一時生成物として削除し、文書内の D2 を正本とする。

### 5.4. 変更範囲・検証・申し送り

変更は全体概要の第 5 章と本個票の作業内容・対応結果に限る。全体概要の Frontmatter（`status: draft`）、プロセス領域・データストアの表、詳細 CDFD 一覧、凡例は変更していない。詳細 CDFD の文書、登録簿一覧の正本、個票のステータス項目、result は変更していない。

- 変更した 2 文書を Prettier で整形した。
- `python3 tmp/pjr-5q7r/verify.py` により、対象外の章・Frontmatter の不変、既存の業務ノード・業務線の保存、6 本の指示、13 ストアへの読み書き、3 図の座標・寸法を確認した。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0。未作成文書に関する既存の警告があるが、検証エラーはない。
- `node --import tsx src/specdojo.ts register build` は終了コード 0。派生ビューの生成を確認した。
- `git diff --check` は問題なし。
- `lint:md`・`lint:d2` などの設定済み親検証は runner が executor 終了後に実施する。result への記載は reporter・runner に引き継ぐ。

未決事項・残課題・保護対象設定の変更提案はない。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-d2-rulebook]]
