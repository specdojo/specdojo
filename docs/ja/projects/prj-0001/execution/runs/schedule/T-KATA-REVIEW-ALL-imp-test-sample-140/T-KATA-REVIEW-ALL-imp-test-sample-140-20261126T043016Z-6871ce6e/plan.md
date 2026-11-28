---
specdojo:
  id: prj-0001:xep-t-kata-review-all-imp-test-sample-140-20261126t043016z-6871ce6e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-imp-test-sample-140
  name: "R4 正しさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-imp-test-sample-140

## 1. このフェーズで行うこと

kata のレビューの段 R4（正しさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
sample に書いてある事実（コマンド、オプション、キー、既定値、列挙値、パス、挙動）を、schema（docs/specdojo/schemas/v1/）、src/、コマンドリファレンス、必要なら --help や検証コマンドの実行と突き合わせる。主張ごとの確かめの表を result の実施内容に書き、誤りの直しの差分を sample に入れる。確かめられなかった主張も表に残す。指摘は同ガイドの「人への報告の形」に従い、executor は報告の handoff に 1 件ずつ 1 項目で書き、reporter は出力の findings に 1 件ずつ渡す（表を書かず、summary と handoff に指摘を重ねない。runner が result の実施内容の後に表として 1 回だけ描く）。駄菓子屋の業務の値のように正本のない仮定は、共通サンプル文脈と食い違わなければ確かめの対象にしない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: テストへの影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムの変更を題材に、テストへの影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-test-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-imp-test-sample-140/T-KATA-REVIEW-ALL-imp-test-sample-140-20261126T043016Z-6871ce6e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-test-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-pm-plan-feasibility; line=65; anchor=``"- 回帰テストの代替（重点 20 ケースへの絞り込み）と単体テストの見送りは決定記録 `PJR-T5D1` で決めた。回帰テストは、重点ケースで欠陥が 1 件でも見つかれば残り 100 ケースを受入判定前に実行する。単体テストは、値引き計算の分岐が 3 件を超えたら 2026-07-31 までに再評価する。"``\]: `重点回帰で欠陥が見つかった場合に残り100ケースを受入判定前に実行するとしているが、全120ケースの再実行は期限内に終わらないという本文53行目の判断と食い違う。2026-05-24〜05-28 での実行工数か、受入判定日を見直す条件を示す必要がある。`
- F002 \[minor/vp-dev-change-impact; line=56; anchor=`"## 5. 対応方針"`\]: ``結合テストの新規8ケース、重点回帰20ケース、業務受入テストの判定項目の更新を、どのテストカタログ（`＜level＞c-index`）やテスト戦略・方針へ反映するかが書かれていない。完成例として反映先の成果物を示す必要がある。``
- F003 \[minor/vp-qe-verifiability; line=25; anchor=`"| 重大度「高」（売上金額・つけ残高の誤り）の未解決欠陥が 0 件 | 欠陥一覧                 | 2026-05-28 の受入判定時点で該当欠陥が 0 件   |"`\]: `成功条件の「つけ残高の誤り」の欠陥0件は、つけ管理のテストを対象外とした本文8行目と合わず、検出する手段がないため判定が形だけになる。つけ残高をどのケースで確認するかを示すか、条件から外す必要がある。`
- F004 \[minor/vp-ux-readability; line=11; anchor=`"_ASSUMPTION_: リリース予定日を 2026-06-01 とし、受入判定日はその営業日前の 2026-05-28 とする。"`\]: `「その営業日前の 2026-05-28」は営業日数が抜けており、受入判定日をどう決めたか読み取れないため、「2 営業日前」のように日数を明記する必要がある。`
- F005 \[minor/vp-ux-language-consistency; line=74; anchor=``"| 連携系テストデータの準備     | 値引き条件の代表データセット     | 確定しないと結合テスト 8 ケースの期待値を作れず、2026-05-16 の期限を守れない       | 定額・定率の各 1 件で先行してケースを作成する            | 2026-05-14 | `QE` | `PJR-T5Q4`（`question`） |"``\]: ``論点名「連携系テストデータの準備」は本文中ほかに出てこない呼称で、I/F 連携のテスト（`imp-interface` の範囲）とも読めるため、影響詳細一覧・対応方針と同じく「結合テストの値引き条件データの準備」など既存の呼び方にそろえる必要がある。``

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
