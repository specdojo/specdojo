---
specdojo:
  id: prj-0001:pjr-dd33-kata-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-2
  domains:
    - business-model-bes
    - data-flow
    - user-interface-model
    - external-interface-specs
    - data-model-cdsd
    - architecture
    - business-acceptance-criteria
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-14T03:51:01Z"
  derived_from:
    - PJR-APA2
---

# PJR-DD33 型の整備 第 2 波（仕様と設計の残り・業務の受け入れ基準）

## 1. 概要

設計までの型を仕上げる第 2 波。仕様の cdfd-mermaid・bds・sld・ifx-api・ifx-file、設計の cxd・cnd・cpd の mermaid 版、業務の受け入れ基準の bac の 9 種類

## 2. 入力

- indie の方針（2026-11-14）: 設計までの型を先に仕上げる。非機能要件（`nfr-*`）とシステムの受け入れ基準（sac）は後回し。bac は wave-2 に含める
- bds・sld・ifx-api・ifx-file はカタログに代表の宣言がないため、先にカタログに代表を足す。cxd・cnd・cpd の mermaid 版は wave-1 の型に includes で含まれる
- schedule は、wave-1 の後に直す PJR-C8J8・160D・N2CP・E4R5・T01P が済んでから作る（strategy の生成に型の手入れの段が入り、review で型を grade するようになってから）

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
