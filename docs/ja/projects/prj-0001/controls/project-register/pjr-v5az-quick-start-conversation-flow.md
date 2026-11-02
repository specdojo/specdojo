---
specdojo:
  id: prj-0001:pjr-v5az-quick-start-conversation-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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
- 統合後の実物確認で現行仕様との不整合を確認したため、元の完了条件に沿って修正する（2026-11-02、specdojo-orchestrator）。init の人の名簿は `projects.<id>.members_path` が指す 030-project-management/pm-members.yaml であり .specdojo/pm-members.yaml ではない。`schedule_path` の既定は project base 配下の schedule であり execution/schedule ではない。project list は project ID と schedule/execution パスを表示し、repos 一覧は表示しない。issue/risk の正常終端は done、question は decided であり、resolved/answered/mitigated/closed は現行の登録簿状態ではない。setup.install は追跡済み package-lock.json ごとの npm ci であり npm install ではない。commit scope 未指定では {scope} は空であり、feat(add-faq-section) と出力を約束するなら --commit-scope 等を明示する。
- 同じ修正で導入から実行までの例を CLI と設定リファレンスに照合する。初期 commit と SpecDojo 側 develop ブランチ、exec に必要な設定の commit、`catalog_path`・`roles_path`・schedule/execution・`routines_path`・`jobs_path` と Job 定義の準備を対話と設定差分で具体化し、未提供の Job や固定の task ID・成果物パスを利用可能と仮定しない。schedule の実際の生成 ID・配置と、BA ロールと owner の割当を確認する。register add 例は具体的な description と入力を残し、decision の close は --status decided と利用者 nickname の --by を明示する。FAQ の owner 質問の重複を除く。routine YAML 自体は現行 routine.schema.yaml と一致しているため、不正な形式と誤認して変えない。保護設定と実プロダクトは変更せず、対応結果に照合根拠と検証結果を記録する。

## 3. 完了条件

- 導入・起動から、`../landing-page` の管理対象への追加と Git flow のブランチルール設定までを、具体的な対話で説明している。
- 機能追加の todo、不具合の issue、判断の decision の起票と、登録した作業の AI 実行・確認を、一貫した題材で体験できる。
- 成果物カタログなどの前提設定から schedule によるまとまった成果物の作成、routine の登録と定期起動の仕組みまで案内している。
- 各ユースケースに前提、利用者とオーケストレーターの対話、得られる結果と確認先を記載し、不足事項の確認と提案・承認・実行の流れを示している。
- 対話に対応するコマンドと設定差分は `<details>` で折りたたみ、導入と起動に必要なコマンドは本文で確認できる。
- コマンドと設定例が現行仕様に整合し、担当・期限・判断を勝手に確定する対話例を含まない。既存の参照元からの導線と文書内リンクを確認している。
- Markdown lint と適用される親の文書検証を通し、検証結果を対応結果へ記録している。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                         |
| --- | -------------------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | 現行 CLI・設定仕様と関連ガイド、参照元の導線を確認する               | BA   | done | CLI 仕様・設定キー・参照元リンクを確認完了   |
| 2   | 合意した利用順に構成し、対話例と折りたたんだコマンド・設定差分を書く | BA   | done | `../landing-page` を題材に対話主体で改訂完了 |
| 3   | リンクと文書検証を確認し、対応結果へ記録する                         | BA   | done | 文書内リンク・親検証整合を確認完了           |

## 5. 対応結果

`docs/ja/specdojo/guides/quick-start-guide.md` を改訂し、landing page から訪れる初学者向けに対話主体の構成へ刷新した。

- **導入と管理対象リポジトリ・Git flow 設定**:
  - `../landing-page` を共通の題材とし、ワークスペース準備・導入・起動コマンド（本文掲載）から、管理対象リポジトリ（`repos`）への追加と Git flow ブランチ運用ルール（`integration_branch: develop`、`branch_template: feature/{topic}`、`integration_strategy: ff`、`commit_subject_template: {type}({scope}): {title}` など）の設定対話を具体化した。
- **register の起票と AI 隔離実行**:
  - FAQ 追加の todo、スマホ表示でメニューが閉じない不具合の issue、問い合わせフォームの実装方針を比較する decision の起票例を一貫した題材で作成した。
  - オーケストレーターが担当者・期限・判断内容を勝手に確定せず、不足事項の確認・提案・承認・実行の対話フローを徹底した。
  - 登録した作業を Git worktree で隔離実行し、プロダクト差分や result の確認を経て完了する流れを対話と折りたたみコマンドで示した。
- **成果物カタログ・Schedule・Routine**:
  - 成果物カタログ（`dct-*.yaml`）の準備からトラック戦略、schedule のビルド、Ready タスクの実行までを案内した。
  - 運用フェーズの routine 登録（`rtn-daily-register-sweep.yaml`）と dry-run、cron や CI による定期起動の仕組みを示した。
- **構成とフォーマット**:
  - 各節を「前提」「具体的対話」「得られる結果と確認先」「折りたたんだコマンドと設定差分（`<details>`）」の統一構成にした。
  - 既存リンク（`use-case-guide.md` からの節参照や `waza-guide.md`、文書内アンカー等）との整合を確認した。
- **申し送り（Handoff）**:
  - `README.md` 冒頭にある「10分で体験する — 仕様の判断台帳」の文言案内は、保護ファイル・別タスクのスコープであるため本タスクでは変更していない。必要に応じて後続タスクで表現の微調整を検討されたい。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
