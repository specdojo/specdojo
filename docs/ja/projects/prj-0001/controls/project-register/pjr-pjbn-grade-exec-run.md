---
specdojo:
  id: prj-0001:pjr-pjbn-grade-exec-run
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T22:09:37Z"
  completed_at: "2026-10-09T11:37:54Z"
  conclusion: worktree 作成前の検査を checkpoint の対象との重なりに絞り、失敗時の reset を対象のパスに限った。runner の commit または hook が失敗したときにステージを残す 2 経路を特定し、対象だけを戻すように直した。
---

# PJR-PJBN 定期実行の grade がメインの作業ツリーにステージ済みのファイルを残し、exec run が止まる

## 1. 課題内容

cron の routine run --due で動く grade のジョブが evidence をメインの作業ツリーで git add したまま commit せずに終わる。その後の exec run --register は checkpoint で Root index has staged changes となり waiting になる（2026-10-09 の PJR-HQKV で発生）。routine の出力を commit するか、ステージしないか、exec 側の扱いを決める。

## 2. 影響範囲

| 観点         | 影響                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec-worktree-ops.ts` の worktree 作成前の検査と checkpoint の失敗時の処理、runner の commit の対象の選び方 |
| スケジュール | v0.3.0 の公開の判定基準 4 に関わる                                                                               |
| コスト       | 無関係のファイルがステージされているだけで、exec run が waiting になり、人の手で解除が要る                       |
| 品質         | 定期実行や人の作業と exec run が同じリポジトリで共存できない                                                     |
| 関係者       | 定期実行と exec を併用する利用者                                                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | worktree の作成前の検査が、メインの作業ツリーの index にステージ済みのファイルがあると無条件に失敗する。checkpoint の commit は worktree 側の index で対象のパスを限定して行うため、無関係のステージは影響しない。ステージした主は未確定（2026-10-09 の調べでは job runner は `git add` しておらず、同じ実行の 1 件目の PJR-TM1B の commit の前後でステージされた疑いがある） |
| 対応策   | 2026-10-09 に利用者が推奨案（検査を絞る＋ステージした主を突き止めて直す）を採用した。定期実行の出力の自動 commit は行わない。下記の「完了条件の詳細」のとおり                                                                                                                                                                                                                 |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                          |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                                                                                                                                              |

### 3.1. 完了条件の詳細

- worktree の作成前の検査は、メインの作業ツリーの index のステージ済みのファイルが checkpoint の対象のパスと重なる場合だけ失敗させる。重ならない場合は、ステージ済みのファイルの一覧を警告として出し、処理を続ける。
- checkpoint の commit が失敗したときの index の reset を、対象のパスに限る（`git reset --quiet -- <paths>`）。無関係のステージ済みのファイルを消さない。
- runner がメインの作業ツリーで、自分の commit の対象外のファイルをステージしたまま残す経路を調べる。少なくとも次を確かめる。
  - `commitRegisterItemChanges` の開始前のスナップショット（preexisting）と、後の `git status` の結果で、未追跡のディレクトリの表し方（ディレクトリのまとまりか、ファイルごとか）が食い違い、実行前からあったファイルを対象に含めないか。
  - `stageCommitTargets` の後に commit が行われない、または失敗する経路で、ステージを戻しているか。
  - 経路を特定できたら直し、unit test で固定する。特定できない場合は、調べた範囲・再現の手順・疑わしい箇所を本個票の対応結果へ残す。
- unit test で、次のそれぞれを確かめる。
  - 無関係のステージ済みのファイルがあっても止まらない。
  - 対象のパスと重なる場合は止まる。
  - checkpoint の失敗後も、無関係のステージ済みのファイルが index に残る。
- 定期実行の出力を自動で commit する変更は行わない。
- exec-operation-guide の該当する説明（ステージ済みのファイルがあると止まる旨があれば）と、CHANGELOG の v0.3.0 の不具合修正に追記する。
- `npm run check` が通る。

## 4. 対応結果

- worktree 作成前の root index 検査を checkpoint 対象パスとの重複検査へ変更した。無関係な staged パスは警告へ列挙して保持し、対象の plan、result、event、登録簿記帳と重なる staged パスだけをエラーにする。
- checkpoint commit の失敗時に行っていた index 全体の reset を、checkpoint 対象だけの `git reset --quiet -- <paths>` へ変更した。
- runner が staged 変更を残す経路を調査し、`commitRegisterItemChanges` と register 状態 commit が `stageCommitTargets` の後の commit または hook 失敗時に unstage していない経路を特定した。両経路を例外時の対象限定 unstage で修正し、既存の無関係な staged 変更を保持するようにした。
- 開始前と実行後の未追跡パスは、`git status --porcelain=v1 -z --untracked-files=all` により双方ともファイル単位で取得されていた。未追跡ディレクトリ内で実行中に増えたファイルだけが commit 対象になる統合テストを追加し、この前提を固定した。
- 無関係な staged パスを保持した checkpoint 成功、checkpoint 対象との重複拒否、checkpoint commit 失敗後の対象限定 unstage、register commit 失敗後の既存 staged 変更保持を自動テストへ追加した。
- 定期実行の出力を自動 commit する変更は行っていない。運用説明は [[specdojo:exec-operation-guide|exec運用ガイド]] と [[specdojo:exec-worktree-guide|exec worktree運用ガイド]]、利用者向け変更履歴は `CHANGELOG.md` の v0.3.0 不具合修正へ反映した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
