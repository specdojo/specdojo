---
specdojo:
  id: prj-0001:cdfd-multi-project
  type: flow
  status: draft
  rulebook: specdojo:cdfd-rulebook
  based_on:
    - prj-0001:cdfd-init
  supersedes: []
---

# 概念データフロー図（複数プロジェクト・ブランチ並行運用）: SpecDojo

本書は、[[prj-0001:cdfd-overview|概念データフロー図（全体概要）]] が定める `P-06 並行運用` の境界を引き継ぎ、複数 project の project `develop`、feature、exec の各ブランチと worktree を分離し、作業結果を対象 project へ統合してから `main` へ昇格する TO-BE フローを定義する。BA が担当と利用場面を整理し、PM、ARC、QE、タスク owner が作成、作業、同期、統合、後片付けと主要例外を同じ表と図から確認するために使用する。

## 1. 目的と適用範囲

- 対象者は、並行実行条件と統合順序を管理する PM、feature を担当する開発者、exec タスクを担うタスク owner・AI Agent、正本と統合方向を設計入力にする ARC、競合時の停止・復旧を確認する QE である。
- 対象は、確認済みの `main` から project `develop` を準備し、独立した実行単位を feature または exec のブランチと worktree に分離して作業し、対象 project の最新状態を同期し、検証済み commit を project `develop` へ統合して後片付けするまでである。project の受入後に project `develop` を `main` へ昇格する境界も扱う。
- project ごとの統合点は `project/<project-id>/develop` とする。feature は `feature/<project-id>/<topic>`、exec は project 修飾 task ID から導出する `exec/<project-id>-<task-id>` を用い、いずれも対象 project の `develop` から分岐して同じ `develop` へ戻す。別 project の `develop` または `main` へ直接統合しない。
- project 固有成果物と実行記録は対象 project の `develop` で統合する。複数 project に影響する共通成果物は統合順序と担当を管理記録へ残し、一つの project `develop` から `main` へ統合した後、`main` から他 project の `develop` へ同期する。
- feature / exec 内の成果物編集、検証、result 作成など一タスク内部の正常・例外処理は `P-04 タスク実行` に委譲する。agent・provider・並列数などの運用条件変更は `P-07 構成変更`、派生物の再生成は `P-08 派生生成` の責務とし、本領域では分離、同期、統合の入出力だけを扱う。
- AI Agent と SpecDojo CLI は exec の分離作業、commit、統合を支援できるが、project の受入、`main` への昇格、競合解消結果、破棄を伴う後片付けの最終確認は人間が担う。運用規範は [[specdojo:git-branching-standard|Git ブランチ運用標準]]、段階的な安全条件は [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] を正とする。

## 2. 領域内プロセス一覧

