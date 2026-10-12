---
specdojo:
  id: prj-0001:pjr-vqza-routine-commit-after-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-10-11T22:15:30Z"
  due_on: "2026-10-31"
  block_reason: "integrate failed: project: git commit failed: format: docs/ja/projects/prj-0001/controls/project-register/events/pjr-vqza.yaml 17ms (unchanged); FAIL  tests/src/exec-pipeline-e2e.integration.test.ts >…"
---

# PJR-VQZA 定期実行の出力を実行後に commit する

## 1. 概要

routine が起動する Job（grade など）は本体の作業場所で出力を作るが commit せず、人や orchestrator が後から手で記録している。実行後に出力を commit する仕組みを、ブランチを切る方式と統合先へ直接 commit する方式を比較して決め、実装する

### 1.1. 現状

- devcontainer の cron が毎時、本体の作業場所（`project/prj-0001/develop` を checkout）で `routine run --project prj-0001 --due` を実行する。
- `rtn-grade-deliverable-recheck`（毎日 1 時）と `rtn-grade-recheck`（毎日 6 時）は、Job を作業場所でそのまま実行する。出力は `execution/grade/` の criteria・results と、Job Run の plan・result・evidence・`jobs/runs/*.json` である。
- 出力は commit されずに作業ツリーへ残り、2026-10-07 以降は orchestrator が `chore(routine): …` として手で commit している。
- 2026-10-11 の kata の Job Run は、実行中に orchestrator が develop へ register の commit を入れて HEAD が動き、`agent-git-state-write` で `failed` になった。commit の時機を Job と調整する仕組みがない。

### 1.2. 比較の観点

ブランチを切って commit する方式（以下 B）と、統合先（develop）へそのまま commit する方式（以下 D）を、次の観点で比べる。

| 観点                         | B: ブランチを切って commit                                                                                                                             | D: 統合先へそのまま commit                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 実行場所                     | 作業場所の checkout を切り替えると利用者の作業と HEAD 検査に干渉するため、Job 用の worktree が要る。worktree は共有フォルダ上で I/O が重い（PJR-TATP） | 現在の作業場所でそのまま実行できる                                                                                                                           |
| 統合の手間                   | 実行ごとに merge が要る。自動 merge にするなら D と同じ判断が必要になり、手動に残すとブランチが溜まる                                                  | 不要                                                                                                                                                         |
| 衝突                         | grade の results は文書ごとに同じファイルを上書きするため、未統合のブランチが複数あると日をまたいで衝突しうる                                          | 実行ごとに順に積まれるため、出力どうしは衝突しない                                                                                                           |
| レビューと取り消し           | 統合前に内容を確認でき、不要な実行はブランチごと捨てられる                                                                                             | 統合後に revert で取り消す                                                                                                                                   |
| 失敗した実行の扱い           | 失敗した Run をブランチに隔離できる                                                                                                                    | 失敗の記録（Job Run の状態・evidence）も develop に入る。現行の手動 commit も失敗の記録ごと残している                                                        |
| 実行中の他の commit との干渉 | Job が worktree で動くため、作業場所の commit は Job の HEAD を動かさない                                                                              | Job 実行中に作業場所で commit すると HEAD 検査で Job が失敗する。register の lifecycle lock と同様に、Job の実行と commit を同じ lock で直列化する必要がある |
| 利用者の未 commit の変更     | worktree が分かれるため混ざらない                                                                                                                      | Job の出力だけを pathspec で指定して commit する必要がある（register の `--commit` と同じ方式）                                                              |
| 既存の規範との整合           | 自分が内容を書いた変更は feature ブランチという方針に近い                                                                                              | runner 相当の機械的な記帳は develop へ直接 commit してよいという方針（register の記帳）に近い                                                                |
| commit 前の hook             | worktree でも hook は動く                                                                                                                              | 作業場所で hook が動く。重い hook が Job の後処理を長引かせないか確認が要る                                                                                  |

### 1.3. 決定（2026-10-12）

利用者の判断により、B を基にした次の方式を採る。D（統合先へ直接 commit し、lock で直列化する方式）は採らない。grade の出力は LLM の判断（score・verdict・finding）を含み、[[specdojo:git-branching-standard]] の「レビューで誤りを発見できる変更は層 2」に当たるため、統合前にレビューする。commit は人や orchestrator ではなく runner が行う。

| 段        | 担当         | 内容                                                                                                                                                                          |
| --------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 実行   | runner       | routine が起動する Job を exec の worktree（`exec/<project-id>-<run-id>`）で実行する。本体の作業場所の HEAD とは分ける                                                        |
| 2. commit | runner       | Job Run の出力（grade の criteria・results、Job Run の plan・result・evidence、`jobs/runs/*.json`）を exec ブランチへ commit する                                             |
| 3. review | review agent | schedule の review と同じ形で `mode: review` の plan と result を生成する。Job Run の出力（score の変化、finding、失敗した文書）を Job の完了条件と照合し、verdict を記録する |
| 4. 統合   | runner       | verdict が `complete` または `complete-with-findings` のときだけ、統合先へ `--no-ff` で merge する。それ以外は worktree を残して `waiting` とし、人が判断する                 |

