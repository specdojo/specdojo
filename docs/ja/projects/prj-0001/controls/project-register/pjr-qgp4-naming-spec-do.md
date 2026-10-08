---
specdojo:
  id: prj-0001:pjr-qgp4-naming-spec-do
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: PO
  registered_at: "2026-10-08T03:44:06Z"
  due_on: null
  completed_at: "2026-10-08T03:44:56Z"
  conclusion: SpecDojo を仕様道（Spec-Dō、the way of specification）の道場と呼ぶ。仕様駆動開発とは名乗らない。表記・標語・比喩の範囲と、守破離と approach の対応を定めた
---

# PJR-QGP4 SpecDojo の呼び方を仕様道（Spec-Dō）にする

## 1. 背景

README・docs サイトのトップ・概要ガイドは、SpecDojo を「仕様駆動開発のためのドキュメントフレームワーク」と呼んでいる。仕様駆動開発（Spec-Driven Development, SDD）は、2026 年の市場では仕様から AI にコードを書かせる手法を指し、Spec Kit・Kiro・OpenSpec が代表である。[[prj-0001:pjr-nyzr-adoption-strategy]] で SpecDojo を「仕様と設計を作り、運用まで保つ基盤」と位置づけ、SDD のツールとは名乗らないと決めたため、この呼び方は位置づけと矛盾する。

利用者の要望は、SDD のように一言で分かり略しても分かりやすいこと、道場の比喩を使うことである。調べた結果、英語圏で「spec」を軸にした言葉（Specification Engineering、SpecOps、Spec as Code、Living Specs）は、いずれも SDD の文脈で既に使われていた。日本語の「型駆動」は Type-Driven Development と、略語の KDD はデータマイニングの国際会議と、Dojo-Driven Design は DDD（Domain-Driven Design）と衝突する。「SpecDo」「Spec-Do」という名前のツールや方法論は見つからなかった。

## 2. 検討した選択肢

| 選択肢                              | 内容                                                                  | 利点                                                                                           | 懸念                                                             |
| ----------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| A: 要求・設計のライフサイクル管理   | BABOK の知識エリア（Requirements Life Cycle Management）にそろえる    | 確立した概念で、PM やビジネスアナリストに説明しやすい                                          | 硬い。一言で覚えにくい                                           |
| B: 仕様と設計を育てるフレームワーク | 日常の言葉で「作って保ち続ける」を言う                                | やわらかく伝わる                                                                               | 略語にならない。道場の比喩が入らない                             |
| C: Kata-Driven Specification（KDS） | 型に沿って仕様を作る手法として SDD に似た略語にする                   | SDD と並べて理解されやすい                                                                     | 日本語では「型」を避ける必要がある。SDD の仲間と見られる         |
| D: 仕様道（Spec-Dō）（採用）        | 柔道・剣道のように仕様を「道」として稽古する。SpecDojo は仕様道の道場 | 一言で覚えやすく、衝突しない。名前の由来がそのまま方法論になり、道場の比喩が仕組みを説明できる | 英語の話者は動詞の do と読みがち。和風の演出が過剰に見えるおそれ |

## 3. 決定内容

選択肢 D を採る。SpecDojo を「仕様道（Spec-Dō、the way of specification）の道場」と呼ぶ。「仕様駆動開発のためのドキュメントフレームワーク」という呼び方はやめ、仕様駆動開発には「そのツールの上流で仕様と設計の体系を担う」と関係として触れるにとどめる。

表記と比喩の規則は次のとおりとする。

| 項目                 | 規則                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 日本語               | 仕様道（Spec-Dō）                                                                                             |
| 英語                 | Spec-Dō — the way of specification。冒頭で「dō（道）は judō や kendō と同じく the way の意味」と 1 行説明する |
| 記号を使いにくい場所 | Spec-Do。説明の文では Spec-Dō に統一する                                                                      |
| ツールとの関係       | SpecDojo is the dojo where you practice Spec-Dō.                                                              |
| 標語                 | 決めて、書いて、腐らせない（英語: Decide with a register, write with kata, and keep your specs alive.）       |
| 使う比喩             | dojo・kata・dō・shu-ha-ri（守破離）・稽古に限る。ninja・samurai・zen などは使わない                           |

道場の比喩と仕組みの対応は次のとおりとする。

| 道場の言葉 | SpecDojo の仕組み                                         |
| ---------- | --------------------------------------------------------- |
| 型（kata） | rulebook・recipe・sample・template                        |
| 稽古       | 型に沿って AI と仕様を書く（exec）                        |
| 審査       | grade（型に照らして品質を評価する）                       |
| 稽古日誌   | register（決めたこと・迷っていることの台帳）              |
| 守・破・離 | `approach` の `fully-guided`・`recipe-guided`・`freeform` |

## 4. 採択理由

- 一言で覚えやすく、略語を作らなくても短い。調べた範囲で衝突がない。
- 名前の SpecDojo（Spec の道場）の由来がそのまま方法論の名前になり、道場の比喩が飾りではなく仕組み（kata・grade・register・approach）を説明できる。
- 武道の言葉（code kata、coding dojo、Shu Ha Ri）は英語圏のソフトウェア開発で既に定着しており、日本人以外にも受け入れられやすい。英語圏での受け止め方は、英語の README を出す段階で実際の反応を確かめる。

## 5. 承認

| 項目     | 内容                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                 |
| 決定日   | 2026-10-08                                                                            |
| 承認方式 | commit                                                                                |
| 証跡     | 利用者が orchestrator との対話で仕様道（Spec-Dō）を指示し、本個票の更新を commit した |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| 影響範囲   | README、docs サイトのトップ、概要ガイド、`package.json` の説明、philosophy や waza ガイドなど比喩を使う文書 |
| 必要な対応 | 冒頭の文と説明を直す todo を起票する。英語圏の反応の確認は、普及戦略の段階 2 で行う                         |
| 追跡先     | 呼び方を反映する todo（起票後に追記する）                                                                   |

## 7. 関連ドキュメント

- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]（競合の比較）
