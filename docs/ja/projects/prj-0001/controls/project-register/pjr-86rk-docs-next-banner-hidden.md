---
specdojo:
  id: prj-0001:pjr-86rk-docs-next-banner-hidden
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-25T12:09:58Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-98HS
---

# PJR-86RK 文書サイトの開発中の版の帯が、広い画面でメニューに隠れるのを直す

## 1. 概要

文書サイトの開発中の版（`/specdojo/next/`）で、ページの先頭に出す帯「これは開発中の版の文書です」が、狭い画面では見えるが、広い画面では上のメニュー（ナビゲーションの帯）に隠れて見えない（利用者の報告、2026-11-25）。広い画面でも帯が見えるように直す。

## 2. 入力

- 利用者の報告（2026-11-25）: VitePress のサイトで next/ 以下を見ると、狭い画面では頭に「これは開発中の文書です」と出るが、画面が広くなるとメニューに隠れる
- 確かめた事実（2026-11-25）: 帯は packages/docs-site/.vitepress/theme/NextChannelBanner.vue で、theme/index.ts の layout-top の slot に置いている

## 3. 完了条件

- 開発中の版で、広い画面（VitePress が上のナビゲーションと左のサイドバーを固定して出す幅）でも、帯がナビゲーションやサイドバーに隠れず、全文が読める。狭い画面の見え方は変えない。
- 帯の高さが変わっても（文が折り返すなど）、ナビゲーション・サイドバー・本文が帯と重ならない。VitePress の `layout-top` の slot に置く要素の高さを、VitePress がずらしに使う `--vp-layout-top-height` に反映するなど、VitePress の決まった方法で直す。方法は executor が決め、理由を個票の対応結果に書く。
- 本番の版（帯を出さない）の見え方は変えない。
- 直し方を確かめる単体テスト、または文書サイトのビルドの結果（`--vp-layout-top-height` などが出ていること）を確かめる検査を足す。ブラウザでの見え方の確かめはオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                               | 担当   | 状態 | メモ |
| --- | ---------------------------------- | ------ | ---- | ---- |
| 1   | 帯が隠れる原因の確認と直し方の決定 | _TODO_ | open | -    |
| 2   | 帯の直しと検査の追加               | _TODO_ | open | -    |
| 3   | 広い画面と狭い画面での見え方の確認 | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
