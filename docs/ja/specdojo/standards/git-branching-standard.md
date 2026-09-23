---
specdojo:
  id: specdojo:git-branching-standard
  type: standard
  status: draft
---

# Git ブランチ運用標準

Git Branching Standard

SpecDojo Unit を管理するリポジトリで、プロジェクト単位の変更と task 単位の自動実行を安全に統合するためのブランチ構成、命名、統合方向、保護条件を定義します。具体的な操作は [branch-workflow-guide.md](../guides/branch-workflow-guide.md) を参照してください。

## 1. 目的・適用範囲

- 一つのリポジトリで `prj-xxxx` 単位のプロジェクトを管理し、プロジェクトごとに feature 作業または SpecDojo exec を実行する場合に適用します。
- `main`、プロジェクト統合ブランチ、feature ブランチ、exec ブランチの責務と統合方向を規定します。
- Git worktree を使わない作業にも命名と統合方向を適用し、worktree を使う場合はベースブランチの解決条件を追加で適用します。

## 2. 基本方針

- `main` はリポジトリ全体で共有する安定した統合点とし、プロジェクト進行中の未統合変更を直接蓄積しません。
- 各プロジェクトは `project/<project-id>/develop` を中核の統合ブランチとし、そのプロジェクトの feature と exec の分岐元・統合先を一つにします。
- 人が管理する feature、SpecDojo が管理する exec、対話型 agent の常設 worktree を名前空間とライフサイクルで分離します。
- 統合方向を固定し、task ブランチから `main` へ直接変更が流入する経路を作りません。

## 3. ブランチの種類と命名

| 種類             | 命名パターン                   | 必須 | 分岐元                     | 統合先                     | 管理主体         |
| ---------------- | ------------------------------ | ---- | -------------------------- | -------------------------- | ---------------- |
| 安定統合         | `main`                         | ○    | -                          | -                          | リポジトリ管理者 |
| プロジェクト統合 | `project/<project-id>/develop` | ○    | `main`                     | `main`                     | プロジェクト     |
| feature          | `feature/<project-id>/<topic>` | ○    | 対象 project の `develop`  | 対象 project の `develop`  | 人               |
| exec             | `exec/<project-id>-<task-id>`  | ○    | 実行時の project `develop` | 実行時の project `develop` | SpecDojo CLI     |

- `<project-id>` は対象プロジェクトの ID と一致させます。
- `<topic>` は英小文字、数字、ハイフンを使い、変更の目的を識別できる名前にします。
- `<task-id>` は対象 schedule task の ID から機械的に導出します。
- 既存の `feature/<topic>` は進行中の作業が完了するまで使用できます。新規作成する feature には project ID を含めます。

### 3.1. 対話型 agent の常設 worktree

対話型オーケストレーターを隔離して起動する常設 worktree は、ブランチを `worktree/<name>`、配置を `../worktrees/<name>` とします。`<name>` は `claude-work`、`codex-work`、`copilot-work`、`qwen-work`、`gemma-work` のいずれかです。

- `worktree/` は常設の agent 作業ブランチを表す名前空間です。task ごとに作成・削除する `exec/` と区別し、`git branch --list "worktree/*"` で一括列挙できるようにします。
- 起動スクリプトは、既存 worktree の実際のブランチが `worktree/<name>` と一致することを確認します。不一致の場合は agent を起動せず、先に未コミット変更と独自 commit を確認して移行します。
- Claude Code の `--worktree` は、ブランチを `worktree-<name>`、配置を `.claude/worktrees/<name>` に固定して他の agent と揃えられないため使用しません。全 agent で `git worktree add` を使用します。

## 4. 分岐・統合の規範

標準の変更経路は次のとおりです。

```text
main
└─ project/<project-id>/develop
   ├─ feature/<project-id>/<topic>
   └─ exec/<project-id>-<task-id>
```

