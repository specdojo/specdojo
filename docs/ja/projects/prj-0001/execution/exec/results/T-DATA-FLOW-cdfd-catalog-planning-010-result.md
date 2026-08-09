---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-catalog-planning-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-catalog-planning-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-catalog-planning-010-plan.md
  started_at: "2026-08-09T16:42:24.561Z"
  completed_at: "2026-08-09T16:50:37.943Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-catalog-planning
---

# Edit Result

## 1. 実施内容

対象成果物が存在しなかったため、判断は「新設」とした。指定された実装エビデンス三件を全行確認し、先行成果物、プロジェクトコンテキスト、成果物カタログの done_criteria、CDFD rulebook と照合して、`P-03 計画展開` の TO-BE フローを作成した。

- `catalog validate`、`schedule build`、`exec refresh` の関係を、`P-03-01`〜`P-03-05` のプロセス一覧と Mermaid 図で対応させた。
- dct、strategy、Schedule、event を入力として、state、Ready、CPM、critical path、timeline を再生成する正常経路を定義した。
- カタログ検証失敗、戦略不足、依存の未解決・循環、event 不正を、停止範囲と再開条件を持つ主要例外として定義した。
- BA、PM、ARC、QE が業務価値、計画境界、入出力・依存、停止ゲートを確認できる受入条件を記載した。
- 成果物編集・task 実行は `P-04`、構成変更は `P-07`、一般的な派生生成・公開は `P-08` へ委譲し、対象領域外の内部処理を展開しなかった。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md`（新設）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-catalog-planning-010-result.md`

検証結果:

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-catalog-planning-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-catalog-planning-010-result.md`: 成功。
- `npx remark docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-catalog-planning-010-result.md --quiet --frail`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が IPC ソケットを許可しないため `listen EPERM` で起動前に停止した。代替の `node --import tsx src/specdojo.ts catalog validate` は終了コード 0 で、全8カタログが `OK`。未作成の他成果物に対する既存 warning のみだった。
- `npx tsx src/specdojo.ts index build`: 同じ `listen EPERM` で起動前に停止した。代替の `node --import tsx src/specdojo.ts index build` は成功し、`.specdojo/doc-index.json` に1011件を生成した。
- `git diff --check`: 成功。

## 3. 申し送り

### 3.1. 未反映の乖離

| ID     | 乖離                                                                                                                                                                                                                                                                | 今回の判断                                                                                                                                 | 変更候補                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `G-01` | `src/catalog-build.ts` は存在しない `depends_on` を warning とし、`src/schedule-build.ts` のトポロジカルソートは展開対象に存在しない依存先を辿らない。この組合せでは、カタログの依存先不足が Schedule 展開の停止条件にならず、依存を落とした task が生成され得る。  | done_criteria が要求する「依存解決失敗で計画展開を停止するゲート」を意図された仕様として `E-03` に保持し、現在実装の挙動へ合わせなかった。 | カタログ内の未解決依存を error にするか、Schedule 展開前に対象範囲外を含む依存解決を検証し、解決できない場合は task・milestone を生成しない。 |
| `G-02` | `src/schedule-build.ts` は `scope`、`phase_sets`、`owner_rules` の存在を必須とする一方、空の track・id や全成果物への phase 適用を包括的には検証しない。phase を解決できない成果物は warning で skip されるため、戦略不足でも部分的な Schedule が生成され得る。     | カタログの対象成果物へ必要な戦略を適用できない場合は、部分計画を最新として引き渡さない TO-BE を `E-02` に記載した。                        | strategy の必須識別情報と対象成果物ごとの owner・phase coverage を展開前に検証し、欠落時は BuildResult を error にして出力全体を止める。      |
| `G-03` | `src/exec-schedule.ts` は strategy に対応する生成済み track がない場合、または strategy の更新時刻が track より新しい場合を warning とする。列挙された実装範囲だけでは、古い Schedule を使った state・Ready・CPM・timeline の更新が強制停止されるとは確認できない。 | strategy と最新 Schedule の対応を実行計画更新の前提とし、不足時に後続生成を止める意図された仕様を `E-02` に保持した。                      | `exec refresh` の入口で stale / missing track を error とするか、明示的に承認された例外以外は `schedule build` の再実行を必須にする。         |

### 3.2. 未確認範囲

- 列挙された三ファイルを呼び出す CLI 層は evidence_refs に含まれないため、`catalog validate` がすべての公開検証関数をどの順で呼ぶか、`schedule build` が事前の検証合格を強制するか、`exec refresh` が `validateAll` 合格前に生成処理へ進まないかは未確認である。
- `src/exec-schedule.ts` が呼び出す event の畳み込み、Ready 判定、CPM、timeline、初期状態、Schedule index の各モジュールは evidence_refs の範囲外である。呼出し時の入出力と生成先は確認したが、個々の計算アルゴリズムと全分岐は未確認である。
- `src/schedule-build.ts` が返した task・milestone を `sch-track-*.yaml`、`sch-milestones*.yaml` へ書き出す処理は evidence_refs の範囲外であり、書込失敗時の確定単位と復旧は未確認である。
- 権限不足、容量不足、同時書込などの外部ファイルシステム条件は実行しておらず、部分生成や再実行時の分岐は未確認である。

## 4. 進め方と実践の型の適用

approach は retrofit とした。先に対象成果物の不存在、[[prj-0001:cdfd-init|概念データフロー図（初期セットアップ）]]、[[prj-0001:cdfd-overview|概念データフロー図（全体概要）]]、プロジェクトコンテキストの [[prj-0001:prj-overview|プロジェクト概要]]、成果物カタログの done_criteria、[[specdojo:cdfd-rulebook|概念データフロー図（領域別）作成ルール]]、[[specdojo:cdfd-mermaid-rulebook|Mermaid を用いた概念データフロー図 作成ルール]] を読み、意図された目的、境界、必須構造を抽出した。その後、evidence_refs の三ファイルをすべて読み、現在動作との一致・乖離・確認不能を分類した。

### 4.1. 実際に参照した実装エビデンスと現在動作

| パス                    | 抽出した現在動作                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/catalog-build.ts`  | `dct-*.yaml` から local ID を収集し、必須メタデータ、work の path・done criteria、evidence reference、同一 domain の統合条件、rulebook の関連資材、based-on の参照解決と depends-on 推移閉包を検証する関数を持つ。未解決 depends-on と重複 local ID の一部、rulebook 関連資材不足は warning である。構造検証に合格した domain は統合し、成果物表と完了条件を持つ表示用 Markdown を生成する。                                                                                                                   |
| `src/schedule-build.ts` | strategy の scope、include kinds、phase sets、owner rules、cross-domain dependency、phase gate、cross-deliverable pass、milestone、初期完了状態を読み、対象 catalog の work 成果物を task・milestone へ展開する。catalog 不在・groups 欠落・依存循環・phase selection 不正・owner 不足・cross-deliverable 条件不整合は errors とし、主要段階では空の tasks / milestones を返す。初期完了成果物は単一の `000` task とし、依存を task ID と gate へ置換する。phase を解決できない成果物は warning で skip する。 |
| `src/exec-schedule.ts`  | Schedule の task ID・depends-on・循環、event JSON と event shape を検証する。strategy より古い、または未生成の track と、現行 Schedule に存在しない task の過去 event は warning とし、後者は state 構築時に無視する。event と strategy 初期状態を Schedule へ畳み込んで `state.json` を生成し、Ready に mode・execution・approach・capabilities・proficiency を付与する。CPM、critical path、全体・milestone・track 別 timeline、metadata、event の JSONL を生成する。                                        |

