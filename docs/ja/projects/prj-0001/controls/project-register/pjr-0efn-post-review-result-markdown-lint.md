---
specdojo:
  id: prj-0001:pjr-0efn-post-review-result-markdown-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-18T16:04:14Z"
  block_reason: "checkpoint failed: Root index has staged checkpoint changes; commit or unstage them first: docs/ja/projects/prj-0001/controls/project-register/pjr-0efn-post-review-result-markdown-lint.md"
  derived_from:
    - PJR-T46Y
---

# PJR-0EFN 統合後の review の result が markdownlint で落ち、close の記帳が commit されない

## 1. 課題内容

2026-10-19 01:01 の PJR-JSEY の --post-review で、review の agent が判断の根拠に自分で番号（1. 2. 3.）を付け、runner がそれを箇条書き（- ）として result に描いたため、- 1. の形が入れ子の番号付きリストとして markdownlint の MD029 に当たった。pre-commit の hook で post-review の記帳の commit が失敗し、close の記帳（個票・イベント・review の plan と result）が作業ツリーに残った。runner は失敗を git commit failed: format: の 1 行目だけで報告した

## 2. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | review の result の描画（箇条書きの各行）、post-review の記帳の commit の失敗の報告 |
| スケジュール | 高い。夜間の自動実行で close の記帳が作業ツリーに残ったまま次へ進む                 |
| コスト       | 人が記帳を確かめて手で commit する手間                                              |
| 品質         | close したはずの項目が commit されず、ほかの run の commit に混ざるおそれがある     |
| 関係者       | `--post-review` と夜間の orchestrator（PJR-6DHY）の利用者                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は reporter が返した文の配列を `-` の箇条書きとして描く。文が `1.` などの番号で始まると、`- 1. ...` の形が入れ子の番号付きリストになり、markdownlint の MD029 に当たる。post-review の記帳の commit は pre-commit の hook で失敗し、runner は失敗を 1 行目だけで報告した |
| 対応策   | 箇条書きに描く文の先頭の番号を外すか、番号として解釈されない形にする。commit の失敗は、hook の出力の要点を報告する                                                                                                                                                              |
| 依存事項 | なし                                                                                                                                                                                                                                                                            |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                          |

### 3.1. 完了条件

- result（edit・review・post-review のすべて）で、reporter が返した文を箇条書きに描くとき、文が `1.`・`1)` などの番号で始まっても、markdownlint の MD029 などに当たらない形にする（先頭の番号を外す、など）。どの形にしたかと理由を result に書く。
- 単体テストで、番号で始まる文を含む reporter の出力から作った result が markdownlint を通ることを確かめる。
- post-review の記帳の commit が失敗したとき、runner のログに、失敗した hook の名前と、その出力の要点（最初のエラーの行）を出す。作業ツリーに残った記帳のファイルの一覧も出す。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を `--post-review` 付きで 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG は、未公開の版の節（なければ `## [0.4.1] - 未定` を作る）に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-t46y-register-post-run-review-auto-close]]（元の項目）
- [[prj-0001:pjr-jsey-exec-run-split-smoke]]（失敗した実行）
