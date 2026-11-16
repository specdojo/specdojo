---
specdojo:
  id: prj-0001:pjr-80f5-rulebook-deliverable-id-rules-audit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  difficulty: easy
  registered_at: "2026-11-08T12:31:17Z"
  completed_at: "2026-11-08T15:27:53Z"
  conclusion: "110 件の rulebook の ID の決まりを命名の標準と照らし、プロジェクト文書の ID を `<project-id>`: 付きにするなど 13 件の rulebook を直した"
  derived_from:
    - PJR-25B9
---

# PJR-80F5 rulebook の成果物の ID の決まりを命名の標準と照らして直す

## 1. 概要

rulebook の「ファイル命名・ID規則」の章に、成果物の例へ specdojo: を付けるなど命名の標準と違う決まりが残っていないかを洗い出し、プロダクト文書は namespace なし、プロジェクト文書は `<project-id>`:、specdojo: は同梱の型だけ、に揃える

## 2. 入力

- 2026-11-08、clis と uis の rulebook で成果物の例に specdojo: を付けた行が見つかり、orchestrator が直した（bdd・cdt・sf は正しかった）。ほかの rulebook は未確認。

## 3. 完了条件

- `docs/ja/specdojo/rulebooks/` のすべての rulebook の「ファイル命名・ID規則」の章（または ID の決まりを書いた箇所）を、[[specdojo:id-and-file-naming-standard]] と照らしている。照らした rulebook の一覧と、直したもの・直さなかったものを個票の対応結果に書いている。
- 成果物の ID の決まりを、プロダクト文書は namespace なし、プロジェクト文書は `<project-id>:`、`specdojo:` は SpecDojo が同梱する型（rulebook・sample・template など）だけ、に揃えている。成果物の例に `specdojo:` を付けた記述を直している。
- 直したのは ID の決まりの記述だけで、ほかの規則や章立てを変えていない。直した clis と uis の rulebook は変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ                                                                      |
| --- | ----------------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------- |
| 1   | rulebook の ID の決まりを洗い出し、命名の標準と照らす | executor | done | 全 110 件の rulebook を `specdojo:id-and-file-naming-standard` と照合     |
| 2   | 違う記述を直す                                        | executor | done | プロジェクト文書で `<project-id>:` が欠落していた 13 件の rulebook を修正 |
| 3   | 検査を流し、照らした一覧と結果を対応結果に書く        | executor | done | Prettier 検査を実施し、照合一覧と CHANGELOG 事項を対応結果に記録          |

## 5. 対応結果

### 5.1. 実施内容

- `docs/ja/specdojo/rulebooks/` 配下に存在する全 110 件の rulebook の「ファイル命名・ID規則」の章（または ID 規約・ファイル規約の記述箇所）を、[[specdojo:id-and-file-naming-standard]] と照合した。
- 照合基準に従い、各文書の成果物 ID 規則を以下の標準に揃えた:
  - **プロダクト文書**: namespace なし（ローカル ID）
  - **プロジェクト文書**: `<project-id>:<local-id>`
  - **SpecDojo が同梱する型（sample など）**: `specdojo:`（成果物の ID には `specdojo:` を付けない）
- 洗い出しの結果、成果物の例に誤って `specdojo:` を付けていたものは先行コミット（c12de26）で修正済みの `clis-rulebook` と `uis-rulebook` 以外には存在しないことを確認した（`bdd`, `cdt`, `sf` も正しかった）。
- 一方、プロジェクト文書（`type: project`）の rulebook において、成果物 ID から `<project-id>:` が欠落してローカル ID のみとなっていた 13 件の rulebook（`pm-risk-register`, `pm-issue-log`, `pm-change-request-log`, `dec`, `mm`, `pr`, `imp-business`, `imp-data`, `imp-interface`, `imp-operations`, `imp-test`, `trc-requirements-to-specs`, `trc-requirements-to-tests`）を検出し、ID 規約および推奨 Frontmatter 項目の記述を `<project-id>:` 付きに修正した。
- 直したのは ID の決まりの記述のみであり、ほかの規則や章立ては変更していない。また先行修正済みの `clis-rulebook` と `uis-rulebook` は変更していない。

