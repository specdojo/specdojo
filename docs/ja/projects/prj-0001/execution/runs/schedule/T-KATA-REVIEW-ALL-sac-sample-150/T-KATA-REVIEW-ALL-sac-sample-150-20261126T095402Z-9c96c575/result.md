---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sac-sample-150-20261126t095402z-9c96c575
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sac-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sac-sample-150/T-KATA-REVIEW-ALL-sac-sample-150-20261126T095402Z-9c96c575/plan.md
  started_at: "2026-11-26T09:54:13.748Z"
  completed_at: "2026-11-26T10:03:07.330Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `sac-sample` を同じ接頭辞の sample、参照先、共通サンプル文脈と照合し、役割名の食い違いと下位の総合テストカタログの抜けを直した。
- grade の F001（日次締めの合否境界）と F002（概要表と見出しの条件名）は、前の段で解消済みであることを確認した。追加の変更は不要だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 概要（対象外） | 対象外の「業務担当者」が、bac-sample と stc-sample の役割名「店番担当」と食い違っていた。扱う範囲も bac-sample の目的とずれていた。 | 「店番担当が現金販売を確定し、販売記録と在庫の変化を照合できるか」に直した。 | `vp-qe-kata-conformance`（bac-sample の共通前提「店番担当は店主代表または家族利用者代表」、Sample 記述標準「共通登場人物の役割名で記述する」） | - |
| R5-2 | R5 | 1. 概要（下位） | 下位が `SAC-PERF-01`・`SAC-PERF-02` の総合テストだけを挙げ、`SAC-PERF-03`・`SAC-PERF-04` を確かめる先がなかった。stc-index-sample は `stc-credit-balance` を `SAC-PERF-03`、`stc-daily-close` を `SAC-PERF-04` に対応させている。 | 2 つの総合テストカタログを、ファイルがないためバッククォートで仮置きし、stc-index-sample への wikilink とともに追記した。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（stc-index-sample の分割表） | - |
| R5-3 | R5 | 2.4. SAC-PERF-04 と概要表 | grade の F001（日次締めの合否境界）と F002（概要表と見出しの条件名）は、前の段で解消済みだった。閉店・開店の時刻を控えに記録し、概要表の名前を見出しにそろえている。nfr-performance-sample の `nfr-perf-006` の測定方法（ピーク時の試行のあと 3 回、最も長い時間で判定）とも一致する。 | - | `vp-qe-kata-conformance`（nfr-performance-sample の「測定・検証方法」） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sac-sample.md`: 概要の対象外にある「業務担当者」を、bac-sample と stc-sample に合わせて「店番担当」へ直した。あわせて、`SAC-PERF-03` と `SAC-PERF-04` を確かめる総合テストカタログ 2 件（バッククォートの仮置き）を下位として追記した。

## 3. 申し送り

- `SAC-PERF-03`・`SAC-PERF-04` の下位に追記した総合テストカタログ 2 件は、対応するファイルがまだないため `[[...]]` ではなくバッククォートで仮置きしている。ファイルを作成したら wikilink に置き換える。
- R5-1: R5 / 1. 概要（対象外） / 対象外の「業務担当者」が、bac-sample と stc-sample の役割名「店番担当」と食い違い、扱う範囲も bac-sample の目的とずれていた / 「店番担当が現金販売を確定し、販売記録と在庫の変化を照合できるか」に直した / `vp-qe-kata-conformance`（bac-sample の共通前提「店番担当は店主代表または家族利用者代表」、Sample 記述標準「共通登場人物の役割名で記述する」） / -
- R5-2: R5 / 1. 概要（下位） / 下位が `SAC-PERF-01`・`SAC-PERF-02` の総合テストだけを挙げ、`SAC-PERF-03`・`SAC-PERF-04` を確かめる先がなかった。stc-index-sample は `stc-credit-balance` を `SAC-PERF-03`、`stc-daily-close` を `SAC-PERF-04` に対応させている / 2 つの総合テストカタログを、ファイルがないためバッククォートで仮置きし、stc-index-sample への wikilink とともに追記した / `vp-qe-kata-conformance`、`vp-dev-change-impact`（stc-index-sample の分割表） / -
- R5-3: R5 / 2.4. SAC-PERF-04 と概要表 / grade の F001（日次締めの合否境界）と F002（概要表と見出しの条件名）は、前の段で解消済みだった。閉店・開店の時刻を控えに記録し、概要表の名前を見出しにそろえている。nfr-performance-sample の `nfr-perf-006` の測定方法（ピーク時の試行のあと 3 回、最も長い時間で判定）とも一致する / - / `vp-qe-kata-conformance`（nfr-performance-sample の「測定・検証方法」） / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/sac-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

参照先の nfr-performance-sample、tsp-index-sample、同じ接頭辞の bac-sample と stc-sample、stc-index-sample、Sample 記述標準の共通サンプル文脈と照合した。矛盾が見つかった箇所は sample 側だけを直し、rulebook は正として変更していない。F001・F002 は前の段で解消済みを確認し、`nfr-perf-006` の測定方法とも一致したため維持した。検査では markdownlint、prettier、lint:md:changed、lint:fm:changed、validate:schema が通った。
