---
specdojo:
  id: prj-0001:pjr-40ee-watch-detect-classify-report
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:15Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T00:59:57Z"
  conclusion: orchestrator watch-scan と routine を足し、止まったものを理由の種類に分けて execution/watch/ に記録し、朝の報告にまとめるようにした
  derived_from:
    - PJR-52EE
  commit_type: feat
  commit_scope: exec
---

# PJR-40EE 見張りで止まった理由を分類し、イベントの記録と朝の報告に残す

## 1. 概要

routine の間隔で止まったタスク・register 項目・列を見つけ、理由の種類に分けてイベントの記録と朝の報告に残す。手は打たない（PJR-52EE の子の 1）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- routine の間隔で、実行中・延期・中断の schedule のタスク、register 項目（`doing`・`waiting`・`review` で止まったもの）、列（queue）の状態を見て、止まったものを見つける。見る間隔は routine の設定で決める。
- 止まった理由を種類に分ける。少なくとも、使用量の上限・負荷による時間切れ・統合先の新しい commit が要る失敗・判断が要るもの（型の決まりを変えないと直らない指摘、保護された設定の変更、commit の対象外の変更など）を扱う。分け方の根拠（どの記録のどの文言から分けたか）も残す。
- 見つけたことを、決まった置き場所（例: `execution/watch/` の下）に 1 件 1 行で足していく（イベントの記録）。同じ止まりを毎回足し直さない。置き場所と 1 行の項目を設計し、ガイドに書く。
- 手は打たない（claim・再開・release・commit をしない）。
- 朝の報告（夜間の routine の朝報告と同じ置き場所）に、止まったもの・理由の種類・次にすべきことをまとめる。人やオーケストレーターが朝に読むだけで続きを判断できる形にする。
- cron と routine だけで動く。agent の種類に頼らない。
- 2026-11-13〜14 の夜の実例（上限・型のメニューの足し忘れ・commit の対象外・branch の食い違い・負荷の時間切れ）を、分類の単体テストの場面として再現する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                 | 担当         | 状態 | メモ                                                                              |
| --- | -------------------------------------------------------------------- | ------------ | ---- | --------------------------------------------------------------------------------- |
| 1   | 止まりを理由の種類に分ける規則を作る                                 | DEV          | done | `src/exec/watch-scan-classify.ts`                                                 |
| 2   | 止まりを見つけ、記録へ 1 件 1 行で足し、朝報告を書き直す見張りを作る | DEV          | done | `src/exec/watch-scan.ts`・`src/commands/watch-scan.ts`                            |
| 3   | 30 分ごとに見張りを起動する routine を足す                           | DEV          | done | `rtn-exec-watch-scan.yaml`                                                        |
| 4   | 2026-11-13〜14 の夜の実例を分類の単体テストにする                    | DEV          | done | `tests/src/exec/watch-scan-classify.test.ts`・`tests/src/exec/watch-scan.test.ts` |
| 5   | ガイド・CLI リファレンス・設計を直す                                 | DEV          | done | 登録簿運用ガイド・routine 運用ガイド・CLI リファレンス・Job 実行設計              |
| 6   | 統合の後に `exec smoke` と実際の routine の 1 回の実行で確かめる     | orchestrator | open | 統合の後に orchestrator が行う。executor の sandbox では統合前のため行えない      |

## 5. 対応結果

止まったものを見つけて理由の種類に分け、見張りのイベントの記録と朝報告に残す `specdojo orchestrator watch-scan` と、30 分ごとに起動する routine `rtn-exec-watch-scan` を足した。見張りは記録と報告を書くだけで、claim・再開・release・commit をしない。見る対象・分け方・記録の項目・報告の形は [[specdojo:register-operation-guide|登録簿運用ガイド]] の「止まった実行を見張る」に書いた。

