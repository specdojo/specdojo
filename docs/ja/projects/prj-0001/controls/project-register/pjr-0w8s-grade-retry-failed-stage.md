---
specdojo:
  id: prj-0001:pjr-0w8s-grade-retry-failed-stage
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T21:49:34Z"
  due_on: "2026-09-30"
---

# PJR-0W8S grade の段が失敗した文書を次回の定期再評価で失敗した段から再試行する

## 1. 概要

run-per-document.sh は同じ --run-id での再実行なら失敗した段から再開できるが、定期再評価は毎回新しい Job Run になるため、失敗した段は引き継がれない。段が失敗すると直前の段の判定が content_hash 付きで残り、内容が変わらない限り --changed-only でも --ungraded でも再選択されないため、codex の 3 段目だけが拒否された文書は gemma の判定のまま確定する。9/14 0 時の run では 10 件中 4 件で段が失敗し、cdfd-uc-rulebook と cdfd-mermaid-rulebook が 3 段目未実施のまま pass 100 で残った。段の失敗を文書の評価状態として記録し、次回の選択で拾って失敗した段から再試行する。

### 1.1. 観測（2026-09-14 0 時の `JBR-grade-kata-f41e0255f31d`）

<!-- prettier-ignore -->
| 文書 | 失敗した段 | 拒否理由 | 残った判定 |
| --- | --- | --- | --- |
| `cdfd-mermaid-rulebook` | 3（codex） | `finding severity caps level at 1` | 2 段目の gemma: pass 100 |
| `cdfd-uc-rulebook` | 3（codex） | 同上 | 2 段目の gemma: pass 100 |
| `cdfd-overview-recipe` | 2（gemma） | `nested VIEWPOINT marker` | 1 段目の gemma: pass 98 |
| `cdfd-uc-recipe` | 2（gemma） | 同上 | 1 段目の gemma: pass 100 |

いずれも利用制限ではなく、`grade apply` の忠実性・形式検証による拒否である。gemma の 1〜2 段目は
ほぼ全件 pass 100 を出す傾向があり（PJR-VQB5）、指摘は codex の 3 段目が出しているため、3 段目が
拒否されると事実上未評価に近い判定が pass として確定する。

### 1.2. 現状の仕組み

- `tools/grade/run-per-document.sh` は `--run-id` ごとに `stage-<n>.state.tsv` と `complete` を保存し、
  同じ `--run-id` での再実行だけが失敗した段から再開する。
- 定期再評価（`rtn-grade-recheck` / `rtn-grade-deliverable-recheck`）は毎回新しい Job Run を作るため、
  前回の失敗は引き継がれない。
- 選択は `--changed-only`（`content_hash` の差）と `--ungraded`（`specdojo.grade` の有無）だけで、段が失敗しても
  直前の段の apply が `content_hash` を保存済みのため、内容が変わらない限り再選択されない。
- `command-reference` は「評価の試行に失敗して grade が保存されなかった文書も未評価に含める」とするが、
  途中の段まで保存された文書はこれに該当しない。

### 1.3. 対処の方向

- 段の失敗を文書の評価状態として残す。候補は、`specdojo.grade` に最終段の到達状況（例: `stage_completed: 2`、
  `stage_failed: 3`、`stage_total: 3`）を記録するか、`execution/grade/` に文書別の pipeline 状態を置く。
- 選択に「段が未完了の文書」を含める（`--incomplete` または `--ungraded` の意味の拡張）。定期再評価の
  precondition と script の選択規則を同じにする。
- 再試行は失敗した段から始め、成功済みの段は再実行しない。
- 同じ段が連続して失敗した場合の上限（例: 3 回）を設け、超えたら報告に回す。

## 2. 完了条件

- 段が失敗した文書について、どの段まで完了しどの段で失敗したかが `specdojo.grade` または文書別の状態ファイルから判定できる。
- 定期再評価の選択が、内容変更・未評価に加えて段が未完了の文書を含み、precondition（`grade list`）と script で同じ規則になっている。
- 再試行が失敗した段から始まり、成功済みの段を再実行しない。連続失敗の上限に達した文書は選択から外れ、報告に含まれる。
- `cdfd-mermaid-rulebook` と `cdfd-uc-rulebook` が次回の定期再評価で 3 段目から再試行される。
- `command-reference` と routine 運用ガイドの記述が新しい選択規則に合っている。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` と、script の単体テストが成功する。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                   |
| --- | -------------------------------------------------------- | ---- | ---- | -------------------------------------- |
| 1   | 段の到達状況の記録先を決め、apply と script で書き込む   | ARC  | open | frontmatter か文書別の状態ファイル     |
| 2   | `grade list` と script の選択に未完了の文書を加える      | ARC  | open | precondition と同じ規則                |
| 3   | 失敗した段からの再試行と連続失敗の上限を実装する         | ARC  | open | 成功済みの段は再実行しない             |
| 4   | 文書とテストを更新し、次回の定期再評価で再試行を確認する | ARC  | open | 対象は uc-rulebook と mermaid-rulebook |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- agent 別の判定傾向: [[prj-0001:pjr-vqb5-agent-grade-comparison]]
- 定期再評価の設計: [[prj-0001:pjr-t2kk-grade-recheck-routine]]
- 選択 0 件時の抑止: [[prj-0001:pjr-33sb-grade-recheck-skip-empty-selection]]
- 選択規則の記述: [[specdojo:command-reference]]
