---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-access-control-sample-130-20261125t080309z-c4ca9c5d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-access-control-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-access-control-sample-130/T-KATA-REVIEW-ALL-opr-access-control-sample-130-20261125T080309Z-c4ca9c5d/plan.md
  started_at: "2026-11-25T08:03:18.983Z"
  completed_at: "2026-11-25T08:18:11.634Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-access-control-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/opr-sample.md` の文を 6 か所直した。内容は主語の明示、長文の分割、指示語の置き換え、範囲の言い切りである。意味と判断に要る背景・例外・制約は変えていない。
- grade の finding F001〜F004 は R3 の観点に当たらないため、この段では直していない。扱う段または対象外の理由は handoff に記した。
- 検証では、`npx prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ts、md、fm の全件検査、integration、typecheck、unit は変更種別により対象外だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: R3 の文の直しを 6 か所入れた（6 行追加、6 行削除）。1. 概要の長文を 2 文に分け、表の前の「値」を「未決事項」にした。5. アラート対応手順の通知 2 種の定義と通知先を 2 文に分けた。6. バックアップ確認・リストア手順の前置きに「達成可否の判定」を加えた。同章の復元の項目では、障害記録に残す主体を `DEV` と明示して 2 文に分けた。10. 問い合わせ一次対応手順の「機能の要望」の項目では、登録する主体を `OPS` と明示した。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）は executor の handoff（R3-1〜R3-10）に記載のとおり。ここでは重ねて書かない。
- 要判断 R3-5: 障害記録に残す主体を、復元を行う `DEV` と読んで補った。別案の `OPS` は採っていない。R1 または R5 で運用方針と照らして確認してほしい。
- 要判断 R3-7: 11. 証跡の末尾にある、手順改訂時の模擬を行う主体は、本文から `OPS` か `DEV` の一方に決まらない。主体を書き足すと事実を足すことになるため直していない。R1 または R5 で決めてほしい。
- F002 は R4 に任せる。F003 は R5 で、分冊の sample が本書を参照する id を確かめてほしい。F001 と F004 は、kata のレビューに使わない観点のため扱っていない。
- R3-1: R3 / 1. 概要 / 「店主代表が不在の日も、…連絡・切替できる状態を作る。」の文が長く、「状態を作る」主体が決まらない / 「…記録できるようにする。異常時も、店番担当が同じ判断で連絡・切替できるようにする。」の 2 文に分けた / W1、W3 / -
- R3-2: R3 / 1. 概要 / 表の前の「値が決まった時点で」の「値」が、表の見出し「未決事項」と合わず、指す先が決まらない / 「未決事項が決まった時点で」にした / W4、`vp-ux-language-consistency` / -
- R3-3: R3 / 5. アラート対応手順 / 通知 2 種の定義と通知先を 1 文に詰めていて長い / 「…の 2 つとする。通知先は `OPS` とする。」の 2 文に分けた / W3 / -
- R3-4: R3 / 6. バックアップ確認・リストア手順 / 前置きが「確認・復元・演習」だけを挙げ、箇条書き 4 項目目の「達成可否」が範囲から漏れている / 「確認・復元・演習の手順と達成可否の判定は次のとおりとする。」にした / W7 / -
- R3-5: R3 / 6. バックアップ確認・リストア手順 / 復元の項目の「…一致すれば完了とし、障害記録に残す。」は、障害記録に残す主体が書かれておらず、文も長い / 「…完了とする。`DEV` は照合の結果を障害記録に残す。」に分けた / W1、W3 / 要判断（残す主体は、復元を行う `DEV` と読むのが自然と判断した。別の案だった `OPS` は採らなかった）
- R3-6: R3 / 10. 問い合わせ一次対応手順 / 「機能の要望」の項目で、要望の一覧に登録する主体が書かれておらず、後半の `PO` と混ざって読める / 「`OPS` が課題管理の要望の一覧に登録し、」にした / W1 / -
- R3-7: R3 / 11. 証跡 / 末尾の段落「手順を新しく書いたときや改訂したときは、検証用の環境で手順を模擬する。」の模擬を行う主体が書かれていない / - / W1。主体（`OPS` か `DEV` か）は本文から一つに決まらず、主体を書き足すと事実を足すことになるため直していない。R1 か R5 で運用方針と照らして決める / 要判断
- R3-8: R3 / - / F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため扱わない / - / kata-guide「kata の観点の組」 / -
- R3-9: R3 / - / F002（`vp-qe-verifiability`、証跡の保管期間が `_UNDECIDED_`）は R4 の観点のため、この段では直さず R4 に任せる。なお、概要の未決事項の表には「監査ログ以外の証跡の保管期間」の行がすでにある / - / kata-guide「kata の観点の組」 / -
- R3-10: R3 / 12. 関連ドキュメント導線 / F003（`vp-qe-kata-conformance`、分冊の記述が食い違う）は R5 の観点。現在の版の表には分冊 8 件が「作成済」で並んでおり、解消済みと見ている。R5 で、分冊の sample が本書を参照する id を確かめてほしい / - / kata-guide「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R3 に従い、W1〜W10 の観点で `docs/ja/specdojo/samples/opr-sample.md` の文を直した。前の段の指摘は繰り返していない。plan に展開された finding F001〜F004 は、kata-guide の「kata の観点の組」に照らして R3 の観点に当たらないと判断した。そのため直さず、扱う段または対象外の理由を handoff に残した。判断が分かれる 2 件は「要判断」の印を付けて申し送った。frontmatter の `status` は `draft` のまま変えていない。
