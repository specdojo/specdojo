---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-etc-index-sample-040-20261121t115748z-eeecbd83
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-etc-index-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: rulebook-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-rulebook
---

# Edit Plan: T-KATA-WAVE-3-etc-index-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample はこの段で変更せず、後続の sample-maintenance で厚くする。recipe・template は作らず、frontmatter の宣言も変えない（template は PJR-WYTX で扱う）。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部結合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムと外部サービスの連携を題材に、外部結合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/etc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-etc-index-sample-040/T-KATA-WAVE-3-etc-index-sample-040-20261121T115748Z-eeecbd83/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/etc-index-rulebook.md`
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

- F001 \[minor/vp-ba-requirements-completeness; line=91; anchor=``"- 非適用：総合/受入（ST/AT）のルールはそれぞれの `stc-index` / `atc-index` で扱う"``\]: ``6.1節の非適用に結合テスト（`itc-index`）との分界が挙がっておらず、別運用ドメインを外部として扱う定義（6.2節）と合わせても、内部の結合テストとの責務境界を判定しにくいため、`itc-index` で扱う範囲を非適用に追記すべきである。``
- F002 \[minor/vp-dev-implementation-readiness; line=221; anchor=``"- 形式：`<level>-<term>-<perspective_key>-<nnn>`（nnnは3桁推奨）"``\]: `` `case_id` の構成要素 `perspective_key` の作り方（日本語の観点名から英小文字 kebab-case のキーを決める規則や、どこで定義するか）が書かれておらず、作成者ごとにIDの書き方がぶれるため、規則を明記すべきである。 ``
- F003 \[minor/vp-dev-change-impact; line=50; anchor=``"- ファイル名は `etc-010-外部結合テストカタログ-概要.md` 等、プロジェクト内で一意になるように命名します。"``\]: ``3章のファイル名の例 `etc-010-外部結合テストカタログ-概要.md` が、適用先 `dct-test-specs-template.yaml` の `path: etc-index.md` と合っておらず、生成物の配置名を誤る原因になるため、dct の path と揃えるか、両者の関係を明記すべきである。``
- F004 \[minor/vp-qe-omissions-consistency; line=49; anchor=``"- 本ルールの対象ドキュメントの `id` は `etc-index` 固定。対象別は `etc-<term>` とします。"``\]: `` `id` を `etc-index` 固定としているが、生成後の文書 id はプロジェクト修飾付き（`＜project-id＞:etc-index`）で、dct では `etc-index` が `local_id` に当たるため、id と local_id のどちらかを区別して書くべきである（4.1節の `id: etc-index` も同様）。 ``
- F005 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 外部結合テストカタログ概要 作成ルール"`\]: ``指定の sample が mandatory と定義された本文構成（1~8章）を無視し、かつ Frontmatter の type に `project` を指定しており rulebook の定義と矛盾している。``
- F006 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 外部結合テストカタログ概要 作成ルール"`\]: ``Frontmatter の `recipe` と `template` が `undecided` のままで `target_format` も宣言されておらず、kata の組（rulebook・recipe・sample・template）の対応と対象形式が決まっていないため、作成するか、宣言を補うべきである。``
- F007 \[minor/vp-ux-readability; line=6; anchor=`"TSPに基づき、外部結合テストに共通するルールや方針を定義します。"`\]: ``導入文の「TSPに基づき」は略語の説明もなく `tsp-index`（テスト戦略・方針）との対応も書かれていないため、初見の読者が根拠文書を特定できるよう、正式名称と文書 id を示すべきである。``
- F008 \[minor/vp-ux-language-consistency; line=33; anchor=`"TCIndex[\"etc-index<br>テスト仕様-全体構成\"]"`\]: `2章の mermaid 図のラベル「テスト仕様-全体構成」「テスト仕様-対象別」が、H1 と本文で使う「外部結合テストカタログ 概要／対象別」と呼び名が違い、別の成果物と誤読されるおそれがあるため、呼び名を揃えるべきである。`

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
