---
specdojo:
  id: prj-0001:pjr-11ex-multi-user-integration-actor
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T04:11:05Z"
  due_on: "2026-12-31"
  completed_at: "2026-11-15T14:24:35Z"
  conclusion: 統合専用 actor は GitHub Actions 上の GitHub App とし、runner は exec・記帳の branch を push するだけにする（C）
  derived_from:
    - PJR-PQG3
  commit_type: docs
  commit_scope: standards
---

# PJR-11EX 複数人で develop を使うときの統合専用 actor の仕組みを決める

## 1. 確認事項

branch protection を入れたあと、exec の統合と register の記帳を develop へ push する統合専用 actor をどう用意するか（決まった 1 台の bot か、各自の runner に資格を持たせるか）を決める

## 2. 入力

- git-branching-standard は、複数人・複数 actor 運用で develop の branch protection、層 2 の Pull Request、統合専用 actor（exec の merge と register の記帳だけに bypass を許可）を必須としている（2026-11-03）
- 今は exec の統合と register の記帳が手元の develop に commit され、利用者が手で push している。branch protection を入れると人の push は拒否されるため、統合専用 actor の資格で push する仕組みが要る（2026-11-03）
- 運用上の注意として、同じ項目や schedule タスクを 2 人が流さないための調整（実行のロックはクローンごと）と、sch-milestones.yaml・tml-index.yaml・`dct-*.yaml`・CHANGELOG.md のような共有ファイルの衝突がある（2026-11-03）
- 利用者は、複数人の運用に移る前に決める question として起票することを選んだ（2026-11-03）

## 3. 背景

git-branching-standard は、複数人・複数 actor の運用で、project `develop` の branch protection と統合専用 actor を必須としている。統合専用 actor に bypass を許すのは、exec の merge と register の記帳（層 3）だけである。今は単独運用で、runner が手元の develop に merge・commit し、利用者が手で push している。この形のまま branch protection を入れると、人の push が拒否されて流れが止まる。

制約は次の 3 つ。

- 資格（token・鍵）は作業者の手元に置かない。手元にあると、人の層 2 の変更をその資格で push でき、bypass の範囲を守れない。
- 実行のロックはクローンごとなので、2 人が同じ項目やタスクを流すのを防げない。
- 共有ファイル（sch-milestones.yaml・tml-index.yaml・`dct-*.yaml`・CHANGELOG.md など）が衝突する。

## 4. 回答候補

| 候補 | 内容                                                                                                                                  | 利点                                                                                                                                                      | 懸念                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 決まった 1 台の実行機に bot の資格を置き、exec と記帳はすべてその機械で流す                                                           | 資格が 1 か所に閉じる。ロックが 1 か所になり、二重実行と衝突が起きにくい                                                                                  | 人は手元で exec や記帳ができず、対話型オーケストレーターの使い方が変わる。実行機が止まると全員が止まる。実行機の保守が要る                                               |
| B    | 各自の runner に統合専用 actor の資格を持たせ、手元から develop へ push する                                                          | 今の流れをほぼ変えずに移れる                                                                                                                              | 資格が全員の手元に散る。その資格で人の層 2 の変更も push でき、bypass の範囲を守れない。ロックと衝突の問題は残る                                                         |
| C    | runner は exec と記帳の branch を push するだけにし、GitHub Actions が GitHub App の資格で検査して develop へ `--no-ff` で merge する | 資格は GitHub の中だけにあり、手元に置かない。merge の前に許可リスト（層 3 のパスだけか）と必須の検査を機械で確かめられる。人の push は全面的に拒否できる | runner の統合を「手元で merge」から「branch を push して Actions を待つ」に変える実装が要る。記帳が非同期になり、ID の採番と共有ファイルの衝突の解き方を決める必要がある |

## 5. 回答・結論

C を採る（2026-11-15、利用者がお勧めのとおり承認）。

- 統合専用 actor は「GitHub Actions 上で動く GitHub App」とし、bypass を持つのはこの App だけにする。作業者の手元には develop へ push できる資格を置かない。
- runner は exec の成果を `exec/<project-id>-<task-id>` の branch として、記帳を記帳用の branch として push する。Actions はそれぞれの差分が層 3 の許可リスト（commit-target-allowlist と同じ考え方）に収まるかを検査し、通れば develop へ `--no-ff` で merge する。外れれば merge せず、層 2 の Pull Request へ回す。
- 二重実行は、claim のイベントを先に develop へ入れる（push が競合したら claim 失敗とみなす）ことで、クローンをまたいだロックの代わりにする。共有ファイルは Actions 側で直列に merge し、生成物は merge の後に Actions が作り直す。
- A は資格が閉じる点は良いが、対話で手元から流す SpecDojo の使い方と合わない。B は bypass の範囲を守れない。

後続の作業（runner の push 方式、Actions の workflow、App の権限設計、claim の競合検出）は、複数人の運用に移る準備として別の項目で起票する。単独運用の間は今の方式のままでよい。

## 6. 承認

| 項目     | 内容                     |
| -------- | ------------------------ |
| 回答者   | indie（利用者）          |
| 回答日   | 2026-11-15               |
| 承認方式 | commit                   |
| 証跡     | register close の commit |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 置き換えの記録

PJR-2TX0（2026-11-21、D）が、この決定（C: GitHub App の統合専用 actor）を置き換えた。`git-branching-standard` は PJR-SJC7 で 2TX0 の方式（register 専用ブランチ）へ改訂済みである。この項目の状態は変えない。

## 8. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0]]

- [[specdojo:git-branching-standard]]
- [[prj-0001:pjr-pqg3-sidebar-kata-menus]]
