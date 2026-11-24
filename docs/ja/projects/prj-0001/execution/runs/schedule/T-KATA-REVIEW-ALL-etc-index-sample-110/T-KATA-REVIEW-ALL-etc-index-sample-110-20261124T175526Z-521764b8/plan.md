---
specdojo:
  id: prj-0001:xep-t-kata-review-all-etc-index-sample-110-20261124t175526z-521764b8
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-etc-index-sample-110
  name: "R1 目的の過不足"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-etc-index-sample-110

## 1. このフェーズで行うこと

kata のレビューの段 R1（目的の過不足）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。この段は sample を厚くする段ではなく、R1 の確かめに当たる箇所だけを直す。
対象の sample が、種別の責務（Sample 記述標準）と rulebook の目的に対し、要る内容を欠いていないか、要らない内容を含んでいないかを確かめ、足す・削る差分を sample に入れる。rulebook など sample 以外は変更せず、直す案を result に書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を result の実施内容に Markdown の表として 1 回だけ書き、申し送りには表を重ねない。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部結合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムと外部サービスの連携を題材に、外部結合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/etc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-etc-index-sample-110/T-KATA-REVIEW-ALL-etc-index-sample-110-20261124T175526Z-521764b8/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/etc-index-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **QE（Quality Engineer）**
- 責務: 成果物と参考資料の品質基準、レビュー観点、schema 適合、文書間整合を確認する。

このロールが重視するレビュー観点:

- done_criteria 充足: 成果物カタログの done_criteria を満たしているか、未充足条件が明示されているか。
- 検証可能性: 成功基準、受入条件、品質基準、設定値が pass / fail を判定できる表現になっているか。
- 抜け漏れ・矛盾: 必須章、必須キー、参照、責務、禁止事項に抜け漏れや矛盾がないか。
- 設定値の妥当性: 設定値・必須キー・参照が schema と整合し、妥当な値で過不足なく定義されているか。
- 実践の型としての適合性: rulebook、recipe、sample、template が種別ごとの責務を守り、Kata 内部、Kata 相互、および参照する組織定義や生成物を含む適用先との関係が矛盾なく定義されているか。Kata に関するこれらの整合はこの観点で判定し、vp-arc-cross-document-consistency では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=17; anchor=``"「外部」は、開発担当が運用しない製品・サービスとの境界とする。[[specdojo:ifd-sample|インフラ構成図]] の経路のうち、店舗プリンタを動かす `receipt-print` コマンドと、提供事業者が運用する復元用保管サービス（`PATH-05`・`PATH-06`）が該当する。業務記録 DB（`PATH-03`・`PATH-04`・`PATH-07`）は開発担当が同じ環境で運用するため内部結合テストに置く。"``\]: `` `PATH-04`（保全の取得）と `PATH-07`（復元の回復）を内部結合テストに置いていますが、based_on の tsp-index-sample と itc-index-sample は `PATH-04`〜`PATH-07` を外部結合テストの範囲と定めており、このままではどのテストもこの2経路を扱いません。外部の範囲と `backup-storage` の経路を `PATH-04`〜`PATH-07` にそろえ、復元の回復に対応する観点を加えてください。 ``
- F002 \[minor/vp-pm-plan-feasibility; line=109; anchor=``"| _TODO_: 削除し損ねた `et-` コピーの定期的な片付け | 検証用領域の上限に達すると転送の正常系が失敗する | 週1回、7日を過ぎた `et-` コピーを手動で削除する                             |"``\]: ``「削除し損ねた `et-` コピーの定期的な片付け」の当面の扱いに、週1回の手動削除を実施する担当 Role code がないため、作業として割り当てられるよう担当（例: QE や DEV）を示してください。``
- F003 \[minor/vp-pm-control-reporting; line=108; anchor=`"| _ASSUMPTION_: 保管サービスの応答待ち30秒・再送2回 | 境界条件の値と合格基準が変わる                   | 提供事業者の提供条件が届くまで仮置きとし、届いたら本書と対象別を更新する    |"`\]: ``保管サービスの応答待ち・再送回数の仮置きは、`ifd-sample` が `kinuya:pjr-i004` へ引き継いだ保全条件の論点と重なるため、登録簿の引き継ぎ先（PJR の ID）を「担当・判断の場」に示してください。``
- F004 \[minor/vp-pm-control-reporting; line=107; anchor=`"| _UNDECIDED_: 検証用領域の障害が続くときの判定     | 実接続の観点が未実施のまま出口条件を判定できない | 「外部結合テスト共通の境界/依存/環境の扱い」の保留に加え、PM が日程を見直す |"`\]: ``「検証用領域の障害が続くときの判定」と「削除し損ねた `et-` コピーの片付け」も起票者・担当だけが書かれ、登録簿の引き継ぎ先（PJR の ID）がないため、`ifd-sample` の書き方にそろえて転記先を示してください。``
- F005 \[minor/vp-qe-verifiability; line=56; anchor=`"- 環境: 成功・異常終了・無応答（タイムアウト）・遅延（上限の直前）。無応答と遅延はスタブで再現する。"`\]: ``環境条件の「遅延（上限の直前）」は何秒の遅延を与えるかが定まらず境界ケースの合否がぶれるため、`receipt-print` は9秒、保管サービスは29秒のように応答待ち上限に対する具体値で示してください。``
- F006 \[minor/vp-qe-omissions-consistency; line=40; anchor=``"| 観点の型       | `etc-receipt-print` での観点名 | `etc-backup-storage` での観点名 |"``\]: `観点の型の表に、rulebook が挙げる「ET で扱う範囲の非機能（タイムアウト上限・リトライ回数・バックオフ）」の型がないため、行を加えるか、該当しない理由を示してください。`
- F007 \[minor/vp-qe-omissions-consistency; line=96; anchor=`"| トレース               | 推奨（運用必須） | tsp の外部結合テスト出口条件（印刷失敗の契約観点）                  |"`\]: `トレース列の記入例が「tsp の外部結合テスト出口条件（印刷失敗の契約観点）」という説明文で、rulebook が求める ID（req / spec / ac / issue 等）になっていないため、追跡可能な ID で書いてください。`
- F008 \[major/vp-qe-omissions-consistency; line=22; anchor=``"| `backup-storage` | 復元用保管サービス連携 | `PATH-05`（転送）・`PATH-06`（読取） | 通信断・認証失敗。同じコピーなら再送できる | サービスの障害は提供事業者、保管可否の判断は店主代表 |"``\]: `` `backup-storage` の経路を `PATH-05`・`PATH-06` に限っていますが、itc-index-sample は `PATH-04`〜`PATH-07` の代替先を「ET（`etc-backup-storage`）」としており、保全の取得と復元の回復の責務がどのカタログにも置かれない矛盾があるため、経路と観点（復元の回復を含む）を補ってください。 ``
- F009 \[minor/vp-qe-kata-conformance; line=24; anchor=``"2つの I/F は失敗モードと再送の可否が異なるため統合しない。今後、同じ `receipt-print` コマンドで印刷する帳票（つけの残高票など）が増えても、失敗時の扱いが同じなら `etc-receipt-print` に含める。観点が 15 を超えるか、ケース表が 50 行を超えた時点で分割を見直す。"``\]: `分割を見直す閾値を「観点が 15 を超えるか、ケース表が 50 行を超えた時点」としていますが、rulebook は「観点が 15 以上、表が 50 行以上」と定めており境界値で判定が食い違うため、rulebook の条件にそろえてください。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
