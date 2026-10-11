---
specdojo:
  id: prj-0001:pjr-vqza-routine-commit-after-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-10-11T22:15:30Z"
  due_on: "2026-10-31"
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

_ASSUMPTION_: 現時点の見立てでは D のほうが現状の運用（手動 commit の自動化）に近いが、実行中の干渉を lock で解消できることが前提になる。B は干渉を構造的に避けられるが、worktree の I/O と merge の運用が増える。どちらにするかは本項目の作業で決める。

## 2. 完了条件

- B と D の比較の結果と採用した方式が、本個票の対応結果に理由とともに記載されている。
- grade の 2 つの routine（成果物・kata）の実行後に、Job の出力が人手を介さず commit される。commit の対象はその Job Run の出力だけで、利用者の未 commit の変更を含まない。
- commit メッセージは `chore(routine): …` の形式に揃い、Job Run ID と Run の状態（succeeded / failed）が本文から分かる。
- Job の実行中に作業場所で行われた commit が、Job を `agent-git-state-write` で失敗させない（lock による直列化、または worktree による隔離のいずれかで防ぐ）。
- 失敗した Job Run の出力をどう扱うか（commit する・隔離する・残さない）が決まり、その扱いが実装されている。
- [[specdojo:routine-operation-guide]] に、実行後の commit の動きと、手で commit しなくてよくなったことが記載されている。
- 単体テストと統合テストで、出力だけが commit されること、実行中の commit との干渉の扱いを確認している。

## 3. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------- | ---- | ---- | ---- |
| 1   | B と D を比較し、採用する方式と失敗した Run の扱いを決める | ARC  | open | -    |
| 2   | Job の実行と commit の干渉を防ぐ方法を設計する             | ARC  | open | -    |
| 3   | 実行後の commit を実装し、テストを追加する                 | DEV  | open | -    |
| 4   | routine 運用ガイドを更新する                               | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]: routine と grade の定期実行の現行仕様。
- [[specdojo:git-branching-standard]]: ブランチと commit 先の規範。
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]: grade の定期実行の構成。
- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: Job の責務の境界。
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]: worktree の I/O の改善。B を採る場合に影響する。
