---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cpd-sample-120-20261125t004234z-e217adb1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cpd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cpd-sample-120/T-KATA-REVIEW-ALL-cpd-sample-120-20261125T004234Z-e217adb1/plan.md
  started_at: "2026-11-25T00:42:43.440Z"
  completed_at: "2026-11-25T00:51:15.708Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cpd-sample
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）レビューを実施し、`docs/ja/specdojo/samples/cpd-sample.md` の「1. 概要」を template の段落順と前提から結論への流れに合わせて並べ替えた。
- 指摘は 3 件。R2-1 と R2-2 は sample を直し、R2-3 は rulebook と template 側の判断が要るため sample を変えず「要判断」とした。
- runner の検証では `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` が成功した。executor の `npx prettier --check` も成功した。変更種別により対象外となった検査は `not_applicable` と記録されている。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: 「1. 概要」の構成を整理した（3 行追加・3 行削除）。第 1 段落にあった業務の期待価値の文を、第 2 段落の結び「本分割は…」へ統合した。これで業務課題、放置時の影響、分割が支える価値の順に読める。対象外の文は `_ASSUMPTION_` の段落から第 1 段落へ移した。`_ASSUMPTION_` の段落は確定度と CLI 例の位置づけだけにした。

## 3. 申し送り

- 指摘一覧（R2-1〜R2-3）は executor の handoff に記載のとおり。表は重ねない。R2-3 は sample 以外の変更が要るため、rulebook または template の担当者による判断が必要。
- R2-1: R2 / 1. 概要 / 第1段落に業務の期待価値の文（店主代表と家族利用者代表が…確認できるようにする）があり、第2段落の業務根拠・結びと離れて同じ主張が二か所に分かれていた / 第1段落から削除し、第2段落の結び「本分割は…」に統合して、業務課題→放置時の影響→分割が支える価値の順にした / vp-arc-document-structure、rulebook「記述ガイド」の「概要」、template「1. 概要」の1つ目の `_TODO_` / -
- R2-2: R2 / 1. 概要 / 対象範囲・対象外の文が確定度を示す `_ASSUMPTION_` の段落に混在し、template の1つ目の `_TODO_`（対象コンテナ・分割の目的・用途・対象外）と2つ目の `_TODO_`（設計案と確認済み構成の区別）の分担と合っていなかった / 対象外の文を第1段落へ移し、`_ASSUMPTION_` の段落を確定度と CLI 例の位置づけだけにした / vp-arc-document-structure、template「1. 概要」の `_TODO_` の順、rulebook「記述ガイド」の「概要」 / -
- R2-3: R2 / 4.2. コンポーネント間の検証対象 / template は表の後に「`_TODO_:` 文書検査・描画確認の証跡を参照する。」を置くが、sample に該当する段落がない / - / vp-qe-omissions-consistency。rulebook の「全体方針」は文書の整形・lint を業務の受入確認に含めないとしており、sample に証跡を書くと架空の事実になるため、sample は変えなかった。相手側の案: cpd-template の当該 `_TODO_` を削除するか、rulebook の記述ガイド「検証と合意の判定」の描画確認（要素名・ラベルの判読）を指す記述に書き直す。選ばなかった案: sample に架空の証跡参照を足す / 要判断

## 4. 進め方と実践の型の適用

根拠にした規範は、`vp-arc-document-structure`、`cpd-rulebook` の「記述ガイド」の「概要」と「全体方針」、`cpd-template` の「1. 概要」の `_TODO_` の順である。R1 の指摘は繰り返さなかった。 改訂した記述は「1. 概要」で、R2-1 の価値の文の統合と R2-2 の対象外の文の移動の 2 点である。維持した記述は、他の章と、業務根拠・放置時の影響の記述である。 R2-3 では、template が「4.2. コンポーネント間の検証対象」の表の後に文書検査・描画確認の証跡参照の `_TODO_` を置いている。rulebook は文書の整形・lint を業務の受入確認に含めないとしている。sample に証跡を書くと架空の事実になるため、rulebook を正として sample は変えず、「要判断」とした。直す案は 2 つある。1 つは、`cpd-template` の当該 `_TODO_` を削除する案。もう 1 つは、rulebook の描画確認（要素名・ラベルの判読）を指す記述に書き直す案。選ばなかった案は、sample に架空の証跡参照を足すこと。 `status` は変更していない。
