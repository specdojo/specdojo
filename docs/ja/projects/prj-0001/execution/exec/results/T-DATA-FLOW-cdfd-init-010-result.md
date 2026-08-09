---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-init-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-init-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-init-010-plan.md
  started_at: "2026-08-09T16:32:59.232Z"
  completed_at: "2026-08-09T16:42:04.178Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-init
---

# Edit Result

## 1. 実施内容

`P-01 初期セットアップ` の既存 CDFD を、列挙された実装エビデンス、先行成果物、成果物カタログの完了条件、承認済みの登録簿・provider 設定文書と照合した。既存の章構成、五つのプロセス、必須三プロセスと条件付き二プロセスの境界は有効であったため、判断は「部分反映」とした。

- config init は、設定雛形を生成した後に対象プロジェクトの ID と配置を人が確定するプロセスであることを明確にした。
- register scaffold の生成物を、登録簿領域、追跡対象の案内ページ `pjr-index.md`、個票から再生成する `generated/pjr-index.md` に更新した。
- catalog scaffold の入力へ、テンプレート、プロジェクト規模、対象ドメイン、置換値を追加し、選択条件を反映した `dct-<domain>.yaml` が生成されることを表と図へ反映した。
- provider 設定初期化の生成先を、プロジェクト構成ファイルではなく `.<provider>/agents/` と `.specdojo/<provider>/` の provider 実行資材へ修正した。
- exec scaffold を、plan、result、event、exec-defaults の領域生成ではなく、provider を指定しない経路で作るレビュー観点の初期設定として整理した。
- 既存ファイルの既定保護、入力不足・不正、生成失敗に加え、ファイル単位で書き込み済みと未生成が分かれる部分生成を主要例外へ反映した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md`
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-init-010-result.md`

検証結果:

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-init-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-init-010-result.md`: 成功。
- `npx remark docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-init-010-result.md --quiet --frail`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が IPC ソケットを許可しないため `listen EPERM` で起動前に停止した。代替の `node --import tsx src/specdojo.ts catalog validate` は終了コード 0 で、全8カタログが `OK`。未作成の後続成果物に対する既存 warning のみだった。
- `node --import tsx src/specdojo.ts index build`: 成功。`.specdojo/doc-index.json` に1008件を生成した。
- `git diff --check`: 成功。

## 3. 申し送り

### 3.1. 未反映の乖離

| ID     | 乖離                                                                                                                                                                                                                                                        | 今回の判断                                                                                                         | 変更候補                                                                                                                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `G-01` | `src/specdojo-config.ts` の config init は利用者のプロジェクト ID・配置を入力せず、固定雛形を生成する。雛形の project key は `shj-0001`、schedule / execution path は `prj-0001` で一致せず、`.specdojo` ディレクトリの作成も同ファイルからは確認できない。 | CDFD は「対象プロジェクト用に確定した構成を後続へ渡す」という意図された仕様を保持し、固定値へ合わせなかった。      | 実装側で中立かつ内部整合する雛形に直し、必要な親ディレクトリを安全に生成するか、project ID・配置を初期入力として受ける。少なくとも雛形を人が修正・確認するゲートを CLI 出力とガイドで一貫させる。 |
| `G-02` | `src/catalog-scaffold.ts` と `src/exec-provider-scaffold.ts` は複数ファイルを逐次生成するため、後段の読込・書込失敗時に先に書いたファイルが残り得る。provider 適用処理は失敗時の集約結果やロールバックを返さない。                                          | 既存 CDFD の「確定済みの別成果物は自動で巻き戻さない」と整合するため、部分生成の識別と再開条件を成果物へ追記した。 | 実装を変える場合は、事前検証後の一括適用、または部分結果を構造化して呼出元へ返す方式を別タスクで検討する。                                                                                        |
| `G-03` | provider scaffold は資材をコピーするが、`.specdojo/exec-defaults.yaml` の provider command、permission path、配置資材の commit 可否までは確定しない。                                                                                                       | 人間の権限承認と後続の手動設定確認事項を CDFD に残し、scaffold 完了だけで agent 実行可能とは扱わなかった。         | provider 資材、exec-defaults、権限設定を横断する検証操作が必要かを `P-07 構成変更` または別タスクで判断する。                                                                                     |

### 3.2. 未確認範囲

- register scaffold の実装パスは evidence_refs に含まれないため、`pjr-index.md` と `generated/pjr-index.md` の生成は、ready の [[prj-0001:pjr-1d0c-pjr-index-wikilink-broken|PJR-1D0C]] と既存ガイドを意図された仕様の根拠にした。現在実装の分岐、既存時処理、失敗時の確定単位は未確認である。
- provider を指定しない exec scaffold の実装パスは evidence_refs に含まれないため、`pm-review-viewpoints.yaml` の生成は ready の [[specdojo:exec-config-guide|exec設定ガイド]] を意図された仕様の根拠にした。生成先解決、既存時処理、失敗分岐は未確認である。
- 列挙された三ファイルを呼び出す CLI 層、引数解決、dry-run、終了コード、標準出力・標準エラーの組み立ては調査対象外である。CDFD には関数内部から確認できた概念入出力だけを反映した。
- 権限不足、容量不足、同時書込などの外部ファイルシステム条件は実行しておらず、分岐は未確認である。

## 4. 進め方と実践の型の適用

approach は retrofit とした。先に既存成果物、[[prj-0001:cdfd-overview|概念データフロー図（全体概要）]]、プロジェクトコンテキストの [[prj-0001:prj-overview|プロジェクト概要]]、成果物カタログの done_criteria、[[specdojo:cdfd-rulebook|概念データフロー図（領域別）作成ルール]]、[[specdojo:cdfd-mermaid-rulebook|Mermaid を用いた概念データフロー図 作成ルール]] を読み、TO-BE の境界と文書構造を抽出した。その後、evidence_refs の三ファイルをすべて読み、現在動作との一致・乖離・確認不能を分類した。

### 4.1. 実際に参照した実装エビデンスと現在動作

| パス                            | 抽出した現在動作                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/specdojo-config.ts`        | リポジトリ起点から `.specdojo/specdojo.config.json` を探索・読込する。config init は既存の有効な設定があれば何も上書きせず終了し、存在しなければ version 1 の固定雛形を同期書込する。設定読込時は `projects` と各 project の非空 `schedule_path` / `execution_path`、任意の `project_context` を検証する。project 文書パスには任意の `base_path` を適用するが、`run.*` には適用しない。                                                                                                     |
| `src/catalog-scaffold.ts`       | catalog path または明示値から project ID を決め、`dct-*.yaml` テンプレートを読み込む。project size で section / deliverable を絞り、対象 domain と置換値を反映し、未解決 placeholder を持つ成果物を除外して警告する。生成先ディレクトリを作り、既存ファイルは既定でファイル単位に skip、明示的な置換時だけ上書きする。project ID 不明、テンプレートなし・読込失敗、未知 domain、生成失敗は errors として返す。複数テンプレートの処理中に失敗しても、先に成功した出力は written として残る。 |
| `src/exec-provider-scaffold.ts` | package の `templates/<provider>/` を配布原本として再帰的に列挙し、`agents/**` は `.<provider>/agents/**`、その他は `.specdojo/<provider>/**` へ割り当て、配布原本の `README.md` は除外する。未知 provider は利用可能一覧を含む error とする。適用時は既存ファイルを既定で skip し、明示的な置換時だけ上書きする。ファイルを逐次コピーするため、途中失敗時の一括ロールバックはない。                                                                                                        |

