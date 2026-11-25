---
specdojo:
  id: prj-0001:pjr-3m4m-watch-automatic-remedies
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-40EE
  commit_type: feat
  commit_scope: exec
---

# PJR-3M4M 見張りが分けた種類ごとに決まった手当てを打つ

## 1. 概要

使用量の上限・負荷の時間切れ・統合先の同期に、exec-defaults で選べる手当てを打つ。判断が要るものには手を打たない（PJR-52EE の子の 2）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- 見張り（子の 1）が分けた種類のうち、次の 3 つに手を打てるようにする。どの手を打つかは exec-defaults の設定で選べ、既定は手を打たない。
  - 使用量の上限: 解除の時刻まで待つか、代わりの agent で流し直す。指名した agent の上限が長い（例: 数日）ときは、claim を取り消して別の agent で流し直せる。
  - 負荷による時間切れと分かる親の検証の失敗: 同じ検査を流し直してから再開する。
  - 統合先の新しい commit が要る失敗: worktree を統合先に同期してから再開する（PJR-50CF と合わせる）。ぶつかったら止めて知らせる。
- 「判断が要るもの」には手を打たない。
- 自動で手を打つ回数に上限を設け、同じタスクで繰り返し失敗したら止める。
- 手を打ったら、見張りを actor にした event として必ず残し、朝の報告と登録簿にまとめる。
- worktree と branch を消す操作は既定ではしない。
- cron と routine だけで動く。agent の種類に頼らない。
- 2026-11-13〜14 の夜の実例のうち、上限と負荷の時間切れを、統合テストの場面として再現する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                             | 担当         | 状態 | メモ                                                                                |
| --- | ---------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------- |
| 1   | 手当ての設定の解決と、種類ごとに打つ手当ての判定を作る           | DEV          | done | `src/exec/watch-remedy.ts`                                                          |
| 2   | 見張りに手当ての起動・回数の上限・記録・朝報告を組み込む         | DEV          | done | `src/exec/watch-scan.ts`・`src/commands/watch-scan.ts`・`src/exec/agent-config.ts`  |
| 3   | exec-defaults の schema に `watch` を足す                        | DEV          | done | `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`                                |
| 4   | 判定と見張りの単体テストを足す                                   | DEV          | done | `tests/src/exec/watch-remedy.test.ts`・`tests/src/exec/watch-scan.test.ts`          |
| 5   | 2026-11-13〜14 の夜の上限と負荷の時間切れを統合テストにする      | DEV          | done | `tests/src/commands/watch-scan.integration.test.ts`                                 |
| 6   | ガイド・CLI リファレンス・設計・routine を直す                   | DEV          | done | 登録簿運用ガイド・exec設定ガイド・routine運用ガイド・CLI リファレンス・Job 実行設計 |
| 7   | 統合の後に `exec smoke` と実際の routine の 1 回の実行で確かめる | orchestrator | open | 統合の後に orchestrator が行う。executor の sandbox では統合前のため行えない        |

## 5. 対応結果

見張り（`orchestrator watch-scan`）が分けた `usage_limit`・`load_timeout`・`needs_target_sync` に、exec-defaults の `watch.remedies` で選んだ手当てを打てるようにした。どの手当ても既定は `none` で、`watch` を書かなければ従来どおり記録と報告だけを行う。判断が要るもの・中断・分けられなかったもの・列には手を打たない。手当ては新しい再開の仕組みを作らず、既存の `exec resume`・`exec run --register --resume` を固定の引数で切り離して起動する。動きと記録の項目は [[specdojo:register-operation-guide|登録簿運用ガイド]] の「止まった実行に手当てを打つ」、設定のキーは [[specdojo:exec-config-guide|exec設定ガイド]] の「見張りの手当て」に書いた。

- 使用量の上限: `wait` は解除の時刻を過ぎてから同じ agent で再開する（自動再開の印がある延期は `exec resume --due`）。解除が `switch_after`（既定 `12h`）より先で代わりの agent を書いていれば、claim を代わりの agent へ移して流し直す。`fallback` はすぐに替える。
- 負荷による時間切れ: `rerun` は止まった段から再開する。reporter・統合の段の再開は失敗した親の検証を流し直してから続ける。
- 統合先の同期: `sync` は統合先を取り込む再開の経路（統合の段の再試行、`--resume-from executor`、register の再開）を使う。ぶつかれば再開のコマンドが止め、次の見張りが `merge_conflict` として報告する。
- 回数の上限: 同じ対象に `attempt_window`（既定 `24h`）の間に `max_attempts`（既定 `3`）回打っても止まったままなら手当てを止め、`remedy_stopped` を 1 度だけ記録して朝報告に載せる。
- 記録: 起動の前に見張りの記録へ `remedy` の行を足し、schedule のタスクには `watch-scan` を actor にした `note` の event を残す。朝報告に「3. 手当て」を足した。worktree と branch は消さない。
- 共存: 別の run が実行ロックを持つ間は起動せず、次の回に回す。1 回の見張りで起動するのは古い止まりから 1 件だけにした。
- 2026-11-13〜14 の夜の codex の上限（解除の時刻つきの延期）と、負荷で test-unit が 5 秒の制限を切らした親の検証の失敗を、CLI 経路の統合テストにした。手当ては実際の子プロセスとして起動し、子は引数をログに書く偽の specdojo とした。

