---
specdojo:
  id: prj-0001:pjr-tpy9-register-git-github
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T21:33:06Z"
  due_on: "2026-09-30"
---

# PJR-TPY9 Register履歴とGitコミット履歴の分離・GitHub連携対応

## 1. 概要

Registerの状態遷移を追記型eventとして記録し、選択可能なcommit policyとGitHub Issues/Projects連携アダプターを設計する。Git、Register、GitHubのSSOT境界と同期方式を明確化する。

現行のRegisterは、一項目一ファイルの個票を正本とし、Gitコミット履歴から`register history`を再構成する。これはローカルファースト、外部サービス非依存、成果物と管理情報の同一revisionでのレビューという利点を持つ一方、担当・期限・状態の変更もコミットとなるため、プロダクト変更を追うGit履歴の信号対雑音比を下げる可能性がある。また、squashやコミット集約で履歴を簡潔にすると、現在の`register history`が必要とする状態遷移の粒度を失う。

Gitを正本の保存・配布・レビュー基盤として利用できる特性は維持しながら、Registerの業務イベントをGitコミットの粒度から分離する。あわせて、GitHub Issues/Projectsを任意の共同作業UIとして利用できる連携境界を設け、Gitのみで完結する運用とGitHubを利用する運用の双方を選択可能にする。

今回の外部ツール連携の実装・検証対象はGitHub Issues/Projectsに限定する。将来はGitLab、Jira、Azure DevOpsなどのプロジェクト管理ツールへ対応できるよう、Register本体、外部連携の共通契約、GitHub固有処理の境界を分離する。ただし、GitHub以外のアダプターの実装・接続試験・運用文書作成は本項目の対象外とし、必要になった時点で別のPJRとして起票する。

## 2. 完了条件

- Register個票、追記型event、Gitコミット、GitHub Issues/Projectsの責務とSSOT境界が設計文書で定義されている。
- `register add`、状態遷移、更新、終了、再開について、actor・発生日時・遷移前後の状態・理由を保持できる追記型event形式と検証規則が定義されている。
- `register history`がGitコミットの粒度だけに依存せず、Register eventから項目の変更履歴を再構成できる。
- `per-event`、`per-item`、`batch`、`related-change`、`manual`などの候補を評価し、採用するcommit policy、既定値、設定方法、Agent・routine・worktree実行時の扱いが確定している。
- GitHub連携について、`none`、一方向publish/import、参照のみのlinkedなどの候補を評価し、サポートする方式、正本側、ID対応、同期失敗、競合、認証情報の境界が定義されている。
- 外部ツール連携の共通契約とGitHub固有処理が分離され、将来アダプターを追加するときにRegister本体の状態遷移・履歴モデルを変更しなくてよい境界になっている。
- GitLab、Jira、Azure DevOpsなどGitHub以外のアダプターは本項目の実装・検証対象外であり、未実装でも本項目を完了できることが設計・運用文書に明記されている。
- 完全な双方向同期を採用する場合は競合解決規則が定義され、採用しない場合は非対応範囲が明記されている。
- 既存個票およびGit履歴を利用するプロジェクトの後方互換性と、必要な移行・ロールバック手順が用意されている。
- 採用範囲のCLI、schema、テスト、コマンドリファレンス、Register運用ガイド、関連設計書が実装と一致している。
- Gitのみの構成とGitHub連携構成の双方で、起票、状態遷移、履歴再構成、失敗時の再実行を検証できる。

## 3. 作業内容

| No  | 作業                                                                                       | 担当 | 状態 | メモ                                                       |
| --- | ------------------------------------------------------------------------------------------ | ---- | ---- | ---------------------------------------------------------- |
| 1   | 現行の個票SSOT、Git履歴依存、commit・PR・worktree運用の利点と問題を整理する                | ARC  | open | `register history`とsquash・コミット集約の関係を含む       |
| 2   | Register eventのデータモデル、状態再構成、検証、冪等性、障害復旧を設計する                 | ARC  | open | Exec eventとの共通化可能性も評価する                       |
| 3   | commit policyの選択肢、既定値、設定schema、各実行経路への適用規則を設計する                | ARC  | open | 人手、Agent、routine、worktreeを対象とする                 |
| 4   | 外部連携の共通契約とGitHub Issues/Projectsアダプターの責務、同期、競合・認証境界を設計する | ARC  | open | 他ツールを差し替え可能にするが、今回の実装対象はGitHubのみ |
| 5   | 採用したRegister event、履歴再構成、commit policy、GitHub連携の範囲を実装する              | ARC  | open | GitHub以外のアダプター実装は別PJRで扱う                    |
| 6   | 既存プロジェクトの互換性・移行手順を実装し、単体・統合テストで検証する                     | ARC  | open | 既存Git履歴からの移行とロールバックを含む                  |
| 7   | CLIリファレンス、Register運用ガイド、rulebook、関連システム設計を更新する                  | ARC  | open | 利用者がbackendとcommit policyを選択できるようにする       |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:pjr-rulebook]]
- [[specdojo:command-reference]]
- [[prj-0001:cdfd-register-lifecycle]]
- [[prj-0001:cdfd-reporting]]
