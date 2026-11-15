---
specdojo:
  id: prj-0001:xep-pjr-3hxq-20261115t165137z-189cfb3f
  type: exec-plan
  rulebook: none
  task_id: PJR-3HXQ
  name: "sld-specdojo を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: fully-guided
  targets:
    - sld-specdojo
---

# Edit Plan: PJR-3HXQ

## 1. このフェーズで行うこと

sld-specdojo を最新の grade の指摘で直す

## 2. 対象成果物

- `name`: 保管場所一覧（SpecDojo）
- `depends_on`:
  - [[cdsd-planning]]
  - [[cdsd-execution]]
  - [[cdsd-sharing]]
- `based_on`（対象成果物の frontmatter）: [[cdsd-planning]]、[[cdsd-execution]]、[[cdsd-sharing]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: SpecDojo が記録を置く場所（リポジトリ内の docs・execution・controls、端末側の状態ディレクトリ、worktree、一時ディレクトリ）ごとに、置くもの・Git で共有するか・寿命・消してよいかを一覧にする
- `path`: `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-3HXQ/pjr-3hxq-20261115T165137Z-189cfb3f/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/sld-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/sld-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-pm-plan-feasibility; line=100; anchor=``"| 監視結果・費用作業記録の物理保管先と保持期間（未決事項）    | `_UNDECIDED_`: [[cdsd-execution\\|概念データストア定義（プロジェクト実行）]] で監視結果・費用作業記録の具体的な保管先と保持期間が未確定のため、本書では既存実装が存在する保管場所のみを確定記載している                                                                          | BA・OPS・ARC が監視記録・費用記録の運用方式を決定した後、リポジトリ内（`reporting/` 等）または端末ローカルのどちらに置くかを確定し、本書の第2章「保管場所一覧」へ該当行を追加する                                       | `prj-0001:pjr-monitoring-storage`  |"``; cause=document\]: `Specify a decision milestone for monitoring and cost-record storage, such as before reporting operations begin or before the ready review; “after BA・OPS・ARC decide the operating method” describes a dependency but provides no timing for the prerequisite decision.`
- F002 \[minor/vp-pm-control-reporting; line=101; anchor=``"| CDSD 未登録データストア群の正式登録と辞書接続（今後の整備） | `_TODO_`: タスク実行状態、実行計画と実行結果、実行証跡（Evidence）、タスク実行 worktree、成果物本体、ドキュメントインデックス、プロジェクト構成定義、成果物カタログは各 CDSD で追加候補（`_TODO_`）として記録されている。実装上の配置は確定しているため本書で保管場所を定義済み | BA・ARC が各 CDSD の改訂タスクで上記データストアを一覧へ昇格させた際、本書の第4章「関連仕様・実装配置との対応と検証」（対応表）の参照記述を正式名称へ更新する                                                           | `prj-0001:pjr-cdsd-store-sync`     |"``; cause=document\]: `Identify the Schedule task or planning destination for the already planned CDSD amendments, and distinguish it from any separate PJR issue or decision; also label the proposed register-entry types and PM handoff responsibility so the same amendment work is not tracked twice.`
- F003 \[major/vp-ba-requirements-completeness; line=11; anchor=``"本書は SpecDojo が扱うリポジトリ内領域（`docs/`、`execution/`、`controls/`、派生ビュー `generated/`、`.specdojo/`、`archive/`）、端末側の状態ディレクトリ（`${XDG_STATE_HOME:-~/.local/state}/specdojo/`）、タスク実行用 worktree、および一時ディレクトリを対象とする。"``; cause=document\]: `Add storage-policy coverage for permanent .specdojo configuration, including specdojo.config.json, exec-defaults.yaml, and agent-members.yaml; the inventory currently covers only doc-index.json there and leaves the configuration files' contents, sharing, lifetime, and deletion conditions undefined despite including .specdojo/ in scope.`
- F004 \[minor/vp-arc-cross-document-consistency; line=41; anchor=``"| タスク実行 worktree 領域（`<worktree_base>/<task-name>/` または `<worktree_base>/<task-name>/{project,<repo>}/`）                       | タスク単位で分離された Git 作業ツリー（`exec/<task-name>` ブランチ）、`npm ci` で展開された `node_modules/`、worktree 内で再生成された `generated/`・`.specdojo/doc-index.json` | `exec run`、`job run`（開始時に作成、統合成功時に自動削除） | `作業ツリー自体は共有なし（端末ローカル）`。コミットは統合戦略に従い統合先ブランチへ反映される | タスク開始から統合完了まで（失敗・中断時の `--resume` 対象や `branch-only` 時は残存） | `条件付き削除可`。実行中または未統合コミットを持つ worktree の直接削除は不可。統合完了後、または破棄合意後に実行中プロセスがないことを確認し `git worktree remove` 等で削除する         |"``; cause=document\]: `The worktree row says branch-only worktrees remain, whereas docs/ja/specdojo/guides/docs-structure-guide.md:567 says successful processing removes all worktrees and retains only branch-only branches; distinguish retained branches from retained worktrees and update the corresponding cleanup guidance at line 67.`
- F005 \[minor/vp-arc-cross-document-consistency; line=80; anchor=``"| タスク・Job・品質評価の実行履歴領域（`execution/`）            | [[cdsd-execution\\|プロジェクト実行]] の Job 実行履歴・品質評価結果・進捗報告・会議記録、および追加候補のタスク実行状態・実行計画と実行結果・実行証跡（Evidence）                                     | `src/shared/run-records.ts`、`src/exec/`、`src/job/`、`src/grade/`                                                                                                       |"``; cause=document\]: `The mapping places progress reports and meeting minutes under cdsd-execution and execution/, whereas docs/ja/product/010-business-specs/020-data-model/cdsd-sharing.md lists them as reporting records and this document's line 28 places them under reporting/; map these records to cdsd-sharing and the reporting storage category.`
- F006 \[minor/vp-arc-cross-document-consistency; line=100; anchor=``"| 監視結果・費用作業記録の物理保管先と保持期間（未決事項）    | `_UNDECIDED_`: [[cdsd-execution\\|概念データストア定義（プロジェクト実行）]] で監視結果・費用作業記録の具体的な保管先と保持期間が未確定のため、本書では既存実装が存在する保管場所のみを確定記載している                                                                          | BA・OPS・ARC が監視記録・費用記録の運用方式を決定した後、リポジトリ内（`reporting/` 等）または端末ローカルのどちらに置くかを確定し、本書の第2章「保管場所一覧」へ該当行を追加する                                       | `prj-0001:pjr-monitoring-storage`  |"``; cause=document\]: `Attribute the unresolved monitoring and cost-record storage decisions to docs/ja/product/010-business-specs/020-data-model/cdsd-sharing.md, which defines those records and discusses unresolved storage policy; the cited cdsd-execution.md defines execution events, routines, and Jobs and contains no corresponding monitoring or cost-record storage issue.`
- F007 \[major/vp-arc-technical-constraints; line=31; anchor=``"| 派生生成ビュー・文書索引領域（`docs/**/generated/`、`.specdojo/doc-index.json`）                                                                                               | カタログ・管理台帳・実行状況・Job・品質評価の Markdown 集計ビュー（各ディレクトリの `generated/` 配下）、YAML 表示ページ、文書索引キャッシュ（`.specdojo/doc-index.json`）                                                                                                                                                                                                                          | `specdojo build`、`catalog build`、`register build`、`exec refresh`、`grade refresh`、`index build` | `共有なし（.gitignore で除外・各環境で生成）`（`.gitkeep` のみ Git 追跡）    | ビルド実行時から次回再生成または worktree 破棄まで（正本変更時・環境準備時に再生成） | `削除可`。すべて正本 YAML・Markdown から決定論的に生成される派生物であり、削除しても `specdojo build`（または各 `build` / `refresh`）で完全に再生成できる             |"``; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/sld-rulebook.md, section 6.2, good example at file line 157 classifying docs/**/generated/ as deletable and fully regenerable by specdojo build`\]: `Split regenerable views from grade runtime files: src/grade/run.ts:81 creates execution/grade/generated/run.lock and lines 126–130 place run.json under execution/grade/generated/runs/＜run-id＞/; these are a live exclusion mechanism and persisted resume state, not deterministic build outputs, so docs/**/generated/ cannot uniformly be classified as freely deletable and fully recoverable through specdojo build.`
- F008 \[minor/vp-arc-conciseness; line=57; anchor=``"| `削除不可`       | `docs/<lang>/product/`、`docs/<lang>/specdojo/`、`docs/specdojo/schemas/`、`docs/<lang>/projects/<id>/` の定義・計画・`controls/`・`execution/`（`generated/` と `.locks/` を除く）、`archive/`、端末側の `routine-state.json`・`routine-runs.jsonl` | 仕様・計画・台帳・実行証跡の正本（SSOT）または端末上の定期実行履歴である。削除すると監査証跡や未同期の定期処理状態が失われるため、日常運用で削除しない   |"``; cause=document\]: `Replace the repeated location lists and retention explanations in the three classification rows at lines 57–59 with references to the section 2 inventory, retaining only additional category-level decision rules; the duplicated paths and policies can be removed without losing operational conditions or recovery information.`
- F009 \[major/vp-dev-implementation-readiness; line=78; anchor=``"| プロダクト仕様・実践の型・プロジェクト定義・計画領域           | [[cdsd-planning\\|立上と計画]] のプロジェクト定義群・実践の型・スケジュール・定期処理定義・Job 定義、および追加候補の成果物カタログ・プロジェクト構成定義・成果物本体（[[cdsd-sharing\\|活用と共有]]） | [[specdojo:docs-structure-guide\\|ドキュメント構成ガイド]]、[[specdojo:directory-layout-reference\\|ディレクトリレイアウトリファレンス]]、`.specdojo/specdojo.config.json` |"``; cause=document\]: `Define the handling constraints for .specdojo/specdojo.config.json and the execution and agent configuration files in the storage inventory; listing configuration only as a source for other locations does not tell DEV what setup, migration, or cleanup changes must preserve, back up, share, or restore.`
- F010 \[major/vp-qe-done-criteria; line=11; anchor=``"本書は SpecDojo が扱うリポジトリ内領域（`docs/`、`execution/`、`controls/`、派生ビュー `generated/`、`.specdojo/`、`archive/`）、端末側の状態ディレクトリ（`${XDG_STATE_HOME:-~/.local/state}/specdojo/`）、タスク実行用 worktree、および一時ディレクトリを対象とする。"``; cause=document\]: `DC-001 is not satisfied because permanent .specdojo configuration is included in scope but has no inventory entry defining its contents, sharing, lifetime, and deletion policy; references to configuration as an implementation source do not provide those four required elements.`
- F011 \[major/vp-qe-done-criteria; line=31; anchor=``"| 派生生成ビュー・文書索引領域（`docs/**/generated/`、`.specdojo/doc-index.json`）                                                                                               | カタログ・管理台帳・実行状況・Job・品質評価の Markdown 集計ビュー（各ディレクトリの `generated/` 配下）、YAML 表示ページ、文書索引キャッシュ（`.specdojo/doc-index.json`）                                                                                                                                                                                                                          | `specdojo build`、`catalog build`、`register build`、`exec refresh`、`grade refresh`、`index build` | `共有なし（.gitignore で除外・各環境で生成）`（`.gitkeep` のみ Git 追跡）    | ビルド実行時から次回再生成または worktree 破棄まで（正本変更時・環境準備時に再生成） | `削除可`。すべて正本 YAML・Markdown から決定論的に生成される派生物であり、削除しても `specdojo build`（または各 `build` / `refresh`）で完全に再生成できる             |"``; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/sld-rulebook.md, section 6.2, good example at file line 157 asserting that docs/**/generated/ can be deleted and fully regenerated`\]: `DC-002 and DC-003 are not satisfied because execution/grade/generated/ contains the active run.lock and persisted run state implemented in src/grade/run.ts, while the inventory treats the entire generated subtree as freely deletable and fully regenerable; document separate lifecycle and cleanup conditions for these runtime files.`
- F012 \[major/vp-qe-omissions-consistency; line=65; anchor=``"| `generated/` の表示崩れや `.specdojo/doc-index.json` の索引不整合 | 対象の `generated/` 配下（`.gitkeep` を除く）または `.specdojo/doc-index.json` を削除し、`specdojo build`（または `index build` / `catalog build` / `register build` / `exec refresh`）を実行する                                                      | `generated/` 内の Markdown を手編集して正本修正の代わりにしてはならない。再生成でエラーが出る場合は正本 YAML・Markdown を DEV・ARC が確認する                        |"``; cause=document\]: `Apply the migration prerequisite from line 47 to the generated-directory cleanup procedure: line 65 currently permits deleting generated contents except .gitkeep without excluding unmigrated routines/generated/routine-state.json and routine-runs.jsonl; require destination-state verification before deleting those legacy records so recovery does not destroy the only routine history.`
- F013 \[minor/vp-ux-user-flow; line=74; anchor=``"`depends_on` の各概念データストア定義（CDSD）の管理単位（および各 CDSD の「確認事項と変更影響」で追加候補とされている管理単位）と、実装モジュール・設定ファイルの対応は次のとおりである。"``; cause=document\]: `Replace the reference to each CDSD's “確認事項と変更影響” section with the actual source locations: cdsd-planning.md, cdsd-execution.md, and cdsd-sharing.md place their datastore-addition TODOs in “概要” and have no section with the cited title, so readers cannot follow the stated route to the supporting candidates.`
- F014 \[major/vp-ops-operability; line=65; anchor=``"| `generated/` の表示崩れや `.specdojo/doc-index.json` の索引不整合 | 対象の `generated/` 配下（`.gitkeep` を除く）または `.specdojo/doc-index.json` を削除し、`specdojo build`（または `index build` / `catalog build` / `register build` / `exec refresh`）を実行する                                                      | `generated/` 内の Markdown を手編集して正本修正の代わりにしてはならない。再生成でエラーが出る場合は正本 YAML・Markdown を DEV・ARC が確認する                        |"``; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/sld-rulebook.md, section 6.2, good example at file line 157 treating docs/**/generated/ as a uniformly deletable and fully regenerable area`\]: `Before deleting generated contents, require OPS to exclude an active execution/grade/generated/run.lock and preserve needed execution/grade/generated/runs/＜run-id＞/ state and executor outputs; src/grade/run.ts uses these during execution and resumption, so the current blanket cleanup can defeat serialization and lose operational records that specdojo build cannot reconstruct.`
- F015 \[major/vp-qe-config-validity; line=101; anchor=``"| CDSD 未登録データストア群の正式登録と辞書接続（今後の整備） | `_TODO_`: タスク実行状態、実行計画と実行結果、実行証跡（Evidence）、タスク実行 worktree、成果物本体、ドキュメントインデックス、プロジェクト構成定義、成果物カタログは各 CDSD で追加候補（`_TODO_`）として記録されている。実装上の配置は確定しているため本書で保管場所を定義済み | BA・ARC が各 CDSD の改訂タスクで上記データストアを一覧へ昇格させた際、本書の第4章「関連仕様・実装配置との対応と検証」（対応表）の参照記述を正式名称へ更新する                                                           | `prj-0001:pjr-cdsd-store-sync`     |"``; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/shared/run-records.ts`（implementation）: 実行記録の run ごとの配置の決定
- `src/routine/storage.ts`（implementation）: 端末側の状態ディレクトリへの routine の状態・履歴・lock の配置
- `src/exec/worktree.ts`（implementation）: task worktree の命名・配置

実装エビデンスは現在動作の事実、rulebook は書き方、`depends_on` と個票の `入力` は意図された仕様の根拠として使い分ける。食い違いは実装へ無条件に合わせず、承認根拠のある現在動作だけを反映し、未承認の乖離は意図された仕様を保持して result に記録する。実装から目的・業務判断・将来方針を推測しない。

`depends_on` の「未作成」は参照できる本文がまだないことを示す。未作成の依存だけを理由に異常終了せず、存在する資料で進める。内容を推測で埋めず、必要な箇所は _TODO_ / _ASSUMPTION_ として、不足する根拠と次のアクションを残す。

### 4.1. 必要な実践の型が存在しない・内容が薄い場合

- `not-needed` ではない rulebook / recipe が存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `進め方と実践の型の適用` セクションに記録する。
- 不足分は、存在する他の実践の型と `depends_on` 成果物（いずれも plan 記載の文書）、および既存の対象成果物で補う。実践の型の欠落を理由にレビュー観点を未達にしない。
- 章構成は既存の対象成果物を骨組みとし、判断に迷う場合は rulebook の構成を正とする。
- 実践の型そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認し、既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、既存記述を基礎として不足分を加筆・補強する。
- 次のいずれかに該当する箇所は、既存記述であっても修正対象とする。修正はいずれも該当箇所に閉じた最小限にとどめる。
  - `depends_on` の最新の決定事項と明確に矛盾する箇所。
  - 手順1で確認した rulebook の必須要素が欠落している箇所、rulebook の禁止事項に抵触している箇所、および rulebook が定める章構成に適合していない箇所。
  - 同一成果物内で同じ内容が複数箇所に重複している箇所。
  - rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述。
- 上記のいずれにも該当しない場合（完成度・整合性・読みやすさの向上など）は、それだけを理由に修正しない。既存記述が rulebook の許容範囲内（例: 複数の構成が認められている場合の一方の選択）であれば、他章との見た目の整合を理由に、より詳細な構成や長い記述へ書き換えない。
- rulebook 不適合の修正は、既存記述の内容を保持したまま rulebook の章構成へ移し替え、欠落した必須要素を補い、禁止事項に該当する記述形式を改める作業として行う。内容の全面書き換えはしない。移し替え先が定まらない既存記述は、下記の削除対象に該当しない限り削除せず、内容が最も近い章に残したうえで、その判断を result に記録する。
- 重複記述は、内容が最も適切な1箇所を正本と定めて統合し、他の箇所は要約または正本の章への参照に置き換える。統合で情報が失われる場合は、不足分を正本側に取り込んでから他方を整理する。
- rulebook の必須要素にも `done_criteria` にも寄与していない記述は削除する。削除は既存記述の尊重の例外であり、判断根拠を result に記録することで担保する。
- 既存記述が古いか判断できない場合、rulebook への不適合か意図的な逸脱か判断できない場合、および必須要素・`done_criteria` に寄与するか判断できない場合は、破棄せず _TODO_ / _ASSUMPTION_ で論点を残す。
- 加筆・修正・統合・削除の判断根拠を result の `進め方と実践の型の適用` セクションに残す。削除・統合した記述については、対象箇所と根拠が後から追える粒度で記録する。

### 4.3. 根拠のない具体化の禁止

- ファイルパス・コマンド・設定値など、実装や設定の実態を示す具体的な記述を新たに書き加える場合は、本セクションの宣言された参照範囲（rulebook / 併せて適用する rulebook / recipe、`depends_on` 成果物、`based_on`、プロジェクトコンテキスト、個票の `入力`、カタログの `brief`）で裏付けが取れる場合に限る。sample は別文脈の完成例であり、対象成果物の具体的な記述の裏付けにしない。
- 既存記述が曖昧・不完全（ファイル名のみでパスが無い、値が未確定など）であっても、裏付けが無ければ推測で具体化しない。完成度を上げる目的だけで、もっともらしい値を断定的に書き加えない。
- 裏付けが無く判断できない箇所は、既存の曖昧な記述を残したまま _TODO_ / _ASSUMPTION_ として論点を残す。

### 4.4. 判断根拠の記録

参照した文書・参照しなかった文書と、その判断根拠を result に残す。記録先は次のとおり。

- 参照した rulebook / recipe / sample の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い実践の型の扱い、既存記述の加筆・修正・統合・削除の根拠、具体化を見送った箇所とその理由: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って実践の型に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- 保管場所の区分が実装の配置と一致していること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] 保管場所ごとに置くもの・共有の有無・寿命・消してよいかが記述されていること
- [OPS] 運用者が消してよい場所と残すべき場所を判断できること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 実行に必要なツール・パッケージの依存を解決できない、対象ファイルのパスが特定できない、または lint/test 未解消の場合は異常終了する（終了コード 1）。
- 未作成の `depends_on` と `evidence_refs` の欠落だけでは異常終了しない。未作成の依存の内容は推測せず _TODO_ / _ASSUMPTION_ と次のアクションを残す。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-KATA-WAVE-2-sld-specdojo-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 動いている grade の lock や実行状態のファイルを消してよいとしている誤りを直し、片付けてよい場所と残すべき場所を実装の配置と合わせている。`.specdojo` の設定の保管と、grade の実行状態の置き場所の区分を正す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
