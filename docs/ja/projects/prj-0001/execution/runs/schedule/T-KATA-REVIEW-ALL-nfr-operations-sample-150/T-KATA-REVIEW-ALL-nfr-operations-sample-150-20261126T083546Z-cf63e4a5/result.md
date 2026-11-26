---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-operations-sample-150-20261126t083546z-cf63e4a5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-operations-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-operations-sample-150/T-KATA-REVIEW-ALL-nfr-operations-sample-150-20261126T083546Z-cf63e4a5/plan.md
  started_at: "2026-11-26T08:35:57.655Z"
  completed_at: "2026-11-26T08:46:02.199Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、nfr-operations-sample を運用方針・設計（`opd-index` / `opd-incident-management`）と突き合わせ、sample 側の食い違い 3 点を直した。
- 直した内容は、体制前提の停止・再開の判断者の書き方、段階 2 の「次の段へ上げる条件」、`nfr-ops-006` の備考の対象範囲である。
- rulebook と nfr-index-sample 側に直す点（No 4・5・6・7）は変更せず、直す案を findings に記録した。
- grade の F001 と F004 は kata の段のレビューで使わない観点のため扱っていない。F002 は前の段で暫定基準が入っており、R5 では繰り返していない。
- 検証は、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかの検査は変更の種類により非適用である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | nfr-operations-sample「適用範囲・体制前提」の体制の行 | 「業務の停止・再開の判断は `PO`」が運用方針と食い違う。`opd-index-sample` では `PO` が決めるのは紙の販売控えへの切替で、営業そのものは止めない。`opd-incident-management-sample` では、つけの受付停止は店番担当が、在庫調整の保留は `OPS` が決める。 | 「紙の販売控えへの切替と記録の再開の判断は `PO`」に直した（sample 側で反映済み）。 | `opd-index-sample` の「障害対応方針（優先度・停止判断・周知）」、`opd-incident-management-sample` の停止判断の表 | 反映済み |
| 2 | R5 | nfr-operations-sample「適用範囲・体制前提」の段階 2 の「次の段へ上げる条件」 | 「`PO` が業務の停止・再開を判断するまで続ける」が No 1 と同じ理由で運用方針と食い違う。 | 「`PO` が紙の販売控えへの切替か再開を決めるまで」に直した（sample 側で反映済み）。 | `opd-index-sample` の障害対応方針、`opr-incident-sample` の切替の表 | 反映済み |
| 3 | R5 | nfr-operations-sample「運用要件一覧」の `nfr-ops-006` の備考 | 基準の「監視対象 3 件」は `opd-index-sample` の監視・アラート方針の表（死活・閉店後のバックアップ・日次締めの差異）にしかない。それなのに備考は `opd-incident-management` の判定の表だけを対象に挙げていた。 | 備考を「対象は `opd-incident-management` の判定の表と `opd-index` の監視対象」に直した（sample 側で反映済み）。 | `opd-index-sample` の監視・アラート方針の表、`opd-incident-management-sample` の優先度の判定の表 | 反映済み |
| 4 | R5 | nfr-operations-rulebook「全体方針」の `_UNDECIDED_` の箇条書き（grade F003） | 「sample は「本文要件」の 5 章に揃っていない」とあるが、現在の sample は 5 章に揃っており、記述が古い。 | rulebook 側の案（未変更）として、文を「`_UNDECIDED_:` `recipe`・`template` の要否は未判断である。同じ 5 章の構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」に改める。 | nfr-operations-rulebook の「本文要件」と sample の章構成（1〜5 章が一致する） | 相手側を直す案 |
| 5 | R5 | nfr-index-sample「分冊ドキュメント一覧（ID/参照先）」の運用の行の備考 | 備考は「-」だが、運用の分冊には `_UNDECIDED_` が 2 件ある（`nfr-ops-003` のバックアップ成功率の基準値と、営業時間外の緊急連絡手段）。可用性・性能の行は未決を備考に書いており、書き方がそろっていない。 | nfr-index-sample 側の案（未変更）として、備考を「`_UNDECIDED_:` バックアップ成功率の基準値と営業時間外の緊急連絡手段。決まるまで分冊の暫定基準で判定する」にする。 | nfr-index-sample の可用性・性能の行、nfr-operations-sample の「適用範囲・体制前提」と `nfr-ops-003`・`nfr-ops-009` | 相手側を直す案 |
| 6 | R5 | nfr-operations-rulebook「記述ガイド」の良い例（適用範囲・体制前提、運用要件一覧） | 良い例の値が sample と違う。rulebook は監視を「10:00〜19:00」、通知を「チャット」、`nfr-ops-002` をバックアップの「99.5% 以上」としている。sample は 10:00〜18:00、メール、`nfr-ops-002` は監視の誤検知、バックアップは `nfr-ops-003` の暫定 95%。例として独立しているとみることもできるが、同じ要件 ID が別の内容を指すため読み手が取り違えるおそれがある。 | rulebook 側の案（未変更）として、良い例の要件 ID を `nfr-ops-003` にし、営業時間を 18:00 にそろえる。または良い例から具体的な要件 ID を外す。 | nfr-operations-rulebook の記述ガイドの「適用範囲・体制前提」「運用要件一覧」、sample の「運用要件一覧」、`opd-index-sample` の運用時間帯 | 要判断 |
| 7 | R5 | nfr-index-sample「関連ドキュメント導線（SAC/STC/OPD/OPR/DEC）」の運用の行の判断記録の列 | index は運用の判断記録を「（なし）」とするが、sample の関連ドキュメント導線は `dec-*`（基準値の見直しと対象外の判断）を挙げている。sample の側は rulebook の「位置づけ」に従った置き場所の仮置きである。 | 相手側の案（未変更）として、index で運用の判断記録の列を `dec-*`（基準値の見直し時に作る）とするか、現状のまま「まだ判断記録がない」意味で据え置くかを決める。 | nfr-index-sample の導線の表、nfr-operations-rulebook の「位置づけ」の `dec-*` の行 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: 体制前提の「業務の停止・再開の判断は `PO`」を「紙の販売控えへの切替と記録の再開の判断は `PO`」に直した。段階 2 の「次の段へ上げる条件」も同じ趣旨に直した。`nfr-ops-006` の備考は、対象を `opd-incident-management` の判定の表と `opd-index` の監視対象とした。prettier により表の列幅もそろえ直した。

