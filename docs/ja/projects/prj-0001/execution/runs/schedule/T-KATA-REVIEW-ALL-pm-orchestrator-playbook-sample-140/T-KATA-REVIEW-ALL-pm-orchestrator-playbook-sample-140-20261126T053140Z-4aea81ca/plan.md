---
specdojo:
  id: prj-0001:xep-t-kata-review-all-pm-orchestrator-playbook-sample-140-20261126t053140z-4aea81ca
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140
  name: "R4 正しさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140

## 1. このフェーズで行うこと

kata のレビューの段 R4（正しさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
sample に書いてある事実（コマンド、オプション、キー、既定値、列挙値、パス、挙動）を、schema（docs/specdojo/schemas/v1/）、src/、コマンドリファレンス、必要なら --help や検証コマンドの実行と突き合わせる。主張ごとの確かめの表を result の実施内容に書き、誤りの直しの差分を sample に入れる。確かめられなかった主張も表に残す。指摘は同ガイドの「人への報告の形」に従い、executor は報告の handoff に 1 件ずつ 1 項目で書き、reporter は出力の findings に 1 件ずつ渡す（表を書かず、summary と handoff に指摘を重ねない。runner が result の実施内容の後に表として 1 回だけ描く）。駄菓子屋の業務の値のように正本のない仮定は、共通サンプル文脈と食い違わなければ確かめの対象にしない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 駄菓子屋きぬや 販売管理システムのオーケストレーター運用メモの完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、駄菓子屋きぬや 販売管理システムのオーケストレーター運用メモの完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140-20261126T053140Z-4aea81ca/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 参考資料整備と成果物作成の計画・進捗・課題・リスクを管理する。小規模運用では専任化せず、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-pm-dependency-risk; line=63; anchor=``"- 待機が自分自身を数える: `pgrep -f` のパターンで相手の run を探すと、待機のコマンドの文字列も一致して終わらない。プロセスの番号か `exec queue` で待つ。"``\]: `落とし穴「待機が自分自身を数える」と commit メッセージの行に、根拠の事例（項目 ID・日付）と回避策を直す側の登録簿項目 ID がないため、rulebook の全体方針と禁止事項「直す側の項目を添えずに回避策を書く」に沿って添えるべきである。`
- F002 \[minor/vp-pm-control-reporting; line=80; anchor=``"- _UNDECIDED_: 営業時間外にタブレットが通信できないときの検証の扱い。決まるまでは、タブレットに接続する検証を `requires_human` として残し、翌朝の開店前に流す。"``\]: ``タブレットが営業時間外に通信できないときの未決事項に、回答を待っている登録簿の `question` の項目 ID がなく、記録先が分からないため、項目 ID を添えて rulebook の handoff と question の扱いとの関係を示すべきである。``
- F003 \[minor/vp-ba-requirements-completeness; line=70; anchor=``"1. 範囲の項目がすべて close されていることを登録簿で確かめる。close されていない項目があれば、次の版へ回すか待つかを店主代表（`PO`）に確かめる。"``\]: `リリースの手順に、版に含める項目の範囲をどう決めるか（誰が、何を基準に）がなく、rulebook の本文要件「範囲の決め方」を満たしていないため、手順 1 の前に範囲の決め方を足すべきである。`
- F004 \[minor/vp-arc-conciseness; line=63; anchor=``"- 待機が自分自身を数える: `pgrep -f` のパターンで相手の run を探すと、待機のコマンドの文字列も一致して終わらない。プロセスの番号か `exec queue` で待つ。"``\]: `` `pgrep -f` の自己一致と commitlint の `body-max-line-length` は、このプロジェクトに固有でない一般的な知見のため、rulebook の知見の育て方に従って本体への変更案に回し、運用メモからは外すべきである。 ``
- F005 \[minor/vp-qe-verifiability; line=72; anchor=`"3. 開発用の PC で全件の検査を流し、すべて通ったら配布物を作る。"`\]: `リリースの手順 3 の「全件の検査」が、どのコマンドや検査を流すのか特定されておらず pass / fail を判定できないため、流す検査を具体的に書くべきである。`
- F006 \[minor/vp-qe-omissions-consistency; line=10; anchor=``"`PJR-KN11` などの項目 ID と `kinuya-*` の記録は未同梱の架空の参照名で、記録先は [[specdojo:pm-plan-sample|プロジェクト管理計画]] に従う。"``\]: ``未同梱の参照名の例として挙げた `PJR-KN11` が本文で使われておらず、読み手が参照先を探してしまうため、本文で実際に使う `PJR-KN12` などに直すべきである。``
- F007 \[minor/vp-qe-omissions-consistency; line=14; anchor=``"難しさごとの既定の振り分けは `.specdojo/exec-defaults.yaml` の `routing` を正本とする。開発用の PC のメモリが足りないため、ローカル LLM の executor（`local-executor`）は easy の項目だけに使う。表に加えて、次の癖を踏まえて選ぶ。"``\]: `rulebook の本文要件が「agent の使い分けと癖」に求める「使わない agent と理由」がなく、該当がなければないことも書かれていないため、補うべきである。`
- F008 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 駄菓子屋きぬや 販売管理システムのオーケストレーター運用メモ"`\]: ``Frontmatter の `based_on` が rulebook の定める「決まりの直接の根拠になる決定（decision の個票）」ではなく pm-plan-sample を指し、template の `supersedes` もないため、Kata の間で揃えるべきである。``
- F009 \[minor/vp-qe-kata-conformance; line=37; anchor=`"- 個票の入力・完了条件には、変える対象の相対パスを書く。読むだけの文書はパスで書かず名前で書く。runner はパスを変更の範囲と推定し、同じパスを書いた項目を順番待ちにする。"`\]: `個票の入力・完了条件に変える対象のパスを書く決まりは、template の任意章「登録簿項目の完了条件の書き方」が受け持つ内容のため、その章を立てて移すべきである。`

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
