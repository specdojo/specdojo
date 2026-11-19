---
specdojo:
  id: prj-0001:pjr-8z71-history-link-target-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-19T12:47:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DM9B
  commit_type: fix
  commit_scope: exec
---

# PJR-8Z71 rulebook などの pjr-*.md を履歴蓄積ファイルと誤って判定し、executor の適用外の報告を受け付けない

## 1. 課題内容

isHistoryLinkTargetPath がファイル名の pjr-*.md だけで判定するため、pjr の rulebook の変更でも validate:history-links を必須とし、executor の not_applicable を拒んで止まる

## 2. 入力

- 2026-11-19 の T-KATA-SLIM-2-pjr-index-040 は、executor が pjr の rulebook（rulebooks のディレクトリにある、名前が pjr- で始まる Markdown）だけを変え、npm run validate:history-links を「履歴蓄積ファイルを変更していない」と `not_applicable` で報告した。runner は executor validation failed or not run: npm run validate:history-links で 3 回止めた（plan に実行を求める指示を書き足しても opus は同じ報告をした）。
- src/exec/reporter.ts の isHistoryLinkTargetPath は /(?:^|\/)pjr-[^/]+\.md$/ でディレクトリを見ずに判定する。.github/instructions/markdown.instructions.md の履歴蓄積ファイルの対象は `controls/project-register/pjr-*.md` の個票、exec/plans・exec/results、execution/runs の plan.md・result.md で、pjr-index.md は除く。
- 利用者は 2026-11-19 に、担当 DEV・期限 11 月末で起票し、v0.9.0 に入れることを承認した。

## 3. 影響範囲

| 観点         | 影響                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| スコープ     | runner が executor の検査の報告を判定するときの、履歴蓄積ファイルの判定（`src/exec/reporter.ts`）              |
| スケジュール | pjr の型（rulebook・recipe・sample・template）を直す run が統合の前で止まり、同じ範囲を触る後の run も進まない |
| コスト       | executor を起こし直しても同じ報告になり、割り当てを無駄に使う                                                  |
| 品質         | 成果物への影響はない。正しい適用外の報告が誤って拒まれる                                                       |
| 関係者       | DEV（runner の修正）                                                                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| 原因     | `isHistoryLinkTargetPath` がファイル名の `pjr-*.md` だけで判定し、個票のディレクトリかどうかを見ない |
| 対応策   | 履歴蓄積ファイルの判定を、記述ルールの対象（個票・plan・result）に合わせる                           |
| 依存事項 | なし                                                                                                 |
| 完了条件 | 下の「完了条件」を満たす                                                                             |

完了条件:

- 履歴蓄積ファイルの判定は、登録簿の個票（`docs/ja/projects/<project>/controls/project-register/pjr-*.md`、`pjr-index.md` を除く）、`exec/plans`・`exec/results` の Markdown、`execution/runs` の `plan.md`・`result.md` だけを対象にする。`.github/instructions/markdown.instructions.md` の「履歴蓄積ファイルのリンク記法」の対象と食い違わない。
- pjr の rulebook など、個票のディレクトリの外の `pjr-*.md` だけを変えた run では、executor の `npm run validate:history-links` の `not_applicable` の報告を受け付ける。
- 個票を変えた run で、`not_applicable` の報告を今までどおり拒む。
- 上の 2 つを確かめる単体テストがある。
- 本項目の統合の後、orchestrator が T-KATA-SLIM-2-pjr-index-040 を `exec resume --task` で再開して、統合まで進むことを確かめる。executor はこの再開をしない。
- 保護された設定は変えない。変更が要る場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 5. 対応結果

### 5.1. 解決内容

- `src/exec/reporter.ts` の `isHistoryLinkTargetPath` で、ファイル名の `pjr-*.md` だけを見る判定を `docs/ja/projects/<project>/controls/project-register/pjr-*.md` に限る判定へ変えた。`pjr-index.md` の除外、`exec/plans`・`exec/results`、`execution/runs` の `plan.md`・`result.md` の判定は変えていない。対象は `.github/instructions/markdown.instructions.md` の「履歴蓄積ファイルのリンク記法」と `packages/docs-lint/src/validate-history-links.ts` の既定 glob に揃う。
- runner が理由に使う適用条件の文言を「登録簿の個票 controls/project-register/pjr-*.md など」に改めた。
- 迷った点: 個票のディレクトリは `docs/ja/projects/` の下だけを対象とした。`validate:history-links` の既定 glob がこの範囲しか検査しないため、その外の `pjr-*.md` に実行を求めても検査対象にならない。

### 5.2. 確認結果

- `tests/src/exec/reporter.test.ts` に、pjr の rulebook・sample・`pjr-index.md` だけを変えた run で `npm run validate:history-links` の `not_applicable` を受け付けるテストを足した。修正前のコードでは rulebook と sample の 2 件が失敗し、修正後は通ることを確かめた。
- 個票を変えた run で `not_applicable` を拒む既存のテスト（still blocks ...）は修正後も通る。
- T-KATA-SLIM-2-pjr-index-040 の `exec resume --task` による再開は、本項目の統合の後に orchestrator が行う（executor は実施しない）。
- 保護された設定は変えていない。

### 5.3. 再発防止策

- 履歴蓄積ファイルの判定をディレクトリ込みで行い、型の文書など個票以外の `pjr-*.md` を対象から外すテストを置いた。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `exec`: pjr の rulebook など、登録簿の個票ではない `pjr-*.md` だけを変えた run で、executor が `npm run validate:history-links` を `not_applicable` と報告すると runner が拒んで止まる不具合を修正した（PJR-8Z71）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-dm9b-generated-rulebook-target-unresolved|PJR-DM9B]]（由来）
- `.github/instructions/markdown.instructions.md`（履歴蓄積ファイルの対象）
