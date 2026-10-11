---
specdojo:
  id: prj-0002:pjr-g4qn-lp-tech-stack-evaluation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-10-11T08:27:47Z"
  completed_at: "2026-10-11T09:18:34Z"
  conclusion: 推奨案 B（Astro + Tailwind CSS）を示し、PJR-FV3W で採用された
---

# PJR-G4QN ランディングページの技術スタックの候補を比較評価する

## 1. 概要

PJR-FV3W の判断材料として、ランディングページの技術スタックの候補を比較評価し、推奨案をまとめる。前提・候補・観点は PJR-FV3W の「背景」と「検討した選択肢」に従う。

- 候補: A は Next.js（静的書き出し）+ Tailwind CSS、B は Astro + Tailwind CSS、C は Nuxt（静的書き出し）+ Tailwind CSS。
- 観点: 標準的であること（利用者の多さ、公式の案内の有無）、Cloudflare への配置のしやすさ、マテリアルデザインの指針を Tailwind CSS で表現しやすいか、学ぶ手間、表示の速さ、保守の続けやすさ。
- 公開先は Cloudflare 上の静的サイトとする。利用者は Next.js の経験があるが、こだわりはない。
- 決定は利用者が PJR-FV3W で行う。本項目は判断材料をまとめるところまでとする。

## 2. 完了条件

- 本個票の「対応結果」に、3 候補を 6 観点で評価した表がある。各評価に根拠（公式ドキュメントなどの URL）が付いている。
- 「対応結果」に、推奨案とその理由がある。PJR-FV3W に書いた利点と懸念の見立てと異なる点があれば、それも記載している。
- 変更は本個票だけである。PJR-FV3W の個票、リポジトリ `specdojo-lp`、実装には変更を加えていない。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | 3 候補を 6 観点で調査し、根拠付きの評価表を作る | ARC  | done | -    |
| 2   | 推奨案と理由をまとめる                          | ARC  | done | -    |

## 4. 対応結果

公式ドキュメントと公開統計を 2026-10-11 に確認し、3 候補を 6 観点で評価した。評価は ◎（優れる）、○（問題ない）、△（懸念がある）の 3 段階とし、各セルの `S` 番号は「根拠一覧」の URL を指す。

### 4.1. 評価表

| 観点                                   | A: Next.js（静的書き出し）+ Tailwind CSS                                                                                                | B: Astro + Tailwind CSS                                                                                                                        | C: Nuxt（静的書き出し）+ Tailwind CSS                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 標準的であること                       | ◎ npm の週間取得数は約 6,694 万で 3 候補中最多（S1）。Tailwind CSS の公式導入手順がある（S7）。                                         | ○ 週間取得数は約 718 万（S1）。State of JS 2025 で満足度が首位（S2）。Tailwind CSS の公式導入手順がある（S7）。                                | △ 週間取得数は約 235 万で 3 候補中最少（S1）。Tailwind CSS の公式導入手順はある（S7）。                                             |
| Cloudflare への配置のしやすさ          | △ 静的書き出しの公式手順はある（S3）。ただし Cloudflare は静的書き出しを特定用途向けとし、Workers 上の vinext を推奨している（S3）。    | ◎ Astro 公式に Cloudflare 向けの配置手順があり、静的サイトにアダプターは不要（S5）。Workers の公式ガイドにも載る（S17）。                      | ○ Cloudflare 向けの配置手順があり、`nuxt generate` で静的生成できる（S6）。経路の一致には `autoSubfolderIndex` の設定が要る（S6）。 |
| マテリアルデザインの指針の表現しやすさ | ○ 色の生成は Google の `material-color-utilities` を使い、Tailwind CSS のテーマへ落とす方式になる（S8）。フレームワークによる差はない。 | ○ A と同じ方式で表現できる（S8）。フレームワークによる差はない。                                                                               | ○ A と同じ方式で表現できる（S8）。フレームワークによる差はない。                                                                    |
| 学ぶ手間                               | ◎ 利用者に経験がある。                                                                                                                  | ○ Astro の部品は HTML に JavaScript の式を混ぜる JSX に近い書き方である（S11）。React の部品も公式統合で使える（S13）。                        | △ Vue と Nuxt を新しく覚える必要がある。描画をサーバーと画面の両方で行う前提を理解する必要がある（S14）。                           |
| 表示の速さ                             | △ 静的書き出しでも画面遷移は画面側で行われ、React の実行時コードが載る（S4）。                                                          | ◎ 既定で画面側の実行時コードを出力しない。動きが必要な部品だけを島として読み込む（S10、S11）。                                                 | △ 静的生成した HTML を画面側で Vue が引き継ぐ（hydration）ため、Vue の実行時コードが載る（S14）。                                   |
| 保守の続けやすさ                       | ○ Vercel が開発を続けている。静的書き出しでは使えない機能の一覧がある（S4）。将来サーバー機能が要るときは配置方式の見直しが要る（S3）。 | ◎ 開発元が 2026 年 1 月に Cloudflare へ合流し、MIT ライセンスとオープンな運営は継続すると表明されている（S15）。公開先と同じ会社が開発を担う。 | ○ 開発元が 2025 年 7 月に Vercel へ合流し、MIT ライセンスとオープンな運営は継続すると表明されている（S16）。                        |

