---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-index-sample-150-20261124t223114z-6bba99f5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-index-sample-150/T-KATA-REVIEW-ALL-atc-index-sample-150-20261124T223114Z-6bba99f5/plan.md
  started_at: "2026-11-24T22:31:23.069Z"
  completed_at: "2026-11-24T22:43:55.803Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `atc-index-sample` を、TSP・個別 sample（atc-sample）・pm-members-sample と照合した。
- plan の F001〜F003 は前の段（R1〜R4）で解消済みだった。F001 は `取引照合の保証` の主担当が `atc-sale-hold` だけになっていた。F002 は観点名が `主要操作の自力完了の成立` になっていた。F003 は家族利用者代表に `UX` が付いていた。
- F003 の message は `PO` 業務助言に合わせる案だった。ただし pm-members-sample が家族利用者代表を `roles: [UX]` と定義しているため、UX のまま残した。
- 今回の差分は 2 点。合格基準に TSP の出口条件（Blocker・Critical・Major の Fail が残れば受入不可）を足した。ケース表の記入例を atc-sample の `at-cash-sale-sale-complete-010` に揃えた。
- 検査は prettier、markdownlint、runner の lint:md:changed・lint:fm:changed・lint:mermaid・lint:d2・test:docs・validate:schema が通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 合格基準に「優先度にかかわらず Blocker・Critical・Major の Fail が1件でも残る場合は、受入可・条件付き受入にしない」の1文を足し、TSP の受入の出口条件と揃えた。ケース表の共通カラムの記入例 `at-cash-sale-sale-complete-010` を atc-sample の同じケースに合わせた。条件は「店主不在で家族利用者代表が店番」、期待値は「レシートと販売一覧に同じ取引番号と合計60円が表示され、在庫一覧で商品Aが3個と表示される」、トレースは BAC-01、AC-01 にした。表の列幅は prettier で整えた。

## 3. 申し送り

