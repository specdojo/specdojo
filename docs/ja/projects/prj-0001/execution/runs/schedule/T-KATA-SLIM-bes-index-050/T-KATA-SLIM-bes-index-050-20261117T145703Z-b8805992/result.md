---
specdojo:
  id: prj-0001:xer-t-kata-slim-bes-index-050-20261117t145703z-b8805992
  type: exec-result
  task_id: T-KATA-SLIM-bes-index-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bes-index-050/T-KATA-SLIM-bes-index-050-20261117T145703Z-b8805992/plan.md
  started_at: "2026-11-17T14:57:09.713Z"
  completed_at: "2026-11-17T15:07:30.351Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - bes-index
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- `bes-index-sample` から文書の運用の記述と同じ判断の言い直しを外し、sld の試行に沿って縮めた。
- 外した記述は、役割・承認の段落、静的検査の受入条件、未決事項の管理台帳の列（判断者・次アクション・時期）と PM 登録の段落、改訂時の引き継ぎ、詳細化表下の言い直しである。
- 未決の論点は「未決事項」の表を正とし、一覧からは章タイトルで参照する形にした。結論は維持している。
- 空白と改行を除く文字数は 5,290 → 3,680（69.6%）で、目安の 7 割以下に収まった。表の区切り行を除くと 5,023 → 3,425（68.2%）である。
- rulebook と template は recipe・template とも `not-needed` のため変更していない。
- runner の検証（`lint:md`、`lint:fm`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration`）は成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: 運用の記述と言い直しを外して縮めた（20 行追加・37 行削除）。役割・承認の段落、静的検査の受入条件、改訂時の引き継ぎ、未決事項の管理台帳の列（判断者・確認担当・次アクション・解消時期）、PM の PJR 登録の段落を削除した。3 章は見出し「未決事項と承認条件」を残し、3.1 を「未決事項」、3.2 を「確定入力として扱う条件」とした。3.2 には業務判定の条件（網羅・ID・発生判定・詳細化対応）だけを残した。決まったときに直す行は「影響と当面の扱い」に残した。`bes-cash-sale-confirmed` の「いつ」から「店番担当の要求により」を外し、`bes-month-end-closed` の発生条件から「店主代表が締めを確定している」を外した。判断の結論は変えていない。

## 3. 申し送り

- `vp-arc-conciseness` に沿った削減で、判断の基準・値・例外・未決事項の論点は変えていない。
- 表現を縮めた 2 か所は、主体や確定が別の列に書かれているため、重複を外す目的で直した。
- 文字数（空白・改行を除く）: 前 5,290 字 → 後 3,680 字（69.6%）。表の区切り行を除くと 5,023 字 → 3,425 字（68.2%）。result の `進め方と実践の型の適用` に記録すること。
- 根拠: `specdojo:bes-index-rulebook`（本文要件・記述ガイド・禁止事項）、`prj-0001:pjr-8s4t-sld-kata-slim-pilot` の「他の型へ広げるときの一覧」、`specdojo:sld-sample`。展開された finding はなし。bes-index-rulebook は recipe・template とも `not-needed` で、template の修正対象はない。
- 結論は変えていない。表現を縮めた箇所: `bes-cash-sale-confirmed` の「いつ」から「店番担当の要求により」を外した（主体は「誰が／何が」の列にある）。`bes-month-end-closed` の発生条件から「店主代表が締めを確定している」を外した（確定は「いつ」の列が示す）。
- 外した運用の記述: 未決事項の判断者・確認担当・次アクション・解消時期の列、PM の PJR 登録の段落、PO の範囲承認と `status: draft` 維持の段落、改訂時の引き継ぎ（3.3）のロールごとの作業。決まったときに直す行は未決事項の表の「影響と当面の扱い」に残した。
- 迷った点: 3 章の見出しは rulebook の章名「未決事項と承認条件」のまま残し、3.1 を「未決事項」、3.2 を「確定入力として扱う条件」とした。3.2 は受入条件のうち業務判定の条件（網羅・ID・発生判定・詳細化対応）だけを残した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bes-index-sample.md のみで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠は `specdojo:bes-index-rulebook`（本文要件・記述ガイド・禁止事項）、`prj-0001:pjr-8s4t-sld-kata-slim-pilot` の「他の型へ広げるときの一覧」、改訂済みの `specdojo:sld-sample` である。展開された grade と condense の finding はなかった。外した記述は、運用に属するもの（役割、承認、PM 登録、改訂時の引き継ぎ、管理台帳の列）と、同じ判断を別の章で言い直したものである。同じ判断は未決事項の表を正とし、ほかの章は章タイトルで参照する形にした。rulebook は recipe・template とも `not-needed` のため、template の修正対象はない。rulebook と sample の矛盾はなく、rulebook の章名を維持した。大きさは空白と改行を除いて 5,290 → 3,680 字（69.6%）で、目安の 7 割以下である。
