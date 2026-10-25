---
specdojo:
  id: prj-0001:pjr-sazc-orch-scripts-via-launch
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T09:10:37Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-20T23:04:20Z"
  conclusion: 本リポジトリの `orch:*` と `orch:*:work` を orchestrator launch 経由にした。`:work` は open-agent-worktree.sh が本体の場所を launch へ渡し、worktree の中からも repos の path が本体の隣へ解ける。prj-0002 では LP と assets のリポジトリへの --add-dir と編集の許可が付く
---

# PJR-SAZC 本リポジトリの orch:* の script を orchestrator launch 経由にする

## 1. 概要

本リポジトリの package.json の orch:opus などは provider の CLI を直接起動し、specdojo orchestrator launch を経由しないため、repos で宣言したプロダクトリポジトリが --add-dir などで許可されない。config scaffold が利用者に作る script と同じく launch 経由にし、:work の付く script の扱いも決める

## 2. 完了条件

- 本リポジトリの `package.json` の `orch:*`（claude・codex・copilot・antigravity・opencode）が、`specdojo orchestrator launch --provider <name> -- <provider の引数>` を経由して provider の CLI を起動する。本リポジトリでは CLI 自身を開発しているため、手元のソース（`tsx src/specdojo.ts` など）で launch を起動する。
- `SPECDOJO_PROJECT=prj-0002` のシェルで `npm run orch:opus` を起動すると、`specdojo-lp` が許可される（claude では `--add-dir` と `Edit` の許可が付く）。`repos` を持たない project（prj-0001）では、追加の引数が付かない。
- `:work` の付く script（`tools/worktree/open-agent-worktree.sh` でエージェント用の worktree を開いてから起動するもの）で、worktree の中から `repos[].path`（`../specdojo-lp`）を解いたときに設定の読み込みが失敗しないかを確かめ、扱いを決めている。
- `:work` の付く script も launch 経由にし、provider の `cwd` は固定 worktree に保ったまま、設定と `repos[].path` を主 worktree 基準で解決する。
- `package.json` は保護された設定のため、変更は利用者の承認を得てから行う。
- executor は `package.json` を変更しない（runner が保護された設定への書き込みを止める）。書き換える `orch:*` と `orch:*:work` の script の案を、そのまま貼れる JSON の形で result に書き、反映はオーケストレーターが利用者の承認を得て feature ブランチで行う（2026-10-21、利用者の承認）。
- 起動の確かめ方: executor は agent を起動できないため、`orchestrator launch` が組み立てる引数を、単体テストまたは launch の実装を読んで確かめ、prj-0001 と prj-0002 で付く引数を result に書く。実際の起動の確認は、反映の後にオーケストレーターが行う。
- `:work` の扱いは、`tools/worktree/open-agent-worktree.sh` と設定の読み込みを読み、worktree の中から `repos[].path` を解いたときの結果を確かめて決め、決めた内容と理由を result と個票の対応結果に書く。直すために `src/` や `tools/` の変更が要る場合は、この項目で直し、単体テストを足す。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す（`src/` や `tools/` を変えた場合）。
- [[specdojo:orchestrator-operation-guide]] など、本リポジトリの起動方法を説明する箇所が実際の script と一致している。

## 3. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ                                         |
| --- | ----------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | `:work` の付く script で `repos` の path が解けるか確かめる | DEV  | done | 主 worktree 基準で解決する実装とテストを追加 |
| 2   | `orch:*` を launch 経由に書き換え、起動を確かめる           | DEV  | done | 反映用 JSON を作成。実反映は利用者承認後     |

## 4. 対応結果

