---
specdojo:
  id: specdojo:branch-workflow-guide
  type: guide
  status: ready
  based_on:
    - specdojo:git-branching-standard
---

# ブランチワークフローガイド

Branch Workflow Guide

[Git ブランチ運用標準](../standards/git-branching-standard.md) に従い、project `develop`、feature、exec worktree を作成・同期・統合・終了する手順を説明します。対象読者は、複数の `prj-xxxx` と Git worktree を同じリポジトリで運用する開発者・運用者です。

**対象読者**

- project、feature、exec の各ブランチと Git worktree を運用する開発者、実行管理者

**この文書で分かること**

- 標準ブランチ構成、project `develop` の準備、feature・exec の開始から統合・終了までの手順

**次に読む文書**

- exec の実行経路は [exec運用ガイド](exec-operation-guide.md)、worktree の分割操作は [exec worktree運用ガイド](exec-worktree-guide.md) を参照してください。

## 1. 前提と全体像

作業を始める前に、対象 project ID、現在ブランチ、作業ツリーの状態を確認します。

```bash
git branch --show-current
git status --short
```

標準の変更経路は次のとおりです。

```text
main
└─ project/prj-0001/develop
   ├─ feature/prj-0001/<topic>
   └─ exec/prj-0001-<task-id>
```

| ブランチ                   | 主な用途                      | 主な操作主体     |
| -------------------------- | ----------------------------- | ---------------- |
| `main`                     | 安定した共有状態              | リポジトリ管理者 |
| `project/prj-0001/develop` | prj-0001 の変更統合と検証     | プロジェクト     |
| `feature/prj-0001/<topic>` | 人が行う目的別の変更          | 開発者           |
| `exec/prj-0001-<task-id>`  | task 単位の隔離された自動変更 | SpecDojo CLI     |

以降の例では project ID に `prj-0001` を使用します。

## 2. project developを準備する

新しい project の統合ブランチを作る場合は、更新済みの `main` を起点にします。

```bash
git switch main
git pull --ff-only origin main
git switch -c project/prj-0001/develop
git push -u origin project/prj-0001/develop
```

既存の project `develop` で作業を再開する場合は、ブランチと同期状態を確認します。

```bash
git switch project/prj-0001/develop
git status --short
git fetch origin
git merge origin/main
```

共有中の project `develop` では rebase せず、`main` を merge して履歴を維持します。リモートを使用しない環境では、取得済みのローカル `main` を merge 対象にします。

## 3. featureブランチで作業する

### 3.1. 通常の作業ツリーで開始する

対象 project の `develop` を起点に、project ID を含む feature を作成します。

```bash
git switch project/prj-0001/develop
git status --short
git switch -c feature/prj-0001/branch-policy
```

作業・検証・commitを終えたら、project `develop` へ統合します。共有リポジトリでは Pull Request を使い、ローカル統合する場合も統合前に差分と検証結果を確認します。

```bash
git switch project/prj-0001/develop
git merge --no-ff feature/prj-0001/branch-policy
git branch -d feature/prj-0001/branch-policy
```

### 3.2. feature用worktreeを作る

main worktree を project `develop` に置いたまま並行作業する場合は、feature 専用 worktree を作成できます。

```bash
git worktree add \
  ../worktrees/prj-0001-branch-policy \
  -b feature/prj-0001/branch-policy \
  project/prj-0001/develop
```

worktree 内でベースの最新変更を確認・取り込みするときは、project `develop` を明示します。

```bash
npm run worktree:sync -- --base project/prj-0001/develop --dry-run
npm run worktree:sync -- --base project/prj-0001/develop
```

統合後に worktree と branch を片付けます。

```bash
git worktree remove ../worktrees/prj-0001-branch-policy
git branch -d feature/prj-0001/branch-policy
```

## 4. SpecDojo execを実行する

SpecDojo exec は task ID から `exec/<project-id>-<task-id>` を作成します。作成元と統合先を一致させるため、実行前に main worktree を対象 project の `develop` に切り替えます。

```bash
git switch project/prj-0001/develop
git branch --show-current
git status --short
```

自動実行では、SpecDojo が worktree の準備、agent 実行、commit、現在ブランチへの統合、状態更新を行います。

```bash
specdojo exec run \
  --project prj-0001 \
  --task <task-id> \
  --worktree
```

段階ごとに確認する場合は [exec worktree運用ガイド](exec-worktree-guide.md) の分割手順を使います。特に `worktree merge` の直前には、root worktree が対象 project の `develop` であることを再確認します。

```bash
git branch --show-current
specdojo exec worktree merge \
  --project prj-0001 \
  --task <task-id>
```

## 5. mainの更新を取り込む

project の作業期間中は、`main` の更新を project `develop` へ定期的に取り込みます。

```bash
git fetch origin
git switch project/prj-0001/develop
git status --short
git merge origin/main
```

取り込み後は、変更対象に必要な test、build、schema 検証を実行します。生成物を持つ構成では、必要に応じて再生成も行います。

