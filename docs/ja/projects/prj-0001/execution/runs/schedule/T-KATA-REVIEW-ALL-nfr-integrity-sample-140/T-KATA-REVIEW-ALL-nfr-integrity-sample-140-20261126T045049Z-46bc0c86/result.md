---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-integrity-sample-140-20261126t045049z-46bc0c86
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-integrity-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-integrity-sample-140/T-KATA-REVIEW-ALL-nfr-integrity-sample-140-20261126T045049Z-46bc0c86/plan.md
  started_at: "2026-11-26T04:51:00.462Z"
  completed_at: "2026-11-26T04:59:22.389Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample に書かれた事実を schema と rulebook に突き合わせた。誤りは見つからず、sample は編集していない（`evidence.changes` は空）。
- 確かめた主張は 12 件ある。一致したのは、`specdojo.type`、`rulebook`、`part_of`、`based_on` の既定値、Role code `OPS`・`QE`、監査証跡の nickname、要件 ID `nfr-int-001`〜`nfr-int-006`、関連 ID の形式、指標名、用語の統一、改ざん検知と試験 `stc-integrity` の対応である。
- 確かめられなかった主張は 2 件ある。`&lt;term&gt;` が用語集のキーにあるか、青色申告の保存期間 7 年の `_ASSUMPTION_` である。後者は業務上の仮定で正本がない。
- grade の finding 3 件のうち、F001 は前の段で解消済み、F002 は rulebook 側の修正事項、F003 は kata の段のレビューから外す観点のため、いずれも R4 では扱っていない。
- runner の検証では、`npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run validate:schema` が成功した。そのほかは変更種別により `not_applicable` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| F001 | R4 | line=43 保持期間の根拠（`based_on` 未設定） | `vp-qe-omissions-consistency` の指摘。前の段（R2）で保持期間の根拠を `dec-*` に記録する導線が足されており、解消済みである。 | - | executor の handoff。R2 の観点であり、R4 では扱わない。 | - |
| F002 | R4 | line=1 sample 全体と `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` の「全体方針」 | rulebook の `_UNDECIDED_` が「sample は 5 章に揃っていない」と書いているが、sample はすでに 5 章に揃っている。直す先は sample ではなく rulebook である。 | rulebook の記述を現状に合わせて直し、`recipe` と `template` の要否を判断する。 | executor の handoff。`vp-qe-kata-conformance` の指摘で、rulebook を正とする。 | - |
| F003 | R4 | line=45 オフライン時の入力方針の `_UNDECIDED_` | `vp-ops-release-readiness` の指摘。kata ガイドの「kata の観点の組」が kata の段のレビューから外すと定めた観点のため、R4 では扱わない。 | - | executor の handoff。kata ガイドの「kata の観点の組」。 | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- F002 の対応先は `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` である。rulebook の `_UNDECIDED_` を実態の 5 章に合わせて直し、`recipe` と `template` の要否を判断する別タスクが必要である。
- R4 の確かめの表（result の実施内容に描く）: 1 `specdojo.type: requirement` は `deliverable-frontmatter.schema.yaml` の列挙値と rulebook の指定に一致する。2 `rulebook: specdojo:nfr-integrity-rulebook` は rulebook の `id` に一致する。3 `part_of: [specdojo:nfr-index-sample]` は親の sample の `id` と rulebook の求めに一致する。4 `based_on: []` は `common-frontmatter.schema.yaml` の `idRefArray`（既定値 `[]`）に一致する。5 Role code `OPS`・`QE` は `pm-roles.schema.yaml` の `code` の列挙値に一致する。6 監査証跡の nickname は `pm-members.schema.yaml` の必須項目 `nickname` に一致する。7 要件 ID `nfr-int-001`〜`nfr-int-006` は rulebook の `nfr-int-&lt;連番&gt;` の規則に合い、欠番はない。8 `nfr-security-safety`・`sac-integrity`・`stc-integrity`・`opd-integrity-check`・`opr-integrity-check`・`dec-*` は各 rulebook の ID の形式に一致する。ただし `&lt;term&gt;` が用語集のキーにあるかは確かめていない。9 指標の名前は rulebook の記述ガイドの例に一致する。10 用語「整合性チェック」で統一され、言い換えはない。11 改ざん検知の要件 `nfr-int-006` を試験 `stc-integrity` で判定しており、rulebook の求めに一致する。12 青色申告の保存期間 7 年は `_ASSUMPTION_` の業務上の仮定で、正本がなく確かめていない（一般に帳簿は 7 年、一部の書類は 5 年）。
- F001（`vp-qe-omissions-consistency`、R2 の観点）: 前の段で保持期間の根拠を `dec-*` に記録する導線が足されており、指摘は解消済み。R4 では扱わない。
- F002（`vp-qe-kata-conformance`）: 直す先は sample ではなく `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` である。「全体方針」の `_UNDECIDED_` が「sample は 5 章に揃っていない」と書いているが、sample はすでに 5 章に揃っている。次の作業: rulebook の記述を直し、`recipe`・`template` の要否を判断する。
- F003（`vp-ops-release-readiness`）: kata ガイドの「kata の観点の組」が kata の段のレビューから外すと定めた観点のため、扱わない。
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変えていないため）
- 適用外の検証: `npm run validate:schema:file`（変えた `*.yaml` / `*.yml` のファイルがないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の記述を schema（`deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`、`pm-roles.schema.yaml`、`pm-members.schema.yaml`）と rulebook に突き合わせた。誤りは見つからなかったため、記述は維持した。確かめられなかった主張（`&lt;term&gt;` の用語集キー、保存期間 7 年）は推測で直さず、確かめの表に残した。
