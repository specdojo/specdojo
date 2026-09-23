---
specdojo:
  id: prj-0001:pjr-ewwx-feature-branch-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T01:58:07Z"
  due_on: "2026-10-31"
---

# PJR-EWWX 複数人開発に備えて人が書いた変更を feature ブランチ経由に統一する

## 1. 背景

現行の運用では、exec の自動実行だけが `exec/prj-0001-<task-id>` で隔離され、人とオーケストレーターが書いた変更は `project/prj-0001/develop` へ直接 commit している。直近 60 commit の first-parent では、21 件が exec の merge commit、残り約 35 件が直接 commit である。

単独開発では成立しているが、[[specdojo:git-branching-standard]] は `feature/<project-id>/<topic>` を必須ブランチとして定義しており、現行運用はその一部を省略した状態にある。複数人開発へ移行すると次の 4 点が問題になる。

- `project/<project-id>/develop` に branch protection を設定すると、人の直接 push が禁止され現行運用が止まる。標準は「統合専用 actor を分離できない間は develop の保護を有効化しない」として猶予を認めているが、これは暫定措置である。
- `exec run --worktree` は実行時点の develop 先端から worktree を作り、親検証（`typecheck` / `test-unit` / `test-integration` / `validate-schema`）をそこで実行する。他者が直接 push した未検証 commit があると、無関係な task が failed になる。
- 事前レビューの単位が消える。レビュー対象の差分が develop に入った後になるため、差し戻す先がない。
- 各自のクローンから develop を push すると競合のたびに merge commit が増え、exec の「1 task = merge commit 1 件」という first-parent 設計が薄まる。

一方、登録簿は並行運用を前提に設計されている。ID は連番ではなく 32 文字セットの 4 文字乱数で、`pjr-index.md` と各ビューは `generated/` 配下で gitignore 済み、実体は項目ごとに分かれた個票とイベントファイルだけである。`register` コマンドは現在ブランチを参照せず、どのブランチ・どの worktree でも実行できる。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                 | 利点                                                            | 懸念                                                                                     |
| ------ | -------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| A      | 現行維持。すべての人の変更を develop へ直接 commit する              | 手数が最小。単独開発では十分に機能している                      | develop の保護を有効化できない。事前レビュー不能。他者の未検証 commit が親検証に混入する |
| B      | すべての変更を feature ブランチ経由にし、register の記帳も PR にする | 経路が 1 本で規律が単純                                         | `close` 1 回ごとに PR が必要になり実務が回らない。exec の統合も PR 待ちで停止する        |
| C      | 3 層に分ける。exec は exec ブランチ、人の変更は feature、記帳は直接  | レビューが要る変更だけを PR に載せられる。exec の自動統合が続く | 層の境界を運用者が判断する必要がある                                                     |

## 3. 決定内容

選択肢 C を採る。develop へ入る経路を次の 3 層に分け、層ごとに統合方法を固定する。

| 変更の種類                                                    | ブランチ                       | 統合方法                                                |
| ------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------- |
| exec の自動実行                                               | `exec/<project-id>-<task-id>`  | 統合専用 actor が `--no-ff` merge、protection は bypass |
| 人・オーケストレーターが内容を書いた実装・設定・規範文書      | `feature/<project-id>/<topic>` | PR で承認を得てから develop へ統合                      |
| register の記帳（`add` / `close` / 状態遷移）と生成物の再構築 | develop へ直接 commit を許容   | 統合専用 actor 経由                                     |

第 3 層を例外とする根拠は、競合しないことにある。ID が乱数で採番され、生成物が gitignore 済みで、実体が項目単位に分かれているため、別ブランチ・別担当が同時に起票・close しても衝突しない。ここを PR 必須にすると `close` ごとに PR が立ち、実務が回らない。

層の境界は「その変更に事前レビューの価値があるか」で判断する。記帳は実行事実の記録であってレビュー対象ではない。内容を伴う変更はレビュー対象である。

ただし exec に流す予定の `todo` は、実行前に develop へ入っている必要がある。`exec run --worktree` の worktree は commit から作られるため、feature ブランチにしかない個票は develop から実行できない。

## 4. 採択理由

- 選択肢 A は、branch protection を有効化した時点で破綻する。標準が既に develop の保護を規定しており、猶予期間の運用を恒久化する根拠がない。
- 選択肢 B は、記帳の頻度に対して PR の手数が釣り合わない。本プロジェクトでは 1 日に複数回の `close` と起票が発生する。
- 選択肢 C は、標準が既に定義しているブランチ構成をそのまま使う。新しい概念を増やさず、省略していた feature 経路を復活させるだけで成立する。
- 第 3 層を許容しても監査性は落ちない。register のイベントは append-only で保存され、`register history` で追跡できる。

## 5. 承認

| 項目     | 内容                                   |
| -------- | -------------------------------------- |
| 決定者   | _TODO_                                 |
| 決定日   | _TODO_                                 |
| 承認方式 | PR                                     |
| 証跡     | _TODO_: PR URL と merge SHA を記載する |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

本項目は PR 強制 3 ケースには該当しないが、決定した feature 経路そのものを実地検証するため PR 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `git-branching-standard`、`branch-workflow-guide`、オーケストレーター規範 `.agents/specdojo-orchestrator.agent.md`、branch protection の設定 |
| 必要な対応 | 下表の 4 件                                                                                                                                  |
| 追跡先     | 本項目および派生する todo                                                                                                                    |

| No  | 対応                                                                                                             | 担当 | 必要な権限       |
| --- | ---------------------------------------------------------------------------------------------------------------- | ---- | ---------------- |
| 1   | オーケストレーター規範に「自分が内容を書いた変更は feature ブランチを切って PR にする」を追加する                | DEV  | -                |
| 2   | `git-branching-standard` に 3 層の切り分けと、単独運用時に省略できる範囲・複数人運用時に必須となる条件を明記する | DEV  | -                |
| 3   | 統合専用の GitHub App または service account を用意し、develop の bypass actor に指定する                        | OPS  | リポジトリ管理者 |
| 4   | `main` と `project/prj-0001/develop` に branch protection を設定する                                             | OPS  | リポジトリ管理者 |

対応 1 と 2 は文書作業で先行できる。対応 3 と 4 はリポジトリ管理権限が必要で、複数人開発が具体化する時点で実施する。

## 7. 関連ドキュメント

- [[specdojo:git-branching-standard]]
- [[specdojo:branch-workflow-guide]]
- [[specdojo:register-operation-guide]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- `.github/CODEOWNERS`
- `.agents/specdojo-orchestrator.agent.md`
