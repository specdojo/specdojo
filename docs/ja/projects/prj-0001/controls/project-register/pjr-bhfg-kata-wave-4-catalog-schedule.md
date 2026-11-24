---
specdojo:
  id: prj-0001:pjr-bhfg-kata-wave-4-catalog-schedule
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T01:46:11Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T03:53:58Z"
  conclusion: 第 4〜6 波の sample 65 件を dct-kata.yaml に足し、5 つの strategy と track を作った（262 タスク）。型ごとの段の鎖は参照のある所だけでつなぎ、人の確定は入れず、型の grade は review の段で runner が行う。漏れた 9 種類は第 5・6 波に割り振った
  derived_from:
    - PJR-HJ3H
    - PJR-JZ2F
    - PJR-G1M8
    - PJR-SBGQ
    - PJR-PYS2
    - PJR-8X86
  commit_type: chore
  commit_scope: schedule
---

# PJR-BHFG 第 4〜6 波の kata ドメインと strategy・schedule をまとめて用意する

## 1. 概要

第 4〜6 波の型の sample を dct-kata.yaml に足し、波ごとの strategy と track を作る。型ごとの段の鎖を並べて流せるようにし、人の確定は横串の確認に回す

## 2. 入力

- PJR-8X86 の観測（2026-11-23）: 2026-11-21 の型の grade のし直しで pass でなかった文書のうち 69 文書が手付かずで、第 4〜6 波には strategy と track がない。第 4 波 → 第 5 波 → 第 6 波の順に進める（利用者の依頼、2026-11-23）

## 3. 完了条件

- 第 4〜6 波（PJR-HJ3H・PJR-JZ2F・PJR-G1M8・PJR-SBGQ・PJR-PYS2）の型の sample を、`dct-kata.yaml`（PJR-VCER で作った kata ドメイン）に成果物として足し、波ごとに strategy を作って track を生成する（`sch-strategy-kata-wave-4.yaml`・`-wave-5`・`-wave-6-project`・`-wave-6-design`・`-wave-6-notation`）。track は手で編集しない。5 件の todo をこの項目にまとめた（PJR-52MP・PJR-SEF2・PJR-AXNG・PJR-0TDG は取り下げ、利用者の決定、2026-11-23、indie）。
- 対象の型は各 epic の入力の一覧のとおり。sample のない型は、作るか対象から外すかを個票の対応結果に書く。PJR-8X86 にある「どの epic の一覧にも名前がない手付かずの型」（cnd・dct・dmd・opd・otp・pm-change-request-log・pm-issue-log・pm-risk-register・stsd）を、どの波に入れるか（または入れないか）を決め、理由を個票の対応結果に書く。
- 並べて流せる組み方にする（利用者の決定、2026-11-23）。第 3 波は `dct-kata.yaml` の `depends_on`（例: `utc-index-sample` → `tsp-index-sample`）で型が一列につながり、1 種類ずつ順に流れて遅かった。`depends_on` は sample が本文で実際に参照する関係だけにし、型ごとの段の鎖（rulebook を簡潔に → sample を厚く → condense → review）が互いに待たずに並べて流れるようにする。足した `depends_on` の一覧と理由を個票の対応結果に書く。
- 段は rulebook を簡潔に → sample を厚く → condense → 型の grade（rulebook と sample の組） → review とする。人の確定（finalize の段）は各波の track に入れない。人の確定は、sample がひととおりそろった後の横串の確認でまとめて行う（利用者の決定、2026-11-23）。recipe・template のある型は、rulebook に合わせて recipe・template を直す段を足す。
- 段の説明に、PJR-76N9 の決まり（成果物と sample の本文に文書の役割の割り当てと承認の進み具合を書かない。RACI・体制など文書の中身として役割を扱う型は対象外）を最初から入れる（PJR-325Y で第 3 波に足した書き方にそろえる）。
- 段ごとの agent は strategy の `phase_overrides[].agent` で決める。rulebook を簡潔にする段と sample を厚くする段は `opus-executor`、condense の段は `sonnet-executor`、review の段は `sonnet-review-executor`（2026-11-24 からは `sol-review-executor` も使える）、reporter は `gemma26-reporter` とする（利用者の決定、2026-11-23）。
- 代表は sample（駄菓子屋の共通の文脈）とする（PJR-6998）。性能や可用性の目標、移行の対象など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残すよう段の説明に書く。決める必要のある値の一覧を個票の対応結果に書く。
- prj-charter（PJR-SV9G など）と ifx-api・ifx-msg（PJR-AEKE）は直し済みのため、段を軽くするか対象から外すかを決め、理由を個票の対応結果に書く。
- この項目では schedule のタスクを実行しない。
- `npm run validate:schema`（strategy と track の YAML の `task_suffix` などの文字列が数値に変わっていないことを含む）・`npx specdojo catalog validate`・`npx specdojo exec validate`・`npm run lint:md` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。