## 3. 申し送り

- rulebook と nfr-index-sample の修正案（No 4〜7）は、それぞれの担当で反映するかを判断する必要がある。No 6 と No 7 は「要判断」の印を付けた。
- grade の F001 と F004 を扱わなかった理由と、F002 を前の段で対応済みとした理由は、executor の handoff に記載がある。
- No: 1 / 段: R5 / 箇所: nfr-operations-sample「適用範囲・体制前提」の体制の行 / 指摘: 「業務の停止・再開の判断は `PO`」が運用方針と食い違う。opd-index-sample の障害対応方針では、`PO` が決めるのは紙の販売控えへの切替で、営業そのものは止めない。opd-incident-management-sample では、つけの受付停止は店番担当が、在庫調整の保留は `OPS` が決める。 / 直した案: 「紙の販売控えへの切替と記録の再開の判断は `PO`」に直した（sample 側で反映済み） / 根拠: opd-index-sample の「障害対応方針（優先度・停止判断・周知）」、opd-incident-management-sample の停止判断の表 / 印: 反映済み
- No: 2 / 段: R5 / 箇所: nfr-operations-sample「適用範囲・体制前提」の段階 2 の「次の段へ上げる条件」 / 指摘: 「`PO` が業務の停止・再開を判断するまで続ける」が No 1 と同じ理由で運用方針と食い違う / 直した案: 「`PO` が紙の販売控えへの切替か再開を決めるまで」に直した（sample 側で反映済み） / 根拠: opd-index-sample の障害対応方針、opr-incident-sample の切替の表 / 印: 反映済み
- No: 3 / 段: R5 / 箇所: nfr-operations-sample「運用要件一覧」の `nfr-ops-006` の備考 / 指摘: 基準の「監視対象 3 件」は opd-index-sample の監視・アラート方針の表（死活・閉店後のバックアップ・日次締めの差異）にしかないのに、備考は `opd-incident-management` の判定の表だけを対象に挙げていた / 直した案: 備考を「対象は `opd-incident-management` の判定の表と `opd-index` の監視対象」に直した（sample 側で反映済み） / 根拠: opd-index-sample の監視・アラート方針の表、opd-incident-management-sample の優先度の判定の表 / 印: 反映済み
- No: 4 / 段: R5 / 箇所: nfr-operations-rulebook「全体方針」の `_UNDECIDED_` の箇条書き（grade F003） / 指摘: 「sample は「本文要件」の 5 章に揃っていない」とあるが、現在の sample は 5 章に揃っており、記述が古い / 直した案（rulebook 側、未変更）: 文を「`_UNDECIDED_:` `recipe`・`template` の要否は未判断である。同じ 5 章の構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」に改める / 根拠: nfr-operations-rulebook の「本文要件」と sample の章構成（1〜5 章が一致する） / 印: 相手側を直す案
- No: 5 / 段: R5 / 箇所: nfr-index-sample「分冊ドキュメント一覧（ID/参照先）」の運用の行の備考 / 指摘: 備考は「-」だが、運用の分冊には `_UNDECIDED_` が 2 件ある（`nfr-ops-003` のバックアップ成功率の基準値と、営業時間外の緊急連絡手段）。可用性・性能の行は未決を備考に書いており、書き方がそろっていない / 直した案（nfr-index-sample 側、未変更）: 備考を「`_UNDECIDED_:` バックアップ成功率の基準値と営業時間外の緊急連絡手段。決まるまで分冊の暫定基準で判定する」にする / 根拠: nfr-index-sample の可用性・性能の行、nfr-operations-sample の「適用範囲・体制前提」と `nfr-ops-003`・`nfr-ops-009` / 印: 相手側を直す案
- No: 6 / 段: R5 / 箇所: nfr-operations-rulebook「記述ガイド」の良い例（適用範囲・体制前提、運用要件一覧） / 指摘: 良い例の値が sample と違う。rulebook は監視を「10:00〜19:00」、通知を「チャット」、`nfr-ops-002` をバックアップの「99.5% 以上」としている。sample は 10:00〜18:00、メール、`nfr-ops-002` は監視の誤検知、バックアップは `nfr-ops-003` の暫定 95%。例として独立しているとみることもできるが、同じ要件 ID が別の内容を指すため読み手が取り違えるおそれがある / 直した案（rulebook 側、未変更）: 良い例の要件 ID を `nfr-ops-003` にし、営業時間を 18:00 にそろえる。または良い例から具体的な要件 ID を外す / 根拠: nfr-operations-rulebook の記述ガイドの「適用範囲・体制前提」「運用要件一覧」、sample の「運用要件一覧」、opd-index-sample の運用時間帯 / 印: 要判断
- No: 7 / 段: R5 / 箇所: nfr-index-sample「関連ドキュメント導線（SAC/STC/OPD/OPR/DEC）」の運用の行の判断記録の列 / 指摘: index は運用の判断記録を「（なし）」とするが、sample の関連ドキュメント導線は `dec-*`（基準値の見直しと対象外の判断）を挙げている。sample の側は rulebook の「位置づけ」に従った置き場所の仮置き / 直した案（相手側、未変更）: index で運用の判断記録の列を `dec-*`（基準値の見直し時に作る）とするか、現状のまま「まだ判断記録がない」意味で据え置くかを決める / 根拠: nfr-index-sample の導線の表、nfr-operations-rulebook の「位置づけ」の `dec-*` の行 / 印: 要判断
- grade の finding のうち F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」が kata の段のレビューでは使わない観点（kata の承認と ready 化は登録簿で追う）としているため扱わない。F002（`vp-qe-verifiability`）は前の段で暫定の基準（月次 95% 以上）が既に入っており、R5 では繰り返さない。

## 4. 進め方と実践の型の適用

kata-guide の R5（整合）に従い、sample、運用方針・設計（`opd-index` / `opd-incident-management`）、rulebook、nfr-index-sample を突き合わせた。sample 側で直せる食い違いは反映し、相手側の修正は変更せず案として残した。grade の finding は、この段の観点に当たる F003 だけを扱った。その修正先は rulebook 側のため、案として記録した。
