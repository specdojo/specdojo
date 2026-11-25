---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-stakeholder-register-sample-150-20261125t045032z-d52d29a1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-150/T-KATA-REVIEW-ALL-prj-stakeholder-register-sample-150-20261125T045032Z-d52d29a1/plan.md
  started_at: "2026-11-25T04:50:41.905Z"
  completed_at: "2026-11-25T05:03:39.193Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、ステークホルダー登録簿の sample を、同系列の sample（概要・スコープと成功基準・憲章・組織定義・コミュニケーション計画）と用語集の記述に照らして確認した。食い違いのうち本書の側で直せるもの 4 件（R5-1〜R5-4）を修正した。
- 系列で語が割れている点（R5-5 の「初期公開」と「初期リリース」）と、相手側の直し案（R5-6 ほか）は、本書では変更せず handoff に残した。
- 変更後に `npx prettier --write` を実行した。runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` は成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`: Role code の記述を「採用済みの Role のうち関係者が担う `PO` と `DEV` を記載する」に改め、組織定義の sample と整合させた。エンゲージメント方針の責任者は、`STH-SHOP-OWNER` を `PM`、`STH-FAMILY-USER` を `BA` にした。備考の「家族利用者の代表者」を「家族利用者代表」にした。「簡易手順書」「手順書」は、スコープと成功基準の sample で定義した「操作メモ」に 3 か所そろえた。

## 3. 申し送り

