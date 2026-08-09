---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-multi-project-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-multi-project-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-multi-project-010-plan.md
  started_at: "2026-08-09T21:06:42.758Z"
  completed_at: "2026-08-09T21:16:23.706Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-multi-project
---

# Edit Result

## 1. 実施内容

対象成果物が存在せず、成果物カタログに path、rulebook、depends_on、done_criteria が定義済みであったため、判断を「新設」とした。[[prj-0001:cdfd-multi-project|概念データフロー図（複数プロジェクト・ブランチ並行運用）]] を TO-BE の領域別 CDFD として新設し、次を表と Mermaid 図へ反映した。

- `main`、project `develop`、feature、exec の責務、担当、分岐元、統合先、および複数 project に影響する共通変更の統合順序。
- project `develop` の作成、並行実行割当、feature / exec worktree 作成、分離作業、commit、ベース同期、project への統合、`main` への昇格、worktree / branch の後片付け。
- 各 branch / worktree が読み書きする project 成果物、Schedule・実行計画、task result・event、commit・PR 証跡と、`main → project develop → feature / exec → project develop → main` の統合方向。
- ID・branch・worktree path の競合、同期失敗、merge 競合、統合先誤り、未commit変更、共通成果物の並行変更について、停止範囲、保持する情報、復旧・再開条件。
- `P-04 タスク実行`、`P-02 登録簿運用`、`P-03 計画展開`、`P-07 構成変更`、`P-08 派生生成` へ委譲する責務と、本領域へ結果を戻す条件。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-multi-project.md`（新規）: `P-06 並行運用` の領域別 CDFD。
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-multi-project-010-result.md`: retrofit の照合結果、新設判断、未反映の乖離、未確認範囲、検査結果を記録。

## 3. 申し送り

- `src/exec-project.ts` は project ごとの Schedule・execution・catalog・roles・viewpoints のパスを解決するが、成果物カタログの evidence purpose にある「プロジェクト単位の実行ブランチ・worktree制御」は実装していない。evidence purpose を実態に合わせるか、project `develop` の明示的な分岐元・統合先検証を実装へ追加する別タスクが必要である。
- `src/exec-worktree.ts` の exec branch は受け取った task ID の slug から `exec/<slug>` として導出され、現在の `HEAD` から作成される。project 修飾 task ID が常に渡されること、現在ブランチが対象 project `develop` であること、merge 先も同じ `develop` であることは列挙エビデンス内で強制されていない。誤った project への分岐・統合を防ぐには、呼び出し元を evidence_refs に追加して現在動作を確認した上で、必要ならガードを実装する。
- feature / project `develop` の作成、`main` と project `develop` の同期、feature / exec の同期・統合、競合解消、worktree / branch 削除は列挙された実装から確認できない。現在動作を確定する後続 review では、実際のオーケストレーション、worktree 分割操作、同期スクリプトを evidence_refs に追加する必要がある。
- ID 競合の停止・復旧は done_criteria、[[prj-0001:cdfd-register-operation|概念データフロー図（登録簿ライフサイクル）]]、[[prj-0001:pjr-0137-register-id-uniqueness|PJR-0137]] が示す意図を成果物へ反映した。列挙実装には ID 検証・再採番がないため、現在動作としては未確認であり、本領域から `P-02 登録簿運用` へ委譲する仕様を保持した。

## 4. 進め方と実践の型の適用

approach は `retrofit` とし、列挙実装を現在動作、先行 CDFD・プロジェクト文脈・承認済みの運用標準とガイドを意図された仕様、成果物カタログの done_criteria を完了目的として分離して照合した。文書構造は [[specdojo:cdfd-rulebook|概念データフロー図（領域別）作成ルール]]、Mermaid 記法は同 rulebook が include する [[specdojo:cdfd-mermaid-rulebook|Mermaid を用いた概念データフロー図 作成ルール]] に従った。プロジェクトレベルの Why は、複数参加者が成果物と判断を引き継げる分離・統合・証跡の要件に反映し、本文へ再掲していない。

### 4.1. 参照した実装エビデンスと抽出した現在動作

