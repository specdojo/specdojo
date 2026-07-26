---
specdojo:
  id: prj-0001:pjr-0138-register-add-on-integration-branch
  type: project
  status: ready
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  based_on:
    - prj-0001:pjr-0137-register-id-uniqueness
---

# PJR-0138 起票を統合ブランチへ委譲するregister add

## 1. 概要

PJR-ID の重複と `pjr-index.md` 末尾での merge conflict は、採番と行追加が作業 branch 上で分散して行われることに起因する。起票のたびに統合ブランチへ checkout し直す運用は、exec が worktree 単位で走る前提では退避コストが高く、気づいた時点で登録するという登録簿の利点を損なう。`specdojo register add` が統合ブランチの worktree へ登録行だけを書き込んで commit することで、作業 worktree を離れずに ID を予約できるようにする。

個票と実作業は従来どおり作業 branch 側で行い、作業 branch は `pjr-index.md` を変更しない。これにより表末尾の追記競合が構造的に発生しなくなる。既存行の状態遷移は離れた行の編集となるため、通常は自動 merge される。

本項目は [[prj-0001:pjr-0137-register-id-uniqueness]] の重複検知と再採番を先に導入し、並行起票の頻度が実際に問題となった段階で着手する。

## 2. 完了条件

- 作業 worktree から `specdojo register add` を実行して、branch を切り替えずに PJR-ID を予約できる。
- 予約時に統合ブランチの worktree へ書き込まれるのは `pjr-index.md` の登録行のみで、個票は作成しない。
- 割り当てられた PJR-ID が標準出力へ返り、後続の個票作成に利用できる。
- 統合ブランチの worktree のパスと commit 方針を設定から解決でき、既定値がドキュメント化されている。
- 統合ブランチの worktree が存在しない、未 commit の変更がある、既存 ID と競合するなど予約できない状態では、書き込みを行わずにエラーで終了する。
- 予約の commit は登録行の追加のみを対象とし、統合ブランチ側の他の変更を巻き込まない。
- 従来どおり作業 branch 上で完結して起票する動作も引き続き選択できる。
- 予約から個票作成・実作業・状態遷移までの運用手順が運用ガイドに記載されている。
- 予約成功、worktree 不在、未 commit の変更あり、既存 ID との競合を自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                                            |
| --- | ------------------------------------------------------------ | ---- | ---- | --------------------------------------------------------------- |
| 1   | 統合ブランチ worktree の常設方針と設定項目を決める           | ARC  | done | `run.register_integration_branch`（既定 `main`）で解決          |
| 2   | 別 worktree の pjr-index.md へ登録行を追記する経路を実装する | ARC  | done | `register add --reserve`。個票は作成しない                      |
| 3   | 予約 commit の生成とスコープ限定を実装する                   | ARC  | done | pathspec commit で pjr-index.md のみを対象化                    |
| 4   | 予約不可状態の検出とエラー処理を実装する                     | ARC  | done | worktree 不在・未 commit・ID 競合を書き込み前に区別してエラー化 |
| 5   | 既存の branch 内完結モードとの選択方法を整理する             | ARC  | done | `--reserve` 未指定時は既定の branch 内完結挙動を維持            |
| 6   | テストを追加し、運用ガイドとコマンド一覧へ反映する           | ARC  | done | `register-reserve.test.ts` と両ガイドへ反映                     |

## 4. 対応結果

- `specdojo register add` に `--reserve` モードを追加し、作業 worktree を離れずに統合ブランチの worktree へ登録行だけを追記・commit して PJR-ID を予約できるようにした。
- 統合ブランチは `run.register_integration_branch`（既定 `main`）で設定から解決し、`--integration-branch` / `--integration-worktree` で上書きできる。
- 予約 commit は `pjr-index.md` の pathspec に限定し、統合ブランチ側の他の変更を巻き込まない。個票は作成せず、割り当て PJR-ID を標準出力の最終行へ返す。
- worktree 不在・`pjr-index.md` の未 commit 変更・ID 競合は書き込み前にエラー終了する。`--reserve` 未指定時は従来の branch 内完結挙動を維持する。
- 予約起票の運用手順を [[specdojo-register-operation-guide|SpecDojo登録簿運用ガイド]] と [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]] へ記載した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0137-register-id-uniqueness|pjr-indexの重複ID検知と再採番]]
- [[pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo-register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]]
