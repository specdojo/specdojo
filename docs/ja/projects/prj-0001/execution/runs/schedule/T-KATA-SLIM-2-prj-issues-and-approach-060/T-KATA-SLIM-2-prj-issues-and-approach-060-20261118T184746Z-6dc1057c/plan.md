---
specdojo:
  id: prj-0001:xep-t-kata-slim-2-prj-issues-and-approach-060-20261118t184746z-6dc1057c
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-2-prj-issues-and-approach-060
  name: "recipe から運用の記述と言い直しを外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-issues-and-approach
    - specdojo:prj-issues-and-approach-recipe
---

# Edit Plan: T-KATA-SLIM-2-prj-issues-and-approach-060

## 1. このフェーズで行うこと

直した rulebook に沿い、対応する recipe から文書の運用の記述と、rulebook と同じ判断の言い直しを外す。 手本は prj-charter の recipe の試行（[[prj-0001:pjr-7m9j-recipe-slim-pilot-prj-charter|PJR-7M9J]] の対応結果の「他の recipe へ広げるときの一覧」）と、改訂済みの [[specdojo:prj-charter-recipe|prj-charter-recipe]] である。 外す記述: どの成果物にも共通する文書の運用（役割の表と段落、status の昇格と承認、公開の承認条件、改訂と廃止の手順、文書品質の検査を手順や仕上げチェックの合格条件に入れること）、 未決事項の管理台帳の列（区分・担当・期限・判断時期・対応方針・追跡先）と台帳へ登録する旨の段落、 rulebook と同じ判断の言い直し（表の列の指定、必須の観点の列挙、委譲先の文書の指定、承認記録の書き方、禁止事項の言い換え）、 仕上げチェックの構造の検査（章立て・必須の列がそろっている など）、recipe 内の同じ確認の繰り返し（レビュー観点・良い例と悪い例・仕上げチェックで同じ点を確かめる、深掘り手順が全体の作成手順をなぞる）、章立てをなぞる文。 残す記述: 章を書く順番とその理由、入力の集め方（何をどこから取り出すか、誰に何を聞くか）、書き手が答える問い（各節 2 つ程度）とつまずきやすい点・聞き方のコツ、 対応のない主張を探す深掘りの順序、判断の差が具体的に分かる良い例と悪い例（ほかの章と同じ確認は 1 か所にまとめる）、型固有の対応関係を 1 項目で示す「このレシピの使い方」。 参照の形: recipe 本文に rulebook・sample への参照（wikilink、照合指示、章タイトルでの参照）を書かない（Recipe 記述標準）。判断の基準は言い直さずに外し、成果物の章名で示す。共通の運用の参照文も書かない。 上位成果物を正とする内容は「写さず参照に置き換える」とコツに書く。Recipe 記述標準の章の構成は保つ。 大きさは、空白を除いた文字数で今の 7 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 この段で直すのは recipe だけとする。rulebook・sample・template は commit の対象外のため変えず、合わせて直すべき点があれば変更案として result に書く。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクト課題と解決アプローチ
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-assumptions-constraints-dependencies]]
- `overview`: 主要課題の特定と解決アプローチを定義
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-issues-and-approach.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-2-prj-issues-and-approach-060/T-KATA-SLIM-2-prj-issues-and-approach-060-20261118T184746Z-6dc1057c/result.md`

編集対象（rulebook frontmatter の recipe 宣言から解決）:

- `kind`: recipe
- `path`: `docs/ja/specdojo/recipes/prj-issues-and-approach-recipe.md`
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

参照の向きを「成果物 → recipe」に切り替え、対象成果物に紐づく recipe を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=143; anchor=`"- 見直したとき、何を確認し、どう対応するか。"`\]: `「次の検討事項」の表が ToDo・目的・責任ロールだけで判断時期と未解消時の影響を記録できないため、PO が承認・保留・差し戻しを判断できるよう「判断時期」と「影響」の項目を追加する。`
- F002 \[minor/vp-po-publication-accountability; line=205; anchor=`""`\]: `仕上げチェックに公開対象、個人情報・非公開情報の有無、人間の PO による公開可否判断の確認がないため、公開適性と説明責任を確認する項目を追加する。`
- F003 \[minor/vp-pm-plan-feasibility; line=143; anchor=`"- 見直したとき、何を確認し、どう対応するか。"`\]: `ToDo 表に完了条件または判断タイミングがなく、作業の順序付け・進捗確認に使う終点を判定できないため、「完了条件」と「判断時期」を記録できるようにする。`
- F004 \[minor/vp-pm-control-reporting; line=131; anchor=`""`\]: `トレードオフとリスクを「課題ログやリスク登録簿」へ転記するとだけ記載しており、課題・リスク・変更要求・決定のどれとして記録するか判定できないため、事象区分ごとの記録先を示す。`
- F005 \[minor/vp-qe-verifiability; line=200; anchor=`""`\]: `「必須表」が本文中で定義されておらず, 対応 rulebook の表も推奨扱いであるため, 仕上げ時にどの表の有無を pass / fail 判定するのか列挙するか, 「必須章・必須項目」に改める。`
- F006 \[minor/vp-qe-omissions-consistency; line=205; anchor=`""`\]: `「仕上げチェック」に Recipe 記述標準が求める公開適性の最終確認がなく, 業務課題・リスク・根拠に非公開情報を含めてよいか判定できないため, 機密情報や公開可否を確認する項目を追加する。`
- F007 \[minor/vp-qe-kata-conformance; line=103; anchor=`"- 採用しない案は、なぜ採用しないか。"`\]: ``存在する関連成果物「代替案比較」をリンクまたは仮置き識別子で示しておらず Recipe 記述標準のリンク規約を満たさないため, 参照先リンクまたは `prj-comparison-of-alternatives` を明示する。``
- F008 \[minor/vp-qe-kata-conformance; line=144; anchor=`"- 見直し結果は、どこに記録するか。"`\]: `_TODO_ と _UNDECIDED_ を同列の選択肢にし, 意思決定未了の「GitHub を採用するか決定する」を _TODO_ の例にしているため, 「要確認・追記は _TODO_, 意思決定未了は _UNDECIDED_」という共通定義に合わせて用途と例を分ける。`
- F009 \[minor/vp-qe-kata-conformance; line=200; anchor=`""`\]: `仕上げチェックは「必須表」が揃うことを要求しているが, rulebook の各表は推奨扱いで recipe 内にも必須表の定義がないため, 表の必須性を rulebook と統一する。`
- F010 \[minor/vp-qe-kata-conformance; line=21; anchor=`"| 背景と必要性   | なぜ取り組むか、放置すると何が悪化するか                       |"`\]: `rulebook では「トレードオフ/リスク」「次の検討事項」「見直しと変更管理」が任意章だが、recipe は常に配置する手順としているため、必要な場合だけ作成し不要なら省略できることを明示する。`
- F011 \[minor/vp-qe-kata-conformance; line=205; anchor=`""`\]: `Recipe 記述標準が「仕上げチェック」に求める公開適性の最終確認がないため, 対象成果物に機密情報・個人情報など公開不適切な内容が含まれないことを確認する項目を追加する。`
- F012 \[minor/vp-ux-language-consistency; line=144; anchor=`"- 見直し結果は、どこに記録するか。"`\]: `意思決定待ちにも _TODO_ を使用できる説明は _UNDECIDED_ との意味境界を曖昧にするため, 要確認・追記と意思決定未了を区別し, それぞれ対応するラベルを一意に示す。`
- F013 \[minor/vp-ops-release-readiness; line=205; anchor=`""`\]: `仕上げチェックに公開適性と人間の PO による最終承認の確認がなく、ready 化・公開判断の完了条件を判定できないため、公開前確認項目として明示する。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の recipe を読み込み、現状の問い・観点・深掘り手順・レビュー観点を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 recipe の frontmatter から辿れる rulebook、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが良い内容の作成に役立っているかを見直す。
5. 成果物で繰り返し不足する内容や review で繰り返し指摘される箇所があれば、それを引き出す問い・観点を recipe に追加する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した recipe は [[specdojo:recipe-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。rulebook と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な recipe メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 recipe から辿れる rulebook、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で recipe を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の recipe が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って recipe を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