- 固定 worktree から従来どおり設定を読むと、`../specdojo-lp` は主 worktree の隣ではなく `../worktrees/specdojo-lp` へ解決され、設定検証で失敗することを確認した。`:work` も launch 経由に統一し、`tools/worktree/open-agent-worktree.sh` が主 worktree を内部用の `SPECDOJO_ORCHESTRATOR_CONFIG_ROOT` で渡す方針とした。
- `specdojo orchestrator launch` は設定と `repos[].path` を渡された主 worktree 基準で解決し、provider の `cwd` は固定 worktree に保つ。内部用環境変数は provider 起動前に除去するため、対話中の後続コマンドへ設定ルートを固定しない。
- 単体テストに、固定 worktree から `../specdojo-lp` が主 worktree の隣へ解決されること、provider の `cwd` が固定 worktreeであること、内部用環境変数が provider へ渡らないことを追加した。integration test には、worktree helper が固定 worktreeでコマンドを起動し、主 worktree を正しく渡すことを追加した。
- `package.json` は executor の保護対象なので変更していない。利用者承認後に反映するスクリプト案は次のとおり。

```json
{
  "orch:sonnet": "tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model sonnet",
  "orch:sonnet:work": "tools/worktree/open-agent-worktree.sh claude-work tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model sonnet",
  "orch:opus": "tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus",
  "orch:opus:work": "tools/worktree/open-agent-worktree.sh claude-work tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus",
  "orch:terra": "tsx src/specdojo.ts orchestrator launch --provider codex -- -m gpt-5.6-terra \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:terra:work": "tools/worktree/open-agent-worktree.sh codex-work tsx src/specdojo.ts orchestrator launch --provider codex -- -m gpt-5.6-terra \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:sol": "tsx src/specdojo.ts orchestrator launch --provider codex -- -m gpt-5.6-sol \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:sol:work": "tools/worktree/open-agent-worktree.sh codex-work tsx src/specdojo.ts orchestrator launch --provider codex -- -m gpt-5.6-sol \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:copilot": "tsx src/specdojo.ts orchestrator launch --provider copilot -- --agent specdojo-orchestrator",
  "orch:copilot:work": "tools/worktree/open-agent-worktree.sh copilot-work tsx src/specdojo.ts orchestrator launch --provider copilot -- --agent specdojo-orchestrator",
  "orch:flash": "tsx src/specdojo.ts orchestrator launch --provider antigravity -- --add-dir \"$(pwd)\" --model gemini-3.8-flash-high -i \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:flash:work": "tools/worktree/open-agent-worktree.sh agy-work tsx src/specdojo.ts orchestrator launch --provider antigravity -- --add-dir . --model gemini-3.8-flash-high -i \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
  "orch:qwen": "tsx src/specdojo.ts orchestrator launch --provider opencode -- --agent qwen-orchestrator",
  "orch:qwen:work": "tools/worktree/open-agent-worktree.sh qwen-work tsx src/specdojo.ts orchestrator launch --provider opencode -- --agent qwen-orchestrator",
  "orch:gemma": "tsx src/specdojo.ts orchestrator launch --provider opencode -- --agent gemma-orchestrator",
  "orch:gemma:work": "tools/worktree/open-agent-worktree.sh gemma-work tsx src/specdojo.ts orchestrator launch --provider opencode -- --agent gemma-orchestrator"
}
```

- `prj-0001` は `repos` が無いため、launch が provider に追加する引数はない。`prj-0002` に `specdojo-lp` が宣言されている場合、Claude Code では provider 固有の引数の後ろに `--add-dir <specdojo-lp の絶対パス> --allowedTools Edit(/<specdojo-lp の絶対パス>/**)` が加わる。他の provider は既存の `agentExtraRootArguments` または OpenCode の inline config 規則に従う。
- 実際の agent CLI 起動は利用量と対話セッションを伴うため executor では行っていない。利用者承認後に上記 JSON を `package.json` へ反映し、`SPECDOJO_PROJECT=prj-0002 npm run orch:opus` と `SPECDOJO_PROJECT=prj-0002 npm run orch:opus:work` で最終確認する。

## 5. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]: `repos` と、オーケストレーターの起動時の許可。
- [[specdojo:orchestrator-operation-guide]]: オーケストレーターの起動方法。
- 前例: `src/exec-provider-scaffold.ts` の `ORCHESTRATOR_NPM_SCRIPTS`（利用者向けの script は launch 経由）。
- 回避策（2026-10-12）: `npx tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus`。
