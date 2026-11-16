---
specdojo:
  id: prj-0001:xep-pjr-kv37-20261115t235042z-8b43090d
  type: exec-plan
  rulebook: none
  task_id: PJR-KV37
  name: "ifx-file の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
---

# Edit Plan: PJR-KV37

## 1. このフェーズで行うこと

外部ファイル連携の sample を最新の grade の指摘で直す

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部ファイル連携仕様（agent の evidence）
- `depends_on`:
  - [[ifx-index]]
- `overview`: executor の agent が書き runner が読む evidence.json と pipeline-state.json の受け渡しについて、置き場所・命名・形式・必須項目・書き手と読み手・失敗時の扱いを定義する
- `path`: `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-KV37/pjr-kv37-20261115T235042Z-8b43090d/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/ifx-file-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-ba-requirements-completeness; line=331; anchor=`"\"type\": \"object\","`\]: `The sales-record schema contains only transaction identifiers, aggregate amounts, and statuses, and additionalProperties: false rejects line_items. Because current-tx.json is deleted after settlement, the contract leaves no retained itemized sales record despite promising sales details at lines 199–201. Define the retained product, quantity, and price details, or reference another durable itemized record and its retention contract.`
- F002 \[major/vp-arc-technical-constraints; line=231; anchor=`"atomic_write: 同一ディレクトリ内の一時ファイル（.tmp）へ書き込み・フラッシュ後に renameSync でアトミック置換を実施"`\]: `Per-file atomic replacement does not define a crash-safe update sequence across current-tx.json, the sales record, and the headquarters request. The state table describes payment_requested after sending, leaving a possible interruption with an open session and an unresolved request. Specify which session and pending-evidence writes must be durable before transmission, and how readers handle every intermediate file combination.`
- F003 \[major/vp-dev-implementation-readiness; line=331; anchor=`"\"type\": \"object\","`\]: `Implementing the sales-record schema as written prevents writers from persisting line_items and prevents readers from accepting them. After session deletion, the promised itemized evidence is unavailable. Extend the canonical illustrative schema with retained sales details, or define an explicit durable reference that compatible writers and readers can implement.`
- F004 \[major/vp-dev-implementation-readiness; line=367; anchor=``"| `status`          | `payment_requested`         | 会計要求を本部へ送った後で、控えの `api_sync_status` が `accepted` になるまで保持する。取消は不可 |"``\]: `payment_requested is described as a state after headquarters transmission, while open permits additions and cancellation. Define a durable pre-transmission transition and the required pending-record write order so an interruption cannot expose a potentially submitted transaction as editable or cancellable. Specify the restart behavior for failures between these writes and the external request.`
- F005 \[major/vp-qe-omissions-consistency; line=200; anchor=`"会計確定要求時の販売実績明細、預かり金・釣銭、本部売上登録 API の受付結果、"`\]: `The sales-evidence description promises 販売実績明細, but its schema omits item details and explicitly rejects additional properties. Session deletion then removes the only defined itemized source. Align the description, schema, and deletion condition so the promised evidence can actually survive settlement.`
- F006 \[major/vp-qe-kata-conformance; line=231; anchor=`"atomic_write: 同一ディレクトリ内の一時ファイル（.tmp）へ書き込み・フラッシュ後に renameSync でアトミック置換を実施"`\]: `Rulebook section 6.3 requires safe reruns without duplicate processing or lost work, but the multi-file completion example specifies atomic replacement only for individual files. Add the ordered publication and recovery rules for session state, pending sales evidence, headquarters submission, and session deletion so the example demonstrates that requirement across interrupted stages.`
- F007 \[major/vp-ops-operability; line=148; anchor=`"5 分間隔で最大 3 回再試行し、22:00 までに完了しない場合は自動再送を止めて店主代表へ電話発注を促す。"`\]: `A transfer timeout can occur after the remote final CSV has already been published, so stopping local retries and moving the local file to phoned/ does not prevent the supplier from processing both the CSV and a telephone order. Distinguish confirmed non-delivery from an unknown delivery outcome, and require PO to reconcile supplier receipt or cancellation before placing the replacement telephone order.`

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-KATA-WAVE-2-ifx-file-agent-evidence-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.ifx-file-sample）の major の指摘を取り込む。rulebook は変えない
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- YAML の書き方の誤り（コロンと空白を含む値の引用符の欠け）を直し、sample が YAML として読める。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
