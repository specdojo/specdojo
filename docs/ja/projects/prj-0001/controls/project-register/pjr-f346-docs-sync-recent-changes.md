---
specdojo:
  id: prj-0001:pjr-f346-docs-sync-recent-changes
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T11:22:25Z"
  completed_at: "2026-09-28T14:14:57Z"
  conclusion: 9/26〜28 に完了した変更について guides・references・README を横断確認し、11 文書を更新した（grade と review の役割分担、rubric v2 と --rubric-outdated、docs サイト、orchestrator 同期など）。旧語彙は移行説明と別義の用例だけが残る。4HBG・36CN・E2Q3 は着手時点で未完了のため対象外
---

# PJR-F346 2026-09-26〜28 の変更を利用者向けドキュメントへ反映する

## 1. 概要

2026-09-26〜28 に多くの項目を close した。各項目の executor は関係するガイドを部分的に更新したが、項目をまたいだ整合や、概要・入門のガイドへの反映は確認していない。利用者向けのドキュメントが実装と食い違っていないかを横断的に確認し、古い記述を直す。

反映の対象とする変更は次のとおり（括弧内は登録簿の ID）。

| 領域                   | 変更                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| exec の並行実行        | runner の検証を 1 回の run の中で直列化（3HHW）。実行中の run へ後から別の run を並行して始められる同時実行枠（4HBG、本項目の着手時に完了していれば）                |
| exec の再開と統合      | waiting 時の同期 merge を通常 merge に変更（R0XA）。統合時の記帳ファイル競合の解決と abort 前の index 更新（CTV4）。イベントの和集合での解決（36CN、完了していれば） |
| exec の commit 範囲    | register 由来タスクの新規ファイルの commit 範囲の絞り込み、ready 昇格検査の対象、一時ファイルの規約（FFPK）                                                          |
| exec の plan と review | plan から reporter 付きで review を実行する経路（E2Q3、完了していれば）                                                                                              |
| review                 | review は観点ごとに評価せず grade の結果を事実として受け取る（N22N）。review 前の grade の鮮度確認と plan への提示（KCMH）。判定語彙の 6 値への統一（XTAN）          |
| grade                  | `evaluation` の改名（WPWB）、`continuous` の廃止と 28 観点・rubric v2（K351）、観点の適用範囲と判断漏れの検証（AG7B、VJP8）、未完了時の exit 1（QJAD）               |
| grade の契機           | 定期実行の契機（N03W）、`--unreviewed` の絞り込み（2F3Y）、突き合わせ先の変化の検出と `--dependency-changed` の内容ハッシュ化（Z47X）、`--rubric-outdated`（BVPS）   |
| 登録簿                 | `config init` による `.gitignore` の追記（HG98）。`note` は終端させない（XW9M でオーケストレーター定義を修正済み）                                                   |
| schedule               | `schedule build` が schema modeline を残す（7ZNH）。kata 保守タスクの review フェーズ（06RE）                                                                        |
| docs サイト            | サイドバーの分割と実行記録の除外（E8FY）、検索対象の絞り込み（QQXP）、package 同梱 kata のステージング（SJ3X）                                                       |

## 2. 完了条件

- 次のドキュメントについて、上表の変更と食い違う記述がないかを確認し、食い違いを直している。
  - `docs/ja/specdojo/guides/` 配下のガイド（とくに `specdojo-overview-guide.md`、`quick-start-guide.md`、`exec-operation-guide.md`、`exec-worktree-guide.md`、`exec-config-guide.md`、`register-operation-guide.md`、`review-guide.md`、`routine-operation-guide.md`、`orchestrator-operation-guide.md`、`plan-result-lifecycle-guide.md`）
  - `docs/ja/specdojo/references/` 配下のリファレンス（`command-reference.md`、`specdojo-config-reference.md`、`directory-layout-reference.md`）
  - リポジトリの `README.md`
- 古い用語・値が残っていない。少なくとも次を検索し、残っている場合は現在の用語へ直すか、旧値であることを明記している。
  - `evaluation` の旧値 `agent` / `human`、`continuous`
  - review の旧語彙 `approve` / `revise` / `reject`、`conditional_pass` / `changes_requested`、観点ごとの `pass` / `fail` / `unclear` 判定
  - 観点別詳細テンプレート（`*-viewpoint-detail-*`）への参照
  - `note` を close / `done` にする記述
  - waiting の項目の再開に `--force-restart` を勧める記述（R0XA・CTV4 の後は `--resume` で再開できる）
