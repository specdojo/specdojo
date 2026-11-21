---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-itc-sample-040-20261121t135610z-889d2bbb
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-itc-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: rulebook-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-rulebook
---

# Edit Plan: T-KATA-WAVE-3-itc-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample はこの段で変更せず、後続の sample-maintenance で厚くする。recipe・template は作らず、frontmatter の宣言も変えない（template は PJR-WYTX で扱う）。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 内部結合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:itc-index-sample]]
- `overview`: 駄菓子屋の販売管理システムの 1 対象を題材に、内部結合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/itc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-itc-sample-040/T-KATA-WAVE-3-itc-sample-040-20261121T135610Z-889d2bbb/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/itc-rulebook.md`
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

- F001 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 内部結合テストカタログ 対象別 作成ルール"`\]: ``Frontmatter の `recipe` と `template` が `undecided` のままだが、未決の理由、判断者、判断時期、登録簿への引き継ぎ先が書かれていない。ready 化の判断材料として本文か登録簿で明示すること。``
- F002 \[minor/vp-ba-requirements-completeness; line=144; anchor=``"- 必須カラムは `itc-index` の定義に従う"``\]: ``ケース表の必須カラムを `itc-index` に委ねながら、サンプルでは10列（`case_id`・条件・手順・期待値・観測点・境界/依存・トレース・優先度・自動化・証跡）を使っており、必須と任意の区別が読み取れない。`itc-index` の該当箇所の参照を示すか、サンプルのカラムとの対応を明記すること。``
- F003 \[minor/vp-arc-conciseness; line=135; anchor=``"- 観点名（見出し）は改善のため変更してよいが、`perspective_key` は原則変更しない（変更が必要なら `supersedes` 等で追跡する）"``\]: `` `perspective_key` と `case_id` を変更しない規則が、記述ガイド（本文135行目・145〜148行目）と禁止事項（本文166〜167行目）で重複している。記述ガイド側は形式の定義に絞り、不変性は禁止事項に一本化すると簡潔になる。 ``
- F004 \[minor/vp-dev-change-impact; line=135; anchor=``"- 観点名（見出し）は改善のため変更してよいが、`perspective_key` は原則変更しない（変更が必要なら `supersedes` 等で追跡する）"``\]: `` `perspective_key` を変更する場合の追跡手段として「`supersedes` 等」を挙げているが、`supersedes` は文書単位のメタ情報であり、観点キー単位の置き換えや旧 `case_id` との対応をどこにどう記録するかが定まっていない。記録先と書式を具体化すること。 ``
- F005 \[minor/vp-dev-testability; line=12; anchor=``"- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。文書の整形・lint はリポジトリの検証で扱い、業務の検証に含めない。"``\]: ``文書の整形・lint は「リポジトリの検証で扱う」と委ねるだけで、作成後に確認すべき検証コマンド（例: `npm run lint:md`、Frontmatter・schema の検証）や委譲先の文書が示されておらず、作成者が確認手順を特定できない。``
- F006 \[minor/vp-qe-verifiability; line=145; anchor=``"- `case_id` は以下を推奨し、変更しない"``\]: `` `case_id` の形式を「推奨」としながら禁止事項では変更・再利用を禁じており、形式に従わない `case_id` を不適合とするか判定できない。必須の形式と任意の慣行（10刻みなど）を分けて記述すること。 ``
- F007 \[major/vp-qe-omissions-consistency; line=137; anchor=`"##### 6.6.1.1. 意図"`\]: ``本文137行目・141行目で H5 見出し（`##### 6.6.1.1. 意図`・`##### 6.6.1.2. 条件・ケース表`）を使っており、H5 以下を禁じる Markdown 記述ルールに違反している。階層を H4 以内に収めるか、構成を表や箇条書きに置き換えること。``
- F008 \[minor/vp-qe-omissions-consistency; line=131; anchor=`"#### 6.6.1. 観点:<観点>"`\]: ```見出し `#### 6.6.1. 観点:＜観点＞` の山括弧付きプレースホルダがインラインコードで囲まれておらず、HTML タグと誤認される禁止記法に当たる。`` 観点:`＜観点＞` `` のように囲むこと。```
- F009 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 内部結合テストカタログ 対象別 作成ルール"`\]: ``参照サンプル `specdojo:itc-sample` が本ルールブックで定義した構成（第5節）に従っておらず、実例として不適切である。``
- F010 \[minor/vp-qe-kata-conformance; line=173; anchor=`"トレースとケースの対応を示す部分例です。成果物全体では「本文構成（標準テンプレ）」の必須6章を揃えます。仕様ID・証跡は例示です。"`\]: ``「サンプル（最小）」章に受注（order）の例を埋め込んでおり、Frontmatter の `sample: specdojo:itc-sample` および共通サンプル文脈（駄菓子屋）と食い違っている。sample 文書を正とし、本文の例は sample と同じ文脈に揃えるか、sample への委譲に置き換えること。``
- F011 \[minor/vp-ux-language-consistency; line=133; anchor=``"- 観点は `itc-index` の「観点の立て方（共通）」に従って命名する"``\]: `記述ガイドの前半の箇条書きは「。」で結ぶのに対し、「トレース」「テスト観点とケース」配下（本文125行目・133〜156行目）は句点がなく、文体がそろっていない。表記を統一すること。`
- F012 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 内部結合テストカタログ 対象別 作成ルール"`\]: ``ready 化の前提となる未解決事項（`recipe`・`template` が `undecided`、sample の構成不一致）が本文にも登録簿の参照にも示されておらず、公開判断の材料が不足している。``

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
