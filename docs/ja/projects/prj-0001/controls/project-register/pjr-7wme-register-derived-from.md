---
specdojo:
  id: prj-0001:pjr-7wme-register-derived-from
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-18T00:38:49Z"
  due_on: null
---

# PJR-7WME 個票に起票の元になった項目（`derived_from`）を記録できるようにする

## 1. 概要

個票の frontmatter に `derived_from`（元になった項目の ID の一覧。project をまたぐ場合は `prj-0001:PJR-XXXX`）を加え、`register add --from` で指定できるようにする。元の項目の側から派生先の一覧を辿れるようにし、decision の追跡先も同じ関係で表す。

## 2. 完了条件

2026-10-18 時点で、個票の frontmatter（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`）には、ほかの項目との関係を表す欄がない（`part_of` は属する一覧を表す）。起票の元になった項目は、起票の理由の文や「関連ドキュメント」の欄に人が手で書いている。[[prj-0001:pjr-3dy1-night-orchestrator-autopilot]] の夜の orchestrator が、実行中に見つけた問題を起票するための前提として、元の項目を機械的に辿れるようにする（利用者の指摘）。

条件:

- 個票の frontmatter の schema に `derived_from` を加える。値は、元になった項目の ID の配列とする。同じ project の項目は `PJR-XXXX`、ほかの project の項目は `prj-0002:PJR-XXXX` の形で書ける。
- `register add --from <ID>` と `register update --from <ID>` で指定できる。複数を指定できる。存在しない項目や、自分自身を指す場合は理由を出して止める。ほかの project の項目は、その project が設定にあれば存在を確かめ、なければ書式だけを確かめる。
- `register build` で、元の項目から派生先（その項目を `derived_from` に持つ項目）を辿れるようにする。個票の生成部分か、生成する一覧（`generated/`）のどちらに出すかを決めて実装し、理由を result に書く。個票の本文（人が書く部分）は書き換えない。
- decision から起票した todo を `derived_from` で表すことで、decision の「追跡先」を手で書かなくても辿れるようにする。既存の decision の「追跡先」の欄は書き換えない。
- `register history` など、項目の経緯を見る既存のコマンドで、`derived_from` と派生先が見えるようにするかを決め、見えるようにする場合は実装する。
- register の個票の規則（`docs/ja/specdojo/rulebooks/pjr-rulebook.md`）と、`docs/ja/specdojo/references/command-reference.md` の `register add`・`register update` に、`derived_from` と `--from` を書く。規則には、実行中に見つけた問題を起票するときは `derived_from` を付けることを書く。
- 既存の個票には、さかのぼって `derived_from` を入れない。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ                      |
| --- | --------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | schema に `derived_from` を加える             | DEV  | done | 配列・書式を定義          |
| 2   | `register add`・`update` に `--from` を加える | DEV  | done | 存在と自己参照を検証      |
| 3   | `register build` で派生先を辿れるようにする   | DEV  | done | 専用生成ビューに出力      |
| 4   | 規則とコマンドリファレンスを更新する          | DEV  | done | 履歴・decision 運用も記載 |

## 4. 対応結果

- 個票 Frontmatter と event schema に `derived_from` を追加し、同一 project の `PJR-XXXX` と別 project の `<project-id>:PJR-XXXX` を保持できるようにした。
- `register add --from` と `register update --from` を複数指定に対応させ、自己参照、設定済み project 内の不存在、書式不正を更新前に拒否するようにした。`register update --from -` で削除できる。
- 個票本文を変更せず、`register build` が `generated/pjr-derived-items.md` を生成して元項目から派生先を逆引きできるようにした。人が書く本文を生成処理で変更せず、複数個票・複数 project の関係を一か所で確認できるため、個票への追記ではなく専用の生成一覧を選んだ。設定済みの別 project の個票も走査対象とする。
- `derived_from` の変更を event と `register history` に含め、並行更新時の event merge でも復元できるようにした。
- rulebook、コマンドリファレンス、CHANGELOG、関連テストを更新した。既存個票や decision 本文の追跡先は変更していない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3dy1-night-orchestrator-autopilot]]: この項目を前提にする夜の自動化。
