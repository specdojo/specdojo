---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-etc-sample-050-20261121t140826z-dacbbd11
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-etc-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Plan: T-KATA-WAVE-3-etc-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部結合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:etc-index-sample]]
- `overview`: 駄菓子屋の販売管理システムと 1 つの外部サービスの連携を題材に、外部結合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/etc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-etc-sample-050/T-KATA-WAVE-3-etc-sample-050-20261121T140826Z-dacbbd11/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/etc-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、外部結合テスト仕様を連携単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `ドキュメントがプロジェクトの目標や上流の仕様と一致しておらず、外部結合テストの具体的なスコープ、目的、および根拠が不足しています。`
- F002 \[major/vp-po-purpose-alignment; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: ``対象が「駄菓子屋の販売管理システム」の全体に留まっている。プロジェクト概要の前提条件（EC・仕入れ先・会計連携は対象外）と矛盾しない具体的な外部境界（`＜term＞`）を選び、その理由を示す必要がある。``
- F003 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決の課題について、POのレビューに必要な明確な決定基準、意思決定者、影響、および具体的な次のアクションが不足しています。`
- F004 \[minor/vp-po-publication-accountability; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `公開の責任および人的承認の責任が明示的に定義されていません。`
- F005 \[major/vp-pm-plan-feasibility; line=5; anchor=`"本書は、外部結合テスト仕様を連携単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `タスクの計画と追跡に必要なワークユニット、依存関係、ロールの割り当て、および完了条件が不足しています。`
- F006 \[major/vp-pm-plan-feasibility; line=18; anchor=`"## 4. 最小記述例"`\]: ``「最小記述例」に、`case_id`・優先度・自動化区分を持つ条件・ケース表がない。テスト実装をタスク化し、進捗を管理する単位を示せていない。``
- F007 \[major/vp-pm-dependency-risk; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `Dependencies on upstream test plans (such as tsp-index and etc-index) and external systems, as well as associated risks, are not identified.`
- F008 \[major/vp-pm-dependency-risk; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: ``Frontmatter に、rulebook が最低限として求める `based_on: [tsp-index, etc-index]` がない。上流のテスト戦略・全体構成への依存を機械的にたどれない。``
- F009 \[minor/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `進捗および課題の追跡に関する報告先、取り扱いポリシー、および責任ロールコードが定義されていません。`
- F010 \[major/vp-ba-business-value; line=5; anchor=`"本書は、外部結合テスト仕様を連携単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `菓子販売管理システムにおける外部結合テストのビジネス上の問題、対象となるステークホルダー、または期待される価値について記述されていません。`
- F011 \[major/vp-ba-requirements-completeness; line=5; anchor=`"本書は、外部結合テスト仕様を連携単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `スコープ、スコープ外の境界、および受け入れ条件が、ユーザーの視点から検証可能なレベルで定義されていません。`
- F012 \[major/vp-ba-requirements-completeness; line=13; anchor=`"## 3. 記述内容"`\]: `rulebook が必須とする「責務」（動詞で始まる 3〜7 個）と「対象外」（理由・代替レベル付き）が欠落しており、検証範囲と除外範囲を確認できない。`
- F013 \[major/vp-ba-stakeholder-clarity; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `関連するステークホルダー、運用ユーザー、レビュアー、および合意の対象が特定されていません。`
- F014 \[major/vp-arc-technical-constraints; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `技術的制約、外部依存関係、プロトコル、およびサンドボックス/環境構成が完全に省略されています。`
- F015 \[major/vp-arc-technical-constraints; line=15; anchor=`"- 主な内容: I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID"`\]: `「前提（接続先・認証・テストデータ）」という項目名を挙げるだけで、境界/依存/環境章として sandbox・スタブの扱い、秘密情報のマスキング、テストデータの namespace と後始末の具体例を示していない。`
- F016 \[minor/vp-arc-conciseness; line=24; anchor=`"| 主な内容     | I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID | 要点のみ記載                         |"`\]: `セクション4の表において、具体的な値や追加のコンテキストを提供することなく、セクション3のテキストがそのまま重複して記載されています。`
- F017 \[major/vp-arc-single-responsibility; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `「完成例（sample）」としての責務ではなく「記述ガイド」として振る舞っており、成果物の正本としての形式をなしていない。`
- F018 \[major/vp-dev-implementation-readiness; line=15; anchor=`"- 主な内容: I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID"`\]: `テスト実施に必要な具体的な入力、スキーマ定義、エンドポイント、および完了条件が不足しています。`
- F019 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: ``rulebook が正本と定めるトレース表（`trace_key`・仕様ID・要点）がない。ケースから根拠仕様をたどれず、実装時の判断根拠を示せていない。``
- F020 \[major/vp-dev-change-impact; line=15; anchor=`"- 主な内容: I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID"`\]: `外部インターフェース、依存するスキーマ、および関連するアーティファクトに対する変更の影響が特定されていません。`
- F021 \[major/vp-dev-testability; line=15; anchor=`"- 主な内容: I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID"`\]: `テスト実行コマンド、CI検証手順、アサーション、およびエラーハンドリングの手順が不足しています。`
- F022 \[major/vp-dev-testability; line=20; anchor=`"| 項目         | 値                                                                                                               | 備考                                 |"`\]: `最小記述例の表に、観測点（アサーション）と証跡（テストコードパス・CI run・reqId 等）の列がない。テスト結果を証跡へ接続する形を示していない。`
- F023 \[major/vp-qe-verifiability; line=24; anchor=`"| 主な内容     | I/Fごとのテスト条件一覧（入力/期待/エラー）、前提（接続先・認証・テストデータ）、合格基準、関連する外部I/F仕様ID | 要点のみ記載                         |"`\]: `具体的な値ではなく「要点のみ記載」という記述上の指示になっており、完成例としての役割を果たしていない。`
- F024 \[major/vp-qe-verifiability; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項の「実案件適用時に具体化する」は完了条件を持たない。何をもって解消とするかを判定できない。`
- F025 \[blocker/vp-qe-omissions-consistency; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `rulebook で定義された必須の章構成（1〜6章）を完全に無視し、独自の章構成となっている。`
- F026 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: ``H1 が rulebook の「外部結合テストカタログ: `＜対象名＞`」形式ではなく、rulebook への相対 Markdown リンクを含む「外部結合テスト対象別 サンプル」になっており、文書名の規約と矛盾している。``
- F027 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `ETC の完成例ではなく「記述のためのサンプル（ガイド）」となっており, rulebook で定義された成果物形式に準拠していない。`
- F028 \[major/vp-qe-kata-conformance; line=11; anchor=``"- 参照: `../rulebooks/etc-rulebook.md`"``\]: `rulebook への参照はあるが、必須とされる etc-index や tsp-index への参照が不足している。`
- F029 \[major/vp-ux-readability; line=5; anchor=`"本書は、外部結合テスト仕様を連携単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `具現化された例ではなく「〜するための最小サンプルである」という説明に留まっており、参照先としての価値を欠いている。`
- F030 \[minor/vp-ux-language-consistency; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `rulebook に定義のない「責任者」を必須観点として列挙している。`
- F031 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `成果物名が「外部結合テスト対象別」となっており、rulebook の名称「外部結合テストカタログ」と表記が揺れている。`
- F032 \[major/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `下書き（draft）から準備完了（ready）ステータスへ移行するための前提条件と基準が指定されていません。`
- F033 \[major/vp-ops-operability; line=1; anchor=`"# [外部結合テスト対象別](../rulebooks/etc-rulebook.md) サンプル"`\]: `継続的なメンテナンス、変更管理、およびエスカレーションパスに必要な情報が提供されていません。`
- F034 \[major/vp-ops-operability; line=26; anchor=`"## 5. 未解決事項"`\]: `実行運用メモ（テストデータの作成と削除、失敗時のリトライ、外部側の後始末、レート制限などの実行制約）の例がない。外部結合テストを継続して運用するための情報を示せていない。`

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