| 操作                                     | 判定基準                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| project `develop` の作成                 | `main` の確認済み commit から分岐している                                 |
| feature / exec の作成                    | 対象 project の `develop` の commit から分岐している                      |
| feature / exec の統合                    | 対象 project の `develop` に統合し、別 project や `main` へ直接統合しない |
| project `develop` の `main` への統合     | 必要な検証とレビューが成功し、変更範囲と未解決事項を確認している          |
| `main` の project `develop` への取り込み | 共有中の `develop` の履歴を書き換えず、merge で取り込んでいる             |

- `exec worktree merge` は実行した現在ブランチを統合先とするため、実行前に対象 project の `develop` であることを確認します。
- feature または exec の統合後も project の完了判断までは `develop` を保持します。
- project `develop` から `main` への統合は Pull Request または同等のレビュー可能な変更単位で行います。

### 4.1. developへ入る3層の変更経路

project `develop` へ入る変更は、変更の作成主体と事前レビューの要否により次の3層へ分けます。

| 層  | 変更の種類                                                    | 作業ブランチ                   | `develop` への統合方法                                      |
| --- | ------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| 1   | SpecDojo exec が task 単位で自動実行する変更                  | `exec/<project-id>-<task-id>`  | 統合専用 actor が `--no-ff` で merge し、保護を bypass する |
| 2   | 人または対話型 agent が内容を書いた実装、設定、規範・設計文書 | `feature/<project-id>/<topic>` | Pull Request で差分の承認を得てから merge する              |
| 3   | register の起票・close・状態遷移と、それに伴う生成物の再構築  | project `develop`              | 統合専用 actor による直接 commit を許容する                 |

層2と層3の境界は、変更内容に事前レビューの価値があるかで判断します。実装、設定、本文、判断内容のようにレビューで誤りを発見できる変更は、コマンドで生成・記録した場合でも層2です。層3は、既に決まった実行事実を register へ記帳するだけで、内容の判断を伴わない変更に限定します。記帳と内容変更が同じ作業に含まれる場合は、全体を層2として扱います。

層3を例外にできるのは、register ID が連番ではなく乱数で採番され、index と view の生成物が `.gitignore` で Git 管理対象外になっており、Git 管理する実体が項目単位の個票と event に分かれているためです。これらの前提が成立しない register や、同じ正本ファイルを複数人が更新する記帳には例外を適用せず、層2として扱います。

exec に流す `todo` の個票と実行に必要な記帳は、実行前に project `develop` へ統合済みでなければなりません。`exec run --worktree` は project `develop` の commit を起点に worktree を作るため、feature にだけ存在する `todo` は実行対象にしません。

### 4.2. 運用規模ごとの必須条件

3層の分類、feature と exec の分岐元・統合先、および exec 対象を事前に `develop` へ入れる制約は、運用規模にかかわらず適用します。運用基盤に関する条件は次のように区別します。

| 条件                                                | 単独運用                                                                                        | 複数人・複数 actor 運用                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 層2の統合レビュー                                   | リモートを共有しない場合は、ローカルの差分確認と `--no-ff` merge を Pull Request の代替にできる | Pull Request を必須とし、作成者以外が参加できるレビュー単位を `develop` へ入る前に作る         |
| project `develop` の branch protection              | 省略できる                                                                                      | 必須。人の直接 push、force-push、削除を禁止する                                                |
| 統合専用 actor                                      | 作業者と分離できない場合は省略できる                                                            | 必須。exec の merge と層3の直接 commit だけに bypass を許可し、人の層2変更には使わない         |
| feature を切る前の project `develop` のリモート反映 | リモートや Pull Request を使わない場合は省略できる                                              | 必須。ローカル先端を push し、リモートの `develop` と一致することを確認してから feature を切る |

単独運用から複数人・複数 actor 運用へ移る前に、統合専用 actor と branch protection を準備します。準備できない猶予期間は単独運用の条件を複数人運用へ流用せず、対象、理由、期間、復帰条件を project register に記録します。

### 4.3. developからmainへの昇格方式