feature または exec worktree 側へ project `develop` の更新を取り込む場合は、worktree 内でベースを明示します。

```bash
npm run worktree:sync -- --base project/prj-0001/develop
```

## 6. project developをmainへ統合する

project の変更が受入可能になったら、次の順序で `main` への統合を準備します。

1. project `develop` に未統合の feature / exec がないか確認します。
2. 最新の `main` を project `develop` へ mergeします。
3. project 全体に必要な test、build、schema 検証を実行します。
4. project register、exec result、未解決事項を確認します。
5. project `develop` から `main` への Pull Request を作成します。
6. レビューとCIが成功した後に統合します。

確認例:

```bash
git log --oneline main..project/prj-0001/develop
git diff --stat main...project/prj-0001/develop
git branch --no-merged project/prj-0001/develop
```

project 完了後に `develop` を削除する場合は、`main` への統合と未退避作業がないことを確認してから行います。

## 7. 承認方式を使い分ける

登録項目の承認は、既定で commit（register の状態遷移とチケット個票の承認節）で残し、PR 承認は強制する 3 ケースに限定します。判定条件は [Git ブランチ運用標準](../standards/git-branching-standard.md) の `承認ゲートと PR 強制条件`、type 別の承認フローは [登録簿運用ガイド](register-operation-guide.md) の `承認フローと承認者` を参照します。

commit ベースで承認する場合（`decision` / `risk` / `question` / `issue` / `todo` の通常運用）は、チケット個票の承認節と register の状態遷移で承認事実を残します。

```bash
specdojo register close \
  --project prj-0001 \
  --id PJR-0005 \
  --conclusion "回答者・回答日を承認節に記入し decided へ遷移"
```

PR 承認を強制する 3 ケース（`develop → main` 昇格 / `change-request` 承認 / 不可逆・高リスク・framework schema 破壊的変更）では、承認対象の差分を Pull Request として作成し、承認者が approve します。作成者自身の承認は職務分離のためカウントしません。

```bash
git switch project/prj-0001/develop
git switch -c feature/prj-0001/schema-change
# 変更を commit した後に PR を作成する
gh pr create --base project/prj-0001/develop --title "PJR-XXXX schema 破壊的変更" --body "対象個票: prj-0001:pjr-xxxx-topic"
```

merge 後は、承認者・承認日・承認対象・証跡（PR URL・merge SHA）をチケット個票の承認節へ書き戻します。`main` と `project/<project-id>/develop` の承認者は `CODEOWNERS` と branch protection で強制します。

## 8. 複数projectを並行する

`worktree:sync` は既定で main worktree が checkout しているブランチをベースにします。複数 project の worktree が同時に存在する場合は、対象 project の `develop` を毎回明示します。

```bash
npm run worktree:sync -- --base project/prj-0001/develop
```

| 状況                                      | 対応                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| main worktree が対象 project の `develop` | 自動判定を利用できるが、実行前に現在ブランチを確認する |
| main worktree が別 project の `develop`   | `--base project/<project-id>/develop` を指定する       |
| 定型コマンドや自動実行から同期する        | `SPECDOJO_WORKTREE_BASE_BRANCH` でベースを固定する     |
| 複数 project が同じ共通ファイルを変更する | 統合順序を決め、共通変更を `main` 経由で同期する       |

環境変数で固定する例:

```bash
export SPECDOJO_WORKTREE_BASE_BRANCH=project/prj-0001/develop
npm run worktree:sync
```

## 9. 既存featureブランチを移行する

未公開または単独作業中の `feature/<topic>` は、project ID を含む名前へ変更できます。

```bash
git branch -m \
  feature/branch-policy \
  feature/prj-0001/branch-policy
```

現在 checkout 中の branch を変更する場合:

```bash
git branch -m feature/prj-0001/branch-policy
```

リモート公開済みの場合は、新しい名前を公開して追跡先を設定した後、利用者と Pull Request への影響を確認して旧名を削除します。

```bash
git push -u origin feature/prj-0001/branch-policy
git push origin --delete feature/branch-policy
```

レビュー中または共同作業中の branch は無理に改名せず、完了後に新しい命名へ切り替える方が安全です。

## 10. 作業前後のチェックリスト

| 時点                 | 確認内容                                                             |
| -------------------- | -------------------------------------------------------------------- |
| 分岐前               | 対象 project ID、現在ブランチ、未commit変更、分岐元の同期状態        |
| worktree作成後       | branch 名、worktree パス、ベース commit                              |
| 同期前               | worktree が clean であること、取り込み元 branch                      |
| feature / exec統合前 | 統合先が対象 project の `develop` であること、検証結果、未commit変更 |
| main統合前           | 最新 `main` の取り込み、project全体の検証、レビュー対象、未解決事項  |
| 削除前               | 統合済みであること、未退避のcommit・変更・resultがないこと           |

誤ったブランチから作業を始めた場合は、そのまま統合せず、現在の commit と正しいベースとの差分を確認します。修正方法を決められない場合は branch と worktree を保持し、変更を失う操作を行わずにレビューを依頼します。
