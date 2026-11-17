---
specdojo:
  id: prj-0001:xep-t-kata-slim-pm-communication-plan-050-20261117t170920z-bda27c34
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-pm-communication-plan-050
  name: "sample から運用の記述と言い直しを外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - prj-0001:pm-communication-plan
    - specdojo:pm-communication-plan-sample
---

# Edit Plan: T-KATA-SLIM-pm-communication-plan-050

## 1. このフェーズで行うこと

直した rulebook に沿い、対応する sample から文書の運用の記述と同じ判断の言い直しを外す。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]]）と、改訂済みの [[specdojo:sld-sample|sld-sample]] である。 外す記述: 役割の段落、末尾の承認と agent の段落、検証の表の文書品質の行、未決事項の表の管理台帳の区分・担当・追跡先の列と登録の段落。 sample には共通の運用の参照文も書かない（rulebook が担う）。 同じ判断は 1 か所の表を正とし、ほかの章は章タイトルで参照する。隣接仕様との分担と対応は 1 つの表にまとめ、概要では再掲しない。 表のセルは要点にし、手順は場面別の表へ寄せる。 結論（判断の基準、値、例外、未決事項の論点）は変えない。変えた場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 7 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 この段で直すのは sample だけとする。recipe・template・rulebook は commit の対象外のため変えず、template などに同じ運用の記述があれば変更案として result に書く。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: コミュニケーション計画
- `depends_on`:
  - [[prj-0001:pm-plan]]
  - [[prj-0001:prj-stakeholder-register]]