- 指摘一覧（段 R5）。R5-1 と R5-5 は「要判断」。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 合格基準 | P1 の条件付き受入と P2 の 90% 合格が、TSP の受入の出口条件と食い違って読める | 「優先度にかかわらず Blocker・Critical・Major の Fail が1件でも残る場合は、受入可・条件付き受入にしない」の1文を足した。条件付き受入の範囲が Minor 以下に狭まる点が迷いどころ。TSP 側を直す案は、受入の出口の正本が TSP のため選ばなかった | `vp-qe-kata-conformance`（tsp-index-sample の受入テスト行と品質ゲートの表） | 要判断 | | R5-2 | R5 | ケース表の共通カラム（記入例） | `at-cash-sale-sale-complete-010` の条件・期待値・トレースが atc-sample と食い違い、別観点（`self-complete`）の内容が混ざっていた | 条件、期待値、トレースを atc-sample に揃えた | `vp-qe-kata-conformance`（atc-sample の観点「会計確定の成立」のケース表、TR-01・TR-02） | - | | R5-3 | R5 | atc-sample の観点見出し「主要操作の自力完了」 | 本書の分配表と命名規則では `主要操作の自力完了の成立` で、個別 sample の観点名と食い違う | 相手側の atc-sample.md の見出しを「観点：主要操作の自力完了の成立」に改める案（本タスクでは変更しない） | `vp-qe-kata-conformance` | - | | R5-4 | R5 | atc-sample の概要の分割基準の引用 | 個別 sample の引用に「金額の提示」が欠けている | 相手側の atc-sample.md の概要の括弧内に「金額の提示」を足す案（本タスクでは変更しない） | `vp-qe-kata-conformance` | - | | R5-5 | R5 | ケース表の共通カラム（環境/依存の列） | 本書の記入例は `kinuya-at`、店舗プリンタ、atc-sample の同じケースは「なし」で、列の意味が揃っていない | 案は2つ。本書の列の説明を「共通方針と異なる場合だけデータ領域と接続先を書く」に改めて記入例を「なし」にする案と、atc-sample 側に `kinuya-at`、店舗プリンタを書く案。どちらを正とするかは列の定義の判断になる | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 | | R5-6 | R5 | atc-sample の環境/データ/外部依存 | 本書は店舗プリンタと復元用保管サービスを挙げるが、個別 sample は店舗プリンタだけで保管サービスに触れていない | 相手側の atc-sample.md に保管サービスの扱いを足す案。このカタログで使わないなら `共通方針との差` に一言書く（本タスクでは変更しない） | `vp-qe-kata-conformance` | - |
- R5-1: R5 / 合格基準 / P1 の条件付き受入と P2 の 90% 合格が、TSP の受入の出口条件「SC-01・SC-07・SC-09・AC-01〜AC-05 がすべて合格、Blocker・Critical・Major 0 件、例外なし」と食い違って読める / 「優先度にかかわらず Blocker・Critical・Major の Fail が1件でも残る場合は、受入可・条件付き受入にしない」の1文を足した / `vp-qe-kata-conformance`（tsp-index-sample の受入テスト行と品質ゲートの表）。迷った理由: 条件付き受入の範囲が Minor 以下に狭まる。TSP 側を直す案は、受入の出口の正本が TSP のため選ばなかった / 要判断
- R5-2: R5 / ケース表の共通カラム（記入例） / 記入例 `at-cash-sale-sale-complete-010` の条件・期待値・トレースが atc-sample の同じケースと食い違っていた。期待値に「説明なしで確定でき」、トレースに SC-01 が入っており、別の観点（`self-complete`）の内容が混ざっていた / 条件を「店主不在で家族利用者代表が店番」、期待値を「レシートと販売一覧に同じ取引番号と合計60円が表示され、在庫一覧で商品Aが3個と表示される」、トレースを BAC-01、AC-01 にした / `vp-qe-kata-conformance`（atc-sample の観点「会計確定の成立」のケース表、TR-01・TR-02） / -
- R5-3: R5 / atc-sample の観点の見出し「主要操作の自力完了」 / 本書の分配表と命名規則（名詞＋成立/保証/整合）では `主要操作の自力完了の成立` で、個別 sample の観点名と食い違う / - / `vp-qe-kata-conformance`。相手側の docs/ja/specdojo/samples/atc-sample.md の見出し「観点：主要操作の自力完了」を「観点：主要操作の自力完了の成立」に改める案 / -
- R5-4: R5 / atc-sample の概要の分割基準の引用 / 個別 sample は「商品の登録→会計確定→レシートの受け渡し」、本書の分割基準の表は「商品の登録→金額の提示→会計確定→レシートの受け渡し」で、引用が欠けている / - / `vp-qe-kata-conformance`。相手側の atc-sample.md の概要の括弧内に「金額の提示」を足す案 / -
- R5-5: R5 / ケース表の共通カラム（環境/依存の列） / 本書の記入例は `kinuya-at`、店舗プリンタと書き、atc-sample の同じケースは「なし」と書いている。列の意味（共通方針との差だけを書くのか、常に書くのか）が両者で揃っていない / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由: どちらを正とするかは列の定義の判断になる。案は、本書の列の説明を「共通方針と異なる場合だけデータ領域と接続先を書く」に改めて記入例を「なし」にする案と、atc-sample 側に `kinuya-at`、店舗プリンタを書く案の2つ / 要判断
- R5-6: R5 / atc-sample の環境/データ/外部依存 / 本書の外部依存は店舗プリンタと復元用保管サービスを挙げるが、個別 sample は店舗プリンタだけで、保管サービスの扱いに触れていない / - / `vp-qe-kata-conformance`。相手側の atc-sample.md の外部依存に保管サービスの扱い（このカタログで使わないなら `共通方針との差` に一言）を足す案 / -
- F001〜F003 は前の段（R1〜R4）で解消済みだった。F001 は `取引照合の保証` の主担当が `atc-sale-hold` だけになっている。F002 は観点名が `主要操作の自力完了の成立` になっている。F003 は家族利用者代表に `UX` が付いている。F003 の message は `PO` 業務助言に合わせる案だったが、pm-members-sample.yaml が家族利用者代表を `roles: [UX]` と定義しているため、UX のまま残した。

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、atc-index-sample を見直す対象として TSP、個別 sample（atc-sample）、pm-members-sample と照合した。rulebook と標準が定める構造を正とした。F001〜F003 は前の段で解消済みと確認した。F003 の `PO` を足す案は、pm-members-sample の `roles: [UX]` と矛盾するため採らず、UX のまま維持した（維持の根拠は pm-members-sample）。相手側の修正が必要な点（R5-3〜R5-6）は変更せず、案を handoff に残した。grade result のサイドカーは直接編集していない。