project `develop` から `main` への昇格は、`develop` の先端を第2 parent とする merge commit を必ず作ります。ローカルで再現する場合は `git merge --no-ff`、Pull Request では merge commit を作る方式を選びます。squash merge と rebase merge は使用しません。

この方式で「まとめる」対象は物理的な commit 数ではなく、`main` の first-parent 履歴です。`develop` の細かな commit は監査と `register history` のために DAG へ保持し、プロダクト変更を追うときは次の表示を正規の履歴とします。

```bash
git log --first-parent --oneline main
```

昇格 merge commit の subject は昇格した変更範囲を要約し、Pull Request から検証結果、承認、未解決事項を追跡できるようにします。通常の `git log` では `develop` の詳細 commit も表示されます。first-parent 表示で1昇格を1行に集約しながら、次の性質を維持することが採用理由です。

- 昇格済みの `develop` commit がすべて `main` の祖先となり、次回の昇格で再び未マージ扱いになりません。
- `main` の更新を共有中の `develop` へ通常の merge で取り込めます。fast-forward できる場合も履歴を書き換えません。
- push 済み commit の ID と到達可能性を保ち、Git 履歴へフォールバックする監査情報を失いません。

昇格後は、昇格対象だった `develop` の先端が `main` の祖先であることを `git merge-base --is-ancestor` で確認します。squash merge、一時ブランチでの rebase / cherry-pick、特定 commit の除外は元の `develop` との祖先関係を記録しないため、昇格の集約方式として使用しません。

#### 適用範囲（本方式が有効になる時点）

本方式は、**本規約の適用後に行う昇格から有効になります**。それ以前に作られた `main` の first-parent 履歴は集約されません。

`develop` を第2 parent とする merge commit を `main` 上で作らず、`main` 上へ取り込む merge を `develop` 側で実行して `main` を fast-forward した場合、`main` の first-parent 系列は `develop` の詳細 commit を辿ります。過去にこの形で昇格した区間では、`git log --first-parent main` に exec / register の遷移 commit がそのまま現れます。

既存の first-parent 系列を集約するには push 済み履歴の書き換えが必要であり、本規約は書き換えを禁止します。したがって過去区間はそのまま残します。読み手は、集約された first-parent 表示が得られるのは本規約適用後の区間である、と理解して利用します。

昇格を行う担当者は、merge の向きが逆にならないよう次を確認します。`main` を checkout した状態で `develop` を merge する、または Pull Request の base を `main`、head を `develop` として merge commit を作る方式を選びます。

## 5. 同期・履歴・保護

- `main` と共有中の project `develop` では force-push と履歴を書き換える rebase を禁止します。
- 公開済みで他の作業者が参照する feature では、合意なく force-push または rebase を行いません。
- `main` の更新は project `develop` へ定期的に mergeし、長期間の乖離を避けます。
- feature worktree は対象 project の `develop` を明示的なベースとして同期します。
- 複数プロジェクトを並行する場合、main worktree の現在ブランチによるベース自動判定だけに依存せず、対象 project の `develop` を指定します。
- `main` には branch protection を設定し、直接 push を禁止し、Pull Request と最低 1 名の承認、必須 CI の成功を merge 条件にします。
- GitHub のリポジトリ設定では merge commit だけを許可し、squash merge と rebase merge を無効にします。これは Pull Request 画面で誤った昇格方式を選べないようにするサーバ側の設定です。
- 複数人・複数 actor 運用の `project/<project-id>/develop` には branch protection を設定します。人または対話型 agent が内容を書いた feature は Pull Request を必須とし、exec の merge と register の記帳だけは統合専用 actor による bypass を許可します（承認ゲートの適用範囲は `承認ゲートと PR 強制条件` を参照）。
- 承認者は `CODEOWNERS` で宣言し、branch protection の "Require review from Code Owners" で強制します。`main` はリポジトリ管理者、各 project の承認対象は当該 project の承認権限者（PO / CCB）を owner に割り当てます。

