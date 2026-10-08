---
specdojo:
  id: prj-0001:pjr-j29x-readme-dojo-vocabulary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-08T13:52:50Z"
  due_on: null
---

# PJR-J29X README とトップに新しい標語と道場の言葉を反映する

## 1. 概要

標語を「決めて、書いて、鍛え続ける。」に改め（PJR-QGP4）、README の見出しと冒頭に道場の言葉（記帳・型・実戦・評定・講評・流）を加えて、比喩と機能を結びつける。

根拠は [[prj-0001:pjr-qgp4-naming-spec-do]] の決定（標語の変更と、技・流の名前）。

## 2. 完了条件

- `README.md`、`docs/ja/index.md`、`docs/ja/specdojo/guides/specdojo-overview-guide.md` の標語「決めて、書いて、腐らせない。」を「決めて、書いて、鍛え続ける。」に改める。
- README の冒頭の説明の文で、「判断を記帳し、型に沿って実戦で書き、評定で鍛え続ける」のように仕組みを語る。
- README の「できること」の見出しに道場の言葉を添え、比喩と機能を結びつける。目安は次のとおり（表現は README の文体に合わせてよい）。
  - 記帳 — 決めたこと・迷っていることを、型に沿って残す（登録簿）
  - 会話で進められる（対話型オーケストレーター）。オーケストレーターに道場の役職の名前（師範代など）は付けない
  - 型と実戦 — 100 種類以上の型に沿って、実戦で成果物を書く
  - 評定と講評 — 型に照らして評定し、講評で完了を判断する
- README の冒頭の近くに「道場の言葉」の短い表を置く。型（Kata）・技（Waza、`specdojo` CLI の記帳・実戦・評定・講評）・流（Ryu、守・破・離 ほか）を載せる。
- 「登録簿ひとつから始められます」は、記帳の言葉に合わせて言い換える（例: 「記帳ひとつから始められます」）。
- 比喩は PJR-QGP4 の範囲に限り、ninja・samurai・zen などは使わない。CLI の名前と値は変えない。
- `package.json` の `description` は agent の書き込み禁止対象のため変えない（orchestrator が合わせる）。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                  | 担当         | 状態 | メモ   |
| --- | ------------------------------------- | ------------ | ---- | ------ |
| 1   | README・トップ・概要ガイドを改める    | DEV          | open | -      |
| 2   | `package.json` の説明を標語に合わせる | orchestrator | open | 統合後 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qgp4-naming-spec-do]]（呼び方の決定）