### 4.2. 照合結果

| 分類             | 内容                                                                                                                                                                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一致             | dct と strategy から依存付き Schedule を展開し、Schedule と event から state を再構成し、Ready・CPM・critical path・timeline を生成する基本経路。catalog の構造不正、strategy の主要構造不足、Schedule の存在しない依存 ID・循環、event 不正を検出する考え方。                                           |
| 反映済み         | 五つのプロセスと三つの command の対応、初回 event 不在時の初期 state、critical-first の Ready 候補、task・milestone・gate・依存の受け渡し、主要な正本と代表生成先、カタログ・戦略・依存・event の停止・再開条件。                                                                                        |
| 未反映の乖離     | 未解決 catalog 依存が warning / 無視になり得ること、phase coverage 不足でも成果物単位に skip して部分 Schedule を作り得ること、stale / missing track が warning に留まること。意図された仕様と done_criteria の停止ゲートを優先し、成果物へ現在挙動を仕様として採用せず「3.1. 未反映の乖離」に記録した。 |
| 実装から確認不能 | CLI における command 間の強制順序、検証失敗後に生成関数へ進まない保証、Schedule YAML の書込、import 先モジュールの計算詳細、外部ファイルシステム失敗。                                                                                                                                                   |

### 4.3. 判断と rulebook の適用

対象成果物が存在せず、カタログに path と done_criteria が定義済みだったため「新設」と判断した。rulebook の必須構成に従い、目的と適用範囲、領域内プロセス一覧、概念データフロー、主要例外、領域外委譲、確認者別の受入条件を作成した。

表をプロセスの目的、担当、起動条件、入出力、正本・生成先の正本とし、図を順序、command との対応、正常経路、停止ゲートの正本とした。表と図では同じ `P-03-01`〜`P-03-05` の ID と名称を使用した。Mermaid は領域内の `flowchart TB`、角丸長方形のプロセス、六角形のイベント、円柱のデータストア、四角の外部主体、ラベル付き情報フローだけを使用した。

`src/catalog-build.ts` の表示用カタログ生成は現在動作として確認したが、全体概要が成果物・索引・一般的な派生ビュー生成を `P-08` に置くため、本成果物では独立プロセスにせず領域外へ委譲した。一方、done_criteria が明示する Ready・CPM・timeline は実行可能性と日程判断を成立させる `P-03` の計画情報として記載した。

プロジェクトレベルの Why からは、人と AI Agent が同じ正本を参照して判断と作業を引き継ぐこと、人間が計画方針・依存・例外後の再開に責任を持つことだけを反映した。価値仮説の全文は再掲せず、プロジェクトコンテキストを成果物 frontmatter の `based_on` へ追加していない。`based_on` は depends-on の推移閉包に含まれ、内容根拠として直接参照した `prj-0001:cdfd-init` と `prj-0001:cdfd-overview` に限定した。
