---
specdojo:
  id: prj-0001:pjr-199g-promotion-commit-consolidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
- PJR-TPY9 の完了と移行により、`register history` は765件中761件を個票内の event から読む。Git 履歴へのフォールバックは PJR-TPY9 自身の4件だけである。コミットをまとめても各遷移の発生日時・actor・理由は失われない。
- `Merge remote-tracking branch 'origin/main'` という main から develop への逆マージが履歴にある。双方向のマージが行われている。
- squash merge は祖先関係を記録しないため、long-lived branch 同士では次回のマージで競合が繰り返される。
- `git-branching-standard.md` は `develop → main` 昇格を承認ゲートの境界と定めており、`main` には branch protection と CODEOWNERS を要求している（PJR-BJ97 で整備済み）。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                              |
| --- | ----------------------------------------------------- | ---- | ---- | --------------------------------- |
| 1   | まとめ方の候補を比較し、方式を決めて理由を記録する    | ARC  | open | 祖先関係と逆マージへの影響を含む  |
| 2   | 手順を `git-branching-standard.md` へ反映する         | ARC  | open | 管理者が実施できる粒度            |
| 3   | 使い捨て clone で昇格を再現し粒度と逆マージを確認する | ARC  | open | 実昇格は行わない。push は人の操作 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-t7zq-register-commit-policy|PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する]]
- 前提となる第1段: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 反映先の規約: [[specdojo:git-branching-standard|Gitブランチ標準]]
- 承認ゲートの整備: [[prj-0001:pjr-bj97-codeowners-and-branch-protection|PJR-BJ97 CODEOWNERS 未整備によりPR承認の職務分離が強制されていない]]