- R5 の指摘一覧（executor の handoff R5-1〜R5-6 を表にした）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 1. 関係者一覧 | Role code を `PO` と `DEV` だけとする記述が、組織定義の sample（`PM`・`BA`・`QE` などを採用）と食い違う | 「採用済みの Role のうち関係者が担う `PO` と `DEV` だけを記載する」にした | `vp-qe-kata-conformance`（rulebook の対応 Role code、組織定義 sample の Role 採用表） | - | | R5-2 | R5 | 3. エンゲージメント方針 | `STH-SHOP-OWNER` と `STH-FAMILY-USER` の責任者が `DEV` で、コミュニケーション計画（判断依頼は `PM`、試用参加の依頼は `BA`）と組織定義の sample に合わない | `STH-SHOP-OWNER` を `PM`、`STH-FAMILY-USER` を `BA` にした。計画側を `DEV` に戻す案もあったが、採用済みの Role と主導の割り当ては組織定義が正本のため、登録簿側を合わせた。5. 見直し条件の見直し責任者 `DEV` は、`PM` が合う可能性があるが根拠が弱いので変えていない | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 | | R5-3 | R5 | 1. 関係者一覧（備考） | 「家族利用者の代表者」が、概要・スコープ・成功基準の sample の「家族利用者代表」と表記がずれる | 「家族利用者代表」にした | `vp-qe-kata-conformance` | - | | R5-4 | R5 | 2. 影響度/関心度分析、3. エンゲージメント方針、4. コミュニケーション要件 | 「簡易手順書」「手順書」が、スコープと成功基準の sample（AC-04）の文書名「操作メモ」と食い違う | 3 か所を「操作メモ」にした。相手側の案: pm-communication-plan-sample の `STH-FAMILY-USER` への試用参加の依頼の行で、手段の「簡易手順書と短時間の対面実演」を「操作メモと短時間の対面実演」にする | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 | | R5-5 | R5 | 全体（初期公開） | 本書と概要の sample は「初期公開」、スコープ・成功基準・憲章・コミュニケーション計画の sample は「初期リリース」で、系列の中で語が割れている。本書は `based_on` の概要に合わせているため直していない | 本書は変更なし。相手側の案: 概要が「初期公開」と定義しているので、他の 4 つの sample を「初期公開」にそろえる案と、概要と本書を「初期リリース」にそろえる案がある。用語集に登録がないため、`gl-planning.yaml` への登録も合わせて検討する | `vp-qe-kata-conformance` | 要判断 | | R5-6 | R5 | 全体（初期ステークホルダーとの対応） | 憲章の sample の 4. 初期ステークホルダーで、店主代表の責任が「リリース可否」と書かれ、本書の「初期公開の可否」と語がずれる。常連顧客が憲章にないのは、rulebook（主要関係者だけを要約）に沿う | 本書は変更なし。相手側の案: R5-5 で語を決めた後に、prj-charter-sample の `STH-SHOP-OWNER` の責任をその語にそろえる | `vp-qe-kata-conformance` | - |
- R5-1: R5 / 1. 関係者一覧 / 「Role code は採用済みの `PO` と `DEV` だけを使う」は、組織定義の sample（`PM`・`BA`・`QE` などを採用）と食い違い、ほかの Role が未採用と読める / 「対応 Role code には、採用済みの Role のうち関係者が担う `PO` と `DEV` だけを記載する」にした / `vp-qe-kata-conformance`（rulebook の「対応 Role code は採用済みのものだけ」、pm-organization-sample の Role 採用表） / -
- R5-2: R5 / 3. エンゲージメント方針 / 責任者が `STH-SHOP-OWNER` と `STH-FAMILY-USER` の行で `DEV` になっており、コミュニケーション計画の sample（判断依頼は `PM`、試用参加の依頼は `BA`）および組織定義の sample（判断案の整理は `PM`、利用者確認は `BA` が主導）と食い違う / `STH-SHOP-OWNER` の責任者を `PM`、`STH-FAMILY-USER` の責任者を `BA` にした / `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由: 登録簿はコミュニケーション計画より上流なので、計画側を `DEV` に戻す案もあった。採用済みの Role と主導の割り当ては組織定義が正本のため、登録簿側を合わせた。5. 見直し条件の見直し責任者の `DEV` は、組織定義で再配置が `PM` の扱いのため `PM` が合う可能性があるが、根拠が弱いので変えていない / 要判断
- R5-3: R5 / 1. 関係者一覧 / 備考の「家族利用者の代表者」が、概要・スコープ・成功基準の sample の「家族利用者代表」と表記がずれる / 「家族利用者代表」にした / `vp-qe-kata-conformance`（W8 の表記の統一） / -
- R5-4: R5 / 2. 影響度/関心度分析、3. エンゲージメント方針、4. コミュニケーション要件 / 「簡易手順書」「手順書」が、スコープと成功基準の sample（AC-04）で定義した文書名「操作メモ」と食い違う / 3 か所を「操作メモ」にした。相手側の案: pm-communication-plan-sample の `STH-FAMILY-USER` への試用参加の依頼の行で、手段の「簡易手順書と短時間の対面実演」を「操作メモと短時間の対面実演」にする / `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由: コミュニケーション計画の sample は本書の旧表記を引き継いでおり、本書だけを直すと一時的に計画側とずれる。成果物名はスコープと成功基準を正とした / 要判断
- R5-5: R5 / 全体（初期公開） / 本書と概要の sample は「初期公開」、スコープ・成功基準・憲章・コミュニケーション計画の sample は「初期リリース」を使い、系列の中で語が割れている。本書は根拠（`based_on`）の概要に合わせているため直していない / - / `vp-qe-kata-conformance`。相手側の案: 系列でどちらかの語にそろえる。概要の sample が「初期公開（店頭で使い始める最初の版の提供）」と定義しているため、スコープ・成功基準・憲章・コミュニケーション計画の sample を「初期公開」にそろえる案と、概要と本書を「初期リリース」にそろえる案がある。用語集に登録がないため、gl-planning.yaml への登録も合わせて検討する / 要判断
- R5-6: R5 / 全体（初期ステークホルダーとの対応） / 憲章の sample の 4. 初期ステークホルダーでは、店主代表の責任が「リリース可否」と書かれ、本書の「初期公開の可否」と語がずれる。常連顧客は認可判断に関わらないため、憲章に載っていないのは rulebook（主要関係者だけを要約）に沿う / - / `vp-qe-kata-conformance`。相手側の案: R5-5 で語を決めた後に、prj-charter-sample の `STH-SHOP-OWNER` の責任をその語にそろえる / -

## 4. 進め方と実践の型の適用

根拠にしたのは、rulebook の対応 Role code の規定、組織定義 sample の Role 採用表、コミュニケーション計画・スコープと成功基準・概要・憲章の各 sample、Sample 記述標準の共通サンプル文脈である。本書の側で直せる食い違いは、Role code の記述、責任者の Role、「家族利用者代表」の表記、「操作メモ」の用語の 4 件に限って修正した。rulebook と組織定義の記述を正とした。系列の語（初期公開と初期リリース）の割れと、相手側の sample の修正は、本書では変更せず handoff に案を書いた。grade と condense の finding は plan に展開されていなかった。frontmatter の `status` は変更していない。
