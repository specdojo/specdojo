---
specdojo:
  id: prj-0001:pjr-82h2-readme-english-overview
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-23T22:38:18Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T01:44:24Z"
  conclusion: README に英語の概要（目的・位置づけ・クイックスタートと文書サイトへの道筋）を足した
  commit_type: docs
  commit_scope: readme
---

# PJR-82H2 README に英語の短い概要を足す

## 1. 概要

OSS として広めるため、README に目的・位置づけ・クイックスタートへの道筋を英語で短く書く

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- `README.md` に英語の短い概要の節を足す。内容は、SpecDojo の目的（kata による理解の負債の解消で、シビックテックを持続可能にする。PJR-Y5RD）、ほかの仕様駆動開発の道具との位置づけ（その上流で仕様と設計の体系を担う）、クイックスタートと文書サイトへの道筋（文書は日本語であること）とする。
- 日本語の本文は変えない。英語の節は 1 画面に収まる長さにする。
- 書いた位置づけが PJR-Y5RD と PJR-36QG の `3.17.` と食い違わないことを確かめ、個票の対応結果に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md` を通す。

## 4. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                            |
| --- | ------------------------------ | ---- | ---- | ----------------------------------------------- |
| 1   | 英語の概要を追加し、根拠と照合 | DEV  | done | README 冒頭に追加し、位置づけと案内先を確認した |

## 5. 対応結果

`README.md` の冒頭に英語の概要を追加し、目的、仕様駆動開発ツールとの関係、日本語の Quick Start と文書サイトへのリンクを示した。日本語本文は変更していない。

[[prj-0001:pjr-y5rd-civic-tech-comprehension-debt|PJR-Y5RD]] のシビックテックと理解の負債、復元・確認・人の確定・記録の方針、および [[prj-0001:pjr-36qg-competitive-landscape-and-release|PJR-36QG]] の `3.17.` にある新規開発と既存システムからの復元の両方を扱う位置づけと照合し、矛盾がないことを確認した。残課題はない。

### 5.1. CHANGELOG に書く事項

- 追加: README に SpecDojo の目的と位置づけ、Quick Start への案内を英語で追加。

## 6. 関連ドキュメント

- [[prj-0001:pjr-y5rd-civic-tech-comprehension-debt|PJR-Y5RD]]: 目的と位置づけの決定。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release|PJR-36QG]]: `3.17.` の比較と評価。