## 4. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                      |
| --- | -------------------------------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | 対象の型と sample の有無、grade の結果を洗い出す               | BA   | done | 対応結果の「対象の型の決め方」            |
| 2   | `dct-kata.yaml` に第 4〜6 波の sample 65 件を足す              | BA   | done | `catalog validate` が通る                 |
| 3   | 波ごとの strategy 5 件を作り、`schedule build` で track を作る | BA   | done | 計 269 タスク。track は手で編集していない |
| 4   | plan の dry-run で段の対象と手本を確かめる                     | BA   | done | 対応結果の「plan の dry-run の結果」      |
| 5   | schedule のタスクを流す                                        | -    | open | 完了条件によりこの項目では実行しない      |

## 5. 対応結果

### 5.1. 実施内容

- `dct-kata.yaml` に第 4〜6 波の sample 65 件を `kind: work` で足した。`done_criteria` は第 3 波と同じ共通の 3 条件に、grade の結果の blocker・major の指摘から拾った型に固有の条件を 0〜2 件足した。承認者や判断者を足すよう求める指摘は、PJR-76N9 の決まりに当たるため条件に入れなかった。
- strategy を 5 件作り、`schedule build` で track を作った。`kata-wave-4`（44 タスク）・`kata-wave-5`（80）・`kata-wave-6-project`（61）・`kata-wave-6-design`（64）・`kata-wave-6-notation`（20）。`sch-milestones.yaml` は値が変わっていない。
- 段は 040 rulebook を簡潔に → 045 recipe → 050 sample を厚く → 060 template → 080 condense → 090 review とした。recipe・template の段は、rulebook が実在の recipe・template を宣言する型だけに置いた。finalize の段と `phase_gates`・`group_milestones` は置いていない。
- agent は `phase_overrides[].agent` で、040・045・050・060 を `opus-executor`、080 を `sonnet-executor`、090 を `sonnet-review-executor`、reporter をすべて `gemma26-reporter` にした。
- 編集の段の説明に PJR-76N9 の決まり（PJR-325Y の第 3 波と同じ書き方）と、利用者が決める値を `_UNDECIDED_` で残すことを書いた。pass の型は理由のある箇所だけを直すことも書いた。

### 5.2. 対象の型の決め方

| 波                      | 対象の sample                                                                                                                                                                                                                    | 外した型と理由                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 第 4 波                 | nfr-index・nfr の 8 種類・sac・trc-requirements-to-specs（11 件）                                                                                                                                                                | なし                                                                                                                                                         |
| 第 5 波                 | opd-index・opd の 3 件・opr-index・opr と 7 件・otp-index・otp・cop-index・cop・mip-index・dmd-index・dmd・mtp・imp-data（22 件）                                                                                                | ntp は非推奨（PJR-HVQZ）。opd-sample は opd-rulebook が宣言していない古い最小版で、opd-index-sample と役割が重なる                                           |
| 第 6 波（プロジェクト） | prj-overview・prj-scope・prj-issues-and-approach・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members・pm-change-request-log・pm-issue-log・pm-risk-register・dct（11 件） | prj-charter は直し済み（rulebook 90・sample 96）。カタログには載せ、track には入れない                                                                       |
| 第 6 波（設計と業務）   | bps・cdr・dss・gl・mm・pr・uis・tsd・tsd-index・imp-business・imp-interface・imp-operations・cdfd・cdfd-overview（14 件）                                                                                                        | ifx-api・ifx-msg は PJR-AEKE の後の grade で 4 文書とも pass（91〜95）。カタログには載せ、track には入れない。sysd は sample が undecided で成果物にできない |
| 第 6 波（記法）         | cxd・cnd・cpd・stsd（4 件）                                                                                                                                                                                                      | 記法の rulebook は sample を持たないため、親の型の sample の rulebook の段で `includes` から直す                                                             |

