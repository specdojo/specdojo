---
specdojo:
  id: prj-0001:pjr-rkhr-schedule-resume-from-executor
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-01T11:13:16Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-01T13:38:14Z"
  conclusion: exec resume に --resume-from executor を足し、reporter の段で blocked になった、または doing のまま中断した schedule の pipeline のタスクを、残った worktree と変更を引き継いで executor からやり直せるようにした
  derived_from:
    - PJR-GEZN
---

# PJR-RKHR schedule のタスクでも executor からやり直せるようにする

## 1. 概要

exec resume に --resume-from executor を足し、reporter の段で blocked になった、または doing のまま中断した pipeline のタスクを、残った worktree と変更を引き継いで executor からやり直せるようにする。worktree の plan を直してから再開すると、直した plan を使う

## 2. 入力

- schedule のタスク T-DATA-FLOW-USAGE-cdfd-overview-010 が、executor の未完了の報告で reporter の段の blocked になった。worktree の plan に追加の指示を足して executor からやり直したいが、--resume-from executor は exec run --register にしかなく、exec resume --task は reporter から再開するだけである（2026-11-01）
- 登録簿の側の実装は src/exec/register-resume.ts の resumeFrom（executorTarget に前の試行の変更を引き継ぐ）と src/exec/run/register-command.ts のオプションの検査にある
- 利用者は、試行を exec release で破棄するのではなく、schedule でも --resume-from executor を使えるように直す方針を選んだ（2026-11-01）

## 3. 完了条件

- `exec resume --task <task-id> --resume-from executor` で、pipeline のタスクを executor の段からやり直せる。対象は、executor が成功して reporter の段で `blocked` になったタスクと、`doing` のまま中断したタスクとする。残っている worktree と前の試行の変更をそのまま引き継ぎ、executor の試行回数を 1 増やして、executor・reporter・統合の順に進める。`blocked` から再開するときは、状態遷移のイベントを記録する
- executor は worktree にある plan を読む。止まった後に worktree の plan を直してから再開すると、直した plan が使われる
- 再開できない場合（統合の段で止まっている、executor が成功していない、pipeline ではないタスク、`--resume-from` に `executor` 以外を渡した）は、理由を示して止まる。オプションの名前と制約は `exec run --register` の `--resume-from` とそろえる。共通にできる処理は `src/exec/register-resume.ts` と共有し、重複させない
- 単体テストと、実際の worktree を使う統合テストで、上の 3 項目を確かめる
- `docs/ja/specdojo/guides/exec-operation-guide.md` の「blockedタスクの復帰」の表と、`docs/ja/specdojo/references/command-reference.md` に追記する。plan を直して再開するときは、result に経緯を残す手順を書く。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後に、orchestrator が止まっている `T-DATA-FLOW-USAGE-cdfd-overview-010` で実際に使い、動作を確かめる（executor の作業ではない）

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                                                         |
| --- | ---------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------- |
| 1   | exec resume に --resume-from executor を足す   | DEV  | done | 既存 worktree の plan・変更・run を保持し、試行回数を加算                    |
| 2   | 単体テストと統合テストを足す                   | DEV  | done | 再開条件、編集済み plan、変更保持、イベント、拒否条件を追加。実行は親 runner |
| 3   | ガイド・コマンドリファレンス・CHANGELOG に書く | DEV  | done | 再開方法と result への経緯記録を追記。未公開の節へ記載                       |

## 5. 対応結果

- `exec resume --task <task-id> --resume-from executor` を追加した。executor が成功し reporter が未完了の pipeline を対象とし、reporter 段の `blocked` と中断した `doing` から既存 worktree 上で executor・reporter・統合へ進む。executor の試行回数は同じ run で加算し、`blocked` からの再開は準備完了後に `unblock` イベントを記録する。
- `src/exec/register-resume.ts` の最新 run 選択・変更一覧・申し送り復元を共有した。統合段・executor 未成功・pipeline 以外・無効な値・worktree／plan／evidence の欠損は理由付きで拒否し、準備失敗時に unblock しない。`--task` を必須とし、`--due` との併用も拒否する。
- `src/exec/run/schedule-prepare.ts` では plan を再生成せず、worktree にある編集済み plan と result を使う。`src/exec/run/schedule-task.ts` へ前回の変更対象と申し送りを渡し、既存の対象網羅検査に反映した。
- `tests/src/exec/register-resume.test.ts` と `tests/src/exec/run/resume.test.ts` に単体テストを追加した。`tests/src/exec/pipeline-e2e.integration.test.ts` には実 worktree での `blocked`／`doing`／未完了報告からの再開、編集済み plan の使用、未コミット成果の保持、試行回数、段の順序、dry-run の不変性、拒否時の agent 未起動・イベント不変性を検査するケースを追加した。
- 前回の親検証 `test-integration` の失敗3件は、schedule の commit 対象外である `pipeline-artifact.md` と `prior-work.md` が統合先に存在するというテストの期待によるものだった。テスト用 agent が対象成果物 `docs/test/doc.md` に初回の成果を書き、そこへ手作業の追記を加えてから再開する形に修正した。再開した agent がその内容を読んで追記し、統合先に前回の成果・手作業の追記・再開後の成果がすべて残ることと、reporter も編集済み plan を受け取ることを検査する。schedule の commit 許可範囲は既存設計に従う。
- [[specdojo:exec-operation-guide|exec運用ガイド]] の復帰表・plan 編集後の再開手順と、[[specdojo:command-reference|コマンドリファレンス]] の対象オプションを更新した。`CHANGELOG.md` は `Unreleased` の追加機能に記載した。
- 検証: 再開した executor でも対象ファイルの Prettier 整形、カタログ検証、登録簿の派生ビュー生成を実行した。カタログ検証は終了コード 0（参照先文書がない旨の既存警告あり）。修正後の型検査・TS／文書 lint・単体／統合テスト・schema 検証は pipeline 指示により親 runner に委ね、executor では重複実行しない。result は executor から編集せず、reporter と runner が記入する。
- 申し送り: 統合後、orchestrator が `T-DATA-FLOW-USAGE-cdfd-overview-010` の残存 worktree の plan に追加指示と経緯記録の指示を書き、`exec resume --task T-DATA-FLOW-USAGE-cdfd-overview-010 --resume-from executor` を実 agent で実行して確認する。plan の変更理由・再開までの経緯は executor 報告の `handoff` に含め、result の申し送りへの反映を確認する。runner の変更を含むため、運用メモに従い統合後の PJR-JSEY も実行してから close を判断する。これは executor の作業外であり、追加の設計判断や保護設定の変更提案はない。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide]]
- [[specdojo:command-reference]]