- `overview`: 報告・連絡・会議体の計画を定義
- `path`: `docs/ja/projects/prj-0001/030-project-management/pm-communication-plan.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-pm-communication-plan-050/T-KATA-SLIM-pm-communication-plan-050-20261117T170920Z-bda27c34/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-communication-plan-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-qe-verifiability; line=11; anchor=`"| 店主への計画確認       | 対象範囲、試用日、費用・時間上限     | 着手前、重大変更時   | 対面または記録コメント  | PM   | 承認記録           |"`\]: `「重大変更時」「重大な懸念」「重大な影響」の判定基準がなく通知・エスカレーション要否を再現可能に判定できないため、正本の数値・状態条件への参照または具体的な閾値を記載してほしい。`
- F002 \[major/vp-qe-omissions-consistency; line=9; anchor=`"| 対象・機会             | 伝える・確認する内容                 | タイミング           | 手段                    | 責任 | 証跡               |"`\]: `ステークホルダー登録簿で後続計画への反映が明記された開発担当と技術メンターのコミュニケーション要件が機会表から欠落しているため、対応する対象・内容・時期・手段・責任・証跡を追加してほしい。`
- F003 \[major/vp-qe-omissions-consistency; line=29; anchor=`"- 顧客の氏名、つけ残高、連絡先、認証情報は公開資料や一般共有チャネルへ記載しない。"`\]: `顧客情報、つけ残高、連絡先、認証情報について公開資料と一般共有チャネルだけを禁止しており、ルールブックが禁止する AI Agent 入力が対象外になっているため、Agent 入力にも含めないことを明記してほしい。`
- F004 \[minor/vp-qe-omissions-consistency; line=5; anchor=`"店主、家族利用者、開発担当が、営業を妨げずに初期リリースと店頭試用を判断できるようにする。非同期の記録を基本とし、会議は利用者確認または意思決定が必要な場合だけ行う。役割や連絡先の一覧は各正本へ委譲する。"`\]: `必須の「方針と適用範囲」に、人間と AI Agent の責任境界が記載されていないため、Agent は整理・草案を支援しても合意・承認・公開判断を行わないことを明記してほしい。`
- F005 \[minor/vp-qe-omissions-consistency; line=28; anchor=`"- 判断、課題、リスク、変更は、後から理由と次の行動を追える形で正本へ記録する。"`\]: `「正本」という総称だけでは情報区分ごとの取扱いと記録先を確認できないため、必要な情報区分と具体的な正本または参照 ID の対応を示してほしい。`
- F006 \[minor/vp-qe-omissions-consistency; line=35; anchor=`"参加者、試用方法、公開範囲、主な連絡手段が変わった場合に本計画を見直す。営業時間外の緊急連絡手段は、店頭試用の開始前に PO が決定する。"`\]: ``未決事項にルールブック所定の `_UNDECIDED_:` ラベルがなく機械的・視覚的に識別できないため、決定時期と判断者を保持したまま所定の形式へ直してほしい。``
- F007 \[major/vp-qe-kata-conformance; line=5; anchor=`"店主、家族利用者、開発担当が、営業を妨げずに初期リリースと店頭試用を判断できるようにする。非同期の記録を基本とし、会議は利用者確認または意思決定が必要な場合だけ行う。役割や連絡先の一覧は各正本へ委譲する。"`\]: `完成 sample でありながらテンプレートが方針章に求める人間と AI Agent の境界と、ルールブックが求める秘密・個人情報の Agent 入力禁止が具体化されていないため、実運用可能な方針として補完してほしい。`
- F008 \[major/vp-qe-kata-conformance; line=9; anchor=`"| 対象・機会             | 伝える・確認する内容                 | タイミング           | 手段                    | 責任 | 証跡               |"`\]: `` `prj-stakeholder-register-sample` がコミュニケーション計画への反映を求める開発担当のイテレーション末確認と技術メンターの週次相談について、対象・契機・証跡を識別できる行がないため追加してほしい。 ``
- F009 \[minor/vp-qe-kata-conformance; line=9; anchor=`"| 対象・機会             | 伝える・確認する内容                 | タイミング           | 手段                    | 責任 | 証跡               |"`\]: `ルールブックは関係者をステークホルダー ID または Role code で記述するよう求めているが、機会表が「店主」「家族利用者」などの名称だけを使用しているため、登録簿の ID に対応させてほしい。`
- F010 \[minor/vp-qe-kata-conformance; line=23; anchor=`"| 品質、個人情報、公開適性に重大な懸念 | QE が対象を隔離し影響を整理する | PO       | レビュー、決定記録 |"`\]: `` `pm-plan-sample` は品質・個人情報の重大懸念時の PO 判断材料整理を PM に割り当て, `pm-raci-sample` は変更要求・リリース判断を PM=R、QE=C とするため, 品質・個人情報・公開適性を QE の一次対応一行に統合せず PM/QE の分担を明記してほしい。 ``
- F011 \[minor/vp-qe-kata-conformance; line=35; anchor=`"参加者、試用方法、公開範囲、主な連絡手段が変わった場合に本計画を見直す。営業時間外の緊急連絡手段は、店頭試用の開始前に PO が決定する。"`\]: ``rulebook の未決事項形式である `_UNDECIDED_:` を使用していないため、template に沿った完成例へ修正してほしい。``
- F012 \[minor/vp-ux-readability; line=5; anchor=`"店主、家族利用者、開発担当が、営業を妨げずに初期リリースと店頭試用を判断できるようにする。非同期の記録を基本とし、会議は利用者確認または意思決定が必要な場合だけ行う。役割や連絡先の一覧は各正本へ委譲する。"`\]: `「各正本」がどの文書を指すか本文から解決できず、Schedule・課題・決定記録などの参照先も示されていないため、関連文書の ID または参照先を簡潔に列挙してほしい。`
- F013 \[minor/vp-ux-readability; line=13; anchor=`"| 進捗共有               | 完了、次の作業、ブロック、必要な判断 | 節目または状態変化時 | Schedule と記録コメント | PM   | Schedule、課題     |"`\]: `「進捗共有」と「受入確認」は「対象・機会」列に受信者がなく、誰への共有・確認か初見で判断できないため、対象となるステークホルダー ID または Role code を明記してほしい。`
- F014 \[minor/vp-ux-language-consistency; line=11; anchor=`"| 店主への計画確認       | 対象範囲、試用日、費用・時間上限     | 着手前、重大変更時   | 対面または記録コメント  | PM   | 承認記録           |"`\]: ``登録簿の正式な「店主代表」および `STH-SHOP-OWNER` に対して「店主」を使用し、家族利用者も ID を省略しているため、関係者ラベルを登録簿の名称と ID に統一してほしい。``

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
