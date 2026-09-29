---
specdojo:
  id: prj-0001:pjr-0fk2-config-scaffold-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

- [x] `npx specdojo config scaffold` 実行時に、Claude等のローカル設定ファイルが自動生成されること。
- [x] Antigravity等のグローバル設定（`~/.gemini/antigravity-cli/settings.json` 等）に対し、既存のユーザー設定を壊さず必要なルールを追記（マージ）する仕組みが実装されていること。
- [x] 新規機能に対する単体テストまたは統合テストが実装され、通過していること。
- [x] 関連する設計書やコマンドリファレンスに、設定の生成・マージに関する仕様が追記されていること。

### 2.1. 安全条件（2026-09-29 追記）

利用者のホームディレクトリの設定を書き換える機能であるため、次の条件を完了条件に加える（利用者が承認）。

- [x] グローバル設定の書き換えは、明示的なオプション（例: `--global`）を付けたときだけ行う。既定では、リポジトリ内の設定だけを生成する。
- [x] `--dry-run` で、グローバル設定へ追記する内容を差分として表示する。
- [x] グローバル設定を書き換える前に、元のファイルのバックアップを取る。既存の項目を削除・変更しない。
- [x] テストは一時的な HOME を使い、実際のホームディレクトリに触れない。
- [x] 生成する権限設定は、PJR-3S8Q の決定（親コンテキストで実行されるコマンドを定義するファイルは agent の書き込み範囲に含めない）と矛盾しない。本リポジトリの `.specdojo/claude/settings.*.json` の役割別の分け方（edit / review / report）を参考にする。
- [x] PJR-2H5F（devcontainer の scaffold）の統合後に着手し、scaffold の実装の変更と競合しない。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                         |
| --- | ------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | config scaffoldのパーミッション設定生成・マージ機能実装 | ARC  | done | `--global` 明示時だけ Antigravity 設定へ追記 |
| 2   | 機能に対する単体テストまたは統合テストの追加            | ARC  | done | 一時 HOME で非破壊・dry-run・冪等性を検証    |
| 3   | リファレンス等への仕様の追記                            | ARC  | done | 設計書、設定ガイド、コマンドリファレンス更新 |

## 4. 対応結果

- `config scaffold` と互換入口の `exec scaffold` に `--global` を追加した。通常実行はユーザーディレクトリへ触れず、Antigravity で明示した場合だけ `~/.gemini/antigravity-cli/settings.json` の permission 配列へ不足 rule を追記する。
- 既存の設定キー・配列要素を保持し、書き換え前に timestamp 付きバックアップを作る。dry-run は allow / deny / ask 別に追加 rule だけを差分表示し、不正 JSON・不正な permission 配列は無変更で拒否する。
- `templates/antigravity/settings.global.json` に allow / deny の原本を追加した。PJR-3S8Q の固定保護対象を deny に反映し、Antigravity の command template から `--dangerously-skip-permissions` を除いた。
- `tests/src/exec-provider-scaffold.test.ts` に、一時 HOME を使った既存設定保持、バックアップ、dry-run、冪等性、不正設定拒否、`--global` 未指定時の無変更を追加した。unit / integration / schema / typecheck は executor では重複実行せず、親 runner の固定検証に委ねる。
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]、[[specdojo:exec-config-guide|exec設定ガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:quick-start-guide|クイックスタートガイド]]と配布 README を更新した。残課題はない。

## 5. 関連ドキュメント

- PJR-3S8Q（agent の書き込み範囲の決定）、PJR-2H5F（devcontainer の scaffold）
- `src/exec-provider-scaffold.ts`、`templates/`、`.specdojo/claude/settings.*.json`
