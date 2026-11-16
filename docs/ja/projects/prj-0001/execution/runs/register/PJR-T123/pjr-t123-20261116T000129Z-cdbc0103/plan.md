---
specdojo:
  id: prj-0001:xep-pjr-t123-20261116t000129z-cdbc0103
  type: exec-plan
  rulebook: none
  task_id: PJR-T123
  name: "cdfd-template の図の枠を D2 にする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
  approach: template-maintenance
  targets:
    - specdojo:cdfd-template
---

# Edit Plan: PJR-T123

## 1. このフェーズで行うこと

Mermaid のまま残る図の枠を、overview・uc の template と同じ D2 にそろえる

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-T123/pjr-t123-20261116T000129Z-cdbc0103/result.md`

編集対象（rulebook frontmatter の template 宣言から解決）:

- `kind`: template
- `path`: `docs/ja/specdojo/templates/cdfd-template.md`
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

参照の向きを「成果物 → template」に切り替え、対象成果物に紐づく template を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=3; anchor=`"_TODO_: 全体概要のどのプロセスグループと領域群を詳細化し、誰がグループ内部のフロー、領域間の受け渡し、主要例外、グループ外への委譲を合意・利用するかを 1〜3 文で記述する。"`\]: `導入部とセクション1における対象と用途の指示を統合する：導入部ではプロセスグループの識別と概要への参照を維持し、目的の記述が繰り返されるのを避けるために、目的セクションで承認、設計、検証の用途を一度だけ記述する。`
- F002 \[major/vp-qe-kata-conformance; line=32; anchor=`"_TODO_: 領域の役割と、領域内のプロセスがどう連携するかを 1〜3 文で要約する。"`\]: `スキャフォールドを specdojo:cdfd-rulebook のセクション 1, 5, 6.1, 6.2, 6.8, および 7 と一致させる：すべてのセクション 3.n から area-summary の TODO と入出力・保存の箇条書きを削除し、そこにあるプロセス表を維持する。また、セクション 1 と 2 を、1〜2文の目的と1行の対象および1行の除外条件へと作り変える。指示通りに現在のスキャフォールドを埋めると、管理ルールブックで明示的に禁止されているコンテンツが生成され、準備完了チェックリストを満たせなくなる。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の template を読み込み、現状の章構成の骨組みとプレースホルダの配置・網羅性を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 template の frontmatter から辿れる rulebook / recipe / sample、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物作成の開始点として適切かを見直す。
5. 成果物間で共通する定型部分は雛形の本文に取り込み、成果物ごとに内容が異なる部分は _TODO_ などのプレースホルダとして配置する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した template は [[specdojo:template-authoring-standard]]（構成・プレースホルダ規約・禁止事項の正本）に従う。rulebook / recipe / sample と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な template メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 template から辿れる rulebook / recipe / sample、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で template を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の template が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って template を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- cdfd-overview-template・cdfd-uc-template は D2 の図の枠を持つが、cdfd-template は Mermaid の枠のまま残っている（2026-11-15）
- 図の枠を [[specdojo:cdfd-d2-rulebook]] と overview・uc の template にならって D2 にする。全体概要が Mermaid を宣言した場合の扱いは cdfd-rulebook の記法の選択の規定に合わせて書く
- 0.8.0（PJR-PMK6）で型を極力最新にする方針に含める（2026-11-15、利用者が承認）
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-template.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- `cdfd-template` の図の枠が D2 で、`cdfd-overview-template`・`cdfd-uc-template` と同じ形にそろっている。
- 全体概要が Mermaid を宣言した場合の扱いが、cdfd-rulebook の記法の選択の規定と合っている。
- `npm run lint:md`・`npm run lint:d2` と親の検証が通り、型の grade で確かめる。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-template.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
