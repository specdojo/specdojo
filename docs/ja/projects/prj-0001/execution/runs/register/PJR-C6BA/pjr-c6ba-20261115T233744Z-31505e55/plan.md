---
specdojo:
  id: prj-0001:xep-pjr-c6ba-20261115t233744z-31505e55
  type: exec-plan
  rulebook: none
  task_id: PJR-C6BA
  name: "sld の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
---

# Edit Plan: PJR-C6BA

## 1. このフェーズで行うこと

保管場所一覧の sample を最新の grade の指摘で直す

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 保管場所一覧（SpecDojo）
- `depends_on`:
  - [[cdsd-planning]]
  - [[cdsd-execution]]
  - [[cdsd-sharing]]
- `overview`: SpecDojo が記録を置く場所（リポジトリ内の docs・execution・controls、端末側の状態ディレクトリ、worktree、一時ディレクトリ）ごとに、置くもの・Git で共有するか・寿命・消してよいかを一覧にする
- `path`: `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-C6BA/pjr-c6ba-20261115T233744Z-31505e55/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/sld-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-pm-plan-feasibility; line=100; anchor=``"| 日次集計の保存先と再生成手順が未整備             | 課題（`issue`）              | `data/summary/` は仮置きで、再生成手順がないため削除後に自動で戻せない                                                                                     | OPS・DEV が `specdojo:cop-sales-reconciliation` を整備し、QE が再集計の受入条件を確認する。整備までは手動再集計で扱う              | `specdojo:pjr-sales-storage`              |"``\]: `再生成タスクと103行目の STSD の変更に対して、完了または決定のマイルストーンを追加してください。責任者と暫定的な取り扱いは記載されていますが、PM はこれらのタスクをいつ完了させるべきか、あるいは再検討すべきかを判断できません。`
- F002 \[minor/vp-dev-implementation-readiness; line=64; anchor=``"| `config/store-config.yaml` が消失・破損した                | 会計を止める。DEV が外部退避媒体の最新世代を復元し、PO が店舗・税計算・本部接続の条件を確認する。CLI が「店舗設定不正」なしで起動し、表示条件が PO の確認値と一致すれば再開する。退避がなければ DEV が `kinuya-store-config-schema` に従い再作成し、PO の確認まで再開しない | OPS → DEV（復元）・PO（条件確認）                           |"``\]: `以前の名称のない再生成および受領再構築のギャップは、再生成を明示的に延期し、再構築の約束を削除することで解決されました。また、kinuya-store-config-schema を未出荷の架空のリファレンスとして特定し、設定の再作成をそのコントラクトの提供を条件としてください。`
- F003 \[minor/vp-qe-verifiability; line=29; anchor=``"| 撤去品保留箱（バックヤード下段・黄ラベル）                                                  | `_ASSUMPTION_`: 売場から撤去した期限切れ・破損品。STSD に対応する状態がない                                | 開店前の賞味期限確認、廃棄確定           | 店舗内共有（売場・返品保管箱と分離）                                         | 週次の廃棄確定日まで                                               | `条件付き処分可`。店主代表が廃棄を確定し、廃棄数を当日の日次締め記録の在庫差異欄へ記入した後に廃棄する                                                     |"``\]: `以前の矛盾していた保持に関する表現は解決されました。ここに記載されている週次の廃棄確認日を、日次決算時に確認と廃棄を指示している66行目と一致させ、レビュワーが必要な保持期間を判断できるようにしてください。`
- F004 \[major/vp-qe-kata-conformance; line=63; anchor=``"| `data/summary/` を誤って削除した                           | 再生成手順の整備後は、対象日・基準時点を指定して受付済みの `data/sales/` から `data/summary/` へ出力し直す。整備前は対象日の受付済み取引（結果不明は除く）を手動集計し、日次締め記録の参照値と照合する                                                                      | OPS が再集計、QE が一致を確認。不一致なら PO が締めを再判断 |"``\]: `日次サマリーの回収を clis-sample の現金のみのスコープと一致させてください：data/sales/ はその CLI によって生成されるもので、紙に記録された掛売り販売のソースを確立するものではありませんが、89行目では現金と掛売り販売の両方を想定しています。完全なソースマッピングを定義するか、サマリーのスコープを明示的に制限して引き渡してください。`
- F005 \[major/vp-qe-kata-conformance; line=7; anchor=`"BA（同行レビュー担当）と OPS（家族利用者代表・店舗運営アドバイザー）が日常の保管・清掃・処分の境界を整理し、ARC（技術メンター）・DEV（開発担当）が概念データストアおよび CLI の保存パスと整合させる。QE（同行レビュー担当）が検証手順と受入条件を確認し、PM が未決事項を管理台帳へつなぎ、店主代表が PO として保管方針と公開可否を最終判断する。"`\]: `メンバーからロールへの割り当てを pm-members-sample および pm-organization-sample と一致させてください：BA は開発代表者に属し、ピアレビュワーは QE を、ファミリー代表は OPS ではなく UX を担当しています。繰り返される回収の割り当てを修正するか、それらに頼る前に明示的な組織変更を記録してください。`
- F006 \[minor/vp-qe-kata-conformance; line=30; anchor=``"| レジ釣銭準備箱・手提げ金庫                                                                  | 釣銭準備金、当日の現金売上、仮領収メモ                                                                     | 開店準備、店頭販売、日次締め             | 店舗内共有（営業中は店番担当、閉店後は施錠）                                 | 営業開始から日次締め確定まで（毎日閉店時に精算）                   | `処分不可`。日次締めで店主代表が現金実査と販売額の一致を確認した後、売上金を母屋金庫へ移す。破棄できるのは締めに転記済みの仮メモだけ                       |"``\]: `電子保存の行は分離されましたが、この行には依然として、廃棄不可能な現金と廃棄可能な一時的なメモが組み合わされています。ルールブックの要求に従い、各行の有効期間と廃棄の決定が統一されるよう、それぞれの保存管理クラスを分離してください。`
- F007 \[minor/vp-ux-language-consistency; line=76; anchor=``"| 撤去品保留箱                                                        | STSD に対応状態なし（変更要求候補）                                                                                                                                                                                                   | 販売後の期限切れ・破損品を返品待ち（`return-pending`）と混同しないこと                                      |"``\]: `以前の保持ラベルの矛盾は解決されました。この箇所と103行目の「販売後」を、箱には販売済みの商品ではなく、未販売の期限切れまたは破損した在庫が含まれているため、顧客への引き渡し前に売り場から取り除くことを特定する表現に置き換えてください。`
- F008 \[major/vp-ops-operability; line=63; anchor=``"| `data/summary/` を誤って削除した                           | 再生成手順の整備後は、対象日・基準時点を指定して受付済みの `data/sales/` から `data/summary/` へ出力し直す。整備前は対象日の受付済み取引（結果不明は除く）を手動集計し、日次締め記録の参照値と照合する                                                                      | OPS が再集計、QE が一致を確認。不一致なら PO が締めを再判断 |"``\]: `暫定的な手書きの日次集計に紙に記録された掛売り販売を含め、その確認証跡を本部の受理と区別してください。受理された data/sales/ の取引のみを使用すると、その日の売上が過小評価される可能性があり、89行目の現金と掛売りを合わせた決算例を再現することができません。`

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-KATA-WAVE-2-sld-specdojo-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.sld-sample）の major の指摘を取り込む。rulebook は変えない
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.sld-sample.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.sld-sample.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