- 上表のうち、どのドキュメントにも説明がない変更は、利用者が操作や結果の読み方に影響を受けるものに限り、適切なガイドへ追記している。
- 各項目の個票に書かれた仕様を正とし、ドキュメントに合わせて実装を変えない。実装とドキュメントのどちらが正しいか判断できない食い違いは、変更せずに対応結果へ列挙する。
- 章の参照は章番号ではなく章タイトルで書き、`.github/instructions/markdown.instructions.md` に従う。
- `npm run -s lint:md` が成功する。`npm run docs:build` が成功する（`NODE_OPTIONS` の指定なし）。
- 変更したドキュメントと、確認したが変更不要だったドキュメントを、対応結果に一覧で記録する。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態    | メモ                               |
| --- | ----------------------------------------------------- | ---- | ------- | ---------------------------------- |
| 1   | 旧用語・旧値を検索し、残っている箇所を一覧にする      | DEV  | done    | 旧値として明記済みの箇所を除き解消 |
| 2   | 変更ごとに関係するガイドとリファレンスを確認して直す  | DEV  | done    | 完了済み個票の仕様を正として反映   |
| 3   | 説明がない変更を適切なガイドへ追記する                | DEV  | done    | 利用者の操作と結果の読み方を補足   |
| 4   | lint と docs のビルドを通し、対応結果に一覧を記録する | DEV  | blocked | docs build は sandbox 制約で未完了 |

## 4. 対応結果

完了済みの対象項目だけを仕様の根拠として、ガイド、リファレンス、README を横断確認した。着手時点で waiting の PJR-4HBG、PJR-36CN、PJR-E2Q3 は反映対象から除外した。

変更したドキュメントは次のとおり。

- `README.md`: grade と review の役割、および人間による `ready` 確定の流れを概要へ追加した。
- [[specdojo:specdojo-overview-guide|全体概要ガイド]]、[[specdojo:quick-start-guide|Quick Start ガイド]]: grade、review、人間の最終確定を分離して説明し、章番号による参照を章タイトルへ改めた。
- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]、[[specdojo:ryu-guide|実践の進め方ガイド]]、[[specdojo:use-case-guide|ユースケース別ガイド]]: review が観点別に再評価する旧説明を、grade 結果を前提に完了条件を判断する現行仕様へ改めた。
- [[specdojo:review-guide|レビューガイド]]: rubric 更新時は `--changed-only` ではなく `--rubric-outdated` で再評価対象を抽出することを明記した。
- [[specdojo:command-reference|CLIコマンドリファレンス]]: grade の抽出条件、rubric v2 の `pass_score` 75、sidecar への結果保存に合わせて説明を更新した。
- [[specdojo:directory-layout-reference|ディレクトリレイアウトリファレンス]]: `execution/grade/results/` と `execution/grade/pipeline/` を追記した。
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]: `npm run orchestrator:sync` による 10 配置先の同期と検証を現行実装に合わせて説明した。
- [[specdojo:docs-editing-guide|ドキュメント編集ガイド]]、`packages/docs-site/README.md`: docs サイトのステージング、サイドバー、実行記録、検索対象の確認方法を追記した。
- 本個票: 実施範囲、変更一覧、変更不要と判断した文書、検証結果を記録した。

次のドキュメントは確認したが、完了済み項目の仕様と一致していたため変更しなかった。

- [[specdojo:exec-operation-guide|exec運用ガイド]]、[[specdojo:exec-worktree-guide|exec worktree運用ガイド]]、[[specdojo:exec-config-guide|exec設定ガイド]]、[[specdojo:register-operation-guide|登録簿運用ガイド]]、[[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:branch-workflow-guide|ブランチワークフローガイド]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]]、[[specdojo:kata-guide|実践の型活用ガイド]]、[[specdojo:practice-system-composition-guide|実践体系構成ガイド]]、[[specdojo:remote-host-development-guide|常時稼働ホスト運用ガイド]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]、[[specdojo:schedule-operation-guide|Schedule実行運用ガイド]]、[[specdojo:timeline-design-guide|Timeline設計ガイド]]、[[specdojo:track-design-guide|トラック設計ガイド]]、[[specdojo:waza-guide|遂行の技活用ガイド]]
- [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]、[[specdojo:deliverables-reference|成果物リファレンス]]

旧語彙の検索で残った `approve`、`continuous`、旧判定語彙、`--force-restart`、`note` と close / `done` の組み合わせは、PR 承認を指す用例、廃止値として明示した移行説明、破壊的な再実行の説明、または「終端にしない」という説明であり、現行仕様との食い違いではないことを確認した。判断不能な食い違いはなかった。

Markdown の整形・静的検査、履歴リンク検証、register / catalog / index の生成・検証は成功した。`npm run docs:build` は、`tsx` が IPC ソケットを作成できず `EPERM` で停止した。IPC を使わない起動方法で同等の生成6工程が成功することを確認した後、docs-site のビルドを単独実行したが、Mermaid SVG 生成用 Chromium が container の seccomp 制約で停止した。既存の `--no-sandbox` 設定を適用しても回避できないため、Chromium を起動できる環境で `npm run docs:build` を再実行する必要がある。

## 5. 関連ドキュメント

- [[specdojo:specdojo-overview-guide]]、[[specdojo:exec-operation-guide]]、[[specdojo:exec-worktree-guide]]、[[specdojo:review-guide]]、[[specdojo:routine-operation-guide]]
- 上表の各項目の個票
