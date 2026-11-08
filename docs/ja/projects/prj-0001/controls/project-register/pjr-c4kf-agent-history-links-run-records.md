---
specdojo:
  id: prj-0001:pjr-c4kf-agent-history-links-run-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  registered_at: "2026-11-07T23:52:58Z"
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

| No  | 作業                             | 担当   | 状態 | メモ |
| --- | -------------------------------- | ------ | ---- | ---- |
| 1   | 指示の文と判定の実装を読み比べる | _TODO_ | open | -    |
| 2   | 指示の文を直し、テストを合わせる | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く       | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-5znk-stale-run-record-paths]]
