---
specdojo:
  id: prj-0001:pjr-y3kp-agent-config-write-enforcement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: ARC
  registered_at: "2026-08-21T13:12:40Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: runner 実行の test-integration 検証（id=test-integration, source=runner）が failed（exit 1）であるため、共通規約の完了手順（必要な整形・静的検査の解消）を満たしていない。この runner validation は authoritative であり、repor…"
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

| No  | 作業                                               | 担当 | 状態 | メモ                                                                                                   |
| --- | -------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------ |
| 1   | 保護対象パスの一覧を単一の定義として実装に持たせる | ARC  | done | `src/exec-agent-protected-config.ts` の固定定義とし、実行設定から変更できないようにした                |
| 2   | 検知と停止をどの層で行うか決める                   | ARC  | done | agent 試行直後・親検証前と、worktree commit 前の二段検査を採用した                                     |
| 3   | 決めた層に実装する                                 | ARC  | done | in-place は起動前スナップショットとの差分だけを検査し、人手の既存変更を誤検知しない                    |
| 4   | codex と claude の双方で阻止されることを検証する   | ARC  | done | 両 provider member を使う register pipeline integration test を追加した                                |
| 5   | 例外時の手順を文書化する                           | ARC  | done | agent 用解除は設けず、result 申し送りを人間または orchestrator が agent 実行外で適用する手順を記載した |
| 6   | unit test / integration test を追加する            | ARC  | done | 固定パス・前後差分の unit test と、register／直接 commit 回避を含む integration test を追加した        |

## 4. 対応結果

- `src/exec-agent-protected-config.ts` に provider 非依存の固定保護パス定義と、agent 起動前後の内容差分検査を実装した。
- `src/exec-run.ts` で全 agent 試行を検査し、違反時は対象パスを標準エラーへ出力して失敗に変換することで、親検証と後続 reporter の起動を止めるようにした。
- `src/exec-worktree-ops.ts` で未 commit 差分と exec branch の commit 済み差分を commit 前に再検査し、register 由来の除外リスト方式でも commit / merge を停止するようにした。
- unit test と integration test を追加し、codex / claude member の双方、register 経路、agent による直接 commit の回避経路を検証対象にした。
- 運用手順を [[sysd-agent-settings|エージェント実行・共通設計]] と [[specdojo:exec-config-guide|SpecDojo exec 設定ガイド]] へ反映した。agent 用解除は設けず、必要な変更は result 申し送りを人間または orchestrator が agent 実行外で適用する。
- 初回 run では親検証 `npm run test:integration` が failed となり waiting で停止した。原因は保護機構ではなく、追加した保護テストが worktree 基準パスを共有の既定パスに任せ、block 時に保持される worktree を後片付けしていなかったことによる。orchestrator が fixture ごとの基準ディレクトリ指定と後片付けを適用し、連続 2 回の実行で 10 ファイル・75 件すべて成功することを確認した。
- あわせて、claude CLI が無効と警告した `settings.report.json` の `Write(**)` を `.specdojo` と `templates` の双方から削除し、`exec-provider-scaffold` の期待値を更新した。`Edit(**)` が全ファイル編集ツールを覆うため実効的な権限は変わらない。PJR-0DA8 の成果物に対する修正だが、本項目に含めて対応した。
- 残課題はない。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]
- 違反が発生した実行: [[prj-0001:pjr-0da8-claude-reporter-mode-and-settings|PJR-0DA8 claude-reporter の mode を report に分離し reporter 専用の最小権限 settings を用意する]]
- commit 対象の選別実装: `src/exec-worktree-ops.ts` の `resolveCommitScope` と `isCommitTargetPath`
- provider ごとの sandbox 設定: `.specdojo/exec-defaults.yaml` の `providers`、`.specdojo/claude/settings.*.json`
