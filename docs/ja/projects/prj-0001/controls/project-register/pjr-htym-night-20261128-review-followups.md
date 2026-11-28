---
specdojo:
  id: prj-0001:pjr-htym-night-20261128-review-followups
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  registered_at: "2026-11-28T15:47:51Z"
  derived_from:
    - PJR-756E
    - PJR-6V26
    - PJR-3R7V
---

# PJR-HTYM 2026-11-28 の夜の 5 件の review で出た、後続の起票と未決の扱いをどうするか

## 1. 確認事項

756E・6V26・3R7V の対応結果に残った後続の作業と未決、PJR-4EFH・0FBB の担当と期限を indie が決める

## 2. 入力

- PJR-756E の残課題: CDFD の template（cdfd-overview-template・cdfd-template・cdfd-uc-template）と recipe は rulebook の新しい描き方とそろっていない。cdfd-uc-template の D2 は direction: down のまま。別の todo にするか
- PJR-756E の決めた点: レーンは grid-rows の帯にせず ELK の囲みで上から並べた（grid では線がノードを横切ったため）。帯の形が要るかは indie が文書サイトで見て決める
- PJR-6V26 の案: シビックテック入門ガイドの理解の負債の定義の文が正本より狭い。正本に合わせて置き換える案が個票の対応結果にある。直すか
- PJR-3R7V の残課題: 登録簿の個票の英語の見出しへの対応（5 か所と exec plan の文言）と、maintenance 系の commit 許可範囲 kataDirsForKinds への docs/en の追加を、別の todo にするか
- PJR-3R7V の未決: init の既定を LANG に合わせるか、CLI・オーケストレーターの案内の言語も切り替えるか
- PJR-4N4K の結果: 英語版の古い翻訳が 2 件（civic-tech-starter-guide・pjr-rulebook）、`translated_from` のないものが 1 件（docs/en/index.md）。直す todo を起票するか
- PJR-4EFH（記帳が遅い調査）と PJR-0FBB（exec smoke の reopen が取り込まれない）の担当と期限

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
