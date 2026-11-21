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

- track: `kata-wave-4`。対象の domain: `kata`（`dct-kata.yaml`、PJR-6998 の決定）。
- 対象の型: nfr-index・nfr-availability・nfr-integrity・nfr-maintainability・nfr-operations・nfr-performance・nfr-reliability・nfr-security-safety・nfr-usability・sac・trc-requirements-to-specs の 11 種類。
- 代表の文書は、その型の sample（駄菓子屋の共通の文脈）とする。prj-0001 の製品の成果物は作らない。
- 段: rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template はこの track では扱わず、PJR-WYTX（kata-slim-3）で扱う。
- 対象外: 上に挙げていない型、非推奨の型。性能や可用性の目標などの値は、駄菓子屋の文脈で sample の作成標準に沿って仮定する。
- track の中の順番: grade（2026-11-21、opus）で needs-work・fail の型を先に流し、pass の型を後に流す。先に流した結果を見て、後の型の進め方を直す。
- pass の型の直し方: grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に残す（利用者の承認、2026-11-21。範囲は絞らない）。

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
