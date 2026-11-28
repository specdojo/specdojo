---
specdojo:
  id: prj-0001:pjr-vm2s-register-branch-migration-trial
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
  registered_at: "2026-11-23T00:21:57Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-4VD6
    - PJR-1JF6
    - PJR-FBP0
  commit_type: docs
  commit_scope: register
---

# PJR-VM2S register のブランチへ移る手順を書いて試す

## 1. 概要

prj-0001 と external_projects で起票している別のプロジェクトで、register のブランチへ移る手順を試し、既定に切り替える判断の条件を決める

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- prj-0001 で register のブランチへ移る手順を書く。ブランチの作成、今の記録（個票・イベント・schedule の実行のイベント）の移し方、設定の切り替え、戻し方を含める。
- 手順に沿って、prj-0001 と別のプロジェクト（`external_projects` で specdojo へ起票しているもの）で試す。試しの期間と、問題がなければ既定に切り替える判断の条件を個票の対応結果に書く。
- 試しで見つかった問題は、元の項目を `--from` にして起票する案として個票の対応結果に書く。
- 保護された設定や `specdojo.config.json` の切り替えは、利用者の承認のもとで orchestrator が行う。executor は案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                                      | 担当 | 状態 | メモ                                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 実装（`register_sync`・`branch-merge`・`branch-guard`・`branch-check`）と運用ガイドを読み、移行手順を書く | DEV  | done | 手順は対応結果の「移行手順」                                                                                                                                  |
| 2   | 試しの期間と既定に切り替える条件を決める                                                                  | DEV  | done | 対応結果の「試しの計画と切り替えの条件」                                                                                                                      |
| 3   | 試し                                                                                                      | DEV  | open | 実際の切り替えと push は保護された設定の変更と git の状態変更を伴い、executor の sandbox では行えない。利用者の承認のもとで orchestrator が手順どおり実施する |
| 4   | 問題の起票案と CHANGELOG の文案を書く                                                                     | DEV  | done | 対応結果に記載                                                                                                                                                |

## 5. 対応結果

### 5.1. 移行手順

対象は `register_sync` を持つ project（prj-0001）と、`external_projects` で specdojo へ起票する別のプロジェクト。コマンドと動作の正本は [[specdojo:register-operation-guide|register 運用ガイド]] の「専用ブランチへの同期（v0.10.0）」とし、ここには試しで踏む順序だけを書く。

1. 事前確認。
   - 対象の project で register の `--commit` が実行中でなく、個票・`execution/exec/events/` に未 commit の変更がないこと。
   - `exec run --register` や schedule の run が動いていないこと（動いていると記帳先が途中で切り替わる）。
   - 呼び出し元の specdojo が v0.10.0 以上であること。`external_projects` の相手側も v0.10.0 以上へ更新し、`npm install` と `npm run build` を済ませる。
2. ブランチの作成。develop 側で今の記録を含む commit から作り、リモートへ push する。

   ```bash
   git branch project/prj-0001/register project/prj-0001/develop
   git push origin project/prj-0001/register
   ```

3. 今の記録の移し方。個票（`controls/project-register/`）と schedule の実行のイベント（`execution/exec/events/`）は、手順 2 でブランチの起点にした develop の内容がそのまま register のブランチの初期の内容になる。ファイルの移動や複製は要らない。run の記録と grade の結果は移さず、develop 側に残す（PJR-2TX0 の 1b）。
4. 設定の切り替え。`specdojo.config.json` の `projects.<project-id>.register_sync` を次のとおり有効にする。ブランチ名・リモートは既定値と同じ場合は省略できる。この変更は保護された設定の変更として利用者の承認のもとで行い、develop へ PR で入れる。

   ```json
   {
     "projects": {
       "prj-0001": {
         "register_sync": {
           "enabled": true,
           "branch": "project/prj-0001/register",
           "remote": "origin"
         }
       }
     }
   }
   ```

5. 切り替え直後の確認。
   - `specdojo register add ... --commit` で試験の項目を 1 件起票し、register のブランチへ push されたこと、develop の作業ツリーに個票が直接増えていないことを確認する。
   - `specdojo register branch-merge --project prj-0001` を実行し、develop 側へ `--no-ff` で取り込まれることを確認する。
   - schedule の claim・complete が同じブランチの `execution/exec/events/` へ書かれることを確認する。
   - `specdojo register branch-guard --project prj-0001 --staged` と `--range <base>..<head>` が、develop での個票の直接変更を止めることを確認する。
   - `register branch-check --project prj-0001 --commit <sha> --base <push 前の sha> --remote-ref refs/heads/project/prj-0001/register` が通ること、範囲外のファイルを含む commit を止めることを確認する。
6. 別のプロジェクトからの起票。別のプロジェクトで `external_projects` の別名を使い `register add --project <別名> ... --commit` を実行し、起票がこちらの register のブランチへ入ること、同じ `branch-check` を通ることを確認する。
7. 戻し方。
   - 先に `exec run --register` と schedule の run を止める。
   - `specdojo register branch-merge --project prj-0001` で register のブランチの最新を develop へ取り込み、PR で入れる。個票とイベントが develop で最新になったことを `git diff` で確かめる。
   - `register_sync.enabled` を `false`（または項目を削除）にして PR で入れる。以後の記帳は元の integration branch の経路へ戻る。
   - register のブランチは削除せず残す。再度有効にするときは、`branch-merge` の後に、develop の最新から作り直すか、develop を register のブランチへ merge して差を無くす。
   - 失敗して未公開の記帳が残った場合は、運用ガイドの復旧手順（rebase・commit・`pull --rebase` と push）に従い、記帳済みファイルを削除しない。

### 5.2. 試しの計画と切り替えの条件

