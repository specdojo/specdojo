---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-uc-sample-120-20261125t160547z-49dd0909
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-uc-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-uc-sample-120/T-KATA-REVIEW-ALL-cdfd-uc-sample-120-20261125T160547Z-49dd0909/plan.md
  started_at: "2026-11-25T16:05:57.662Z"
  completed_at: "2026-11-25T16:16:20.992Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-uc-sample
    - specdojo:cdfd-uc-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `cdfd-uc-sample` を rulebook の本文構成と template に照合した。章の順、節の順、表と本文の配置は沿っていた。
- プロセス領域の章冒頭が 2 段落に分かれていた。template の章冒頭は 1 段落のため、1 段落に統合した。
- rulebook など sample 以外は変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 3. プロセス領域（章冒頭） | 章冒頭が通過順・正本関係の段落と、内部の正本・代表ノードの段落に分かれていた。template の章冒頭は 1 段落で、rulebook「プロセス領域」の章冒頭の要件（ケース ID・通過順・全体概要との正本関係を簡潔に示す）より粒度が細かい。 | 2 段落を 1 段落に統合した。「各グループの役割は本章」「内部は役割表の参照先を唯一の正本」「1 つの代表ノードにして受け渡しの線だけを描く」は維持した。 | vp-arc-document-structure、`specdojo:cdfd-uc-rulebook` の「プロセス領域」、`specdojo:cdfd-uc-template` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdfd-uc-sample.md`: 3. プロセス領域の章冒頭 2 段落（通過順と全体概要との正本関係、内部の正本と代表ノード）を template どおり 1 段落に統合した。各グループの役割は本章に置くこと、内部は役割表の参照先を唯一の正本とすること、1 つの代表ノードにして受け渡しの線だけを描くことは維持した。

## 3. 申し送り

- `npm run lint:md` は executor では未実行で、親 runner の実行結果に従う。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。
- R2-1: R2 / 3. プロセス領域（章冒頭） / 章冒頭が通過順・正本関係の段落と内部の正本・代表ノードの段落に分かれ、template の章冒頭 1 段落と rulebook「プロセス領域」の章冒頭の要件（ケース ID・通過順・全体概要との正本関係を簡潔に示す）より粒度が細かい / 2 段落を 1 段落に統合し、「各グループの役割は本章」「内部は役割表の参照先を唯一の正本」「1 つの代表ノードにして受け渡しの線だけを描く」は維持した / vp-arc-document-structure、[[specdojo:cdfd-uc-rulebook]] の「プロセス領域」、[[specdojo:cdfd-uc-template]] / -

## 4. 進め方と実践の型の適用

kata-guide の R2（構成）に従い、R1 の指摘は繰り返さなかった。cdfd-uc-rulebook の「プロセス領域」と cdfd-uc-template の章冒頭を基準に、章の順、粒度、表と本文の配置を確認した。差分は章冒頭の段落統合 1 件だけである。grade と condense 由来の finding はなかった。
