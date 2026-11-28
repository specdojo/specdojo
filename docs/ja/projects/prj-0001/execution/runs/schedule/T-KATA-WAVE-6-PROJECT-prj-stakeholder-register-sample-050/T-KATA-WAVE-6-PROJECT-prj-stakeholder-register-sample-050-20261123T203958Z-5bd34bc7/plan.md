---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-stakeholder-register-sample-050-20261123t203958z-5bd34bc7
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: sample-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: ステークホルダー登録簿の完成例
- `depends_on`:
  - [[specdojo:prj-overview-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、ステークホルダー登録簿の完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-050/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-050-20261123T203958Z-5bd34bc7/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PO（Project Owner）**
- 責務: 公開可能な SpecDojo 文書基盤としての目的・スコープ・優先順位・公開方針を最終判断する。

このロールが重視するレビュー観点:

- 目的・スコープとの整合: 成果物の主要な定義・判断が、プロジェクト目的、スコープ、優先順位、公開方針と矛盾せず、成果物固有の目的または上位文書への参照から必要性を説明できるか。対応する目的・成果のない手段を目的として扱っていないか。
- 承認判断に必要な情報: PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。文書の役割の割り当てと承認の進み具合は登録簿で追うため、本文に求めない。
- 公開可否と説明責任: 公開してよい情報だけで構成され、最終判断と説明責任を人間の PO が担う前提になっているか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=20; anchor=``"| `STH-SHOP-OWNER`  | 店主代表     | High   | High   | 日常的な操作だけで在庫と販売管理を行える | システムが複雑になり、日々の記録が行われなくなる | システムの目的、優先機能、リリース範囲 | プロジェクト全体の方向性を決定し判断する   |"``\]: `店主代表の主な期待が「在庫と販売管理」だけで、上位概要が一元管理の対象とする常連顧客のつけ管理が抜けており、合意対象と目的の対応を説明しきれないため、つけ残高の記録・確認を期待に含める必要がある。`
- F002 \[minor/vp-po-decision-readiness; line=32; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | ソフト使用経験なし         | システムで店番を行える               | リリース後に試利用させる                                       | `PO`   | リリース準備完了後 | Issue               |"``\]: `家族利用者の試利用が「リリース後」となっており、その結果を PO がリリース可否の判断材料にするのかどうかが読み取れないため、試利用結果を承認判断に使う時点と判断者を明記する必要がある。`
- F003 \[minor/vp-pm-plan-feasibility; line=29; anchor=``"| `STH-SHOP-OWNER`  | 店主代表     | データや記録に頼っている   | システム利用へ切り替わる             | 優先機能ごとに確認・承認を行い、操作方法を簡易手順書で共有する | `PO`   | イテレーション末   | Issue, Pull Request |"``\]: `期限「イテレーション末」「タスク単位」は、どの判断の節目までに合意を取るかを示さず、イテレーションの定義もないため、初期リリース前などの判断の節目で期限を書く必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=32; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | ソフト使用経験なし         | システムで店番を行える               | リリース後に試利用させる                                       | `PO`   | リリース準備完了後 | Issue               |"``\]: `家族利用者の試利用を「リリース準備完了後」に置くと、上位概要の初期公開指標がリリース前に要求する家族利用者代表の作業完遂確認と順序が合わず、リリース遅延のリスクが識別されないため、リリース前の確認として予定に組み込む必要がある。`
- F005 \[minor/vp-pm-control-reporting; line=39; anchor=``"| `STH-DEVELOPER`   | 開発担当     | 機能定義とテスト完了確認         | チャット, Pull Request | デザイン方針と実装結果を共有       | Pull Request          | イテレーション末               |"``\]: `「コミュニケーション計画への反映」列の「イテレーション末」「週次相談」は時期や会議体で、計画へ渡す入力内容ではないため、判断依頼・報告事項など転記対象の内容に統一する必要がある。`
- F006 \[minor/vp-ba-business-value; line=7; anchor=`"## 1. 関係者一覧"`\]: `上位概要でつけ管理の改善価値を受ける常連顧客の期待・懸念が登録簿にないため、つけ残高の正確な記録・確認という期待価値を誰に提供するかを説明できるよう、該当集団を追加する必要がある。`
- F007 \[minor/vp-ba-requirements-completeness; line=23; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | High   | Medium | 習熟なしでも既存手順に近い操作ができる   | システムに慣れることができなくなる               | UI の操作性検証結果と手順書            | 導入後の継続利用を左右する                 |"``\]: `家族利用者の必要な合意「UI の操作性検証結果と手順書」は、対象操作と合意できる結果が示されず受入条件として確認できないため、販売記録・在庫確認・つけ残高確認の完遂など上位概要の初期公開指標と対応付ける必要がある。`
- F008 \[major/vp-ba-stakeholder-clarity; line=7; anchor=`"## 1. 関係者一覧"`\]: `上位概要でつけ情報を管理される常連顧客である子どもや近所の大人が関係者一覧になく、影響受容者の期待・懸念・合意対象を読み取れないため、関与区分「影響受容者」として追加する必要がある。`
- F009 \[minor/vp-arc-conciseness; line=31; anchor=``"| `STH-TECH-MENTOR` | 技術メンター | メンター参加レベルの支援中 | スコープに影響しない範囲で助言を行う | 週次相談を行い、判断と責務を開発担当に委譲する                 | `DEV`  | 週次               | チャット, Issue     |"``\]: `技術メンターの「週次相談／週次」が関係者一覧、エンゲージメント方針、コミュニケーション要件で反復され、同じ行でも対応方針と期限に頻度を重ねているため、登録簿には期限条件を一か所だけ残し詳細頻度はコミュニケーション計画へ委譲する必要がある。`
- F010 \[minor/vp-dev-change-impact; line=43; anchor=`"## 5. 見直し条件"`\]: `見直し条件の見直し内容に、関係者の追加・削除・関与変更が同じ ID を使う各章とコミュニケーション計画へ及ぼす影響の更新が含まれず、変更の影響範囲を辿れないため追記する必要がある。`
- F011 \[minor/vp-qe-verifiability; line=30; anchor=``"| `STH-DEVELOPER`   | 開発担当     | 実装を行う                 | 要件に基づいた着実な進捗             | 機能範囲と確認方法を明確にし、設計・結果を店主に提示する       | `DEV`  | タスク単位         | Pull Request        |"``\]: `` `STH-DEVELOPER` の目標「要件に基づいた着実な進捗」は、完了状態、判定時点、確認対象のいずれも特定できず pass / fail を判定できないため、観測可能な進捗状態に置き換える必要がある。 ``
- F012 \[minor/vp-qe-verifiability; line=32; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | ソフト使用経験なし         | システムで店番を行える               | リリース後に試利用させる                                       | `PO`   | リリース準備完了後 | Issue               |"``\]: `` `STH-FAMILY-USER` の目標「システムで店番を行える」と証跡「Issue」だけでは、どの操作をどの支援条件で完了すれば達成か判定できないため、上位概要の販売記録・在庫確認・つけ残高確認の初期公開指標に対応付ける必要がある。 ``
- F013 \[minor/vp-qe-verifiability; line=29; anchor=``"| `STH-SHOP-OWNER`  | 店主代表     | データや記録に頼っている   | システム利用へ切り替わる             | 優先機能ごとに確認・承認を行い、操作方法を簡易手順書で共有する | `PO`   | イテレーション末   | Issue, Pull Request |"``\]: `` `STH-SHOP-OWNER` の目標「システム利用へ切り替わる」は、どの記録をどの時点までに切り替えれば達成かを判定できないため、販売・在庫・つけの記録をシステムで行う状態と判定時点を明記する必要がある。 ``
- F014 \[major/vp-qe-omissions-consistency; line=7; anchor=`"## 1. 関係者一覧"`\]: `上位概要でつけ情報を管理される常連顧客である子どもや近所の大人が影響受容者として欠落しており、当該集団の期待、懸念、必要な合意、情報要求を管理できないため、関係者一覧と後続各章へ追加する必要がある。`
- F015 \[major/vp-qe-omissions-consistency; line=32; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | ソフト使用経験なし         | システムで店番を行える               | リリース後に試利用させる                                       | `PO`   | リリース準備完了後 | Issue               |"``\]: `` `STH-FAMILY-USER` の対応方針は「リリース後に試利用させる」だが、同じ ID の備考は「リリース時点」、コミュニケーション要件は「リリース前の試利用」としており、受入確認をいつ実施するか一意に判断できないため、時点を統一する必要がある。 ``
- F016 \[major/vp-qe-omissions-consistency; line=43; anchor=`"## 5. 見直し条件"`\]: `rulebook と template が見直し対象とする体制、公開・利用方針、主要な利用者影響の変更トリガーがなく、該当変更時に登録簿を更新する責務と証跡が欠落しているため、見直し条件に追加する必要がある。`
- F017 \[minor/vp-qe-omissions-consistency; line=47; anchor=``"| プロジェクトの目的やスコープを変更した   | 関係者の追加・削除と合意対象の見直し             | `PO`   | -      | Issue, Pull Request |"``\]: ``目的・スコープ変更時の見直しの承認者が「-」で、見直し条件に承認者を記載するという rulebook の要件を満たさないため、`PO` など承認する役割を明記する必要がある。``
- F018 \[minor/vp-qe-omissions-consistency; line=29; anchor=``"| `STH-SHOP-OWNER`  | 店主代表     | データや記録に頼っている   | システム利用へ切り替わる             | 優先機能ごとに確認・承認を行い、操作方法を簡易手順書で共有する | `PO`   | イテレーション末   | Issue, Pull Request |"``\]: `店主代表の現状「データや記録に頼っている」は、上位概要の「ノートと記憶に頼っている」と食い違い、システム化前の状態を誤認させるため、概要と同じ現状表現に揃える必要がある。`
- F019 \[minor/vp-qe-kata-conformance; line=5; anchor=`"単一店舗・小規模開発のため、責任を負う個人または組織だけを記載し、「人物名」や連絡先は扱わない。"`\]: `対象を「責任を負う個人または組織だけ」と限定する説明は、rulebook が対象とする影響受容者・集団および本書自身の家族利用者と矛盾するため、関与または影響を受ける役割・組織・集団を対象とする説明へ修正する必要がある。`
- F020 \[major/vp-qe-kata-conformance; line=7; anchor=`"## 1. 関係者一覧"`\]: `rulebook が成果から影響を受ける集団の登録を要求しているのに、上位概要でつけ情報を管理される常連顧客である子どもや近所の大人がなく、sample が影響受容者を洗い出す完成例として機能しないため追加する必要がある。`
- F021 \[major/vp-qe-kata-conformance; line=43; anchor=`"## 5. 見直し条件"`\]: `rulebook と template が要求する体制、公開・利用方針、主要な利用者影響の変更に対する見直し条件が欠落しており、必須要件を満たす完成例になっていないため追加する必要がある。`
- F022 \[minor/vp-qe-kata-conformance; line=47; anchor=``"| プロジェクトの目的やスコープを変更した   | 関係者の追加・削除と合意対象の見直し             | `PO`   | -      | Issue, Pull Request |"``\]: `recipe が承認者を空欄や「-」にしないよう求めているのに sample の承認者が「-」になっており、recipe と矛盾する例を示しているため、承認する役割名を記載する必要がある。`
- F023 \[minor/vp-qe-kata-conformance; line=31; anchor=``"| `STH-TECH-MENTOR` | 技術メンター | メンター参加レベルの支援中 | スコープに影響しない範囲で助言を行う | 週次相談を行い、判断と責務を開発担当に委譲する                 | `DEV`  | 週次               | チャット, Issue     |"``\]: `recipe は期限を「週次」のような会議頻度ではなく判断の節目で書くよう求めているのに、sample の期限が「週次」「イテレーション末」「タスク単位」になっており、recipe と矛盾する例になっているため判断の節目へ書き換える必要がある。`
- F024 \[minor/vp-ux-readability; line=5; anchor=`"単一店舗・小規模開発のため、責任を負う個人または組織だけを記載し、「人物名」や連絡先は扱わない。"`\]: `「責任を負う個人または組織だけ」という対象説明と、影響受容者である家族利用者を掲載する本文が一致せず、登録対象の識別基準を誤読させるため、影響を受ける集団も含む説明に修正する必要がある。`
- F025 \[major/vp-ux-readability; line=32; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | ソフト使用経験なし         | システムで店番を行える               | リリース後に試利用させる                                       | `PO`   | リリース準備完了後 | Issue               |"``\]: `家族利用者の操作性確認が「リリース時点」「リリース後」「リリース前」と章ごとに異なり、読者が試利用を受入確認としていつ実施すべきか判断できないため、初期リリース前の一つの時点へ統一する必要がある。`
- F026 \[minor/vp-ux-readability; line=23; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | High   | Medium | 習熟なしでも既存手順に近い操作ができる   | システムに慣れることができなくなる               | UI の操作性検証結果と手順書            | 導入後の継続利用を左右する                 |"``\]: `家族利用者の懸念「システムに慣れることができなくなる」は意味が取りにくく、どの困りごとを防ぐのか読み取れないため、「操作に迷って店番中に記録できない」など具体的な困りごとに書き換える必要がある。`
- F027 \[minor/vp-ux-language-consistency; line=48; anchor=``"| 新しい利害団体や利用者群体が登場した場合 | 新しいステークホルダーを登録し関与方針を整備する | `BA`   | `PO`   | Issue               |"``\]: ``見直し条件の責任者に、関係者一覧で定義されていない Role code `BA` が指定されているため、定義済みの Role code に統一する必要がある。``
- F028 \[minor/vp-ux-language-consistency; line=48; anchor=``"| 新しい利害団体や利用者群体が登場した場合 | 新しいステークホルダーを登録し関与方針を整備する | `BA`   | `PO`   | Issue               |"``\]: `「利害団体」「利用者群体」は、他章と rulebook で用いる「関係者」「利用者」「影響受容者」「集団」と一致しない未定義語で更新対象を誤読させるため、定義済みの用語に統一する必要がある。`
- F029 \[minor/vp-ux-language-consistency; line=39; anchor=``"| `STH-DEVELOPER`   | 開発担当     | 機能定義とテスト完了確認         | チャット, Pull Request | デザイン方針と実装結果を共有       | Pull Request          | イテレーション末               |"``\]: `開発担当の合意・報告の必要性で「デザイン方針」と書いているが、他の行では「設計方針」「設計」を使っており同じ対象か判別しにくいため、「設計方針」に統一する必要がある。`
- F030 \[minor/vp-ux-language-consistency; line=13; anchor=``"| `STH-TECH-MENTOR` | 技術メンター | 外部協力者              | きぬや（外部） | -              | 設計方針の助言を行う                             | 週次相談                     |"``\]: `外部協力者である技術メンターの所属を「きぬや（外部）」と書くと、店舗内部か外部かが矛盾して読めるため、「外部」など所属を一意に示すラベルにする必要がある。`
- F031 \[minor/vp-ops-release-readiness; line=41; anchor=``"| `STH-FAMILY-USER` | 家族利用者   | システム操作方法と変更による影響 | 簡易手順書, Issue      | リリース前の試利用に参加           | Issue, フィードバック | リリース準備                   |"``\]: ``家族利用者の試利用結果がリリース判断の前提条件かどうか示されず、リリース前に何を確認して承認するか読み取れないため、試利用結果を `PO` のリリース承認の前提として明記する必要がある。``
- F032 \[minor/vp-ops-operability; line=43; anchor=`"## 5. 見直し条件"`\]: `定期見直しを行うかどうかが示されず、周期が未定なら _TODO_ で決める時期を残すという recipe の指示も反映されていないため、継続運用での見直し時期を明記するか _TODO_ を付ける必要がある。`

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
