---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-mtp-sample-050-20261123t134207z-b9881329
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-mtp-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Plan: T-KATA-WAVE-5-mtp-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 移行テスト計画の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、移行テスト計画の完成例を示す
- `path`: `docs/ja/specdojo/samples/mtp-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-mtp-sample-050/T-KATA-WAVE-5-mtp-sample-050-20261123T134207Z-b9881329/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/mtp-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、移行リハーサルの実施計画を定義し、切替前に妥当性を検証するための最小サンプルである。"`\]: `目的が汎用の定義文にとどまり、駄菓子屋きぬやで何を移行し、何を事前に検証するのか（例: 紙のつけ残高・在庫記録の移行で残高不一致や欠品を起こさないこと）を示していないため、上位の目的から必要性を説明できない。`
- F002 \[minor/vp-po-purpose-alignment; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: ``前提の「handbook の共通方針」は参照先の id が書かれておらず、根拠をたどれないので、`based_on` や wikilink で上位文書（移行計画 `mip-index` など）を特定するべきである。``
- F003 \[major/vp-po-decision-readiness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `GO/NO-GO判断プロセス（判断主体、集約する証跡、GO／条件付きGO／NO-GO の判断）が記述されておらず、PO が移行可否を判断する手順の例になっていない。`
- F004 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項が「要件詳細の補強」という抽象的な論点だけで、何が未決か、移行判断と日程への影響、決める人と期限が書かれておらず、判断材料にならない。`
- F005 \[minor/vp-po-publication-accountability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `必須観点に「責任者」を挙げているのに、合否判定と GO/NO-GO の最終判断を人間の PO（店主）が担うことが示されていないため、判定者を書いた例を加えるべきである。`
- F006 \[major/vp-pm-plan-feasibility; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `リハーサル回数とスケジュールの表（回数・予定日・目的・完了条件）がなく、rulebook の禁止事項「リハーサル回数/日程を曖昧に書く」に当たり、タスク化や進捗確認に使えない。`
- F007 \[major/vp-pm-dependency-risk; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``上位の `mip-index`（成功条件・停止許容時間）や `dmd-*`（許容差）への依存と、リハーサル失敗時の日程影響が識別されておらず、後続の切替計画に与えるリスクを追えない。``
- F008 \[major/vp-pm-control-reporting; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `結果報告フォーマットと報告先がなく、rulebook の禁止事項「結果報告フォーマットを省略する」に当たり、課題や決定記録へ書き写す項目を分けられない。`
- F009 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `対象を「駄菓子屋の販売管理システム」と名前で挙げるだけで、移行で守るべき業務（つけ残高、在庫数、販売記録の連続性）と、移行に失敗したときの影響が書かれておらず、リハーサルで何を守るのかがわからない。`
- F010 \[major/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: テスト範囲、シナリオ、環境、判定基準、是正計画"`\]: `テスト範囲・シナリオ・判定基準を項目名として並べるだけで、件数照合・差分検知・業務シナリオ（例: 販売→つけ記録→残高確認）の具体的な観点と期待値を書いていない。`
- F011 \[major/vp-ba-requirements-completeness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `対象範囲と対象外（移行する記録の種類、移行しない過去データなど）が書かれておらず、リハーサルの範囲を利用者が確認できない。`
- F012 \[major/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `必須観点に「責任者」を挙げながら、判定者・データ準備担当・報告先（店主、家族利用者代表など共通サンプル文脈の登場人物）を割り当てた例がなく、関係者と合意する対象がわからない。`
- F013 \[major/vp-arc-technical-constraints; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `テスト環境とデータ準備（検証環境、データセットID、初期化・後始末、店内タブレット1台などの端末前提）が書かれておらず、リハーサルの技術的な前提を読み取れない。`
- F014 \[minor/vp-arc-conciseness; line=22; anchor=`"| ドキュメント | 移行テスト計画（リハーサル計画）                           | 最小サンプル                         |"`\]: `「最小記述例」の表の「目的」と「主な内容」の行は、5行目と15行目の文をそのまま繰り返しており、削るかまとめても情報を失わないため、表は実際に記入した例に置き換えるべきである。`
- F015 \[minor/vp-arc-single-responsibility; line=7; anchor=`"## 2. 入力情報"`\]: `「入力情報」と「記述内容」の章は作成手順や観点の説明で、移行テスト計画の完成例という sample の責務に直接寄与していないため、rulebook の本文構成どおりの記入済みの章に置き換えるべきである。`
- F016 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: `「最小記述例」が項目名と定義文の3行だけで、写して MTP を作るのに必要な入力（日程、環境、データセット、検証観点、合否基準）の記入例がない。`
- F017 \[minor/vp-dev-implementation-readiness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``Frontmatter に rulebook が推奨する `based_on`（例: `mip-index`）がなく、上位の判断を使っていることを示す例になっていない。``
- F018 \[minor/vp-dev-change-impact; line=11; anchor=``"- 参照: `../rulebooks/mtp-rulebook.md`"``\]: ``参照先が rulebook への相対パスだけで、関連する `mip-index`・`dmd-*`・`cop-*` への参照がなく、上位文書を変更したときに追従すべき箇所を識別できない。``
- F019 \[minor/vp-dev-testability; line=15; anchor=`"- 主な内容: テスト範囲、シナリオ、環境、判定基準、是正計画"`\]: `移行後に確認する検証方法と期待値（方法／期待値の表）の例がなく、リハーサル後に何を実行して合否を確かめるかが読み取れない。`
- F020 \[major/vp-qe-verifiability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `サンプルの例示として、判定基準を具体的にどう記述すべきか（Pass/Failが客観的に判定可能な表現）が示されておらず、検証可能性の例として不十分である。`
- F021 \[major/vp-qe-verifiability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `合否基準の表（項目・基準・判定者）がなく、停止許容・差分許容・重大障害の最低限の基準を欠いているため、GO/NO-GO を判定できない。`
- F022 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ルールブックで定義されている必須構成（## 1.概要 〜 ## 9.関連ドキュメント）がすべて欠落しており、ルールを無視した独自の構成となっている。`
- F023 \[major/vp-qe-omissions-consistency; line=26; anchor=`"## 5. 未解決事項"`\]: `「差異発生時の扱い（許容/修正/再実行）」と「関連ドキュメント」の章がなく、rulebook の禁止事項2項目に当たっている。`
- F024 \[blocker/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `本文構成がルールブックで指定された順序固定の必須見出しに従っておらず、具体例としての責務を果たしていない。`
- F025 \[major/vp-qe-kata-conformance; line=18; anchor=`"## 4. 最小記述例"`\]: `rulebook の「サンプル（最小・整合版）」は9章そろった完成例を示しているのに、対応する sample はそれと違う独自構成の要約表で、rulebook と sample の対応が矛盾している。`
- F026 \[minor/vp-qe-kata-conformance; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `共通サンプル文脈（駄菓子屋きぬや、店主、家族利用者、店頭販売・在庫・つけ）が対象名として出るだけで、内容の具体例に反映されていない。`
- F027 \[major/vp-ux-readability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ルールブックと全く異なる構成で記述されているため、初見の読者が正しい MTP の書き方を理解できず、誤った形式を模倣させるリスクがある。`
- F028 \[minor/vp-ux-language-consistency; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「判定基準」と rulebook の見出し「合否基準」で用語が揺れているため、rulebook の用語「合否基準」に統一するべきである。`
- F029 \[major/vp-ops-release-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項が「実案件適用時に具体化する」と先送りするだけで、sample を ready にするために解消すべき欠落（必須9章の記入）が識別されておらず、公開判断の前提にならない。`
- F030 \[major/vp-ops-operability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `差異発生時の扱い（許容差内は記録、許容差超は修正して再実行、再実行の上限と判断者）がなく、再実行の判断がぶれる運用上のリスクを残している。`

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
