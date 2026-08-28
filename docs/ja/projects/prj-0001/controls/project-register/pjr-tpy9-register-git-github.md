---
specdojo:
  id: prj-0001:pjr-tpy9-register-git-github
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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
| 1   | 現行の個票SSOT、Git履歴依存、commit・PR・worktree運用の利点と問題を整理する | ARC  | done | `register history`とsquash・コミット集約の関係を整理 |
| 2   | Register eventのデータモデル、状態再構成、検証、冪等性、障害復旧を設計する  | ARC  | done | exec eventとの共通点と分離理由を規約へ記録           |
| 3   | 設計したRegister eventと履歴再構成を実装する                                | ARC  | done | 現在値は個票、監査履歴は個票内eventを正本化          |
| 4   | 既存プロジェクトの互換性・移行手順を実装し、単体・統合テストで検証する      | ARC  | done | Git fallback、移行、ロールバックを実装               |
| 5   | CLIリファレンス、Register運用ガイド、rulebook、関連システム設計を更新する   | ARC  | done | 責務境界と運用手順を同期                             |

## 4. 対応結果

- 個票 Frontmatter の通常フィールドを現在値のSSOTとして維持し、同じ個票の`register_events`配列を監査履歴のSSOTとした。Gitは保存・配布・差分レビューを担うが、commitを業務eventの粒度とはみなさない。1項目1ファイルのままなのでeventごとのファイルは増えず、異なる項目のworktree並行実行も共有ログで競合しない。
- event v1は一意なevent ID、UTC秒精度の発生日時、action、actor、遷移前後の状態、reason、変更フィールド、直前event IDを保持する。`register add`、全状態遷移、`register update`、`register renumber`が現在値とeventを同じ個票へ原子的に書き込む。自動実行経路は解決済みagent名を`--by`で引き渡す。
- `register history`はeventを優先し、導入前または未移行の期間だけGit履歴を統合する。eventの開始時刻以後のGit差分を除外するため、eventを含む複数遷移が1commitへsquashされても重複せず、各遷移を復元できる。1commitに`add`・`start`・`review`をまとめた自動テストを追加した。
- 同じ現在値への再実行はeventを追加しない。書き込みは同一ディレクトリの一時ファイル完成後に置換し、途中中断で現在値とeventの片方だけを残さない。`register build`はevent shape、ID一意性、時刻順、直前参照、状態連鎖、最新eventと現在値の一致を検証する。同じ個票の並行変更は通常の個票競合として統合を止め、event削除による解消は行わない。
- `register migrate`は利用可能なGit履歴を決定的event IDで個票へ変換する。Git履歴がない場合や既にeventがある個票は破壊的に補完せずfallbackを維持する。旧CLIへ戻しても現在値は従来フィールドのまま読めるため、eventを削除せずevent対応版を再適用する手順をロールバック方針とした。
- exec eventとはversion、UTC日時、actor、reason、追記・検証の原則だけを共通化した。execはtask stateのSSOTとして1 event 1 JSONをfoldする一方、Registerは個票の現在値を維持しファイル増加を避ける必要があるため、保存形式と状態foldは分離した。
- レビューで2点を補った。1点目は、起票直後の個票で未設定の`completed`・`conclusion`・`block_reason`が「空から表示用の`-`への変更」としてadd eventへ記録されていた問題である。frontmatterにキーが無い状態と表示上の未設定セルを差分では同一視するようにし、既存の`register history`の表示（`-`から実値への変更）は変えていない。2点目は、概念データフロー図が履歴の入力をGit commitのままとしていた点で、[[prj-0001:cdfd-register-lifecycle]]の`P-02-08`と[[prj-0001:cdfd-reporting]]の記述を個票eventへ更新した。
- 遷移時のcommit policyは変更していない。`register start`のworktree隔離要件とper-event commitは維持し、`develop`から`main`への昇格方式は後続項目の範囲とした。GitHub連携もeventを同期境界として利用できるようにしただけで、本項目では実装していない。

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:pjr-rulebook]]
- [[specdojo:command-reference]]
- [[prj-0001:cdfd-register-lifecycle]]
- [[prj-0001:cdfd-reporting]]
- 第2段（本項目の完了を前提とする）: [[prj-0001:pjr-t7zq-register-commit-policy|PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する]]
- 第3段（本項目の完了を前提とする）: [[prj-0001:pjr-5w8c-register-github-integration|PJR-5W8C RegisterとGitHub Issues/Projectsの連携を実装する]]
