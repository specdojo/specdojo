---
specdojo:
  id: prj-0002:pjr-xej4-lp-interim-mascot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: UX
  registered_at: "2026-10-12T10:54:12Z"
  due_on: "2026-10-31"
---

# PJR-XEJ4 暫定のマスコット画像を LP の Hero に置く

## 1. 概要

ChatGPT で作ったマスコットの画像（道着を着たカワウソが、書いて、削り出して、磨き上げる 3 コマ）を、正式な画像（PJR-FSMC）ができるまでの暫定として LP の Hero の仮の枠に置く。astro:assets の Image で最適化して表示する

### 1.1. 画像の出どころと確認結果（2026-10-12）

- 作り方: 利用者が ChatGPT で生成した。元のファイルは `specdojo-lp/tmp/dojo-otter.webp`（1254×1254、可逆圧縮の WebP、約 470 KB）。
- 規約: OpenAI の利用規約（2026-01-01 発効の表示）では、法律が許す範囲で出力の権利は利用者に帰属し、OpenAI は自らの権利を利用者に譲渡する。出力は唯一とは限らず、他の利用者が似た出力を得ることがあり、その出力には譲渡が及ばない（<https://openai.com/policies/terms-of-use/>）。AI の生成物は、人の創作的な寄与が小さいと著作権で保護されない可能性がある。暫定の画像として使い、正式な画像は [[prj-0002:pjr-pevv-mascot-character-source]] で人の寄与を残して作る。
- 道着の合わせ: 利用者が右前であることを確認した。
- 背景: orchestrator が確認した。背景は完全に透明で、道着・板・紙などの白い部分はほぼ不透明（アルファ 254）のため、色のついた Hero の上に直接置ける。

## 2. 完了条件

- 画像が `specdojo-lp/src/assets/mascot/dojo-otter.webp` にあり、`src/components/sections/Hero.astro` が `astro:assets` の `<Image />` で表示している。Hero の枠に合う幅を指定し、`width` と `height` が出力される。
- Hero の右側の仮の枠（`data-placeholder="mascot"`、「マスコット（準備中）」）が画像に差し替わっている。白いカードなどで囲まず、Hero の色の上に直接置く。
- `alt` が「道着を着たカワウソが、筆で書き、SPEC の板を削り出し、磨き上げる 3 コマ」の内容を表している。
- 色・角丸・影は PJR-CM5W で定義したテーマの class だけを使う。
- 画面に表示する文言に、登録簿の項目 ID を書かない。ソースのコメントも、項目 ID ではなく内容で説明する。
- 公開の前に、既存の作品と目立って似ていないことを画像検索などで確かめ、結果を対応結果に書く（利用者が確かめる）。
- `specdojo-lp/tmp/` は commit しない。画像を `src/assets/mascot/` に移した後、`tmp/` を消す。
- 変更は `specdojo-lp` の統合先（`feature/lp-v1`）へ入れる。
- `specdojo-lp` で `npm run build` が成功する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。
- 前提: exec の worktree は `feature/lp-v1` の commit から作られ、未追跡の `tmp/` の画像は worktree に入らない。そのため、orchestrator が実行の前に画像を `src/assets/mascot/dojo-otter.webp` として `feature/lp-v1` へ commit しておく。

## 3. 作業内容

| No  | 作業                                             | 担当         | 状態 | メモ                                    |
| --- | ------------------------------------------------ | ------------ | ---- | --------------------------------------- |
| 1   | 画像を `src/assets/mascot/` に置いて commit する | orchestrator | done | 79f9612（feature/lp-v1）。tmp/ は消した |
| 2   | Hero の仮の枠を `<Image />` に差し替える         | UX           | done | 幅 640 px、代替テキスト付きで表示       |
| 3   | 既存の作品との類似を確かめる                     | 利用者       | open | 公開の前                                |
| 4   | ビルドを確認する                                 | orchestrator | done | `npm run build` 成功                    |

## 4. 対応結果

- `specdojo-lp:src/components/sections/Hero.astro` で暫定画像を読み込み、`astro:assets` の `<Image />` により幅 640 px で表示した。生成 HTML に `width="640"` と `height="640"` が出力され、元画像約 469 KB はビルド時に約 50 KB へ最適化された。
- `data-placeholder="mascot"` の点線枠と「マスコット（準備中）」を削除し、Hero の背景色の上へ画像を直接配置した。代替テキストには、道着を着たカワウソが書き、削り出し、磨き上げる 3 コマであることを記載した。
- `specdojo-lp` で `npm run build` が成功した。`tmp/` ディレクトリが存在しないことも確認した。
- 公開前に、既存作品との目立った類似がないかを利用者が画像検索などで確認する。正式なマスコット完成後は [[prj-0002:pjr-fsmc-lp-mascot]] で差し替える。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fsmc-lp-mascot]]: 正式な画像に差し替える項目。本項目の画像は暫定。
- [[prj-0002:pjr-pevv-mascot-character-source]]: 正式なキャラクターの設定と原本。
- [[prj-0002:pjr-hktj-assets-repository]]: アセットを specdojo-assets で管理する決定。
