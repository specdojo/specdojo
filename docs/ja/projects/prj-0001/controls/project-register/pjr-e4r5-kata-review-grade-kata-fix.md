---
specdojo:
  id: prj-0001:pjr-e4r5-kata-review-grade-kata-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:53:14Z"
  derived_from:
    - PJR-ZZVE
  commit_type: fix
  commit_scope: schedule
---

# PJR-E4R5 型の schedule の review の段で、型そのものを grade する

## 1. 概要

PJR-ZZVE の修正

## 2. 入力

- PJR-ZZVE の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- 型を直す schedule（intent `improve-kata`・`bootstrap-kata-set`）の review の段で、代表の文書だけでなく、型そのもの（対応する rulebook と sample の組）も grade する。今は orchestrator が review の後に別に `grade run --target kata` を流している。
- 型の grade が pass でなければ、review の判定を完了にしない。判定の区別（`complete`・`incomplete` など）との関係を決める。
- 型の grade を流すときに、ほかの grade と取り合わない（PJR-36PW・PJR-X04G との関係を確かめる）。
- 回帰テストを足している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ                                       |
| --- | ------------------------------------------- | -------- | ---- | ------------------------------------------ |
| 1   | review の評価対象・完了条件・排他制御を修正 | executor | done | 型一式の grade、判定制限、回帰テストを追加 |

## 5. 対応結果

### 5.1. 実施内容と判断

- 原因: review 前の grade と plan は、その段の `approach` だけで対象を選んでいた。型を整備する schedule も review では `fully-guided` などを使うため、strategy の intent が判定へ伝わらず、代表成果物だけが評価されていた。
- `src/exec/review-kata.ts` を追加し、task 自身の `schedule_file` に対応する track の strategy と `local_id` から intent を解決した。別 track の同名成果物の intent は混ぜない。既存 schedule の再生成や設定変更は不要。
- `improve-kata` / `bootstrap-kata-set` の review 前に、代表成果物に加えて対応する rulebook と宣言済みの sample・recipe・template を順に grade する。複数 sample はすべて対象とし、sample の `not-needed` は尊重する。sample が未宣言・`undecided`、または `bootstrap_scope` の参照が解決できない場合は、対象を省いて完了させず保留する。型の組の整合を確認するため、改善対象の 1 種だけには絞らない。
- 判定: 型すべての最新 `--target kata` の grade が `pass` であることを追加完了条件にした。`needs-work` / `fail` は条件未充足の `incomplete` とし、`complete-with-findings` でも完了にはしない。未評価・古い結果・参照未解決は `grade-stale`、読取不能は `grade-unavailable`。review 中の変更を検知した reviewer の `changed-during-review` は保持する。`pass` は型の条件を満たすだけで、ほかの未充足事項を消さない。
- `src/exec/plans-generation.ts` で型ごとの対象・サイドカー・評価結果・追加完了条件を plan に提示する。`src/exec/run/schedule-prepare.ts` で grade と判定制限を共通化し、`schedule-task.ts` と `in-place.ts` から適用する。reporter や旧単段 agent が誤って完了 verdict を記録しても、runner が条件に応じて制限する。review を実施・記録できたことと、その判定が完了可能であることは既存どおり区別する。
- [[prj-0001:pjr-36pw-grade-run-if-busy-wait|PJR-36PW]] との関係: `src/grade/command-run.ts` / `src/grade/run.ts` に `grade run --if-busy fail|wait` を追加した。省略時の即時エラーは維持し、自動 review は `wait` で既存の project lock 解放後に実行する。待機方針は run の再開条件に含めない。
- [[prj-0001:pjr-x04g-parallel-review-grade-sidecar-isolation|PJR-X04G]] との関係: `--isolate-pipeline-state` と既存の正本サイドカーの checkpoint・統合前ガードを維持した。`src/review/grade.ts` で run ID に対象パスの hash を含め、同じ task・同じ秒の rulebook と sample が再試行状態を共有しないようにした。grade の同時書き込みを lock で防ぎ、失敗状態を共有 pipeline に戻さない。実行枠の設定は変更していない。
- [[sysd-critical-flows|システム設計重要フロー]]、[[specdojo:review-guide|レビューガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]] を更新した。保護設定の変更案・未解決の設計判断はない。

### 5.2. 検証

- `tests/src/exec/review-kata.test.ts` を追加した。両 intent の代表成果物と型の逐次評価、通常 review・別 track の除外、複数 sample と YAML、宣言不足、`not-needed`、pass / needs-work / fail、古い・欠落・読取不能の結果、完了 verdict の制限、生成 plan への評価結果提示を回帰ケースにした。
- `tests/src/grade/run.test.ts` に既存 lock での即時失敗と解放待ち、不正な待機方針の拒否を追加し、`tests/src/review/grade.test.ts` で自動 review の待機指定と同一秒の対象別 run ID を検証するケースを追加した。
- Prettier、catalog 検証、履歴リンク検証、実行時 import の依存宣言検査、staged evidence の secret scan が成功した。catalog 検証には今回変更していないカタログの参照先未作成・re-export 参照の警告があるが、終了コードは 0。
- `typecheck`・各 lint・schema・unit / integration test は pipeline の指示に従って親 runner が実行する。executor では重複実行していない。YAML 成果物は変更していないため、対象ファイル単位の schema 検査は非適用。

### 5.3. CHANGELOG に書く事項

- 不具合修正: 型を整備する schedule の review で、代表成果物に加えて rulebook・sample などの型一式を自動 grade し、型の最新 grade がすべて pass になるまで完了判定を保留する。
- 追加: `grade run --if-busy fail|wait` で同一 project の grade の終了待ちを選べる。自動 review は待機を使い、型ごとの再試行状態を分離する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-zzve-kata-review-grades-deliverable|PJR-ZZVE 元の課題]]
- [[prj-0001:pjr-36pw-grade-run-if-busy-wait|PJR-36PW grade の待機]]
- [[prj-0001:pjr-x04g-parallel-review-grade-sidecar-isolation|PJR-X04G 再試行状態の分離]]
- [[sysd-critical-flows|システム設計重要フロー]]
- [[specdojo:review-guide|レビューガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
