---
specdojo:
  id: prj-0001:pjr-k3z2-ccd-direction-tb
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-17T22:52:02Z"
  due_on: "2026-11-30"
---

# PJR-K3Z2 概念クラス図（ccd）の向きを上から下にそろえる

## 1. 概要

ccd の sample と ccd-project-planning が direction LR で描かれているため、継承の読み方と状態遷移図にそろえて上→下を既定にし、rulebook に向きの決まりを足す。

## 2. 入力

- 利用者の指摘（2026-11-18）: 概念クラス図は左→右ではなく、ほかの図に合わせて上から下の配置にした方がよい
- orchestrator の調べ（2026-11-18）: ccd-sample と ccd-project-planning は direction LR。stsd（sample と本番 5 件）は指定なし（上→下）。データフロー図・C4・プロジェクト定義の図は flowchart LR。ccd-mermaid-rulebook に向きの決まりはない。ccd-project-planning はクラス 11 個
- 利用者の決定（2026-11-18）: 上→下を既定とし、関連の連なりが長く横に並べた方が読みやすい場合だけ LR とし、理由を本文に書く

## 3. 完了条件

- [[specdojo:ccd-mermaid-rulebook|ccd-mermaid-rulebook]] の概念クラス図の記述ガイドに、向きの決まりを足す。既定は上→下（`direction` を書かないか `direction TB`）とし、親を上・子を下に置く。関連の連なりが長く横に並べた方が読みやすい場合だけ `direction LR` とし、その理由を本文に書く。
- `docs/ja/specdojo/samples/ccd-sample.md` と `docs/ja/product/010-business-specs/020-data-model/ccd-project-planning.md` の図を上→下にする。線の交差が増えて読みにくくなる場合は、クラスの宣言や関連の順番を並べ替えて整える。クラス・関連・多重度・役割名の中身は変えない。
- 変えた図を文書サイト（`npm run docs:build` の生成物か `npm run docs:dev`）で描き、上→下で描けていること、線の交差や重なりで読めない箇所がないことを確かめ、確かめ方と結果を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run docs:build` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                  |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | rulebook に向きの決まりを足す                        | BA   | done | 記述ガイドに「図の向き」を追加        |
| 2   | ccd-sample と ccd-project-planning の図を上→下にする | BA   | done | `direction LR` を削除。並べ替えは不要 |
| 3   | 文書サイトで描いて確かめ、結果を書く                 | BA   | done | 確かめ方と結果は対応結果に記載        |

## 5. 対応結果

### 5.1. 実施内容

- [[specdojo:ccd-mermaid-rulebook|ccd-mermaid-rulebook]] の概念クラス図の記述ガイドに「図の向き」の節を足した。既定は上→下（`direction` を書かないか `direction TB`）で親を上・子を下に置くこと、横に並べた方が読みやすい場合だけ `direction LR` とし理由を図の直後の本文に書くこと、交差や重なりは向きを変える前に宣言・関連の順番で整えることを定めた。
- [[specdojo:ccd-sample]] と [[prj-0001:ccd-project-planning]] の図から `direction LR` を外し、上→下にした。クラス・関連・多重度・役割名、宣言と関連の順番は変えていない。

### 5.2. 描画の確かめ方と結果

- `npm run docs:build` を実行して成功を確かめた。生成された `.vitepress/dist` の 2 ページが参照する SVG（`.vitepress/mermaid/` 配下、ELK レイアウト）の各クラスの座標と各線の経路を、`tmp/` に置いたスクリプトで読み、交差とクラス枠への線の重なりを数えた。
- ccd-sample: 縦 772・横 315 の上→下の配置。売上記録が最上段、その下に売上明細と顧客、商品、最下段にお菓子・玩具が並ぶ。線の交差・クラス枠への重なりはない。
- ccd-project-planning: 縦 1530・横 1101 の上→下の配置。プロジェクト構成が最上段、登録項目・計画要素、エピック・マイルストーン、計画トラック、スケジュール戦略・計画タスク、成果物カタログ・担当ロール、最下段に成果物定義が並ぶ。継承は親（計画要素・登録項目）が上、子が下にある。線の交差は「プロジェクト構成 → 担当ロール」と「計画トラック → 計画タスク」の 1 か所だけで、跨ぎの印（弧）が描かれ、ほかの線・クラス枠との重なりはない。
- 迷った点と決定: 上の 1 か所の交差を消すため、担当ロールの宣言を末尾へ移して描き直したが、ELK の配置は変わらず交差も残った。跨ぎの印で 2 本の線を区別でき読めるため、この交差は受け入れ、宣言の順番は元に戻した。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 文案: 概念クラス図（ccd）の向きを上→下を既定とし、ccd-mermaid-rulebook に向きの決まりを足した。ccd の sample とプロジェクト計画の概念クラス図を上→下に描き直した。

### 5.4. 残課題

- なし。保護された設定の変更は要らなかった。

## 6. 関連ドキュメント

- [[specdojo:ccd-mermaid-rulebook]]
- [[specdojo:ccd-sample]]
