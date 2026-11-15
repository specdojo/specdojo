---
specdojo:
  id: prj-0001:pjr-x05n-review-kata-grade-not-run
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T11:31:23Z"
  completed_at: "2026-11-15T22:20:34Z"
  conclusion: 0.8.0 の第 1 段で直した（review の段で型の自動の grade が流れない件）。親の検証をすべて通って統合済み
  derived_from:
    - PJR-E4R5
  commit_type: fix
  commit_scope: review
---

# PJR-X05N 型を整備する schedule の review で、型一式の grade が流れるようにする（E4R5 の効き目の確認）

## 1. 概要

E4R5 の自動の grade が kata-wave-2 で流れなかった理由を調べ、直す

## 2. 入力

- 2026-11-15、kata-wave-2 の 090（review）が 4 件とも完了したのに、型（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のままで、自動の grade が流れていなかった。PJR-E4R5 で、型を整備する schedule の review で型一式を自動 grade するようにしたはず

## 3. 完了条件

- kata-wave-2（`sch-strategy-kata-wave-2`、intent は bootstrap-kata-set）の 090 で、型一式の自動の grade が流れなかった理由を調べ、対応結果に書いている（intent・approach・phase の条件の食い違い、grade の失敗の握りつぶしなど）。
- 型を整備する schedule（bootstrap-kata-set・improve-kata）の review の段で、型一式（rulebook・sample、宣言があれば recipe・template）を grade し、型の grade が pass になるまで完了を保つ。PJR-E4R5 の完了条件どおりに動く。
- bootstrap-kata-set の schedule の review で型の grade が流れることを、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                     | 担当 | 状態 | メモ                            |
| --- | ------------------------ | ---- | ---- | ------------------------------- |
| 1   | 流れなかった理由を調べる | DEV  | done | strategy のパス解決の誤り       |
| 2   | 型の自動の grade を直す  | DEV  | done | schedule ディレクトリ基準で解決 |
| 3   | 回帰テストを足す         | DEV  | done | 実配置の fixture に変更         |

## 5. 対応結果

### 5.1. 流れなかった理由

- intent・approach・phase の条件の食い違いや grade の失敗の握りつぶしではなく、strategy ファイルのパス解決の誤りだった。`scheduleKataReviewSubjects`（`src/exec/review-kata.ts`）は task の `schedule_file` の `dirname` から `sch-strategy-<track>.yaml` を探し、`existsSync` で確かめていた。
- ready / cpm のスナップショットの `schedule_file` は schedule ディレクトリからの相対パス（例: `sch-track-kata-wave-2.yaml`、`schedule_path` は `docs/ja/projects/prj-0001/schedule`）で、`dirname` は `.` になる。そのため runner の cwd（リポジトリルート）で strategy を探して見つからず、型の評価対象が空になっていた。対象が空なので型の grade も、判定の制限も、plan の追加完了条件も出ず、エラーも出なかった。
- kata-wave-2 の strategy（intent `bootstrap-kata-set`、`bootstrap_scope` は rulebook・sample）と task ID（`T-KATA-WAVE-2-...-090`）は、E4R5 の判定条件を満たしていた。E4R5 の回帰テストは fixture の `schedule_file` を cwd 相対の `schedule/sch-track-kata.yaml` にしていたので、この食い違いが見えなかった。

### 5.2. 実施内容と判断

- `src/exec/review-kata.ts`: プロジェクト設定の schedule ディレクトリ（`getProjectSchedulePath`）を基準に `schedule_file` を解決してから strategy を探すようにした。`scheduleKataReviewSubjects` に `projectId` 引数を足した。
- `src/exec/plans-generation.ts`・`src/exec/run/schedule-prepare.ts`: 呼び出し元 3 か所（plan 生成、review 前の grade、verdict の制限）から `projectId` を渡すようにした。worktree でも in-place でも、同じ解決を通る。
- 判断: 呼び出し元ごとに schedule のパスを引き回さず、`projectId` から設定を読んで解決した。plan 生成（`generateSinglePlan`）は schedule のパスを持たず、3 か所すべてが `projectId` を持っているためである。絶対パスと cwd 相対のパスは、念のため従来どおり候補に残した。引数は省略可能にせず必須にして、呼び出し元の渡し忘れを型検査で見つけられるようにした。
- grade の失敗の扱い（ログに出して review は続け、verdict の制限で完了を保つ）は E4R5 の設計どおりで、変えていない。
- 保護設定の変更案・未解決の設計判断はない。kata-wave-2 の型の grade は、修正後の review（または `grade run --target kata`）で流し直す必要がある。

### 5.3. 検証

- `tests/src/exec/review-kata.test.ts`: fixture の `schedule_file` を実配置と同じ schedule ディレクトリ相対（`sch-track-kata.yaml`）に変えた。既存のケースはすべて実配置のパス解決を通る。
- kata-wave-2 と同じ形（track `kata-wave-2`、intent `bootstrap-kata-set`、approach `retrofit`、`schedule_file` は `sch-track-kata-wave-2.yaml`）で、review 前に rulebook・sample が `--target kata` で grade されることを確かめる回帰ケースを足した。修正前の実装では strategy を見つけられず、このケースは失敗する。
- `npx vitest run tests/src/exec/review-kata.test.ts` で 10 件が通った。Prettier の検査も通った。`typecheck`・`lint:ts`・`test:unit`・`lint:md` などは親 runner が実行する。

### 5.4. CHANGELOG に書く事項

- 不具合修正: 型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した。strategy ファイルを、schedule ディレクトリではなく作業ディレクトリ基準で探していたためである。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
