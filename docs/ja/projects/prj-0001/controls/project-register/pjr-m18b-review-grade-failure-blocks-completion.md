---
specdojo:
  id: prj-0001:pjr-m18b-review-grade-failure-blocks-completion
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T11:31:19Z"
  block_reason: "parent validation failed: validate-schema"
  commit_type: fix
  commit_scope: review
---

# PJR-M18B review の段で grade が失敗したら、タスクを完了にしない

## 1. 概要

grade の失敗や grade-stale の結論では review を完了させず、再試行するか blocked にする

## 2. 入力

- 2026-11-15、kata-wave-2 の bac-task-completion-090 と sld-specdojo-090 で、review の前の grade が出力の形式の誤り（CAUSE requires a preceding FINDING / malformed `DONE_CRITERIA` entry）で失敗した。review は grade-stale と判定したのに、タスクは done になり、成果物の grade がないまま 140 に進んだ

## 3. 完了条件

- review の段の前の grade が失敗したとき（出力の形式の誤りなど）、決めた回数だけ grade を再試行する。それでも失敗したら、タスクを done にせず blocked にし、失敗の理由と次の操作を block の理由と result に残す。
- review の結論が `grade-stale`（grade が最新でない・ない）のとき、タスクを done にしない。
- grade が失敗した場合と grade-stale の場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ |
| --- | --------------------------------------------- | ---- | ---- | ---- |
| 1   | grade の失敗の再試行と blocked への遷移を足す | DEV  | done | -    |
| 2   | grade-stale の結論で完了させない              | DEV  | done | -    |
| 3   | 回帰テストを足す                              | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `src/review/grade.ts`: review の前の grade（`ensureReviewGrade`）が失敗したとき、別の run ID（2 回目以降は末尾に `-a<n>`）で合計 `REVIEW_GRADE_MAX_ATTEMPTS`（3 回）まで試すようにした。失敗の結果は試行回数（`attempts`）を持ち、review plan の評価結果の節に「n 回試して失敗した。runner はこの review タスクを完了にせず blocked にする」と示す。
- `src/exec/review-completion.ts`（新規）: review タスクを done にしてよいかを判定する。再試行しても grade が失敗した場合と、review result の verdict が `grade-stale` / `grade-unavailable` / `changed-during-review` の場合に、次の操作（`need=`）を含む block の理由を返す。
- `src/exec/run/schedule-task.ts`・`src/exec/run/schedule-prepare.ts`・`src/exec/run/in-place.ts`: schedule の review タスクを完了にする前に上の判定を呼ぶ。block の理由があれば、done と統合を止めて blocked にし、`exec block` の理由と result の `block_reason` に残す。worktree の実行では、grade の結果を `PreparedTask.reviewGradeOutcome` で完了の判定まで引き継ぐ。
- `docs/ja/specdojo/guides/review-guide.md`: grade の再試行と blocked への遷移を書いた。
- 回帰テスト: `tests/src/exec/review-completion.test.ts`（新規。grade の失敗と `grade-stale` などの verdict で blocked にし、`complete` などでは止めないこと）、`tests/src/review/grade.test.ts`（再試行して成功した試行の run ID を返すこと、3 回とも失敗したら `attempts` を返すこと、plan の文面）。

### 5.2. 判断した点

- 再試行は合計 3 回とした。出力の形式の誤りは試行ごとにばらつく失敗で、2 回の再試行で救えると見込んだ。grade は agent を呼ぶため回数を増やしすぎない。各試行の run ID を変え、失敗した試行の pipeline 状態を引き継がない。
- grade が失敗しても review の agent はこれまでどおり実行し、完了の段で blocked にする。claim の前に止めると、blocked への遷移と記録の流れを別に作る必要があり、変更が大きくなるため。
- done にしない verdict は `grade-stale` に加え、同じく保留を表す（旧 `blocked` の移行先の）`grade-unavailable` と `changed-during-review` も含めた。`incomplete` の扱いはこの項目では変えていない。
- register の post-review（受け入れない verdict は既に `waiting`）と Job Run の review（受け入れる verdict を既に限定）には判定を入れていない。今回の不具合の経路である schedule のタスク（worktree・in-place）だけに足した。
- 型の grade の失敗は、これまでどおり `enforceKataReviewVerdict` が verdict を `grade-stale` に制限するため、上の判定で blocked になる。

### 5.3. 残課題

- schedule の review タスク全体（`runPreparedTask`）を通す統合テストはない。判定は単体テストで、配線は型検査とコードの確認で確かめた。
- blocked にした review の再開（`exec resume` で reporter から再開する、または unblock して再実行する）は既存の pipeline の再開の規則に従う。どの経路でも完了の段で判定し直すため、grade が最新にならないうちは done にならない。

### 5.4. CHANGELOG に書く事項

- Fixed: schedule の review タスクで、review の前の grade が失敗したとき（出力の形式の誤りなど）、合計 3 回まで grade を再試行するようにした。それでも失敗した場合と、review の verdict が `grade-stale` / `grade-unavailable` / `changed-during-review` の場合は、タスクを done にせず blocked にし、理由と次の操作を block の理由と result の `block_reason` に残す。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
