---
specdojo:
  id: prj-0001:pjr-c4kf-agent-history-links-run-records
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  registered_at: "2026-11-07T23:52:58Z"
  completed_at: "2026-11-08T17:36:06Z"
  conclusion: executor に渡す validate:history-links の適用条件の文に、execution/runs の plan.md・result.md を足し、判定の実装と同じ範囲にした
  derived_from:
    - PJR-5ZNK
---

# PJR-C4KF agent へ渡す検査の適用条件の文に、今の実行記録の plan・result を足す

## 1. 概要

src/exec/run/agent.ts が executor へ渡す validate:history-links の適用条件の文が、履歴ファイルとして旧来の exec/plans・exec/results だけを挙げ、実装が対象にする execution/runs の plan.md・result.md を挙げていない

## 2. 入力

- PJR-5ZNK の確認で、src/exec/run/agent.ts の 251〜253 行目に旧来の書き方が残っていると分かった（2026-11-08）。判定の実装は src/exec/reporter.ts の isHistoryLinkTargetPath。

## 3. 完了条件

- `src/exec/run/agent.ts` が executor へ渡す `validate:history-links` の適用条件の文に、`execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md` を足している。旧来の `exec/plans/**/*.md`・`exec/results/**/*.md` は旧来の置き場所として残す。判定の実装（`src/exec/reporter.ts` の `isHistoryLinkTargetPath`）と同じ範囲になっている。
- 判定の実装は変えていない。この文を期待値に持つテストがあれば合わせている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。

## 4. 作業内容

| No  | 作業                             | 担当  | 状態 | メモ                                                                                  |
| --- | -------------------------------- | ----- | ---- | ------------------------------------------------------------------------------------- |
| 1   | 指示の文と判定の実装を読み比べる | agent | done | `src/exec/reporter.ts` の `isHistoryLinkTargetPath` と `src/exec/run/agent.ts` を突合 |
| 2   | 指示の文を直し、テストを合わせる | agent | done | `agent.ts` に現行配置を追記し、`run.test.ts` で検証                                   |
| 3   | 検査を流し、対応結果に書く       | agent | done | 単体テスト等の検証と個票の記帳                                                        |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/run/agent.ts` の `buildExecutorPrompt` 内で生成される `validate:history-links` の適用条件説明文に、現行の実行記録配置である `execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md` を追記した。
- 旧来の `exec/plans/**/*.md`・`exec/results/**/*.md` は互換性の記述として残し、`src/exec/reporter.ts` の `isHistoryLinkTargetPath` の判定実装と一致させた。
- `tests/src/exec/run/run.test.ts` に、プロンプト内に `execution/runs/<origin>/<item>/<run>/` が含まれることを検証するアサーションを追加した。

### 5.2. 変更した成果物

- `src/exec/run/agent.ts`: executor 向けプロンプトの `validate:history-links` 適用条件文を更新
- `tests/src/exec/run/run.test.ts`: プロンプト期待値テストの追従
- `docs/ja/projects/prj-0001/controls/project-register/pjr-c4kf-agent-history-links-run-records.md`: 本個票の作業内容および対応結果を記入

### 5.3. CHANGELOG に書く事項

- **区分**: 変更
- **行の文案**:
  - agent へ渡すプロンプト内の `validate:history-links` 適用条件の説明に、現行の実行記録配置（`execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md`）を追記し、実装の判定範囲と一致させました（PJR-C4KF）。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-5znk-stale-run-record-paths]]
