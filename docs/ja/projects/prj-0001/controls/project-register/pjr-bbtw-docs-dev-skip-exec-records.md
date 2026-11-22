---
specdojo:
  id: prj-0001:pjr-bbtw-docs-dev-skip-exec-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T13:29:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNAV
---

# PJR-BBTW docs:dev では実行の記録のページを読まず、起動を速くする

## 1. 概要

文書サイトの Markdown 6,979 ページのうち 5,179 ページが execution/ の下で、多くは plan と result である。docs:dev のときだけ外し、VitePress の起動を速くする。docs:build は全部のページを出す。

## 2. 入力

- 2026-11-22 の数え: docs の Markdown は 6,979 ページ、docs/ja/projects/prj-0001/execution の下が 5,179 ページ、controls の下が 1,181 ページ。
- PJR-BNAV の測り: 作業ツリー（bind mount）での VitePress の起動は cache のある 2 回目でも 25.3 秒。生成は --skip-if-fresh でほぼ 0 秒になった。
- 実行の記録のページの範囲は packages/docs-site/.vitepress/exec-record-paths.ts にある。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- `docs:dev` のときだけ、実行の記録のページ（`execution/` の下の plan・result など）を VitePress に読ませない。`docs:build` の出力（ページと dead link の検査）は変えない。
- 実行の記録のページを dev でも見たいときに含める指定（例: `docs:dev -- --with-exec-records`）を足す。名前は executor が決め、理由を個票の対応結果に書く。
- 外したページへのリンクが dev で dead link の警告や表示の崩れを起こさないかを確かめ、扱いを個票の対応結果に書く。
- 外す範囲の判定を単体テストで確かめる。
- packages/docs-site の README か文書サイトのガイドに、dev で外すページと含め方を書く。
- `package.json` などの保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 起動の時間は executor の sandbox で測れないため、統合の後にオーケストレーターが変える前と後の起動の時間を測り、個票の対応結果に書いてから close する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
