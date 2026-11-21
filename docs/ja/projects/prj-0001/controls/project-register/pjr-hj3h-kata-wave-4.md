---
specdojo:
  id: prj-0001:pjr-hj3h-kata-wave-4
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-4
  item_status: open
  priority: medium
  registered_at: "2026-11-16T13:41:13Z"
  depends_on:
    - PJR-ABY4
---

# PJR-HJ3H 型の整備 第 4 波（非機能要件と受け入れ条件）

## 1. 概要

非機能要件の型 9 種類（nfr-index と nfr-* 8 種類）・sac・trc-requirements-to-specs を、代表の文書と一緒に整える

## 2. 入力

- 対象は nfr-index・nfr-availability・nfr-integrity・nfr-maintainability・nfr-operations・nfr-performance・nfr-reliability・nfr-security-safety・nfr-usability・sac・trc-requirements-to-specs の 11 種類。どれも grade は needs-work で、prj-0001 に代表の文書はない
- PJR-DD33（2026-11-14）で、非機能要件とシステムの受け入れ基準（sac）は後回しと決めていた。利用者が 2026-11-16 に、第 3 波（試験）の後に進めることを承認した
- 代表の文書には、性能や可用性の目標など利用者が決める事実が要る。推測で埋めず、決まっていない値は `_UNDECIDED_` で残すか、利用者に確かめる
- 2026-11-16 の grade（--target kata）で rulebook 112 種類のうち pass 63・needs-work 47・fail 1。進行中の型の epic（APA2・DD33・T88P・ERR7・960C・2GD6）は人の確定（140）で止まっている
- 最初の子の todo で、カタログに代表を足し、strategy と schedule を用意する。sample の品質（PJR-2W38）は sample の段の完了条件で扱う

## 3. 範囲（track と domain）

_TODO_: Frontmatter の `track` が担う範囲と対象 domain、対象外の境界を記載する。

## 4. 完了の判断の基準

- _TODO_: 子項目と schedule を確認して、人が完了を判断できる基準を記載する。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
