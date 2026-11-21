---
specdojo:
  id: prj-0002:pjr-pw1y-cse-definition
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: BA
  registered_at: "2026-11-21T05:58:36Z"
  due_on: "2026-11-30"
  block_reason: "executor validation failed or not run: npm run validate:history-links"
  derived_from:
    - PJR-WBWX
---

# PJR-PW1Y Continuous Specification Engineering の定義の文と略称を決めて正本にまとめる

## 1. 概要

PJR-WBWX の決定を受け、分野の定義の文・近い概念との関係の表・略称の扱いを正本にまとめ、README・概要ガイド・specdojo-lp への反映の範囲を決める

## 2. 入力

- PJR-WBWX で、分野の正式名称を Continuous Specification Engineering とし、Spec道 を愛称、SpecDojo をその道場と位置付けることが決まった。
- 略称の扱いは PJR-WBWX で未決のまま残した。CSE は Computer Science and Engineering とぶつかる。
- 「Specification」だけでは範囲が狭く聞こえるため、定義の文で成果物の体系・判断の記録・型と評定・運用中の維持まで含むことを補う。
- 関係を示す近い概念は SDD（仕様駆動開発）・Docs as Code・Continuous Requirements Engineering。
- 影響先は README・概要ガイド（specdojo-overview-guide）・specdojo-lp。

## 3. 完了条件

- 定義の文（日本語と英語）が正本の文書に書かれ、成果物の体系・判断の記録・型と評定・運用中の維持まで含むことが読み取れる。
- SDD・Docs as Code・Continuous Requirements Engineering との関係が表で示されている。
- 略称の扱い（使う略称、または略さないこと）が決まり、理由が書かれている。
- 正本の文書の置き場所（新しいガイドか、概要ガイドの章か）が決まり、理由が本個票の対応結果に書かれている。
- README・概要ガイド（`specdojo-overview-guide`）・specdojo-lp について、直す箇所と直し方の範囲が書かれ、反映の todo が `--from PJR-PW1Y` で起票されている。
- `npm run lint:md` が通る。

## 4. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                           |
| --- | ------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | 定義の文の案を作る                                                  | BA   | done | 日本語と英語の定義の文を正本の「定義」に書いた                 |
| 2   | 近い概念との関係の表を作る                                          | BA   | done | SDD・Docs as Code・Continuous Requirements Engineering の 3 行 |
| 3   | 略称の候補を比べて決める                                            | BA   | done | CSE・CSpE・略さない、を比べて略さないことにした                |
| 4   | 置き場所を決めて正本の文書にまとめる                                | BA   | done | `specdojo-philosophy` の新しい 1 章に置いた                    |
| 5   | README・概要ガイド・LP への反映の範囲を決め、反映の todo を起票する | BA   | done | PJR-P8G7・PJR-KGH2・PJR-T1TH を起票した                        |

## 5. 対応結果

正本を [[specdojo:specdojo-philosophy|SpecDojo の考え方]] の章「分野: Continuous Specification Engineering」に置いた。章は「定義」（日本語と英語の定義の文）・「近い概念との関係」（表）・「略称の扱い」の 3 節からなる。既存の章は 1 つずつ後ろへずれ、番号を振り直した。

置き場所の決定と理由:

- 新しいガイドではなく、`specdojo-philosophy` の章にした。
- 分野の定義は「なぜそう考えるか」を扱う philosophy の役割に合い、同じ文書の「基本方針」（Docs as Code など）と並べると関係の表の根拠がそろう。
- 概要ガイドは入口の文書で、詳細は他の文書に委ねる方針である。正本を置くと「SpecDojoとは」が長くなるうえ、status が `ready` で、変更は反映の todo で人間の確認を経て扱うほうがよい。
- 定義と表だけで新しいガイドを作ると文書が増え、philosophy と内容が重なる。

略称の扱い: 正式な略称は設けず、略さずに書く。短く呼ぶときは愛称の Spec道 を使う。理由は正本の「略称の扱い」に書いた（CSE は既存の略称とぶつかる、造語の略称は伝わらない、短い呼び名は愛称が担っている）。

反映の範囲（直す箇所と直し方は各個票の入力と完了条件に書いた）:

| 対象       | 直す箇所                                                                               | 直し方                                                                                                   | 起票     |
| ---------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| README     | 冒頭の「SpecDojo は、Spec道（仕様道）の道場です。」と `package.json` の `description`  | 正式名称と愛称を示す文に直し、正本の章を参照させる。英語の紹介文は英語の定義の文に合わせる               | PJR-P8G7 |
| 概要ガイド | 「SpecDojoとは」の冒頭の文と「目的別の次の読み物」の案内                               | 正式名称と愛称を示す文に直し、正本の章を参照させる。定義と表は再掲しない                                 | PJR-KGH2 |
| LP         | `Hero.astro` の見出しの近く・`ToolFit.astro` の SDD の行・`index.astro` の description | 正式名称と道場の位置付けを短く載せ、SDD の行を関係の表にそろえる。description は含めるかを決めて反映する | PJR-T1TH |

`package.json` の `description` は npm に出る紹介文で README と同じ役割のため、README の todo の範囲に含めた。

_ASSUMPTION_: 定義の文と関係の表は、PJR-WBWX と本個票の入力から BA として起草した。`specdojo-philosophy` は `draft` のままとし、文言の確定は人間のレビューで行う。

残課題: 反映の 3 件（PJR-P8G7・PJR-KGH2・PJR-T1TH）。期限はまだ決めておらず `-` とした。

## 6. 関連ドキュメント

- [[specdojo:specdojo-philosophy]]: 正本。「分野: Continuous Specification Engineering」の章。
- [[prj-0002:pjr-wbwx-discipline-name]]: 派生元。分野の正式名称の決定。
- [[prj-0002:pjr-p8g7-readme-cse-positioning]]・[[prj-0002:pjr-kgh2-overview-guide-cse-positioning]]・[[prj-0002:pjr-t1th-lp-cse-positioning]]: 反映の todo。
- [[specdojo:specdojo-overview-guide]]: 影響先。
- README（リポジトリルートの `README.md`）と specdojo-lp: 影響先。
