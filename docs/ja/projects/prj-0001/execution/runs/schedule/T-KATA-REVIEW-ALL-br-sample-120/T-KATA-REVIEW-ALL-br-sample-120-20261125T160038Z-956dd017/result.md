---
specdojo:
  id: prj-0001:xer-t-kata-review-all-br-sample-120-20261125t160038z-956dd017
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-br-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-br-sample-120/T-KATA-REVIEW-ALL-br-sample-120-20261125T160038Z-956dd017/plan.md
  started_at: "2026-11-25T16:00:48.246Z"
  completed_at: "2026-11-25T16:09:30.943Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:br-sample
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として br-sample を br-template の構成に沿って見直した。H1 直下に判定内容を述べる概要の1文を足し、概要の項目名を template の項目（業務価値・利用者・適用場面・適用範囲・対象外）にそろえた。
- 章の順（入力、判定規則、判定例、出力、例外、メモ）と表の列は template と一致しており、変更していない。
- plan の F001（第6章末尾に承認可能となる条件がない）は、R1 が直した版ですでに解消していたため、追加の変更はしていない。
- rulebook と template の間に食い違いが1点あり、sample 側では解消できない。直す案を指摘に記録した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要（H1 直下） | br-template には H1 直下の概要の1文（`_DELIVERABLE_OVERVIEW_`）と、概要の項目「業務価値・利用者・適用場面・適用範囲・対象外」がある。sample は概要の1文がなく、項目名も「判断・利用者・場面・前提・対象外」で template と違っていた。 | H1 直下に判定内容の1文を足した。概要の項目名を template にそろえ、「判断」の価値の文を「業務価値」へ、「前提」を「適用範囲」へ移した。 | vp-arc-document-structure、br-rulebook の本文要件（見出し順・記入欄の骨組みは template を正本とする） | 要判断（判断の目的が概要の章の外、H1 直下に出る。選ばなかった案: 「判断」の項目を概要の章に残し、template の項目から外れたままにする） |
| R2-2 | R2 | 1. 概要（kata 間の食い違い） | rulebook の本文要件は概要の章に「判断の目的」を求めている。一方で br-template の概要の項目に「判断」がなく、sample でどちらにも合わせきれない。 | 相手側を直す案: br-template の概要の項目の先頭に「判断: `_TODO_:` 引き受ける判断と結果」を足す。または br-rulebook の本文要件の概要の行に「判断の目的は H1 直下の概要の1文に書く」と書く。 | vp-qe-omissions-consistency | 要判断 |
| R2-3 | R2 | 6. メモ / 将来課題 | grade F001（承認できる条件が書かれていない）は、R1 が直した版で「判定例 1〜9 の期待結果が R-01〜R-03 と E-01〜E-03 の順序から一意に導ける…時点で承認できる」と書かれていて、template の章末の記入欄に合っている。 | - | vp-qe-kata-conformance、br-template の章末の「承認可能となる条件」 | - |
| R2-4 | R2 | 2. 入力 〜 5. 例外 / 異常系 | 章の順（入力→判定規則→判定例→出力→例外→メモ）と表の列が template と一致している。表の後の本文（出力の入力不備の扱い、例外の優先順）も、表を補う位置に置かれていて、前提から結論の順に読める。 | - | vp-arc-document-structure | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/br-sample.md`: H1 直下に判定内容の概要1文を追加した。概要の項目名を「判断・利用者・場面・前提・対象外」から template の「業務価値・利用者・適用場面・適用範囲・対象外」に変更した。「判断」にあった価値の文は「業務価値」へ、「前提」は「適用範囲」へ移した。差分は5行追加、3行削除。

## 3. 申し送り

- 検証: executor の `npx prettier --check` と、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。変更種別に該当しない検査は `not_applicable` だった。
- R2-2 の kata 間の食い違いは、rulebook または template を直さない限り解消しない。本タスクでは sample 以外を変更しないため、直す案を残すだけにした。
- R2-1: R2 / 1. 概要（H1 直下） / br-template には H1 直下の概要の1文（`_DELIVERABLE_OVERVIEW_`）と、概要の項目「業務価値・利用者・適用場面・適用範囲・対象外」がある。sample は概要の1文がなく、項目名も「判断・利用者・場面・前提・対象外」で template と違っていた / H1 直下に判定内容の1文を足した。概要の項目名を template にそろえ、「判断」にあった価値の文を「業務価値」、「前提」を「適用範囲」に移した / vp-arc-document-structure、br-rulebook の本文要件（見出し順・記入欄の骨組みは template を正本とする） / 要判断（判断の目的が概要の章の外、H1 直下に出る。選ばなかった案: 「判断」の項目を概要の章に残し、template の項目から外れたままにする）
- R2-2: R2 / 1. 概要（kata 間の食い違い） / rulebook の本文要件は、概要の章に「判断の目的」を求めている。一方で br-template の概要の項目に「判断」がなく、sample でどちらにも合わせきれない / - / vp-qe-omissions-consistency。相手側を直す案: br-template の概要の項目の先頭に「判断: `_TODO_:` 引き受ける判断と結果」を足す。または br-rulebook の本文要件の概要の行に「判断の目的は H1 直下の概要の1文に書く」と書く / 要判断
- R2-3: R2 / 6. メモ / 将来課題 / grade F001（承認できる条件が書かれていない）は、R1 が直した版で「判定例 1〜9 の期待結果が R-01〜R-03 と E-01〜E-03 の順序から一意に導ける…時点で承認できる」と書かれていて、template の章末の記入欄に合っている / - / vp-qe-kata-conformance、br-template の章末の「承認可能となる条件」 / -
- R2-4: R2 / 2. 入力 〜 5. 例外 / 異常系 / 章の順（入力→判定規則→判定例→出力→例外→メモ）と表の列が template と一致している。表の後の本文（出力の入力不備の扱い、例外の優先順）も、表を補う位置に置かれていて、前提から結論の順に読める / - / vp-arc-document-structure / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、br-sample を rulebook の本文要件と br-template の構成に照らして確認した。F001 は R1 が直した第6章末尾の記述で解消済みと判断し、sample には追加の手を入れなかった。rulebook と template が食い違う点は、rulebook を正としつつ sample では template に合わせ、相手側を直す案を指摘 R2-2 に書いた。
