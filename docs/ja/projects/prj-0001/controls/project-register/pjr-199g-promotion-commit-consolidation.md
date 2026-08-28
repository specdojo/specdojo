---
specdojo:
  id: prj-0001:pjr-199g-promotion-commit-consolidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-27T23:40:53Z"
  due_on: "2026-10-31"
  register_events:
    - v: 1
      id: reg_676d6ad7bda6ebfe87e39692932fbe66
      ts: "2026-08-27T23:45:32Z"
      action: add
      actor: naoji3x
      from_status: null
      to_status: open
      reason: "docs(register): PJR-T7ZQ を決定しPJR-199Gを起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: develop から main への昇格時にコミットをまとめる方式を確定する
        - field: description
          from: ""
          to: PJR-T7ZQ の決定により、遷移時の commit policy は変更せず、雑音の削減は develop から main への昇格境界で行うこととした。まとめ方の具体は検証を伴うため本項目で確定する。squash merge は祖先関係が記録されず、次回の昇格で develop の過去コミットが未マージ扱いとなり競合が繰り返される。main から develop への逆マージも履歴にあるため、双方向のマージが成立する方式を選ぶ必要がある。push 済み履歴の書き換えは行わない。PJR-TPY9 の完了後に有効となる。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-28"
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
      legacy_commit: 6dd9ca7d550ed466e08b09e59decfc5dbdf35dc9
    - v: 1
      id: reg_0296306e704c47acbef46dd31deca571
      ts: "2026-08-28T10:49:20Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_676d6ad7bda6ebfe87e39692932fbe66
---

# PJR-199G develop から main への昇格時にコミットをまとめる方式を確定する

## 1. 概要

PJR-T7ZQ の決定により、遷移時の commit policy は変更せず、雑音の削減は develop から main への昇格境界で行うこととした。まとめ方の具体は検証を伴うため本項目で確定する。squash merge は祖先関係が記録されず、次回の昇格で develop の過去コミットが未マージ扱いとなり競合が繰り返される。main から develop への逆マージも履歴にあるため、双方向のマージが成立する方式を選ぶ必要がある。push 済み履歴の書き換えは行わない。PJR-TPY9 の完了後に有効となる。

## 2. 完了条件

- `develop → main` の昇格でコミットをまとめる方式が決まり、理由が記録されている。squash merge、昇格前の一時ブランチでの整理、遷移コミットのみの除外などを比較する。
- **祖先関係の扱いが明確である**。squash merge を採る場合、次回の昇格で過去コミットが未マージ扱いになる問題への対処を含める。
- **`main` から `develop` への逆マージが引き続き成立する**。現在の履歴には双方向のマージがあり、これを壊さない。
- push 済み履歴を書き換えない。force-push を伴う方式は採らない。
- 手順が文書化され、リポジトリ管理者が実施できる。`git-branching-standard.md` へ反映する。
- **実リポジトリの使い捨て clone で方式を検証する**。実際の `develop → main` 昇格そのものは行わない。`main` は branch protection の対象であり、push は人の操作だからである。clone 上で昇格を再現し、`main` の履歴が意図した粒度になること、その後の `main → develop` 逆マージが成立すること、さらに次回の昇格で過去コミットが未マージ扱いにならないことを確認する。検証の手順と結果を記録する。
- **まとめた後も `register history` が全項目を復元できることを確認する**。移行済みの individual event は個票内にあるため commit 粒度に依存しないが、実際に確認する。
- PJR-TPY9 の完了後に実施する。完了前にまとめると `register history` の再構成が壊れる（PJR-TPY9 は完了済み、移行も実施済みである）。

### 本項目で行わないこと

- 実際の `develop → main` 昇格。方式が決まった後、リポジトリ管理者が実施する。
- push および force-push。
- 過去に push 済みの履歴の書き換え。

### 調査済みの事実

- `main` は現在 `--no-ff` マージで develop の全コミットを取り込んでおり、遷移コミットもそのまま載っている。1つの項目で `start` / `wait` / `review` / `close` の4件前後が並ぶ。
- 全コミット2,935件のうち register の遷移コミットは305件で約10%を占める。
- PJR-TPY9 の完了と移行により、検証時点の `register history` は770件中766件を個票内の event から読む。Git 履歴へのフォールバックは PJR-TPY9 自身の4件だけである。この4件を復元するには、該当 commit が現在の履歴から到達可能でなければならない。
- `Merge remote-tracking branch 'origin/main'` という main から develop への逆マージが履歴にある。双方向のマージが行われている。
- squash merge は祖先関係を記録しないため、long-lived branch 同士では次回のマージで競合が繰り返される。
- `git-branching-standard.md` は `develop → main` 昇格を承認ゲートの境界と定めており、`main` には branch protection と CODEOWNERS を要求している（PJR-BJ97 で整備済み）。

## 3. 作業内容

