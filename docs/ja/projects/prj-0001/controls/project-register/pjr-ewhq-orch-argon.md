---
specdojo:
  id: prj-0001:pjr-ewhq-orch-argon
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-02T23:07:23Z"
  due_on: "2026-11-30"
---

# PJR-EWHQ Antigravity の orchestrator に Gemini 4 Argon の起動スクリプトを足す

## 1. 概要

specdojo init と config scaffold が Antigravity 用に配る起動スクリプトに orch:argon と orch:argon:work（gemini-4-argon-medium、worktree argon-work）を足し、このリポジトリの package.json にも同じスクリプトを足す。orch:flash は残す

## 2. 入力

- agy に Gemini 4 Argon が追加され、agy models で gemini-4-argon-high・gemini-4-argon-medium・gemini-4-argon-low を確かめた（agy 1.4.12、2026-11-03）
- 利用者は、orchestrator を性能の良い argon で npm run orch:argon と npm run orch:argon:work から立ち上げたい。配る雛形にも反映する案 B を選んだ（2026-11-03）
- 強さは medium とする。orch:sol は -m gpt-6.1-sol で、.codex/config.toml の `model_reasoning_effort` = medium が効いており、argon も medium にそろえる。性能が足りなければ high に変える（2026-11-03 の対話で合意）
- worktree は argon-work とする。orch:flash:work は agy-work を使っており、同じ名前だと同時に立ち上げたときに worktree を取り合う
- 雛形では orch:argon を足し、orch:flash は残す（既存の利用者の手順を壊さないため。orchestrator の推奨）

## 3. 完了条件

- `specdojo init` と `specdojo config scaffold` が Antigravity 用に配る起動スクリプトに、`orch:argon` と `orch:argon:work` が加わっている。`orch:argon` は `orch:flash` と同じ書き方（`orchestrator launch --provider antigravity`、`--add-dir`、入口の指示の渡し方）で、モデルは `gemini-4-argon-medium` とする。`orch:argon:work` は `tools/worktree/open-agent-worktree.sh` で worktree `argon-work` に立ち上げる
- 既存の `orch:flash` と `orch:flash:work` は変えず、残す。ほかの provider のスクリプトも変えない
- 単体テスト（`tests/src/shared/provider-scaffold.test.ts`、`tests/src/commands/init.test.ts` など、既存の orch のスクリプトを確かめているもの）で、`orch:argon` と `orch:argon:work` が配られることを確かめる
- README の provider と起動スクリプトの表に `orch:argon` を足す。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- このリポジトリのルートの `package.json` は保護されたファイルのため executor は変えない。足すべき 2 行の案を個票の対応結果に書き、報告の `handoff` にも書く。反映は統合の後に orchestrator が利用者の承認のもとで行う（承認済み）
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後に、orchestrator がルートの `package.json` に 2 行を足し、`npm run orch:argon` と `npm run orch:argon:work` で立ち上がることを利用者が terminal で確かめる（executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                        |
| --- | ----------------------------------------------------- | ---- | ---- | ------------------------------------------- |
| 1   | 配る雛形に orch:argon と orch:argon:work を足す       | ARC  | done | `src/shared/provider-scaffold.ts` に追加    |
| 2   | テスト・README・CHANGELOG を合わせる                  | ARC  | done | 単体テスト・案内文書・CHANGELOG を更新      |
| 3   | ルートの package.json の案を対応結果と handoff に書く | ARC  | done | 保護設定のため本対応結果と `handoff` に記載 |

## 5. 対応結果

### 実施内容

- `src/shared/provider-scaffold.ts` の `ORCHESTRATOR_NPM_SCRIPTS.antigravity` に `orch:argon`（`gemini-4-argon-medium`）と `orch:argon:work`（`argon-work`）を追加した。既存の `orch:flash` は維持した。
- 単体テスト `tests/src/shared/provider-scaffold.test.ts` と `tests/src/commands/init.test.ts` に、Antigravity 選択時に `orch:argon` と `orch:argon:work` が `package.json` へ配られることの検証を追加・更新した。
- `README.md`、`templates/antigravity/README.md`、[[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]、[[specdojo:command-reference|コマンドリファレンス]]、[[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]] に `orch:argon`・`orch:argon:work` の記述を反映した。
- `CHANGELOG.md` の `[Unreleased]` 節に起動スクリプトの追加内容を記録した。

### 成果物・変更ファイル

- `src/shared/provider-scaffold.ts`
- `tests/src/shared/provider-scaffold.test.ts`
- `tests/src/commands/init.test.ts`
- `README.md`
- `templates/antigravity/README.md`
- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`
- `docs/ja/specdojo/references/command-reference.md`
- `docs/ja/product/040-system-design/sysd-antigravity-agent-settings.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-ewhq-orch-argon.md`

### 本リポジトリのルート package.json に足すべき 2 行の案

本リポジトリのルート `package.json` は保護された設定のため executor stage では変更しない。統合後に利用者の承認のもとで orchestrator が以下の 2 行を `package.json` の `scripts`（`orch:flash` の前）へ追加する。

```json
    "orch:argon": "tsx src/specdojo.ts orchestrator launch --provider antigravity -- --add-dir \"$(pwd)\" --model gemini-4-argon-medium -i \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
    "orch:argon:work": "tools/worktree/open-agent-worktree.sh argon-work tsx \"$(pwd)/src/specdojo.ts\" orchestrator launch --provider antigravity -- --add-dir . --model gemini-4-argon-medium -i \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
```

### 残課題・申し送り

- 統合後に、本リポジトリの `package.json` に上記 2 行を足し、`npm run orch:argon` と `npm run orch:argon:work` で起動できることを確認する（人の確認・利用枠が必要）。
- 個票のステータス項目（`item_status`）および登録簿（`pjr-index.md`）の行は本タスクでは変更せず、runner および人による確認後に遷移する。

## 6. 関連ドキュメント

- `README.md`
- `templates/` の Antigravity 用の雛形
