---
specdojo:
  id: prj-0001:pjr-apa2-kata-wave-1
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-1
  domains:
    - architecture
    - system-design
    - business-model-bes
    - system-functions
    - external-interface-specs
    - planning
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-13T13:36:35Z"
  derived_from:
    - PJR-T88P
---

# PJR-APA2 型の整備 第 1 波（アーキテクチャ・システム設計・業務仕様の一覧）

## 1. 概要

代表の文書と型を一緒に整える（bootstrap-kata-set）。cxd・cnd・cpd・ifd-mermaid・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy・bes-index・sf-index・ifx-index・dct-index の 11 種類

## 2. 入力

- indie の方針（2026-11-13）: 成果物の作成より先に、型の整備を一通り終わらせる。epic の schedule で進め、codex 2 本・agy 2 本の 4 本で並べて流す
- 第 2 波（非機能要件・受け入れ基準）、第 3 波（試験）、第 4 波（運用・移行・影響分析）は第 1 波の結果を見て起票する。カタログに宣言がない約 25 種類は、その後にカタログの見直しから行う

## 3. 範囲（track と domain）

- track `kata-wave-1`。対象は 11 種類の型と、その代表の成果物（cxd-specdojo・cnd-specdojo・cpd-specdojo-cli・ifd-specdojo・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy・bes-index・sf-index・ifx-index・dct-index）。
- schedule は、代表と型の初期整備（005）→ rulebook（040）・recipe（045）・sample（050）・template（060）の手入れ → 代表の磨き込み（070）→ 冗長さの整理（080）→ agent の review（090）→ 人の確定（140）。intent は `bootstrap-kata-set`。型の手入れの段は orchestrator が T88P にならって足した。
- review の段は代表を見るため、型そのものの grade は orchestrator が review の後に別に流す。
- 流し方: `--auto --track kata-wave-1 --parallel 4`。codex（sol）2 本と agy（agy-opus）2 本が選ばれる（PJR-APA2 と同時の設定変更）。親の検証は 1 本ずつ。

## 4. 完了の判断の基準

- 11 種類の型の rulebook と sample が grade で pass になり、確定（`-140`）で人が確かめている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
