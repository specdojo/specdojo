---
specdojo:
  id: prj-0001:pjr-v5az-quick-start-conversation-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-11-02T11:56:56Z"
  due_on: "2026-11-30"
---

# PJR-V5AZ Quick Start ガイドを初期設定から実運用までの対話ベースに書き直す

## 1. 概要

landing page から来た利用者が、管理対象リポジトリと Git flow の初期設定、register の起票・実行、schedule による成果物作成、routine 登録までを対話で体験できる Quick Start に改訂する。コマンドと設定差分は折りたたむ。

## 2. 入力

- 対象は docs/ja/specdojo/guides/quick-start-guide.md。landing page から訪れる初学者向けに、コマンド主体の構成を対話主体へ改訂する。
- 共通の題材は ../landing-page。導入・起動、管理対象リポジトリへの追加、Git flow のブランチルール設定を対話で示す。
- FAQ 追加の todo、スマートフォンでメニューが閉じない不具合の issue、問い合わせフォームの実装方針を比較する decision の起票例を示す。これらはガイド用の例であり、実プロジェクトの事実ではない。
- 登録した作業の AI 実行と確認、成果物カタログなどの準備から schedule によるまとまった成果物の作成、routine の登録と定期起動の仕組みへ進む。
- 各節は前提・具体的対話・得られる結果と確認先・折りたたんだコマンドと設定差分の順とし、不足事項の確認と提案・承認・実行を示す。
- 完了時は現行 CLI・設定仕様との整合、既存リンクと見出しへの参照、Markdown lint と適用される親の文書検証を確認する。保護された設定や実際の landing-page リポジトリの変更は対象外。

## 3. 完了条件

- 導入・起動から、`../landing-page` の管理対象への追加と Git flow のブランチルール設定までを、具体的な対話で説明している。
- 機能追加の todo、不具合の issue、判断の decision の起票と、登録した作業の AI 実行・確認を、一貫した題材で体験できる。
- 成果物カタログなどの前提設定から schedule によるまとまった成果物の作成、routine の登録と定期起動の仕組みまで案内している。
- 各ユースケースに前提、利用者とオーケストレーターの対話、得られる結果と確認先を記載し、不足事項の確認と提案・承認・実行の流れを示している。
- 対話に対応するコマンドと設定差分は `<details>` で折りたたみ、導入と起動に必要なコマンドは本文で確認できる。
- コマンドと設定例が現行仕様に整合し、担当・期限・判断を勝手に確定する対話例を含まない。既存の参照元からの導線と文書内リンクを確認している。
- Markdown lint と適用される親の文書検証を通し、検証結果を対応結果へ記録している。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 現行 CLI・設定仕様と関連ガイド、参照元の導線を確認する               | BA   | open | -    |
| 2   | 合意した利用順に構成し、対話例と折りたたんだコマンド・設定差分を書く | BA   | open | -    |
| 3   | リンクと文書検証を確認し、対応結果へ記録する                         | BA   | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
