---
specdojo:
  id: prj-0001:pjr-6998-kata-sample-catalog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-11-18T11:59:09Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-WYTX
---

# PJR-6998 型の見直しを schedule で漏れなく行うため、sample を成果物としてカタログに載せるか決める

## 1. 背景

rulebook の整備を schedule に載せる単位を、製品の成果物から sample の成果物へ変えるかを決める。kata-slim-3 の作成の前に決める

## 2. 入力

- 利用者の提案（2026-11-18）: specdojo の仕様書などの成果物がない型はカタログに載らず schedule で rulebook を整備できない。sample を成果物にしてカタログに載せれば、schedule で rulebook の整備などを漏れなくできるのではないか
- orchestrator の調べ（2026-11-18）: rulebook 112 件のうち 105 件が sample を持ち、not-needed が 4 件、undecided が 1 件、未記入が 2 件。非推奨は 6 件
- orchestrator の調べ（2026-11-18）: kata-slim-2 は製品の成果物から型ごとに担当の成果物を選び、型のための仮の成果物（kata-only）をカタログに足した。それでも記法の rulebook・非推奨の型・dec・ntp・ifx-api・ifx-msg・recipe の exec-human-finalize の 14 件が対象から漏れた
- orchestrator の調べ（2026-11-18）: カタログには /.github/instructions/typescript.instructions.md を絶対パスで載せた前例がある。sample の ID（specdojo:`<name>-sample`）とカタログの成果物の ID（prj-0001:`<local_id>`）が食い違うかは未確認

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                                                                                                                                                                          | 利点                                                                                                                                  | 懸念                                                                                                                                                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A      | 型の見直し専用のドメイン（例: `dct-kata.yaml`）を足し、sample を `kind: work` の成果物として載せる（`path` に `/docs/ja/specdojo/samples/<name>-sample.md`、`rulebook` に対応の rulebook）。型の見直しの track はこのドメインだけを対象にする | 型ごとに 1 件の成果物になり、漏れは sample の有無だけで決まる。製品の成果物から担当を選ぶ手間と、kata-only の仮の成果物が要らなくなる | sample は配る型で prj-0001 の成果物ではないものが同じカタログに混ざる。105 件の `done_criteria` を書く量が多い。sample のない型（not-needed 4・undecided 1・未記入 2）と記法の rulebook は別の扱いが要る。sample の ID と成果物の ID の対応は未確認 |
| B      | 今のまま、製品の成果物から型ごとに担当の成果物を選び、足りない型だけ kata-only の仮の成果物で足す                                                                                                                                             | CLI とカタログの仕組みを変えずに済む。型を実物の成果物で照合できる                                                                    | kata-slim-2 では 14 件が漏れた。track を作るたびに担当の成果物を選び直す手間がかかる                                                                                                                                                                |
| C      | カタログを通さず、strategy が rulebook の一覧（sample・recipe・template の宣言を含む）から型の見直しのタスクを作る仕組みを CLI に足す                                                                                                         | カタログに型のための項目を混ぜずに済む。漏れは rulebook の一覧で決まり、sample のない型も対象にできる                                 | CLI の改修が要る。成果物ごとの `done_criteria` の持ち場がなく、完了の判定の書き方を別に決める必要がある                                                                                                                                             |

orchestrator の所見（決定ではない）: 漏れをなくす目的には A と C が合う。A は今の仕組みのまま試せるため、kata-slim-3 の前に決めるなら A を一部のドメインで試し、sample の ID と成果物の ID の対応を確かめてから広げるのが進めやすい。C は A で足りない点（sample のない型）が残る場合の次の手になる。

## 4. 決定内容

案 A を採る。

- カタログに `kata` ドメイン（`dct-kata.yaml`、`base_path: /docs/ja/specdojo`、グループ `samples`）を足し、各 sample を `kind: work` の成果物として載せる。`rulebook` に対応の型、`local_id` に `<name>-sample` を入れる。
- 型の見直しの track（第 3〜5 波と kata-slim-3）は `kata` ドメインだけを対象にし、代表の文書は sample そのもの（駄菓子屋の共通の文脈）とする。
- `done_criteria` は、型に共通の条件（rulebook の章立てに沿う、sample の作成標準に沿う、共通の文脈を使う）を基本にし、型に固有の条件だけを足す。
- sample のない型: opd・opr の sample は第 5 波で作る。sysd は第 1 波の残りで決める。記法の 2 件（cdfd-d2・cdfd-mermaid）は対象外、pjr・sch は PJR-CPA8 で扱う。非推奨の型は対象外。
- 第 1・2 波などで製品の成果物を代表にした型は、そのままにし、移し替えない。
- epic は新しく起票せず、今ある第 3 波（PJR-ABY4）・第 4 波（PJR-HJ3H）・第 5 波（PJR-JZ2F）の epic を、`kata` ドメインを対象にする track として進める。

## 5. 採択理由

- 漏れが sample の有無だけで決まり、製品の成果物から担当を選ぶ手間と、kata-only の仮の成果物が要らなくなる。
- 第 3〜5 波の型は prj-0001 に代表の文書がなく、とくに運用・移行は SpecDojo に実物がない。sample を代表にすれば、この問題が解ける。
- 2026-11-21 に試しの worktree で、`dct-kata.yaml` に sample 2 件を載せ、`catalog validate`・`catalog build`・`index build`・`exec plan --deliverable` が通ることを確かめた。plan と索引は sample の frontmatter の ID（`specdojo:<name>-sample`）を使い、カタログの成果物の ID とは食い違わない。
- 波ごとに track を分けると、1 つの track が 100 タスク前後に収まり、2026-11-16 に承認した順番（試験 → 非機能要件と受け入れ条件 → 運用・移行・影響分析）も保てる。

## 6. 承認

| 項目     | 内容                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 決定者   | indie                                                                                                                                      |
| 決定日   | 2026-11-21                                                                                                                                 |
| 承認方式 | commit                                                                                                                                     |
| 証跡     | 2026-11-21 の対話で indie が orchestrator の推奨（案 A、epic は今ある波の epic を使う）を承認した。この個票の close の commit を証跡とする |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 成果物カタログ（`kata` ドメインの追加）、第 3〜5 波と kata-slim-3 の strategy・schedule                                                                       |
| 必要な対応 | 第 3 波の最初の子の todo で `dct-kata.yaml` を作り、試験の型の sample を載せて strategy と schedule を作る。以後の波と kata-slim-3 で同じドメインに足していく |
| 追跡先     | PJR-ABY4（第 3 波）、PJR-HJ3H（第 4 波）、PJR-JZ2F（第 5 波）、PJR-WYTX（kata-slim-3）                                                                        |

## 8. 関連ドキュメント

- [[prj-0001:pjr-wytx-kata-slim-sample-template|PJR-WYTX]]
- [[prj-0001:pjr-aby4-kata-wave-3|PJR-ABY4]]
- [[prj-0001:pjr-hj3h-kata-wave-4|PJR-HJ3H]]
- [[prj-0001:pjr-jz2f-kata-wave-5|PJR-JZ2F]]