### 5.1. mainへの直接pushを防ぐ防護柵

Lefthook の `pre-push` は、Git が標準入力へ渡す各更新の remote ref を検査し、リモート名にかかわらず `refs/heads/main` への更新を拒否します。`project/<project-id>/develop`、feature、exec など他の remote ref への push は妨げません。拒否時は base を `main`、head を project `develop` とする Pull Request を作り、merge commit で昇格するよう案内します。

このフックはローカルの誤操作を早期に止める防護柵であり、アクセス制御の境界ではありません。`--no-verify` で迂回でき、Lefthook を導入していない環境では実行されません。実際の境界は GitHub の branch protection であり、`main` への Pull Request、承認、必須 CI をサーバ側で強制します。

実際に push せず判定を確認するには、Git の `pre-push` 入力と同じ4フィールドをスクリプトへ渡します。最初のコマンドは終了コード1で拒否メッセージを表示し、2つ目は終了コード0になります。

```bash
printf '%s\n' 'refs/heads/local LOCAL refs/heads/main REMOTE' \
  | node tools/protect-main-push.mjs
printf '%s\n' 'refs/heads/local LOCAL refs/heads/project/prj-0001/develop REMOTE' \
  | node tools/protect-main-push.mjs
```

## 6. ブランチの完了・削除

| ブランチ          | 削除できる条件                                                        | 保持する条件                                   |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| feature           | 変更が project `develop` に統合され、未退避の作業がない               | レビュー中、競合解消中、未統合 commit がある   |
| exec              | SpecDojo の結果が project `develop` に統合され、task の記録が完了した | block 中、再実行予定、未commit変更が残っている |
| project `develop` | project の変更が `main` に統合され、追加対応と監査上の保持理由がない  | project が進行中、リリース後対応が残っている   |

- worktree に関連付いたブランチは、先に worktree の状態と未commit変更を確認してから削除します。
- exec ブランチは原則として SpecDojo CLI の安全確認付き削除を使用します。
- 統合確認のためにブランチを恒久保存せず、必要な履歴は commit、Pull Request、exec result、event に残します。

## 7. 複数プロジェクトと共通基盤

- project 固有の変更と、`src/**`、共通 template、共通 schema など複数 project に影響する変更を区別します。
- 共通基盤の変更を複数の project `develop` で独立に長期間保持しません。共通変更の統合順序を決め、`main` を経由して各 project `develop` へ同期します。
- 同一ファイルを複数 project が並行変更する場合は、統合順序、依存関係、担当を project register または同等の管理記録に残します。
- project 間の依存が解消されるまで、依存先の未統合 commit を別 project の正本として扱いません。

## 8. 承認ゲートと PR 強制条件

変更の承認は既定で commit（register 状態遷移＋チケットの承認節）で残し、人による強制ゲート（PR 承認）は次の 3 ケースに限定します。type 別の承認フローと承認者ロールは [register-operation-guide.md](../guides/register-operation-guide.md) を正本とします。

ここでいう承認ゲートは、register 項目を承認済みとする正式な証跡です。4.1 の層2で常に行う feature Pull Request の事前レビューとは区別します。3ケース以外でも層2の変更は Pull Request でレビューしてから統合しますが、その review を register 項目の正式承認へ読み替えず、正式承認は commit とチケットの承認節に残します。

| ケース                                        | 境界                             | 承認者                   | 強制手段                                  |
| --------------------------------------------- | -------------------------------- | ------------------------ | ----------------------------------------- |
| `develop → main` 昇格                         | 変更が `main` に載る境界         | リポジトリ管理者         | `main` の branch protection ＋ CODEOWNERS |
| `change-request` の承認                       | 変更要求の実施承認               | 変更承認権限者（PO/CCB） | 承認対象差分の PR approve                 |
| 不可逆・高リスク・framework schema 破壊的変更 | `todo`/`issue`/`decision` の一部 | 当該 type の承認権限者   | 承認対象差分の PR approve                 |

