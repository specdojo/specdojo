---
specdojo:
  id: prj-0002:pjr-pw1y-cse-definition
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-21T05:58:36Z"
  due_on: "2026-11-30"
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

| No  | 作業                                                                | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 定義の文の案を作る                                                  | BA   | open | -    |
| 2   | 近い概念との関係の表を作る                                          | BA   | open | -    |
| 3   | 略称の候補を比べて決める                                            | BA   | open | -    |
| 4   | 置き場所を決めて正本の文書にまとめる                                | BA   | open | -    |
| 5   | README・概要ガイド・LP への反映の範囲を決め、反映の todo を起票する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0002:pjr-wbwx-discipline-name]]: 派生元。分野の正式名称の決定。
- [[specdojo:specdojo-overview-guide]]: 影響先。
- README（リポジトリルートの `README.md`）と specdojo-lp: 影響先。
