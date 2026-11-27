---
specdojo:
  id: prj-0001:pjr-vky2-register-sync-branch-split-impl
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
  registered_at: "2026-11-27T10:11:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-EVWA
---

# PJR-VKY2 register_sync のブランチを sync/register と sync/exec-events に分ける

## 1. 概要

PJR-EVWA の決定に従い、register_sync の専用ブランチを project/`<id>`/sync/register と project/`<id>`/sync/exec-events の 2 本に分け、設定・コマンド・CI・hook を対応させる

## 2. 入力

- PJR-EVWA で D を採った（indie、2026-11-27）。名前は exec-events とし、exec は使わない
- 登録簿の個票とイベント（controls/project-register/）は sync/register、execution/exec/events/ は sync/exec-events に載せる
- 今の作りでは exec run --register は登録簿だけ、schedule の task の実行は exec の events だけを記帳する。両方へ書く場合の順番と片方が失敗したときの扱いはこの todo で決めて個票の対応結果に記録する
- 今の project/`<id>`/register からの移し替えは、実行中の run がない時に行う

## 3. 完了条件

- register_sync を有効にした project で、登録簿の個票とイベント（`controls/project-register/`）は `project/<id>/sync/register` に、`execution/exec/events/` は `project/<id>/sync/exec-events` に記帳して push する。
- 設定は `sync` を軸に、ブランチごとの置き場を書ける形にしている。キーの名前と、今の `register_sync` との互換の扱いは executor が決め、理由を個票の対応結果に書いている。
- push・merge・guard・check のコマンド、exec run の後の自動取り込み、CI（`.github/workflows/check-register-push.yml`）、lefthook の `register-branch-guard`、専用の worktree の置き場を、2 本に対応させている。
- 1 回の操作が両方のブランチへ書く場合の順番と、片方が失敗したときの扱いを決め、個票の対応結果に書いている。今の作りでは両方へ書く操作はない（`exec run --register` は登録簿だけ、schedule の task の実行は exec の events だけを記帳する）。
- 今の `project/<id>/register` から 2 本へ移し替える手順を、個票の対応結果と関係する guide（`docs/ja/specdojo/guides/`）に書いている。実際の移し替えは、実行中の run がないときにオーケストレーターが行う。
- 保護された設定（`.specdojo/`・`lefthook.yml`・`package.json` など）の変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書いている。反映は利用者の承認のもと feature ブランチで行う。
- `docs/ja/specdojo/references/command-reference.md` と設定リファレンスを、変えたコマンドと設定に合わせている。
- CHANGELOG の書き方は運用メモの決まりに従い、公開済みの版の節は変えていない。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通している。親の検証の `test-integration` が通っている。

## 4. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 設定 `sync`（`branches.register` / `branches.exec-events`）の追加と互換の扱いを決める | DEV  | done | `register_sync` は 1 本のまま動く互換として残す                                                                                                       |
| 2   | ブランチの解決・記帳・merge・guard・check・push を 2 本に対応させる                   | DEV  | done | `src/shared/register-branch.ts` ほか                                                                                                                  |
| 3   | exec run の後の自動取り込みと専用 worktree の置き場を 2 本に対応させる                | DEV  | done | 取り込みは register → exec-events の順。置き場は `specdojo/sync/<種類>/`                                                                              |
| 4   | 単体テストと統合テストを足す                                                          | DEV  | done | `tests/src/register/sync-branches.integration.test.ts` ほか                                                                                           |
| 5   | CI（`.github/workflows/check-register-push.yml`）を 2 本に対応させる                  | DEV  | open | executor から `.github/workflows/` へ書き込めないため、変更案を対応結果に書いた（再開の指示により完了条件はこの案で満たす）。反映は利用者の承認で行う |
| 6   | lefthook の `register-branch-guard` を 2 本に対応させる                               | DEV  | done | `lefthook.yml` の変更は不要（下記）                                                                                                                   |
| 7   | 両方へ書く場合の順番と失敗の扱い、移し替えの手順を決めて記録する                      | DEV  | done | 対応結果と登録簿運用ガイドに書いた                                                                                                                    |
| 8   | コマンドリファレンス・設定リファレンス・guide・Git ブランチ標準・設定の schema を直す | DEV  | done | -                                                                                                                                                     |
| 9   | `.specdojo/specdojo.config.json` を `sync` へ移し、2 本へ移し替える                   | DEV  | open | 保護された設定のため executor は変えない。実行中の run がないときにオーケストレーターが行う                                                           |

