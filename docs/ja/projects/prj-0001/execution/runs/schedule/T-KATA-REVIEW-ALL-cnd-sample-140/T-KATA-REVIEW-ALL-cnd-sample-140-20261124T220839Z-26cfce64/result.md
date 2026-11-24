---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cnd-sample-140-20261124t220839z-26cfce64
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cnd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cnd-sample-140/T-KATA-REVIEW-ALL-cnd-sample-140-20261124T220839Z-26cfce64/plan.md
  started_at: "2026-11-24T22:08:48.755Z"
  completed_at: "2026-11-24T22:20:13.325Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `cnd-sample` に書かれた事実の主張 10 件を、schema・rulebook・参照先 sample・src と突き合わせた。
- 9 件は正本と一致した。Mermaid 構文の正しさは executor では確かめられず、親 runner の `npm run lint:mermaid`（passed、90 diagram）の結果を根拠とする。
- 不一致がなかったため sample は変更していない。変更ファイルは 0 件。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 確かめの表。1 主張は 1 行で、列は番号、主張、突き合わせ先、結果の順。 | # | 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `type: architecture` と `rulebook: specdojo:cnd-rulebook` | cnd-rulebook.md、deliverable-frontmatter.schema.yaml | 一致 | | 2 | frontmatter のキー `part_of`・`based_on`・`supersedes` | common-frontmatter.schema.yaml 69〜75 行 | 一致 | | 3 | リンク先 `specdojo:prj-overview-sample`・`specdojo:cxd-sample`・`specdojo:clis-sample` | docs/ja/specdojo/samples/ を grep | 3 文書とも存在し一致 | | 4 | 「まず記録する」方針 | prj-overview-sample.md 42 行の Record First | 一致 | | 5 | cxd-sample・clis-sample は本部 API を利用する別構成 | 両 sample を grep | 一致 | | 6 | 図の形状・`classDef`・境界の `style` | cnd-mermaid-rulebook.md の記号の対応と色分け | 一致 | | 7 | 関係 ID `REL-01`〜`REL-05` と全関係のラベル | cnd-rulebook.md、cnd-mermaid-rulebook.md のエッジのルール | 図と表が対応し一致 | | 8 | 引き継ぎ先 ID の形式（例 `kinuya:pjr-a001-sales-placement`） | id-and-file-naming-standard.md、src/exec/product-branches.ts の `pjr-[a-z0-9]{4}-` | 一致 | | 9 | 参照先名 `kinuya-infra-design`・`cpd-kinuya-sales-service` など | cpd-sample.md で同じ名前を使用 | 一致。架空の未同梱文書としてインラインコードで記載 | | 10 | Mermaid 構文の正しさ | executor では確認不可。親 runner の `npm run lint:mermaid` | 確かめ不能。runner の検査は passed |
- R4 確かめの表（1 主張 1 行）: 1 frontmatter の `type: architecture`・`rulebook: specdojo:cnd-rulebook` — 正本 docs/ja/specdojo/rulebooks/cnd-rulebook.md と docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml — 一致
- 2 frontmatter のキー `part_of`・`based_on`・`supersedes` — 正本 docs/specdojo/schemas/v1/common-frontmatter.schema.yaml 69〜75 行 — 一致
- 3 リンク先 `specdojo:prj-overview-sample`・`specdojo:cxd-sample`・`specdojo:clis-sample` — docs/ja/specdojo/samples/ を grep — 3 文書とも存在し一致
- 4 「まず記録する」方針 — prj-overview-sample.md 42 行の Record First（まず記録する） — 一致
- 5 cxd-sample・clis-sample は本部 API を利用する別構成 — 両 sample を grep — 一致
- 6 図の形状・`classDef`・境界の `style` — cnd-mermaid-rulebook.md の記号の対応と色分け — 一致
- 7 関係 ID `REL-01`〜`REL-05` と全関係のラベル — cnd-rulebook.md と cnd-mermaid-rulebook.md のエッジのルール — 図と表が対応し一致
- 8 引き継ぎ先 `kinuya:pjr-a001-sales-placement` などの ID 形式 — id-and-file-naming-standard.md と src/exec/product-branches.ts の `pjr-[a-z0-9]{4}-` — 一致
- 9 `kinuya-infra-design`・`cpd-kinuya-sales-service` などの参照先名 — cpd-sample.md で同じ名前を使用 — 一致（架空の未同梱文書としてインラインコードで記載）
- 10 Mermaid 構文の正しさ — 確かめられない。親 runner の `npm run lint:mermaid` の結果を正とする
- 誤りの直しの差分: なし（不一致がなかったため sample を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実の主張を正本と照合した。突き合わせ先は schema、rulebook、参照先 sample、src。plan に展開された grade の finding と成果物由来の Kata finding はなく、根拠不足による見送りもない。10 件の主張のうち 9 件は正本と一致したため維持した。Mermaid 構文の 1 件は親 runner の `npm run lint:mermaid` に委ねた。誤りがなかったため sample は変更していない。rulebook と矛盾する箇所はなく、rulebook を正として直した箇所もない。
