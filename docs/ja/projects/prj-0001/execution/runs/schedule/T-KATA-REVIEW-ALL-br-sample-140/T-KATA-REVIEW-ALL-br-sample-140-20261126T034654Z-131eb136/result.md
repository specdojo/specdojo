---
specdojo:
  id: prj-0001:xer-t-kata-review-all-br-sample-140-20261126t034654z-131eb136
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-br-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-br-sample-140/T-KATA-REVIEW-ALL-br-sample-140-20261126T034654Z-131eb136/plan.md
  started_at: "2026-11-26T03:47:05.406Z"
  completed_at: "2026-11-26T03:52:11.792Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:br-sample
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として br-sample の事実の主張を schema・rulebook・template・Sample 記述標準と突き合わせた。誤りは見つからず、sample は変更していない。
- 確かめの表: 1) `type: rule` は deliverable-frontmatter.schema.yaml の type 列挙と br-rulebook の推奨 Frontmatter 項目に一致した。2) `status: ready` は common-frontmatter.schema.yaml の status 列挙（draft/ready/deprecated）に一致した。3) `rulebook: specdojo:br-rulebook` は rulebook の id と一致し、rulebook の sample 宣言も `specdojo:br-sample` を指す。4) 章の見出し名は br-template と一致した。5) 判定例 1〜4 の計算（9 で不足、10 で不足なし、0 で不足なし、−2 で不足）は R-02・R-03 と一致した。6) 判定例 5〜9 の例外 ID は E-01→E-02→E-03 の順の規則と一致した。7) 欠損時の扱いと発注点を店主代表へ確認する次の手は rulebook の良い例と一致した。8) 店主代表・家族利用者代表は共通サンプル文脈の登場人物にある。9) 在庫数などの具体値は正本のない業務の仮定なので、確かめの対象外とした。
- 検証では lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、validate:schema が通過した。そのほかの検査は変更ファイルがないため非適用になった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 確かめられなかった主張はなかった。
- F001（minor、vp-qe-kata-conformance、旧 line=74）は R4 の観点ではないため、この段では扱っていない。今の sample では第 6 章に承認の条件（判定例 1〜9 の期待結果が R-01〜R-03 と E-01〜E-03 の順序から一意に導けること）がすでに書かれている。ただし、承認者が人間の PO であることは書かれていない。解消したかどうかは R5 または再 grade で判定する。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample 内の事実の主張を frontmatter の列挙、rulebook、template、共通サンプル文脈と照合した。矛盾する箇所がなかったため、既存の記述はすべて維持した。F001（vp-qe-kata-conformance）は R4 の観点に当たらないため、この段では扱っていない。
