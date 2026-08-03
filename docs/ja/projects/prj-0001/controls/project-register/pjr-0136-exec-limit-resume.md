---
specdojo:
  id: prj-0001:pjr-0136-exec-limit-resume
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  based_on:
    - prj-0001:pjr-0122
    - sysd-agent-settings
---

# PJR-0136 agent利用制限後の自動再開

## 1. 概要

`exec run --auto` で Claude Code、Codex などの利用制限により task を継続できない場合に、制限種別と再開可能時刻を永続化する。定時起動される routine から再開時刻を迎えた task を抽出し、保持した実行状態と worktree を使って安全に再実行できるようにする。

## 2. 完了条件

- 一時的な rate limit、session limit、長期の quota exhausted、通常の実行失敗を区別して記録できる。
- provider の出力に明示された reset 時刻または retry-after を取得できる場合は、タイムゾーンと日付繰り越しを考慮した再開可能時刻を記録する。
- reset 時刻を取得できない場合は推定値を記録せず、明示的に設定されたcooldown policyがある場合だけその時刻を使用する。
- 再実行可能な利用制限は通常の `blocked` と区別され、task、actor、provider、制限種別、再開可能時刻、試行回数、worktreeを再開に必要な情報として保持する。
- 別providerへfallbackできる場合や依存関係のないtaskがある場合はauto全体を停止せず、実行可能な処理を継続する。
- routineからdueな延期taskだけを冪等に抽出して再実行でき、再開可能時刻より前のtaskや自動再開対象外のquota exhaustedを実行しない。
- 多重起動時にも同じtaskを重複再開せず、成功、再延期、通常のblockの各状態へ正しく遷移する。
- Claude CodeとCodexの代表的な制限メッセージ、時刻不明、別provider fallback、routine再開を自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                                        | 担当  | 状態 | メモ                                                         |
| --- | --------------------------------------------------------------------------- | ----- | ---- | ------------------------------------------------------------ |
| 1   | provider固有メッセージを共通の制限種別と再試行可否へ正規化する              | Codex | done | 6種別へ正規化し、診断用 raw message を長さ制限して保持した   |
| 2   | 延期状態と再開情報の永続化形式、event、resultとの関係を設計・実装する       | Codex | done | block event meta を正本とし、通常の blocked と識別可能にした |
| 3   | reset時刻、retry-after、設定済みcooldownから再開可能時刻を解決する          | Codex | done | timezone・翌日繰越を処理し、未取得時刻は推定しない           |
| 4   | dueな延期taskを排他的に再開するコマンドとroutine actionを実装する           | Codex | done | `exec resume --due` と `exec-resume` action を追加した       |
| 5   | autoのfallback・継続制御と再延期・block遷移を実装する                       | Codex | done | rate limit で独立 task を止めず、結果別の遷移を実装した      |
| 6   | provider別ケース、時刻境界、多重起動、routine連携のテストと設計書を更新する | Codex | done | Claude Code・Codex・due抽出・routine引数をテスト化した       |

## 4. 対応結果

- `rate_limit`、`session_limit`、`quota_exhausted`、`overloaded`、`timeout`、`oom` を正規化し、retryable・自動再開可否・provider 原文を block event の `meta` に永続化した。
- provider の reset 時刻と retry-after を UTC の再開時刻へ変換した。日付なし時刻は明示 timezone で解釈して翌日繰越を行い、時刻不明時は明示された cooldown policy だけを使用する。`quota_exhausted` は自動再開しない。
- `specdojo exec resume --due` が scheduler lock 内で due task を `blocked` から `doing` へ確保し、保持した actor と worktree で再実行するようにした。成功・再延期・通常 block を区別して記録する。
- routine に `exec-resume` action を追加し、定時 routine から due task だけを冪等に再開できるようにした。
- 利用制限を検出した critical task があっても、別 provider への fallback と依存しない Ready task の実行を継続するようにした。
- 共通設計、exec 設定・運用・コマンドガイド、設定 schema、プロジェクト用 routine 例を更新した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]]
- [[sysd-agent-settings|エージェント共通設定]]
- [[sysd-claude-agent-settings|Claude Codeエージェント設定]]
- [[sysd-codex-agent-settings|Codexエージェント設定]]
- [[specdojo:exec-operation-guide|SpecDojo exec運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
