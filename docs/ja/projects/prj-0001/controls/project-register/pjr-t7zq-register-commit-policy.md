---
specdojo:
  id: prj-0001:pjr-t7zq-register-commit-policy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-08-24T12:01:18Z"
  due_on: "2026-10-31"
  completed_at: "2026-08-27T23:42:06Z"
  conclusion: 遷移時の commit policy は per-event を維持し、雑音の削減は develop から main への昇格境界で行う。register start のコミットは worktree 隔離の構造上の要件であり、コミットしないと worktree の個票が着手前の状態のままとなり agent が誤読する。当初の課題はプロダクト変更を追う Git 履歴の信号対雑音比であり、main が読みやすければ目的を果たす。develop の細かさは実行記録として意味を持つ。push 済み履歴は書き換えず force-push を伴う rebase は行わない。まとめ方の具体は squash merge に祖先関係が記録されない副作用があるため検証を伴い、PJR-199G で確定する。PJR-TPY9 の完了後に有効となる。
  register_events:
    - v: 1
      id: reg_2d8341d87f2f3f98ceaf3c977abd2ae6
      ts: "2026-08-24T12:02:39Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-TPY9 を3段に分割し PJR-T7ZQ と PJR-5W8C を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: Registerの状態遷移に対するcommit policyを選定する
        - field: description
          from: ""
          to: PJR-TPY9 で Register の状態遷移を追記型 event として記録できるようにした後、遷移ごとにコミットする現行の運用を見直す。per-event、per-item、batch、related-change、manual などの候補を評価し、採用する policy、既定値、設定方法、人手・Agent・routine・worktree 実行時の扱いを決める。event が履歴を保持するならコミット頻度を下げられるため、PJR-TPY9 の完了を前提とする。
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-24"
        - field: due
          from: ""
          to: "2026-10-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 53ba454ab5e41af45bd85e68b555973a9977c4fc
    - v: 1
      id: reg_1881c9e7d891bfeeb2e49d3a52a094d7
      ts: "2026-08-27T23:45:32Z"
      action: close
      actor: naoji3x
      from_status: open
      to_status: decided
      reason: "docs(register): PJR-T7ZQ を決定しPJR-199Gを起票する"
      changes:
        - field: status
          from: open
          to: decided
        - field: completed
          from: "-"
          to: "2026-08-28"
        - field: conclusion
          from: "-"
          to: 遷移時の commit policy は per-event を維持し、雑音の削減は develop から main への昇格境界で行う。register start のコミットは worktree 隔離の構造上の要件であり、コミットしないと worktree の個票が着手前の状態のままとなり agent が誤読する。当初の課題はプロダクト変更を追う Git 履歴の信号対雑音比であり、main が読みやすければ目的を果たす。develop の細かさは実行記録として意味を持つ。push 済み履歴は書き換えず force-push を伴う rebase は行わない。まとめ方の具体は squash merge に祖先関係が記録されない副作用があるため検証を伴い、PJR-199G で確定する。PJR-TPY9 の完了後に有効となる。
      legacy_commit: 6dd9ca7d550ed466e08b09e59decfc5dbdf35dc9
      previous_event_id: reg_2d8341d87f2f3f98ceaf3c977abd2ae6
---

# PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する

## 1. 背景

PJR-TPY9 で Register の状態遷移を追記型 event として記録できるようにした後、遷移ごとにコミットする現行の運用を見直す。per-event、per-item、batch、related-change、manual などの候補を評価し、採用する policy、既定値、設定方法、人手・Agent・routine・worktree 実行時の扱いを決める。event が履歴を保持するならコミット頻度を下げられるため、PJR-TPY9 の完了を前提とする。

## 2. 検討した選択肢

| 選択肢         | 内容                                                               | 利点                                                        | 懸念                                                                                   |
| -------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| per-event      | 現行どおり遷移ごとにコミットする                                   | 変更なし。各遷移が独立して revert できる                    | 雑音が減らない。PJR-TPY9 で event を追加すると小さなファイルが増える分だけ悪化する     |
| **per-item**   | 1つの項目の一連の遷移を、終了時にまとめて1コミットにする           | 項目単位で履歴が読める。コミット数が実測で約1/4になる見込み | 実行の途中で中断した場合、未コミットの遷移が残る。並行実行時に項目をまたぐ変更が混ざる |
| batch          | 一定件数または一定時間ごとにまとめる                               | コミット数を最も減らせる                                    | まとめる境界が項目と一致せず、履歴の意味が薄れる。中断時の未コミット範囲が読みにくい   |
| related-change | 成果物の変更と同じコミットへ含める                                 | 変更と管理情報が1つの revision に揃い、レビューしやすい     | 成果物を変更しない遷移（start / wait / review）の置き場所がない                        |
| manual         | 自動コミットせず、人またはオーケストレーターが任意の粒度でまとめる | 粒度を状況に応じて選べる                                    | コミット漏れが起きる。自動実行（routine）で成立しない                                  |

