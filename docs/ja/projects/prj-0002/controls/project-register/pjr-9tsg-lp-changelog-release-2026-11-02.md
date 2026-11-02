---
specdojo:
  id: prj-0002:pjr-9tsg-lp-changelog-release-2026-11-02
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-02T11:05:22Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-RWQV
---

# PJR-9TSG specdojo-lp の公開済み変更を CHANGELOG の 2026-11-02 節へ移す

## 1. 概要

PR #1 の本番公開を確認できたため、LP の CHANGELOG.md の公開済み項目を 2026-11-02 の節へ移し、次の Unreleased を残す。

## 2. 入力

- PR #1 は 2026-11-02 に main へマージされ、マージコミットは 5c5f91ffcf5e012a96cfccda8d7295b31ade8f6a。Workers Builds は成功した。
- 本番の [SpecDojo](https://specdojo.org/) は HTTP 200 を返し、Kata・Waza・Ryu と小文字の `routine + job` が表示されることを確認した。
- README の運用に従い、実際の公開日 2026-11-02 で公開済み項目を記録する。

## 3. 完了条件

- `specdojo-lp/CHANGELOG.md` の既存の `Unreleased` にある公開済み項目を、内容と分類を保って `## 2026-11-02` の節へ移す。公開済みの範囲は PR #1 のマージコミットと本番ページの反映に照らして確認し、未公開の項目が見つかれば `Unreleased` に残す。
- 次の変更を記録できる `## Unreleased` の節を日付付きの節より上に残す。公開日には確認済みの 2026-11-02 を使い、SpecDojo 本体や `package.json` の版と結び付けない。
- 変更対象は LP の `CHANGELOG.md` と本個票の対応結果に限定する。画面、設定、依存関係、README の公開ルールは変更しない。`main` への統合、公開、`git push`、PR 作成は行わない。
- LP の Markdown lint と変更した Markdown の Prettier 確認が成功する。runner に設定された親検証を通し、公開範囲の根拠、変更内容、検証結果、残課題を本個票の対応結果に残す。pipeline の申し送りが必要なら `handoff` にも記録する。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ |
| --- | ------------------------------------------------- | ---- | ---- | ---- |
| 1   | PR の公開範囲と既存の変更履歴を照合する           | BA   | open | -    |
| 2   | 公開済み項目を日付付きの節へ移し、次の節を残す    | BA   | open | -    |
| 3   | LP の文書検査と親検証を確認し、対応結果を記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0002:pjr-rwqv-lp-changelog]]: 変更履歴の作成と本番公開時の更新ルール。
- `specdojo-lp:README.md`: LP の公開・変更履歴の運用。
- `specdojo-lp:CHANGELOG.md`: 公開日を記録する対象。