- 試しの期間は、承認後の 2026-11-25 から 2026-11-30（due）までの約 6 日間とする。v0.10.0 の公開に間に合わせるため短くし、prj-0001 の通常の日の作業（起票・`exec run --register`・schedule の claim・close・develop への取り込み）を一巡させる。
- 対象は prj-0001 と、`external_projects` で specdojo へ起票している別のプロジェクト 1 つ（利用者の個人運用の中から選ぶ）。
- 既定へ切り替える条件は、期間中に次をすべて満たすこと。
  - register の `--commit`、`exec run --register` の start・review・close、schedule の claim・complete が、すべて register のブランチへ書かれて push される。
  - 別のプロジェクトからの起票が 1 件以上、同じブランチに入り、`branch-check` を通る。
  - `branch-merge` を 1 回以上流し、develop と文書サイトの build（wikilink の解決）と `exec plan` が今のまま動く。
  - `branch-guard` が直接変更を止め、`branch-check` が範囲外の commit を止める。
  - 記帳の失敗（push の失敗・復旧が要る停止）が起きた場合は、運用ガイドの手順だけで復旧でき、記帳が失われていない。
  - 重大度が高い問題（記帳の欠落・二重の claim・develop のファイルの破損）が未解決で残っていない。
- 切り替えの判断は利用者（PO）が行う。条件を満たしたら、`projects` の `register_sync.enabled` を既定にする案（新しい project の既定値を `true` にする変更と、運用ガイドの「専用ブランチへの同期」の位置づけを任意から標準へ改める変更）を別項目として起票する。条件を満たさない間は任意（opt-in）のままとする。

### 5.3. 迷った点と決めた内容

- 試しの実施: executor は、git の状態変更（ブランチ作成・push）と保護された設定の変更を行えないため、手順の作成と条件の決定までを行い、実際の試しは作業内容の行 3 を `open` で残した。実施は利用者の承認のもとで orchestrator が行う。
- 切り替えの方式: 移行後に既存の個票とイベントは移さず、ブランチの起点の commit で引き継ぐと決めた。移すと二重の正本ができるため。
- 戻した後の再有効化: register のブランチを残す。履歴を失わないため。

### 5.4. 試しで見つかった問題の起票案

実際の試しの前に、読解で見つかった点を起票案として残す。試しで問題が見つかった場合は同じ形で追記し、元の項目を `--from` にして起票する。

- 案 1: `branch-guard` が lefthook の pre-commit・pre-push と CI に組み込まれていない（`branch-check` だけが `tools/check-register-push.mjs` と `.github/workflows/check-register-push.yml` にある）。develop での個票の直接変更を止められないため、切り替え前に設定する。`lefthook.yml` と `.github/` は保護された設定のため、変更案としてのみ書く。起票の例は `specdojo register add --type todo --from prj-0001:PJR-VM2S --topic register-branch-guard-hook ... --commit`。
- 案 2: 戻し方で register のブランチを再度有効にするときの再同期の手順が、運用ガイドに無い。手順 7 の内容を運用ガイドへ移す案。

### 5.5. 保護された設定の変更案

- `specdojo.config.json` の `projects.prj-0001.register_sync` を追加する（5.1 の手順 4）。利用者の承認のもとで orchestrator が行う。
- `lefthook.yml` に `register branch-guard --staged`（pre-commit）と `--range`（pre-push）、`.github/workflows/` に同じ `--range` の検査を足す（5.4 の案 1）。

### 5.6. CHANGELOG に書く事項

- なし。この項目は手順と判断の条件を個票に書くもので、製品の挙動を変えない。切り替えを既定にした時点で、その項目が区分「Changed」に「register を専用ブランチで同期する運用を標準にした」旨を書く。

### 5.7. prj-0001 での試し（オーケストレーター、2026-11-28）

手順の後に PJR-VKY2 で同期のブランチを `project/prj-0001/sync/register` と `project/prj-0001/sync/exec-events` の 2 本に分けたため、prj-0001 では 2 本の形で移し替えた。

| 段             | 行ったこと                                                                                               | 確かめたこと                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 取り込み       | `register branch-merge`                                                                                  | 旧 `project/prj-0001/register` は develop に取り込み済みだった                                                                                 |
| 設定の切り替え | `register_sync` を `sync` に書き換えて develop に merge（`8539d4d9a3`）し、利用者が develop を push した | 設定の読み込みと `register branch-push --dry-run` が通った                                                                                     |
| ブランチの作成 | `register branch-push` で 2 本を develop の先端（`7865b1fe9a`）から作った                                | `--dry-run` で 2 本とも remote にあることを確かめた。旧 register の worktree を外し、旧ブランチは残した                                        |
| 記帳           | `register ... --commit`、`exec run --register`、PJR-JSEY の smoke                                        | 記帳が `sync/register` に push され、`branch-merge` と run の前後の自動取り込みで develop に入った。コンテナの再起動の後も記帳が失われなかった |

- schedule の claim・complete が `sync/exec-events` に入ることは、まだ確かめていない（PJR-VKY2 で確かめる）。
- 別のプロジェクト（`external_projects`）からの起票は、sync への移し替えの後にまだ行っていない。次に実際に起票するときに確かめ、その後に close を判断する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0]]
- [[prj-0001:pjr-n5j8-register-commit-to-register-branch|PJR-N5J8]]
- [[prj-0001:pjr-4vd6-runner-transitions-to-register-branch|PJR-4VD6]]
- [[prj-0001:pjr-1jf6-register-branch-merge-into-develop|PJR-1JF6]]
- [[prj-0001:pjr-fbp0-register-branch-push-checks|PJR-FBP0]]
- [[specdojo:register-operation-guide|register 運用ガイド]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
