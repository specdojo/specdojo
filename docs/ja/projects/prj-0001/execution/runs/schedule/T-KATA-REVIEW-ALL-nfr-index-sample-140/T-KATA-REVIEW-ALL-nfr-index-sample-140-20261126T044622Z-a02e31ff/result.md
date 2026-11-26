---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-index-sample-140-20261126t044622z-a02e31ff
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-index-sample-140/T-KATA-REVIEW-ALL-nfr-index-sample-140-20261126T044622Z-a02e31ff/plan.md
  started_at: "2026-11-26T04:46:32.403Z"
  completed_at: "2026-11-26T04:56:13.296Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、nfr-index-sample の事実（frontmatter、`based_on`、参照先パス、分冊 ID、営業時間、代表指標、`_UNDECIDED_` の目印など）を schema、rulebook、関連 sample と突き合わせた。
- 分冊一覧の後にある「目標値が `_UNDECIDED_` の分冊は合否を判定しない」が、性能・可用性の分冊が持つ暫定の判定と食い違っていた。暫定の判定があればそれで判定する形に直した（1 行の差分）。
- 展開された grade の F001 と F002 は、前の段の修正で本文からなくなっていたため、この段では追加の修正をしていない。
- 分冊側の `sac-integrity`・`stc-integrity` の不在と、`dec-offline-recording` の実在を確かめられない点は、本書の範囲外か根拠不足のため修正せず、handoff に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 3. 分冊ドキュメント一覧（ID/参照先）／「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、測った値だけを記録する」 | 同じ表の性能の備考（仮置き基準で測る）、`nfr-performance-sample` の `nfr-perf-001`（仮置き 2 秒以内で判定）、`nfr-availability-sample` の `nfr-avl-002`・`nfr-avl-003`（暫定の判定あり）と食い違う。 | 「目標値が `_UNDECIDED_` の指標は、分冊が暫定の判定を定めていればそれで合否を判定し、定めていなければ測った値だけを記録する」に直した。 | vp-qe-verifiability、vp-dev-testability | - |
| R4-2 | R4 | 5. 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC）／相手側 `nfr-integrity-sample` | 完全性の分冊 `nfr-integrity-sample` は検証先に `sac-integrity`・`stc-integrity` を挙げるが、この 2 つの ID は他の sample のどこにもない（`stc-index-sample` にもない）。本書は実在する `sac-store-sales`・`stc-cash-sale`・`stc-record-recovery` を挙げている。 | 相手側の `nfr-integrity-sample` の「測定・検証方法」と関連文書の表の ID を、`stc-index-sample` にある term へ置き換えるか、`stc-index-sample` に `stc-integrity` を足す。どちらにするかは R5 か人が判断する。 | nfr-integrity-sample と stc-index-sample の grep による突き合わせ | 要判断 |
| R4-3 | R4 | 5. 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC）／`dec-offline-recording` | 可用性の判断記録 `dec-offline-recording` は、他の sample に ID がなく実在を確かめられない。本文は決定待ちと明示しており、`opr-incident-sample` の「オフライン時の記録方法」の `_UNDECIDED_` とも矛盾しない。 | 確かめには `dec-sample` の系列にこの判断記録を置くかどうかの決定が要る。現状は維持した。 | samples 配下の grep（該当 ID なし） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-index-sample.md`: 分冊一覧の後の判定方針を、「目標値が `_UNDECIDED_` の指標は、分冊が暫定の判定を定めていればそれで合否を判定し、定めていなければ測った値だけを記録する」に修正した。性能・可用性の分冊が持つ暫定の判定との食い違いを解消した。

## 3. 申し送り

- R4-2 は、直す先が本書ではなく相手側の `nfr-integrity-sample` にある。`stc-index-sample` に `stc-integrity` を足すか、相手側の参照を実在する term へ置き換えるかの 2 案があり、R5 か人の判断が要る。
- R4-3 の `dec-offline-recording` は、他の sample に ID がなく実在を確かめられなかった。`dec-sample` の系列に置くかどうかの決定が要るため、現状は維持した。
- R4-1: R4 / 3. 分冊ドキュメント一覧（ID/参照先） / 「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、測った値だけを記録する」が、同じ表の性能の備考（仮置き基準で測る）と、`nfr-performance-sample` の `nfr-perf-001`（仮置き 2 秒以内で判定）、`nfr-availability-sample` の `nfr-avl-002`・`nfr-avl-003`（暫定の判定あり）と食い違う / 「目標値が `_UNDECIDED_` の指標は、分冊が暫定の判定を定めていればそれで合否を判定し、定めていなければ測った値だけを記録する」に直した / vp-qe-verifiability、vp-dev-testability / -
- R4-2: R4 / 5. 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 完全性の分冊 `nfr-integrity-sample` は検証先に `sac-integrity`・`stc-integrity` を挙げるが、この 2 つの ID は他の sample のどこにもない（`stc-index-sample` にもない）。本書は実在する `sac-store-sales`・`stc-cash-sale`・`stc-record-recovery` を挙げている / - / 相手側の `nfr-integrity-sample` の「測定・検証方法」と関連文書の表の `sac-integrity`・`stc-integrity` を、`stc-index-sample` にある term へ置き換えるか、`stc-index-sample` に `stc-integrity` を足す案。どちらにするかは R5 か人が判断する / 要判断（直す先が本書ではなく、2 つの案のどちらを採るか決められない）
- R4-3: R4 / 5. 関連ドキュメント導線（SAC/STC/OPD/OPR/DEC） / 可用性の判断記録 `dec-offline-recording` は、他の sample に ID がなく実在を確かめられない。本文は決定待ちと明示しており、`opr-incident-sample` の「`_UNDECIDED_:` オフライン時の記録方法」とも矛盾しない / - / 確かめには `dec-sample` の系列にこの判断記録を置くかどうかの決定が要る。現状は維持した / -
- R4-4: R4 / 3. 分冊ドキュメント一覧（ID/参照先） / 展開された grade の F001（緊急連絡手段の `_UNDECIDED_`）と F002（監査ログの保管期間 1 年の再掲）は、前の段の修正でもう本文にない。F001 の観点 `vp-po-decision-readiness` は、kata の段のレビューでは使わない観点でもある / - / kata-guide「kata の観点の組」、現行の 45〜49 行 / -
- R4 確かめの表（runner が描く表の後に置く想定。表の列: No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: C1 `type: requirement`・`rulebook: specdojo:nfr-index-rulebook` / nfr-index-rulebook の「推奨 Frontmatter 項目」、common-frontmatter.schema.yaml / 読み取り / 一致 / schema 55 行の enum に requirement がある。C2 `based_on` の 3 つの id / 各 sample の frontmatter / ls・grep / 一致 / prj-overview・sysd-cross-cutting-policy・opd-index の sample が存在する。C3 参照先 `docs/ja/product/060-non-functional-requirements/` / docs-structure-guide.md / grep / 一致 / 370 行。C4 8 カテゴリと分冊 ID / rulebook の冒頭と各 `nfr-*-sample` / ls / 一致 / 8 つの分冊 sample が存在する。C5 各分冊が `part_of` に `nfr-index` を持つ / nfr-reliability・nfr-availability の sample / grep / 一致 / `part_of: specdojo:nfr-index-sample`。C6 営業時間 10:00〜18:00 / opd-index-sample / grep / 一致 / 34 行。C7 つけ残高の 1 分以内の確認 / prj-overview-sample / grep / 一致 / 70 行。C8 可用性の稼働率・RTO・RPO の目標値が未決 / nfr-availability-sample、opd-index-sample / grep / 一致 / 51〜53 行、23 行。C9 性能の目標値が未決で、仮置き基準で測る / nfr-performance-sample / grep / 一致 / 52 行（仮置き 2 秒以内）。C10 「目標値が `_UNDECIDED_` の分冊は合否を判定しない」 / nfr-performance・nfr-availability の sample / grep / 不一致 / 暫定の判定がある（R4-1 で直した）。C11 監査ログの保管期間は `opd-index` と揃える / opd-access-control-sample / grep / 一致 / 80 行（`opd-index` が 1 年とする）。C12 代表指標（MTTR、変更の適用までの日数、差額、重複記録件数、権限外の操作の成功件数、タスク完了率、誤操作による取消、夜間バックアップの成功率） / 各 `nfr-*-sample` / grep / 一致 / mnt-003、int-003、sec-003、usb-001・002、ops-003。C13 導線の `sac-store-sales`・`stc-cash-sale`・`stc-sale-hold`・`stc-record-recovery`・`opd-*`・`opr-*` / samples 配下 / grep -w / 一致 / いずれも他の sample で使われている。C14 `dec-offline-recording` / samples 配下 / grep / 確かめられない / ID が見当たらない（R4-3）。C15 `_UNDECIDED_` の目印 / document-metadata-standard / grep / 一致 / 146 行。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/nfr-index-sample.md だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

sample メンテナンスの approach に従い、kata-guide の R4 の段として、sample の事実を schema・rulebook・関連 sample と照合した。照合した主張は 15 件で、うち 1 件が不一致（C10、直した）、1 件が確かめられなかった（C14）。ほかは一致した。rulebook と矛盾する箇所は見つからなかった。plan に展開された F001・F002 は前の段で解消済みであり、F001 の観点 `vp-po-decision-readiness` はこの段では扱わない観点だった。
