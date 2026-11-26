---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-api-sample-140-20261126t144112z-85e0ea50
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-api-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-api-sample-140/T-KATA-REVIEW-ALL-ifx-api-sample-140-20261126T144112Z-85e0ea50/plan.md
  started_at: "2026-11-26T14:41:23.425Z"
  completed_at: "2026-11-26T14:49:23.639Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-api-sample
    - specdojo:ifx-api-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の主張 14 件を rulebook、`src/kata/yaml-schema-modeline.ts`、ifx-index-sample、Redocly CLI と突き合わせた。
- 不一致は F003 の 1 件だった。`ErrorResponse.details` に構造がなく、400 の「`details` の項目を直して送り直す」という指示と合っていなかった。
- `details` を `field` と `reason` を持つ要素の配列として定義し、400 の `description` も合わせて直した。
- 確かめられなかった主張は 2 件ある。429 の `Retry-After` を秒数に絞ること（正本がない）と、`X-API-Key` 認証（正本がない）である。
- F002・F004・F006 は前の段ですでに解消されていた。F001 は kata のレビューから外す観点のため扱っていない。F005 は R4 の観点の外のため扱っていない。
- Redocly lint と modeline 検査は、直す前後とも通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | docs/ja/specdojo/samples/ifx-api-sample.yaml `ErrorResponse.details`（旧 172〜174 行） | 400 の `description` は「`details` の項目を直して送り直す」と指示するが、`details` は構造のない `type: object` だった。店舗端末は不正な項目と理由を機械的に判別できなかった。 | `details` を `field` と `reason` を持つ要素の配列として定義し、400 の `description` を「`details` の `field` が指す項目を直して送り直す」に改めた。 | F003（`vp-dev-implementation-readiness`）。`reason` の 4 値は正本のない契約の例のため、人が採るか戻すかを確かめる。 | minor |
| 2 | R4 | docs/ja/specdojo/samples/ifx-api-sample.yaml 429 の `Retry-After` | `type: integer`・`minimum: 1` の秒数だけとしている。RFC 9110 は HTTP-date の形も許すため、秒数に絞るのは契約上の選択で、正本に照らして確かめられない。 | - | `vp-arc-technical-constraints`。本部との契約レビューで秒数だけでよいかを確かめる。 | note |
| 3 | R4 | Redocly CLI lint の警告 2 件 | 警告は `info-license`（`license` がない）と `no-server-example.com` の 2 件。後者は rulebook が例示用ドメインを求めるため直さない。`license` は rulebook の本文要件にないため足していない。 | - | `vp-qe-verifiability`。`npx --yes @redocly/cli@latest lint` で構造は valid。 | note |
| 4 | R4 | docs/ja/specdojo/samples/ifx-index-sample.yaml 36 行 | 「BA（開発担当）」と書いているが、sample-authoring-standard の共通サンプル文脈では開発担当の Role code は DEV である。ほかの kata のため直していない。 | ifx-index-sample の見直しで「DEV（開発担当）」へ直すか、BA の役割名に直すかを決める。 | `vp-qe-kata-conformance`。sample-authoring-standard の共通サンプル文脈と食い違う。 | minor |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-api-sample.yaml`: `ErrorResponse.details` を、`field`（例 `lines[0].product_code`）と `reason`（`REQUIRED`・`INVALID_FORMAT`・`OUT_OF_RANGE`・`UNKNOWN_PRODUCT`）を持つ要素の配列として定義した。400 の `description` は「`details` の `field` が指す項目を直して送り直す」に改めた。差分は 15 行追加・3 行削除。

## 3. 申し送り

- 確かめられなかった主張は 2 件で、どちらも正本がない。`Retry-After` を秒数に絞ることと、`X-API-Key` 認証である。表への記録は result の実施内容に残す。
- [minor/vp-dev-implementation-readiness] docs/ja/specdojo/samples/ifx-api-sample.yaml の `ErrorResponse.details`（旧 172〜174 行）: 400 の `description` は「`details` の項目を直して送り直す」と指示するが、`details` は構造のない `type: object` で、店舗端末が不正な項目と理由を機械的に判別できなかった（F003）。`details` を `field`（例 `lines[0].product_code`）と `reason`（`REQUIRED`・`INVALID_FORMAT`・`OUT_OF_RANGE`・`UNKNOWN_PRODUCT`）を持つ要素の配列として定義し、400 の `description` を「`details` の `field` が指す項目を直して送り直す」に改めた。`reason` の 4 値は正本のない契約の例である。人は採るか戻すかを確かめる。
- [note/vp-arc-technical-constraints] 429 の `Retry-After` を `type: integer`・`minimum: 1` の秒数だけとしている。RFC 9110 は HTTP-date の形も許すため、秒数に絞るのは契約上の選択で、正本に照らして確かめられない。本部との契約レビューで秒数だけでよいかを確かめる（直していない）。
- [note/vp-qe-verifiability] Redocly CLI（`npx --yes @redocly/cli@latest lint`、recommended 設定）で構造は valid。警告は `info-license`（`license` がない）と `no-server-example.com` の 2 件。後者は rulebook が例示用ドメインを求めるため直さない。`license` を求めるかは rulebook の本文要件にないため、足していない。
- [minor/vp-qe-kata-conformance・ほかの kata] docs/ja/specdojo/samples/ifx-index-sample.yaml 36 行は「BA（開発担当）」と書く。sample-authoring-standard の共通サンプル文脈では、開発担当の Role code は DEV である。ほかの kata なので直していない。ifx-index-sample の見直しで「DEV（開発担当）」へ直すか、BA の役割名に直すかを決める。
- F001（`vp-pm-plan-feasibility`）は kata-guide の「kata を agent でレビューする」で kata のレビューから外す観点のため、この段で扱っていない。F002・F004・F006 は前の段ですでに解消されていた。F005（生成ページが古い）は R4 の観点の外で、`docs/ja/specdojo/samples/generated/` は git 管理外のため作り直していない。close の前に yaml-pages を作り直す。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の YAML だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R4 に沿って実施した。plan の finding のうち、この段の観点に当たる F003 を修正した。F001 はこの段で扱わない観点、F005 は観点の外で、`docs/ja/specdojo/samples/generated/` は git 管理外のため作り直していない。F002・F004・F006 は前の段で解消済みだったため、繰り返していない。sample の主張は rulebook、`src/kata/yaml-schema-modeline.ts`、ifx-index-sample、Redocly CLI と突き合わせた。根拠のない推測での改訂は行っていない。
