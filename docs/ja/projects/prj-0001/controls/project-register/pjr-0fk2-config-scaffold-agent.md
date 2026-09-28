---
specdojo:
  id: prj-0001:pjr-0fk2-config-scaffold-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-28T22:27:34Z"
  due_on: "2026-10-31"
---

# PJR-0FK2 config scaffoldに各Agentのパーミッション設定機能を追加

## 1. 概要

現状 `npx specdojo config scaffold` は `orchestrator.md` のみを生成するが、各エージェントがスムーズかつ安全に動作するためのパーミッション設定（`settings.json` 等）も合わせて準備すべきである。
Claude（`.claude/`）のようにプロジェクトローカルで完結するものは設定ファイルの生成を行い、Antigravity（`~/.gemini/`）のようにユーザーディレクトリを必要とするものは、既存設定を破壊せずに必要なパーミッション（allow / deny 等）を追記（マージ）する方式で実装する。

## 2. 完了条件

- [ ] `npx specdojo config scaffold` 実行時に、Claude等のローカル設定ファイルが自動生成されること。
- [ ] Antigravity等のグローバル設定（`~/.gemini/antigravity-cli/settings.json` 等）に対し、既存のユーザー設定を壊さず必要なルールを追記（マージ）する仕組みが実装されていること。
- [ ] 新規機能に対する単体テストまたは統合テストが実装され、通過していること。
- [ ] 関連する設計書やコマンドリファレンスに、設定の生成・マージに関する仕様が追記されていること。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | config scaffoldのパーミッション設定生成・マージ機能実装 | ARC  | open | -    |
| 2   | 機能に対する単体テストまたは統合テストの追加            | ARC  | open | -    |
| 3   | リファレンス等への仕様の追記                            | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
