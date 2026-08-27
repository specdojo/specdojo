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

# PJR-TPY9 Register履歴をGitコミット粒度から分離する

## 1. 概要

Registerの状態遷移を追記型eventとして記録し、`register history`がGitコミットの粒度に依存しない構造にする。

現行のRegisterは、一項目一ファイルの個票を正本とし、Gitコミット履歴から`register history`を再構成する。これはローカルファースト、外部サービス非依存、成果物と管理情報の同一revisionでのレビューという利点を持つ一方、担当・期限・状態の変更もコミットとなるため、プロダクト変更を追うGit履歴の信号対雑音比を下げる可能性がある。また、squashやコミット集約で履歴を簡潔にすると、現在の`register history`が必要とする状態遷移の粒度を失う。

Gitを正本の保存・配布・レビュー基盤として利用できる特性は維持しながら、Registerの業務イベントをGitコミットの粒度から分離する。exec側には既に追記型eventが存在し（`execution/exec/events/`）、Register側にはない。この非対称を解消し、共通化できる部分は共通化する。

本項目は3段に分けた第1段であり、Register eventのデータモデルと履歴再構成に範囲を限定する。commit policyの選定は第2段（PJR-T7ZQ）、GitHub Issues/Projects連携は第3段（PJR-5W8C）で扱う。第2段と第3段はいずれも本項目の完了を前提とする。

## 2. 完了条件

- Register個票、追記型event、Gitコミットの責務とSSOT境界が設計文書で定義されている。個票を正本とする現行の位置づけを変えるか否かが明示されている。
- `register add`、状態遷移、更新、終了、再開について、actor・発生日時・遷移前後の状態・理由を保持できる追記型event形式と検証規則が定義されている。
- `register history`がGitコミットの粒度だけに依存せず、Register eventから項目の変更履歴を再構成できる。squashやコミット集約を行っても状態遷移の粒度が失われない。
- **コミットをまとめた状態で履歴が再構成できることを実際に確認する**。PJR-T7ZQ の決定により、雑音の削減は `develop → main` の昇格境界で行い、本項目の完了がその前提となる。複数の遷移を1コミットへまとめたうえで `register history` が各遷移を復元できることを検証する。
- 遷移時のコミットは維持する。`register start` は worktree 隔離の構造上の要件であり、本項目では変更しない。event の追加によってコミット数やファイル数が増えないよう、記録先と粒度を設計する。
- exec event（`execution/exec/events/`）との共通化可能性が評価され、共通化する範囲と分けたままにする範囲、その理由が記録されている。
- eventの冪等性と障害復旧の扱いが定義されている。同一遷移の重複記録、書き込み途中の中断、worktree並行実行時の競合を扱える。
- 既存個票およびGit履歴を利用するプロジェクトの後方互換性と、必要な移行・ロールバック手順が用意されている。既存のGit履歴からeventを生成できるか、できない場合の扱いが明示されている。
- CLI、schema、テスト、コマンドリファレンス、Register運用ガイド、関連設計書が実装と一致している。
- 起票、状態遷移、履歴再構成、失敗時の再実行を検証する自動テストが追加されている。
- commit policyの選定とGitHub連携は本項目の範囲に含めない。第2段（PJR-T7ZQ）と第3段（PJR-5W8C）で扱う。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                                        | 担当 | 状態 | メモ                                                 |
| --- | --------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------- |
| 1   | 現行の個票SSOT、Git履歴依存、commit・PR・worktree運用の利点と問題を整理する | ARC  | open | `register history`とsquash・コミット集約の関係を含む |
| 2   | Register eventのデータモデル、状態再構成、検証、冪等性、障害復旧を設計する  | ARC  | open | exec eventとの共通化可能性も評価する                 |
| 3   | 設計したRegister eventと履歴再構成を実装する                                | ARC  | open | 個票を正本とする位置づけの扱いを明示する             |
| 4   | 既存プロジェクトの互換性・移行手順を実装し、単体・統合テストで検証する      | ARC  | open | 既存Git履歴からの移行とロールバックを含む            |
| 5   | CLIリファレンス、Register運用ガイド、rulebook、関連システム設計を更新する   | ARC  | open | 第2段・第3段の前提となる部分を明示する               |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:pjr-rulebook]]
- [[specdojo:command-reference]]
- [[prj-0001:cdfd-register-lifecycle]]
- [[prj-0001:cdfd-reporting]]
- 第2段（本項目の完了を前提とする）: [[prj-0001:pjr-t7zq-register-commit-policy|PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する]]
- 第3段（本項目の完了を前提とする）: [[prj-0001:pjr-5w8c-register-github-integration|PJR-5W8C RegisterとGitHub Issues/Projectsの連携を実装する]]
