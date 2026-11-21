---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cnd-specdojo-140
  type: exec-result
  task_id: T-KATA-WAVE-1-cnd-specdojo-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T10:30:45.190Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - cnd-specdojo
    - specdojo:cnd-rulebook
    - specdojo:cnd-recipe
    - specdojo:cnd-sample
    - specdojo:cnd-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 主要コンテナ構成・データフローが業務観点で理解できること（BA / vp-ba-requirements-completeness）
- [ ] コンテナ構成とデプロイ方針を承認できること（PO / vp-po-decision-readiness）
- [ ] インフラ設計・デプロイ構成の入力として参照できること（ARC / vp-arc-technical-constraints）
- [ ] コンテナ間結合テストの対象が識別できること（QE / vp-qe-verifiability）
- [ ] 実装コンポーネントの配備先・通信経路の参照として使えること（DEV / vp-dev-implementation-readiness）

- [ ] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 実践の型の確認

実践の型を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の実践の型は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/product/030-architecture/010-c4/cnd-specdojo.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/cnd-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/cnd-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/cnd-sample.md`
- [ ] template: `docs/ja/specdojo/templates/cnd-template.md`

## 5. 確定判断

- judgement: 差し戻し

## 6. 備考

- 差し戻し（人間の PO（indie）が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 82 点で完了条件 4/5。
- 主な理由: コンテナ構成と配備の方針の基準が本文で定まっておらず、PO が承認できない（DC-002）。留保した範囲（文書サイトの閲覧の認証と配信、REL-10）と、今の時点で承認する範囲の区別も本文で示す必要がある。
- 手直しは register の todo（fully-guided、最新の grade の指摘を取り込む）で行い、grade し直してから確定に戻す。
