---
specdojo:
  id: prj-0001:pjr-exh2-product-repo-branch-only-integration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T08:54:11Z"
  due_on: "2026-10-31"
  block_reason: "parent validation failed: lint-md"
---

# PJR-EXH2 プロダクトリポジトリを merge せず exec branch を残す統合方式を選べるようにする

## 1. 概要

プロダクト側の統合はローカルの merge commit しかない。GitHub flow で PR によるレビューを必須にするプロダクトのため、プロダクト側は merge せず exec branch を残し、PR はプロダクト側で作る方式を repos の設定で選べるようにする

## 2. 完了条件

- `repos` の設定で、プロダクトリポジトリごとに統合方式を選べる。既定は従来どおりのローカルの merge commit とする。
- merge しない方式を選んだリポジトリでは、runner は exec branch に commit するが統合先へ merge しない。exec branch を残し、PR はプロダクト側で作る。
- _UNDECIDED_: exec branch を push するか、PR を作るか（`gh` を使うか）、worktree と exec branch の撤去の扱い、プロジェクト側の記帳（`review` への遷移と result）の扱いは、設計時に決める。認証情報の扱いを含むため、push と PR の作成は利用者の承認を要する。
- 上の未決の点は executor が決め、理由を本個票の対応結果と報告の `handoff` に書く。push と PR の作成は認証情報を扱うため本項目では実装せず、必要なら利用者の承認のもと別の項目で扱う（[[prj-0001:pjr-5w8c-register-github-integration]] と関わる）。
- result に、統合しなかったことと exec branch の名前、trace key が記録される。
- [[specdojo:specdojo-config-reference]] と [[specdojo:docs-structure-guide]] の `複数リポジトリの worktree と統合順序` に、方式の選び方と振る舞いが書かれている。
- 統合テストで、merge しない方式のリポジトリが統合先を変えず、exec branch が残ることを確認している。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                              |
| --- | ------------------------------ | ---- | ---- | ----------------------------------------------------------------- |
| 1   | 方式の設定と振る舞いを設計する | DEV  | done | `merge`（既定）と `branch-only`、撤去・記帳・再開の扱いを決定     |
| 2   | 実装し、テストと文書を更新する | DEV  | done | 設定・runner・trace・schema・統合テスト・ガイド・CHANGELOG を更新 |

## 4. 対応結果

- `repos[].integration_strategy` に `merge` / `branch-only` を追加した。省略時は既存のローカル merge commit を維持する。CLI と設定 schema の両方で不正値を拒否する。
- `branch-only` は runner が exec branch に commit した後、統合先へ merge せず保持する。プロダクト側のレビューで統合判断するため、統合先との競合や統合先 checkout の変更は検査せず、exec worktree の未 commit 変更は従来どおり停止理由にする。
- 設計時の未決事項は次のとおり決定した。push・PR 作成（`gh` を含む）は認証情報と外部への操作を伴うため実装せず、利用者が必要な承認のもとプロダクト側で行う。成功後は commit 済みの変更を branch で保全できるため全 worktree を撤去し、`branch-only` の branch は変更の有無によらず残す。失敗時は従来どおり worktree と branch を保持する。
- プロジェクト側はタスク成果のレビューへ進めるため、通常どおり `review` へ遷移し、記帳と result を統合する。プロダクト側の PR の承認・merge 完了を表す遷移ではない。生成する result の trace 表には `branch-only`（未統合）、exec branch 名、trace key と `not applicable (not integrated)` を記録し、merge SHA を捏造しない。register 項目の commit の `Refs: <project-id>:<item-id>` は従来どおり保持する。
- pipeline state に `branch-only` を追加し、再開時もプロダクトの統合先を exec worktree へ自動で取り込まない。同じ項目の新規実行で保持済み branch を残骸として強制削除しないよう停止する。再開するか、プロダクト側の作業完了後に branch を退避・削除する。既存の prune も未統合 branch を削除しない。
- [[specdojo:specdojo-config-reference|設定リファレンス]] と [[specdojo:docs-structure-guide|ドキュメント構成ガイド]] に設定方法・統合順序・撤去・再開・手動 PR 作成を追記し、CHANGELOG の Unreleased に記録した。
- 設定値と schema、state の保存・読込、result の記載、方式の混在、競合、変更なし、再開、撤去後と prune 後の branch 保持をテストに追加した。register pipeline の E2E は既存の既定方式に加えて `branch-only` でも、統合先不変・commit と Refs・result・`review` 遷移・worktree 撤去を確認する構成にした。
- 検証: 整形・設定と state の schema 検証・カタログ検証・登録簿の派生ビュー生成を executor で実施し、すべて成功した。カタログ検証は既存の参照先文書不足などの警告を出したが、終了コードは 0 だった。型検査・lint・unit / integration test など親検証 7 件は pipeline の指定に従い runner に委ねる。result 自体は executor では編集しない。
- 申し送り: 上記の設計判断と実装・検証内容を reporter / runner が result に反映する。統合後の実 agent CLI の運用確認は [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] で行う。保護された設定の変更は不要。未解決の設計判断はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: 派生元の決定。
- [[specdojo:docs-structure-guide]]: 複数リポジトリの統合順序。
- [[prj-0001:pjr-5w8c-register-github-integration]]: GitHub との連携。PR の作成と関わる。
