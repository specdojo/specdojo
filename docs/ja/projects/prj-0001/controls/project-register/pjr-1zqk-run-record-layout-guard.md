---
specdojo:
  id: prj-0001:pjr-1zqk-run-record-layout-guard
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T22:40:41Z"
  due_on: "2026-11-20"
  derived_from:
    - PJR-DVNV
  commit_type: fix
  commit_scope: exec
---

# PJR-1ZQK plan だけの run の記録を commit せず、記録の配置の検査を push の前に流す

## 1. 概要

setup で止まった run の plan だけの記録が develop に入り、CI の Check execution record layout が落ちた

## 2. 入力

- 2026-11-16、push した develop（54b7722）で CI の Check execution record layout が落ちた。原因は c9792389a（orchestrator がたまっていた実行記録をまとめて commit したもの）に、setup で止まった run（T-KATA-WAVE-2-bac-task-execution-005 の 0169b6b4）の plan.md だけが入っていたこと。evidence.json と result.md がないため exec validate --records-only が missing を出す。a9beaef99 でこの plan.md を git から外して直した
- PJR-DVNV で runner は統合の後の記録も自動で commit するようになった。setup や executor の起動前に止まった run が plan だけを残すと、同じ形の記録が runner の commit で develop に入り、CI を落とすおそれがある

## 3. 完了条件

- setup で止まる run を再現するテストで、commit される記録が配置の検査を通る。
- push の前の検査が、配置の誤りを含む commit で失敗し、正しい commit では通る。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                                                                                                                                     | 担当 | 状態 | メモ                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | runner が plan だけの run を残さない、または止まった理由を含めて記録をそろえる（どちらにするかは exec の記録の配置の規約と合わせて決める）                                               | DEV  | done | -                                                                     |
| 2   | lefthook の pre-push などで exec validate --project prj-0001 --records-only を流し、CI より先に気づけるようにする。ローカルにしかない空の run のディレクトリで誤検出しないことも確かめる | DEV  | open | orchestrator が lefthook に登録する（保護対象）。入口と検査は実装済み |

## 5. 対応結果

- 作業 1 は「plan だけの run を記帳しない」方にした。配置の規約（[[specdojo:plan-result-lifecycle-guide]] の「配置の検査」）は「記録がそろった revision を対象にする」ことを求め、欠けたファイルを生成しない。runner が止まった理由で result・evidence を作り足すと、再開で同じ run を続ける経路と衝突するためである。
  - `src/exec/validate-records.ts` から、run 1 件の必須記録の欠落を返す `missingRunRecords` を切り出した。全体の検査と記帳の両方が同じ判定を使う。
  - `src/exec/trailing-records.ts` の記帳の commit は、commit した後に `plan.md`・`result.md`・`evidence.json` がそろわない run のディレクトリを外す。外した run は作業ツリーに残し、ディレクトリと次の操作（再開するか、executor の起動前に止まった run なら消す）を標準エラーに出す。result.md が hook に拒否されて外す再試行では、HEAD に result.md のない run を丸ごと外す。
- 作業 2 は、作業ツリーではなく commit の tree を検査する形にした。作業ツリーを検査すると、ローカルにしかない中断中の run で push が止まるためである。
  - `exec validate --records-only --commit <rev>` を足した（`src/exec/validate-records-commit.ts`）。`<rev>` の tree の実行記録を一時ディレクトリへ書き出して同じ検査を流す。読むのは `execution: human` の判定に使う result.md だけで、tree にある lock は追跡済みとして報告する。
  - pre-push の入口 `tools/check-run-record-layout-push.mjs` を足した。push する各 ref の先端 commit を上の検査にかけ、1 件でも落ちたら終了コード 1 にする。削除の push は対象にしない。hook の入口なので Node 標準だけで動き、`node_modules/tsx` がなければ通知して検査を飛ばす。
  - `lefthook.yml` は executor が編集できない保護対象のため、pre-push への登録はしていない。追加する内容は残課題に書いた。
- ガイドを更新した: [[specdojo:plan-result-lifecycle-guide]]（`--commit` と pre-push）、[[specdojo:schedule-operation-guide]]（記帳しない run）、[[specdojo:command-reference]]（`--commit`）。
- 確かめたこと:
  - setup で止まる run（plan だけ）を再現するテストを足した。記帳の commit から外れ、commit 後の HEAD が `validateRunRecordLayoutAtCommit` を通る。result.md が拒否される場合も確かめた（`tests/src/exec/trailing-records.integration.test.ts`）。
  - commit の tree を検査するテストを足した（`tests/src/exec/validate-records-commit.integration.test.ts`）。plan だけの commit を報告すること、未 commit の run や空のディレクトリを無視すること、指定した revision を見ること、human の result、追跡済みの lock、存在しない revision の扱いを確かめる。
  - pre-push の入口の単体テストを足した（`tests/tools/check-run-record-layout-push.test.ts`）。
  - 実際の repository でも確かめた。`--commit 606535f7f`（`a9beaef99` の親で、plan だけの記録が入っていた commit）は、CI と同じ 2 件の missing で終了コード 1 になった。`--commit HEAD` は通った。`tools/check-run-record-layout-push.mjs --project prj-0001` に pre-push の入力を渡すと、前者で 1、後者で 0 を返した。

### 5.1. CHANGELOG に書く事項

- Added: `exec validate --records-only --commit <rev>` で、作業ツリーではなく指定した commit の tree の実行記録の配置を検査できる。
- Fixed: Schedule の run の記帳の commit は、`plan.md`・`result.md`・`evidence.json` がそろわない run（setup で止まり plan だけを残した run など）を commit せず、作業ツリーに残して標準エラーで知らせる。

### 5.2. 残課題

- `lefthook.yml` の `pre-push` への登録は、統合の後に orchestrator が feature ブランチで入れる（保護対象）。lefthook の文書（<https://lefthook.dev/configuration/use_stdin/>）によると、`use_stdin: true` のコマンドが複数あると標準入力は 1 つにしか渡らない。そこで別のコマンドを足さず、既存の `protect-main` の `run` で標準入力を一度読み、両方の入口へ渡す。

  ```yaml
  pre-push:
    commands:
      protect-main:
        run: input="$(cat)"; printf '%s\n' "$input" | node tools/protect-main-push.mjs && printf '%s\n' "$input" | node tools/check-run-record-layout-push.mjs --project prj-0001
        use_stdin: true
  ```

- register の run の `wait` commit にも plan と result が入る。evidence がない場合に配置の検査を通るか（plan・result がそろう世代の例外にあたるか）は確かめていない。pre-push の検査で気づける。

## 6. 関連ドキュメント

- [[prj-0001:pjr-dvnv-exec-commit-trailing-records]]
