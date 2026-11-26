---
specdojo:
  id: prj-0001:xep-t-kata-review-all-sld-sample-150-20261126t101230z-3d8c5884
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-sld-sample-150
  name: "R5 整合"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
    - specdojo:sld-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-sld-sample-150

## 1. このフェーズで行うこと

kata のレビューの段 R5（整合）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
同じ接頭辞の sample（index と個別）、wikilink と based_on の参照先、用語集（docs/ja/product/010-business-specs/060-glossary/）、Sample 記述標準の共通サンプル文脈を読み、食い違いを確かめる。sample の側を直す差分を入れ、相手側を直すべき点は変更せずに直す案を result に書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を出力の findings に 1 件ずつ渡し、表を書かず、summary と handoff に指摘を重ねない。runner が findings を result の実施内容の後に表として 1 回だけ描く。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 保管場所一覧（駄菓子屋きぬやの販売・在庫・記録管理）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、保管場所一覧（駄菓子屋きぬやの販売・在庫・記録管理）の完成例を示す
- `path`: `docs/ja/specdojo/samples/sld-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-sld-sample-150/T-KATA-REVIEW-ALL-sld-sample-150-20261126T101230Z-3d8c5884/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/sld-sample.md`
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
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。共通の正本（ドキュメントメタ情報標準など）にある運用の記述（役割・status と承認・改訂と廃止・文書の品質の検査など）の再掲と、同じ判断を複数の章で言い直すことは冗長として扱う。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは減点しない。削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合は minor とし、その量が多い場合（同じ判断を 3 か所以上で言い直す、正本の再掲が章の大半を占めるなど、削れる量が本文の約 2 割以上）は major とする。grade plan に大きさの指標の上限超過が示された文書では、削れる箇所を行番号つきの finding で示す。上限を超えても、超えた分が判断に要る背景・制約・例外・完了条件で削れる箇所がなければ finding を付けない（指標の finding は note に下がり減点しない）。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=85; anchor=``"| `_UNDECIDED_`: 販売記録の正本保存先と電子・紙記録の保持期間（CDSD で未決） | 決まるまで `data/sales/` と母屋書庫の記録を処分しない                                                    |"``\]: `第5章の販売記録・紙記録の処分禁止と日次集計の削除禁止は、保管場所一覧の22・32・33行目にある保持・削除条件の再掲です。削除条件の正本を一覧に保つため、第5章では該当行への参照と決定後の変更影響を示す形にまとめてください。`
- F002 \[minor/vp-qe-omissions-consistency; line=67; anchor=``"| [[specdojo:stsd-sample\\|商品のステータス定義]]                               | 商品が入荷から販売・返品までにとる状態と、状態の移り変わり方 | 入荷済み（`received`）・検品済み（`inspected`）は検品場所、販売可能（`sellable`）は売場棚、返品待ち（`return-pending`）は返品保管箱。撤去品保留箱に当たる状態はない          |"``\]: ``隣接仕様の対応表の STSD 行に販売済み（`sold`）の置き場所がなく、STSD が `sold` を販売記録に対応づけていることと、77行目の「STSD の全状態を一覧と照合する」確認手順との対応が取れません。`sold` は販売記録として `data/sales/`（現金）と販売ノート（つけ）に対応することを同じ行に追記してください。``
- F003 \[minor/vp-qe-kata-conformance; line=15; anchor=``"| 検品場所（店舗奥の荷受台）                                                  | 配置前の入荷品、納品伝票、外箱                                                                             | 入荷受入、入荷検品                       | 店舗内共有                                           | 入荷当日の配置完了まで               | `条件付き処分可`。検品結果を仕入ノートへ記録し、商品を売場棚か返品保管箱へ移してから外箱を処分する。伝票は店頭台帳保管棚へ移す |"``\]: `前回の集計元とメンバー割り当ての重大な不整合、および現金と仮メモの混在は解消していますが、検品場所には破棄しない商品、保管棚へ移す納品伝票、解体処分する外箱が同じ管理行に残っています。ルールブックが求める共有範囲・寿命・削除可否の判断単位に従い、同じ検品場所内でも商品・伝票・外箱の管理区分を分けてください。個別の扱い自体は記載されているため、残る問題は区分の軽微な不整合です。`
- F004 \[minor/vp-ux-language-consistency; line=78; anchor=``"| 本書だけで消してよいかと壊れたときの対処を判断できる | 店番担当が本書だけを見て、空き容量の不足と `data/sales/` の破損を模擬して対処を答える                                                                                       | 容量不足では `tmp/` と条件を満たした `receipts/` だけを消すと答え、破損では新規会計を止めて DEV へ連絡すると答える                                 |"``\]: `合格条件では店番担当が破損時に新規会計を止めて DEV へ連絡すると答えますが、53行目の担当欄では同じ対処を OPS（51行目で店主代表と定義）が行うと書いており、担当の表記が店番担当と Role code の間で揺れて同一場面の行為者が一致しません。店番担当を業務上の担当名として使うなら Role code との関係を明示するか、場面別の表と確認手順で同じ担当表記に揃えてください。`
- F005 \[minor/vp-ops-operability; line=31; anchor=``"| 取引セッション（`.session/current-tx.json`）         | 進行中の取引の明細と確定状態                                                                     | `sales start`、`add`、`total`、`complete`、`cancel` | 共有なし（端末ローカル）                     | 取引開始から会計完了・確定前取消まで | `条件付き削除可`。CLI が終了させる場合に限る。手で消さない                                                                        |"``\]: `前回のつけ販売の集計漏れと確認証跡の混同は64行目で解消していますが、取引セッションの消失・破損時の対処を「場面別の対処と復旧手順」に追加してください。CLISではセッション欠落時の sales start が新規取引を作成するため、未解決会計の有無をPO・DEVが照合するまで新規開始や強制初期化を止める条件と再開条件を明示する必要があります。受付結果不明時の保留・連絡方針は既にあるため、その適用場面を補う軽微な課題です。`

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