複数の policy を設定で選べるようにするか、単一の方式へ固定するかも判断に含める。

## 3. 決定内容

遷移時の commit policy は変更せず、雑音の削減は昇格の境界で行う。

| 項目            | 決定内容                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| 遷移時の policy | `per-event` を維持する。遷移ごとにコミットする現行の動作を変えない                                           |
| 雑音の削減      | `develop → main` の昇格境界で行う。`develop` は実行記録として細かいまま、`main` はプロダクト変更の粒度とする |
| 有効になる時期  | PJR-TPY9 の完了後。現在は `register history` がコミット粒度に依存するため、まとめると履歴が失われる          |
| push 済み履歴   | 書き換えない。force-push を伴う `rebase -i` は行わない                                                       |
| 方式の確定      | まとめ方の具体（squash merge か、昇格前の整理か、遷移コミットのみ除外か）は検証を伴うため実装で確定する      |

## 4. 採択理由

- `start` のコミットは worktree 隔離の構造上の要件である。`exec run --register --worktree` は `register start` を本体へコミットした後に worktree を作る。コミットしないと worktree の個票が着手前の状態のままとなり、agent が自分の着手した項目を未着手として読む。本体に未コミットの変更が残るため、マージ時の競合や上書きも起きる。遷移時のコミットは雑音ではなく機能である。
- 当初の課題は「プロダクト変更を追う Git 履歴の信号対雑音比」であった。`main` が読みやすければ目的を果たす。`develop` の細かさは実行記録として意味があり、event と対応する。
- 昇格境界でまとめる方式は、遷移時の実装を変えないため、worktree・in-place・routine の各経路への影響がない。commit policy を実装する場合に必要な整合の検討が不要になる。
- 現在 `develop` は push 済みであり、`rebase -i` による書き換えは force-push を伴う。PJR-BJ97 で整備した branch protection とも衝突する。書き換えではなく、昇格時に扱う。
- 方式を今確定しないのは、squash merge に祖先関係が記録されないという副作用があるためである。次回の昇格で develop の過去コミットが未マージ扱いとなり競合が繰り返される。実際に `main` から `develop` への逆マージも履歴にあり、双方向のマージが行われている。検証なしに採用すると運用が壊れる。

### 判断材料（調査済み）

- 全コミット2,935件のうち、register の遷移コミットは305件で**約10%**を占める。内訳は `start` 90件、`review` 74件、`wait` 35件、`close` 21件などである。
- 1つの項目で最大10件の遷移コミットが発生している（PJR-CMYX）。多くの項目は `start` → `review` → `close` の3件前後だが、失敗や再実行を挟むと増える。
- exec 側は既に追記型 event を持ち、606件すべてが git 管理下にある。遷移のたびにファイルが追加され、コミットされている。register も同じ設計にすると、**コミット数は減らないまま小さなファイルが増える**。
- したがって PJR-TPY9 単独では当初の課題（Git 履歴の信号対雑音比）は解決しない。event が履歴を保持することでコミット頻度を下げられる、というのが本項目の前提である。
- 現在のコミットは、成果物の変更（`feat` / `fix` / `docs`）と遷移（`exec(register ...)`）が交互に並ぶ。1つの todo の実行で、start・成果物・review・close の4件前後が連続する。

## 5. 承認

| 項目     | 内容                                                        |
| -------- | ----------------------------------------------------------- |
| 決定者   | PO                                                          |
| 決定日   | 2026-08-28                                                  |
| 承認方式 | commit                                                      |
| 証跡     | 本個票を決定済みにした commit（`docs(register): PJR-T7ZQ`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `register` の全遷移コマンド、`exec run --register` の実行経路、routine による自動実行、worktree での並行実行、Gitブランチ標準のコミット規約、オーケストレーターの運用手順 |
| 必要な対応 | 決定後に実装を別途起票する。本項目は方式の選定に限る。実装では中断時の扱いと、コミット漏れを検出する手段を含める                                                          |
| 追跡先     | 前提は PJR-TPY9（Register event と履歴再構成）。まとめ方の方式確定は PJR-199G。第3段の PJR-5W8C も同じ event を同期対象とする                                             |

## 7. 関連ドキュメント

- 前提となる第1段: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 第3段: [[prj-0001:pjr-5w8c-register-github-integration|PJR-5W8C RegisterとGitHub Issues/Projectsの連携を実装する]]
- コミット方針の現行規約: [[specdojo:git-branching-standard|Gitブランチ標準]]
- Register の運用: [[specdojo:register-operation-guide|Register運用ガイド]]