- どの epic の一覧にも名前がない型の割り振り: dmd・opd・otp は PJR-JZ2F の範囲にすでに入っているので第 5 波とした。pm-change-request-log・pm-issue-log・pm-risk-register・dct はプロジェクト管理の型なので第 6 波（プロジェクト）に入れた。cnd・stsd は記法の rulebook（cnd-mermaid・stsd-mermaid）を `includes` で取り込む親の型なので第 6 波（記法）に入れた。
- sample のない型: pm-members は sample（YAML）があるため対象にした。cdfd-mermaid・cdfd-d2 は sample が not-needed なので成果物を持たず、cdfd・cdfd-overview の rulebook の段で直す。sysd は sample を作らず対象から外した（sysd-index など 3 件の sample はどれも pass 97〜100）。
- cpd・cxd は親の rulebook が直し済み（pass 100・97）なので、記法の rulebook と sample の段だけにし、recipe・template の段を置かなかった。

### 5.3. 足した `depends_on` と理由

`depends_on` は sample が本文で参照する関係と、同じ rulebook を直す代表の sample を待つ関係だけにした。依存先の condense（080）の後に、依存元の最初の段が始まる。ほかの型の鎖は互いに待たない。

| 依存元                                                                     | 依存先                                         | 理由                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| opd-access-control                                                         | opd-index                                      | 本文で opd-index の差分として書く                             |
| opd-incident-management・opd-monitoring                                    | opd-index・opd-access-control                  | 本文で opd-index を参照する。opd-rulebook を直す代表を待つ    |
| opr-index                                                                  | opd-index                                      | 本文で opd-index を参照する                                   |
| opr-access-control・opr-backup-restore・opr-batch・opr-change・opr-support | opd-index・opr                                 | 本文で opd-index を参照する。opr-rulebook を直す代表を待つ    |
| opr-incident・opr-monitoring                                               | opr-index・opr                                 | 本文で opr-index を参照する。opr-rulebook を直す代表を待つ    |
| otp-index・dmd-index                                                       | mip-index                                      | 本文で移行計画の上位として mip-index を参照する               |
| otp                                                                        | otp-index                                      | 本文で otp-index を SSOT として参照する                       |
| dmd                                                                        | dmd-index                                      | 本文で dmd-index を入口として参照する                         |
| prj-scope・prj-stakeholder-register                                        | prj-overview                                   | 本文で参照する                                                |
| prj-issues-and-approach・prj-success-criteria-and-acceptance-criteria      | prj-overview・prj-scope                        | 本文で参照する                                                |
| pm-communication-plan                                                      | prj-stakeholder-register と pm の 3 種類のログ | 本文で参照する                                                |
| dss                                                                        | uis                                            | 本文で参照する                                                |
| tsd・cdr                                                                   | tsd-index                                      | 本文で参照する                                                |
| cdfd                                                                       | cdfd-overview                                  | 本文で参照する。`includes` の記法の rulebook を同時に直さない |
| cnd                                                                        | cxd                                            | 本文で参照する                                                |
| cpd                                                                        | cnd                                            | 本文で参照する                                                |

- 波をまたぐ参照（cdfd-overview・cnd から prj-overview、dss から pm-roles など）は、別の track のため `depends_on` にしなかった。

### 5.4. 迷って決めたこと

