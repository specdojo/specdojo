---
specdojo:
  id: prj-0001:pjr-8x86-kata-regrade-progress
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  registered_at: "2026-11-23T01:41:09Z"
---

# PJR-8X86 型の grade のし直し（2026-11-21）の後の、薄い型の直り具合

## 1. メモ

2026-11-21 の型の grade のし直し（run id `regrade-kata-2026-11-21`、opus）で pass でなかった文書が、2026-11-23 時点でどこまで直ったかの観測。続きは第 4〜6 波の epic（PJR-HJ3H・PJR-JZ2F・PJR-G1M8・PJR-SBGQ・PJR-PYS2）と PJR-CPA8 で進める。新しい grade が出たら、この個票に追記する。

rulebook と sample の 142 文書を、11-21 の判定と 11-23 時点の最新の判定で比べた（`execution/grade/results/` の git の履歴から 11-21 の版を取り出した）。

| 11-21 の判定 | 文書の数 | 11-23 に pass | 点は上がったが needs-work | 11-21 から手付かず |
| ------------ | -------- | ------------- | ------------------------- | ------------------ |
| fail         | 21       | 7             | 2                         | 12                 |
| needs-work   | 79       | 18            | 4                         | 57                 |
| pass         | 42       | 42            | -                         | -                  |

- 直ったのは第 3 波（試験）の 13 種類。fail（31〜53 点）だった sample の多くが 89〜99 点になった。2026-11-23 に PJR-30PT で文書の役割と承認の記述を外したため、その後の grade で pass を保てているかを確かめる。
- 点は上がったが needs-work のまま: atc-sample（96）、itc-sample（97）、stc-index-sample（91）、ifx-api-rulebook（89）、ifx-api-sample（82）、ifx-msg-rulebook（96）。ifx の 3 文書は PJR-AEKE の 2 回目（2026-11-23）の後の grade で見直す。
- prj-charter-sample は 85 から pass 96 になった（PJR-7M9J・PJR-SV9G など）。

11-21 から手付かずの文書（69 文書）の範囲と、受け持つ epic は次のとおり。

| 範囲                                | 種類                                                                                                     | 受け持つ項目 | 目立つ点                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------- |
| 第 4 波（非機能要件と受け入れ条件） | nfr-index・nfr の 8 種類・sac・trc-requirements-to-specs                                                 | PJR-HJ3H     | nfr の sample の多くが fail（37〜50 点）          |
| 第 5 波（運用・移行・影響分析）     | opd-index・opr・opr-index・otp-index・cop・cop-index・mip-index・dmd-index・mtp・ntp・imp-data           | PJR-JZ2F     | cop・opd・opr・mtp の sample が fail（34〜46 点） |
| 第 6 波（プロジェクト）             | prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-members など                  | PJR-G1M8     | prj-charter は直った                              |
| 第 6 波（設計と業務の残り）         | bps・cdr・dss・gl・uis・tsd・cdfd・cdfd-overview・imp-business・imp-interface・imp-operations・sysd など | PJR-SBGQ     | ifx-api・ifx-msg は PJR-AEKE で直した             |
| 第 6 波（記法）                     | cnd-mermaid・cpd-mermaid・cdfd-mermaid・cdfd-d2 など                                                     | PJR-PYS2     | rulebook が 77〜82 点                             |
| 登録簿と schedule                   | pjr・sch                                                                                                 | PJR-CPA8     | -                                                 |

- どの epic の一覧にも名前がない手付かずの型: cnd・dct・dmd・opd・otp・pm-change-request-log・pm-issue-log・pm-risk-register・stsd。epic の一覧の書き方（`-index` を含めて数えているか）を確かめ、入っていなければどの波に入れるかを決める。
- 第 4〜6 波には strategy と track がまだない。第 3 波は PJR-VCER で kata ドメインと strategy・schedule を用意してから流した。

## 2. 入力

- 利用者の依頼（2026-11-23）: 以前洗い出した内容の薄い型がどこまで直るかを、忘れないように note に残す

## 3. 背景・文脈

- 2026-11-21 に、これまでの波で rulebook と sample の中身を整えていない 74 種類を洗い直し、第 3〜5 波と PJR-CPA8、第 6 波の 3 件の epic に割り振った（PJR-G1M8・PJR-SBGQ・PJR-PYS2 の入力）。
- PJR-6998 の決定（2026-11-21）で、kata ドメイン（`dct-kata.yaml`）に sample を成果物として載せ、sample を代表にして型を整える。
- PJR-76N9 の決まり（成果物と sample の本文に文書の役割の割り当てと承認の進み具合を書かない）は、PJR-325Y で作成標準と第 3 波の strategy に入れた。第 4 波以降の strategy には最初から入れる。

## 4. フォローアップ

- 第 4〜6 波の各 epic に、kata ドメインと strategy・schedule を用意する子の todo を起票し、第 4 波 → 第 5 波 → 第 6 波の順に進める（2026-11-23、利用者の依頼）。
- どの epic の一覧にも名前がない手付かずの型（cnd・dct・dmd・opd・otp・pm-change-request-log・pm-issue-log・pm-risk-register・stsd）の割り振りを決める。
- 新しい grade が出たら、この個票の表を更新する。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
