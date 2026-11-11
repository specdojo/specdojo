---
specdojo:
  id: prj-0001:pjr-0x0s-night-register-child-run-env-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-11T11:57:33Z"
  derived_from:
    - PJR-RX14
  commit_type: fix
  commit_scope: exec
---

# PJR-0X0S 夜間の register の子の run に job の worktree の環境が漏れないようにする

## 1. 概要

orchestrator night から起動する子の exec run の worktree の置き場所と git の環境を、job の worktree から切り離す

## 2. 入力

- PJR-RX14 の修正。v0.8.0 に含める（indie が 2026-11-11 に承認）

## 3. 完了条件

- PJR-RX14 の原因（子の run の worktree が job の worktree の下に入れ子になる置き場所の求め方と、job の worktree から引き継ぐ git の環境変数のどちらで、または両方で落ちるか）を確かめ、個票の対応結果に書いている。
- orchestrator night（job の worktree の中）から起動した子の exec run の worktree が、主の作業ツリーから起動したときと同じ置き場所に作られ、入れ子にならない。
- 子の run の plan・result・実行記録が統合の後に統合先のブランチへ入り、入れ子の worktree に残らない。
- 子の run の git の操作と親の検証は、job の worktree の環境変数を引き継がない。git の環境は `src/shared/git-environment.ts` の `gitEnvironment()` を正本として隔離する。
- job の worktree の中から子の run を起動したときの置き場所と環境の隔離を、回帰テストで確かめている。job の worktree から起動しても `tests/src/exec/job-worktree.integration.test.ts` が通る。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。
- 修正の後に夜間の register の routine を実際に 1 回流して確かめ、`rtn-night-approved-register` を有効に戻すのは orchestrator が行う（executor の作業ではない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当         | 状態 | メモ                                 |
| --- | ---------------------------------------------- | ------------ | ---- | ------------------------------------ |
| 1   | 原因を確かめる                                 | executor     | done | 5.1 節に切り分けを記載               |
| 2   | 置き場所と環境を隔離し、回帰テストを足す       | executor     | done | 親 runner が単体・統合検証を実行する |
| 3   | 夜間の routine を 1 回流して確かめ、有効に戻す | orchestrator | open | 統合後の実運用確認                   |

## 5. 対応結果

### 5.1. 原因と修正

merge commit の親数が足りなくなる直接原因は、Job worktree への再起動で設定した `SPECDOJO_JOB_REVIEW_WORKTREE_CHILD=1` が command → night → register run → 親検証へ残ることだった。統合テスト内の別の Job も再起動済みと判定され、worktree・review・merge を飛ばして in-place で完了する。`jobRunUsesReviewedIntegration()` は同じ review 宣言と worktree 指定でも、この印に対応する `isWorktreeChild` が true なら false、false なら true を返すことを確認した。Job の入口で印を消費してローカルな引数へ渡し、precondition を含む子孫へ継承しないようにした。

入れ子の配置は別の不具合で、`resolveWorktreeBase()` が設定値・既定値の相対パスを Job worktree 基準で解決していた。主の作業ツリーを基準に変更し、この実行の linked worktree と主の作業ツリーで既定の配置がともに `/workspaces/specdojo-workspace/worktrees` になることを確認した。統合先は従来どおり起動元の Job ブランチで、Job 全体の review・統合を通して上位へ渡す。

Git の repository 固有変数は既存の command 実行・Git 操作・親検証で `gitEnvironment()` により除去されており、今回の親数不足を説明する原因ではない。再起動と夜間の子起動にも同じ正本を適用し、直接起動した場合も隔離する。project 実行 lock の token や通常の Git identity は保持する。

### 5.2. 成果物と検証

- 実装: `src/exec/worktree.ts`、`src/exec/run/job.ts`、`src/commands/night-orchestrator.ts`。
- 回帰テスト: 夜間の子プロセスの Git 環境除去と lock 継承、主・Job worktree 間の配置一致、Job command への内部印の非継承、Job worktree 内での別 Job の review・merge、register run の plan・result・evidence・pipeline 状態の Job ブランチへの統合を追加した。`job-worktree.integration.test.ts` の fixture の Git identity は既存のテスト共通環境を使う。
- 設計・ガイド: [[prj-0001:sysd-job-execution|Job実行設計]]、[[specdojo:exec-worktree-guide|exec worktree運用ガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]] を更新した。
- 変更ファイルの Prettier 整形、カタログ検証、履歴リンク検証、register build、差分の空白検査は成功した。単体・統合テスト、型検査、各 lint、schema 検証は指定どおり親 runner が実行し、確定結果を追記する。

### 5.3. 判断と申し送り

- 互換性のため、明示的な `--worktree-base` の相対パスは起動元基準を維持した。設定値・既定値だけを主の作業ツリー基準にし、絶対パスは変更しない。Git 未初期化などで主の作業ツリーを取得できなければ従来の起動元基準に戻す。
- orchestrator は統合後に夜間の register routine を 1 回実行し、子の記録が最終統合先へ入ることと親検証の成功を確認してから `rtn-night-approved-register` を有効に戻す。実 agent の起動と使用量消費を伴うため executor では実行しない。
- runner・register・exec の統合後確認として、[[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]] 6.1 節に従い PJR-JSEY の動作確認も orchestrator が行う。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正（v0.8.0）。文案: 夜間の register 実行で子の worktree が入れ子になり、Job の内部環境が子の統合テストへ漏れて review・merge を飛ばす問題を修正しました。

## 6. 関連ドキュメント

- [[prj-0001:pjr-rx14-night-register-env-leak]]
