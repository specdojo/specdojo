---
specdojo:
  id: prj-0001:pjr-0wym-naming-spec-do-apply
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T03:45:19Z"
  due_on: null
  completed_at: "2026-10-08T12:07:23Z"
  conclusion: README・docs サイトのトップ・概要ガイド・ryu-guide・waza-guide・package.json の説明を、仕様道（Spec-Dō）の呼び方と技・流の名前に改めた。CLI の値は変えていない
---

# PJR-0WYM README と概要の呼び方を仕様道（Spec-Dō）に改める

## 1. 概要

[[prj-0001:pjr-qgp4-naming-spec-do]] で、SpecDojo を「仕様道（Spec-Dō）の道場」と呼び、技（CLI の機能）と流（`approach`）に道場の名前を付けることを決めた。README・docs サイトのトップ・概要ガイドは、まだ「仕様駆動開発のためのドキュメントフレームワーク」と呼んでいる。決定に従って、冒頭の文と説明を改める。

## 2. 完了条件

- `README.md`、`docs/ja/index.md`、`docs/ja/specdojo/guides/specdojo-overview-guide.md` の冒頭の文を、PJR-QGP4 の表記の規則に従って「仕様道（Spec-Dō）の道場」とする。仕様駆動開発とは名乗らず、「仕様駆動開発のツールの上流で、仕様と設計の体系を担う」と関係として触れる。標語「決めて、書いて、腐らせない」を載せる。
- 概要ガイドの Kata・Waza・Ryu の説明に、技の名前（記帳＝register、実戦＝exec、評定＝grade、講評＝review）を加える。
- `docs/ja/specdojo/guides/ryu-guide.md` の approach の一覧に、各流の名前（守・破・離・型起こし・見取り・型寄せ・手入れ・免許・皆伝）を加え、守破離の説明を載せる。
- `docs/ja/specdojo/guides/waza-guide.md` に、技の名前と CLI のコマンドの対応を載せる。
- CLI のコマンド名、`approach` の値、設定のキーは変えない。名前は表示と文書だけで使う。
- 比喩は PJR-QGP4 の範囲（dojo・kata・dō・守破離・稽古と、決めた名前）に限る。
- `package.json` の `description` は agent の書き込み禁止対象のため、この todo では変えない。orchestrator が統合後に、表記の規則に従った英語の説明へ改める。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                       | 担当         | 状態 | メモ                               |
| --- | ---------------------------------------------------------- | ------------ | ---- | ---------------------------------- |
| 1   | README・トップ・概要ガイド・ryu-guide・waza-guide を改める | DEV          | done | CLI の値は変えず表示と文書だけ変更 |
| 2   | `package.json` の説明を改める                              | orchestrator | done | 99a3483c4                          |

## 4. 対応結果

- `README.md`、`docs/ja/index.md`、`docs/ja/specdojo/guides/specdojo-overview-guide.md` の冒頭を「仕様道（Spec-Dō）の道場」に改め、仕様駆動開発のツールとの上流関係と標語「決めて、書いて、腐らせない」を記載した。
- 概要ガイドと `docs/ja/specdojo/guides/waza-guide.md` に、記帳・実戦・評定・講評と CLI 機能の対応を記載した。
- `docs/ja/specdojo/guides/ryu-guide.md` に、各 `approach` の流の名前と守破離の説明を記載した。
- CLI のコマンド名、`approach` の値、設定のキーは変更していない。
- 残課題は、orchestrator が統合後に行う `package.json` の英語 description 更新である。
- orchestrator が `package.json` の `description` を、英語の表記の規則に従って "A dojo for Spec-Dō, the way of specification: decide with a register, write specs and designs with kata, and keep them alive with AI." に改めた（99a3483c4）。
- README の「登録簿ひとつから始められます」は、PJR-XMQH のクイックスタートを作るときにまとめて見直す。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qgp4-naming-spec-do]]（呼び方の決定）
- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
