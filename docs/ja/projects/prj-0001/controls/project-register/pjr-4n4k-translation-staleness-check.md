---
specdojo:
  id: prj-0001:pjr-4n4k-translation-staleness-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T23:35:02Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-F4MG
---

# PJR-4N4K 日本語版より古くなった翻訳を見つける検査を足す

## 1. 概要

日本語版（正本）が書き換えられても、英語版などの翻訳が古くなったことを知らせる仕組みがない。翻訳の frontmatter の `specdojo.translated_from.commit` と正本の git の履歴を比べ、古くなった翻訳を一覧にする検査を足す（段 1）。直しの起票（段 2）は、この項目の後に決める。

## 2. 入力

- 翻訳の variant は frontmatter の `specdojo.translated_from` に正本の言語と、訳した時点の正本の commit を書く（ID 標準の「翻訳元の版」）。差分は git log で手で追うしかない
- 翻訳が古くなったことを見つける検査も、直しを起票する仕組みもない（2026-11-28 の確認）
- 段 1（見つける検査）をこの項目で作り、段 2（直しの todo の自動起票）は後で決める。人の確かめなしに翻訳を自動で書き換えない（利用者の決定、2026-11-28）
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-28）

## 3. 完了条件

- 翻訳の variant（`docs/en/` などの、`specdojo.translated_from` を持つ文書）ごとに、`translated_from.commit` より後に正本（`docs/ja/` の同じパス）を変えた commit があるかを調べ、古くなった翻訳を一覧にする検査を足す。対象の言語は `.specdojo/index-config.yaml` の `locales` から決め、`docs/en/` を決め打ちにしない。
- 一覧の各行に、翻訳のパス、正本のパス、`translated_from.commit`、その後に正本を変えた commit の数と最新の commit を出す。差分の確かめ方として `git log <commit>.. -- <正本のパス>` を案内する。
- 次の場合も一覧に出し、古い翻訳とは区別する。
  - `translated_from` がない翻訳
  - commit が見つからない翻訳
  - 正本がない翻訳
- 古い翻訳があっても既定では失敗にしない（警告）。入口（コマンド、`npm run` の script、lint のどれか）と、失敗にする option の有無は executor が決め、理由を個票の対応結果に書く。
- 単体テストまたは統合テストで、次の 5 つの場合を確かめている。
  - 新しい翻訳
  - 古い翻訳
  - `translated_from` がない翻訳
  - commit が見つからない翻訳
  - 正本がない翻訳
- 今の英語版（F4MG で作ったもの）に対して検査を流し、結果を個票の対応結果に書く。
- 検査の使い方を、コマンドリファレンスなど `docs/ja/specdojo/` の該当箇所に書く。
- 翻訳を直す todo の自動起票（段 2）は、この項目では作らない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。`package.json` の script の追加など、変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 古くなった翻訳を見つける検査と、その入口を作る               | DEV  | open | -    |
| 2   | 5 つの場合のテストを書く                                     | DEV  | open | -    |
| 3   | 今の英語版に検査を流し、結果を対応結果に書く                 | DEV  | open | -    |
| 4   | 使い方を文書に書き、型検査・lint・単体テストと親の検証を通す | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
