---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-maintainability-sample-150-20261126t083046z-ac53523b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-maintainability-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-maintainability-sample-150/T-KATA-REVIEW-ALL-nfr-maintainability-sample-150-20261126T083046Z-ac53523b/plan.md
  started_at: "2026-11-26T08:30:57.198Z"
  completed_at: "2026-11-26T08:36:52.793Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `nfr-maintainability-sample` を `opd-index-sample`、`opr-incident-sample`、`opr-change-sample` と突き合わせ、食い違い 3 点を sample 側で直した。
- 直した内容は、営業時間中の P1 復旧に伴う切り戻しの扱い、切り分けの実行と責任の分担、関連ドキュメント導線のリンク表示名の 3 点である。
- `nfr-index-sample` 側を直す案 2 件は、相手側を変更せず handoff に残した。
- grade の F001 と F002 は前の段で解消済みとして、この段では扱っていない。
- executor の検証では、`prettier`、`markdownlint-cli2`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 適用範囲・前提条件（対象時間帯） | 「変更と切り戻しは閉店後から翌営業日の開店まで」と言い切っている。`opd-index-sample` の変更管理（営業時間中の変更は P1 の復旧に必要な場合だけ PO の承認で行う）と `opr-incident-sample`（ロールバックは営業時間中でも P1 の復旧に必要な変更として扱う）に食い違う。 | 「P1 の復旧に要る変更と切り戻しは営業時間中も行う」を足した。 | vp-qe-kata-conformance（適用先・相互の整合） | - |
| R5-2 | R5 | 適用範囲・前提条件（保守作業を担う役割） | 「切り分けの判断は OPS」だけで、切り分けを行う役割がない。`opd-index-sample` の RACI（障害の切り分けと復旧: OPS=A、DEV=R）と `opr-incident-sample` の障害対応手順の「切り分け（DEV）」列に合わない。rulebook は切り分け・修正・切り戻しを担う役割を書くことを求めている。 | 「切り分けは DEV が行い OPS が判断の責任を持つ」にした。 | vp-qe-kata-conformance | - |
| R5-3 | R5 | 関連ドキュメント導線 | wikilink の表示名「非機能要件 / 可用性」「障害対応手順」「運用変更手順」が、参照先の H1（可用性要件、運用手順（障害対応）、運用手順（運用変更））やほかの sample の多数の表記と違う。 | 3 件の表示名を参照先の H1 に合わせた。 | vp-qe-kata-conformance（相互の表記） | - |
| R5-4 | R5 | 関連ドキュメント導線 | `nfr-index-sample` の「関連ドキュメント導線」の保守性の行は、運用（OPD/OPR）の列が `opd-index`、`opr-change` だけである。本書が一次切り分けの手順の導線とする `opr-incident` が入っていない。 | -（相手側の `nfr-index-sample` の保守性の行の運用（OPD/OPR）の列に `opr-incident` を足す案。この段では変更していない。） | vp-qe-kata-conformance | - |
| R5-5 | R5 | 保守性要件一覧 | `nfr-index-sample` のカテゴリ一覧は保守性の代表指標を「変更の依頼から適用までの日数」と書く。本書と rulebook の用語は「変更リードタイム（要求を受けてから本番へ反映するまで）」で、測る単位も翌営業日の 10:00 という時刻である。 | -（相手側の `nfr-index-sample` の代表指標を「変更リードタイム（要求から反映まで）」に直す案。index の要約としての言い換えとして許すかは迷ったため、選ばなかった案はそのまま維持する。） | vp-qe-kata-conformance | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: 適用範囲・前提条件で、変更と切り戻しの時間帯に「P1 の復旧に要る変更と切り戻しは営業時間中も行う」を追記した。切り分けの実行を DEV、判断の責任を OPS とする分担に改めた。関連ドキュメント導線の wikilink 表示名 3 件を、参照先の H1 に合わせた。prettier により表の列幅も変わった。

## 3. 申し送り

- R5-4 と R5-5 は `nfr-index-sample` 側を直す案である。この段では相手側を変更していない。
- R5-5 は index の要約としての言い換えを許すかどうか迷ったため、「要判断」の印を付けて findings に渡した。
- R5-1: 段 R5 / 箇所 適用範囲・前提条件（対象時間帯） / 指摘: 「変更と切り戻しは閉店後から翌営業日の開店まで」と言い切っており、opd-index-sample の変更管理（営業時間中の変更は P1 の復旧に必要な場合だけ PO の承認で行う）と opr-incident-sample（ロールバックは営業時間中でも P1 の復旧に必要な変更として扱う）に食い違う / 直した案: 「P1 の復旧に要る変更と切り戻しは営業時間中も行う」を足した / 根拠: vp-qe-kata-conformance（適用先・相互の整合） / 印: -
- R5-2: 段 R5 / 箇所 適用範囲・前提条件（保守作業を担う役割） / 指摘: 「切り分けの判断は OPS」だけで、切り分けを行う役割がない。opd-index-sample の RACI（障害の切り分けと復旧: OPS=A、DEV=R）と opr-incident-sample の障害対応手順の「切り分け（DEV）」列に合わない。rulebook は切り分け・修正・切り戻しを担う役割を書くことを求めている / 直した案: 「切り分けは DEV が行い OPS が判断の責任を持つ」にした / 根拠: vp-qe-kata-conformance / 印: -
- R5-3: 段 R5 / 箇所 関連ドキュメント導線 / 指摘: wikilink の表示名「非機能要件 / 可用性」「障害対応手順」「運用変更手順」が、参照先の H1（可用性要件、運用手順（障害対応）、運用手順（運用変更））やほかの sample の多数の表記と違う / 直した案: 3 件の表示名を参照先の H1 に合わせた / 根拠: vp-qe-kata-conformance（相互の表記） / 印: -
- R5-4: 段 R5 / 箇所 関連ドキュメント導線 / 指摘: nfr-index-sample の「関連ドキュメント導線」の保守性の行は、運用（OPD/OPR）の列が `opd-index`、`opr-change` だけである。本書が一次切り分けの手順の導線とする `opr-incident` が入っていない / 直した案: - / 根拠: vp-qe-kata-conformance。相手側の nfr-index-sample の保守性の行の運用（OPD/OPR）の列に `opr-incident` を足す案 / 印: -
- R5-5: 段 R5 / 箇所 保守性要件一覧 / 指摘: nfr-index-sample のカテゴリ一覧は保守性の代表指標を「変更の依頼から適用までの日数」と書くが、本書と rulebook の用語は「変更リードタイム（要求を受けてから本番へ反映するまで）」で、測る単位も翌営業日の 10:00 という時刻である / 直した案: - / 根拠: vp-qe-kata-conformance。相手側の nfr-index-sample の代表指標を「変更リードタイム（要求から反映まで）」に直す案。index の要約としての言い換えとして許すかは迷ったため要判断。選ばなかった案は、そのまま維持すること / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変えていないため）

## 4. 進め方と実践の型の適用

根拠とした資料は、同じ接頭辞の `opd-index-sample`、`opr-incident-sample`、`opr-change-sample`、`nfr-index-sample` と rulebook である。sample 側の食い違いは直し、`nfr-index-sample` 側を直す案 2 件は変更せず handoff に残した。構造・必須項目は rulebook を正とした。frontmatter の `status` は `draft` のまま据え置いた。