| パス                   | 抽出した現在動作                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/exec-project.ts`  | `--project`、Schedule / execution の環境変数、project 環境変数、`current_project`、設定上の先頭 project の順に project と関連パスを解決する。未知 project、設定不足、Schedule / execution の片側だけの指定を拒否し、解決した Schedule・execution パスを実行環境へ反映する。Git branch、worktree、同期、統合は扱わない。 |
| `src/exec-worktree.ts` | task ID を安全な slug と `exec/<slug>` へ変換し、Git の登録済み worktree から branch を検索する。worktree のベースディレクトリは repository 外だけを許可し、既存 path と登録状態、期待 branch の不一致を拒否する。branch があれば再利用し、なければ現在の `HEAD` から branch と worktree を作成する。                   |
| `src/exec-worktree.ts` | task worktree ごとに tracked `package-lock.json` の単位で独立した依存を準備し、旧 `node_modules` symlink はリンクだけを外して置き換える。依存準備失敗時は例外終了する。また Git index lock 競合だけを短いバックオフで最大5回再試行し、その他の Git 失敗は即時に理由付きで返す。                                         |

### 4.2. 照合結果と新設判断

- 一致: project ID から関連する Schedule・execution 領域を分離する現在動作と、task ID ごとに exec branch / worktree を一意に導出し、既存 path・branch の不一致を停止する現在動作は、複数 project・タスクの混在を避ける意図と一致したため成果物へ反映した。
- 一致: task worktree の独立した依存準備、依存準備失敗時の停止、Git index lock 競合の限定再試行は、作業領域の分離と準備失敗時の保持・再開条件に対応する現在動作として反映した。
- 乖離: [[specdojo:git-branching-standard|Git ブランチ運用標準]] は `exec/<project-id>-<task-id>` を対象 project `develop` から分岐し、同じ `develop` へ統合するが、`src/exec-worktree.ts` 自体は project を受け取らず、明示したベース branch から作成する引数も持たない。成果物には意図された仕様を保持し、実装または evidence purpose の変更候補として申し送った。
- 実装から確認不能: project `develop`、feature の作成・作業、`main` / project / worktree 間の同期、feature / exec の commit 許可範囲、merge、競合解消、complete / block、worktree・branch 削除、ID 競合復旧は列挙された2パスだけでは確認できない。done_criteria と [[specdojo:git-branching-standard|Git ブランチ運用標準]]、[[specdojo:branch-workflow-guide|ブランチワークフローガイド]]、[[specdojo:exec-worktree-guide|exec worktree運用ガイド]] が一致する TO-BE を成果物へ記載し、現在動作とは分類を分けた。
- 既存成果物が無く、局所更新の対象がない。カタログの path・done_criteria と rulebook がそろい、`based_on` に指定できる依存先も存在したため「新設」を選択した。frontmatter の `status` は人間承認前の `draft` とし、`based_on` は depends_on の `prj-0001:cdfd-init` だけに限定した。

### 4.3. 成果物へ反映した内容と未反映の乖離

- 成果物へ反映: project `develop`、feature、exec の作成と担当、分離作業、commit、ベース同期、project 統合、`main` 昇格、後片付けを11プロセスに分け、各プロセスを表と図で同じ ID・名称にした。
- 成果物へ反映: branch / worktree 別の読取・書込対象、task result と event の管理境界、commit・PR 証跡、固定した統合方向を専用表で対応付けた。
- 成果物へ反映: ID・branch・path 競合、同期失敗、merge 競合、未commit変更、共通成果物の project 間競合について、停止対象、保持対象、再開条件を主要例外にした。
- 未反映の実装乖離: 列挙実装だけに合わせて project `develop`、feature、同期、統合、後片付けを成果物から削除する変更は行わなかった。これらは done_criteria と承認済み標準が要求する意図された仕様であり、実装側の確認・補完候補とした。
- 未反映の文書変更: `src/exec-project.ts` の evidence purpose と実装責務の不一致は成果物カタログの変更を伴うため、本タスクへ混在させず申し送りに限定した。

### 4.4. 未確認範囲

- 列挙された `src/exec-project.ts` と `src/exec-worktree.ts` は全体を読み、調査できなかった evidence_refs はない。
- exec worktree の呼び出し時に project 修飾 task ID を組み立てる分岐、checkpoint、commit 許可範囲、merge、remove、実行状態更新、feature worktree、同期スクリプトの実装は列挙外コードのため未確認である。
- ID 競合の検出・再採番、文書索引の重複 ID 検出、register 個票・wikilink・plan / result 参照の一括更新は列挙外実装のため未確認である。
- Git hosting 上の branch protection、CODEOWNERS、PR approve、複数 project 間の実際の統合順序は外部設定・運用状態のため未確認である。
- 故意に merge 競合、未commit変更、誤った統合先、worktree path 衝突を発生させる破壊的な実地試験は行っていない。

### 4.5. 整形・静的検査

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-multi-project.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-multi-project.md`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: CLI 起動時の IPC ソケット作成が実行環境で `EPERM` となり、検証本体の開始前に失敗した。
- `node --import tsx src/specdojo.ts catalog validate`: 成功。全 DCT が `OK`。未生成の別成果物に関する既存 warning のみで、本成果物のエラーはない。
- `node --import tsx src/specdojo.ts index build`: 成功。1019 文書を索引へ生成した。
- result 更新後に、変更した2つの Markdown へ Prettier と markdownlint を再実行し、catalog validate と index build を pre-commit 相当として再確認した。
