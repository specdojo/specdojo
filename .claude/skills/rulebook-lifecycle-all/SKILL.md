---
name: rulebook-lifecycle-all
description: '`docs/ja/specdojo/rulebooks` 配下の全 `*-rulebook.md` を対象に、rules と派生成果物（instruction / sample）のライフサイクルを順次実行するための Skill です。'
---

# SKILL: rulebook-lifecycle-all

`docs/ja/specdojo/rulebooks` 配下の全 `*-rulebook.md` を対象に、
rules と派生成果物（instruction / sample）のライフサイクルを順次実行するための Skill です。

## 使いどころ

- rules を単体ではなく全件で更新したいとき
- rules / instruction / sample の整合を全体で揃えたいとき
- `PO` 承認ゲートを `<name>` 単位で運用しながら一括実行したいとき

## 前提

- 共通ライフサイクル: `@file:.github/skills/rulebook-lifecycle/SKILL.md`
- 対象パス: `docs/ja/specdojo/rulebooks/*-rulebook.md`
- 既定モード: `standard`

## 実行フロー

1. `docs/ja/specdojo/rulebooks` から `*-rulebook.md` を列挙する
2. 対象をファイル名昇順で固定する（再現性確保）
3. 各 `<name>` について `rulebook-lifecycle` を ①〜⑦で実行する
4. ④/⑦ は `<name>` ごとに `PO` 承認を待ってから次へ進む
5. 全件完了後に `npm run -s lint:md` を実行する

## モード運用

- `manual`: ①③⑤⑥の都度、人の完了確認を必須にする
- `standard`: ②④⑦で人が介在する
- `agent-max`: ②を Agent に委譲可（④⑦は人承認必須）
- `agent-ultra`: ④をスキップし、⑦で一括承認する

## 出力

- 対象一覧（実行順）
- `<name>` ごとの結果
  - `rules`: updated / created / no-change
  - `instruction`: updated / created / no-change
  - `sample`: updated / created / no-change
  - review 指摘（あれば）
  - 承認結果（④/⑦）
- 全体サマリ（成功件数 / 差し戻し件数）
- lint 結果

## 注意事項

- 承認待ちの `<name>` がある間は次の `<name>` へ進まない
- 途中中断時は `<name>` とステップ番号（①〜⑦）を必ず記録する
