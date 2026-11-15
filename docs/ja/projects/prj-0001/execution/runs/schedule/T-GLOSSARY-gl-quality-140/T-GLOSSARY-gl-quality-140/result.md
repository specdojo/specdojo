---
specdojo:
  id: prj-0001:xer-t-glossary-gl-quality-140
  type: exec-result
  task_id: T-GLOSSARY-gl-quality-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-12T22:45:32.205Z"
  agent: indie
  execution: human
  approach: finalize
  targets:
    - gl-quality
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる文書だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 領域の主要用語が洗い出され、定義・別名・分類が正確に記述されていること（BA / vp-ba-requirements-completeness）
- [ ] 用語スコープと定義の妥当性を承認できること（PO / vp-po-purpose-alignment）
- [ ] 技術実装・CLI の引数・schema の項目名の参照として使えること（ARC / vp-arc-cross-document-consistency）
- [ ] gl-common とほかの領域の用語集と重複せず、文書間の用語が一貫していること（QE / vp-qe-omissions-consistency）
- [ ] schema の条件付きの決まり（if・then などで、状態や種類によって必須の項目が変わるもの）を、用語どうしの関係（どの状態・種類のときに使うか）として短く書き、条件を写さず schema を正本として参照していること（ARC / vp-arc-cross-document-consistency）

- [ ] 確定対象の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。

- [ ] 成果物: `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml`

## 4. 確定判断

- judgement: _TODO_（承認 / 差し戻し）

## 5. 備考

_TODO_: 差し戻し理由、確定対象以外に修正した内容、後続タスクへの申し送りなど、必要な場合のみ記入する（なければ削除）。
