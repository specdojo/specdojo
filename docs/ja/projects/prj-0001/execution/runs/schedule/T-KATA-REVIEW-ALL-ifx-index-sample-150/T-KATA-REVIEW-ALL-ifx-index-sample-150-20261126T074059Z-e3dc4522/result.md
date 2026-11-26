---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-index-sample-150-20261126t074059z-e3dc4522
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-index-sample-150/T-KATA-REVIEW-ALL-ifx-index-sample-150-20261126T074059Z-e3dc4522/plan.md
  started_at: "2026-11-26T07:41:10.569Z"
  completed_at: "2026-11-26T07:48:38.551Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-index-sample
    - specdojo:ifx-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/ifx-index-sample.yaml` を見直し、grade の F001 を解消した。
- 「本部への売上登録」のコメントに、`specdojo:ifx-api-sample` が CLI 仕様などの参照する架空正本 `ifx-api-kinuya-sales.yaml` の完成例にあたることを追記し、`spec_ref` と `specdojo:clis-sample` の参照名の対応関係を示した。
- schema 検査と Prettier 検査は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` なども成功している。
- 相手側の `specdojo:clis-sample` の参照は変更せず、直す案を指摘として残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 整合 | docs/ja/specdojo/samples/ifx-index-sample.yaml の「本部への売上登録」のコメント（`spec_ref: specdojo:ifx-api-sample` の直後） | `spec_ref` は `specdojo:ifx-api-sample` を指している。一方、仮定を共有する `specdojo:clis-sample` の入出力表は同じ契約を、まだ作られていない `ifx-api-kinuya-sales.yaml` として参照しており、売上登録の詳細契約の扱いが両文書で一致しない（F001）。 | 詳細契約のコメントに「CLI 仕様などが参照する架空正本 `ifx-api-kinuya-sales.yaml` の完成例にあたる」と 1 文を足し、対応関係を示した。 | grade の F001（`vp-qe-kata-conformance`）、`clis-sample` の 64・76・124 行、`ifx-api-sample` の `info.description` | - |
| 2 | R5 整合 | docs/ja/specdojo/samples/clis-sample.md の 64・76 行（入出力表）と 124 行（本部との契約・障害回復） | 売上登録の詳細契約を、まだ作られていない `ifx-api-kinuya-sales.yaml` としてだけ参照している。完成例の `specdojo:ifx-api-sample` が既にあるのに、そこへたどれない。相手側の指摘のため変更していない。 | 案 A は、売上登録の参照を `[[specdojo:ifx-api-sample\|本部売上登録API]]` に付け替える。案 B は、架空正本の名前を残し、完成例として `specdojo:ifx-api-sample` を参照すると書き足す。同じ名前は cxd-sample・sysd-index-sample・sysd-critical-flows-sample・sysd-cross-cutting-policy-sample・ifx-file-sample でも参照しているため、どちらにするかは横並びで決める。 | grep で確認した各 sample の参照、`ifx-api-sample` の `x-spec-meta.based_on`（`specdojo:ifx-index-sample`） | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: 「本部への売上登録」の `spec_ref: specdojo:ifx-api-sample` 直後のコメントに、`specdojo:ifx-api-sample` が架空正本 `ifx-api-kinuya-sales.yaml` の完成例にあたるという 1 文を追記した（2 行追加・1 行削除）。

## 3. 申し送り

- `docs/ja/specdojo/samples/clis-sample.md` ほか、`ifx-api-kinuya-sales.yaml` を参照する各 sample の扱いは、横並びで決める必要がある（指摘 No: 2 を参照）。
- No: 1 / 段: R5 整合 / 箇所: docs/ja/specdojo/samples/ifx-index-sample.yaml の「本部への売上登録」のコメント（`spec_ref: specdojo:ifx-api-sample` の直後） / 指摘: `spec_ref` は `specdojo:ifx-api-sample` を指しているが、仮定を共有する `specdojo:clis-sample` の入出力表は同じ契約を、まだ作られていない `ifx-api-kinuya-sales.yaml` として参照しており、売上登録の詳細契約の扱いが両文書で一致しない（F001） / 直した案: 詳細契約のコメントに「CLI 仕様などが参照する架空正本 `ifx-api-kinuya-sales.yaml` の完成例にあたる」と 1 文を足し、対応関係を示した / 根拠: grade の F001（`vp-qe-kata-conformance`）、clis-sample の 64・76・124 行、ifx-api-sample の `info.description` / 印: なし
- No: 2 / 段: R5 整合 / 箇所: docs/ja/specdojo/samples/clis-sample.md の 64・76 行（入出力表）と 124 行（本部との契約・障害回復） / 指摘: 売上登録の詳細契約を、まだ作られていない `ifx-api-kinuya-sales.yaml` としてだけ参照している。完成例の `specdojo:ifx-api-sample` が既にあるのに、そこへたどれない（相手側の指摘のため変更していない） / 直した案: 案A は売上登録の参照を `[[specdojo:ifx-api-sample\|本部売上登録API]]` に付け替える。案B は架空正本の名前を残し、完成例として `specdojo:ifx-api-sample` を参照すると書き足す。同じ名前は cxd-sample・sysd-index-sample・sysd-critical-flows-sample・sysd-cross-cutting-policy-sample・ifx-file-sample でも参照しているため、どちらにするかは横並びで決める / 根拠: grep で確認した各 sample の参照、ifx-api-sample の `x-spec-meta.based_on`（`specdojo:ifx-index-sample`） / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の YAML だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠は grade の F001（`vp-qe-kata-conformance`）、`clis-sample` の 64・76・124 行の参照、`ifx-api-sample` の `info.description` と `x-spec-meta.based_on` である。`ifx-index-sample` 側は、詳細契約のコメントで対応関係を示す最小の修正にとどめた。それ以外の記述は整合しているため維持した。F001 の問題は解消したと判断し、未解消の finding はない。相手側の `clis-sample` は変更せず、直す案を指摘 No: 2 に残した。
