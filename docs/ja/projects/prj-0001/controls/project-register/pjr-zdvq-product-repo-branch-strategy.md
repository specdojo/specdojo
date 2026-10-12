---
specdojo:
  id: prj-0001:pjr-zdvq-product-repo-branch-strategy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: BA
  registered_at: "2026-10-12T08:47:02Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-12T08:48:09Z"
  conclusion: 選択肢 B。プロダクトリポジトリにブランチ戦略を求めず、プロダクト側のルールで決めた統合先だけを受け取る。merge の方式は問わず、追跡は trace key（Refs:）を主にする。ガイドへの節の追加と、足りない機能 2 つは派生項目で扱う
---

# PJR-ZDVQ プロダクトリポジトリのブランチ戦略を SpecDojo は求めない

## 1. 背景

別リポジトリ構成で、SpecDojo はプロダクトリポジトリにブランチ戦略を求めず、プロダクト側のルール（GitHub flow・git flow など）で決めた統合先だけを受け取る。merge の方式は問わず、追跡は SHA ではなく trace key（Refs:）を主にする

### 1.1. 経緯（2026-10-12）

- prj-0002 では `specdojo-lp` の `integration_branch` を `main` にしていた。exec の統合が項目ごと・再実行ごとに `main` の first-parent へ並び（PJR-HEPK は 4 回）、人の手直しも `main` へ直接入って、`main` が見づらくなった。
- orchestrator は当初、プロジェクトリポジトリと同じく `project/<id>/develop` をプロダクトリポジトリにも置く案を出した。利用者から、プロダクト側は SpecDojo のルールを強要せず、GitHub flow や git flow などプロダクト側のルールで運用できるほうが参入障壁が下がるとの指摘があった。
- あわせて、プロダクトのブランチ名に SpecDojo の project ID を入れるのは好ましくないこと、squash merge や rebase merge でもプロジェクトリポジトリへの参照が残るかが問われた。

### 1.2. 今の仕組み

- 統合先は `repos[].integration_branch` で任意のブランチにできる（[[specdojo:specdojo-config-reference]] の `repos のキー`）。exec branch はその先端から作り、runner がローカルで merge commit により統合する。
- プロダクト側の exec branch 上の commit と merge commit には `Refs: <project-id>:<item-id>` が付く。プロジェクト側の result には trace key と、統合時の commit snapshot（SHA）を記録する（[[specdojo:docs-structure-guide]] の `複数リポジトリの worktree と統合順序`）。
- merge の方式ごとの追跡の残り方は次のとおり。

| merge の方式 | `Refs:`（プロダクト → プロジェクト）                                                                     | 記録した SHA（プロジェクト → プロダクト）                  |
| ------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| merge commit | 残る                                                                                                     | `main` の祖先として残る                                    |
| rebase merge | exec branch 上の commit の `Refs:` は残る。runner の merge commit は直線化で落ちる                       | SHA が変わり、`main` の祖先ではなくなる                    |
| squash merge | GitHub の設定次第。「Pull request title」だけでは消え、「Pull request title and commit details」なら残る | `main` の祖先ではなくなる。GitHub では PR の参照から辿れる |

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                | 利点                                       | 懸念                                                                               |
| ------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| A      | プロダクトリポジトリにも `project/<id>/develop` を置き、`main` への昇格を merge commit 1 件にする   | プロジェクトリポジトリと同じ型で説明できる | プロダクト側の既存の運用と衝突し、導入の障壁になる。ブランチ名に project ID が入る |
| B      | ブランチ戦略を求めず、プロダクト側のルールで決めた統合先だけを受け取る。追跡は trace key を主にする | プロダクト側の運用を変えずに導入できる     | GitHub flow ではトピックごとに `integration_branch` を書き換える手間がある         |

## 3. 決定内容

選択肢 B を採る。

- SpecDojo は、プロダクトリポジトリにブランチ戦略を求めない。求めるのは、プロダクト側のルールで決めた統合先（`integration_branch`）だけとする。ブランチ名に SpecDojo の project ID を入れることも求めない。
- `main` への取り込み方と merge の方式（merge commit・squash merge・rebase merge）は、プロダクト側のルールに任せる。
- 追跡は、SHA ではなく trace key（`Refs: <project-id>:<item-id>`）を主にする。squash merge を使う場合は、squash の commit メッセージに `Refs:` の行を残すよう案内する（GitHub の設定を「Pull request title and commit details」にするなど）。
- ブランチワークフローガイドに、プロダクトリポジトリの節を加え、GitHub flow と git flow での `integration_branch` の選び方を例として示す。
- 次の 2 つは、足りない機能として別の項目の候補にする。
  - run ごとに統合先を指定できるようにする（例: `--integration-branch <repo>=<branch>`）。
  - プロダクト側を merge せず exec branch を残し、PR をプロダクト側で作る方式を選べるようにする。

## 4. 採択理由

- プロダクトリポジトリは利用者が既に持ち、運用が決まっていることが多い。SpecDojo のルールを持ち込むと、導入の障壁になる。
- 統合先が設定で選べるため、git flow（`develop`）には今の仕組みのまま合う。GitHub flow は、トピックのブランチを統合先にすれば暫定的に運用できる。
- trace key はメッセージに残るため、rebase merge では常に、squash merge でも設定やメッセージの扱いで残せる。SHA は merge の方式で失われる。

## 5. 承認

| 項目     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 決定者   | BA                                                                    |
| 決定日   | 2026-10-12                                                            |
| 承認方式 | commit                                                                |
| 証跡     | register event `close`（`events/pjr-zdvq.yaml`）と本個票の遷移 commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | [[specdojo:branch-workflow-guide]]、[[specdojo:specdojo-config-reference]] の `repos` の説明、別リポジトリ構成の利用者 |
| 必要な対応 | ブランチワークフローガイドへのプロダクトリポジトリの節の追加、足りない機能 2 つの起票                                  |
| 追跡先     | 本項目から派生する todo。prj-0002 では `specdojo-lp` を GitHub flow で運用する                                         |

## 7. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: `specdojo-lp` の `main` に統合が並んだ項目。
- [[specdojo:branch-workflow-guide]]: プロジェクトリポジトリのブランチ運用。
- [[specdojo:specdojo-config-reference]]: `repos[].integration_branch`。
- GitHub の squash merge の設定: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests>
