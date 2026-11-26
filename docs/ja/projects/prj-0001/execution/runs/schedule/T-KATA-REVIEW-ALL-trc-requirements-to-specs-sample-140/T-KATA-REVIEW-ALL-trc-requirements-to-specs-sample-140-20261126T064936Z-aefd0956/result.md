---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-specs-sample-140-20261126t064936z-aefd0956
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-140/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-140-20261126T064936Z-aefd0956/plan.md
  started_at: "2026-11-26T06:49:46.545Z"
  completed_at: "2026-11-26T06:56:08.274Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の事実の主張（frontmatter の `type`・`status`・`based_on`・`supersedes`・ID の形、`relations.satisfies`、生成の手順、充足状況の判定と各行、件数、接頭辞、Role code の `PO`・`DEV`・`QE`）を schema・rulebook・deliverables-reference・pm-roles-sample と突き合わせた。すべて一致し、誤りはなかった。
- 誤りがないため sample は編集していない。変更ファイルはなく、executor が実行した markdownlint は 0 件、runner の lint と schema 検証も成功した。
- F001（使う人の欄の表記）は R4 の観点ではない。前の段で列名が「使う役割（Role code）」になり、値も Role code で書かれていて解消済みである。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R4 の確かめの表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: 1. frontmatter の `type: project` / docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / `deliverableType` の列挙値を読む / 一致 / enum に `project`。2. `status: draft`、`based_on`・`supersedes`・ID の形 / docs/specdojo/schemas/v1/common-frontmatter.schema.yaml / status の列挙値・`idRefArray`・`idRef` の pattern を読む / 一致 / enum が draft・ready・deprecated、pattern が `^[a-z0-9][a-z0-9-:]*$`。3. `relations.satisfies` を対応の正本とすること / deliverable-frontmatter.schema.yaml / `relations.satisfies` を読む / 一致 / 説明は「この成果物が充足する要求・要件・受入条件のID」。4. `rulebook` の値、`based_on` に生成元の文書 ID を書くこと / trc-requirements-to-specs-rulebook の「推奨 Frontmatter 項目」 / 読む / 一致。5. 生成コマンドがなく手作業で生成すること、「生成の手順」と照合の手順 / rulebook の「生成の手順」 / 読む / 一致 / 「生成コマンドはないため、次の手順で生成し」。6. 充足状況の値と各行の判定 / rulebook の「充足状況の判定」 / 条件と各行を照らす / 一致 / `req-r1-002` は `ifx-msg-stock` が `draft` なので `一部充足`、`req-r1-004` は対応仕様がないので `未着手`、`req-r1-001`・`req-r1-003` は対応仕様がすべて `ready` でギャップなしなので `充足`。7. 件数（仕様 7 件、充足 2・一部充足 1・未着手 1・合計 4、要求に対応しない仕様 2 件） / 本文の表と frontmatter の `based_on` / 数える / 一致。8. 接頭辞 `sf-*`・`bes-*`、`bac-*` は要求側 / rulebook の「位置づけ」 / 読む / 一致。9. `ifx-msg-*`、`nfr-integrity` / docs/ja/specdojo/references/deliverables-reference.md / grep / 一致 / 「外部メッセージ仕様 `ifx-msg-&lt;term&gt;.yaml`」「非機能要件 / 完全性 `nfr-integrity`」（監査証跡を含む）。10. Role code の `PO`・`DEV`・`QE` / docs/ja/specdojo/samples/pm-roles-sample.yaml / grep / 一致 / 3 つの code が定義されている。11. コミットハッシュ・生成日・`req-r2-*`・業務の値 / 正本なし / 対象外 / 共通サンプル文脈の仮定で食い違いなし。
- F001（`vp-ux-language-consistency`、使う人の欄の表記）: R4 の観点ではない。前の段で列名が「使う役割（Role code）」になり、値も `DEV`・`QE`・`PO` の Role code になって解消済みで、pm-roles-sample の code と一致する。次のアクションは不要。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実の主張を schema（`docs/specdojo/schemas/v1/`）、rulebook、deliverables-reference、pm-roles-sample と照合した。主張ごとの確かめの表は executor の handoff に記録されている。誤りは見つからず、確かめられなかった主張もなかった。コミットハッシュ、生成日、`req-r2-*`、業務の値は正本がなく、共通サンプル文脈と食い違わないため対象外とした。F001 は前の段で解消済みのため追加の対応は不要で、sample は維持した。
