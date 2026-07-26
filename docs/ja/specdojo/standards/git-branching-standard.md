---
specdojo:
  id: git-branching-standard
  type: standard
  status: draft
---

# Git ブランチ運用標準

Git Branching Standard

SpecDojo Unit を管理するリポジトリで、プロジェクト単位の変更と task 単位の自動実行を安全に統合するためのブランチ構成、命名、統合方向、保護条件を定義します。具体的な操作は [specdojo-branch-workflow-guide.md](../guides/specdojo-branch-workflow-guide.md) を参照してください。

## 1. 目的・適用範囲

- 一つのリポジトリで `prj-xxxx` 単位のプロジェクトを管理し、プロジェクトごとに feature 作業または SpecDojo exec を実行する場合に適用します。
- `main`、プロジェクト統合ブランチ、feature ブランチ、exec ブランチの責務と統合方向を規定します。
- Git worktree を使わない作業にも命名と統合方向を適用し、worktree を使う場合はベースブランチの解決条件を追加で適用します。

## 2. 基本方針

- `main` はリポジトリ全体で共有する安定した統合点とし、プロジェクト進行中の未統合変更を直接蓄積しません。
- 各プロジェクトは `project/<project-id>/develop` を中核の統合ブランチとし、そのプロジェクトの feature と exec の分岐元・統合先を一つにします。
- 人が管理する feature と SpecDojo が管理する exec を名前空間とライフサイクルで分離します。
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

## 5. 同期・履歴・保護

- `main` と共有中の project `develop` では force-push と履歴を書き換える rebase を禁止します。
- 公開済みで他の作業者が参照する feature では、合意なく force-push または rebase を行いません。
- `main` の更新は project `develop` へ定期的に mergeし、長期間の乖離を避けます。
- feature worktree は対象 project の `develop` を明示的なベースとして同期します。
- 複数プロジェクトを並行する場合、main worktree の現在ブランチによるベース自動判定だけに依存せず、対象 project の `develop` を指定します。

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

## 8. 禁止事項

| 禁止事項                                                 | 理由                                              |
| -------------------------------------------------------- | ------------------------------------------------- |
| feature / exec を `main` へ直接統合する                  | project 単位の検証・レビューを迂回するため        |
| 別 project の `develop` へ統合する                       | 変更の所属と追跡先が不明になるため                |
| `main` または共有中の `develop` を force-pushする        | 他の branch と worktree の比較起点を破壊するため  |
| 統合先を確認せず `exec worktree merge` を実行する        | 現在ブランチがそのまま統合先になるため            |
| 未commit変更を確認せず worktree または branch を削除する | 成果物と result を失う可能性があるため            |
| `feature/<project-id>` という終端ブランチを作る          | 同名を親に持つ feature 階層を作成できなくなるため |

## 9. 運用・見直しルール

- ブランチ命名を変更するときは、SpecDojo の branch 導出、worktree 検索、テスト、関連 guide を同時に確認します。
- exec の分岐元または統合先の挙動を変更するときは、[specdojo-exec-worktree-guide.md](../guides/specdojo-exec-worktree-guide.md) と CLI 実装の整合を確認します。
- 複数プロジェクト運用で競合や誤統合が繰り返される場合は、ベースブランチの明示を自動実行設定へ昇格させます。
- 例外運用は対象、理由、期間、復帰条件を project register または同等の管理記録に残します。
