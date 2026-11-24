---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-trc-requirements-to-tests-sample-040-20261121t191721z-c24a9573
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-trc-requirements-to-tests-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: rulebook-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-rulebook
---

# Edit Plan: T-KATA-WAVE-3-trc-requirements-to-tests-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample はこの段で変更せず、後続の sample-maintenance で厚くする。recipe・template は作らず、frontmatter の宣言も変えない（template は PJR-WYTX で扱う）。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 要求とテストの対応（派生ビュー）の完成例
- `depends_on`:
  - [[specdojo:atc-sample]]
  - [[specdojo:stc-sample]]
- `overview`: 駄菓子屋の業務の受入基準と受入テスト・総合テストを題材に、要求とテストの対応の派生ビューの完成例を示す
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-trc-requirements-to-tests-sample-040/T-KATA-WAVE-3-trc-requirements-to-tests-sample-040-20261121T191721Z-c24a9573/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`
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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-arc-technical-constraints; line=10; anchor=``"- **正本と派生**: 対応の正本はテスト成果物の `relations.verifies` とし、本ビューは派生ビューとして生成します。「目的と適用範囲」と「トレース対象の前提」は生成の条件として書き、「トレースマトリクス」「充足状況サマリ」「ギャップと対応方針」は生成元から導出します。充足状況やギャップを直すときは生成元の成果物を直して再生成し、本ビューへ直接書きません。"``\]: ``正本を `relations.verifies` としながら行を要求項目 ID 単位で並べるが、`atc-rulebook` では `relations.verifies` は `bac-checkout` など文書単位の ID で、項目単位の対応は本文の `TR-xx` が担うため、要求項目 ID ごとの対応テストを導出できず、文書 ID と項目 ID のどちらを行の単位にするか、また項目単位の対応をどの情報源から得るかを定義してください。``
- F002 \[minor/vp-dev-implementation-readiness; line=74; anchor=``"- **良い例**: 「要求の母集団: `bac-sales` の全受入基準。テスト: `relations.verifies` を持つ `atc-*`・`stc-*`。生成: `<生成コマンド>` で 2026-05-01 に生成。」"``\]: ``生成手段の良い例が `＜生成コマンド＞` のプレースホルダで、該当する CLI も存在しないため、手順で生成する場合に最低限記録すべき抽出条件、列ごとの導出手順、照合方法を示してください。``
- F003 \[minor/vp-qe-verifiability; line=58; anchor=``"| `一部充足` | 対応テストはあるが、参照先が未作成・`draft` であるか、ギャップが残る |"``\]: `` `一部充足` の条件「参照先が未作成」は、対応テストが `relations.verifies` を持つテスト自体であるため成立せず判定に使えないので、何が未作成の状態を指すか（例: 検証ケースが未記載）を定義するか条件から削除してください。 ``
- F004 \[minor/vp-qe-verifiability; line=46; anchor=``"| 要求ID       | 母集団の要求 ID。母集団にない参照は `なし` とし、その参照を持つテストを対応テストIDに書く |"``\]: ``要求ID を `なし` とする母集団外参照の行について、充足状況の値と、充足状況サマリの件数（合計を母集団件数と一致させる規則）から除外するかが未定義のため、扱いを明記してください。``
- F005 \[major/vp-qe-omissions-consistency; line=10; anchor=``"- **正本と派生**: 対応の正本はテスト成果物の `relations.verifies` とし、本ビューは派生ビューとして生成します。「目的と適用範囲」と「トレース対象の前提」は生成の条件として書き、「トレースマトリクス」「充足状況サマリ」「ギャップと対応方針」は生成元から導出します。充足状況やギャップを直すときは生成元の成果物を直して再生成し、本ビューへ直接書きません。"``\]: `充足状況とギャップを生成元成果物または検証結果へ記録するとしているが、使用する成果物種別、フィールド、優先順位、競合時の扱いがなく派生不能なため、各出力カラムの生成元と変換規則を定義してください。`
- F006 \[major/vp-qe-kata-conformance; line=29; anchor=``"- `specdojo.based_on` は必須とし、生成元とした要求とテストの文書 ID をすべて記載します。索引だけを挙げて要求側を省きません。"``\]: ``参考 sample の `based_on` は `utc-index` と `itc-index` のみで、本文が参照元とする `req-2026-r1` と `atc-*` を含まず、「生成元となる要求・テスト仕様の ID 配列」という本定義と整合しないため、全直接生成元を列挙する規則と sample を一致させてください。``
- F007 \[major/vp-qe-kata-conformance; line=36; anchor=``"| トレース対象の前提   | 必須     | 要求の母集団（`based_on` の要求文書の全要求 ID）、テストの範囲、生成の手段（コマンドまたは手順）と生成日が分かること        |"``\]: `非手編集の派生ビューであるにもかかわらず、入力解決、状態・ギャップの導出、再生成の実行方法が rulebook・recipe・template のいずれにも定義されず、参考 sample も完成した適用例になっていないため、rulebook 内に適用契約を定義するか対応 recipe/template を宣言してください。`
- F008 \[major/vp-qe-kata-conformance; line=85; anchor=`"- **判断基準**: どの生成元の成果物をどう直せば解消と判定するかが分かること。担当・期限は登録簿で追跡し、本ビューに列を設けません。"`\]: ``参考 sample がギャップ表に担当・期限列を持ち、対応テスト `itc-audit-log-persist` がある `req-r1-004` を `未着手` とし、前提に生成手段・生成日を欠くなど、改訂後の本文要件・充足状況の判定・禁止事項と矛盾するため、sample を本 rulebook の完成例として作り直してください。``
- F009 \[major/vp-ux-readability; line=39; anchor=`"| ギャップと対応方針   | 必須     | ギャップごとに、直す生成元の成果物と解消の判定条件が分かること                                                              |"`\]: `読者には充足状況・ギャップ・対応方針を記載するよう求めながら直接入力を禁止しており、どの元成果物をどの順序で更新してビューを再生成するか分からないため、入力成果物からレビューまでの手順と編集境界を明記してください。`
- F010 \[major/vp-ops-operability; line=10; anchor=``"- **正本と派生**: 対応の正本はテスト成果物の `relations.verifies` とし、本ビューは派生ビューとして生成します。「目的と適用範囲」と「トレース対象の前提」は生成の条件として書き、「トレースマトリクス」「充足状況サマリ」「ギャップと対応方針」は生成元から導出します。充足状況やギャップを直すときは生成元の成果物を直して再生成し、本ビューへ直接書きません。"``\]: `参考 sample の更新規則は充足状況を状態遷移で管理して備考へチケット ID を追記する手編集を前提としており、ビューへ直接入力せず再生成する本規定と矛盾するため、更新主体と手入力可能項目を明示して両文書を一致させてください。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
