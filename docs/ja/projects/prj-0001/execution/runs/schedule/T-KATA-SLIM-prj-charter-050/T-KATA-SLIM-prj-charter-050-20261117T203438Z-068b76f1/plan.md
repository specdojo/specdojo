---
specdojo:
  id: prj-0001:xep-t-kata-slim-prj-charter-050-20261117t203438z-068b76f1
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-prj-charter-050
  name: "sample から運用の記述と言い直しを外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - prj-0001:prj-charter
    - specdojo:prj-charter-sample
---

# Edit Plan: T-KATA-SLIM-prj-charter-050

## 1. このフェーズで行うこと

直した rulebook に沿い、対応する sample から文書の運用の記述と同じ判断の言い直しを外す。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]]）と、改訂済みの [[specdojo:sld-sample|sld-sample]] である。 外す記述: 役割の段落、末尾の承認と agent の段落、検証の表の文書品質の行、未決事項の表の管理台帳の区分・担当・追跡先の列と登録の段落。 sample には共通の運用の参照文も書かない（rulebook が担う）。 同じ判断は 1 か所の表を正とし、ほかの章は章タイトルで参照する。隣接仕様との分担と対応は 1 つの表にまとめ、概要では再掲しない。 表のセルは要点にし、手順は場面別の表へ寄せる。 結論（判断の基準、値、例外、未決事項の論点）は変えない。変えた場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 7 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 この段で直すのは sample だけとする。recipe・template・rulebook は commit の対象外のため変えず、template などに同じ運用の記述があれば変更案として result に書く。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクト憲章
- `depends_on`:
  - [[prj-0001:prj-overview]]
  - [[prj-0001:prj-stakeholder-register]]
- `overview`: プロジェクトの正式な認可と権限委譲を文書化
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-charter.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-prj-charter-050/T-KATA-SLIM-prj-charter-050-20261117T203438Z-068b76f1/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/prj-charter-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-qe-verifiability; line=88; anchor=``"| 目的整合 | 成果物体系、公開対象、優先順位がプロジェクトの目的と矛盾しない   | `pm-plan` / 決定記録          |"``\]: `GO / Not GO表の「矛盾しない」「責任範囲が確認できる」「整っている」には判定項目や必須状態がなくpass / failが一意にならないため、照合対象、必須承認、必要なstatusやgrade verdictなどの合格条件を明示してください。`
- F002 \[minor/vp-qe-verifiability; line=106; anchor=``"| 初回承認日         | _UNDECIDED_ | 店主代表（`PO`） | 憲章初版の承認時に記録する                                      |"``\]: ``未決事項4件の期限がすべて`_UNDECIDED_`で解消期限を判定できないため、日付が未確定でも「詳細計画承認前」「初期運用開始前」など確認可能な期限条件を記載してください。``
- F003 \[minor/vp-qe-omissions-consistency; line=32; anchor=`"## 3. ハイレベルスコープ"`\]: `rulebookがハイレベルスコープに要求し、メンバー定義にも複数のagentが存在するAI Agentの支援範囲が記載されていないため、許可する支援作業と人間に残す判断責任を追加してください。`
- F004 \[minor/vp-qe-omissions-consistency; line=64; anchor=``"次の事項は店主代表（`PO`）の承認を必要とする。"``\]: `rulebookがPO承認事項として必須化しているライセンス方針の確定が箇条書きから欠落しているため、承認対象へ追加してください。`
- F005 \[minor/vp-qe-omissions-consistency; line=80; anchor=``"| 制約 | 顧客情報は必要最小限にし、公開サンプルには個人情報を含めない                           | `prj-assumptions-constraints-dependencies` |"``\]: `rulebookが公開文書の制約として要求する秘密情報および非公開組織情報の禁止がなく、個人情報だけに限定されているため、公開対象外となる情報区分を補完してください。`
- F006 \[minor/vp-qe-kata-conformance; line=13; anchor=`"| 直接根拠        | [プロジェクト概要サンプル](prj-overview-sample.md)、[ステークホルダー登録簿サンプル](prj-stakeholder-register-sample.md) |"`\]: `参照先が作成済みであるにもかかわらず、直接根拠は相対Markdownリンク、成功基準・スコープ・成果物カタログ・管理文書などはバッククォートIDのままであるため、rulebook 6.1に従い実在するdocument_idへのwikilinkへ更新してください。`
- F007 \[minor/vp-qe-kata-conformance; line=32; anchor=`"## 3. ハイレベルスコープ"`\]: `rulebook 6.4が求めるAI Agentの支援範囲がハイレベルスコープの完成例へ反映されていないため、適用する支援範囲を具体値で示してください。`
- F008 \[major/vp-qe-kata-conformance; line=48; anchor=``"| `STH-OWNER`             | 店主代表       | スポンサー / 意思決定者 / 利用者 | `PO`           | 目的、優先順位、予算枠、リリース可否を判断する   |"``\]: ``初期ステークホルダー表が直接根拠の登録簿と一致せず、`STH-SHOP-OWNER`を`STH-OWNER`、`STH-DEVELOPER`（`DEV`）を`STH-DEVELOPMENT`（`PM`）へ変更し, 家族利用者へ未登録の`BA`を割り当て、未登録の常連客・仕入れ先を追加する一方で技術メンターを欠落させているため、登録簿のID・Role code・掲載対象に合わせてください。``
- F009 \[minor/vp-ux-readability; line=30; anchor=``"成功判定の観点と受入条件は `prj-success-criteria-and-acceptance-criteria` を正とする。"``\]: `成功基準、スコープ、成果物カタログ、前提・制約、管理計画、組織定義、RACI、品質計画が作成済みでもクリック可能な参照になっていないため、表示名を伴うwikilinkへ置き換えて次に読む正本へ直接到達できるようにしてください。`
- F010 \[major/vp-ux-language-consistency; line=48; anchor=``"| `STH-OWNER`             | 店主代表       | スポンサー / 意思決定者 / 利用者 | `PO`           | 目的、優先順位、予算枠、リリース可否を判断する   |"``\]: ``店主代表、家族利用者、開発担当のID・名称・Role codeがステークホルダー登録簿およびメンバー定義と一致せず、特に開発担当の`DEV`と`PM`、家族利用者とagentの`BA`を区別できないため、正本に合わせて識別子とRole codeを統一してください。``
- F011 \[minor/vp-ux-language-consistency; line=100; anchor=`"本書はドラフトであり、承認日と証跡リンクが確定するまでは正式な立ち上げ認可文書として扱わない。"`\]: ``Frontmatterの`status: ready`に対して本文が無限定に「本書はドラフト」と記して文書状態が矛盾して見えるため、本文を「立ち上げ認可は未承認」などに改め、成果物の成熟度とプロジェクト認可状態を区別してください。``

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