- 型の grade の段: schedule の phase に grade の approach はない。kata ドメインの review の段では、review の前に runner が rulebook と、rulebook が宣言する sample・recipe・template を `--target kata` で grade する（`intent: improve-kata` のとき）。そこで「型の grade → review」を 090 の 1 段にまとめ、段の説明にそのことを書いた。
- 複数の sample を持つ rulebook（opd-rulebook・opr-rulebook）: 並べて流すと同じ rulebook を同時に直してぶつかるため、rulebook の段は代表の 1 件（opd-access-control・opr）にだけ置き、ほかは代表を待つ。代表でない sample の 050 を `sample-maintenance` にすると、rulebook の宣言の先頭の sample を対象にしてしまう。そのため `approach` を `fully-guided` にして、対象を自分の sample、手本を rulebook と先頭の sample にした。
- opr の個別の手順の sample と opr-index-sample は、frontmatter の `rulebook` が opd-rulebook を指している。カタログでは opr-rulebook・opr-index-rulebook に結び付け、直すことを `done_criteria` に書いた。
- prj-charter・ifx-api・ifx-msg は、カタログに載せて横串の確認の対象にし、track には入れなかった。

### 5.5. plan の dry-run の結果

`exec plan --project prj-0001 --task` で次の段の plan を `tmp/` に作って確かめた。

| 段                                   | `targets`                                                     | 編集の対象                      | 手本                       |
| ------------------------------------ | ------------------------------------------------------------- | ------------------------------- | -------------------------- |
| opr-batch-sample 050（fully-guided） | `specdojo:opr-batch-sample`                                   | `opr-batch-sample.md`           | opr-rulebook と opr-sample |
| opd-access-control-sample 040        | `specdojo:opd-access-control-sample`・`specdojo:opd-rulebook` | `opd-rulebook.md`               | sample と grade            |
| cnd-sample 040                       | `specdojo:cnd-sample`・`specdojo:cnd-rulebook`                | `cnd-rulebook.md` と `includes` | sample と grade            |
| pm-members-sample 050                | `prj-0001:pm-members-sample`・`specdojo:pm-members-sample`    | `pm-members-sample.yaml`        | rulebook と grade          |

- どの段も対象と手本は食い違わない。
- `includes` の記法の rulebook（cnd-mermaid など）は `targets` に入らない。rulebook の段の commit は rulebooks の置き場全体を許すので commit はできるが、plan には記法の rulebook のパスが出ない。段の説明で `includes` を読むよう書いた。
- YAML の sample（pm-members・gl・dct）は、`targets` の先頭が `prj-0001:<local_id>` になる。commit の許可はカタログのパスから解決するので止まらない。

### 5.6. 利用者が決める値

段の説明で `_UNDECIDED_` に残すよう求めた値は次のとおり。sample の段の result に、型ごとに残した値が書かれる。

- 第 4 波: 稼働時間と復旧時間の目標（nfr-availability）、応答時間などの性能の目標（nfr-performance）、変更・障害対応の効率の目標（nfr-maintainability）、許容する障害の条件（nfr-reliability）、操作性の指標の基準値（nfr-usability）、受入の対象と出口条件の値（sac）。
- 第 5 波: 復旧の目標（opr-backup-restore）、移行の対象と除外（dmd-index・dmd）、切替の日程と停止を許す時間（mip-index・cop-index・cop）、移行の可否を決める基準値（mtp）。

### 5.7. 残課題

- schedule のタスクの実行は、オーケストレーターが第 4 波 → 第 5 波 → 第 6 波の順に流す。
- opd-sample を消すか rulebook に宣言するかを決める（`catalog validate` が「どの rulebook も宣言していない」と警告する）。opd-index-sample を opd-index-rulebook と opd-rulebook の両方が宣言していることも合わせて決める。
- `includes` の記法の rulebook を plan の `targets` に入れるか、YAML の sample の `targets` の先頭を `specdojo:` の ID にするかは、別の項目で決める。
- 人の確定は、sample がひととおりそろった後の横串の確認で行う。
- 保護された設定の変更は無い。

### 5.8. CHANGELOG に書く事項

なし。kata のカタログ・strategy・track は prj-0001 の内部の計画で、利用者への影響はない。

## 6. 関連ドキュメント

- [[prj-0001:dct-kata]]
- [[prj-0001:sch-strategy-kata-wave-3]]
- [[prj-0001:pjr-8x86-kata-regrade-progress|PJR-8X86]]
- [[prj-0001:pjr-325y-kata-strategy-no-role-assignment|PJR-325Y]]
- `prj-0001:sch-strategy-kata-wave-4`・`-wave-5`・`-wave-6-project`・`-wave-6-design`・`-wave-6-notation` と、対応する track（本項目で作成）
