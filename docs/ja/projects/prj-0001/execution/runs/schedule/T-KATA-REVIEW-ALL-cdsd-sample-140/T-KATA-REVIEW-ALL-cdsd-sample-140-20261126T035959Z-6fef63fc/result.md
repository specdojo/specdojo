---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdsd-sample-140-20261126t035959z-6fef63fc
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdsd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdsd-sample-140/T-KATA-REVIEW-ALL-cdsd-sample-140-20261126T035959Z-6fef63fc/plan.md
  started_at: "2026-11-26T04:00:13.391Z"
  completed_at: "2026-11-26T04:06:54.787Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdsd-sample
    - specdojo:cdsd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の段で `cdsd-sample` の事実を、schema・他の sample・成果物リファレンスと突き合わせた。誤りは 1 件で、未作成の保管場所一覧の予定文書 ID の種別の接頭辞を `sll` から `sld` に直した。
- frontmatter の `based_on`、`type`、`rulebook`、5 つの管理単位、プロセス名、販売単価などの粒度、販売管理 CLI の範囲、未作成 ID の不存在は、正本と一致した。担当の割り当てと例示の金額は正本のない業務の仮定として確かめの対象にしていない。
- 「schema が未作成」の指す先は確かめられず、修正せず申し送りにした。
- 検証は、executor の `prettier --check` と、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。コード系の検査は変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 確認事項と変更影響（未作成の保管場所一覧の予定 ID） | 未作成の保管場所一覧の ID が `specdojo:sll-sales-closing` で、種別の接頭辞が成果物リファレンスの `sld-&lt;term&gt;` と一致しない。 | `specdojo:sld-sales-closing` に直した。 | vp-arc-technical-constraints。docs/ja/specdojo/references/deliverables-reference.md の保管場所定義の行と、docs/ja/specdojo/rulebooks/sld-rulebook.md の H1「保管場所一覧（SLD）」。 | - |
| R4-2 | R4 | 対象外（docs/ja/specdojo/rulebooks/cdsd-rulebook.md の 5.3 と 5.5） | 保管場所一覧の略称を「SLL」と書いており、種別の接頭辞 `sld` と食い違う。sample の誤りの元とみられる。 | 「保管場所一覧（SLL）」と「SLL」を「保管場所一覧（SLD）」と「SLD」にする案。このタスクでは未修正。 | vp-arc-technical-constraints。 | - |
| R4-3 | R4 | 関連仕様と検証（照合手順と受入条件） | 「schema が未作成のため」の schema が何を指すか、本文から一つに決まらない。CDSD と SLD の schema はないが、業務データ辞書の schema（docs/specdojo/schemas/v1/bdd.schema.yaml）は存在する。 | 「データストアの実データを検証する schema が未作成のため」のように対象を限定する案。未修正。 | vp-qe-verifiability。確かめられない主張として残した。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdsd-sample.md`: 「確認事項と変更影響」の表で、未作成の保管場所一覧の予定文書 ID を `specdojo:sll-sales-closing` から `specdojo:sld-sales-closing` に修正した。成果物リファレンスでは保管場所定義の接頭辞が `sld-&lt;term&gt;` と定められており、これに合わせた。変更は 1 行のみ。

## 3. 申し送り

- `docs/ja/specdojo/rulebooks/cdsd-rulebook.md` の保管場所一覧の略称 SLL は、今回の sample の誤りの元とみられる。このタスクの変更対象外で、未修正のまま残っている（指摘 R4-2）。
- 「schema が未作成」の対象の限定は、業務の仮定の書き方に関わる。R5 か人の判断に任せる（指摘 R4-3）。
- R4-1: R4 / 確認事項と変更影響 / 未作成の保管場所一覧の ID が `specdojo:sll-sales-closing` となっており、成果物の種別の接頭辞が成果物リファレンスと一致しない（保管場所定義は `sld-&lt;term&gt;`） / `specdojo:sld-sales-closing` に直した / vp-arc-technical-constraints。正本は docs/ja/specdojo/references/deliverables-reference.md の保管場所定義の行（`sld-&lt;term&gt;`）と docs/ja/specdojo/rulebooks/sld-rulebook.md の H1「保管場所一覧（SLD）」 / -
- R4-2: R4 / 対象外（cdsd-rulebook の本文要件） / cdsd-rulebook.md の 5.3 と 5.5 は保管場所一覧の略称を「SLL」と書いており、種別の接頭辞 `sld` と食い違う。サンプルの誤りの元とみられる / - / vp-arc-technical-constraints。相手側は docs/ja/specdojo/rulebooks/cdsd-rulebook.md。直す案は「保管場所一覧（SLL）」と「SLL」を「保管場所一覧（SLD）」と「SLD」にすること / -
- R4-3: R4 / 関連仕様と検証（照合手順と受入条件） / 「schema が未作成のため」の schema が何を指すか、本文から一つに決まらない。CDSD と SLD の schema はないが、業務データ辞書の schema（docs/specdojo/schemas/v1/bdd.schema.yaml）は存在する / - / vp-qe-verifiability。確かめられない主張として残した。直す案は「データストアの実データを検証する schema が未作成のため」と対象を限定すること。業務の仮定の書き方に関わるため R5 か人の判断に任せる / 要判断
- 確かめの表の材料（主張 / 正本 / 結果）: (1) frontmatter の `based_on` の 3 文書が存在する / docs/ja/specdojo/samples/ / 一致。(2) `type: data` と `rulebook` / docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、cdsd-rulebook の推奨 Frontmatter 項目 / 一致。(3) 5 つの管理単位、参照だけの台帳、売場棚の扱い / cdfd-overview-sample.md のデータストア表と 75 行 / 一致。(4) 店頭販売・つけ販売・日次締め・月次見直しのプロセス名 / cdfd-overview-sample.md の P-03・P-04・P-09・P-10 / 一致。(5) 標準販売価格と販売単価の区別、売上ID＋明細番号の粒度、支払方法・購入者、入力途中と取消済みを含めない / bdd-sample.yaml の 34・58・88・101・113・115・139 行 / 一致。(6) 販売管理 CLI 仕様の範囲が現金販売の確定までで、つけ販売は対象外 / clis-sample.md の 25 行 / 一致。(7) `cdfd-sales` を店頭販売の CDFD として扱う / cdfd-sample.md の適用範囲 / 一致。(8) 未作成の 6 ID が存在しない / docs 配下を grep / 一致。(9) PO・BA・OPS・QE のロール / pm-members-sample.yaml / 一致。(10) 保管場所一覧の ID の接頭辞 sll / deliverables-reference.md の 226 行 / 不一致のため直した。(11) 「schema が未作成」 / docs/specdojo/schemas/v1/ / 確かめられない（bdd.schema.yaml は存在し、指す先が決まらない）。(12) 担当の割り当てと例示の金額 / 正本なし / 業務の仮定として確かめの対象外
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

kata-guide の R4（正しさ）に従い、sample の事実の主張を schema、成果物リファレンス、他の sample、rulebook と突き合わせた。誤りは直し、確かめられない主張は修正せず指摘に残した。正本のない業務の仮定は共通サンプル文脈と食い違わない限り対象外とした。構造・必須項目は rulebook を正とし、`status` は `draft` のまま据え置いた。