本体の作業場所では Job を実行しないため、実行中の commit が Job を失敗させる問題は lock を使わず構造的に解消する。exec ブランチから runner が統合するため、規範上は層 1（exec が自動実行する変更）に当たり、`git-branching-standard` の層 3 は変更しない。

## 2. 完了条件

- `commit` を有効にした routine の Job は、本体の作業場所ではなく exec の worktree で実行される。2 つの grade の routine（成果物・kata）で有効にしている。
- Job Run の出力は runner が exec ブランチへ commit する。commit の対象はその Job Run の出力だけで、commit メッセージは `chore(routine): …` の形式に揃え、Job Run ID と Run の状態（succeeded / failed）を本文に含む。
- commit の後、schedule の review と同じ仕組み（`mode: review` の plan・result、verdict、改善指示）で Job Run の review を実行する。review agent は出力を修正しない。
- verdict が `complete` / `complete-with-findings` の場合だけ runner が統合先へ `--no-ff` で merge し、worktree を撤去する。それ以外の verdict と、Job Run が失敗した場合は、worktree を残して統合せず、その状態と理由を routine の記録（`last_result` など）と review result に残す。
- 統合されなかった Run を人が確認したあと、統合する・破棄する操作の手順が [[specdojo:routine-operation-guide]] に記載されている。
- `git-branching-standard` の層の定義は変更しない（routine の出力は exec ブランチ経由の層 1 として扱う）。
- [[specdojo:routine-operation-guide]] に、worktree での実行、runner による commit、review、統合の流れが記載されている。
- 単体テストと統合テストで、出力だけが exec ブランチへ commit されること、verdict に応じて統合する・しないが分かれること、本体の作業場所の HEAD が Job の実行中に変わらないことを確認している。
- 統合テストで子プロセスとして CLI を起動する場合は、一時ディレクトリから `--import tsx` を解決できないため、既存の統合テストと同じく実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。

## 3. 作業内容

| No  | 作業                                                                                | 担当 | 状態 | メモ                     |
| --- | ----------------------------------------------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | B と D を比較し、採用する方式と失敗した Run の扱いを決める                          | ARC  | done | 概要の決定（2026-10-12） |
| 2   | Job を exec の worktree で実行し、runner が exec ブランチへ commit する仕組みを作る | DEV  | done | `commit: true` で有効化  |
| 3   | Job Run の review を schedule の review と同じ形で実行し、verdict で統合を分ける    | DEV  | done | review pipeline を再利用 |
| 4   | テストを追加する                                                                    | DEV  | done | 単体・統合テスト         |
| 5   | routine 運用ガイドと設計書を更新する                                                | ARC  | done | 運用手順を追記           |

## 4. 対応結果

### 4.1. 1 回目の実行（破棄）

2026-10-12 の 1 回目の exec run（codex-expert-executor / gemma26-reporter）は D 方式（統合先への直接 commit と lifecycle lock による直列化、`git-branching-standard` の層 3 への追加）で実装した。追加した統合テスト 2 件が子プロセスで `--import tsx` を解決できず失敗し、`waiting` で止まった。テストは orchestrator が修正して通ったが、利用者が統合前のレビューを求めて方式を B ベースへ改めたため、実装は統合せず `--force-restart` で破棄した。

### 4.2. 2 回目の実行

B 方式を実装した。routine action の `commit: true` で Job Run を `exec/<project-id>-<run-id>` の worktree へ隔離し、runner が出力を `chore(routine): …` で commit する。commit 後は `mode: review` の plan/result と executor/reporter pipeline で読み取り専用レビューし、Run が成功かつ verdict が `complete` / `complete-with-findings` の場合だけ `--no-ff` で統合する。それ以外は worktree を残し、Job Run・review result・routine state/history に理由を記録する。

`rtn-grade-deliverable-recheck` と `rtn-grade-recheck` で `commit: true` を有効にした。Job Run schema と routine run schema、[[specdojo:routine-operation-guide]]、[[sysd-job-execution|Job実行設計]]を更新し、受理時の統合と不受理時の保持、本体 checkout の未 commit 変更を commit しないことを統合テストへ追加した。登録簿の状態は runner と人間が遷移するため変更していない。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]: routine と grade の定期実行の現行仕様。
- [[specdojo:git-branching-standard]]: ブランチと commit 先の規範。
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]: grade の定期実行の構成。
- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: Job の責務の境界。
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]: worktree の I/O の改善。B を採る場合に影響する。
