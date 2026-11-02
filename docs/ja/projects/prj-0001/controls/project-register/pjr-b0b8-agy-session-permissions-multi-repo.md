---
specdojo:
  id: prj-0001:pjr-b0b8-agy-session-permissions-multi-repo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-02T12:57:11Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-integration"
---

# PJR-B0B8 agy のセッション別権限設定に対応し、マルチリポジトリの編集境界を見直す

## 1. 概要

agy のセッション別設定を使い、役割ごとの権限を分離する。宣言済みプロダクトリポジトリとその worktree の編集を可能にし、秘密情報・保護設定への制限と両立させる。

## 2. 入力

- 利用者が agy 1.4.12 のセッション別設定を用いた allow/deny 制御と、マルチリポジトリのプロダクトリポジトリ編集境界の見直しを依頼した。担当 ARC、期限 2026-11-30。
- 利用者共有の agy --version は 1.4.12。ローカルの agy --help で --settings が settings.json のキーを JSON またはファイルパスで受け取り、セッション内だけに適用して保存しないことを確認した。
- 現在の配布設定はグローバル設定へのルール追加が中心。宣言済みプロダクトリポジトリの --add-dir 注入は既存実装にある。本リポジトリの exec-defaults には --dangerously-skip-permissions が残る。
- Claude と同等の制御が可能かは未検証であり、設定マージ・優先順位・実際の許可と拒否を確認する。起票までが今回の承認範囲であり、exec の実行は別途承認する。

## 3. 完了条件

- [ ] agy 1.4.12 の `--settings` を使い、edit・review・report・orchestrator の役割別の権限を分離する。既存のグローバル・プロジェクト設定とのマージ方法と優先順位を確認し、Claude と同等に制御できる範囲と差異を記録する。
- [ ] 起動処理・配布テンプレート・scaffold がセッション別設定に対応し、`--dangerously-skip-permissions` に依存せず実行できる。既定の導入でユーザーのグローバル設定を書き換えず、既存利用者の移行方法を示す。
- [ ] 宣言済みプロダクトリポジトリとその task worktree の成果物を edit executor が読み書きできる。対話型 orchestrator の起動経路も確認し、未宣言の外部リポジトリへの許可は追加しない。
- [ ] プロジェクト・プロダクト両方のリポジトリで秘密情報・保護設定への制限を維持する。review・report の役割外の編集を拒否し、既存の provider 非依存ガードと両立する。
- [ ] 変更箇所の単体・統合テストを追加し、型検査・lint・単体テストと親の固定検証を通す。空のリポジトリで scaffold した設定を確認し、実際の agy による役割別の許可・拒否とプロダクト worktree の編集を、秘密情報を使わない検証用ファイルで確認する。
- [ ] runner・CLI の変更を統合した後に、実際の `npx specdojo exec run --register` を通して動作を確認する。prj-0001 では運用プレイブックに従い PJR-JSEY を使用し、証跡を個票の対応結果と result に残す。
- [ ] 関連する設計・ガイド・配布 README を更新する。CHANGELOG は未公開版の節へ記載し、公開済み版の節は変更しない。
- [ ] 保護設定の変更案は個票の対応結果に記載し、pipeline の報告の `handoff` にも残す。反映は利用者の承認を得て feature ブランチで行う。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                     |
| --- | -------------------------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | 役割別のセッション設定と既存設定のマージ仕様を整理する               | ARC  | open | Claude との差異と移行方法を記録する      |
| 2   | 起動処理・配布テンプレート・scaffold を対応させる                    | ARC  | open | 保護設定は変更案を申し送る               |
| 3   | 宣言済みプロダクトリポジトリと worktree の権限を見直す               | ARC  | open | 追加ルートと各リポジトリの保護を確認する |
| 4   | 単体・統合・親検証、空リポジトリへの生成、実機の許可・拒否を確認する | ARC  | open | 統合後の exec 確認を含める               |
| 5   | 設計・ガイド・配布 README・未公開版の CHANGELOG を更新する           | ARC  | open | 検証結果と残課題を対応結果へ残す         |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[sysd-agent-settings|エージェント実行・共通設計]]
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]
- [[sysd-claude-agent-settings|Claude Code エージェント設定]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 オーケストレーター運用メモ]]
- [[prj-0001:pjr-0fk2-config-scaffold-agent|PJR-0FK2 パーミッション設定の生成・マージ]]
- [Antigravity CLI の権限仕様](https://antigravity.google/docs/permissions/)
- 主な確認対象: `src/commands/orchestrator.ts`、`src/exec/task-repos.ts`、provider の起動処理、`templates/antigravity/`、`templates/init-exec-defaults.yaml`。
