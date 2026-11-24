---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opd-access-control-sample-050-20261123t090507z-4c39bd3f
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opd-access-control-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:opd-access-control-sample
    - specdojo:opd-access-control-sample
---

# Edit Plan: T-KATA-WAVE-5-opd-access-control-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用方針・設計（権限・アカウント運用）の完成例
- `depends_on`:
  - [[specdojo:opd-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、権限・アカウント運用の方針の完成例を示す
- `path`: `docs/ja/specdojo/samples/opd-access-control-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opd-access-control-sample-050/T-KATA-WAVE-5-opd-access-control-sample-050-20261123T090507Z-4c39bd3f/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/opd-access-control-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=7; anchor=``"権限付与/剥奪、棚卸し、監査ログ、緊急権限を `opd-index` の差分として定義する。"``\]: ``概要が、権限統制の必要性（家族による店番、店内タブレット1台の共用、店主の最終判断）を共通サンプル文脈の目的・前提と結び付けておらず、`based_on` も空のため、方針の上位根拠を説明できない。``
- F002 \[minor/vp-po-decision-readiness; line=13; anchor=`"- ブレークグラスは2名承認 + 24時間で自動失効（原則）"`\]: ``ブレークグラスの「24時間で自動失効（原則）」の例外条件と判断者が書かれておらず `_UNDECIDED_` などの印もないため、例外運用を承認するか保留するかを PO が判断できない。``
- F003 \[minor/vp-pm-plan-feasibility; line=12; anchor=`"- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する"`\]: `月次棚卸しの実施担当（Role code）と完了条件（例: 差異の解消記録まで）が書かれておらず、定期タスクとして owner と完了判定を割り当てられない。`
- F004 \[minor/vp-pm-dependency-risk; line=7; anchor=``"権限付与/剥奪、棚卸し、監査ログ、緊急権限を `opd-index` の差分として定義する。"``\]: ``差分元である `opd-index` を関連ドキュメント表にも `based_on` にも挙げていないため、`opd-index` の統制が変わったときの依存関係を本書からたどれない。``
- F005 \[minor/vp-pm-control-reporting; line=12; anchor=`"- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する"`\]: `棚卸しで不要権限や不正付与を見つけたときの報告先（Role code）と対応方針が書かれておらず、課題・リスクとしての転記先が分からない。`
- F006 \[minor/vp-ba-business-value; line=7; anchor=``"権限付与/剥奪、棚卸し、監査ログ、緊急権限を `opd-index` の差分として定義する。"``\]: `権限・アカウント方針が、駄菓子屋きぬやのどの利用者（店主代表、家族利用者代表など）のどの課題（つけ残高の誤操作・改ざん防止など）に応えるかが書かれておらず、方針の業務上の価値を説明できない。`
- F007 \[major/vp-ba-requirements-completeness; line=12; anchor=`"- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する"`\]: `監査ログ方針に記録対象、保持期間、確認者がなく、剥奪の契機と権限区分も書かれていないため、rulebook が権限・アカウント運用に求める項目（付与/剥奪ルール、監査ログ方針）を満たしていない。`
- F008 \[major/vp-ba-stakeholder-clarity; line=11; anchor=`"- 付与/剥奪はチケット起票を必須とし、承認者はOps Leadとする"`\]: `承認者「Ops Lead」が共通サンプル文脈の役割名にも Role code にもなく、権限の付与対象（店主代表、家族利用者代表、開発担当など）も書かれていないため、関係者と承認責任を読み取れない。`
- F009 \[minor/vp-arc-technical-constraints; line=11; anchor=`"- 付与/剥奪はチケット起票を必須とし、承認者はOps Leadとする"`\]: ``チケット管理、監査ログ保管領域、自動失効の仕組みを前提にしているが、店内タブレット1台・単一店舗という前提との対応や `_ASSUMPTION_` の明示がなく、技術的な前提が読み取れない。``
- F010 \[minor/vp-arc-conciseness; line=3; anchor=``"- 参照: `../rulebooks/opd-rulebook.md`"``\]: ``「参照: `../rulebooks/opd-rulebook.md`」は Frontmatter の `rulebook` と重複しており、削っても判断に必要な情報が失われないため削除できる。``
- F011 \[minor/vp-dev-implementation-readiness; line=13; anchor=`"- ブレークグラスは2名承認 + 24時間で自動失効（原則）"`\]: `ブレークグラスの実現方式（専用アカウントか一時的な権限昇格か）と監査ログの保管先・保持期間が書かれておらず、設定作業の入力として不足している。`
- F012 \[minor/vp-qe-verifiability; line=12; anchor=`"- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する"`\]: `月次棚卸しの合否判定条件（例: 不要権限の残存0件、差異の解消記録あり）がなく、13行目の「（原則）」も曖昧語のため、運用が方針どおりかを pass / fail で判定できない。`
- F013 \[major/vp-qe-omissions-consistency; line=19; anchor=`"| 手順 | opr-access-control | アカウント付与/剥奪/棚卸し手順 | 必須 |"`\]: ``rulebook の「関連ドキュメント導線（`opr` 等）」が必須とする `opr-index` への導線が関連ドキュメント表になく、`opr-access-control` だけが記載されている。``
- F014 \[major/vp-qe-kata-conformance; line=11; anchor=`"- 付与/剥奪はチケット起票を必須とし、承認者はOps Leadとする"`\]: `内容が共通サンプル文脈（駄菓子屋きぬや、単一店舗、店主が最終判断）ではなく一般的な企業の運用（Ops Lead、チケット起票、2名承認）になっており、責務の表記にも Role code を使っていないため、sample-authoring-standard の業務文脈統一と Role code 規約に反する。`
- F015 \[minor/vp-ux-readability; line=13; anchor=`"- ブレークグラスは2名承認 + 24時間で自動失効（原則）"`\]: `「ブレークグラス」に説明（障害時などに通常の承認を経ずに使う緊急権限）がなく、「（原則）」の例外も書かれていないため、初めて読む人が緊急権限の方針を読み取りにくい。`
- F016 \[minor/vp-ux-language-consistency; line=11; anchor=`"- 付与/剥奪はチケット起票を必須とし、承認者はOps Leadとする"`\]: `「Ops Lead」が共通サンプル文脈の役割名・Role code と表記をそろえておらず、7行目の「緊急権限」と13行目の「ブレークグラス」も同じ概念の表記揺れになっている。`
- F017 \[minor/vp-ops-operability; line=12; anchor=`"- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する"`\]: `月次棚卸しの実施責任者（Role code）と、実施されなかったときのエスカレーション方針が書かれておらず、継続運用で抜けを検知・是正できない。`

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