### 4.2. 推奨案と理由

推奨案は B（Astro + Tailwind CSS）とする。

- ランディングページは動きの少ない静的なページであり、既定で実行時コードを出力しない Astro が表示の速さで最も有利である（S10、S11）。
- 公開先の Cloudflare では、Astro が公式の配置手順で静的サイトのまま扱え、開発元も Cloudflare に属している（S5、S15）。A の静的書き出しは Cloudflare から特定用途向けの扱いを受けており（S3）、配置の面で B が上回る。
- 学ぶ手間は A に劣るが、部品の書き方は JSX に近く、React の部品も使えるため、Next.js の経験を一部生かせる（S11、S13）。
- マテリアルデザインの表現は Tailwind CSS のテーマで行う方式となり、3 候補で差がない（S8）。この観点は選定を左右しない。
- 利用者の多さを最優先する場合は A が次点となる。C は 3 候補中で利用者が最も少なく、学ぶ手間も大きいため推奨しない。

### 4.3. PJR-FV3W の見立てと異なる点

| 選択肢 | 見立て                                                       | 調査で分かったこと                                                                                                                                                                     |
| ------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A      | 利点は「利用者が最も多い」                                   | 見立てどおりである（S1）。ただし懸念が 1 つ増える。Cloudflare は Next.js の静的書き出しを特定用途向けとし、Workers 上の vinext を推奨している（S3）。                                  |
| B      | 懸念は「新しく覚えることがある」                             | 新しく覚える量は見立てより小さい。部品の書き方が JSX に近く、React の部品も公式統合で使える（S11、S13）。また、開発元が Cloudflare に合流したことは見立てになかった利点である（S15）。 |
| B      | 利点は「必要な箇所で Vue の部品も使える」                    | 見立てどおりである。Vue の部品は公式統合で使える（S12）。                                                                                                                              |
| C      | 利点は「ドキュメントのサイトと同じ Vue にそろえられる」      | ドキュメントのサイトは VitePress で作られており、Nuxt とは別の仕組みである。Vue の部品を共有するだけなら B でも可能なため（S12）、C だけの利点としては弱い。                           |
| 全候補 | 比較の観点に「マテリアルデザインの指針の表現しやすさ」がある | 差はない。Google 公式の Web 部品（Material Web）は保守のみの状態であり（S9）、どの候補でも Tailwind CSS のテーマで指針を表現する方式になる（S8）。                                     |

### 4.4. 根拠一覧

- S1: npm 週間取得数（2026-10-03 から 2026-10-09）。<https://api.npmjs.org/downloads/point/last-week/next,astro,nuxt>
- S2: State of JavaScript 2025 のメタフレームワーク。<https://2025.stateofjs.com/en-US/libraries/meta-frameworks/>
- S3: Cloudflare Pages の静的 Next.js の配置手順。<https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/>
- S4: Next.js の静的書き出し。<https://nextjs.org/docs/app/guides/static-exports>
- S5: Astro の Cloudflare への配置手順。<https://docs.astro.build/en/guides/deploy/cloudflare/>
- S6: Nuxt の Cloudflare への配置手順。<https://nuxt.com/deploy/cloudflare>
- S7: Tailwind CSS のフレームワーク別導入手順。<https://tailwindcss.com/docs/installation/framework-guides>
- S8: Material Color Utilities。<https://github.com/material-foundation/material-color-utilities>
- S9: Material Web の保守状況。<https://github.com/material-components/material-web>
- S10: Astro の島（islands）の考え方。<https://docs.astro.build/en/concepts/islands/>
- S11: Astro の部品。<https://docs.astro.build/en/basics/astro-components/>
- S12: Astro の Vue 統合。<https://docs.astro.build/en/guides/integrations-guide/vue/>
- S13: Astro の React 統合。<https://docs.astro.build/en/guides/integrations-guide/react/>
- S14: Nuxt の描画方式。<https://nuxt.com/docs/4.x/guide/concepts/rendering>
- S15: Astro の Cloudflare への合流。<https://blog.cloudflare.com/astro-joins-cloudflare/>
- S16: NuxtLabs の Vercel への合流。<https://vercel.com/blog/nuxtlabs-joins-vercel>
- S17: Cloudflare Workers のフレームワーク別ガイド。<https://developers.cloudflare.com/workers/framework-guides/web-apps/>

### 4.5. 残課題

- 決定は利用者が PJR-FV3W で行う。本項目では PJR-FV3W の個票を変更していない。
- npm の取得数は CI などの自動取得を含むため、利用者数の目安として扱う。
- 表示の速さは公式ドキュメントの記述に基づく評価であり、実測はしていない。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 本項目の評価を判断材料とする decision。
