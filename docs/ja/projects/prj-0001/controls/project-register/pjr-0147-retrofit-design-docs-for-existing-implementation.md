---
specdojo:
  id: prj-0001:pjr-0147-retrofit-design-docs-for-existing-implementation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0147 実装先行（コード先行）時に設計書/仕様書/要件書へ反映・新設するapproachの整備

## 1. 概要

実装が既に存在するにもかかわらず、対応する設計書・仕様書・要件書が未整備、または実装内容と文書内容が乖離しているケースがある。この場合に、現在実装されている挙動を AS-IS の根拠として調査し、成果物へ「反映」または「新設」する新しい `approach: retrofit` を整備する。

`retrofit` は、実践の型をどの程度基準にするかを表す既存の `fully-guided` / `recipe-guided` / `freeform` や、成果物と実践の型を一式整備する `bootstrap` とは目的が異なる。既存 approach に実装調査を一律追加せず、コード先行時の参照方針・乖離判定・証跡記録を持つ独立した approach とする。

実装だけを常に唯一の正本とはみなさない。実装は現在動作の根拠、ガイド・仕様書・決定記録は意図された仕様の根拠、成果物カタログの `done_criteria` は成果物が満たすべき目的として扱う。これらが異なる場合は実装を無条件に文書へ転記せず、乖離を記録して実装と文書のどちらを変更するか判断できる状態にする。

対応する plan テンプレートとして `xep-retrofit-template.md` / `xrp-retrofit-template.md` を作成し、成果物カタログに宣言された実装エビデンスを edit / review plan へ機械的に展開する。

## 2. 完了条件

- 実装先行が発生し得る対象範囲（成果物カタログ `dct-*.yaml` で管理される文書種別）が明確化されている。
- 既存文書へ「反映」する場合と、文書を「新設」する場合の判断基準が定義されている。
- 実装、意図された仕様、`done_criteria` の位置づけと、三者が乖離した場合の判断・記録方法が定義されている。
- `retrofit` approach の参照方針・進め方が [[specdojo:kata-guide|実践の型活用ガイド]] の「初期整備・横断整理」に追加されている。
- `xep-retrofit-template.md`（edit）が作成され、実装調査、反映/新設判断、乖離記録の手順が定義されている。
- `xrp-retrofit-template.md`（review）が作成され、成果物と実装エビデンスの対応・乖離を判定できる。
- `exec-common.schema.yaml` の `Approach` enum に `retrofit` が追加され、依存する各 schema（exec-plan / exec-result / sch-strategy frontmatter）に反映されている。
- DCT schema に非成果物の根拠を構造化して宣言する `evidence_refs` が追加されている。
- `evidence_refs` のパス形式、存在確認、重複、過度に広い参照範囲を検証できる。
- `evidence_refs` が edit / review plan の「実装エビデンス」へ展開され、agent が実際に参照したパスと判断根拠を result に記録できる。
- 実装エビデンスは読み取り専用で、`targets`、worktreeの変更許可範囲、commit許可リストへ追加されない。
- `retrofit` を指定したタスクで必要な `evidence_refs` が存在しない場合のエラーまたは明示的な未確認扱いが定義されている。
- `bootstrap` と `retrofit` を併用する場合の推奨フェーズ順序がSchedule設計ガイドに記載されている。
- 関連ガイド（`exec-config-guide.md`、`plan-result-lifecycle-guide.md`）に `retrofit` approach と実装エビデンスの記載が反映されている。
- data-flowを代表例として、DCTの成果物と `src/` / `tools/` の実装エビデンスを対応付け、planへの展開を検証できる。

## 3. 設計方針

### 3.1. `retrofit` を独立したapproachとする

既存 approach は、主に実践の型の整備状況やタスク目的を表している。`fully-guided` などへ実装調査を一律追加すると、実装と無関係な成果物でもコードベース探索が発生し、参照範囲・実行時間・判断根拠が不必要に広がる。

`retrofit` は次の責務を持つ独立した approach とする。