## 5. 対応結果

PJR-EVWA の決定（D）に従い、専用ブランチを `project/<id>/sync/register` と `project/<id>/sync/exec-events` の 2 本に分ける実装を入れた。prj-0001 の設定（`register_sync`）は変えていないため、移し替えるまでは今の `project/prj-0001/register` 1 本のまま動く。

### 5.1. 設定のキーと互換の扱い

- 新しいキー `projects.<id>.sync` を足した。形は `{ enabled, remote, branches: { register: { branch }, "exec-events": { branch } } }` で、`branches` とその中の種類は省略でき、既定は `project/<id>/sync/register` と `project/<id>/sync/exec-events`。種類ごとに object にしたのは、将来ブランチ名のほかの置き場の設定を足せるようにするためである。`branches` に書ける種類は `register` と `exec-events` だけで、2 つに同じブランチは書けない。
- `register_sync` は互換として残し、今までどおり 1 本（既定 `project/<id>/register`）に両方を載せる。`sync` と `register_sync` を同時に書くと設定の読み込みでエラーにする。
- 理由: `register_sync` を `sync` の別名にして読み替えると、この版へ上げた時点で記帳の先が新しい 2 本へ変わり、まだ無いブランチへの fetch で記帳が止まる。移し替えは実行中の run がないときに行う決まりのため、切り替えは設定を `sync` へ書き換えることで明示的に起こす形にした。`register_sync` も 0.10.0 で入った未公開のキーだが、prj-0001 が使っているため移し替えまで残す。

### 5.2. 2 本への対応

- 記帳: `register ... --commit`・外部 project からの起票・`exec run --register` の状態遷移と個票の転送は register のブランチへ、schedule の claim・complete などは exec-events のブランチへ書く。各ブランチは自分の範囲の外のパスを記帳前と push 前に拒む。
- merge（`register branch-merge` と exec run の前後の自動取り込み）: register → exec-events の順に 1 本ずつ `--no-ff` で取り込み、どちらかで止まれば後のブランチは取り込まない。出力はブランチごとに 1 行。どれかの専用ブランチ上では何もしない。
- guard（`register branch-guard`）: 両方の範囲のファイルの直接の変更を調べ、両方のブランチの ref を正とする。
- check（`register branch-check`）: `--remote-ref` が指すブランチの範囲で調べる。個票とイベントの形は register のブランチ（と `register_sync` の 1 本）だけで調べる。`--remote-ref` を省くと register のブランチとして調べる。
- push（`register branch-push`）: `--sync register|exec-events` で 1 本に絞れる。省くと register → exec-events の順に処理し、止まった時点で後へ進まない。復旧の案内のコマンドには `--sync <種類>` を付ける。
- 専用 worktree の置き場: `sync` では Git 共通ディレクトリの `specdojo/sync/<種類>/<識別子>/worktree`、`register_sync` では今の `specdojo/register/<識別子>/worktree`。ロックは今の 1 つを共有し、どのブランチへの同期も直列にする。
- lefthook: `register-branch-guard` の glob は既に `controls/project-register` と `execution/exec/events` の両方を含み、guard が 2 本を調べるため、`lefthook.yml` は変えなくてよい。pre-push の `tools/check-register-push.mjs` も更新ごとに `--remote-ref` を渡すため変えなくてよい。

### 5.3. 両方へ書く場合の順番と失敗の扱い

