---
specdojo:
  id: prj-0001:pjr-77jb-exec-run-named-disabled-member
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T00:23:41Z"
  derived_from:
    - PJR-XA6Y
---

# PJR-77JB exec run が名前で指定された無効な member をそのまま起動する

## 1. 課題内容

agent-members.yaml で disabled にした member でも、exec run --executor-by や --reporter-by で名前を指定すると起動前に断られない。grade run の --by は断る

## 2. 入力

- 2026-11-21、agy の member を disabled にした後、exec run --register PJR-XA6Y --executor-by flash-high-executor --reporter-by gemma26-reporter --dry-run が通った。grade run --by flash-high-executor は「--by agent is disabled in agent-members.yaml」で断られた
- src/exec/run/shared.ts は自動選択でだけ disabled を除き、コメントに Named selections resolve outside this function とある。src/exec/agent-plan.ts と src/exec/trial-core.ts は disabled を確かめている
- 当面の回避策として、exec-defaults の antigravity の `command_template` を外し、起動コマンドを解決できなくして断っている（afbebe967）

## 3. 影響範囲

| 観点         | 影響                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| スコープ     | exec の agent の名前の解決（`--executor-by`・`--reporter-by`・代わりの agent・routing・strategy の agent） |
| スケジュール | 利用を止めたい agent を確実に止められないため、止めるたびに起動コマンドを外す回避策が要る                  |
| コスト       | -                                                                                                          |
| 品質         | 無効にした agent が名前の指定で起動しうる。規約で止めた agy では、規約違反の起動につながる                 |
| 関係者       | DEV                                                                                                        |

## 4. 対応方針

| 項目     | 内容                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 名前で指定された member の解決は自動選択の関数を通らず、`disabled` を見ていない（`src/exec/run/shared.ts` のコメント）       |
| 対応策   | 名前で指定された member を解決する箇所で `disabled` を確かめ、起動の前に理由付きのエラーにする。代わりの選択では候補から外す |
| 依存事項 | なし                                                                                                                         |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                 |

完了条件の内訳。

- exec が agent を名前で解決するすべての経路（`exec run --register`・schedule のタスク・job・`exec trial`・`exec resume`、`--executor-by`・`--reporter-by`、exec-defaults の `routing`、strategy の `agent`、routine の `fallback_executor`）で、`disabled: true` の member を起動の前にエラーにする。別名から辿った実体が無効な場合も同じ。エラーの文に nickname と `.specdojo/agent-members.yaml` を含める。
- rate limit などで代わりの agent を選ぶときは、`disabled` の member を候補から外して次の候補へ進む。候補が残らなければ、理由付きで止める。
- `grade run --by` の今の動き（無効な member を断る）は変えない。
- 単体テストで、名前の指定・routing・代わりの選択の 3 つの場合を確かめる。
- prj-0001 の exec-defaults で antigravity の `command_template` を外している回避策（afbebe967）は、この項目では変えない（保護された設定のため）。戻してよいかの判断を対応結果と `handoff` に書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
