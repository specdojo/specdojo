---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dss-sample-150-20261125t075834z-9d817214
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dss-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dss-sample-150/T-KATA-REVIEW-ALL-dss-sample-150-20261125T075834Z-9d817214/plan.md
  started_at: "2026-11-25T07:58:44.058Z"
  completed_at: "2026-11-25T08:13:23.904Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dss-sample
    - specdojo:dss-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `dss-sample.md` を UIS・共通サンプル文脈・関連 sample と照合し、sample 側で直せる 2 箇所を修正した。
- 修正 1: 状態の見せ方の空状態の文言を、UIS の明細なし表示に揃えた。
- 修正 2: 利用者評価の操作主体を、共通サンプル文脈の登場人物に揃えた。
- 相手側の修正や判断が要る 2 件は、sample を変更せず handoff に「要判断」として残した。
- 検証では、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed になった。executor の prettier 整形も passed になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dss-sample.md`: 「6. 状態の見せ方」の `dss-state-05`（空）の視覚表現を、固定の「該当なし」から「見出し付きで UIS の空表示の文言と次の操作を表示」に変更した。UIS の「商品を追加してください」との食い違いを解消するための修正。「8.2. 検証の節目と基準版の採用」の利用者評価では、操作する人を「店主代表・利用者代表」から「店主代表・家族利用者代表」に変更した。共通サンプル文脈の登場人物と、同文書の検証表の表記に合わせるための修正。差分は 2 行。

## 3. 申し送り

- R5-3 と R5-4 は相手側の文書を直す案を含むため、sample 側は変更していない。判断は人に委ねる。R5-3 は `nfr-usability-sample` の要件を補ってから想定 ID を wikilink にする案、R5-4 は `pm-roles-sample` に保守責任を足す案が候補。
- R5-1: R5 / 6. 状態の見せ方（`dss-state-05` 空） / 視覚表現が「該当なし」を固定の文言としていて、UIS の明細なしの表示「商品を追加してください」と食い違う。本書は状態の発生条件と回復を UIS に任せる立場 / 「見出し付きで UIS の空表示の文言と次の操作を表示」にした / `vp-qe-kata-conformance`（kata 相互と適用先）、[[specdojo:uis-sample]] の「表示項目」の明細の行 / -
- R5-2: R5 / 8.2. 検証の節目と基準版の採用（3. 利用者評価） / 操作する人が「店主代表・利用者代表」になっている。共通サンプル文脈の「利用者代表」は常連の子どもで、店番をする家族は「家族利用者代表」。同じ文書の「検証」の表（店主と店番をする家族）、`specdojo:nfr-usability-sample` の利用者区分（熟練=店主代表、新任=家族利用者代表）とも食い違う / 「店主代表・家族利用者代表が要件の条件で操作し」にした / `vp-qe-kata-conformance`、Sample 記述標準の「共通登場人物」 / -
- R5-3: R5 / 8.1. 検証 / 本書は `nfr-usability`・`sysd-index`・`sysd-cross-cutting-policy` を「利用先で作る文書の想定 ID で、完成例を指さない」としている。しかし同じ系列の完成例 `specdojo:nfr-usability-sample`・`specdojo:sysd-index-sample`・`specdojo:sysd-cross-cutting-policy-sample` が実在し、UIS だけ wikilink していて扱いが揃わない / - / `vp-dev-change-impact`。迷った理由: `nfr-usability-sample` には本書が挙げる「読み違い防止・視認性・キーボード操作」の要件がなく、指標も完了率・誤操作率・習熟時間（本書は操作時間）のため、wikilink につなぐと新しい食い違いが生まれる。相手側の案: `nfr-usability-sample` に視認性・キーボード操作の要件を足してから、本書の想定 ID を wikilink に置き換える。選ばなかった案: 本書だけで wikilink に置き換える / 要判断
- R5-4: R5 / 2. 正本と適用方法 / 表現の正本の更新責任を ARC にしている。`specdojo:pm-roles-sample` では ARC は初期に独立タスクの主責任を持たず、画面の文言と操作説明は UX の専門支援とされていて、責任の置き方がずれて見える / - / `vp-qe-kata-conformance`。dss-rulebook は更新責任の列を求めるがロールは指定していないため変えていない。相手側の案: `pm-roles-sample` の ARC か UX の `project_note` に、デザインシステムの表現の正本の保守を足す。選ばなかった案: 本書を UX に変える（検証の担当の ARC・QE の組と崩れるため） / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/dss-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/projects/ の外（docs/ja/specdojo/samples/）だけ）

## 4. 進め方と実践の型の適用

根拠にした資料は、同じ接頭辞の関連 sample（`uis-sample`、`nfr-usability-sample`、`sysd-index-sample`、`sysd-cross-cutting-policy-sample`、`pm-roles-sample`）、Sample 記述標準の共通サンプル文脈、`dss-rulebook` である。構造・必須項目は rulebook を正とした。grade と condense の finding は plan に展開されておらず、R5 の観点で食い違いを洗い出した。UIS の空表示の文言と共通登場人物の呼称と矛盾していた 2 箇所は改訂した。整合していた記述は維持した。更新責任のロール（ARC）は rulebook が指定していないため維持した。根拠が割れる 2 件（想定 ID の扱い、表現の正本の更新責任のロール）は、推測で改訂せず「要判断」として見送った。
