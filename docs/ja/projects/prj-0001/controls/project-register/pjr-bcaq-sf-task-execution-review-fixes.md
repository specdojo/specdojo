---
specdojo:
  id: prj-0001:pjr-bcaq-sf-task-execution-review-fixes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-09T20:49:35Z"
  derived_from:
    - PJR-2GD6
  approach: fully-guided
  targets:
    - prj-0001:sf-task-execution
---

# PJR-BCAQ 代表の sf-task-execution を、review の指摘（業務プロセスとの整合・確かめ方・実装との照合）に合わせて磨き込む

## 1. 概要

business-specs-reps の review で incomplete となった sf-task-execution を、指摘どおり業務プロセス仕様との整合、検証可能性の定義、実装（agent-pipeline.ts）との照合の記録を足して磨き込む

## 2. 入力

- 2026-11-09 の review（T-BUSINESS-SPECS-REPS-sf-task-execution-090）の判定は incomplete。grade は pass 87。`done_criteria` の DC-001（業務プロセス仕様との整合）と DC-004（検証可能性）が未充足、実装エビデンス src/exec/run/agent-pipeline.ts との対応表がない、と指摘された。
- review の指摘を完了条件として磨き込みの段に戻し、その後に review をやり直す（indie が決定、案 A）。

## 3. 完了条件

- `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md` を、カタログの `done_criteria` のうち DC-001（業務プロセス仕様との整合）と DC-004（検証可能性）を満たすように磨き込んでいる。
  - 対応する業務プロセス仕様（カタログの `depends_on` にある `bps-task-selection-preparation` など）と、機能の入出力・処理要件の対応を、文書の中で確かめられる形で書いている。
  - 機能ごとに、何をもって満たしたと確かめるか（検証の観点）を書いている。
- 実装エビデンス `src/exec/run/agent-pipeline.ts` と文書の記述を照らし、記述ごとの一致・乖離・未確認を表にして文書に書いている。乖離は実装に合わせて直すか、意図された仕様として残す理由を書いている。
- [[specdojo:sf-rulebook]] の規則（機能の目的と bps・uis との対応に絞り、操作手順は参照に留める）を守っている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                                                | 担当   | 状態 | メモ |
| --- | --------------------------------------------------- | ------ | ---- | ---- |
| 1   | review の指摘と、業務プロセス仕様・実装を読み比べる | _TODO_ | open | -    |
| 2   | 整合・検証の観点・実装との照合の表を書く            | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く                          | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[prj-0001:sf-task-execution]]
