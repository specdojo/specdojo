---
specdojo:
  id: prj-0001:pjr-2tx0-register-branch-remote-ssot
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: PO
  registered_at: "2026-11-21T09:27:48Z"
  completed_at: "2026-11-21T09:44:22Z"
  conclusion: D を採る。register と schedule の実行のイベントを project/prj-0001/register に置いてリモートを正本とし、コードと文書は PR で develop へ入れる。runner は個票を register のブランチへ書き、register を develop へ一方向に merge する。PJR-11EX を置き換える
  derived_from:
    - PJR-11EX
---

# PJR-2TX0 複数人で開発するときに、register だけを専用のブランチで同期するか（PJR-11EX の見直し）

## 1. 背景

register を project/prj-0001/register のような専用のブランチに置いてリモートを正本とし、ほかの変更は GitHub Flow や git flow の PR で扱う方式（D）を、11EX の C（GitHub App が develop へ merge）と比べて決める

## 2. 入力

- 利用者の提案（2026-11-21）: 複数人で開発するときに同期したいのは register だけで、ほかは通常の GitHub Flow や git flow で対応できる。project/prj-0001/register のようなブランチを作り、register はリモートを正本とする運用でよいのではないか
- PJR-11EX の決定（2026-11-15、C）: 統合専用の actor を GitHub Actions 上の GitHub App とし、runner は exec と記帳のブランチを push するだけにする。後続の作業（runner の push 方式、Actions の workflow、App の権限、claim の競合の検出）は単独の運用の間は起票しないとした
- 2026-11-21 の例: coderdojo-lessons から `external_projects` で起票した 4 件（PJR-7KQT・FGKB・F6MC・QTZ7）が develop へ直接 push され、こちらでは run の統合とぶつからないよう specdojo git の merge で取り込んだ（index の書き込みで一度止まった）
- 決める点（orchestrator の整理）: 1) register に何を含めるか（個票とイベントだけか、schedule の claim・complete のイベント、run の記録、grade の結果まで含めるか） 2) runner が個票の状態の遷移と対応結果を書く先（今は exec のブランチで書いて develop に統合している） 3) develop から register をどう見るか（register のブランチを develop へ一方向に merge し続けるか、CLI が register のブランチから読むか。製品の文書の wikilink、文書サイトの build、exec plan が個票を読む） 4) register のブランチへの push の競合（ID は乱数でファイルは項目ごとのため衝突はほぼ無い。register ... --commit に pull --rebase と push のやり直しを組み込むか）と CI での形の検査

## 3. 検討した選択肢

方式の大枠。

| 選択肢 | 内容                                                                                                                                                                     | 利点                                                                                                                                                               | 懸念                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C      | PJR-11EX の決定。runner は exec と記帳のブランチを push し、GitHub Actions が GitHub App の資格で検査して develop へ `--no-ff` で merge する                             | develop を保護したまま、runner の自動の統合を続けられる。資格が GitHub の中だけにある                                                                              | GitHub App・Actions の workflow・許可リストの検査・claim の競合の検出を作る必要があり、準備が大きい。push のあと merge されるまで、ほかの人に記帳が見えない |
| D      | register を専用のブランチ（`project/prj-0001/register`）に置いてリモートを正本とし、各自が直接 push する。コードと文書の変更は feature ブランチと PR で develop へ入れる | 仕組みが小さく、GitHub の標準の保護と PR だけで develop を守れる。記帳はすぐにほかの人に見える。外部のプロジェクトからの起票も、このブランチへ push するだけで済む | runner と CLI が、個票を develop とは別のブランチに書く作りに変わる。exec の成果の自動の統合は、PR に置き換わる                                             |

D を採る場合に決める点と、点ごとの選択肢。