### 5.2. 成果物

修正した 13 件の rulebook:

- [[specdojo:pm-risk-register-rulebook|docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md]]: ID を `<project-id>:pm-risk-register` に修正
- [[specdojo:pm-issue-log-rulebook|docs/ja/specdojo/rulebooks/pm-issue-log-rulebook.md]]: ID を `<project-id>:pm-issue-log` に修正
- [[specdojo:pm-change-request-log-rulebook|docs/ja/specdojo/rulebooks/pm-change-request-log-rulebook.md]]: ID を `<project-id>:pm-change-request-log` に修正
- [[specdojo:dec-rulebook|docs/ja/specdojo/rulebooks/dec-rulebook.md]]: ID を `<project-id>:dec-<NNNN>-<topic>` に修正
- [[specdojo:mm-rulebook|docs/ja/specdojo/rulebooks/mm-rulebook.md]]: ID を `<project-id>:mm-<yyyy-mm-dd>-<nn>` に修正
- [[specdojo:pr-rulebook|docs/ja/specdojo/rulebooks/pr-rulebook.md]]: ID を `<project-id>:pr-<yyyy-mm-dd>-<nn>` に修正
- [[specdojo:imp-business-rulebook|docs/ja/specdojo/rulebooks/imp-business-rulebook.md]]: ID を `<project-id>:imp-business` に修正
- [[specdojo:imp-data-rulebook|docs/ja/specdojo/rulebooks/imp-data-rulebook.md]]: ID を `<project-id>:imp-data` に修正
- [[specdojo:imp-interface-rulebook|docs/ja/specdojo/rulebooks/imp-interface-rulebook.md]]: ID を `<project-id>:imp-interface` に修正
- [[specdojo:imp-operations-rulebook|docs/ja/specdojo/rulebooks/imp-operations-rulebook.md]]: ID を `<project-id>:imp-operations` に修正
- [[specdojo:imp-test-rulebook|docs/ja/specdojo/rulebooks/imp-test-rulebook.md]]: ID を `<project-id>:imp-test` に修正
- [[specdojo:trc-requirements-to-specs-rulebook|docs/ja/specdojo/rulebooks/trc-requirements-to-specs-rulebook.md]]: ID を `<project-id>:trc-requirements-to-specs` に修正
- [[specdojo:trc-requirements-to-tests-rulebook|docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md]]: ID を `<project-id>:trc-requirements-to-tests` に修正

### 5.3. 照らした rulebook の一覧

全 110 件の rulebook と照合結果:

1. **直したもの（13 件）**:
   - `dec-rulebook.md`, `imp-business-rulebook.md`, `imp-data-rulebook.md`, `imp-interface-rulebook.md`, `imp-operations-rulebook.md`, `imp-test-rulebook.md`, `mm-rulebook.md`, `pm-change-request-log-rulebook.md`, `pm-issue-log-rulebook.md`, `pm-risk-register-rulebook.md`, `pr-rulebook.md`, `trc-requirements-to-specs-rulebook.md`, `trc-requirements-to-tests-rulebook.md`
