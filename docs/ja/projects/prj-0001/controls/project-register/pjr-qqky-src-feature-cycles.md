---
specdojo:
  id: prj-0001:pjr-qqky-src-feature-cycles
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: low
  owner: ARC
  registered_at: "2026-10-17T08:39:38Z"
  due_on: null
  completed_at: "2026-10-17T08:45:37Z"
  conclusion: exec の汎用の部品のうち他の機能が使う部分を src/shared へ移し、残る循環を 1 件ずつ直し、循環がなくなった組から依存の向きの規則を足す
---

# PJR-QQKY src の機能どうしの循環する依存をほどく方針を決める

## 1. 背景

[[prj-0001:pjr-x8y9-src-dependency-direction-rules]] の調査（2026-10-17）で、src の機能どうしの循環する依存が 6 組見つかった。

| 組                  | 向き（ファイル数） | 主な import 先                                                                               |
| ------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `exec` ⇄ `register` | 7 ⇄ 8              | `register` → `exec/shared`（6）・`exec/worktree`（3）・`exec/worktree-ops`・`exec/slot-lock` |
| `exec` ⇄ `schedule` | 6 ⇄ 7              | `schedule` → `exec/shared`（5）・`exec/types`（4）。`exec` → `schedule/phase-sets`（6）      |
| `exec` ⇄ `grade`    | 2 ⇄ 3              | `grade` → `exec/shared`（3）・`exec/schedule-index`。`exec` → `grade/result`（2）            |
| `exec` ⇄ `job`      | 1 ⇄ 2              | `job` → `exec/shared`・`exec/types`・`exec/plans`・`exec/worktree`                           |
| `grade` ⇄ `review`  | 6 ⇄ 1              | `review` → `grade/result`（1）                                                               |
| `catalog` ⇄ `docs`  | 7 ⇄ 1              | `docs` → `catalog/build`（1）                                                                |

`exec` ⇄ 他の機能の循環の多くは、`exec` の中にある汎用の部品（`exec/shared` の補助関数、`exec/types` の共通の型、`exec/worktree` の git と worktree の操作）を他の機能が使っていることが原因である。

## 2. 検討した選択肢

| 選択肢 | 内容                                                               | 利点                                           | 欠点                                                       |
| ------ | ------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| A      | 循環を残す                                                         | 変更が要らない                                 | 依存の向きを規則で守れず、機能の境界が曖昧なままになる     |
| B      | `exec` の汎用の部品を `src/shared/` へ移し、残った数件を個別に直す | 原因に対して直接効き、多くの循環が一度に解ける | `exec` の構成が変わり、変更の量が多い                      |
| C      | 循環ごとに、依存の向きを逆にする（依存の注入など）で個別に直す     | 移動が少ない                                   | 同じ原因の循環を何度も扱うことになり、注入の仕組みが増える |

## 3. 決定内容

推奨のとおり、次のように決める。

1. 選択肢 B を採る。
2. `src/shared/` へ移すのは、他の機能から使われている汎用の部分に限る。`exec/shared` の補助関数のうち exec 以外から使われるもの、`exec/types` のうち他の機能が使う共通の型、`exec/worktree` の git と worktree の操作のうち `register`・`job` が使うもの。exec だけが使う部分は `exec` に残す。
3. 移した後に残る循環（`register` → `exec/worktree-ops`・`exec/slot-lock`、`job` → `exec/plans`、`grade` → `exec/schedule-index`、`exec` → `grade/result`）は 1 件ずつ見て、`shared` へ移すか、依存の向きを逆にするかを決める。
4. `review` → `grade/result` と `docs` → `catalog/build` は、それぞれ 1 件ずつ直す（`grade/result` の型を `review` か `shared` へ、`catalog/build` から使う処理を `docs` か `shared` へ移す）。
5. 循環がなくなった組から、依存の向きの規則（例: `register` は `exec` を import しない）を ESLint に足す。規則は循環がなくなった後に足し、それまでは足さない。
6. 進める順番は、効果の大きい 2（汎用の部品の移動）、3（残りの数件）、4（小さい 2 件）、5（規則）とする。
7. 移す・直すのは構造だけとし、動作は変えない。各件で全コマンドの `--help` の一致を確かめ、runner のコードを含む件では `exec run` を 1 回流す。

## 4. 採択理由

- 循環の多くは exec の汎用の部品という同じ原因から生じており、原因の部品を shared へ移せば一度に解ける。
- 依存の注入で 1 つずつ逆にするより、仕組みが増えず、構造が分かりやすい。
- 規則を循環がなくなった後に足すことで、規則を入れた時点で違反がない状態を保てる。

## 5. 承認

| 項目     | 内容                                                                   |
| -------- | ---------------------------------------------------------------------- |
| 決定者   | 利用者（PO）                                                           |
| 決定日   | 2026-10-17                                                             |
| 承認方式 | orchestrator との会話で、推奨の 7 点を「推奨でお願いします」として承認 |
| 証跡     | orchestrator との会話（2026-10-17）                                    |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 影響範囲   | `src/exec/`・`src/shared/`・`src/register/`・`src/schedule/`・`src/grade/`・`src/job/`・`src/review/`・`src/catalog/`・`src/docs/`、`eslint.config.js` |
| 必要な対応 | 決定後に、汎用の部品の移動、残りの循環、小さい 2 件、依存の向きの規則の todo を起票する                                                                |
| 追跡先     | PJR-GBWW（汎用の部品の移動）、PJR-E025（残りの循環）、PJR-Z4PM（小さい 2 件）、PJR-WSET（依存の向きの規則）                                            |

## 7. 関連ドキュメント

- [[prj-0001:pjr-x8y9-src-dependency-direction-rules]]: 循環が見つかった調査と 1 段目の規則。
- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: src のサブディレクトリの決定。