<!-- prettier-ignore -->
| プロセス ID | プロセス | 業務目的 | 主な担当 | 起動条件 | 主要入力 | 主要出力・生成先 | 正本・データストア | 必須性 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P-06-01` | project develop 作成 | project 固有変更の分岐元・統合先を `main` から独立させ、別 project への誤統合を防ぐ。 | PM、プロジェクト管理者 | 新しい project の開始が承認され、基準とする `main` の commit が確定した | project ID、確認済み `main` commit、プロジェクト構成 | `project/<project-id>/develop` と対応 worktree、基準 commit | `main`、project `develop` | 必須 |
| `P-06-02` | 並行実行割当 | 依存を満たす実行単位を project と担当へ割り当て、同一範囲の変更順序を合意する。 | PM、タスク owner | 独立して実行可能な feature または Schedule タスクが複数存在する | 実行可能タスク、依存、対象 project・成果物、並列数、共通成果物の変更予定 | project・担当・実行方式・統合順序を含む実行割当 | Schedule・実行計画、運用・構成定義、実行記録 | 必須 |
| `P-06-03` | feature worktree 作成 | 人が行う目的別変更を、対象 project の統合状態から分離する。 | 開発者 | feature の目的と担当が合意され、対象 project の `develop` と作業ツリーが clean である | project ID、topic、対象 project `develop` の commit、対象成果物 | `feature/<project-id>/<topic>` と feature worktree、ベース commit | project `develop`、feature branch / worktree | 条件付き |
| `P-06-04` | exec worktree 作成 | Schedule タスクの自動変更を task 単位に分離し、成果物と result の混在を防ぐ。 | SpecDojo CLI、実行担当 | task が実行中として割り当てられ、plan、result、claim 記録と対象 project の統合先を確認できる | project 修飾 task ID、edit / review plan、対象 project `develop` の commit、実行条件 | `exec/<project-id>-<task-id>` と task worktree、checkpoint commit、実行可能な依存 | project `develop`、Schedule・実行計画、exec branch / worktree、実行記録 | 条件付き |
| `P-06-05` | 分離作業 | feature または exec の変更を専用 worktree 内に限定し、対象と担当を追跡できる作業結果を作る。 | 開発者、タスク owner、AI Agent | feature または exec worktree の準備と担当割当が完了した | 対象成果物、plan・仕様、ベース commit、作業条件 | 更新成果物、検証結果、exec の場合は task result、未commit差分 | feature / exec worktree、成果物、実行記録 | 条件付き |
| `P-06-06` | 分離結果 commit | 検証済みの成果物と許可された実行記録を、統合・監査できる変更単位として確定する。 | 開発者、SpecDojo CLI | 対象変更の検証が成功し、commit 対象と除外対象を識別できる | 更新成果物、task result、検証結果、変更許可範囲 | feature / exec branch の commit、commit 対象外として保持する変更の警告 | feature / exec branch、Git 履歴、実行記録 | 条件付き |
| `P-06-07` | worktree ベース同期 | 統合前に対象 project の最新変更を分離作業へ取り込み、競合を project 内で解消できる状態にする。 | 開発者、タスク owner | worktree が clean で、対象 project `develop` に未取込 commit がある | 対象 project `develop`、feature / exec の commit、明示したベースブランチ | 同期済み feature / exec branch、競合の有無、再検証要求 | project `develop`、feature / exec branch / worktree、Git 履歴 | 条件付き |
| `P-06-08` | feature・exec 統合 | 分離された結果を、所属する project の一つの統合状態へ戻す。 | PM、開発者、SpecDojo CLI | 同期と必要な再検証が成功し、統合先、未commit変更、未統合 commit を確認できる | feature / exec commit、検証結果、対象 project `develop`、統合順序 | project `develop` への merge commit、統合状態、更新された成果物・task result | feature / exec branch、project `develop`、Git 履歴、実行記録 | 条件付き |
| `P-06-09` | main 共有変更同期 | `main` で確定した共通変更を project 履歴を保ったまま取り込み、project 間の長期乖離を避ける。 | PM、プロジェクト管理者 | `main` が更新され、project の作業を継続する | 最新 `main` commit、対象 project `develop`、共通変更の影響・統合順序 | `main` を merge した project `develop`、再検証結果、worktree への再同期要求 | `main`、project `develop`、Git 履歴、実行記録 | 条件付き |
| `P-06-10` | project develop 昇格 | project の受入済み変更を、レビュー可能な単位で安定統合点 `main` へ共有する。 | プロジェクト管理者、承認者 | 未統合の feature / exec がなく、最新 `main` の取込、project 全体の検証、レビューが成功した | project `develop` の commit、検証結果、未解決事項、承認結果 | `main` への merge commit・PR 証跡、他 project への同期要求 | project `develop`、`main`、Git / PR 履歴、実行記録 | 条件付き |
| `P-06-11` | worktree・branch 後片付け | 統合済みの一時作業領域だけを削除し、未退避の成果物・result・commitを失わない。 | 開発者、SpecDojo CLI、PM | 統合済みで、task 記録が完了し、未commit変更・未統合 commit・保持理由がない | worktree 状態、統合状態、task 状態、成果物・result の差分 | 削除済み worktree、条件付きで削除済み feature / exec branch、保持した監査証跡 | Git worktree 登録、feature / exec branch、Git 履歴、実行記録 | 条件付き |

`P-06-03` と `P-06-04` は割り当てた実行方式ごとに選択する。複数 project を並行する場合は、worktree のベースを main worktree の現在ブランチから暗黙に決めず、対象の `project/<project-id>/develop` を明示する。`P-06-07` は対象 project に新しい commit がある場合に実施し、同期後は変更対象に必要な検証を再実行する。

### 2.1. 正本・commit・統合方向

| ブランチ・worktree                                 | 主に読み取る情報                                                                    | 主に書き込む情報                                           | commit・統合方向                                                                                                                        |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                                             | project 昇格結果、共通成果物、安定した基準 commit                                   | 承認済み project 変更、先に統合する共通成果物、PR 証跡     | project `develop` の受入済み変更だけを `main` へ統合し、`main` の共有変更を各 project `develop` へ merge する                           |
| `project/<project-id>/develop` と project worktree | `main` の共有変更、対象 project の成果物・Schedule・実行記録、feature / exec commit | project 固有成果物、統合済み task result・commit、統合状態 | feature / exec の分岐元・統合先とし、project 受入後だけ `main` へ昇格する                                                               |
| `feature/<project-id>/<topic>` と feature worktree | 対象 project `develop` の成果物とベース commit、目的別の仕様                        | feature 対象成果物、検証結果、feature commit               | 対象 project `develop` から分岐・同期し、同じ project `develop` へ統合する                                                              |
| `exec/<project-id>-<task-id>` と task worktree     | 対象 project `develop` の成果物、edit / review plan、task の実行条件                | plan が許可する成果物、対象 task result、exec commit       | 対象 project `develop` から分岐・同期し、同じ project `develop` へ統合する。event・他 task の result・再生成物を task commit に混ぜない |
| 実行記録領域                                       | Schedule task、plan、claim・状態 event、過去 result                                 | 実行割当、対象 task result、統合・block・complete の状態   | worktree commit には対象 result だけを含め、状態 event は project 統合側で直列に管理する                                                |

## 3. 概念データフロー

```mermaid
flowchart TB
  プロジェクト管理者["プロジェクト管理者<br>（PM・承認者）"]
  作業担当["作業担当<br>（開発者・task owner・AI Agent）"]

  project開始{{"新しい project の開始が承認された"}}
  並行実行可能{{"独立した実行単位が複数存在する"}}
  main更新{{"main の共有変更が確定した"}}
  project受入{{"project の変更が受入可能になった"}}

  subgraph 並行運用["P-06 並行運用"]
    direction TB
    projectDevelop作成("P-06-01 project develop 作成<br>（担当: PM・プロジェクト管理者）")
    並行実行割当("P-06-02 並行実行割当<br>（担当: PM・task owner）")
    featureWorktree作成("P-06-03 feature worktree 作成<br>（担当: 開発者）")
    execWorktree作成("P-06-04 exec worktree 作成<br>（担当: SpecDojo CLI・実行担当）")
    分離作業("P-06-05 分離作業<br>（担当: 開発者・task owner・AI Agent）")
    分離結果Commit("P-06-06 分離結果 commit<br>（担当: 開発者・SpecDojo CLI）")
    worktreeベース同期("P-06-07 worktree ベース同期<br>（担当: 開発者・task owner）")
    featureExec統合("P-06-08 feature・exec 統合<br>（担当: PM・開発者・SpecDojo CLI）")
    main共有変更同期("P-06-09 main 共有変更同期<br>（担当: PM・プロジェクト管理者）")
    projectDevelop昇格("P-06-10 project develop 昇格<br>（担当: プロジェクト管理者・承認者）")
    worktreeBranch後片付け("P-06-11 worktree・branch 後片付け<br>（担当: 開発者・SpecDojo CLI・PM）")
  end

  main[("main<br>安定統合点・共通成果物")]
  projectDevelop[("project develop<br>project成果物・実行記録・統合commit")]
  featureWorktree[("feature branch / worktree<br>目的別成果物・commit")]
  execWorktree[("exec branch / worktree<br>対象成果物・task result・commit")]
  実行計画記録[("Schedule・実行計画・実行記録")]
  GitPR履歴[("Git / PR 履歴")]

  subgraph 領域外["対象領域外"]
    タスク実行("P-04 タスク実行")
    構成変更("P-07 構成変更")
    派生生成("P-08 派生生成")
  end

  プロジェクト管理者 -->|"project ID・開始承認"| project開始
  project開始 -->|"作成条件"| projectDevelop作成
  main -->|"確認済み基準commit"| projectDevelop作成
  projectDevelop作成 -->|"project統合ブランチ・基準commit"| projectDevelop

  実行計画記録 -->|"実行可能タスク・依存"| 並行実行可能
  projectDevelop -->|"project成果物・統合状態"| 並行実行可能
  並行実行可能 -->|"並行起動条件"| 並行実行割当
  プロジェクト管理者 -->|"対象project・統合順序"| 並行実行割当
  並行実行割当 -->|"feature割当"| featureWorktree作成
  並行実行割当 -->|"exec割当"| execWorktree作成
  projectDevelop -->|"featureベースcommit"| featureWorktree作成
  projectDevelop -->|"execベースcommit"| execWorktree作成
  実行計画記録 -->|"plan・claim・実行条件"| execWorktree作成
  featureWorktree作成 -->|"feature branch・worktree"| featureWorktree
  execWorktree作成 -->|"exec branch・worktree・checkpoint"| execWorktree

  featureWorktree -->|"目的別仕様・作業対象"| 分離作業
  execWorktree -->|"plan・対象成果物"| 分離作業
  作業担当 -->|"分離された作業結果"| 分離作業
  分離作業 -->|"タスク内部の編集・検証要求"| タスク実行
  タスク実行 -->|"更新成果物・検証結果・result"| 分離作業
  分離作業 -->|"feature変更・検証結果"| featureWorktree
  分離作業 -->|"exec変更・task result"| execWorktree
  分離作業 -->|"検証済み変更"| 分離結果Commit
  分離結果Commit -->|"feature commit"| featureWorktree
  分離結果Commit -->|"exec commit・task result"| execWorktree
  分離結果Commit -->|"commit・検証証跡"| GitPR履歴

  projectDevelop -->|"対象projectの最新commit"| worktreeベース同期
  featureWorktree -->|"feature commit"| worktreeベース同期
  execWorktree -->|"exec commit"| worktreeベース同期
  worktreeベース同期 -->|"同期済みfeature"| featureWorktree
  worktreeベース同期 -->|"同期済みexec"| execWorktree
  worktreeベース同期 -->|"同期・再検証結果"| featureExec統合
  featureWorktree -->|"統合対象feature commit"| featureExec統合
  execWorktree -->|"統合対象exec commit・result"| featureExec統合
  featureExec統合 -->|"project成果物・統合commit"| projectDevelop
  featureExec統合 -->|"統合状態"| 実行計画記録
  featureExec統合 -->|"merge証跡"| GitPR履歴
  featureExec統合 -->|"統合済み作業領域"| worktreeBranch後片付け
  worktreeBranch後片付け -->|"削除・保持結果"| 実行計画記録

  main -->|"共有変更commit"| main更新
  main更新 -->|"project同期条件"| main共有変更同期
  projectDevelop -->|"project履歴・影響範囲"| main共有変更同期
  main共有変更同期 -->|"main取込済みproject状態"| projectDevelop
  main共有変更同期 -->|"worktree再同期要求"| 実行計画記録

  プロジェクト管理者 -->|"受入・昇格判断"| project受入
  projectDevelop -->|"検証済みproject変更"| project受入
  project受入 -->|"昇格条件"| projectDevelop昇格
  projectDevelop昇格 -->|"承認済みproject変更"| main
  projectDevelop昇格 -->|"PR・merge証跡"| GitPR履歴
  projectDevelop昇格 -->|"共通成果物の再生成要求"| 派生生成
  実行計画記録 -->|"運用条件の変更要求"| 構成変更
