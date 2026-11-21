---
specdojo:
  id: prj-0001:pjr-aby4-kata-wave-3
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-3
  item_status: open
  priority: medium
  registered_at: "2026-11-16T13:40:08Z"
  depends_on:
    - PJR-DD33
---

# PJR-ABY4 型の整備 第 3 波（試験）

## 1. 概要

試験の型 13 種類（tsp-index・utc・itc・stc・etc・atc とその index・trc-requirements-to-tests・imp-test）を、代表の文書と一緒に整える

## 2. 入力

- 対象は tsp-index・utc・utc-index・itc・itc-index・stc・stc-index・etc・etc-index・atc・atc-index・trc-requirements-to-tests・imp-test の 13 種類。どれも grade は needs-work で、prj-0001 に代表の文書はない
- PJR-APA2（2026-11-13）で、第 3 波は試験として予定されていた。利用者が 2026-11-16 に、試験 → 非機能要件と受け入れ条件 → 運用・移行・影響分析の順で進めることを承認した
- SpecDojo には実際のテスト（vitest の単体・結合、親の検証）があり、代表の文書の事実の根拠にできる
- 2026-11-16 の grade（--target kata）で rulebook 112 種類のうち pass 63・needs-work 47・fail 1。進行中の型の epic（APA2・DD33・T88P・ERR7・960C・2GD6）は人の確定（140）で止まっている
- 最初の子の todo で、カタログに代表を足し、strategy と schedule を用意する（前例は PJR-STM9・PJR-WSND）。sample の品質（PJR-2W38）は sample の段の完了条件で扱う

## 3. 範囲（track と domain）

- track: `kata-wave-3`。対象の domain: `kata`（`dct-kata.yaml`、PJR-6998 の決定）。
- 対象の型: tsp-index・utc-index・utc・itc-index・itc・stc-index・stc・etc-index・etc・atc-index・atc・trc-requirements-to-tests・imp-test の 13 種類。
- 代表の文書は、その型の sample（駄菓子屋の共通の文脈）とする。prj-0001 の製品の成果物は作らない。
- 段: rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template はこの track では扱わず、PJR-WYTX（kata-slim-3）で扱う。
- 対象外: 上に挙げていない型、非推奨の型。最初の子の todo で `dct-kata.yaml` を作り、kata ドメインを `dct-index.yaml` に足す。

## 4. 完了の判断の基準

- 対象の型すべてで、rulebook と sample が人の確定まで終わり、`status` が ready になっている。
- 対象の型の rulebook と sample を `grade run --target kata --kata <name>` で評価し、pass になっている。pass にならない型は、理由と残す判断を対応結果に書いている。
- `dct-kata.yaml` に対象の型の sample が載り、`catalog validate` が通る。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
