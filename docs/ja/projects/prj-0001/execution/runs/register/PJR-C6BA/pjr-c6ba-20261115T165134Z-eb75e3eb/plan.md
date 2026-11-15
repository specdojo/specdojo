---
specdojo:
  id: prj-0001:xep-pjr-c6ba-20261115t165134z-eb75e3eb
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
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-C6BA/pjr-c6ba-20261115T165134Z-eb75e3eb/result.md`

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

- F001 \[major/vp-pm-dependency-risk; line=85; anchor=``"| タブレット内 `data/sales/` の外部バックアップ媒体と世代数（未決） | `_UNDECIDED_`: 日次締め後に SD カードまたは USB メモリへ退避する方針だが、媒体の保管場所と保持世代数が未確定 | OPS・DEV が媒体候補とコピー手順を整理し、運用開始前に PO（店主代表）が保管場所（手提げ金庫または母屋金庫）と世代数を決定する                         | `specdojo:pjr-sales-storage`   |"``\]: `Expand the dependency tracking beyond backup media: cdsd-sample leaves storage and regeneration procedures unresolved, while clis-sample leaves reconciliation contracts incomplete; identify these dependencies, their operational impact, responsible roles, and resolution timing before treating recovery procedures as available.`
- F002 \[minor/vp-pm-control-reporting; line=83; anchor=`"| 論点・区分                                                        | 現在の判断・影響                                                                                             | 担当・判断時期・次の行動                                                                                                                             | 追跡先候補                     |"`\]: `Classify the tracking candidates as issue, risk, change-request, or decision as appropriate, and identify the PM handoff; the current labels of unresolved matter and change impact do not establish which management record should receive each item.`
- F003 \[major/vp-ba-requirements-completeness; line=20; anchor=`"## 2. 保管場所一覧"`\]: `Define storage requirements for purchasing and inventory records, or explicitly exclude and hand off those records; the declared scope includes purchasing and inventory, and disposal procedures require updating these records, but neither record has an identified storage location or retention and access policy.`
- F004 \[major/vp-dev-implementation-readiness; line=57; anchor=``"| 日次販売集計（`data/summary/`）を誤って削除した      | `data/sales/` の売上記録が残っていることを確認し、対象日を指定して日次集計処理を再実行して復元する                             | OPS（家族利用者代表）、QE（同行レビュー担当）が一致を確認     |"``\]: `Identify an executable or explicitly pending regeneration procedure for daily summaries, including the source selection and output destination, and provide the corresponding receipt reconstruction reference for line 40; unnamed aggregation and re-output operations are insufficient inputs for implementing the promised recovery behavior.`
- F005 \[minor/vp-dev-change-impact; line=86; anchor=``"| 紙の商品台帳・締め記録をタブレットへ完全移行する場合（変更影響）  | 店頭台帳保管棚の正本区分と `data/` 配下のファイル構成・バックアップ対象が変更になる                          | BA が [[specdojo:cdsd-sample\\|概念データストア定義（駄菓子屋きぬやの販売と締め）]] の正本区分を更新し、ARC・DEV が保存パス、OPS が退避手順を改訂する | `specdojo:pjr-paper-to-tablet` |"``\]: `Extend the paper-to-tablet migration impact to summary regeneration, receipt reconstruction, and the acceptance checks that depend on those processes; changing authoritative records and file layout requires reviewing these consumers as well as backup procedures.`
- F006 \[minor/vp-dev-testability; line=76; anchor=``"| `[ARC・DEV]` 実装配置・CLI 仕様との一致 | `config/store-config.yaml`、`.session/current-tx.json`、`data/sales/`、`receipts/` のパスおよび役割を [[specdojo:clis-sample\\|駄菓子屋きぬや 販売管理 CLI 仕様]] と照合する  | タブレット内領域のパス区分、入出力ファイル、終了時挙動に矛盾がなく、進行中セッションと確定正本が物理的に分離されていること |"``\]: `Add verification cases and expected outcomes for a missing configuration file, an interrupted transaction with an unknown headquarters result, and regenerated summaries; the current path comparison does not test the failure behavior asserted by the storage and recovery rules.`
- F007 \[major/vp-qe-verifiability; line=39; anchor=``"| ローカル販売記録・日次集計領域（`data/sales/`・`data/summary/`） | 確定済みの売上記録・売上明細データ（`data/sales/TX-YYYYMMDD-NNNN.json`）、日次販売集計（`data/summary/`）  | `sales complete`、日次締め集計処理                                          | 共有なし（店舗タブレット内正本・日次で外部メディアへ退避） | 売上記録は恒久保持（3年間）、日次集計は随時再生成可能       | `data/sales/` は `削除不可`（確定取引の正本）。`data/summary/` は `条件付き削除可`（削除しても `data/sales/` から再生成可能） |"``\]: `Replace the conflicting retention expression "恒久保持（3年間）" with one unambiguous policy, including its start point, archive conditions, and treatment after expiry; a reviewer cannot determine whether records older than three years must remain indefinitely or leave local storage.`
- F008 \[major/vp-qe-omissions-consistency; line=31; anchor=``"| 店頭台帳保管棚（施錠キャビネット） | 紙の商品台帳、顧客・つけ台帳、納品伝票綴り、日次締め記録・月次報告バインダー | つけ販売、日次締め、月次見直し       | 店舗内共有（店主代表・家族利用者代表のみ閲覧可） | 当年度＋過去3年間保管（年度末に旧年度分を母屋書庫へ退避） | `処分不可`。取引・未収金・税務の正本記録のため破棄しない。顧客情報を含むため来店客から見えない施錠棚に保管する         |"``\]: `Add standard-column entries for the mother-house archive and safe used as mandatory destinations in lines 30–31 and 48, including access, retention, and disposal conditions; moving records or cash out of the listed locations currently ends their defined storage controls.`
- F009 \[major/vp-qe-omissions-consistency; line=20; anchor=`"## 2. 保管場所一覧"`\]: `Add locations and storage controls for purchasing and inventory records, or document their explicit handoff and exclusion; these records are required by the declared scope and operational procedures but are absent from the location inventory.`
- F010 \[major/vp-qe-kata-conformance; line=37; anchor=``"| 店舗設定ファイル領域（`config/store-config.yaml`）               | 店舗コード、消費税率端数処理設定、データ保存先パス設定                                                     | CLI 初期設定、全コマンド実行時の設定読込                                    | 共有なし（店舗タブレット固有・設定バックアップ対象）       | 店舗運用期間中（恒久保持・設定変更時のみ更新）              | `削除不可`。削除すると全 CLI コマンドが起動不能になる。変更時は旧ファイルを退避したうえで開発担当または店主代表が更新する     |"``\]: `Correct the claim that deleting config/store-config.yaml prevents every CLI command from starting; clis-sample explicitly permits the relevant commands to continue with default settings when this file is absent, so the storage example must distinguish missing configuration from invalid configuration.`
- F011 \[major/vp-qe-kata-conformance; line=39; anchor=``"| ローカル販売記録・日次集計領域（`data/sales/`・`data/summary/`） | 確定済みの売上記録・売上明細データ（`data/sales/TX-YYYYMMDD-NNNN.json`）、日次販売集計（`data/summary/`）  | `sales complete`、日次締め集計処理                                          | 共有なし（店舗タブレット内正本・日次で外部メディアへ退避） | 売上記録は恒久保持（3年間）、日次集計は随時再生成可能       | `data/sales/` は `削除不可`（確定取引の正本）。`data/summary/` は `条件付き削除可`（削除しても `data/sales/` から再生成可能） |"``\]: `Reconcile the claimed authoritative sales storage and established summary path with the referenced specifications: clis-sample describes data/sales/ as a local copy containing transmission results, while cdsd-sample excludes unresolved transactions from authoritative sales records and leaves summary storage unresolved; define the separation and label any additional storage assumptions.`
- F012 \[major/vp-qe-kata-conformance; line=67; anchor=``"| 検品場所、バックヤード、売場棚、返品保管箱             | [[specdojo:stsd-sample\\|商品のステータス定義]] の入荷済み（`received`：検品場所）・検品済み（`inspected`：検品場所）・販売可能（`sellable`：売場棚・バックヤード）・返品待ち（`return-pending`：返品保管箱）                                                                  | 状態ごとの物理配置が明確に分離され、販売不可品（入荷受入待ち・返品待ち）が売場棚に混在しないこと                                        |"``\]: `Align the product-state mapping with stsd-sample or record a proposed change: stsd-sample requires sales-floor placement for sellable and limits return-pending to rejected incoming goods, whereas this sample assigns sellable to backyard stock and uses the return box for expired or damaged sales stock without explaining the state boundary.`
- F013 \[minor/vp-qe-kata-conformance; line=39; anchor=``"| ローカル販売記録・日次集計領域（`data/sales/`・`data/summary/`） | 確定済みの売上記録・売上明細データ（`data/sales/TX-YYYYMMDD-NNNN.json`）、日次販売集計（`data/summary/`）  | `sales complete`、日次締め集計処理                                          | 共有なし（店舗タブレット内正本・日次で外部メディアへ退避） | 売上記録は恒久保持（3年間）、日次集計は随時再生成可能       | `data/sales/` は `削除不可`（確定取引の正本）。`data/summary/` は `条件付き削除可`（削除しても `data/sales/` から再生成可能） |"``\]: `Split data/sales/ and data/summary/ into separate inventory rows, and likewise separate receipts/ from tmp/ in line 40; the rulebook defines one row as a storage class with uniform lifetime and deletion decisions, but these combined rows contain different policies.`
- F014 \[minor/vp-qe-kata-conformance; line=78; anchor=``"| `[OPS]` 削除可否・復旧判断の実効性      | 第2章および第3章の判断基準を用い、日常運用（清掃・障害復旧・容量整理・返品）における判断をシミュレーションする                                                               | 店主代表および店番担当が「消してよい場所」「残すべき場所」、削除前確認条件、削除後の復旧手順を迷わず判断できること         |"``\]: `Replace chapter-number-only references with the chapter titles; the rulebook explicitly prohibits references such as 第2章 and 第3章 without titles because numbering changes can redirect the reader.`
- F015 \[major/vp-ux-language-consistency; line=39; anchor=``"| ローカル販売記録・日次集計領域（`data/sales/`・`data/summary/`） | 確定済みの売上記録・売上明細データ（`data/sales/TX-YYYYMMDD-NNNN.json`）、日次販売集計（`data/summary/`）  | `sales complete`、日次締め集計処理                                          | 共有なし（店舗タブレット内正本・日次で外部メディアへ退避） | 売上記録は恒久保持（3年間）、日次集計は随時再生成可能       | `data/sales/` は `削除不可`（確定取引の正本）。`data/summary/` は `条件付き削除可`（削除しても `data/sales/` から再生成可能） |"``\]: `Use a consistent retention label instead of combining "恒久保持" with "3年間"; these terms instruct readers to apply incompatible retention periods to the same authoritative records.`
- F016 \[major/vp-ops-release-readiness; line=88; anchor=``"公開および `status: ready` への昇格前に、BA・ARC・DEV・OPS・QE が上記の受入条件を確認し、人間の PO（店主代表）が顧客情報の施錠保管と未決バックアップ方式の扱いを承認する。agent は `status: draft` を維持する。"``\]: `Include unresolved transaction reconciliation and unestablished regeneration procedures in the publication and operational-readiness decision, with explicit conditions for withholding the affected procedures; approving only the backup uncertainty does not address the unresolved recovery dependencies declared by clis-sample and cdsd-sample.`
- F017 \[major/vp-ops-operability; line=56; anchor=``"| 会計途中でタブレットが再起動し新規会計を始められない | 来店客との会計が継続中か確認する。やり直す場合は `sales cancel` を実行するか `.session/current-tx.json` を削除する             | OPS（家族利用者代表）。解消しない場合は DEV（開発担当）へ連絡 |"``\]: `Require the PO and DEV to reconcile headquarters acceptance and local transaction state before permitting cancellation or deletion after a restart; the current instruction allows resetting an unresolved transaction, which can remove reconciliation evidence and lead to duplicate registration.`
- F018 \[major/vp-ops-operability; line=52; anchor=`"### 3.2. 場面別の対処と復旧手順"`\]: `Add a recovery route for accidental loss or corruption of config/store-config.yaml and data/sales/, identifying the backup prerequisite, responsible roles, restore verification, and escalation when no usable backup exists; declaring these locations non-deletable does not provide an operational response when they are lost.`

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

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
