---
specdojo:
  id: prj-0001:xep-t-kata-review-all-bes-index-sample-120-20261125t154638z-f245fe4b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-bes-index-sample-120
  name: "R2 構成"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:bes-index-sample
    - specdojo:bes-index-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-bes-index-sample-120

## 1. このフェーズで行うこと

kata のレビューの段 R2（構成）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。R1 が直した版を読み、R1 の指摘を繰り返さない。
章の順・粒度・表と本文の配置が rulebook の本文構成と template に沿い、前提から結論の順に読めるかを確かめ、章の移動・分割・統合の差分を sample に入れる。rulebook など sample 以外は変更せず、直す案を result に書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を出力の findings に 1 件ずつ渡し、表を書かず、summary と handoff に指摘を重ねない。runner が findings を result の実施内容の後に表として 1 回だけ描く。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務イベント一覧: 駄菓子屋きぬや販売管理の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、業務イベント一覧: 駄菓子屋きぬや販売管理の完成例を示す
- `path`: `docs/ja/specdojo/samples/bes-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-bes-index-sample-120/T-KATA-REVIEW-ALL-bes-index-sample-120-20261125T154638Z-f245fe4b/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bes-index-sample.md`
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

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-pm-plan-feasibility; line=42; anchor=`"| _ASSUMPTION_: 事実データが販売記録・在庫記録・つけ台帳のデータモデルと未照合 | 照合まで事実データ列を確定入力にしない。発生時点で情報がそろわない、または発生後の結果を含む行は直す |"`\]: `事実データの照合と本文30行の未作成 BES の作成について、作業担当の Role code が示されていない。未決事項に各作業の担当を対応付け、誰の作業として着手・完了を追跡するかを明確にする。`
- F002 \[minor/vp-pm-control-reporting; line=39; anchor=``"| _UNDECIDED_: 発注のない納品を `bes-goods-delivered` に含めるか | 現定義では発生しない。決まるまで発注外納品の BPS・UI・テストを確定しない。決まったら `bes-goods-delivered` の発生条件を直すか、上位 CDFD と照合して行を足す |"``\]: `未決事項には影響と当面の扱いがあるが、課題・リスクとしての報告先や、解消時の決定記録への転記先が示されていない。各論点に管理先の登録項目または記録先を対応付け、文書内の未決事項と管理記録を追跡できるようにする。`
- F003 \[minor/vp-qe-kata-conformance; line=47; anchor=`"- 上位 CDFD の 10 領域に有効な 10 行が対応し、出典のない行・空欄、イベント ID の形式違反・重複（廃止行を含む）が 0 件である。"`\]: `対応 rulebook 6.10 は照合結果を残すよう求めているが、本節は確定入力として扱う条件だけを示し、実施済みの照合結果を区別して記録していない。領域・起点イベントとの対応、必須列、ID、個別 BES の相互参照について確認結果を示し、未実施項目は未実施と明記する。`

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