- 上記以外の承認（`decision` / `risk` / `question` / `issue` / `todo` の通常運用）は commit ベースで残し、Pull Request を正式承認の証跡にすることを必須にしません。schedule 上の計画済みタスクによる成果物更新や日常の agent commit も、正式承認ゲートの対象外です。ただし、人または対話型 agent が内容を書いた層2の変更であれば、統合経路として feature Pull Request は使用します。
- PR 承認を強制しない理由は、可逆性（記録のみか実装を伴うか）、職務分離（自己承認の回避が platform 強制でなくても成立するか）、自動化整合（PR ゲートを自動 `exec → develop` の内側に置かない）の 3 点で判断します。
- 3 ケースに該当する承認は自己承認をカウントせず、作成者と承認者を分離します。承認事実（承認者・承認日・対象差分）は PR で担保し、決定内容の SSOT はチケット個票に恒久保持します。

## 9. commit メッセージ規約

- subject は `<type>(<scope>): <日本語の要約>` とし、要約を日本語で書きます。`type` は `commitlint.config.cjs` の `type-enum` に定義された値だけを使います。
- subject は 100 文字以内に収めます（`subject-max-length`）。日本語は情報密度が高いため、詳細は body へ回します。
- body には「何を変えたか」ではなく「なぜそうしたか」を日本語で書きます。判断の根拠、採らなかった選択肢、制約が該当します。1 行は 100 文字以内にします（`body-max-line-length`）。
- 関連する登録簿項目がある場合は、body の末尾に `Refs: PJR-XXXX` を記載します。個票が判断の SSOT であり、commit からの追跡経路を残すためです。
- `exec` 実行に伴う runner の自動 commit（register 状態遷移、worktree の統合など）は、既存の生成規則をそのまま用います。人が書く commit と形式を揃えるために書き換えません。

```text
fix(exec): 保護対象の判定を gitignore 済みファイルの除外へ変更

未追跡をすべて除外すると、agent が名簿へ mode を追加して settings ファイルを新規作成し、
権限プロファイルを自作できるため、ignore 済みだけを除外対象とした。

Refs: PJR-T1JW
```

## 10. 禁止事項

| 禁止事項                                                 | 理由                                               |
| -------------------------------------------------------- | -------------------------------------------------- |
| feature / exec を `main` へ直接統合する                  | project 単位の検証・レビューを迂回するため         |
| 別 project の `develop` へ統合する                       | 変更の所属と追跡先が不明になるため                 |
| `main` または共有中の `develop` を force-pushする        | 他の branch と worktree の比較起点を破壊するため   |
| `develop → main` 昇格で squash / rebase merge を使う     | `develop` の祖先関係と Git fallback 履歴を失うため |
| 統合先を確認せず `exec worktree merge` を実行する        | 現在ブランチがそのまま統合先になるため             |
| 未commit変更を確認せず worktree または branch を削除する | 成果物と result を失う可能性があるため             |
| `feature/<project-id>` という終端ブランチを作る          | 同名を親に持つ feature 階層を作成できなくなるため  |
| 自動 `exec → develop` 統合に PR 承認ゲートを課す         | 自動実行を止め、承認境界を過剰に内側へ広げるため   |
| PR 強制 3 ケースの承認を作成者が自己承認する             | 職務分離が崩れ、承認の実効性が失われるため         |

## 11. 運用・見直しルール

- ブランチ命名を変更するときは、SpecDojo の branch 導出、worktree 検索、テスト、関連 guide を同時に確認します。
- exec の分岐元または統合先の挙動を変更するときは、[exec-worktree-guide.md](../guides/exec-worktree-guide.md) と CLI 実装の整合を確認します。
- 複数プロジェクト運用で競合や誤統合が繰り返される場合は、ベースブランチの明示を自動実行設定へ昇格させます。
- 例外運用は対象、理由、期間、復帰条件を project register または同等の管理記録に残します。
