---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-msg-sample-130-20261126t004233z-96132028
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-msg-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-msg-sample-130/T-KATA-REVIEW-ALL-ifx-msg-sample-130-20261126T004233Z-96132028/plan.md
  started_at: "2026-11-26T00:42:42.625Z"
  completed_at: "2026-11-26T00:48:21.232Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-msg-sample
    - specdojo:ifx-msg-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `ifx-msg-sample.yaml` の文を直した。長い文を分け、主語と版の置き場所を明記し、曖昧な表現を具体的な値や語に置き換えた。意味・制約は変えていない。
- executor の検証では prettier と YAML 構文解析が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | info.description（メッセージ形式） | 読点の多い長い 1 文で、「`defaultContentType` は同じ既定を示す」の「同じ既定」が何を指すか読めない。 | 文を 3 つに分け、「ファイル全体の既定（`defaultContentType`）も `application/cloudevents+json` にする」と値を書いた。 | W3, W4 | - |
| R3-2 | R3 | info.description（互換） | 「任意の `data` 項目の追加は MINOR を上げ」に主語と版の置き場所がなく、「`type` の `.v1` を上げる」も 1 文に詰まっている。 | 「発行者は任意の `data` 項目を足すとき `info.version` の MINOR を上げ、購読者は知らない項目を無視する」と「互換を壊す変更では、発行者が `type` の版（`.v1`）を上げる」の 2 文にした。 | W1, W3 | - |
| R3-3 | R3 | `x-spec-meta.based_on` のコメント | 「未掲載の連携で、採用するときは〜」の 1 文に、状態と手順の 2 つの主張が入っている。 | 「この連携は一覧 ifx-index-sample に未掲載。採用するときは、一覧に行を足してから `spec_ref` を付ける。」の 2 文にした。 | W3, vp-ux-readability | - |
| R3-4 | R3 | components.schemas.CloudEventStockChanged.properties.subject | 「対象識別子」では何を識別するのか読めない。 | 「対象の商品の識別子（任意）」にした。「順序と重複の判定には使わない」と書き足す案は意味の追加にあたるため採らず、F001 と合わせて R5 に任せる。 | W7, vp-ux-readability | 要判断 |
| R3-5 | R3 | grade の finding F001〜F004 | F001・F002 は順序と重複の判定の単位がすでに `data.product_id` に揃っている。F003 はチャネルの `description` に発生の契機がすでにある。F004 は `info.description` に連携名があるが、一覧 ifx-index-sample に行がない状態は残っている。 | R3 の観点ではないため直さない。F004 は R5（`vp-qe-kata-conformance`）で、ifx-index-sample に行を足すか rulebook に例外を書くかを決める。 | vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-msg-sample.yaml`: `info.description` のメッセージ形式と互換の文を分割し、既定の `defaultContentType` の値と、MINOR を上げる主体、`type` の版を上げる主体を明記した。`x-spec-meta.based_on` のコメントを状態と手順の 2 文に分けた。`subject` の説明を「対象の商品の識別子（任意）」にした。

## 3. 申し送り

- grade の finding F001〜F004 は R3 の観点ではないため、この段では直していない。F001 と F002 は順序と重複の判定の単位がすでに `data.product_id` に揃っていた。F003 はチャネルの `description` に発生の契機がすでにあった。F004 は `info.description` に連携名があるが、`ifx-index-sample` に行がない状態は残っている。F004 は R5（`vp-qe-kata-conformance`）で、一覧に行を足すか rulebook に例外を書くかを決める必要がある。
- `subject` の説明に「順序と重複の判定には使わない」と書き足す案は意味の追加にあたるため採らなかった。F001 と合わせて R5 で判断する。
- R3-1: R3 / info.description（メッセージ形式） / 読点の多い長い 1 文で、「`defaultContentType` は同じ既定を示す」の「同じ既定」が何を指すか読めない / 文を 3 つに分け、「ファイル全体の既定（`defaultContentType`）も `application/cloudevents+json` にする」と値を書いた / W3, W4 / -
- R3-2: R3 / info.description（互換） / 「任意の `data` 項目の追加は MINOR を上げ」に主語と版の置き場所がなく、「`type` の `.v1` を上げる」が 1 文に詰まっている / 「発行者は任意の `data` 項目を足すとき `info.version` の MINOR を上げ、購読者は知らない項目を無視する」と「互換を壊す変更では、発行者が `type` の版（`.v1`）を上げる」の 2 文にした / W1, W3 / -
- R3-3: R3 / `x-spec-meta.based_on` のコメント / 「未掲載の連携で、採用するときは〜」の 1 文に、状態と手順の 2 つの主張が入っている / 「この連携は一覧 ifx-index-sample に未掲載。採用するときは、一覧に行を足してから `spec_ref` を付ける。」の 2 文にした / W3, vp-ux-readability / -
- R3-4: R3 / components.schemas.CloudEventStockChanged.properties.subject / 「対象識別子」では何を識別するのか読めない / 「対象の商品の識別子（任意）」にした / W7, vp-ux-readability / 要判断（「順序と重複の判定には使わない」と書き足す案は意味の追加にあたるため採らず、F001 と合わせて R5 に任せる）
- R3-5: R3 / grade の finding F001〜F004 / F001・F002 は順序と重複の判定の単位がすでに `data.product_id` に揃っていて、F003 はチャネルの `description` に発生の契機がすでにある。F004 は `info.description` に連携名があるが、一覧 ifx-index-sample に行がない状態は残っている / - / R3 の観点ではないため直さない。F004 は R5（`vp-qe-kata-conformance`）で、ifx-index-sample に行を足すか rulebook に例外を書くかを決める / -
- 適用外の検証: `npm run validate:schema:file`（sample は `# specdojo-schema: none reason=external-asyncapi` と宣言していて、対応する SpecDojo schema がない）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に沿って、kata-guide の文章チェック項目（W1〜W10）を基準に既存の sample の文だけを直した。rulebook と recipe の構造・必須項目・禁止事項には触れていない。plan に展開された finding F001〜F004 は R3 の観点に当たらないため扱わず、扱う段に任せた。
