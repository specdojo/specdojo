---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-cnd-specdojo-040-20261113t222935z-e48e4870
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-cnd-specdojo-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-rulebook
---

# Edit Plan: T-KATA-WAVE-1-cnd-specdojo-040

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
初期整備した代表の実績から rulebook を手入れする。成果物本体は変更しない。sample・recipe・template の整合は後続の段で行う。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: C4コンテナ図（SpecDojo）
- `depends_on`:
  - [[cxd-specdojo]]
- `overview`: SpecDojo CLI・生成ドキュメントサイト（VitePress）・外部システム・リポジトリ（データストア）の関係を定義する
- `path`: `docs/ja/product/030-architecture/010-c4/cnd-specdojo.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-cnd-specdojo-040/T-KATA-WAVE-1-cnd-specdojo-040-20261113T222935Z-e48e4870/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/cnd-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=61; anchor=`"- コンテナ内部の分解（コンポーネント/クラス、内部モジュール構成）"`\]: `合意すべき内容や未決事項は明示されているが、POやアーキテクトなど誰が最終的な承認判断を行うかの判断者が定義されていない。`
- F002 \[minor/vp-pm-plan-feasibility; line=11; anchor=`""`\]: `成果物の作成やレビューを担う担当 Role code や、開発プロセスのどのタイミングで完了すべきかが明示されていないため、タスク化の粒度が不足している。`
- F003 \[minor/vp-pm-control-reporting; line=178; anchor=`"## 9. 禁止事項"`\]: `補足に未確定な論点を列挙する指示はあるが、それらをプロジェクトの課題管理（PJRなど）へ転記・報告するプロセスが定義されていない。`
- F004 \[minor/vp-ba-stakeholder-clarity; line=61; anchor=`"- コンテナ内部の分解（コンポーネント/クラス、内部モジュール構成）"`\]: `Person（利用者）の定義基準はあるが、作成された図をビジネス側や開発側の誰と合意すべきかの確認者（ステークホルダー）が明記されていない。`
- F005 \[major/vp-arc-technical-constraints; line=43; anchor=``"### 3.1. `based_on` の考え方（例）"``\]: ``成果物 Frontmatter の項目表が `specdojo:` 名前空間を用いず、標準で H1 に置く `title` を Frontmatter 必須としているため、現行メタデータ規約とスキーマに適合する成果物を作成できない。``
- F006 \[major/vp-dev-implementation-readiness; line=43; anchor=``"### 3.1. `based_on` の考え方（例）"``\]: ``実装入力となる Frontmatter 規定が必須の `specdojo:` ラッパーと `rulebook` を示さず、非標準の `title` を要求しているため、記載例を有効な成果物として実装できない。``
- F007 \[minor/vp-dev-testability; line=201; anchor=`""`\]: `第10章は目視チェックだけで、対象ファイルに対する lint、Frontmatter schema 検証、Mermaid 描画確認のコマンドと合格条件を示していない。`
- F008 \[minor/vp-qe-verifiability; line=205; anchor=`"type: architecture"`\]: `レビュー条件の「主要」「過不足なく」「必要十分」「意味が解釈一致」に具体的な合否基準がなく、同じ図でも判定者によって結果が変わり得る。`
- F009 \[major/vp-qe-omissions-consistency; line=43; anchor=``"### 3.1. `based_on` の考え方（例）"``\]: ``Frontmatter の必須項目表が `specdojo:` 名前空間や必須の `rulebook` を欠き、本文 H1 に置くべき `title` を必須項目としているため、参照先のメタデータ標準と整合していない。``
- F010 \[minor/vp-qe-kata-conformance; line=7; anchor=`"この章の成果物は、次の2つをセットで扱います。"`\]: ``指定されているサンプル `specdojo:cnd-sample` の Frontmatter で、準拠ルールが `specdojo:cnd-rulebook` ではなく `specdojo:cnd-mermaid-rulebook` になっている。``
- F011 \[major/vp-qe-kata-conformance; line=7; anchor=`"この章の成果物は、次の2つをセットで扱います。"`\]: ``指定されているサンプル `specdojo:cnd-sample` が第6章の標準構成（概要、C4コンテナ図、要素の説明、補足）に従っておらず、適用例として不十分である。``
- F012 \[minor/vp-ops-release-readiness; line=48; anchor=`""`\]: `status を ready に変更して公開するための具体的な判定基準（承認の完了など）や、公開前確認の手順が明記されていない。`
- F013 \[minor/vp-ops-operability; line=11; anchor=`""`\]: `ルールの継続更新や内容に関する問い合わせに対応するための担当 Role code（アーキテクチャチームなど）が明記されていない。`

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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
