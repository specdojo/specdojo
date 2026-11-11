---
specdojo:
  id: prj-0001:xep-pjr-vzt1-20261111t024531z-3f2bb2a9
  type: exec-plan
  rulebook: none
  task_id: PJR-VZT1
  name: "画面仕様（uis）の型を、標準の章立てと中身の厚さに磨き込む"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# Edit Plan: PJR-VZT1

## 1. このフェーズで行うこと

uis-rulebook と uis-sample を、ほかの業務仕様の型と同じく標準の章立て、記述ガイドの判断の基準と良い例・悪い例、clis-sample 程度の厚さの sample に磨き込み、grade を通す

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-VZT1/pjr-vzt1-20261111T024531Z-3f2bb2a9/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/uis-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_MISSING_**
- 責務: _MISSING_

このロールが重視するレビュー観点:

- _MISSING_

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- なし

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- uis の代表は今回作らなかった（SpecDojo に GUI がないため、PJR-RMMM）が、型は磨き込んでおく（indie の要望、2026-11-10）。夜間に流す。
- 保存済みの grade は uis-rulebook が needs-work 83（2026-10-10）、uis-sample が fail 54（2026-10-20）で、どちらも PJR-X3T8 で GUI だけにした後（2026-11-08）の評価ではない。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[specdojo:uis-rulebook]] を、[[specdojo:rulebook-authoring-standard]] の章立てに合わせている。rulebook にサンプルの章を置かず、`##` から `####` の見出しに連番を付けている。
- 記述ガイドに、章（概要・対象ユーザー/利用目的・表示項目・操作・遷移・バリデーション・エラー表示と利用者の次の手）ごとの判断の基準と、良い例・悪い例を書いている。
- `uis-sample` を、駄菓子屋の販売管理システムの GUI の画面の完成例として、[[specdojo:clis-sample]] 程度の厚さにしている。規則の必須の項目をすべて満たしている。
- GUI の画面仕様だけを対象とし、CLI は clis で書く、ワイヤーフレーム・レイアウトは含めない、という今の決まり（PJR-RMMM・PJR-PJYJ）を保っている。
- recipe と template の要否を決め、frontmatter に書いている。
- 磨き込みの後に `specdojo grade run --project prj-0001 --target kata --path docs/ja/specdojo/rulebooks/uis-rulebook.md --path docs/ja/specdojo/samples/uis-sample.md --run-id <任意>` を流し、rulebook と sample がどちらも pass になっている。pass にならない指摘は直すか、直さない理由を個票の対応結果に書いている（grade を流すのは orchestrator が行ってもよい）。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `uis-20261111`）で、uis-rulebook は pass 100 になったが、uis-sample は needs-work 93 で pass に届かなかった。次の minor の指摘を直し、grade で uis-sample が pass になっている（grade は orchestrator が流してよい）。
  - 未解決の点の表に、確認の担当（Role code）と報告先を書く。
  - PO の承認の責任と、公開の対象の範囲を書く。
  - プロジェクト側へ引き継ぐ未解決の点を、sample の中の点と分けて書く。
  - 在庫 0 の商品を初めて足すときに失敗した操作では明細の行ができないため、「明細削除」を次の手としている例を、実際の状態に合う次の手に直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- uis 以外の型と、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

### 夜間 autopilot の制約

この個票は人が記載済みの完了条件だけを承認した。次の操作は行わない。必要になった場合は、理由を result の申し送りへ記録して異常終了する。

- decision の決定、保護された設定の変更、公開・tag・push。
- 公開済み CHANGELOG 節の変更、未承認項目の実行、完了条件や変更範囲の拡張。
- 別の登録項目を自分で実行すること。見つけた別問題は夜間 orchestrator が承認待ちとして起票する。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
