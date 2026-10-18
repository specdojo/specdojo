---
specdojo:
  id: prj-0001:pjr-h72a-register-approach-execution
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-10-17T12:11:07Z"
  due_on: null
  completed_at: "2026-10-17T12:18:16Z"
  conclusion: 個票に approach と対象を書き、exec run --register が schedule と同じ plan の作り方を使う。DCT の done_criteria を基本に個票の完了条件を加え、owner は個票の owner、kata は id と保守の approach で指定する。exec run --deliverable は互換のため残す
---

# PJR-H72A register の todo から approach を使って成果物と kata を作る・直す方針を決める

## 1. 背景

approach（`fully-guided`・`recipe-guided`・`retrofit`・`rulebook-maintenance` など。`src/shared/agent-types.ts` の `Approach`）を使った成果物の作成と、kata（rulebook・recipe・sample・template）の生成・修正は、schedule のタスクからしか実行できない。利用者から、register の todo から実行できるようにする提案があった（2026-10-17）。

2026-10-17 時点の経路:

| 経路                                                      | approach と kata の扱い                                                                                                                                                                                                                                                            | 足りないもの                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| schedule のタスク                                         | `sch-strategy` の approach から plan を作り、kata の参照と成果物カタログ（DCT）の `done_criteria` を plan に入れる（`src/exec/plans-generation.ts`）。kata の保守は、成果物に対応する kata を `rulebook-maintenance` などの approach で直す（`src/schedule/strategy-profiles.ts`） | 実行するには schedule のタスクにする必要がある          |
| `exec plan --deliverable <localId> --approach <approach>` | schedule なしで同じ作り方の plan を作れる                                                                                                                                                                                                                                          | plan を作るだけ                                         |
| `exec run --deliverable <localId>`                        | 作業場所でそのまま実行する（`src/exec/run/in-place.ts`）                                                                                                                                                                                                                           | worktree・統合・review を使わず、登録簿の状態も追わない |
| `exec run --register`                                     | 個票の完了条件から plan を作り、worktree・統合・review・記帳がそろっている                                                                                                                                                                                                         | approach と kata の参照がない                           |

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                       | 利点                                                       | 欠点                                                                 |
| ------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| A      | 現状のまま（approach の作業は schedule のタスクにする）                                    | 変更が要らない                                             | 1 件の成果物や kata を直すだけでも schedule のタスクを作る必要がある |
| B      | `exec run --deliverable` を拡張し、worktree と登録簿の追跡を足す                           | 既存の入口を使える                                         | register の実行と同じ仕組みを、別の入口に作り直すことになる          |
| C      | 個票に approach と対象を書き、`exec run --register` が schedule と同じ plan の作り方を使う | worktree・統合・review・記帳をそのまま使え、登録簿で追える | 個票の項目と plan の作り方の分岐が増える                             |

## 3. 決定内容

推奨のとおり、次のように決める。

1. 選択肢 C を採る。
2. 個票の frontmatter に `approach` と、対象の `targets`（成果物の local_id、または kata の id）を書けるようにする。`register add --approach <approach> --target <id>` でも指定できるようにする。
3. `exec run --register` は、個票に `approach` があれば、schedule のタスクと同じ plan の作り方（approach のテンプレート、kata の参照、DCT の `done_criteria`）を使う。個票の完了条件は、それに加える条件として plan に載せる。
4. DCT の `done_criteria` と個票の完了条件は両方を載せる。DCT を基本とし、個票の完了条件を追加の条件とする。
5. owner の役割は個票の `owner` を使い、schedule の `owner_rules` は使わない。
6. kata の生成・修正は、kata の id（`specdojo:pjr-rulebook` など）を対象にし、approach（`rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance`）で rulebook・recipe・sample・template のどれかを決める。
7. approach と対象の組み合わせが合わない場合（成果物に `rulebook-maintenance`、kata に `fully-guided` など）は、起票と実行の時点でエラーにする。
8. 既存の `exec run --deliverable`（in-place）は互換のために残し、ガイドでは register の経路を勧める。
9. 実装は、利用者向けの改善（PJR-Y79W・PJR-B3XQ・PJR-8GQ4）の後に行う。

## 4. 採択理由

- worktree・統合・review・登録簿の記帳がそろった register の実行をそのまま使え、approach の作業を 1 件ずつ登録簿で追える。
- plan の作り方は schedule と共通にするため、approach のテンプレートと kata の参照を二重に持たない。
- 組み合わせの誤りを起票の時点で止めることで、誤った plan で agent を動かさない。

## 5. 承認

| 項目     | 内容                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| 決定者   | 利用者（PO）                                                                 |
| 決定日   | 2026-10-17                                                                   |
| 承認方式 | orchestrator との会話で、推奨の 9 点を「すべて推奨でお願いします」として承認 |
| 証跡     | orchestrator との会話（2026-10-17）                                          |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 個票の frontmatter と schema、`register add`、`exec run --register` の plan の生成（`src/exec/run/register-core.ts`・`src/exec/plans-generation.ts`）、関係するガイド |
| 必要な対応 | 個票の項目と schema、plan の生成（kata の対象を含む）、ガイドの 3 件の todo を起票した                                                                                |
| 追跡先     | PJR-ZJXQ（個票の項目と schema）、PJR-H06F（plan の生成）、PJR-4Z6N（ガイド）                                                                                          |

## 7. 関連ドキュメント

- [[specdojo:exec-config-guide]]: exec の設定。
- [[prj-0001:pjr-y79w-readme-lp-init-guide-alignment]]: 先に行う利用者向けの改善。