### 4.2. 照合結果

| 分類             | 内容                                                                                                                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一致             | config、register、catalog を必須、provider と exec 補助設定を条件付きとする上位境界。config・catalog・provider が既存ファイルを既定で保護する方針。catalog の project ID、domain、template 不備と provider 未知値を入力不足・不正として停止する考え方。                    |
| 反映済み         | catalog の規模・domain・置換値、provider 資材の物理的な生成先、provider 設定を project config へ書き戻さない境界、ファイル単位の skip / 部分生成、承認済み PJR が示す登録簿の案内ページと生成ビュー、ready ガイドが示す provider 未指定 exec scaffold のレビュー観点生成。 |
| 未反映の乖離     | config init の固定 project key / path の不一致と親ディレクトリ生成不足、provider scaffold 後に必要な exec-defaults・権限・commit の確認不足。意図された仕様の承認根拠がないため、実装へ無条件に合わせず「3. 申し送り」へ記録した。                                         |
| 実装から確認不能 | register scaffold、provider 未指定の exec scaffold、CLI 層の入力解決・dry-run・終了コード、外部ファイルシステム失敗。                                                                                                                                                      |

### 4.3. 判断と rulebook の適用

既存成果物は、rulebook が必須とする目的と適用範囲、領域内プロセス一覧、一ノード一プロセスの Mermaid 図、主要例外、領域外委譲、確認者別の受入条件をすでに満たしていた。done_criteria の BA・PO・ARC・QE 観点にも対応するため、作り直しではなく部分反映を選んだ。

表を起動条件・入力・生成物・正本の正本、図を順序・条件付き分岐・引き渡しの正本として維持し、同じ `P-01-01`〜`P-01-05` の ID と名称を対応させた。Mermaid は領域内の `flowchart TB`、角丸長方形のプロセス、六角形のイベント、円柱のデータストア、四角の外部主体、ラベル付き情報フローだけを使用した。実装関数名、CLI オプション、内部エラーは成果物本文へ持ち込まず、本 result の調査記録へ限定した。

プロジェクトレベルの Why からは、人と AI Agent が同じ正本から判断と作業を引き継ぐこと、人間が provider 利用と権限を承認することだけを反映した。価値仮説の全文は再掲せず、プロジェクトコンテキストを成果物 frontmatter の `based_on` へ追加していない。`based_on` は直接の depends_on である `prj-0001:cdfd-overview` だけを維持した。
