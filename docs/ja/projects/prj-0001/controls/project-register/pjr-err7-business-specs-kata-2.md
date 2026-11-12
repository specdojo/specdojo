---
specdojo:
  id: prj-0001:pjr-err7-business-specs-kata-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: business-specs-kata-2
  domains:
    - data-model
    - data-flow
    - user-interface-model
    - external-interface-specs
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-12T13:40:24Z"
  derived_from:
    - PJR-T88P
---

# PJR-ERR7 業務仕様の型の残り（stsd・cdsd・cdfd-uc・clis・ifx-cmd）を標準の章立てと厚さに整える

## 1. 概要

代表の文書がある業務仕様の型 5 種類を、代表を手本に rulebook と sample を磨き込み、grade で pass にする

## 2. 入力

- indie の優先順の承認（2026-11-12）: 1. 業務仕様の型の残り → 2. 業務仕様の文書の残り → 3. プロジェクトの型 → 4. 非機能要件・アーキテクチャ。今晩は 1 を自動で流す
- 代表の文書がない型（bps・uis・dss・ifx-api・ifx-file・ifx-msg・各 index・cdfd-d2・cdfd-mermaid）は、2 の epic で代表を作ってから扱う。gl は用語集の確定（PJR-6XQ4・PJR-EBN6）と重なるため今回は外す

## 3. 範囲（track と domain）

- track `business-specs-kata-2`。対象は、代表の文書がある業務仕様の型 5 種類（stsd・cdsd・cdfd-uc・clis・ifx-cmd）。代表は `stsd-task-execution`・`cdsd-execution`・`cdfd-uc-register`・`clis-exec-commands`・`ifx-cmd-ai-provider-cli`。
- schedule は、rulebook の見直し（040）→ sample の手直し（050）→ agent の review（090）→ 人の確定（140）。intent は `improve-kata`（`kata_target: rulebook`）。sample の段は orchestrator が T88P にならって足した。
- 対象外: 代表の文書がない型（bps・uis・dss・ifx-api・ifx-file・ifx-msg・各 index・cdfd-d2・cdfd-mermaid）は、業務仕様の文書の残りの epic で代表を作ってから扱う。gl は用語集の確定（PJR-6XQ4・PJR-EBN6）と重なるため外す。代表の文書そのものは変えない。

## 4. 完了の判断の基準

- 5 種類の rulebook と sample が grade で pass になり、確定（`-140`）で人が ready にしている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
