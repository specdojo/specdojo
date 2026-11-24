---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-otp-sample-050-20261123t170828z-0134ca0e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-otp-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Plan: T-KATA-WAVE-5-otp-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用切替計画（対象別）の完成例
- `depends_on`:
  - [[specdojo:otp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、運用切替計画の対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/otp-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-otp-sample-050/T-KATA-WAVE-5-otp-sample-050-20261123T170828Z-0134ca0e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/otp-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=11; anchor=`"| API      | 5xx > 1%  | #ops   | P1は30分以内一次応答 | 5分平均 |"`\]: `監視対象・体制・連絡経路が一般的な企業システム運用（API 5xx、バッチ、Ops/Biz 常駐、チャットチャネル）になっており、駄菓子屋きぬやの単一店舗・タブレット1台・店主最終判断という前提と矛盾するため、共通サンプル文脈の目的（記録の継続、店主不在時の店番継続）に結び付く監視対象と体制へ書き換えること。`
- F002 \[minor/vp-po-decision-readiness; line=53; anchor=`"- P1=0が30日、P2が収束傾向、問い合わせが基準以下"`\]: `クローズ判断の承認者（PO 等の Role code）と未決事項（_UNDECIDED_ / _ASSUMPTION_ で明示すべき運用前提）を記載し、承認・保留の判断論点を明示すること。`
- F003 \[minor/vp-po-publication-accountability; line=54; anchor=`"- 既知不具合一覧がクローズし、運用引継ぎが完了"`\]: `移行完了クローズの最終承認責任者を Role code（例: PO）で明記し、説明責任の所在を明確にすること。`
- F004 \[minor/vp-pm-plan-feasibility; line=48; anchor=`"- 参照依頼は一次窓口で受付し、参照手順に従い対応する"`\]: `旧システムの停止時期と参照期間（例: 切替後◯日まで参照可、以降アーカイブ）を具体的に記載し、作業の順序付けと期限設定を可能にすること。`
- F005 \[minor/vp-pm-dependency-risk; line=56; anchor=`"## 11. 関連ドキュメント（必須）"`\]: ``Frontmatter に `based_on`（`mip-index` / `cop-index` 等）を宣言し、`otp-index` の共通方針（期間・SLA・優先度分類）との依存関係を明示すること。``
- F006 \[minor/vp-pm-control-reporting; line=38; anchor=`"- 連絡: #ops → #po → 利用者告知（#comms）"`\]: `障害・既知不具合・延長判断を記録する先（登録簿や既知不具合一覧）と報告先・担当 Role code を明記し、管理事項の転記経路を分離すること。`
- F007 \[major/vp-ba-business-value; line=5; anchor=``"本書はハイパーケアの対象別運用切替計画（`otp-<term>`）として、初期不具合・問合せ増への対応体制を定義する最小サンプルである。"``\]: `概要に、運用切替で守るべき業務価値（店頭販売・在庫・つけの記録継続、家族の店番支援など）と対象利用者を記載し、各章の監視・体制がその価値に対応することを示すこと。`
- F008 \[major/vp-ba-requirements-completeness; line=5; anchor=``"本書はハイパーケアの対象別運用切替計画（`otp-<term>`）として、初期不具合・問合せ増への対応体制を定義する最小サンプルである。"``\]: `概要に対象範囲（どの運用領域・利用者・サービスが対象か）を明記し、rulebook の記述ガイドが求める適用範囲を満たすこと。`
- F009 \[minor/vp-ba-requirements-completeness; line=21; anchor=`"- 追加権限: ハイパーケア担当に限定付与（期間終了で剥奪）"`\]: `権限/アカウント移行に、旧/新の権限差分、移行タイミング、切替当日の扱いを記載すること。`
- F010 \[minor/vp-ba-requirements-completeness; line=37; anchor=`"- 指揮: 運用責任者（必要に応じてPO）"`\]: `障害対応フローに、復旧・報告の流れと、エスカレーションの判断基準（重大度、影響範囲、復旧見込み）を記載すること。`
- F011 \[major/vp-ba-stakeholder-clarity; line=44; anchor=`"| 切替後2週間 | 8:00-20:00は常駐（Ops2 + Biz1）/ 夜間オンコール | P1:30分一次連絡、P2:2h | 運用責任者 | 延長はクローズ条件で判断 |"`\]: `体制・判断者・告知先を共通登場人物の役割名（店主代表、家族利用者代表、開発担当、店舗運営アドバイザー等）と Role code で記述し、Ops2/Biz1 などの独自ラベルを置き換えること。`
- F012 \[minor/vp-arc-technical-constraints; line=16; anchor=`"- 方式: 夜間フル + 日中差分（保持30日）"`\]: `バックアップの保管先と復旧目標（RTO/RPO）の方針を記載し、タブレット1台の構成前提と整合する技術的前提を明示すること。`
- F013 \[minor/vp-dev-implementation-readiness; line=17; anchor=`"- リストア責任者: 運用責任者"`\]: `リストア章に実施手順（参照先）と完了基準を記載し、作業に必要な入力を揃えること。`
- F014 \[minor/vp-dev-change-impact; line=28; anchor=`"| 問合せ受付 | メール | #support | 集約/可視化 | チャネル統一 | （運用手順リンク） |"`\]: `影響列に誰の何が変わるかを具体的に書き、参照列のプレースホルダ「（運用手順リンク）」を実在する文書 ID またはバッククォートの仮置き ID に置き換えること。`
- F015 \[minor/vp-dev-testability; line=22; anchor=`"- 検証: 当番ロールで監視/ログ参照/障害対応が可能であること"`\]: `アクセス検証の確認手順と期待結果（どのロールでどの操作が成功すれば合格か）を具体化し、リストア後の整合性確認方法も追加すること。`
- F016 \[minor/vp-qe-verifiability; line=53; anchor=`"- P1=0が30日、P2が収束傾向、問い合わせが基準以下"`\]: `完了条件における「基準以下」の具体的な数値や定義を明記し、判定を可能にすること。`
- F017 \[minor/vp-qe-verifiability; line=54; anchor=`"- 既知不具合一覧がクローズし、運用引継ぎが完了"`\]: `「運用引継ぎが完了」の状態を定義するチェックリストや成果物を明記し、客観的に判定可能にすること。`
- F018 \[minor/vp-qe-verifiability; line=53; anchor=`"- P1=0が30日、P2が収束傾向、問い合わせが基準以下"`\]: `「P2が収束傾向」を判定可能な条件（例: 直近◯日の新規P2件数が◯件以下）に置き換えること。`
- F019 \[minor/vp-qe-omissions-consistency; line=17; anchor=`"- リストア責任者: 運用責任者"`\]: `第3章「バックアップ/リストア」において、リストア時の完了基準（整合性確認等）を明記すること。`
- F020 \[minor/vp-qe-omissions-consistency; line=32; anchor=`"- 受付: #support / 09:00-18:00（期間中は延長運用あり）"`\]: `第6章「問合せ窓口/一次対応」において、エスカレーション条件（一次で止めない条件）を明記すること。`
- F021 \[minor/vp-qe-omissions-consistency; line=54; anchor=`"- 既知不具合一覧がクローズし、運用引継ぎが完了"`\]: `第10章「移行完了後のクローズ条件」において、クローズ判断者および最終報告物を明記すること。`
- F022 \[minor/vp-qe-omissions-consistency; line=56; anchor=`"## 11. 関連ドキュメント（必須）"`\]: `第11章の見出し「関連ドキュメント（必須）」を rulebook の本文構成どおり「関連ドキュメント」に揃えること。`
- F023 \[major/vp-qe-omissions-consistency; line=11; anchor=`"| API      | 5xx > 1%  | #ops   | P1は30分以内一次応答 | 5分平均 |"`\]: `監視/アラートの初動ルールにエスカレーション条件がなく、第4・6・7・9章でも rulebook の記述ガイドが求める項目（権限差分・移行タイミング、優先度分類、復旧・報告と判断基準、停止時期）が欠けているため、各章に補完すること。`
- F024 \[major/vp-qe-kata-conformance; line=11; anchor=`"| API      | 5xx > 1%  | #ops   | P1は30分以内一次応答 | 5分平均 |"`\]: `sample の業務文脈が共通サンプル文脈（駄菓子屋きぬや、単一店舗・タブレット1台）に統一されていないため、監視対象・窓口・体制を同文脈に合わせて書き直し、他業種の題材を排除すること。`
- F025 \[major/vp-qe-kata-conformance; line=44; anchor=`"| 切替後2週間 | 8:00-20:00は常駐（Ops2 + Biz1）/ 夜間オンコール | P1:30分一次連絡、P2:2h | 運用責任者 | 延長はクローズ条件で判断 |"`\]: ``関係者表記（運用責任者、Ops2 + Biz1 等）を `sample-authoring-standard.md` の共通登場人物の役割名と Role code に置き換えること。``
- F026 \[minor/vp-ux-readability; line=5; anchor=``"本書はハイパーケアの対象別運用切替計画（`otp-<term>`）として、初期不具合・問合せ増への対応体制を定義する最小サンプルである。"``\]: ``概要に対象範囲と `otp-index`（共通方針）との関係を1〜2行で補い、本書の位置づけを初見で理解できるようにすること。``
- F027 \[minor/vp-ux-language-consistency; line=53; anchor=`"- P1=0が30日、P2が収束傾向、問い合わせが基準以下"`\]: `「問い合わせ」と「問合せ」の表記を rulebook の見出しに合わせて統一し、役割表記も役割名または Role code のどちらかに揃えること。`
- F028 \[minor/vp-ops-release-readiness; line=9; anchor=`"| 監視対象 | 指標/閾値 | 通知先 | 初動ルール           | 備考    |"`\]: `未確定の運用前提（オフライン時の対応、旧システム停止日など）を _UNDECIDED_ / _ASSUMPTION_ で明示し、ready 化前に解決すべき事項を読み取れるようにすること。`
- F029 \[minor/vp-ops-operability; line=33; anchor=`"- 一次対応: 既知不具合案内、ログ採取依頼、再現条件ヒアリング"`\]: `一次対応から開発担当等へ引き渡すエスカレーション条件と引継ぎ先 Role code を明記し、問い合わせ対応の運用導線を完結させること。`

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
