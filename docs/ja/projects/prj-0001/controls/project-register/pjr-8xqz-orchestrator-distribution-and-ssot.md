---
specdojo:
  id: prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T12:58:15Z"
  due_on: "2026-10-10"
---

# PJR-8XQZ orchestrator を config scaffold で配布し SSOT の記述を実態へ合わせる

## 1. 概要

npm 導入した利用者が対話型オーケストレーターを入手できない。

```text
package.json files : dist / docs/ja/specdojo / docs/specdojo / templates / README.md / LICENSE
                     .agents/ を含まない

templates/*/agents : claude 2 件・codex 4 件・opencode 3 件（いずれも executor / reporter のみ）
                     orchestrator は 0 件
```

`config scaffold --provider <name>` が配るのは executor と reporter だけである。[[specdojo:quick-start-guide]] は冒頭でオーケストレーターへのチャット指示を併記しているが、利用者はその agent を入手できない。

あわせて SSOT `.agents/specdojo-orchestrator.agent.md` の記述が実態からずれている。

| 箇所                     | 現状                                       | 問題                                                                                        |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| コマンド地図・代表フロー | 素の `specdojo`                            | npm 導入では `npx specdojo`。PATH が通っている前提の表記になっている                        |
| 代表フロー               | catalog → schedule → exec refresh          | 新規利用者が最初に通る経路ではない。register から始まる導線が無い                           |
| register の節            | `add` / `start` / `close` / `build` の羅列 | type の使い分け、個票の扱い、`scaffold` が無く、そのままでは使えない                        |
| kata                     | 記述なし                                   | [[prj-0001:pjr-fkn1-kata-distribution-method]] の参照既定と `kata eject` が反映されていない |

### 1.1. 決定済みの方針

配布は `templates/<provider>/agents/` へ orchestrator を追加し、`config scaffold --provider` で配る方式とする。新しいコマンドも `files` の変更も要らず、provider ごとに形式が異なる問題（claude は Markdown、codex は TOML、opencode は agent 名違いで 2 本）へ既に対応している仕組みをそのまま使える。executor と同じ場所に置かれるため利用者から見て一貫する。

SSOT と 5 環境のラッパーはバイト一致で保守しており `tools/validate-orchestrator-sync.mjs` が検証する。テンプレートを同期対象へ加えるかを本項目で決める。加えない場合、テンプレートが古くなる経路が残る。

## 2. 完了条件

- `templates/claude/agents/`、`templates/codex/agents/`、`templates/opencode/agents/`、`templates/copilot/` に orchestrator の配布原本があり、`config scaffold --provider <name>` が配置する。
- 配置先は各 provider が agent を自動発見する位置（`.claude/agents/` など）である。
- テンプレートの本文が SSOT と同期する仕組みがある。`validate-orchestrator-sync.mjs` の対象へ加えるか、生成する経路を設けるかのいずれか。
- SSOT のコマンド表記が `npx specdojo` になっている。PATH が通る環境向けの短縮は注記として残す。
- SSOT の代表フローが、新規利用者の経路（`config init` → `register scaffold` → `register add` → `exec plan`）から始まる。
- SSOT の register の節が、type の使い分け・個票の扱い・`scaffold` を含み、読んだだけで操作できる内容になっている。
- kata の参照既定と `kata list` / `show` / `eject` が SSOT に記載されている。
- 5 環境のラッパーが SSOT とバイト一致し、`npm run lint:orchestrator-sync` が通過する。
- `npm pack --dry-run` で orchestrator の配布原本が同梱されることを確認している。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                   |
| --- | ------------------------------------------------------------ | ---- | ---- | -------------------------------------- |
| 1   | SSOT のコマンド表記を `npx specdojo` へ改める                | DEV  | open | 保護対象。オーケストレーターが直接対応 |
| 2   | 代表フローを新規利用者の経路から始まる構成へ改める           | DEV  | open | 同上                                   |
| 3   | register の節を実用的な内容へ書き直す                        | DEV  | open | 同上。type の使い分けと個票の扱い      |
| 4   | kata の参照既定と eject を追記する                           | DEV  | open | 同上                                   |
| 5   | 5 環境のラッパーへ同期する                                   | DEV  | open | `lint:orchestrator-sync` で検証        |
| 6   | `templates/<provider>/` へ orchestrator の配布原本を追加する | DEV  | open | 同期の仕組みを併せて決める             |
| 7   | `npm pack --dry-run` で同梱を確認する                        | DEV  | open | -                                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-49jk-readme-orchestrator-onboarding]]
- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[specdojo:orchestrator-operation-guide]]
- `.agents/specdojo-orchestrator.agent.md`
- `tools/validate-orchestrator-sync.mjs`
