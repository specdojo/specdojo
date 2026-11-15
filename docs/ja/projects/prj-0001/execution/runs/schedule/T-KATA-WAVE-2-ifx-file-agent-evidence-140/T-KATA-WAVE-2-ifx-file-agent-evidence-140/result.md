---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-ifx-file-agent-evidence-140
  type: exec-result
  task_id: T-KATA-WAVE-2-ifx-file-agent-evidence-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T12:21:08.697Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - ifx-file-agent-evidence
    - specdojo:ifx-file-rulebook
    - specdojo:ifx-file-sample
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [x] 受け渡すファイルの置き場所・命名・形式・必須項目・書き手と読み手が記述されていること（BA / vp-ba-requirements-completeness）
- [x] ファイル連携の方式と失敗時の扱いが設計として妥当であること（ARC / vp-arc-technical-constraints）
- [x] 欠けた・壊れたファイルを扱うテストの設計に活用できること（QE / vp-qe-verifiability）

- [x] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 実践の型の確認

実践の型を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [x] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [x] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [x] sample: 粒度・文体・表の書き方が完成例として適切である（留保: needs-work 83 点、PJR-KV37 の次の回で直す）
- [x] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [x] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の実践の型は、劣化がないことを確認してチェックを付ける。

- [x] 成果物: `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`（留保: needs-work 89 点、PJR-6XWP の次の回で直す）
- [x] rulebook: `docs/ja/specdojo/rulebooks/ifx-file-rulebook.md`
- [x] sample: `docs/ja/specdojo/samples/ifx-file-sample.md`（留保: needs-work 83 点、PJR-KV37 の次の回で直す）

## 5. 確定判断

- judgement: 承認（留保付き）

## 6. 備考

- 留保付きで確定（人間の PO（indie）が 2026-11-16 に判断、0.8.0 に含める。wave-1 の ifd と同じ扱い）。rulebook は pass 91。
- 留保: 成果物 ifx-file-agent-evidence は needs-work 89 点（完了条件 DC-003 が未達。PJR-6XWP の次の回）、ifx-file-sample は needs-work 83 点（PJR-KV37 の次の回）。どちらも 0.8.0 の後に直す。