| 決める点                              | 選択肢                                                                                                                                                                                                                                                    | 利点                                                                                                      | 懸念                                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1. register のブランチに置くもの      | 1a: 登録簿の個票とイベント（`controls/project-register/`）だけ                                                                                                                                                                                            | 最も小さい                                                                                                | schedule のタスクの claim が develop 側に残り、二人が同じタスクを流すのを防げない                                 |
|                                       | 1b: 1a に、schedule の実行のイベント（`execution/exec/events/` の claim・complete など、約 8MB）を足す                                                                                                                                                    | claim がすぐ共有され、二重の実行を防げる。どちらも項目・イベントごとの小さなファイルで衝突しにくい        | schedule のイベントを書くコマンドも、register のブランチへ書く作りにする必要がある                                |
|                                       | 1c: 1b に、run の記録（約 107MB）と grade の結果（約 26MB）も足す                                                                                                                                                                                         | 記録がすべて 1 か所にそろう                                                                               | 大きく、run の記録は exec の成果（コード）と組で生まれるため、別のブランチに分けると対応が追いにくい              |
| 2. runner が個票を書く先              | 2a: runner が状態の遷移（start・review・waiting など）と対応結果を、register のブランチへ直接書いて push する。exec のブランチには個票の変更を含めない                                                                                                    | 個票の正本が 1 か所に保たれる                                                                             | agent が exec の worktree で書いた対応結果を、統合の段で register のブランチへ写す処理が要る                      |
|                                       | 2b: 今のまま exec のブランチで個票を書き、develop に入ったあと register のブランチへ反映する                                                                                                                                                              | runner を変える量が少ない                                                                                 | 個票の変更が 2 つの経路から入り、正本が 2 つになる。衝突しうる                                                    |
| 3. develop から register をどう見るか | 3a: register のブランチを develop へ一方向に merge し続ける（例: register へ push があるたびに Actions が develop へ merge、または runner と CLI が develop の作業の前に取り込む）。develop では register のファイルを直接変えない（hook と CI で止める） | 文書の wikilink・文書サイトの build・`exec plan` が今のまま動く                                           | merge の commit が develop に積もる。取り込みが遅れる間、develop の個票は少し古い                                 |
|                                       | 3b: develop には register のファイルを置かず、CLI が register のブランチ（別の worktree）から読む                                                                                                                                                         | develop が register の変更で動かない                                                                      | 文書サイトの build と wikilink の解決、`exec plan` などの読み取りを、すべて別の場所から読むように変える必要がある |
| 4. register のブランチへの push       | 4a: `register ... --commit` が push まで行い、non-fast-forward のときは `pull --rebase` して push し直す。CI は push のたびに記録の形と schema を検査し、register の範囲の外のファイルを含む commit を止める                                              | 衝突はほぼ起きず（ID は乱数でファイルは項目ごと）、起きても自動でやり直せる。範囲の外の変更が紛れ込まない | CLI に push とやり直しの処理が要る。資格は各自の手元の通常の push の資格になる                                    |
|                                       | 4b: commit は CLI、push は人が手で行う                                                                                                                                                                                                                    | CLI を変えずに済む                                                                                        | non-fast-forward の解消を人が毎回行う。push を忘れると共有されない                                                |

orchestrator の所見（決定ではない）: D を採り、1b・2a・3a・4a の組み合わせが、ご提案の「同期したいのは register だけ」という考えに最も近く、準備も C より小さい。単独の運用の間は今の方式のままでよく、D への移り方（register のブランチの作成、CLI と runner の対応、hook と CI）は、決めたあとに後続の項目として起票する。

## 4. 決定内容

D を、1b・2a・3a・4a の組み合わせで採る。PJR-11EX の決定（C）を置き換える。

- register を専用のブランチ（`project/prj-0001/register`）に置き、リモートを正本とする。コードと文書の変更は feature ブランチと PR で develop へ入れる。
- register のブランチには、登録簿の個票とイベント（`controls/project-register/`）と、schedule の実行のイベント（`execution/exec/events/`）を置く。run の記録と grade の結果は develop 側に残す（1b）。
- runner は、状態の遷移と対応結果を register のブランチへ直接書いて push する。exec のブランチには個票の変更を含めない（2a）。
- register のブランチを develop へ一方向に merge し続け、develop では register のファイルを直接変えない（3a）。
- `register ... --commit` が push まで行い、non-fast-forward のときは `pull --rebase` して push し直す。CI は push のたびに記録の形と schema を検査し、register の範囲の外のファイルを含む commit を止める（4a）。
- 単独の運用の間は今の方式のままでよい。移り方（ブランチの作成、CLI と runner の対応、hook と CI）は後続の項目として起票する。

## 5. 採択理由

- 複数人で同期が要るのは記帳と claim だけで、コードと文書の変更は GitHub の標準の保護と PR で守れる。
- C に要る GitHub App・Actions・許可リストの検査・claim の競合の検出より、準備が小さい。
- 記帳がすぐにほかの人に見え、外部のプロジェクトからの起票も register のブランチへ push するだけで済む（2026-11-21 の coderdojo-lessons からの起票の例）。
- ID が乱数でファイルが項目ごとのため、register のブランチでの衝突はほぼ起きず、起きても `pull --rebase` で自動で解ける。

## 6. 承認

| 項目     | 内容                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 決定者   | indie                                                                                                                    |
| 決定日   | 2026-11-21                                                                                                               |
| 承認方式 | commit                                                                                                                   |
| 証跡     | 2026-11-21 の対話で indie が orchestrator の推奨（D、1b・2a・3a・4a）を承認した。この個票の close の commit を証跡とする |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | git-branching-standard の 3 層の経路、register と schedule のイベントを書く CLI、runner の統合、hook と CI、外部のプロジェクトからの起票 |
| 必要な対応 | 複数人の運用へ移る前に、register のブランチの作成、CLI と runner の対応、git-branching-standard の改訂、hook と CI を後続の項目で行う    |
| 追跡先     | 後続の項目は複数人の運用へ移る準備として起票する。PJR-11EX はこの決定で置き換える                                                        |

## 8. 関連ドキュメント

- [[prj-0001:pjr-11ex-multi-user-integration-actor|PJR-11EX]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