- 見る対象: schedule のタスク（`blocked`・延期の `deferred`・更新が止まった `doing`）、register 項目（`waiting`・`review`・更新が止まった `in-progress`）、列（`stopped`・ロックのない古い `running`）。
- 理由の種類: `usage_limit`・`load_timeout`・`needs_target_sync`・`needs_decision`（`kata_rule`・`protected_config`・`out_of_commit_scope`・`git_state`・`merge_conflict`・`manual_block`・`review_pending` など）・`interrupted`・`unknown`。根拠として、当たった記録のパスと行を残す。
- 記録: `execution/watch/watch-events.jsonl` に `stalled` と `cleared` を 1 件 1 行で足す。同じ止まりは `key` で見分けて足し直さない。
- 朝報告: `execution/reports/watch-scan/watch-scan-YYYYMMDD.md` を 1 日 1 文書で毎回書き直す。
- 2026-11-13〜14 の夜の実例（上限・型のメニューの足し忘れ・commit の対象外・branch の食い違い・負荷の時間切れ）を、記録の文言のまま分類の単体テストにした。
- 本番のデータで `--dry-run` を流し、36 件（判断が要る 34、中断 2）を見つけ、`unknown` が残らないことを確かめた。

### 5.1. 迷った点と決めたこと

- コマンドの置き場所: `exec watch` は PJR-T4E0 が待つコマンドに使うため、見張りは `orchestrator watch-scan` とした。routine の `kind: specdojo` は `exec` を引数に取れず、Job はプロジェクト実行ロックを待つため、夜間の run の間も動けるよう、ロックを取らない orchestrator の下に置いた。
- 「branch の食い違い」の実例: 2026-11-14 の `T-KATA-WAVE-1-sysd-cross-cutting-policy-005` の `unknown option '--reserve'` とした。worktree の branch が古く、統合先の新しい hook のテストが通らなかった例のため、`needs_target_sync` に分けた。
- 規則の順: 状態に入った記録の文言を先に見て、当たらなければ run のログを見る。ログでは判断が要る規則を時間切れより先に当てる。流し直しで直らないものを、時間切れとして自動で流し直さないためである。
- 誤って分けないための制限: 使用量の上限と `overloaded` などの文言は、記録の文言だけに当てる。テストの名前に「rate limit」が出ることがあるためである（`limit.test.ts`）。`executor.log` は plan と成果物の本文を含むため読まない。親の検証のログは、検査ごとの最後の試行のうち終了コードが 0 でないものだけを読む。
- `index.lock` の取り合い: 流し直せば直るため、`load_timeout` の `git_index_lock` に入れた。
- 手で止めた block: pipeline の段も limit の印もない block（「差し戻し」など）は `needs_decision` の `manual_block` とした。
- `review` の register 項目: 人の判断を待つため、`needs_decision` の `review_pending` として朝報告に載せる。
- 中断の判定: 実行ロック（主と `--join` の枠）が生きている間は、`doing` と `in-progress` を中断と見なさない。ロックがなく、更新が `--stale-after`（既定 `2h`）より古いものだけを中断とする。手で始めた run の細かな見分けは PJR-T4E0 で扱う。
- 朝報告の日付: 登録簿の日付と同じ時間帯（`registerDateTimeZone`）で決める。
- routine の `enabled`: 見張りは読み取りと記録・報告の書き込みだけで、作業に手を打たないため `true` にした。

### 5.2. CHANGELOG に書く事項

- 区分: Added
  - `specdojo orchestrator watch-scan` を追加。止まった schedule のタスク・register 項目・列を見つけ、理由の種類（使用量の上限・負荷による時間切れ・統合先の同期・判断が要るもの・中断）に分けて、`execution/watch/watch-events.jsonl` と朝報告 `execution/reports/watch-scan/` に残す。手は打たない。
  - routine `rtn-exec-watch-scan` を追加。30 分ごとに見張りを起動する。

### 5.3. 申し送り

- 保護された設定は変えていない。devcontainer の cron は毎時 `routine run --due` を呼ぶため、`interval: 30m` でも実際の間隔は 1 時間になる。30 分ごとに見る場合は、cron の間隔を人が変える。
- 統合の後に、orchestrator が `exec smoke` と、`specdojo routine run --project prj-0001 --id rtn-exec-watch-scan` の 1 回の実行で、記録と朝報告が書かれることを確かめてから close する。
- 種類ごとの手当ては PJR-3M4M、判断が要るものの診断は PJR-YNQG、記録を読んで待つ `exec watch` と手で始めた run の見分けは PJR-T4E0 で扱う。

## 6. 関連ドキュメント

- [[specdojo:register-operation-guide|登録簿運用ガイド]]（「止まった実行を見張る」）
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]（`orchestrator`）
- [[sysd-job-execution|Job実行設計]]（「止まった実行の見張り」）
- 親の項目: PJR-52EE