### 3.1. 候補比較

| 方式                                      | `main` の見え方                        | 祖先関係・次回昇格                                                                      | `register history`                       | 判断 |
| ----------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- | ---- |
| `--no-ff` merge と first-parent 表示      | first-parent では昇格 merge commit 1件 | `develop` の全 commit が `main` の祖先になり、逆マージと次回昇格を通常の merge で扱える | Git fallback を含む全履歴を復元できる    | 採用 |
| squash merge                              | `main` には集約 commit 1件だけ         | `develop` の commit が祖先にならず、次回も未マージとして残る                            | PJR-TPY9 の Git fallback 4件を失う       | 却下 |
| 一時ブランチで rebase / cherry-pick       | 選別後の commit だけを `main` に置ける | commit ID を作り直し、元の `develop` との祖先関係を記録しない                           | squash と同じく Git fallback を失う      | 却下 |
| register 遷移 commit だけを除外して再構成 | プロダクト commit だけを並べられる     | 選別した commit を作り直す必要があり、双方向 merge の基準にならない                     | 遷移 commit にある個票の現在値も欠落する | 却下 |

採用方式では commit を物理的に削除しない。`develop → main` の昇格を必ず `--no-ff` の merge commit で記録し、プロダクト変更を追うときは `main` の first-parent 履歴を正規の表示とする。これにより、細かな commit は監査可能な DAG に保持しながら、昇格単位を1行で追える。通常の `git log` には `develop` の詳細 commit も表示されるため、「まとめる」とは first-parent 上での論理的な集約を意味する。

### 3.2. 使い捨て clone での検証

実リポジトリをローカルの一時ディレクトリへ clone し、`main` の `b4203fc0` と `project/prj-0001/develop` の `50374a66` を起点に再現した。実リポジトリの branch、commit、設定は変更せず、push も行っていない。

| 確認項目                       | 結果                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1回目の `--no-ff` 昇格         | tree は `develop` と一致した。`main` から増えた278 commitのうち first-parent は昇格 merge commit 1件だった                              |
| 祖先関係                       | 昇格前の `develop` について `git rev-list <develop> --not <main>` は0件となった                                                         |
| `main → develop` と2回目の昇格 | `main` 側と `develop` 側へ各1変更を追加して逆マージ後に再昇格し、競合なく成功した。merge-base は2回目の `develop` 先端と一致した        |
| 2回目の tree と祖先関係        | tree は `develop` と一致し、2回目の `develop` についても未マージ commit は0件だった                                                     |
| `register history`             | 昇格前後のJSONが一致した。770 event・261項目を復元し、内訳は個票 event 766件、PJR-TPY9 の Git fallback 4件だった                        |
| squash merge の対照実験        | tree は一致したが277 commitが未マージで、merge-base は昇格前の `main` のままだった。履歴は766件となり、PJR-TPY9 の fallback 4件を失った |

### 3.3. 実施状況

| No  | 作業                                                  | 担当 | 状態 | メモ                                         |
| --- | ----------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | まとめ方の候補を比較し、方式を決めて理由を記録する    | ARC  | done | `--no-ff` merge と first-parent 表示を採用   |
| 2   | 手順を `git-branching-standard.md` へ反映する         | ARC  | done | 管理者向けの確認条件と禁止方式を明記         |
| 3   | 使い捨て clone で昇格を再現し粒度と逆マージを確認する | ARC  | done | 実昇格・push・push済み履歴の書き換えは未実施 |

## 4. 対応結果

- `develop → main` は squash / rebase で commit を作り直さず、merge commit を必ず作る方式に確定した。昇格単位の履歴は `git log --first-parent` で参照する。
- [[specdojo:git-branching-standard|Gitブランチ標準]]へ、昇格方式、祖先関係の完了確認、first-parent の位置付け、squash / rebase merge の禁止を反映した。
- [[specdojo:branch-workflow-guide|ブランチワークフローガイド]]へ、管理者が実施する事前同期、PR の merge 方式、昇格後の祖先確認、`main → develop` 同期、次回差分確認の手順を反映した。
- 使い捨て clone で2回の昇格と逆マージを再現し、意図した first-parent 粒度、tree の一致、祖先関係、`register history` 770件の完全一致を確認した。対照実験により squash merge では完了条件を満たさないことも確認した。
- 実際の昇格、push、force-push、push済み履歴の書き換えは行っていない。残課題はなく、実昇格はリポジトリ管理者が規約とガイドに従って実施する。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-t7zq-register-commit-policy|PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する]]
- 前提となる第1段: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 反映先の規約: [[specdojo:git-branching-standard|Gitブランチ標準]]
- 承認ゲートの整備: [[prj-0001:pjr-bj97-codeowners-and-branch-protection|PJR-BJ97 CODEOWNERS 未整備によりPR承認の職務分離が強制されていない]]
