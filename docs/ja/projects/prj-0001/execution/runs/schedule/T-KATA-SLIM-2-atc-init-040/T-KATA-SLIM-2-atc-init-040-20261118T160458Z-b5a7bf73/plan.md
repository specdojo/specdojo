---
specdojo:
  id: prj-0001:xep-t-kata-slim-2-atc-init-040-20261118t160458z-b5a7bf73
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-2-atc-init-040
  name: "rulebook から運用の記述を外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - atc-init
    - specdojo:atc-rulebook
---

# Edit Plan: T-KATA-SLIM-2-atc-init-040

## 1. このフェーズで行うこと

対応する rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」）と、 改訂済みの [[specdojo:sld-rulebook|sld-rulebook]] である。 外す記述: 役割の表と役割の段落、status の draft 維持・ready 昇格・PO の承認・agent の禁止・公開の承認条件・改訂と廃止の手順、 文書品質の検査（prettier・lint・見出し・wikilink）を業務の検証や受入条件に入れること、未決事項の表の管理台帳の区分・担当・判断時期・追跡先の列と台帳への登録の段落、 本文要件の言い直しだけの用語の表、共通規約と同じ禁止事項。 残す記述: その型固有の判断基準と区分、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、業務の受入確認の手順と合格条件、未決事項の論点と影響。 参照の形: 全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する。 章名と必須・条件付きの区分は、既存の成果物との対応を保つため原則として変えない。変える場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 8 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 共通の正本に足りない記述があれば、rulebook ではなく変更案として result に書く。 この段で直すのは rulebook だけとする。recipe・template・sample は commit の対象外のため変えず、合わせて直すべき点があれば変更案として result に書く。 rulebook が frontmatter の includes で取り込む記法の rulebook（`*-mermaid`・`*-d2` など）があれば、同じ段で同じ一覧に沿って簡潔にする。ただし cdfd-mermaid-rulebook と cdfd-d2-rulebook は cdfd-rulebook の段（cdfd-jibungoto-planet）だけが直し、cdfd-overview と cdfd-uc の段では変えない。非推奨の rulebook（cld・cstd・tml）と、扱いを決める decision がある ntp・dec は変えない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 受入テスト（初期セットアップ）
- `depends_on`:
  - [[atc-index]]
  - [[bac-init]]