```

凡例: 角丸長方形は一つのプロセス、六角形は起点イベント、円柱は正本または継続的な保管先、四角は外部主体、`-->` は情報の流れを表す。`P-04`、`P-07`、`P-08` は委譲先の代表ノードであり、内部処理は本図の対象外とする。本図は現物の流れを扱わない。

## 4. 主要例外と領域外への委譲

### 4.1. 主要例外

| 例外 ID | 対象プロセス                    | 検出条件                                                                                                                                                                                            | 本領域での扱い                                                                                                                                                                                                 | 継続・再開条件                                                                                                                            |
| ------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `E-01`  | `P-06-01`、`P-06-03`、`P-06-04` | project ID・task ID から導出した branch または worktree パスが既存の別対象と衝突する、登録済み worktree の branch が期待値と異なる、またはベースが対象 project `develop` でない                     | 新しい作業を開始せず、既存 branch / worktree の所属、ベース commit、保持理由を確認する。別 project や誤ったベースの変更をそのまま再利用・統合しない                                                            | 対象 project、branch、worktree、ベース commit が一意に対応し、既存作業を再利用するか別名で準備するかを担当者が確定する                    |
| `E-02`  | `P-06-05`、`P-06-07`、`P-06-08` | 文書 ID、登録項目 ID、または task ID が統合対象と重複し、検証・派生生成・merge の採否を確定できない                                                                                                 | 競合する ID を含む当該 worktree の同期・統合を停止し、worktree と commit を保持する。ID の正本を担う領域で競合対象と参照元を特定し、一括再採番または所属修正を行う。他の独立単位は影響範囲を確認して継続できる | 重複 ID、ファイル名、文書 ID、wikilink、plan / result の参照が整合し、対象範囲の検証と必要な派生生成が成功する                            |
| `E-03`  | `P-06-07`、`P-06-09`            | worktree に未commit変更がある、同期元を一意に決められない、依存取得・同期処理が失敗する、またはベース取込時に競合する                                                                               | 同期を停止し、未commit変更、現在のベース、取込対象 commit、競合ファイルを保持する。変更を破棄せず、必要なら先に対象変更を検証・commitし、対象 project `develop` を明示して競合を解消する                       | worktree が clean になり、同期元と取込対象が確定し、同期後の検証が成功する                                                                |
| `E-04`  | `P-06-08`                       | feature / exec と project `develop` が同じ箇所を変更する、統合先が対象 project `develop` でない、root の未commit変更と統合対象パスが重複する、または task worktree にcommit対象の未commit変更が残る | merge を完了扱いにせず停止する。Git が保持した競合状態、未統合 commit、worktree、task result を残し、統合先と統合順序を再確認する。競合解消または merge 中止は人間が差分を確認して選ぶ                         | 正しい project `develop` 上で競合と重複変更が解消され、task の成果物・result に取りこぼしがなく、必要な検証後に merge commit を確定できる |
| `E-05`  | `P-06-06`、`P-06-11`            | 成果物、対象 task result、未統合 commit、commit 許可範囲外の変更、または未commit変更が worktree に残る                                                                                              | commit 対象を確定できない場合は統合へ進めず、統合・記録完了を確認できない場合は worktree と branch を削除しない。強制削除を通常の復旧手段にしない                                                              | 許可された成果物と result が commit・統合され、除外変更の扱いと task 状態が確定し、未退避変更・未統合 commit がない                       |
| `E-06`  | `P-06-02`、`P-06-08`、`P-06-10` | 複数 project が同じ共通成果物を並行変更する、project 間依存の先行 commit が `main` に未統合である、または統合順序が未定である                                                                       | 共通変更を各 project の正本として独立確定せず、影響する統合・昇格を停止する。担当、先行 project、統合順序、後続 project への同期条件を登録簿または同等の管理記録へ残す                                         | 先行する共通変更がレビュー・検証を経て `main` へ統合され、後続 project がその `main` を取り込んで再検証できる                             |

### 4.2. 領域外への委譲

| 委譲先            | 委譲する事項                                                       | 引き渡す情報                                                               | 本領域へ戻す条件                                                       |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `P-02 登録簿運用` | ID 競合、共通成果物の統合順序、例外運用、判断要求の継続管理        | 競合対象、影響 project、保持した branch / worktree、選択肢、担当、再開条件 | ID・統合順序・例外方針が確定し、分離・同期・統合を再開するとき         |
| `P-03 計画展開`   | project とタスクの依存、優先度、実行可能性の再計画                 | 統合済み・block 中のタスク状態、共通変更の依存、再実行要求                 | 独立して実行可能な単位と統合順序が更新されたとき                       |
| `P-04 タスク実行` | worktree 内での成果物編集、検証、result 記録、判断依頼             | plan、対象成果物、仕様、担当、分離された worktree、完了条件                | 更新成果物、検証結果、result、未commit差分を分離結果として受け取るとき |
| `P-07 構成変更`   | agent、provider、並列数、worktree ベースなど運用条件の承認済み変更 | 現行条件、失敗記録、影響 project・タスク、変更要求・承認結果               | 更新した運用条件で新しい実行割当または worktree を準備するとき         |
| `P-08 派生生成`   | 同期・統合後の索引、ビュー、生成成果物の再生成                     | 更新された成果物、実行記録、対象 project、生成条件                         | 生成失敗が統合結果の受入を妨げる、または ID 競合を検出したとき         |

### 4.3. 受入確認

| 確認者     | 確認対象                 | 受入条件                                                                                                                                                                                                      |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BA         | 利用場面・担当・全体経路 | project `develop`、feature、exec の作成、分離作業、同期、project への統合、`main` への昇格、後片付けについて、起動条件と担当を一覧と図から説明できる                                                          |
| ARC        | 正本・commit・統合方向   | `main`、project `develop`、feature / exec worktree、Schedule・実行計画・実行記録が読み書きする成果物・result・event と、`main → project develop → feature / exec → project develop → main` の方向を識別できる |
| QE         | 停止条件・復旧経路       | ID・branch・path 競合、同期失敗、merge 競合、統合先誤り、未commit変更、共通成果物の競合について、停止範囲、保持する情報、再開条件を確認できる                                                                 |
| PM・承認者 | 分離・統合・削除判断     | 独立実行の条件、共通成果物の統合順序、project 昇格の承認条件、worktree / branch を削除せず保持する条件を判断できる                                                                                            |
