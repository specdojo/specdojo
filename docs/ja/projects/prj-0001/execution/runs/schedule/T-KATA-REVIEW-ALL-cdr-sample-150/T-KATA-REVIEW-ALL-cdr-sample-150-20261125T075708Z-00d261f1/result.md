---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdr-sample-150-20261125t075708z-00d261f1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdr-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdr-sample-150/T-KATA-REVIEW-ALL-cdr-sample-150-20261125T075708Z-00d261f1/plan.md
  started_at: "2026-11-25T07:57:16.858Z"
  completed_at: "2026-11-25T08:08:38.014Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/cdr-sample.md` を、同じ接頭辞の sample や参照先と突き合わせて直した。直したのは 4 件で、断り書きの根拠外の追加、Sentry の任意条件の反映、顧客の識別子の用語、販売の識別子の用語である。
- grade の F001/F002（DB 接続のクライアント import の禁止が表と境界の章で重複）は前の段で解消済みだった。境界の章は `server-only` を import する手順だけになっており、この段では直していない。
- executor の `npx prettier --check` と `npx markdownlint-cli2` は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdr-sample.md`: 断り書きの根拠外に `specdojo:sysd-cross-cutting-policy-sample` を追加し、実在の sample との取り違えを防いだ。Sentry への記録を、通知先を設定した環境だけとする条件付きの記述にして `specdojo:tsd-index-sample` に合わせた。エラーメッセージの識別子を「顧客 ID」から「顧客番号」に、「販売 ID」から「取引番号」にそろえた。変更は 4 行の追加と 4 行の削除。

## 3. 申し送り

- 要判断: R5-4 は「取引番号」にそろえたが、`sysd-critical-flows-sample` だけは「取引 ID」を使っている。executor はそちらを別の段か別のタスクで扱うとしており、cdr-sample 側の直しではない。相手側を直す案は、`sysd-critical-flows-sample` の「取引 ID」を「取引番号」にそろえることである。
- R5-1: R5 / 断り書き（`_ASSUMPTION_`） / 本書が参照する架空の `kinuya-web-sysd-cross-cutting-policy` と、名前の似た実在の sample [[specdojo:sysd-cross-cutting-policy-sample]]（単一店舗・現金販売の CLI だけが対象）の区別が書かれておらず、根拠を取り違えるおそれがある / 根拠にしない文書に [[specdojo:sysd-cross-cutting-policy-sample\|販売処理の横断ルール]] を加え、clis-sample と合わせて「CLI と本部 API を使う別構成の例」とした / `vp-qe-kata-conformance`（適用先との整合）、sysd-cross-cutting-policy-sample の概要（対象は単一店舗・現金販売の CLI） / -
- R5-2: R5 / 4. エラー処理 / [[specdojo:tsd-index-sample]] では Sentry は任意（通知先を環境変数に設定した場合だけ）なのに、本書は無条件に Sentry へ記録すると読める / 「Sentry（通知先を設定した環境だけ。送信先は `kinuya-web-sysd-cross-cutting-policy` が定める）」にした / `vp-qe-kata-conformance`、tsd-index-sample のエラー監視の行 / -
- R5-3: R5 / 4. エラー処理 / エラーメッセージに含める顧客の識別子が「顧客 ID」になっており、[[specdojo:dmd-sample]] の `顧客台帳.顧客番号` と食い違う / 「顧客番号」にした / `vp-qe-kata-conformance`、dmd-sample の項目の対応表 / -
- R5-4: R5 / 4. エラー処理 / 販売の識別子が「販売 ID」になっており、ほかの sample の多く（stc・uis・etc・clis・横断ルールなど）が使う「取引番号」と食い違う / 本文とコード例のメッセージを「取引番号」にした（変数名 `sale.id` はそのまま） / `vp-qe-kata-conformance`、`vp-dev-change-impact`。sysd-critical-flows-sample だけは「取引 ID」を使うが、そちらは別の段か別のタスクで扱う / -
- 申し送り: grade の F001/F002（DB 接続のクライアント import の禁止が禁止事項の表と境界の章で重複）は前の段で解消済みで、境界の章は `server-only` の import の手順だけになっている。この段では直していない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdr-sample.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の sample（`specdojo:tsd-index-sample`、`specdojo:dmd-sample`、`specdojo:sysd-cross-cutting-policy-sample` など）、Sample 記述標準の共通サンプル文脈、`vp-qe-kata-conformance` と `vp-dev-change-impact` の観点である。 指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 断り書き（`_ASSUMPTION_`） | 本書が参照する架空の `kinuya-web-sysd-cross-cutting-policy` と、名前の似た実在の `specdojo:sysd-cross-cutting-policy-sample`（単一店舗・現金販売の CLI だけが対象）の区別が書かれておらず、根拠を取り違えるおそれがある。 | 根拠にしない文書に `specdojo:sysd-cross-cutting-policy-sample` を加え、clis-sample と合わせて「CLI と本部 API を使う別構成の例」とした。 | `vp-qe-kata-conformance`、sysd-cross-cutting-policy-sample の概要 | - | | R5-2 | R5 | 4. エラー処理 | `specdojo:tsd-index-sample` では Sentry は任意（通知先を環境変数に設定した場合だけ）なのに、本書は無条件に Sentry へ記録すると読める。 | 「Sentry（通知先を設定した環境だけ。送信先は `kinuya-web-sysd-cross-cutting-policy` が定める）」にした。 | `vp-qe-kata-conformance`、tsd-index-sample のエラー監視の行 | - | | R5-3 | R5 | 4. エラー処理 | エラーメッセージに含める顧客の識別子が「顧客 ID」で、`specdojo:dmd-sample` の `顧客台帳.顧客番号` と食い違う。 | 「顧客番号」にした。 | `vp-qe-kata-conformance`、dmd-sample の項目の対応表 | - | | R5-4 | R5 | 4. エラー処理 | 販売の識別子が「販売 ID」で、ほかの sample の多く（stc・uis・etc・clis・横断ルールなど）が使う「取引番号」と食い違う。 | 本文とコード例のメッセージを「取引番号」にした（変数名 `sale.id` はそのまま）。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 | rulebook と矛盾する箇所はなく、構造と禁止事項の判断で rulebook を正とした箇所もない。根拠不足で見送った finding はない。維持した記述は、前の段で直した `server-only` の手順の章と、それ以外の整合している記述である。