2. **直さなかったもの（97 件）**:
   - **先行修正済み（2 件）**: `clis-rulebook.md`, `uis-rulebook.md`（先行コミット c12de26 で成果物 ID の `specdojo:` 例を解消し標準に準拠済み）
   - **プロダクト文書（namespace なしのローカル ID で整合、正しかった）（64 件）**:
     `atc-index-rulebook.md`, `atc-rulebook.md`, `bac-rulebook.md`, `bdd-rulebook.md`, `bds-rulebook.md`, `bes-index-rulebook.md`, `bes-rulebook.md`, `bps-rulebook.md`, `br-rulebook.md`, `cdfd-rulebook.md`, `cdfd-uc-rulebook.md`, `cdsd-rulebook.md`, `cdt-rulebook.md`, `cnd-rulebook.md`, `cop-index-rulebook.md`, `cop-rulebook.md`, `cpd-rulebook.md`, `cxd-rulebook.md`, `dmd-index-rulebook.md`, `dmd-rulebook.md`, `etc-index-rulebook.md`, `etc-rulebook.md`, `gl-rulebook.md`, `ifx-api-rulebook.md`, `ifx-cmd-rulebook.md`, `ifx-file-rulebook.md`, `ifx-index-rulebook.md`, `ifx-msg-rulebook.md`, `itc-index-rulebook.md`, `itc-rulebook.md`, `mip-index-rulebook.md`, `nfr-availability-rulebook.md`, `nfr-index-rulebook.md`, `nfr-integrity-rulebook.md`, `nfr-maintainability-rulebook.md`, `nfr-operations-rulebook.md`, `nfr-performance-rulebook.md`, `nfr-reliability-rulebook.md`, `nfr-security-safety-rulebook.md`, `nfr-usability-rulebook.md`, `ntp-rulebook.md`, `opd-index-rulebook.md`, `opd-rulebook.md`, `opr-index-rulebook.md`, `opr-rulebook.md`, `otp-index-rulebook.md`, `otp-rulebook.md`, `sac-rulebook.md`, `sf-index-rulebook.md`, `sf-rulebook.md`, `sld-rulebook.md`, `stc-index-rulebook.md`, `stc-rulebook.md`, `stsd-rulebook.md`, `sysd-critical-flows-rulebook.md`, `sysd-cross-cutting-policy-rulebook.md`, `sysd-index-rulebook.md`, `sysd-rulebook.md`, `tsd-index-rulebook.md`, `tsd-rulebook.md`, `tsp-index-rulebook.md`, `utc-index-rulebook.md`, `utc-rulebook.md`
   - **プロジェクト文書（すでに `<project-id>:` で正しく定義済み）（18 件）**:
     `dct-index-rulebook.md`, `dct-rulebook.md`, `pjr-rulebook.md`, `pm-communication-plan-rulebook.md`, `pm-members-rulebook.md`, `pm-organization-rulebook.md`, `pm-plan-rulebook.md`, `pm-quality-management-plan-rulebook.md`, `pm-raci-rulebook.md`, `pm-roles-rulebook.md`, `prj-assumptions-constraints-dependencies-rulebook.md`, `prj-charter-rulebook.md`, `prj-comparison-of-alternatives-rulebook.md`, `prj-issues-and-approach-rulebook.md`, `prj-overview-rulebook.md`, `prj-scope-rulebook.md`, `prj-stakeholder-register-rulebook.md`, `prj-success-criteria-and-acceptance-criteria-rulebook.md`
   - **記法ルール・非推奨・スケジュール（成果物固有 ID を持たない、または現状で標準に整合）（13 件）**:
     `ccd-mermaid-rulebook.md`, `cdfd-d2-rulebook.md`, `cdfd-mermaid-rulebook.md`, `cdfd-overview-rulebook.md`, `cld-rulebook.md`, `cnd-mermaid-rulebook.md`, `cpd-mermaid-rulebook.md`, `cstd-rulebook.md`, `cxd-mermaid-rulebook.md`, `ifd-mermaid-rulebook.md`, `sch-rulebook.md`, `stsd-mermaid-rulebook.md`, `tml-rulebook.md`

### 5.4. CHANGELOG に書く事項

- **区分**: 変更
- **行の文案**:
  - プロジェクト文書向け rulebook（`pm-risk-register`、`pm-issue-log`、`pm-change-request-log`、`dec`、`mm`、`pr`、`imp-*`、`trc-*`）の成果物 ID 規則をドキュメント ID 標準（`<project-id>:<local-id>`）に合わせて修正

### 5.5. 残課題

- なし

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-25b9-clis-kata-confirm-diagram-references]]
- 規範: [[specdojo:id-and-file-naming-standard]]
