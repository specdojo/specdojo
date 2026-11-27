---
specdojo:
  id: prj-0001:pjr-86rk-docs-next-banner-hidden
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

- 2 回目の実行（2026-11-27）で、狭い画面の空白を直している。1 回目の後、開発中の版を `SPECDOJO_DOCS_CHANNEL=next` の開発サーバーで開き、ヘッドレスのブラウザで確かめた。幅 1440 では帯がナビゲーションの上に全文出て直っていたが、幅 640 では帯とヘッダーの間に帯 1 つ分ほどの空白ができた。狭い画面では VitePress のナビゲーションが固定されず帯の下に並ぶため、`--vp-layout-top-height` の分も下がって二重に空いたとみられる。
  - 狭い画面（VitePress がナビゲーションを固定しない幅）では、帯とヘッダーの間に余分な空白を作らない。広い画面の直りは保つ。
  - 原因と直し方を個票の対応結果に書いている。単体テストか検査で、幅による扱いの違いを確かめている。

## 4. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                                                                |
| --- | ---------------------------------- | ---- | ---- | ------------------------------------------------------------------- |
| 1   | 帯が隠れる原因の確認と直し方の決定 | DEV  | done | `layout-top` の高さを `--vp-layout-top-height` へ反映していないため |
| 2   | 帯の直しと検査の追加               | DEV  | done | ヘルパーと単体テストを追加                                          |
| 3   | 広い画面と狭い画面での見え方の確認 | DEV  | open | ブラウザ確認はオーケストレーターが行う                              |

## 5. 対応結果

### 5.1. 実施内容

- 原因: VitePress は固定のナビゲーション・サイドバー・本文を `--vp-layout-top-height` の分だけ下げる。帯はこの変数へ高さを反映しておらず、広い画面（固定表示）でナビゲーションに隠れた。
- 直し方: `NextChannelBanner.vue` で帯の実測の高さを `ResizeObserver` で監視し、`document.documentElement` の `--vp-layout-top-height` へ反映する。理由は、VitePress の決まった方法であり、文の折り返しで高さが変わっても追従するため。帯を出さない本番では要素が無く、変数も設定しないため見え方は変わらない。狭い画面では VitePress がこの変数を使わないため変わらない。
- 追加: `packages/docs-site/.vitepress/theme/layout-top-height.ts`（変数の設定・解除）と、その単体テスト `tests/packages/docs-site/layout-top-height.test.ts`。
- 残課題: ブラウザでの見え方の確認（作業 3）はオーケストレーターが行う。

### 5.2. CHANGELOG に書く事項

- 区分: Fixed
- 文案: 文書サイトの開発中の版で、広い画面でも「開発中の版」の帯がナビゲーションに隠れず表示されるようにした。

## 6. 関連ドキュメント

- 派生元: `PJR-98HS`（開発中の版の帯）。
