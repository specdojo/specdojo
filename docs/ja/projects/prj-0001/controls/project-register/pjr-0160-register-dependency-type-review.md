---
specdojo:
  id: prj-0001:pjr-0160-register-dependency-type-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0160 登録簿type dependencyの要否見直し(廃止 or Assumption Log化 or 明文化)

## 1. 概要

登録簿 type の `dependency` は PMBOK 標準の登録簿ではなく、SpecDojo 独自に「外部の対応・提供物への依存（外部待ち）」を記録するために用意された type である。しかし exec 実行区分（edit/investigate）を持たず、生成 PM ログも無く、実績は 0 件で、`waiting` ステータスや `prj-assumptions-constraints-dependencies` 成果物と役割が重複している。8 type 中で最も配線が薄い純ラベルであるため、要否を判断し対応する。

## 2. 完了条件

- `dependency` を「廃止」「`assumption` type へ置換（PMBOK Assumption Log 準拠）」「現状維持＋明文化」のいずれかに決定し、根拠を記録している。
- 決定した方針に沿って、必要な成果物（schema / コード / テンプレート / ドキュメント）が一貫して更新されている。
- enum を変更する場合、`pjr-index.schema.yaml`・`register.ts` の `VALID_TYPES`・`exec-register.ts` の `EDIT_TYPES`/`INVESTIGATE_TYPES`・type 別個票テンプレート・`pjr-rulebook` / `register-operation-guide` が齟齬なく更新されている。
- 既存データに `dependency` 行がある場合の移行方針（別 type への振替 or 据え置き）が定義されている。
- 変更後に `npm run lint:md` / `npm run lint:ts` / `npm run validate:schema` / 関連テストが通る。

## 3. 設計方針（検討する3案）

| 案                  | 内容                                                                                           | 補足                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| A. 廃止             | `dependency` を enum から除去し、外部待ちは `todo`/`issue` ＋ `waiting` ステータスで表現する   | 最小構成。重複解消。移行は既存行の type 振替が必要 |
| B. `assumption` 化  | `dependency` を廃し、PMBOK 標準の Assumption Log に対応する `assumption` type と生成ログを追加 | PMBOK 準拠度が上がるが実装量は最大                 |
| C. 現状維持＋明文化 | enum は変えず、`dependency` の用途と `waiting`/成果物との使い分けを rulebook に明記            | 破壊的変更なし。重複の混乱のみ解消                 |

## 4. 作業内容

| No  | 作業                                                             | 担当   | 状態 | メモ                           |
| --- | ---------------------------------------------------------------- | ------ | ---- | ------------------------------ |
| 1   | 3案（廃止 / assumption化 / 明文化）の比較と方針決定              | _TODO_ | open | decision として結論を記録      |
| 2   | 決定に応じた schema / コード / テンプレート / ドキュメントの更新 | _TODO_ | open | enum変更時は重複定義を同時修正 |
| 3   | 既存 `dependency` 行の移行対応（振替 or 据え置き）               | _TODO_ | open | 現状 prj-0001 は該当 0 件      |
| 4   | lint / schema / テストによる検証                                 | _TODO_ | open | md/ts/schema/関連テスト        |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- `docs/specdojo/schemas/v1/pjr-index.schema.yaml`
