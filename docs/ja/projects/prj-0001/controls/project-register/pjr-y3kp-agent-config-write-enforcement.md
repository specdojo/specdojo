---
specdojo:
  id: prj-0001:pjr-y3kp-agent-config-write-enforcement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-21T13:12:40Z"
  due_on: "2026-08-31"
---

# PJR-Y3KP agent による設定ファイル変更を provider 非依存で実効的に止める

## 1. 概要

PJR-3S8Q で、実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めないと決定した。しかし claude は allow リスト方式で守られる一方、codex は sandbox workspace-write のため物理的に書き込める。実際に PJR-0DA8 の実行で codex-expert-executor が .specdojo/claude/settings.report.json を直接作成し、register 実行の commit 対象が除外方式であるためコミットと merge まで通過した。provider の sandbox 方式に依存せず、対象パスへの agent 由来の変更を検知して止める仕組みを用意する。

## 2. 完了条件

- PJR-3S8Q が定める対象パス（`package.json`、`lefthook.yml`、`.specdojo/**`、commitlint 設定、CI 設定）への agent 由来の変更が、provider の sandbox 方式に依存せず検知される。
- 検知時は該当変更を commit 対象から除外するか実行を停止し、理由と対象パスを標準エラーへ出力する。
- register 由来の実行（commit 対象が除外方式）でも、対象パスの変更が commit と merge を通過しない。
- 人間および orchestrator による同じパスの変更は妨げられない。
- codex（workspace-write）と claude（allow リスト）の双方で、対象パスへの変更が阻止されることを検証している。
- 意図的に対象パスを変更する必要がある場合の手順（申し送りと人手適用、または明示的な解除方法）が文書化されている。
- 上記を検証する unit test / integration test が追加され、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                                                                                                  |
| --- | -------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------- |
| 1   | 保護対象パスの一覧を単一の定義として実装に持たせる | ARC  | open | PJR-3S8Q の対象と一致させ、設定ファイルからの注入で広げられない形にする                               |
| 2   | 検知と停止をどの層で行うか決める                   | ARC  | open | commit 対象の選別、agent 実行後の差分検査、hook のいずれか。register 実行の除外方式との整合を確認する |
| 3   | 決めた層に実装する                                 | ARC  | open | 人間と orchestrator の変更は妨げない                                                                  |
| 4   | codex と claude の双方で阻止されることを検証する   | ARC  | open | sandbox 方式が異なるため両方で確認する                                                                |
| 5   | 例外時の手順を文書化する                           | ARC  | open | 申し送りと人手適用、または明示的な解除方法                                                            |
| 6   | unit test / integration test を追加する            | ARC  | open | register 実行経路での通過を防ぐ回帰テストを含める                                                     |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]
- 違反が発生した実行: [[prj-0001:pjr-0da8-claude-reporter-mode-and-settings|PJR-0DA8 claude-reporter の mode を report に分離し reporter 専用の最小権限 settings を用意する]]
- commit 対象の選別実装: `src/exec-worktree-ops.ts` の `resolveCommitScope` と `isCommitTargetPath`
- provider ごとの sandbox 設定: `.specdojo/exec-defaults.yaml` の `providers`、`.specdojo/claude/settings.*.json`