### 5.1. 迷った点と決めたこと

- 手当ての実装: 再開・同期・agent の切り替えを見張りに作り直さず、既存の再開のコマンドを起動するだけにした。手で再開したときと同じ動き（統合先の取り込み、ぶつかったときの停止、release と claim）になり、見張りが実行ロックを取らないままでいられるためである。
- 起動の形: routine は見張りの出力をパイプで待つため、手当ては切り離して起動し、出力を `execution/watch/remedies/` のファイルへ書く。見張りが再開の終わりまで数時間止まり、朝報告が更新されなくなるのを避けた。
- 1 回に 1 件: 再開のコマンドはどれもプロジェクトの実行ロックを取るため、2 件目は `--if-busy skip` で何もせずに回数だけを使う。古い止まりから 1 件ずつにした。
- 回数の数え方: 手当ての後に同じ対象がまた止まると、新しい block の時刻で別の `key` になる。`key` ごとに数えると上限が効かないため、対象（種類と ID）ごとに期間で数えた。
- 解除の時刻が読めないとき: register の上限の理由は `rate limit reached` だけで時刻を持たない。止まった時刻から `unknown_resume_wait`（既定 `1h`）待つことにした。
- 替えられない対象: pipeline の段を持たない schedule のタスクは `exec resume --task` で再開できないため、自動再開の印がある `--due` だけを打ち、ほかは手を打たない。
- 統合先の同期の段: 統合の段の再試行は commit の前に統合先を取り込むため `exec resume --task` とし、executor・reporter の段は統合先を取り込む `--resume-from executor` とした。後者は executor を起こし直すため agent を使う。
- `note` の event に meta を持たせない: meta を持つ event は状態の meta を置き換え、`--due` と pipeline の再開に要る `limit_*`・`pipeline_*` の印を消すためである。
- 登録簿への記録: register の event の記録は欄の変化のない行を持てないため、register 項目への手当ては見張りの記録と朝報告に残し、登録簿には再開した run が書く遷移の event が残る形にした。
- 設定の検証: `watch` の不正な値は exec-defaults を読む時点でエラーにした。ほかの節と同じく、誤った設定のまま夜間に動かないようにするためである。
- `--no-remedy`: 設定があっても記録と報告だけを行うオプションを足した。オーケストレーターが様子だけを見たいときのためである。

### 5.2. CHANGELOG に書く事項

- 区分: Added
  - exec-defaults に `watch.remedies` を追加。`orchestrator watch-scan` が使用量の上限（解除を待つか代わりの agent で流し直す）・負荷による時間切れ（親の検証を流し直して再開）・統合先の同期（同期してから再開）に、既存の再開のコマンドで手当てを打つ。既定は手を打たず、`max_attempts`・`attempt_window` で同じ対象への回数を止める。
  - `orchestrator watch-scan` に `--exec-defaults` と `--no-remedy` を追加。見張りの記録に `remedy`・`remedy_stopped` の行、朝報告に「手当て」の節を足した。

### 5.3. 申し送り

- 保護された設定は変えていない。prj-0001 で手当てを使う場合は、人が `.specdojo/exec-defaults.yaml` に次を足す案がある（`max_attempts` は夜間の取り違えを抑えるため 2）。

```yaml
watch:
  remedies:
    usage_limit:
      action: wait
      fallback_executor_by: sonnet-executor
      fallback_reporter_by: sonnet-reporter
      switch_after: 12h
    load_timeout: { action: rerun }
    needs_target_sync: { action: sync }
  max_attempts: 2
```

- `rtn-exec-limit-resume`（`enabled: false`）を有効にしたまま `usage_limit` を `wait` にすると、同じ延期を両方が再開しようとする。片方だけを使う。
- 統合の後に、orchestrator が `exec smoke` と、`specdojo routine run --project prj-0001 --id rtn-exec-watch-scan` の 1 回の実行で、手当てを選ばない既定のまま記録と朝報告（「3. 手当て」が `なし`）が書かれることを確かめてから close する。手当てを選んだ動きは、上の設定を人が足した後に確かめる。
- 判断が要るものの診断は PJR-YNQG、手で始めた run の見分けと「見張りの対象外」の印・見張りの停止と再開は PJR-T4E0 で扱う。

## 6. 関連ドキュメント

- [[specdojo:register-operation-guide|登録簿運用ガイド]]（「止まった実行を見張る」「止まった実行に手当てを打つ」）
- [[specdojo:exec-config-guide|exec設定ガイド]]（「見張りの手当て」）
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]（`orchestrator`）
- [[sysd-job-execution|Job実行設計]]（「止まった実行の見張り」）
- 親の項目: PJR-52EE。前提の項目: PJR-40EE
