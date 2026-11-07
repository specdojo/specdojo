---
specdojo:
  id: prj-0001:xep-pjr-f1fd-20261105t155345z-43f006ce
  type: exec-plan
  rulebook: none
  task_id: PJR-F1FD
  name: "stsd-rulebook の冒頭を頭書きと目的・適用範囲に分け、図の表示名を状態名と値にする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# Edit Plan: PJR-F1FD

## 1. このフェーズで行うこと

stsd-rulebook の本文構成を、頭書き・目的・適用範囲・状態一覧・状態遷移図・遷移の説明・今後の検討メモにする。図の表示名の規則も状態名と値の 2 行に合わせる

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-f1fd-20261105T155345Z-43f006ce-result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
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

- F001 \[minor/vp-qe-omissions-consistency; line=34; anchor=``"- 遷移 ID は文書内で一意な `T-<nn>` 形式とし、遷移の説明とレビュー指摘で同じ ID を使います。"``\]: `遷移 ID をレビュー指摘の参照キーに使う一方、遷移追加・削除時の既存 ID の保持と廃止 ID の再利用可否が未定義で指摘が別遷移へ結び付く恐れがあるため、採番の不変性と欠番・再利用ルールを明記してください。`
- F002 \[minor/vp-qe-omissions-consistency; line=57; anchor=`"| 1    | 概要           | ○        | 対象、スコープ、状態を管理する目的、利用者                                         |"`\]: `The summary contents in the table of Section 5 omit the "状態の正本となる管理場所" and "状態変更を起こす業務範囲", which causes an inconsistency with the requirements defined in Section 6.1 and the template. Please align the table contents.`

### 成果物から届いた Kata が原因の finding

- source=condense; result=`prj-0001:xer-t-stsd-pilot-stsd-job-run-080`; document=`stsd-job-run`; location=`編集前42〜64行・状態遷移図と72〜80行・遷移表の対応記述`; category=`canonical-restatement`; action=`retain`; reason=`遷移表を正本、図を全遷移の投影とする必須構造であり、図と表の対応確認に必要な状態・イベント・条件を保持した。`; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/stsd-rulebook.md「1. 全体方針」状態遷移図を遷移の説明の全行の投影とする規定、および「6.4. 遷移の説明」全遷移を一行ずつ記載する規定`
- source=condense; result=`prj-0001:xer-t-stsd-pilot-stsd-register-entry-080`; document=`stsd-register-entry`; location=`3. 状態遷移図と4.1の遷移表に共通するイベント・条件`; category=`figure-prose`; action=`retain`; reason=`図は俯瞰、遷移表は正本として必要であり、全40遷移を一行ずつ対応させるKata要件を満たすため保持した。`; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/stsd-rulebook.md §1「状態遷移図は…投影」、§6.4「図にある全遷移を一行ずつ記載」`
- source=condense; result=`prj-0001:xer-t-stsd-pilot-stsd-register-entry-080`; document=`stsd-register-entry`; location=`3.1〜3.3の共有状態の宣言`; category=`repetition`; action=`retain`; reason=`40遷移と状態ごとの入出力数が分割閾値を超える。共有状態の宣言は図の接続に必要であり、三図構成と同じ表示名・内部IDを保持した。`; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md §3の共有状態宣言、§6.3の分割閾値と共有状態`
- source=condense; result=`prj-0001:xer-t-stsd-pilot-stsd-routine-run-080`; document=`stsd-routine-run`; location=`3. 状態遷移図、二図の共有状態と4. 遷移の説明との対応`; category=`repetition`; action=`retain`; reason=`図と遷移表は全体像と詳細の対応に必要。6状態・11遷移でも試行中への接続数が6を超えるため二図を保持し、共有状態・遷移範囲の説明も残した。`; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md、6.3. 図の分割：一つの業務状態に接続する入出力遷移の合計が6を超える場合の分割と共有状態の指定`

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

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）
- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[specdojo:stsd-rulebook]] の本文構成の表が、頭書き（H1 直下の 1〜2 行。章にしない）・1. 目的・2. 適用範囲・3. 状態一覧・4. 状態遷移図・5. 遷移の説明・6. 今後の検討メモになっている。
- 「目的」には状態を管理する目的と利用者、「適用範囲」には対象・スコープ（AS-IS / TO-BE）、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない場合の到達点と理由を書く、と記述ガイドにある。これまで「概要」に書くとしていた規則（状態が一つの対象の根拠、終了点の省略の理由など）は、すべて目的か適用範囲へ移り、「概要」への参照が残っていない。
- 状態遷移図の表示名の規則（値がある場合は`状態名<br>値`、値が `-` の場合は状態名だけ）を、図の rulebook への参照で示し、同じ説明を 2 か所に書いていない。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
- 冗長さの判定は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を正本とする。
- 同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲は書かず、既存の記述は削る・まとめる・参照に置き換える。
- 判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
