---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-organization-sample-150-20261126t091557z-9dfca011
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-organization-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-organization-sample-150/T-KATA-REVIEW-ALL-pm-organization-sample-150-20261126T091557Z-9dfca011/plan.md
  started_at: "2026-11-26T09:16:08.144Z"
  completed_at: "2026-11-26T09:22:58.638Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-organization-sample
    - specdojo:pm-organization-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `pm-organization-sample` を、同じ接頭辞の sample、`based_on` の参照先、用語集、共通サンプル文脈と照合した。
- RACI と食い違う 1 件（見直しを閉じる役割）を sample 側で直した。
- 相手側（`prj-stakeholder-register-sample`）を直すべき 2 件は、変更せずに直す案を findings に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4. 見直し条件 / 最後の文 | `QE` が見直しを閉じることになっており、RACI の組織定義・ロール定義・メンバー定義の行（PO=A、PM=R、QE=C）と食い違う。 | 「`QE` が…を確かめ、`PM` が見直しを閉じる」に直した。 | `vp-qe-kata-conformance`（kata 相互）。`pm-raci-sample` の成果物別 RACI の該当行。 | - |
| R5-2 | R5 | 3. 正本と責任境界（ステークホルダー登録簿の行） | ステークホルダー登録簿の関係者一覧では、対応 Role code が `PO`（店主代表）と `DEV`（開発担当）の 2 つだけで、技術メンター・家族利用者は `-` になっている。メンバー定義では店主代表が PO・OPS、開発担当が PM・BA・DEV、技術メンターが ARC、家族利用者代表が UX を担っており、これと食い違う。 | -（相手側を直す案）`prj-stakeholder-register-sample` の関係者一覧で、対応 Role code をメンバー定義の roles に合わせる（例: 開発担当 `PM`・`BA`・`DEV`、技術メンター `ARC`）。表の前の「`PO` と `DEV` だけを記載する」の文も合わせて直す。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。 | 要判断（登録簿は Role の兼務を意図して省いた可能性があり、組織定義の側で区別を書く案は選ばなかった） |
| R5-3 | R5 | 2. ロール・owner方針（`QE` 行） | 組織定義とメンバー定義では `QE` を同行レビュー担当（`peer-reviewer`）が担うが、ステークホルダー登録簿の関係者一覧に同行レビュー担当の行がなく、受入判断の材料を渡す関係者として辿れない。 | -（相手側を直す案）`prj-stakeholder-register-sample` に `STH-PEER-REVIEWER`（実行担当者、対応 Role code `QE`）を全章で追加する。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。 | 要判断（登録簿が内部の確認者を関係者に含めない方針である可能性があり、組織定義から QE の記述を外す案は選ばなかった） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-organization-sample.md`: 見直し条件の最後の文を、`QE` が使用不可ロールの `owner` などの残りを確かめ、`PM` が見直しを閉じる形に直した。RACI の組織定義・ロール定義・メンバー定義の行（PO=A、PM=R、QE=C）と整合させた（1 行の差分）。

## 3. 申し送り

- 静的検査（prettier、markdownlint、runner の lint・schema・docs テスト）は通過した。`validate:history-links` は履歴ファイルを変更していないため非適用。
- R5-1: R5 / 4. 見直し条件 / 最後の文で `QE` が見直しを閉じることになっており、RACI の組織定義・ロール定義・メンバー定義の行（PO=A、PM=R、QE=C）と食い違う / 「`QE` が…を確かめ、`PM` が見直しを閉じる」に直した / `vp-qe-kata-conformance`（kata 相互）。`pm-raci-sample` の成果物別 RACI の該当行 / -
- R5-2: R5 / 3. 正本と責任境界（ステークホルダー登録簿の行） / ステークホルダー登録簿の関係者一覧では、対応 Role code が `PO`（店主代表）と `DEV`（開発担当）の 2 つだけで、技術メンター・家族利用者は `-` になっている。メンバー定義では店主代表が PO・OPS、開発担当が PM・BA・DEV、技術メンターが ARC、家族利用者代表が UX を担っており、これと食い違う / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の `prj-stakeholder-register-sample` の関係者一覧で、対応 Role code をメンバー定義の roles に合わせる案（例: 開発担当 `PM`・`BA`・`DEV`、技術メンター `ARC`）。表の前の「`PO` と `DEV` だけを記載する」の文も合わせて直す / 要判断（登録簿は Role の兼務を意図して省いた可能性があり、組織定義の側で区別を書く案は選ばなかった）
- R5-3: R5 / 2. ロール・owner方針（`QE` 行） / 組織定義とメンバー定義では `QE` を同行レビュー担当（`peer-reviewer`）が担うが、ステークホルダー登録簿の関係者一覧に同行レビュー担当の行がなく、受入判断の材料を渡す関係者として辿れない / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の `prj-stakeholder-register-sample` に `STH-PEER-REVIEWER`（実行担当者、対応 Role code `QE`）を全章で追加する案 / 要判断（登録簿が内部の確認者を関係者に含めない方針である可能性があり、組織定義から QE の記述を外す案は選ばなかった）
- 適用外の検証: `npm run validate:history-links`（変更は `docs/ja/specdojo/samples/` 配下の sample だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R5 として、`pm-raci-sample`、`prj-stakeholder-register-sample`、メンバー定義の記述、用語集、共通サンプル文脈を読み、食い違いを確かめた。RACI と矛盾する箇所は、rulebook と RACI を正として sample 側を直した。相手側の修正が必要な点は、推測で変更せず、直す案を findings に残して要判断とした。
