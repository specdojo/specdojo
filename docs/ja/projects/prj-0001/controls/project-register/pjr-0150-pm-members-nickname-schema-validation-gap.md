---
specdojo:
  id: prj-0001:pjr-0150-pm-members-nickname-schema-validation-gap
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0150 pm-members.yaml のnicknameスキーマ検証欠落によるcommand_templateインジェクションリスクの解消

## 1. 概要

`pm-members.schema.yaml` は `nickname` に安全な文字パターン（`^[a-z0-9][a-z0-9_-]{0,62}$`）を定義しているが、`loadMemberRoster`（`src/specdojo-config.ts`）は `yaml.load` のみで検証せず、`package.json` の `validate:schema` 集約スクリプトにも `pm-members.schema.yaml` が含まれていない。一方 `resolveMemberCommand`（`src/exec-agent-config.ts`）は `nickname` を `command_template` のプレースホルダへ無エスケープで展開し、`spawn(command, { shell: true })` で実行する。このため `pm-members.yaml` を書き換えられる者がいれば、`nickname` にシェルメタ文字を仕込むことでコマンドインジェクションが成立し得る。schemaで定義した制約を実装側で確実に担保する対応を行う。

## 2. 完了条件

- `pm-members.schema.yaml` が `npm run validate:schema` の集約対象に追加され、CIで検証される。
- `resolveMemberCommand`（またはその手前）で、`command_template` に展開する `nickname` 等プロジェクト文書由来の値を、schemaと同等のパターンで再検証し、不一致時は例外を送出する多層防御が実装されている。
- 上記の対応により、不正な `nickname` を含む `pm-members.yaml` が `exec run` 実行時にエラーとして検知されることが確認できている。
- 対応内容が該当する設計書・運用ガイドへ反映されている。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `pm-members.schema.yaml` を `validate:schema` 集約スクリプトへ追加  | ARC  | open | -    |
| 2   | `resolveMemberCommand` 側での `nickname` 再検証（多層防御）の実装   | ARC  | open | -    |
| 3   | 不正な `nickname` を含む `pm-members.yaml` でのエラー検知の動作確認 | ARC  | open | -    |
| 4   | 対応内容の設計書・運用ガイドへの反映                                | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- docs/specdojo/schemas/v1/pm-members.schema.yaml
- src/specdojo-config.ts
- src/exec-agent-config.ts
- [[pm-members-rulebook|プロジェクトメンバー定義ルールブック]]
- [[exec-config-guide|exec設定ガイド]]
