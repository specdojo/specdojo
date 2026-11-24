---
specdojo:
  id: prj-0001:pjr-c11r-exec-scope-too-broad-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T04:56:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-E73Z
  commit_type: fix
  commit_scope: exec
---

# PJR-C11R register の run の変更範囲が docs 全体と読まれて並べられない

## 1. 課題内容

個票の本文の docs/ などの語から project:docs と読まれ、ほかの docs を変える run とすべてぶつかる

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                 |
| -------- | ------------------------------------------------------------------------------------ |
| 原因     | 個票の本文の上位のディレクトリだけの語（docs/ など）から、変更範囲を docs 全体と読む |
| 対応策   | 上位のディレクトリだけの語を範囲にせず、範囲が広すぎるときは警告する                 |
| 依存事項 | なし                                                                                 |
| 完了条件 | 下の箇条書きのすべてを満たす                                                         |

- `exec run --register` の変更範囲の予約が、個票の本文の `docs/` などの語から `project:docs`（docs 全体）と読まれ、ほかの docs を変える run とすべてぶつかって並べられない。2026-11-23 の PJR-E73Z は、ほかの run の予約とぶつかって 3 回始まらず、PJR-EF4Z も E73Z の統合を待った。
- 個票の本文から範囲を読むときに、`docs/`・`src/` のような上位のディレクトリだけの語を範囲にしない（または、より狭い語があればそちらを使う）。範囲が広すぎるときは、予約の前に警告を出す。読み方を変えたときに、今まで防げていた衝突を見逃さないことを確かめる。
- 単体テストを足す（上位のディレクトリだけの語、狭い語との組み合わせ）。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner の動きを変える場合は、統合の後に orchestrator が `exec smoke` を流して確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
