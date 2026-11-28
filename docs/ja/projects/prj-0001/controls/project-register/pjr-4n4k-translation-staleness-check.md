---
specdojo:
  id: prj-0001:pjr-4n4k-translation-staleness-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                                         | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 古くなった翻訳を見つける検査と、その入口を作る               | DEV  | done | `specdojo index stale-translations` を実装           |
| 2   | 5 つの場合のテストを書く                                     | DEV  | done | 統合テストに 5 つの場合を追加                        |
| 3   | 今の英語版に検査を流し、結果を対応結果に書く                 | DEV  | done | 結果は対応結果に記載                                 |
| 4   | 使い方を文書に書き、型検査・lint・単体テストと親の検証を通す | DEV  | done | コマンドリファレンスに追記。親の検証は runner が実行 |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo index stale-translations` を足した（`src/docs/translation-staleness.ts`、`src/docs/index-command.ts`）。`.specdojo/index-config.yaml` の `locales` から正本の `ja` を除く言語を対象にし、`docs/<locale>/` 配下の各 Markdown について `git log <commit>..HEAD -- <正本のパス>` で正本の変更を数える。正本の言語は `translated_from.locale`、なければ `ja`。
- 状態は `fresh`・`stale`・`missing-translated-from`・`commit-not-found`・`source-missing` の 5 つ。古い翻訳と、確かめられない 3 種は区別して出す。各行に翻訳のパス、正本のパス、`translated_from.commit`、後続の commit の数と最新の commit を出し、`git log <commit>.. -- <正本のパス>` を案内する。
- 入口の判断: 新しい `index` の副コマンドにした。既存の `index` 群と同じく文書 ID・翻訳の整合を扱い、`package.json` の script を足さずに済むため。既定は警告（終了コード 0）、`--strict` で古い翻訳などがあれば終了コード 1 にする。
- テスト: `tests/src/docs/translation-staleness.integration.test.ts`。実 Git を使うため統合テストにした。新しい・古い・`translated_from` なし・commit なし・正本なしの 5 つと、locales の決定、整形を確かめる。
- 文書: `docs/ja/specdojo/references/command-reference.md` の `index` に追記した。
- 自動起票（段 2）は作っていない。

### 5.2. 今の英語版への実行結果

`specdojo index stale-translations`（2026-11-29）: 翻訳 35 件、古い 2 件、その他 1 件、新しい 32 件。

- 古い: `docs/en/specdojo/guides/civic-tech-starter-guide.md`（正本の後続 commit 1 件、最新 `1d522d01`）
- 古い: `docs/en/specdojo/rulebooks/pjr-rulebook.md`（後続 commit 1 件、最新 `c48c3df0`）
- `missing-translated-from`: `docs/en/index.md`

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo index stale-translations` を追加。`translated_from.commit` より後に正本が変わった翻訳を一覧にする（`--strict` で終了コード 1）。

### 5.4. 検証

- 統合テストは通した。`typecheck`・`lint:ts`（エラー 0）は確認した。親の検証は runner が実行する。

### 5.5. 残課題

- 段 2（直しの起票）は未決。
- `package.json` の変更はなし。`docs/en/index.md` の `translated_from` は未記入で、確かめ直しが要る。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]
- `PJR-F4MG`（英語版の作成）