- 宣言された実装エビデンスを読み、現在の処理・入出力・状態遷移・例外を抽出する。
- 対応する文書が存在する場合は、維持・部分反映・作り直しを判断する。
- 対応する文書が存在しない場合は、成果物カタログと実践の型に沿って新設する。
- 実装と文書の一致・乖離・未確認範囲をresultに記録する。
- 実装から確認できない目的、業務判断、将来方針を推測で補わない。

既存 approach の参照範囲は自動的に拡大しない。コード先行の調査が必要なフェーズだけ、Scheduleで `approach: retrofit` を明示する。

### 3.2. DCTで実装エビデンスを宣言する

実装との対応は成果物ごとに安定して参照する情報であるため、Scheduleの自由記述だけに置かず、DCTの成果物エントリに構造化して宣言する。フィールド名は、実装以外の根拠への将来拡張を考慮して `evidence_refs` とする。

記述例:

```yaml
- local_id: cdfd-catalog-planning
  name: 概念データフロー図（カタログ〜計画展開）
  kind: work
  evidence_refs:
    - kind: implementation
      path: src/catalog-build.ts
      purpose: カタログ表示ビュー生成の現在動作
    - kind: implementation
      path: src/schedule-build.ts
      purpose: カタログと戦略からScheduleへ展開する現在動作
    - kind: implementation
      path: src/exec.ts
      purpose: 実行状態生成へ接続するコマンド経路
```

`evidence_refs` は次の性質を持つ。

- `depends_on` とは異なり、Scheduleの実行順序や成果物間の根拠関係を作らない。
- `based_on` の文書IDとは異なり、ソースコードやツールなど非文書のエビデンスを表す。
- `note` の自由記述で代用せず、schemaとplan生成処理から機械的に利用できる形にする。
- `path` はリポジトリルート相対の正準パスとし、絶対パスや `..` を許可しない。
- 原則として関係するファイルまたは限定されたディレクトリを指定し、リポジトリ全体など過度に広い指定を避ける。
- `purpose` には、そのエビデンスから何を確認するかを記載する。

### 3.3. planへの展開と読み取り専用境界

plan生成時に、対象成果物の `evidence_refs` を「実装エビデンス」セクションへ展開する。agentは列挙されたパスを実際に読み、確認できた範囲と確認できなかった範囲をresultへ記録する。

実装エビデンスは調査入力であり、通常の文書作成タスクの変更対象ではない。このため、次の境界を維持する。

- plan frontmatterの `targets` へ追加しない。
- worktree実行時の変更許可ディレクトリへ追加しない。
- commit対象ファイルの許可リストへ追加しない。
- edit taskでは対象成果物だけを変更し、実装変更が必要な場合は別の実装タスクまたはPJRへ分離する。
- review taskでは従来どおり成果物を変更せず、review resultだけを更新する。

### 3.4. 実装と文書が乖離した場合の判断

`retrofit` は実装を無条件に文書へコピーする手順ではなく、根拠間の差を明示する手順とする。

| 状況                                 | 扱い                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| 実装と意図された仕様が一致する       | 現在動作として成果物へ反映し、根拠を記録する                              |
| 文書が古く、実装変更が承認済み       | 文書を実装へ合わせ、承認根拠を記録する                                    |
| 実装が意図された仕様と異なる         | 文書を実装へ無条件に合わせず、乖離としてPJRまたはreview findingへ記録する |
| 実装から目的・業務判断を確認できない | 推測せず、文書・決定記録の確認事項として残す                              |
| 複数実装が異なる挙動を持つ           | 適用条件と差異を記録し、正とする挙動の判断を依頼する                      |

edit resultには、参照した実装、抽出した現在動作、文書へ反映した内容、未反映の乖離、未確認範囲を記録する。review resultには、成果物と実装エビデンスの対応、判定根拠、乖離、実装または文書のどちらに修正が必要かを記録する。

### 3.5. `bootstrap`との併用

実践の型が未整備で、かつ実装先行の成果物を作成する場合、`bootstrap` と `retrofit` は置き換えず、別フェーズとして連続させる。

推奨順序:

1. `bootstrap`: 代表成果物とrulebook / recipe / sample / templateを一式整備する。
2. `retrofit`: 宣言された実装エビデンスから各成果物を作成・補正する。
3. `cross-deliverable-dedup`: 成果物間の正本選択と重複整理を行う。
4. `fully-guided`: 整備済みの実践の型に沿って磨き込む。
5. `retrofit` review: 完成版と実装の対応・乖離を確認する。
6. `finalize` / `bootstrap-finalize`: 人が成果物と必要な実践の型を確定する。

data-flowでは、`cdfd-overview` の `bootstrap` で共通のCDFD実践一式を整備し、その後の `retrofit` フェーズで、各CDFDが対応する `src/` / `tools/` を参照する構成を代表例とする。

## 4. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                            |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | 実装先行が発生している既存箇所の洗い出し（data-flowを代表例とする）          | ARC  | done | data-flow の全10成果物を実装と対応付け          |
| 2   | 文書への「反映」/「新設」の判断基準と乖離時の優先規則の設計                  | ARC  | done | retrofit plan と kata-guide に定義              |
| 3   | `evidence_refs` の構造、パス制約、存在・重複・広さの検証規則の設計           | ARC  | done | DCT schema・rulebook・catalog validation に反映 |
| 4   | `dct.schema.yaml` とDCT型定義への `evidence_refs` 追加                       | DEV  | done | `EvidenceRef` 型と schema 定義を追加            |
| 5   | DCTの `evidence_refs` をedit/review planへ展開する処理の実装                 | DEV  | done | plan の「実装エビデンス」へ展開                 |
| 6   | 実装エビデンスを変更・commit許可対象に含めない境界の実装・テスト             | DEV  | done | targets 非追加と commit scope 除外をテスト      |
| 7   | `retrofit` approach の参照方針・進め方とkata-guide.mdへの反映                | ARC  | done | 初期整備・実装反映・横断整理に追加              |
| 8   | `xep-retrofit-template.md`（edit用planテンプレート）の作成                   | ARC  | done | 反映/新設判断と乖離記録を定義                   |
| 9   | `xrp-retrofit-template.md`（review用planテンプレート）の作成                 | ARC  | done | 対応・乖離・修正対象判定を定義                  |
| 10  | `exec-common.schema.yaml` の `Approach` enumと依存schemaへの `retrofit` 追加 | DEV  | done | 共通 enum とTypeScript解決処理へ追加            |
| 11  | edit/review resultの実装対応・乖離・未確認範囲の記録項目の整備               | ARC  | done | plan と汎用 result テンプレートへ記録項目を追加 |
| 12  | 関連ガイド（exec-config、plan/result lifecycle、Schedule設計）への反映       | ARC  | done | 3ガイドへ反映                                   |
| 13  | data-flowのDCTへ実装エビデンスを割り当て、plan展開を検証                     | ARC  | done | `dct-data-flow.yaml` と自動テストで検証         |
| 14  | `retrofit` edit/review、パス検証、commit境界の自動テスト追加                 | QE   | done | 関連125テスト通過                               |

## 5. 対応結果

- `retrofit` を独立したapproachとして、TypeScript型、CLIのapproach解決、共通schema、edit/review planテンプレートへ実装した。
- DCTに `evidence_refs` を追加し、正準相対パス・存在・重複・過度に広い範囲を `catalog validate` で検証できるようにした。宣言がない `retrofit` planは生成エラーとした。
- 実装を現在動作、既存文書・決定記録を意図された仕様、`done_criteria` を成果物目的として扱い、維持・部分反映・作り直し・新設を判定する基準をガイドとplanへ反映した。
- 実装エビデンスはplan本文へ読み取り専用で展開し、`targets` とcommit許可範囲には追加しない境界を実装・テストした。
- data-flowの全10成果物へ `src/` の実装エビデンスを割り当て、edit/review plan展開、パス検証、commit境界の自動テストを追加した。
- 型ビルド、関連125テスト、DCT・Schedule strategyのschema検証を完了した。

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:dct-rulebook|成果物カタログ作成ルール]]
- [[specdojo:docs-structure-guide|ドキュメント構成ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
- [[specdojo:kata-guide|実践の型活用ガイド]]
- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]
- [[specdojo:exec-config-guide|exec設定ガイド]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]