- 順番: register のブランチを先に、exec-events のブランチを後に、1 本ずつロックを取り直して commit・push する。片方の中でもう片方を書く入れ子にはしない（ロックは共有で入れ子にすると自分を待つため）。
- register のブランチで失敗したとき: exec-events のブランチへは書かずに止まる。
- register の push の後に exec-events で失敗したとき: register の記帳は公開済みのまま残し、取り消さない。exec-events の記帳は専用 worktree に残し、`specdojo register branch-push --project <id> --sync exec-events` で公開してから操作を再実行する。
- 今の作りでは両方へ書く操作はない（`exec run --register` は登録簿だけ、schedule の task の実行は exec の events だけ）。取り込み（merge）と `branch-push` は同じ順番と止まり方に揃えた。

### 5.4. 今の `project/<id>/register` から 2 本へ移し替える手順

登録簿運用ガイドの「専用ブランチを `register_sync` から `sync` へ移し替える」に書いた。要点は次のとおり。実際の移し替えはオーケストレーターが行う。

1. 実行中の run・queue・routine がないことを確かめ、止まった同期があれば `register branch-push` で公開する。
2. develop で `register branch-merge` を流して古いブランチを取り込み、リモートの develop へ入れる。
3. 取り込み済みの develop の先端から `project/prj-0001/sync/register` と `project/prj-0001/sync/exec-events` を作って push する。
4. `.specdojo/specdojo.config.json` の `"register_sync": { "enabled": true }` を `"sync": { "enabled": true }` に置き換え、feature ブランチで develop へ入れる。
5. `register branch-push --project prj-0001 --dry-run` で 2 本とも already on になることを確かめ、古い専用 worktree を外す。
6. 古いブランチは、ほかの利用者が揃うまで残してから消す。

### 5.5. 保護された設定の変更案

- `.github/workflows/check-register-push.yml`（executor から書き込めない）: `on.push.branches` に `"project/*/sync/register"` と `"project/*/sync/exec-events"` を足し、project の取り出しを `project="${project%/register}"` から `project="${project%%/*}"` に替える。どのブランチの範囲で調べるかは `--remote-ref "$GITHUB_REF"` から `branch-check` が決めるため、ほかは変えない。移し替えまでは `"project/*/register"` も残す。
- `.specdojo/specdojo.config.json`: 移し替えの手順の 4 で `register_sync` を `sync` に置き換える。
- `lefthook.yml`・`package.json`: 変更は要らない。

### 5.6. CHANGELOG に書く事項

- 区分: 追加。行の文案: 専用ブランチを種類ごとに分ける設定 `sync` を足しました。登録簿の記帳は `project/<project-id>/sync/register`、schedule の実行イベントは `project/<project-id>/sync/exec-events` へ載せ、`register branch-merge` は register、exec-events の順に取り込み、`register branch-guard`・`register branch-check` は各ブランチの範囲で調べます。`register branch-push` は `--sync <種類>` で 1 本に絞れます（PJR-EVWA、PJR-VKY2）。
- 区分: 移行の注意。行の文案: `register_sync` は 1 本のブランチにまとめる互換の形として残ります。`sync` と同時には書けません。`sync` へ移すときは、実行中の run がないときに登録簿運用ガイドの手順で新しいブランチを作ってから設定を書き換えてください（PJR-VKY2）。

### 5.7. 検証

- 単体テスト（関連の 4 ファイル）と統合テスト（`register-branch*`・新しい `sync-branches` の 4 ファイル、41 件）を手元で通した。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`test-integration` は親の runner が流す。
- 再開の後に、変更したファイルの Prettier の確認と `npm run validate:history-links` を通した。保護された設定（CI の workflow と `.specdojo/specdojo.config.json`）は、再開の指示に従い、変更案を書いたことで完了条件を満たすものとした。

## 6. 関連ドキュメント

- [[prj-0001:pjr-evwa-register-sync-branch-split|PJR-EVWA]]（根拠の決定）
- [[specdojo:register-operation-guide|登録簿運用ガイド]]（同期・移し替えの手順）
- [[specdojo:specdojo-config-reference|設定リファレンス]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[specdojo:git-branching-standard|Git ブランチ標準]]
