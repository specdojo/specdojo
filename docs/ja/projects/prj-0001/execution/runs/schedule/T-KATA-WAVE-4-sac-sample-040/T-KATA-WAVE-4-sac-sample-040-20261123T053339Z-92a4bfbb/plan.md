---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-sac-sample-040-20261123t053339z-92a4bfbb
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-sac-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: rulebook-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-rulebook
---

# Edit Plan: T-KATA-WAVE-4-sac-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: システム受入条件仕様の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、システム受入条件の完成例を示す
- `path`: `docs/ja/specdojo/samples/sac-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-sac-sample-040/T-KATA-WAVE-4-sac-sample-040-20261123T053339Z-92a4bfbb/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/sac-rulebook.md`
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

- F001 \[minor/vp-po-decision-readiness; line=49; anchor=`"### 6.2. 受入条件"`\]: `受入条件の合否を誰が判断するか（判定者の Role code、または判定責任の参照先）を書く項目がない。sample が必須観点とする「責任者」と rulebook の構成が合っていないため、判定方法の項目か概要に判定者の扱いを定めるべきである。`
- F002 \[minor/vp-ba-requirements-completeness; line=52; anchor=`"- 非機能は「指標＋基準（閾値）」まで書きます（例: 応答時間（P95）/ 稼働率 / エラー率 / RTO / RPO / 監査ログの保持期間）。"`\]: `指標と閾値の例が非機能に偏っており、導入文が対象に含める機能、障害、移行の受入条件で何を期待結果・観測点とするかの指針がない。BAC との境界も明示されていないため、対象範囲と対象外を区分ごとに示すべきである。`
- F003 \[minor/vp-ba-stakeholder-clarity; line=18; anchor=`"SAC は非機能要件（NFR）や業務受入条件（BAC）を根拠に、システム全体の合格基準を定めます。下位のテスト設計（テスト条件一覧、システムテスト仕様など）は SAC の受入条件を分解して参照するため、ID は安定させます。"`\]: `位置づけの章で、下位のテスト設計が参照すること以外に、SAC を作成・確認・受入判定する関係者（Role code）と利用場面が示されていないため、想定する読み手と合意相手を明記すべきである。`
- F004 \[minor/vp-arc-conciseness; line=86; anchor=`"- 期待結果が曖昧（「性能が良い」） → 指標と基準（数値/単位）に分解する"`\]: `「期待結果が曖昧 → 指標と基準に分解する」は、受入条件のガイドの「指標＋基準（閾値）」と禁止事項の「曖昧表現」をもう一度言っているだけなので、どちらかへまとめても判断情報は失われない。`
- F005 \[minor/vp-arc-conciseness; line=91; anchor=`"## 9. サンプル（簡易）"`\]: ``サンプル（簡易）の章は、Frontmatter の `sample` で宣言した sample の役割と重なっている。完成例は sample 側にまとめ、rulebook 側の埋め込み例は削るか最小限にすべきである。``
- F006 \[minor/vp-dev-implementation-readiness; line=56; anchor=``"- `### シナリオ: <短い条件名>`"``\]: ``シナリオの標準テンプレの見出し（`### シナリオ:`、`#### 前提`、`#### 操作`、`#### 期待結果`、`#### 判定方法`）に番号の付け方がないため、連番を必須とする Markdown 規約に沿った成果物を作成者が組み立てられない。``
- F007 \[minor/vp-dev-testability; line=29; anchor=``"許可キー・必須項目・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] と `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` を正本とします。"``\]: ``Frontmatter の正本として schema を示しているが、SAC ファイルの作成・更新後に実行する検証コマンド（`npm run -s lint:md` や schema 検証など）と、`based_on` の参照先が存在するかの確認方法が示されていない。``
- F008 \[major/vp-qe-omissions-consistency; line=56; anchor=``"- `### シナリオ: <短い条件名>`"``\]: ``シナリオの標準テンプレとサンプル（簡易）が番号のない見出し（`### シナリオ:`、`#### 前提` など）を使っており、`##` 以下に連番を必須とする Markdown 規約と矛盾するため、このとおりに書いた SAC が規約違反になる。``
- F009 \[minor/vp-qe-omissions-consistency; line=23; anchor=``"- 文書 ID: ファイル名と同じ `sac-<term>` とし、成果物カタログの宣言と一致させます。"``\]: ``文書 ID を `sac-＜term＞` としているが、プロジェクト成果物で使う project 修飾 ID（`＜project-id＞:sac-＜term＞`）と形式が揃っておらず、wikilink の解決と成果物カタログの宣言で食い違うおそれがある。``
- F010 \[major/vp-qe-kata-conformance; line=1; anchor=`"# システム受入条件仕様（SAC）作成ルール"`\]: ``参照している `specdojo:sac-sample` が SAC の具体例ではなくサンプルの解説書となっており、定義した構成に従っていない。``
- F011 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# システム受入条件仕様（SAC）作成ルール"`\]: ``Frontmatter の `recipe` と `template` が `undecided` のままで、Kata 内部の rulebook、recipe、sample、template の対応が揃っていないため、作成の要否と予定を確定すべきである。``
- F012 \[minor/vp-qe-kata-conformance; line=91; anchor=`"## 9. サンプル（簡易）"`\]: `rulebook の中のサンプル（簡易）と宣言した sample が別々の完成例になっており、片方だけが rulebook の構成に従っているため、完成例の正本を sample に一本化すべきである。`
- F013 \[minor/vp-ux-readability; line=18; anchor=`"SAC は非機能要件（NFR）や業務受入条件（BAC）を根拠に、システム全体の合格基準を定めます。下位のテスト設計（テスト条件一覧、システムテスト仕様など）は SAC の受入条件を分解して参照するため、ID は安定させます。"`\]: `位置づけの章で、根拠とする NFR・BAC と、下位のテスト条件一覧・システムテスト仕様に、rulebook や成果物リファレンスへの参照がないため、初見の読者が次に見る文書を辿れない。`
- F014 \[minor/vp-ux-language-consistency; line=27; anchor=`"## 4. 推奨 Frontmatter 項目"`\]: ``見出しは「推奨 Frontmatter 項目」なのに `based_on` を「必ず紐づけます」として必須にしており、推奨と必須の区別が読み手に伝わらない。必須項目と推奨項目を分けて示すべきである。``
- F015 \[minor/vp-ops-release-readiness; line=1; anchor=`"# システム受入条件仕様（SAC）作成ルール"`\]: `` `status: draft` で `recipe` と `template` が `undecided`、sample が構成に従っていないのに、ready にする前提となる未解決事項がどこにも示されていないため、公開判断の材料が不足している。 ``

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
