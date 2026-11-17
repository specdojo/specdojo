---
specdojo:
  id: prj-0001:pjr-c07h-parent-validation-load-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-17T12:22:09Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: lint-ts, test-unit"
  commit_type: feat
  commit_scope: exec
---

# PJR-C07H 親の検証の時間切れの原因を調べるため、検証の実行時の負荷と待ち時間を記録する

## 1. 概要

並べて流した run の親の検証が時間切れになる原因を特定するため、各検証の開始・終了時刻、検証の順番待ち、同時に動く run、CPU・メモリ・I/O の負荷を記録に残す

## 2. 入力

- 2026-11-16〜17 に、並べて流した run の親の検証（統合テストなど）が時間切れで止まることがあった。親の検証は `parent_validation_concurrency:` 1 で 1 件ずつ流れ、各検証の上限は 10 分である
- orchestrator の調べ（2026-11-17）: 止まった時間帯に動いていたのは opus・sol・sonnet の agent だけで、opencode のローカル LLM（Mac の Ollama）は使われておらず、job も動いていなかった。原因の候補は、親の検証の直列化の外で executor が流すテスト、メモリの圧迫（container は 15GB・swap 4GB のうち 2.9GB 使用）、共有フォルダの I/O の遅さ（PJR-TATP）である
- 利用者が 2026-11-17 に、対策の前に原因を明確にするよう指示し、計測の todo の起票を依頼した。自動の再開（PJR-52EE）は原因が分かるまで保留している

## 3. 完了条件

- 親の検証の記録に、検証ごとに開始・終了の時刻と所要時間、順番待ちの時間（`ParentValidationGate`）、その時点で動いている run と executor の数を残す。
- 検証の開始・終了・時間切れの時点で、CPU・メモリ・I/O の負荷（Linux の `/proc/pressure`、メモリと swap の使用量）を記録する。取れない環境では記録を省き、検証そのものは止めない。
- 時間切れのときは、どのテストのファイルを流していたかが分かる情報を残す。
- 検証の動き（順番・上限・合否の判定）は変えない。計測で検証が目立って遅くならない。
- 記録の見方を [[specdojo:exec-operation-guide|exec運用ガイド]] に書く。
- 原因の分析と対策は、記録がたまってから別の項目で行う。この項目では行わない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                              | 担当 | 状態 | メモ |
| --- | --------------------------------- | ---- | ---- | ---- |
| 1   | 記録する項目と置き場所を決める    | DEV  | open | -    |
| 2   | 計測を実装し、テストを足す        | DEV  | open | -    |
| 3   | exec 運用ガイドに記録の見方を書く | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-52ee-exec-watch-auto-recover]]
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]
