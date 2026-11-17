---
specdojo:
  id: prj-0001:pjr-8nb8-exec-smoke-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-17T12:21:33Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-JSEY
  commit_type: feat
  commit_scope: exec
---

# PJR-8NB8 runner の変更の統合後の動作確認（JSEY の手順）を specdojo のコマンドにする

## 1. 概要

確認用の項目の対象一覧への追記・開き直し・exec run・actor の確認を、orchestrator の手作業から 1 つのコマンドへ移す

## 2. 入力

- 運用メモの「JSEY（runner の動作確認）」の手順（対象一覧への ID の追記と commit、register reopen、claude-executor での exec run --register、start から review までと actor の実体名の確認、close）を、orchestrator が毎回手で流している。2026-11-17 も 2 回流した
- 利用者が 2026-11-17 に、npm script にするか specdojo のコマンドに足す案を出し、specdojo のコマンドにする形で起票を依頼した
- orchestrator のスクリプトや手作業は specdojo のコマンドへ移す方針である

## 3. 完了条件

- 確認対象の項目の ID を受け取る 1 つのコマンドで、確認用の項目（JSEY）の対象一覧への ID の追記と記帳、確認用の項目の開き直し、指定の executor での `exec run --register --worktree`、start から review まで通ったことと event の actor に実体名が記録されたことの機械的な確認を、順に行える。コマンドの名前は executor が決める。
- 確認用の項目の ID は、引数か設定で指定する（project ごとに違うため）。
- 確かめた結果を出力と終了コードで返し、失敗したときは止まった段と理由を出す。
- `--dry-run` で、何をするかを実行せずに示せる。
- 確認の後に close まで行うか（たとえば `--close`）は executor が決め、理由を個票の対応結果に書く。
- [[prj-0001:pm-orchestrator-playbook|運用メモ]] の「JSEY（runner の動作確認）」の手順と、[[specdojo:command-reference|コマンドリファレンス]] を新しいコマンドに合わせる。
- 単体テストと結合テストを足す。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                                                        |
| --- | -------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| 1   | コマンドの設計（名前、引数、確認用の項目の指定、close の扱い） | DEV  | done | コマンド・引数・close の方針を決定した                                      |
| 2   | コマンドを実装し、テストを足す                                 | DEV  | done | exec smoke、単体テスト、模擬 agent と実 Git による結合テストを追加した      |
| 3   | 運用メモとコマンドリファレンスを直す                           | DEV  | done | 運用メモ第 6.1 節とコマンドリファレンス第 7.2 節を更新した                  |
| 4   | 統合の後に新しいコマンドで確認を 1 回流す（orchestrator）      | DEV  | open | 統合後の新しいプロセス・実 agent の起動が必要なため orchestrator に引き継ぐ |

## 5. 対応結果

### 5.1. 実施内容と設計判断

- `specdojo exec smoke --project <id> --register <確認用ID> --targets <対象ID,...> --executor-by <executor> --reporter-by <reporter>` を追加した。既存の register のロック・commit 処理と exec run を使い、対象追記・commit、done の個票の reopen・commit、worktree での実行、今回の start → review と実体 actor の確認を順に行う。
- project ごとの設定追加を避け、確認用個票を必須の `--register` で指定する。executor と reporter は既存 pipeline と同じく両方を明示する。`--by` の既定は `specdojo-orchestrator` とした。
- 対象は review / done、確認用個票は done / open / review の edit タスクに限定した。open / review は reopen を省略する。waiting / in-progress は既存 run の調査・再開を促して停止する。レートリミットは stop を指定する。
- 対象一覧は `specdojo:smoke-targets` の HTML コメントで囲む書式と、JSEY の既存の括弧付き一覧に対応する。重複 ID を追記せず、個票や event の未 commit 変更を保護する。本文の対象一覧の変更は commit に記帳し、構造化フィールドを変えていないため update event は追加しない。
- 実行前の event 履歴を保存し、今回の start / review が 1 件ずつ順に追加されたこと、双方の actor が alias の解決先である実体 nickname と一致すること、最終状態が review であることを確認する。過去の成功や別 actor の event では成功にしない。
- close オプションは設けない。smoke の成功だけでは対象項目の他の完了条件を判断できないため、成功後は人が JSEY と対象の完了条件を確認して既存の `register close --commit` を使う。
- `--dry-run` は入力と対象一覧を読み取り検証し、書き込み・commit・agent 起動なしで手順を出す。失敗は段と理由を標準エラーへ出し、終了コード 1 で停止する。途中まで作成した commit は残す。
- 単体テストは対象一覧の追記・重複・曖昧さ、過去 event の誤認防止、順序・中断・actor 不一致を扱う。結合テストは既存の模擬 agent と実 Git の fixture を再利用し、reopen から統合と review、alias 解決、dry-run、未 commit 変更の保護、入力不備、executor 失敗時の停止を扱う。単体・結合テストと型・lint の検査は親 runner が実行する。
- 前回の親の結合テストで、確認用 fixture の文書 ID とファイル名の不一致により 2 件が対象追記の段で失敗した。fixture の ID をファイル名に合わせ、正常系の失敗時には標準エラーも assertion に表示するよう修正した。再実行は親 runner に委ねる。
- 保護された設定と `CHANGELOG.md` は変更していない。設定変更案はない。
- executor では build、変更ファイルの Prettier 整形、履歴リンク検証、カタログ検証、register build、JSEY と既存対象 PJR-R7BQ を使った dry-run が成功した。dry-run で `claude-executor` が実体 `sonnet-executor` に解決された。カタログ検証には、変更していない文書の参照に関する警告が残る。

### 5.2. 統合後の確認の申し送り

統合後に本体で `npm run build` を実行し、新しいプロセスから次を 1 回流す。実 agent の起動と使用量消費、および本タスク統合後の実行が必要なため executor sandbox では実行していない。作業内容の No. 4 は open のままとし、orchestrator が結果を確認して更新する。

```bash
npx specdojo exec smoke --project prj-0001 --register PJR-JSEY \
  --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter
```

成功出力の対象 ID・実体 actor・start / review event ID を確認し、JSEY と PJR-8NB8 の完了条件を確認して close する。result には、この実行と No. 4 の更新が必要であることを記載する。

### 5.3. CHANGELOG に書く事項

- 追加: `specdojo exec smoke` で、統合済み項目の確認用個票への対象追記・記帳、開き直し、worktree 実行、今回の start / review と実体 actor の確認を一括実行できるようにした。確認用個票・executor・reporter の指定と dry-run に対応する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-jsey-exec-run-split-smoke]]
- [[prj-0001:pm-orchestrator-playbook]]
