---
specdojo:
  id: prj-0001:xep-t-kata-slim-bps-init-required-050-20261117t180800z-cd68f46f
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-bps-init-required-050
  name: "sample から運用の記述と言い直しを外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - bps-init-required
    - specdojo:bps-sample
---

# Edit Plan: T-KATA-SLIM-bps-init-required-050

## 1. このフェーズで行うこと

直した rulebook に沿い、対応する sample から文書の運用の記述と同じ判断の言い直しを外す。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]]）と、改訂済みの [[specdojo:sld-sample|sld-sample]] である。 外す記述: 役割の段落、末尾の承認と agent の段落、検証の表の文書品質の行、未決事項の表の管理台帳の区分・担当・追跡先の列と登録の段落。 sample には共通の運用の参照文も書かない（rulebook が担う）。 同じ判断は 1 か所の表を正とし、ほかの章は章タイトルで参照する。隣接仕様との分担と対応は 1 つの表にまとめ、概要では再掲しない。 表のセルは要点にし、手順は場面別の表へ寄せる。 結論（判断の基準、値、例外、未決事項の論点）は変えない。変えた場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 7 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 この段で直すのは sample だけとする。recipe・template・rulebook は commit の対象外のため変えず、template などに同じ運用の記述があれば変更案として result に書く。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務プロセス仕様（初期セットアップ・必須プロセス）
- `depends_on`:
  - [[bes-index]]
- `overview`: 導入条件の確定・Kataの配置・稼働構成の初期化からなる必須フロー（P-01-01〜03）を定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/bps-init-required.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-bps-init-required-050/T-KATA-SLIM-bps-init-required-050-20261117T180800Z-cd68f46f/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bps-sample.md`
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

- F001 \[minor/vp-qe-verifiability; line=78; anchor=`"| 補充が必要     | 販売中の商品で、現在庫が補充基準を下回る                 | 店主代表が承認した補充依頼が一件確定し、仕入グループが商品と依頼数量を確認できる                                     | 補充依頼、承認記録         |"`\]: `「補充が必要」の入力条件に未完了依頼がないことが含まれず「既存依頼と重複」の条件と重なるため、どちらの期待成果を適用するか判定できるよう条件または優先関係を明示する必要がある。`
- F002 \[minor/vp-qe-verifiability; line=82; anchor=`"| 判断情報が不足 | 商品、現在庫、補充基準、発注単位のいずれかが不明         | 補充依頼を確定せず、不足項目、確認担当、再開対象の商品が記録される                                                   | 保留記録                   |"`\]: ``「判断情報が不足」の期待成果は確認担当の記録を要求する一方、`E-01` の処置は不足項目と対象商品の記録しか定めていないため、保留記録から期待成果を検証できるよう記録項目を一致させる必要がある。``
- F003 \[minor/vp-qe-omissions-consistency; line=27; anchor=`"- 店主代表が補充要否と依頼数量を最終判断できる。家族利用者代表が検出した場合も、補充依頼の確定は店主代表が行う。"`\]: `店主代表が最終判断できない場合の非起動、差戻し、または例外が定義されていないため、前提条件不成立時の経路を明示する必要がある。`
- F004 \[minor/vp-qe-omissions-consistency; line=70; anchor=``"| `E-02`  | `S-02`         | 同じ商品に未完了の補充依頼がある                             | 新しい補充依頼の確定 | 店主代表 | 既存依頼へ依頼数量を反映するか、新規依頼を作らないかを判断して記録する | 既存依頼を更新して再承認するか、重複不要の記録を代替成果として終了する |"``\]: `` `E-02` の「重複不要の記録」は代替成果として終了するとされる一方、出力表に受け手・確定条件・正本・後続処理が定義されていないため、条件付き終了の業務成果として追跡できるよう出力へ追加する必要がある。 ``
- F005 \[minor/vp-qe-omissions-consistency; line=71; anchor=``"| `E-03`  | `S-03`、`S-04` | 判断根拠を記録できない、または仕入グループへ引き渡しできない | 補充依頼の引き渡し   | 店主代表 | 補充依頼を非確定・未受領状態のまま保留し、状況を記録する               | 判断根拠を確認するか引き渡し可能になった後に再開する                   |"``\]: `` `S-03` の判断根拠記録失敗では補充依頼が未確定だが、`S-04` の引渡失敗では既に確定済みであるため、両者を一律に「非確定・未受領状態」とする処置を原因ごとの状態、停止範囲、再開位置へ分ける必要がある。 ``
- F006 \[minor/vp-qe-omissions-consistency; line=79; anchor=`"| 補充が不要     | 現在庫が補充基準以上、または販売停止・終売である         | 補充依頼を作らず、対象商品と補充不要理由が記録される                                                                 | 在庫記録の補充不要記録     |"`\]: `トリガーと開始条件は現在庫が補充基準を下回った場合に限定されている一方、「補充が不要」は現在庫が補充基準以上の場合を含むため、開始後の在庫変動を再確認する経路を定義するか、到達可能な開始条件または受入条件へ揃える必要がある。`

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
