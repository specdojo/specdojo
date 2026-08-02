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

| No  | 作業                                                                | 担当 | 状態    | メモ                                                                                             |
| --- | ------------------------------------------------------------------- | ---- | ------- | ------------------------------------------------------------------------------------------------ |
| 1   | `pm-members.schema.yaml` を `validate:schema` 集約スクリプトへ追加  | ARC  | handoff | `package.json` は edit-agent の書込境界（`docs/**`/`src/**`/`tests/**`）外。差分は対応結果に記載 |
| 2   | `resolveMemberCommand` 側での `nickname` 再検証（多層防御）の実装   | ARC  | done    | `src/exec-agent-config.ts` に `NICKNAME_PATTERN` で再検証を追加                                  |
| 3   | 不正な `nickname` を含む `pm-members.yaml` でのエラー検知の動作確認 | ARC  | done    | 実行時（unit test）と schema（vitest）両層で検知を確認                                           |
| 4   | 対応内容の設計書・運用ガイドへの反映                                | ARC  | done    | `exec-config-guide.md` に nickname インジェクション対策の節を追加                                |

## 4. 対応結果

- 実行時の多層防御を実装した。`resolveMemberCommand`（`src/exec-agent-config.ts`）が `{nickname}` を `command_template` へ展開する直前に、schema と同一のパターン `^[a-z0-9][a-z0-9_-]{0,62}$`（`NICKNAME_PATTERN`）で `nickname` を再検証し、不一致なら command を組み立てずに例外を送出する。schema 検証を経ていない `pm-members.yaml` を読み込んでも、不正な `nickname` が `shell: true` の実行へ到達する前に停止する。
- CI 検証を追加した。`tests/docs/specdojo/schemas/pm-members-schema.test.ts` で実際の `pm-members.yaml` が `pm-members.schema.yaml` に適合すること、および shell メタ文字を含む `nickname` が schema で拒否されることを検証する。`npm test`（`npm run check` に含まれる）で常時実行される。
- 運用ガイド `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` に、`pm-members.yaml の値検証（nickname インジェクション対策）` の節を追加した。
- 未完了（handoff）: `package.json` の `validate:schema` 集約に `validate:schema:pm-members` を追加する変更は、edit-agent の書込境界外（`.specdojo/claude/settings.edit.json` が `docs/**`/`src/**`/`tests/**` のみ許可）のため本エージェントでは適用できない。適用すべき差分は次のとおり。
  - `scripts` に追加: `"validate:schema:pm-members": "tsx tools/docs/src/validate-yaml-schema.ts --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data \"docs/ja/**/pm-members.yaml\" --allow-empty"`
  - `validate:schema` 集約に `&& npm run validate:schema:pm-members` を追加（`validate:schema:exec-defaults` と `validate:schema:pjr-index` の間）。

## 5. 関連ドキュメント

- docs/specdojo/schemas/v1/pm-members.schema.yaml
- src/specdojo-config.ts
- src/exec-agent-config.ts
- [[pm-members-rulebook|プロジェクトメンバー定義ルールブック]]
- [[exec-config-guide|exec設定ガイド]]
