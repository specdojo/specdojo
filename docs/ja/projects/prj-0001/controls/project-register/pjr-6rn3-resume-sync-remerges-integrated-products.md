---
specdojo:
  id: prj-0001:pjr-6rn3-resume-sync-remerges-integrated-products
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T19:51:47Z"
---

# PJR-6RN3 再開前の統合先の取り込みが統合済みのプロダクトの merge commit を作り直す

## 1. 課題内容

PJR-GENJ の再開前の統合先の取り込みが、統合済みのプロダクトの exec branch にも merge を作り、PJR-9KST の統合済みのリポジトリを作り直さない動作と食い違う。develop で両方を合わせた後、9KST の e2e 2 件（app2・project の失敗後の再開）が失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| スコープ     | `repos` を持つ project の、統合段の失敗からの再開と、develop の `src/exec-run.ts` の型検査 |
| スケジュール | develop で `npm test` と `npm run build` が通らず、以降の exec run と commit が止まる      |
| コスト       | 型の修正と、再開前の取り込みの対象の修正                                                   |
| 品質         | 再開で統合済みのプロダクトに不要な merge commit が作られ、統合済みの範囲の記録と食い違う   |
| 関係者       | 別リポジトリ構成の利用者                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | PJR-GENJ の再開前の統合先の取り込みが、統合済みのプロダクトの exec branch にも merge を作る。また PJR-9KST が `bookkeepingPaths` を関数に変え、PJR-GENJ は配列として使ったため、develop の `src/exec-run.ts` 6307 行で型エラー（TS2339）になっている                                                 |
| 対応策   | `bookkeepingPaths.map(` を `bookkeepingPaths().map(` に直す。再開前の取り込みは、pipeline state で統合済みのリポジトリを除外し、未統合のリポジトリだけに行う                                                                                                                                         |
| 依存事項 | [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]、[[prj-0001:pjr-9kst-multi-repo-resume-precheck-register-records]]                                                                                                                                                                       |
| 完了条件 | `npm run typecheck` と `npm run build` が通る。`tests/src/exec-register-pipeline-e2e.integration.test.ts` の「app2 の merge が失敗した後の再開」と「project の merge が失敗した後の再開」を含む `npm test` が全件通る。PJR-GENJ の「再開前に統合先を取り込む」動作は、未統合のリポジトリでは維持する |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]
- [[prj-0001:pjr-9kst-multi-repo-resume-precheck-register-records]]
