---
specdojo:
  id: prj-0001:xer-t-kata-review-all-br-sample-130-20261126t001631z-e7f13d3e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-br-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-br-sample-130/T-KATA-REVIEW-ALL-br-sample-130-20261126T001631Z-e7f13d3e/plan.md
  started_at: "2026-11-26T00:16:41.011Z"
  completed_at: "2026-11-26T00:24:43.118Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:br-sample
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/br-sample.md` の文を 8 か所直した。表の前に何の表かを示す 1 文を 4 か所に足し、指示語、修飾の係り、担当者の語の不統一、承認の条件の文を直した。意味と判断に要る情報は変えていない。
- grade の F001（承認できる条件の追記）は `vp-qe-kata-conformance` の指摘で R3 の観点ではない。第 6 章には前の段で承認の条件がすでに入っているため、この段では扱っていない。
- 検査は `npx prettier --check` と `npx markdownlint` が通り、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` も通った。変更の種類に合わない検査は `not_applicable` になっている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R3 | 入力 | 表の前に何の表かを示す 1 文がない | 「次の表は、判定に使う入力と、欠けたときの扱いを示す。」を足した | W9・sample-authoring-standard（表の前の 1 文）・vp-ux-readability | - |
| 2 | R3 | 判定例 | 表の前の 1 文がなく、「`E-` の行」が何を指すか曖昧 | 表の前に 1 文を足し、「期待結果が `E-` で始まる例は判定値を返さない」にした | W4・W9・vp-ux-readability | - |
| 3 | R3 | 出力 | 表の前に何の表かを示す 1 文がない | 「次の表は、本ルールが返す項目と利用先を示す。」を足した | W9・vp-ux-readability | - |
| 4 | R3 | 例外 / 異常系 | 表の前に何の表かを示す 1 文がない | 「次の表は、入力不備の種類ごとの扱いと利用者の次の手を示す。」を足した | W9・vp-ux-readability | - |
| 5 | R3 | ルール（判定/計算）R-01 | 「『例外 / 異常系』の順で」がどの順か一つに決まらない | 「『例外 / 異常系』に示す順で」にした | W4 | - |
| 6 | R3 | 例外 / 異常系 | 直す人を指す語が「在庫確認担当」と「入力した担当者」（出力の表）で食い違い、「いずれも」も何を指すか曖昧 | 「いずれの例外でも判定せず、入力した担当者が直して再判定する。」にした | W4・W8・vp-ux-language-consistency | - |
| 7 | R3 | 例外 / 異常系 | 「値を推測して本ルールを呼び出さない」は、否定が「呼び出さないこと」にかかっているようにも読める | 「呼出元は、入力を取得できない場合に値を推測で補って本ルールを呼び出すことはしない。」にした | W5 | - |
| 8 | R3 | メモ / 将来課題 | 承認の条件の文で、誰が確かめるかが書かれていない | 人を出さずに「本ルールの承認の条件は、判定例 1〜9 の期待結果が…から一意に導けることである。」にした | W1・W6。迷った理由: W1 に従えば主語を書くことになるが、sample-authoring-standard は本文に承認の役割を書くことを禁じている。主語として「店主代表が確かめた時点で」を足す案は選ばなかった | 要判断 |
| 9 | R3 | メモ / 将来課題（grade F001） | F001（承認できる条件の追記）は `vp-qe-kata-conformance` の指摘で、R3 の観点ではない。第 6 章には前の段で承認の条件がすでに入っている | - | `vp-qe-kata-conformance`（R1・R5 が扱う） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/br-sample.md`: 文の読みやすさを直した。入力・出力・例外の各表の前に表の内容を示す 1 文を足した。判定例の表の前には、期待結果が `E-` で始まる例は判定値を返さないと説明する 1 文を足した。`R-01` の「『例外 / 異常系』に示す順で」への言い換え、担当者の語を「入力した担当者」に統一した点、推測で値を補わない旨の否定の係りの明確化、第 6 章の承認条件の文も直した。

## 3. 申し送り

- 指摘 8（第 6 章の承認の条件の文）は「要判断」。W1 に従うなら誰が確かめるかの主語を書くことになる。一方で sample-authoring-standard は本文に承認の役割を書くことを禁じている。このため主語を足さず、人を出さない文にした。主語を足す案（店主代表が確かめた時点で）は選んでいない。
- 1: R3 / 入力 / 表の前に何の表かを示す 1 文がない / 「次の表は、判定に使う入力と、欠けたときの扱いを示す。」を足した / W9・sample-authoring-standard（表の前の 1 文）・vp-ux-readability / -
- 2: R3 / 判定例 / 表の前の 1 文がなく、「`E-` の行」が何を指すか曖昧 / 表の前に 1 文を足し、「期待結果が `E-` で始まる例は判定値を返さない」にした / W4・W9・vp-ux-readability / -
- 3: R3 / 出力 / 表の前に何の表かを示す 1 文がない / 「次の表は、本ルールが返す項目と利用先を示す。」を足した / W9・vp-ux-readability / -
- 4: R3 / 例外 / 異常系 / 表の前に何の表かを示す 1 文がない / 「次の表は、入力不備の種類ごとの扱いと利用者の次の手を示す。」を足した / W9・vp-ux-readability / -
- 5: R3 / ルール（判定/計算）R-01 / 「『例外 / 異常系』の順で」がどの順か一つに決まらない / 「『例外 / 異常系』に示す順で」にした / W4 / -
- 6: R3 / 例外 / 異常系 / 直す人を指す語が「在庫確認担当」と「入力した担当者」（出力の表）で食い違い、「いずれも」も何を指すか曖昧 / 「いずれの例外でも判定せず、入力した担当者が直して再判定する。」にした / W4・W8・vp-ux-language-consistency / -
- 7: R3 / 例外 / 異常系 / 「値を推測して本ルールを呼び出さない」は、否定が「呼び出さないこと」にかかっているようにも読める / 「呼出元は、入力を取得できない場合に値を推測で補って本ルールを呼び出すことはしない。」にした / W5 / -
- 8: R3 / メモ / 将来課題 / 承認の条件の文で、誰が確かめるかが書かれていない / 人を出さずに「本ルールの承認の条件は、判定例 1〜9 の期待結果が…から一意に導けることである。」にした / W1・W6。迷った理由: W1 に従えば主語を書くことになるが、sample-authoring-standard は本文に承認の役割を書くことを禁じている。主語として「店主代表が確かめた時点で」を足す案は選ばなかった / 要判断
- 9: R3 / メモ / 将来課題（grade F001） / F001（承認できる条件の追記）は vp-qe-kata-conformance の指摘で、R3 の観点ではない。第 6 章には前の段で承認の条件がすでに入っている / - / vp-qe-kata-conformance（R1・R5 が扱う） / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/br-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、R3 の観点（W1〜W10 と `vp-ux-readability`、`vp-ux-language-consistency`）で sample の文だけを直した。意味・背景・例外・制約は変えていない。grade の F001 は別の段が扱う観点のため、この段では改訂していない。
