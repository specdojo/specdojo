---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-cop-index-sample-050-20261123t133140z-48eb0f85
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-cop-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Plan: T-KATA-WAVE-5-cop-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: カットオーバー計画（全体構成）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、カットオーバー計画の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/cop-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-cop-index-sample-050/T-KATA-WAVE-5-cop-index-sample-050-20261123T133140Z-48eb0f85/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/cop-index-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=``"本書は、カットオーバー計画の全体SSOT（`cop-index`）として、当日実行の共通判断と導線を定義する最小サンプルである。"``\]: `切替対象（旧系→新系の内容）、切替の目的、対象外のシステム・業務・作業が書かれていないため、「概要（index）」章を設けて駄菓子屋きぬやの切替対象と対象外を1〜3行で示す必要がある。`
- F002 \[major/vp-po-decision-readiness; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `共通GO/NO-GO が項目名として挙がっているだけで、「判定点 / 条件 / 判断者 / 失敗時の扱い」の表がないため、PO が切替の可否を判断する材料がない。`
- F003 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項「要件詳細の補強」は対象、影響、判断者、期限が分からず、判断論点として機能しないので、具体的な未決事項（例: 切替日の確定、旧系の保持期間）に置き換える必要がある。`
- F004 \[minor/vp-po-publication-accountability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「責任者」が必須観点として挙がっているだけで、判定点ごとの判断者（例: 店主）が書かれていないため、最終判断と説明責任を誰が担うかが読み取れない。`
- F005 \[blocker/vp-pm-plan-feasibility; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `当日タイムラインと作業手順チェックリストが欠落しており、分単位の時刻・完了条件・実施者・証跡を持つ完成例になっていないため、切替作業の計画と進捗確認に使えない。`
- F006 \[major/vp-pm-dependency-risk; line=11; anchor=``"- 参照: `../rulebooks/cop-index-rulebook.md`"``\]: ``参照が rulebook への相対パスだけで、`mip-index`（判定点・ロールバック方針）、`dmd-index`（移行手順・所要時間）、`mtp-index`（リハーサル結果）、`otp-index`（運用引き渡し）への依存と「関連ドキュメント」章がない。``
- F007 \[major/vp-pm-dependency-risk; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決事項表に影響範囲やスケジュールへの影響がなく、リスクや後続成果物への波及を識別できない。`
- F008 \[major/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項に担当 Role code、期限、転記先がなく「実案件適用時に具体化する」だけなので、転記すべき未決事項として分離されていない。`
- F009 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `対象が「駄菓子屋の販売管理システム」だけで、切替が誰のどの業務に影響し、停止中の販売をどう続けるかが示されていないため、業務上の価値と影響を判断できない。`
- F010 \[major/vp-ba-requirements-completeness; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `必須観点が見出し語の列挙にとどまり、事前完了条件・未達時の扱い（延期・代替手順）・判断者を具体例として記述していない。`
- F011 \[major/vp-ba-requirements-completeness; line=5; anchor=``"本書は、カットオーバー計画の全体SSOT（`cop-index`）として、当日実行の共通判断と導線を定義する最小サンプルである。"``\]: `対象範囲と対象外（例: EC 連携や会計連携は対象外）が書かれておらず、利用者視点で切替範囲を確認できない。`
- F012 \[major/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「担当者、連絡系統」章が欠落しており、店主・家族の店番・開発担当などの役割、連絡経路、エスカレーション先が書かれていない。`
- F013 \[major/vp-arc-technical-constraints; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `共通ロールバック方針が項目名だけで、発動条件や復旧方針（旧系復帰・接続戻しなど）、旧系の保持といった技術的な前提が書かれていない。`
- F014 \[minor/vp-arc-conciseness; line=24; anchor=``"| 主な内容     | 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線 | 要点のみ記載                         |"``\]: `15行目の「主な内容」と表の「主な内容」行が同一文言であり、23行目の目的も5行目と重複しているため、説明章と表の二重記述をまとめて完成例本文に置き換えるべきである。`
- F015 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: `「最小記述例」が項目・値・備考の3行表だけで、作業手順チェックリスト（手順 / 作業内容 / 実施者 / 証跡 / 備考）の具体例がなく、実施に必要な入力と完了条件が読み取れない。`
- F016 \[major/vp-dev-change-impact; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `` `cop-＜term＞` への導線が項目名として挙がっているだけで、分冊や見直し対象を列挙する「関連ドキュメント」章（分冊がなければ `（本書のみ）`）がなく、変更時の影響先を識別できない。 ``
- F017 \[major/vp-dev-testability; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `手順ごとの証跡と完了条件、ロールバック完了条件、配信の証跡が書かれておらず、切替やロールバックの実施後に確認すべき項目が分からない。`
- F018 \[minor/vp-qe-verifiability; line=24; anchor=``"| 主な内容     | 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線 | 要点のみ記載                         |"``\]: `「主な内容」の値が「要点のみ記載」となっており、具体的な記述例として不十分である。`
- F019 \[major/vp-qe-verifiability; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `GO/NO-GO 条件、完了条件、ロールバック発動条件のいずれにも判定可能な条件（例: 未処理の注文が0件、T+30分）がなく、pass / fail を判定できない。`
- F020 \[blocker/vp-qe-omissions-consistency; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ルールブックで定義された必須見出し（1.概要 〜 10.関連ドキュメント）がすべて欠落している。`
- F021 \[blocker/vp-qe-omissions-consistency; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `タイムライン・ロールバック手順・周知が書かれておらず、rulebook の禁止事項（分単位で書かない、ロールバックの発動条件や手順を省略する、周知を書かない）に該当している。`
- F022 \[blocker/vp-qe-kata-conformance; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `成果物の構造（必須構成）を無視した概要説明になっており、完成例としての責務を果たしていない。`
- F023 \[minor/vp-qe-kata-conformance; line=11; anchor=``"- 参照: `../rulebooks/cop-index-rulebook.md`"``\]: ``本文で rulebook を相対パス参照しているが、sample と rulebook の対応は Frontmatter の `rulebook` で宣言済みであり、完成例の本文には不要なメタ参照である。``
- F024 \[minor/vp-qe-kata-conformance; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `「handbook の共通方針に準拠する」とあるが、共通サンプル文脈（駄菓子屋きぬや）の店舗・登場人物・業務を使った具体的な切替場面になっていない。`
- F025 \[major/vp-ux-readability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `必須構成が欠落し具体的記述がないため、成果物の正しい書き方を確認することができない。`
- F026 \[minor/vp-ux-language-consistency; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `対象名「駄菓子屋の販売管理システム」が共通サンプル文脈の名称「駄菓子屋きぬや 販売管理システム」と表記ゆれしている。`
- F027 \[minor/vp-ux-language-consistency; line=23; anchor=`"| 目的         | 当日実行の共通判断と導線を定義する                                          | specdojo:deliverables-reference 準拠 |"`\]: ``備考の `specdojo:deliverables-reference` が wikilink にもインラインコードにもなっていない識別子のまま書かれており、参照先として解釈できない。``
- F028 \[major/vp-ops-release-readiness; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `周知章と実施条件章が欠落しており、停止告知の対象・手段・時期・問い合わせ先と、切替前に完了しているべき条件が示されていない。`
- F029 \[major/vp-ops-operability; line=15; anchor=``"- 主な内容: 全体タイムライン、共通GO/NO-GO、共通ロールバック方針、`cop-<term>` への導線"``\]: `障害時判断の基準（重大度・SLO逸脱・復旧見込み）と連絡経路、ロールバックの発動条件と手順が書かれていないため、当日の障害対応に使えない。`

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
