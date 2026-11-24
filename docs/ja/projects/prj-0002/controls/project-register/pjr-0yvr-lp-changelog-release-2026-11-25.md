---
specdojo:
  id: prj-0002:pjr-0yvr-lp-changelog-release-2026-11-25
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-24T23:10:42Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-TAK7
---

# PJR-0YVR specdojo-lp の公開済み変更を CHANGELOG の 2026-11-25 節へ移す

## 1. 概要

PR #3 の本番公開を受け、LP の CHANGELOG の Unreleased にある 2 件を 2026-11-25 の節へ移し、次の Unreleased を残す

## 2. 入力

- PR #3（develop → main）は 2026-11-24T23:06:12Z（日本時間 2026-11-25 08:06）に merge commit で main へ取り込まれ、マージコミットは 7a5b7d70e07c50e66d76c0e34dfebd60b13097ef である。main と develop の tree は同じ（a4d02ed826）。
- main の Workers Builds（Workers Builds: specdojo-lp）は 2026-11-24T23:07:56Z に success で完了し、<https://specdojo.org/> は HTTP 200 を返す。
- PO の決定により、公開日は日本時間の 2026-11-25 とする。
- 公開した変更は CHANGELOG の Unreleased の「追加」にある 2 件（LICENSE と README の節の追加、package.json の license の記載）である。
- CHANGELOG の更新は specdojo-lp の README の「変更履歴の更新」の決まりに従う。

## 3. 完了条件

- `specdojo-lp/CHANGELOG.md` の `Unreleased` にある公開済みの 2 件を、内容と分類（「追加」）を保って `## 2026-11-25` の節へ移す。公開済みの範囲は、PR #3 の merge commit（`7a5b7d7`）に含まれる変更と照らして確かめ、未公開の項目が見つかれば `Unreleased` に残す。
- `## 2026-11-25` の節は既存の `## 2026-11-02` より上に置き、その上に次の変更を記録できる空の `## Unreleased` を残す。公開日には決定済みの 2026-11-25 を使い、SpecDojo 本体や `package.json` の版と結び付けない。
- 変更してよいのは、LP の `CHANGELOG.md` と本個票の対応結果だけとする。`## 2026-11-02` の節、画面、設定、依存関係、README は変えない。`main` への統合、`git push`、PR の作成は行わない。
- LP で `npm run lint:md` と `npm run format:check` が成功する。runner に設定された親の検証を通す。
- 公開範囲の根拠、変更内容、検証結果、残課題を本個票の対応結果に残す。pipeline で申し送りがあれば `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ |
| --- | ------------------------------------------------- | ---- | ---- | ---- |
| 1   | PR #3 の公開範囲と `Unreleased` の項目を照合する  | BA   | open | -    |
| 2   | 公開済み項目を日付の節へ移し、次の節を残す        | BA   | open | -    |
| 3   | LP の文書検査と親の検証を通し、対応結果を記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0002:pjr-tak7-lp-public-license-readme]]: 公開した変更のもとになった項目。
- [[prj-0002:pjr-rwqv-lp-changelog]]: 変更履歴の作成と本番公開時の更新ルール。
- `specdojo-lp:CHANGELOG.md`: 公開日を記録する対象。
