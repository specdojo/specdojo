---
specdojo:
  id: prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T12:58:15Z"
  due_on: "2026-10-10"
  completed_at: "2026-09-23T13:25:41Z"
  conclusion: SSOT から生成する方式へ変え、claude / codex / opencode / antigravity へ配布原本を追加した。規範の記述を npx specdojo 前提へ改め、導入直後の進め方・登録簿の使い方・kata の扱いを追加した。
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
| 1   | SSOT のコマンド表記を `npx specdojo` へ改める                | DEV  | done | 保護対象。オーケストレーターが直接対応 |
| 2   | 代表フローを新規利用者の経路から始まる構成へ改める           | DEV  | done | 同上                                   |
| 3   | register の節を実用的な内容へ書き直す                        | DEV  | done | 同上。type の使い分けと個票の扱い      |
| 4   | kata の参照既定と eject を追記する                           | DEV  | done | 同上                                   |
| 5   | 5 環境のラッパーへ同期する                                   | DEV  | done | `lint:orchestrator-sync` で検証        |
| 6   | `templates/<provider>/` へ orchestrator の配布原本を追加する | DEV  | done | 同期の仕組みを併せて決める             |
| 7   | `npm pack --dry-run` で同梱を確認する                        | DEV  | done | -                                      |

## 4. 対応結果

### 4.1. 同期方式を生成へ変えた

`tools/generate-orchestrator-wrappers.mjs` を新設し、SSOT を唯一の編集対象として各対象へ本文を書き戻す方式にした。対象一覧は `validate-orchestrator-sync.mjs` の `ORCHESTRATOR_WRAPPERS` を import して共有し、二重管理を避けている。`npm run orchestrator:sync` で実行する。

本文の埋め込み方を `format` で表し、`raw` を追加した。

| format     | 本文の位置                              | 対象                        |
| ---------- | --------------------------------------- | --------------------------- |
| `markdown` | frontmatter の後ろ                      | claude / copilot / opencode |
| `toml`     | `developer_instructions` の複数行文字列 | codex                       |
| `raw`      | ファイル全体                            | antigravity                 |

実装は入口・hook 起動のため `.mjs` とした。`tools/` は全て `.mjs` で、`files` に含まれないため利用者へは配布されない。

### 4.2. pre-commit を検証から生成へ変えた

作業中に、直前の commit で `.codex/agents/specdojo-orchestrator.toml` が SSOT とずれていたことを発見した。原因は pre-commit の並行実行である。prettier が SSOT（Markdown）の表を整形する一方 `.toml` は対象外のため、埋め込まれた本文が整形前のまま残り、検証は整形前の内容で比較して通っていた。

hook を `npm run orchestrator:sync` + `stage_fixed: true` へ変更した。生成は冪等なので、整形順序に関係なく最終状態が一致する。glob へテンプレートも加えた。

### 4.3. SSOT の記述を実態へ合わせた

- コマンド表記を `npx specdojo` へ統一した。PATH が通る環境の注記は冒頭に置いた。
- `導入直後の進め方` を新設し、`config init` → `register scaffold` → `add` → `build` の順とした。catalog と schedule は設定キーの追加が要るため最初に案内しない旨を明記した。
- `登録簿（register）の使い方` を新設した。type 7 種の使い分け表、`--description` の書き方、**完了条件が exec plan の入力になること**、`start` / `review` は runner が記帳するため手で打たないことを含む。完了条件の記述は [[prj-0001:pjr-ypns-kata-resolution]] の失敗（範囲の取り違え）を踏まえた。
- `実践の型（kata）の扱い` を新設し、参照が既定であること、`eject` は利用者が規範を変えたいときだけ提案すること、`exec-template` と `schema` は eject 不可であることを記載した。
- `タスク実行` に `exec plan` での事前確認、`--worktree` の意味、失敗時の `--resume` を加えた。
- コマンド地図へ `kata` / `dashboard` / `grade` と設定リファレンスへの参照を追加した。

行数は 99 から 146 になった。

### 4.4. 配布原本を追加した

| provider    | 配置先                                      |
| ----------- | ------------------------------------------- |
| claude      | `.claude/agents/specdojo-orchestrator.md`   |
| codex       | `.codex/agents/specdojo-orchestrator.toml`  |
| opencode    | `.opencode/agents/specdojo-orchestrator.md` |
| antigravity | `.specdojo/antigravity/orchestrator.md`     |

antigravity は `agy` がファイル定義 agent を持たないため、本文を `-i` で渡す運用とし、`README.md` へ起動コマンドと `package.json` への登録例を書いた。`exec-defaults-snippet.yaml` と `pm-members-snippet.yaml` も copilot と同じ構成で用意した。配置先が `.specdojo/antigravity/` になるのは既存の機械的規則（`agents/**` 以外は `.specdojo/<provider>/**`）どおりで、provider ごとの分岐は足していない。

copilot は対象外とした。GitHub Copilot CLI は `.github/agents/` を読むが、機械的規則では `.copilot/agents/` へ置かれるため一致しない。例外を設けると「provider ごとの分岐を持たない」設計が崩れるため、文書で案内する方針とする。

### 4.5. 検証

- `npm run lint:orchestrator-sync` が 9 targets で OK。
- `config scaffold --provider <name> --dry-run` を 4 provider で確認し、期待どおりの配置先を表示した。`Available: antigravity, claude, codex, copilot, opencode` と一覧にも現れる。
- `npm pack --dry-run` で 537 ファイル、orchestrator 関連 7 件の同梱を確認した。
- `npm run check` が通過した（1658 tests）。`raw` 形式の検出テストを 1 件追加し、fixture を 3 形式対応へ更新した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-49jk-readme-orchestrator-onboarding]]
- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[specdojo:orchestrator-operation-guide]]
- `.agents/specdojo-orchestrator.agent.md`
- `tools/validate-orchestrator-sync.mjs`