- `overview`: 初期セットアップの受入テスト条件を定義する
- `path`: `docs/ja/product/080-test-specs/060-acceptance-test-catalog/atc-init.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-2-atc-init-040/T-KATA-SLIM-2-atc-init-040-20261118T160458Z-b5a7bf73/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/atc-rulebook.md`
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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 受入テストカタログ 対象別 作成ルール"`\]: `status が draft で recipe と template が undecided なのに、未決事項・ready 化の条件・判断者が本文に書かれていないため、未決論点と判断者を明記すること。`
- F002 \[minor/vp-pm-dependency-risk; line=73; anchor=``"- 対象固有の根拠（`br-*` / `bac-*` / `spec-*` / `ac-*` / `nfr-*` 等）は本文「トレース」に集約する。"``\]: ``対象ごとの根拠を本文のトレースだけに集めるよう定めているが、メタ情報標準が追跡関係の正本とする `relations.verifies` との関係が書かれていないため、上流の受入条件が変わったときの影響を追える仕組みを明記すること。``
- F003 \[minor/vp-pm-control-reporting; line=232; anchor=`"| トレースや証跡を持たないケースを恒久的に残す                               | SSOTとして成立しないため（暫定なら期限/条件を明記）                |"`\]: `暫定ケースの期限や判定保留条件を「明記」と求めるだけで、PJR など課題・リスクとしての転記先と担当 Role code が書かれていないため、報告先を明記すること。`
- F004 \[minor/vp-ba-stakeholder-clarity; line=103; anchor=`"- 期待する利用者：PO/利用部門/QA/運用が、前提を把握できる内容にする"`\]: `想定読者を「PO/利用部門/QA/運用」と並べるだけで、ATC の作成者・確認者・受入合意者の Role code が書かれていないため、合意の主体を明記すること。`
- F005 \[minor/vp-arc-technical-constraints; line=55; anchor=`"Frontmatter は共通スキーマに従います（あわせてドキュメントのメタ情報の記述ルールも参照）。"`\]: ``参照スキーマを挙げているのに、作成した `atc-＜term＞` を検証する手順（lint や schema validate）が書かれておらず、表もスキーマの制約と一致していないため、検証手順を追記すること。``
- F006 \[minor/vp-arc-conciseness; line=10; anchor=``"個別 ATC（`atc-<term>`）は、受入テストにおける SSOT の本体として、対象ごとの受入判断単位と責務を明確化し、"``\]: `全体方針の最初の段落が冒頭の説明とほぼ同じ主張（SSOT の本体・受入判断の範囲・証跡への接続）を繰り返しているため、どちらかに統合すること。`
- F007 \[major/vp-dev-implementation-readiness; line=204; anchor=`"##### 6.6.1.2. 条件・ケース表"`\]: ``条件・ケース表の列（`case_id`・条件・手順・期待値・観測点・環境/依存・トレース・優先度・実施形態・証跡）と各列の必須・任意が本文要件でも記述ガイドでも定義されておらず、サンプル章の例から推測するしかないため、列の定義を明記すること。``
- F008 \[minor/vp-dev-testability; line=55; anchor=`"Frontmatter は共通スキーマに従います（あわせてドキュメントのメタ情報の記述ルールも参照）。"`\]: ``作成した `atc-＜term＞` を確かめるコマンド（`npm run -s lint:md` や schema validate）と期待結果が書かれていないため、検証手順を追記すること。``
- F009 \[minor/vp-qe-verifiability; line=220; anchor=`"推奨：観点ごとのケース数は「代表（P0）→重要分岐（P0/P1）→重大リスク（P0）」の順で増やし、直積（全組合せ）を避ける"`\]: `優先度（P0/P1）の定義と判断基準、およびケース表の「実施形態」列に使える値が定義されておらず、分類が正しいかを判定できないため、定義を明記すること。`
- F010 \[major/vp-qe-omissions-consistency; line=64; anchor=`"| title      | 受入テストカタログ: <対象名>                                                     | ○    |"`\]: ``推奨 Frontmatter 項目の表とサンプル章の Frontmatter が、禁止されている `title` を必須にし、スキーマ上必須の `rulebook` と `specdojo:` 名前空間が欠けており、メタ情報標準とスキーマに矛盾しているため修正すること。``
- F011 \[minor/vp-qe-omissions-consistency; line=190; anchor=`"#### 6.6.1. 観点:<観点>"`\]: `禁止されている H5 見出し（本文198・204・284・288行目）を使い、山括弧のプレースホルダ（「観点:＜観点＞」「＜対象名＞」）をインラインコードで囲んでおらず、Markdown 記述ルールに違反しているため修正すること。`
- F012 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 受入テストカタログ 対象別 作成ルール"`\]: ``指定サンプル `docs/ja/specdojo/samples/atc-sample.md` が、本ルールで定義した構成（見出し1〜6）および type (`test`) に準拠しておらず、整合性が取れていない。``
- F013 \[minor/vp-qe-kata-conformance; line=78; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `章の名前が「本文構成（標準テンプレ）」のままで、rulebook 作成標準の標準章名「本文要件」と一致していないため、標準に合わせること。`
- F014 \[minor/vp-ux-language-consistency; line=26; anchor=`"TSP[\"tsp-index<br>テスト戦略・方針\"]"`\]: `位置づけの図の「テスト仕様-全体構成／テスト仕様-対象別／テストカタログ」がタイトルの「受入テストカタログ」と呼び方が揃っておらず、見出しの「観点:」と「観点：」も混在しているため統一すること。`
- F015 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 受入テストカタログ 対象別 作成ルール"`\]: `draft のまま recipe と template が undecided で、sample との不整合も未解消なのに、ready 化の条件と承認者が書かれていないため明記すること。`

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
