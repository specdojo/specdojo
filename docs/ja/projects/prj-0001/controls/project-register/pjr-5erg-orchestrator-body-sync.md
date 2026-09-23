---
specdojo:
  id: prj-0001:pjr-5erg-orchestrator-body-sync
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-01T14:04:03Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-03T22:55:54Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml, package.json; agent must record the required change …"
  conclusion: SSOT と5ラッパーの本文一致を機械検証する lint を追加し、乖離していた codex 版を同期した。
---

# PJR-5ERG orchestrator 本文の環境間同期を検証可能にする

## 1. 概要

orchestrator の指示本文は `.agents/specdojo-orchestrator.agent.md` を正本とし、環境ごとの
薄いラッパーが frontmatter を付けて同じ本文を持つ構成である。しかし本文が一致しているかを
検証する仕組みがなく、手作業での同期に依存している。

現状 `.codex/agents/specdojo-orchestrator.toml` の本文が正本から乖離している。commit 方針が
1行に要約された古い記述のままで、コマンド地図から `grade` / `job` / `dashboard` などが
欠落している。他の4つのラッパーは正本と一致している。

指示本文が環境ごとに違うと、同じ orchestrator を名乗りながら振る舞いが変わる。乖離は
利用者から見えないため、気づくのは食い違いが表面化した後になる。

## 2. 対象ファイル

| ファイル                                   | 本文の埋め込み方                  |
| ------------------------------------------ | --------------------------------- |
| `.agents/specdojo-orchestrator.agent.md`   | 正本（frontmatter なし）          |
| `.claude/agents/specdojo-orchestrator.md`  | frontmatter + 本文                |
| `.github/agents/specdojo-orchestrator.md`  | frontmatter + 本文                |
| `.opencode/agents/gemma-orchestrator.md`   | frontmatter + 本文                |
| `.opencode/agents/qwen-orchestrator.md`    | frontmatter + 本文                |
| `.codex/agents/specdojo-orchestrator.toml` | `developer_instructions` の文字列 |

## 3. 完了条件

- 正本と各ラッパーの本文一致を機械検証でき、不一致を検出すると失敗する。
- 検証が lint / hook / CI のいずれかから自動で実行される。
- codex 版の乖離が解消され、全ラッパーが正本と一致する。
- TOML の文字列埋め込みでも本文を取り出して比較できる。
- 同期手順が文書化され、本文を変更する際にどこを更新するか分かる。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                       |
| --- | ------------------------------------ | ---- | ---- | -------------------------- |
| 1   | 本文抽出と一致検証のスクリプトを書く | ARC  | done | TOML の文字列も対象にする  |
| 2   | 検証を lint / hook から実行する      | ARC  | done | 既存の lint 系へ寄せる     |
| 3   | codex 版の乖離を解消する             | ARC  | open | 書き込み権限が必要         |
| 4   | 単体テストを追加する                 | ARC  | done | 不一致を検出できること     |
| 5   | 同期手順を文書化する                 | ARC  | done | 変更時の更新対象を明記する |

## 5. 対応結果

- `tools/validate-orchestrator-sync.mjs` を追加し、Markdown frontmatter と TOML の `developer_instructions` から本文を抽出して SSOT とバイト単位で比較できるようにした。
- npm lint スクリプトと pre-commit hook を追加し、対象ファイルの変更時に同期漏れを自動検出するようにした。
- Markdown / TOML 両形式の一致・不一致を確認する単体テストを追加した。
- 設計書と運用ガイドに、SSOT 更新、全ラッパーへの反映、検証コマンド実行の同期手順を記載した。
- `.codex/agents/specdojo-orchestrator.toml` の同期は executor（codex）の実行環境では行えなかった。
  ファイル自体は書き込み可能だが、codex の sandbox が自身の設定ディレクトリ `.codex/` を保護する
  ためである。agent の種類に由来する制約で、再実行しても同じ結果になる。
- orchestrator が SSOT 本文を `developer_instructions` へ反映し、`npm run lint:orchestrator-sync` が
  5 ラッパーすべての一致を報告することを確認した。TOML の解析とキー構成が壊れていないことも
  確認している。乖離していたのは commit 方針の記述とコマンド地図で、`grade` / `job` / `dashboard`
  などが欠落していた。
- `lefthook.yml` と `package.json` への hook / script 登録は `agent-config-write` が block したため、
  orchestrator が差分を確認して適用した。保護機構が対象パスと提案差分を result へ自動記録して
  いたため、worktree の差分を直接読む必要はなかった。

## 6. 関連ドキュメント

- `.agents/specdojo-orchestrator.agent.md`: 指示本文の正本。
