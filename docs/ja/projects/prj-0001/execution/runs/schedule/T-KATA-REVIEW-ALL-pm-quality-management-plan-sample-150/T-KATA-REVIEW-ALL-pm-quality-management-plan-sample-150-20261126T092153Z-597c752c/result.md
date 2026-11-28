---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-quality-management-plan-sample-150-20261126t092153z-597c752c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-150/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-150-20261126T092153Z-597c752c/plan.md
  started_at: "2026-11-26T09:22:04.623Z"
  completed_at: "2026-11-26T09:31:01.425Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-quality-management-plan-sample
    - specdojo:pm-quality-management-plan-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、品質管理計画 sample の未決事項表を、成功条件の sample と管理計画の sample に照らして確認した。食い違い2件を sample 側で直した。
- grade の F001〜F003 は、前の段までで解消済みと executor が判断し、この段では変更していない。
- 相手側（`pm-plan-sample` と成功条件の sample）を直すべき2点は変更せず、案を handoff に残した。
- 検証は、整形と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がいずれも成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 5.2. 未決事項と保留（オフライン時の運用・受入範囲） | 決定後に追加条件を「初期受入の合格条件」に反映するとしていた。成功条件の sample の「例外条件と未解決事項」は、追加する受入条件を初期受入後に単独で判定し、合格を運用開始の必須条件にするとしており、食い違っていた。 | 「追加された条件 ID を初期受入後に単独で判定し、合格を店頭試用開始の条件として `kinuya-acceptance-record` に残す」に直した。 | `vp-qe-kata-conformance`（`specdojo:prj-success-criteria-and-acceptance-criteria-sample` の「オフライン時の記録方法」の行） | - |
| R5-2 | R5 | 5.2. 未決事項と保留（人気商品の対象範囲・除外条件） | 管理計画の sample の初期リリース・店頭試用開始のゲートは SC-04・SC-05 の照合完了を求める。成功条件の sample も、長期滞留の定義をベースライン記録の開始前に決めるとしている。しかし品質管理計画の未決事項には SC-04 しかなかった。 | 論点に「長期滞留の定義」を加え、保留する判定を SC-04・SC-05 に広げた。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。行を分けず1行にまとめたのは、表を増やさないため。選ばなかった案は、成功条件の sample どおり `BA` を担当にしない長期滞留だけの行を別に立てること。「繁忙期にかかるベースライン」は判定が後続観測の側なので加えていない。 | 要判断 |
| R5-3 | R5 | 相手側（`specdojo:pm-plan-sample` の未決事項） | 管理計画の sample の未決事項にも「長期滞留の定義」がない。同じ sample の初期リリース・店頭試用開始のゲートは SC-04・SC-05 の照合完了を求めている。 | 相手側を直す案: `pm-plan-sample` の未決事項表の「人気商品の対象範囲・除外条件」の行に長期滞留の定義を加えるか、別の行を足し、影響先を「運用前の準備」の SC-05 とする。この変更では直していない。 | `vp-qe-kata-conformance` | - |
| R5-4 | R5 | 相手側（`specdojo:prj-success-criteria-and-acceptance-criteria-sample` の「オフライン時の記録方法」の行） | 品質管理計画と管理計画は運用案の材料準備を `BA` に置く。しかし成功条件の sample には材料準備の担当がない（grade F001 の指摘と同じ）。 | 相手側を直す案: 当面の扱いに「業務分析（`BA`）が運用案と追加する受入条件の案を整理し」を加える。この変更では直していない。 | `vp-po-decision-readiness` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`: 未決事項と保留の表を2か所直した。オフライン時の運用・受入範囲は、追加条件を初期受入後に単独で判定し、合格を店頭試用開始の条件として `kinuya-acceptance-record` に残す書き方にして、成功条件の sample と合わせた。人気商品の対象範囲・除外条件の行には長期滞留の定義を加え、保留する判定を SC-04 と SC-05 に広げた。

## 3. 申し送り

- F001〜F003 は前の段までで解消済みとして、この段では変更していない。executor の `final_message` に基づく。
- R5-1: R5 / 5.2. 未決事項と保留（オフライン時の運用・受入範囲） / 決定後に追加条件を「初期受入の合格条件」に反映するとしていたが、成功条件の sample の「例外条件と未解決事項」では、追加する受入条件は初期受入後に単独で判定し、合格を運用開始の必須条件にするとしており食い違う / 「追加された条件 ID を初期受入後に単独で判定し、合格を店頭試用開始の条件として `kinuya-acceptance-record` に残す」に直した / `vp-qe-kata-conformance`（[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]] の「オフライン時の記録方法」の行） / -
- R5-2: R5 / 5.2. 未決事項と保留（人気商品の対象範囲・除外条件） / 管理計画の sample の初期リリース・店頭試用開始のゲートは SC-04・SC-05 の照合完了を求め、成功条件の sample も長期滞留の定義をベースライン記録の開始前に決めるとしているが、品質管理計画の未決事項には SC-04 しかなかった / 論点に「長期滞留の定義」を加え、保留する判定を SC-04・SC-05 に広げた / `vp-qe-kata-conformance`、`vp-dev-change-impact`。行を分けずに1行へまとめたのは表を増やさないため。選ばなかった案は、成功条件の sample どおり `BA` を担当にしない長期滞留だけの行を別に立てること。「繁忙期にかかるベースライン」は判定が後続観測の側なので加えていない / 要判断
- R5-3: R5 / 相手側（[[specdojo:pm-plan-sample]] の未決事項） / 管理計画の sample の未決事項にも「長期滞留の定義」がないが、同じ sample の初期リリース・店頭試用開始のゲートは SC-04・SC-05 の照合完了を求めている / - / 相手側を直す案: pm-plan-sample の未決事項表の「人気商品の対象範囲・除外条件」の行に長期滞留の定義を加えるか、別の行を足し、影響先を「運用前の準備」の SC-05 とする / -
- R5-4: R5 / 相手側（[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]] の「オフライン時の記録方法」の行） / 品質管理計画と管理計画は運用案の材料準備を `BA` に置くが、成功条件の sample には材料準備の担当がない（grade F001 の指摘と同じ） / - / 相手側を直す案: 当面の扱いに「業務分析（`BA`）が運用案と追加する受入条件の案を整理し」を加える / -

## 4. 進め方と実践の型の適用

根拠にしたのは、成功条件の sample の「例外条件と未解決事項」と、管理計画の sample の初期リリース・店頭試用開始のゲートである。食い違った記述は、品質管理計画 sample の側を成功条件の sample に合わせて直した。相手側を直すべき点は変更せず、案を指摘に書いた。整合する記述は維持した。長期滞留の定義を同じ行へまとめた点は、表を増やさないための判断で、要判断の印を付けた。
