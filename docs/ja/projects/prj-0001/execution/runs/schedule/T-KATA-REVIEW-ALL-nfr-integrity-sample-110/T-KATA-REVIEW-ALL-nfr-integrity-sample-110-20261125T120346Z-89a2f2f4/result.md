---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-integrity-sample-110-20261125t120346z-89a2f2f4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-integrity-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-integrity-sample-110/T-KATA-REVIEW-ALL-nfr-integrity-sample-110-20261125T120346Z-89a2f2f4/plan.md
  started_at: "2026-11-25T12:03:57.729Z"
  completed_at: "2026-11-25T13:14:06.443Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）を確認した。sample は rulebook の 5 章と記述ガイドの必須項目、成果物カタログの `done_criteria` の観点を満たしていた。欠けている内容も余分な内容もなかった。
- 直したのは 1 点だけである。本文の `_ASSUMPTION_` は「`based_on` は空にしている」と書いているが、frontmatter に `based_on` がなかった。このため frontmatter に `based_on: []` を追加した。F001 のうち sample で直せる部分はこれで解消した。
- F001 の残りは、根拠文書の作成または決定記録への導線の追加である。導線は「関連ドキュメント導線」の `dec-*` に既にある。根拠文書の作成は sample の範囲を超えるため、sample では扱っていない。
- F002 は rulebook 側の記述の陳腐化である。rulebook は sample 以外なので変更せず、直す案を指摘に残した。
- F003 は `vp-ops-release-readiness` の指摘である。kata-guide の「kata の観点の組」では、この観点は kata のレビューの段から外されている。このため R1 では扱わない。sample の `_UNDECIDED_` は未確定事項を明示する例として残した。
- 検証では、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | Frontmatter / 2. 適用範囲・前提条件 | 本文の `_ASSUMPTION_` は「`based_on` は空にしている」と書くが、frontmatter に `based_on` がなく、本文と食い違っていた（F001 のうち sample で直せる部分）。 | frontmatter に `based_on: []` を追加した。 | `vp-qe-kata-conformance`（rulebook「推奨 Frontmatter 項目」の `based_on`、「記述ガイド」の適用範囲・前提条件の保持期間と根拠）と、Sample 記述標準の「共通サンプル文脈」の前提条件（未確定事項は `_ASSUMPTION_` で明示）。根拠の規程文書が存在しないため、存在しない ID を `based_on` に入れる案（デッドリンクになる）は採らなかった。 | 要判断 |
| R1-2 | R1 | 2. 適用範囲・前提条件（保持期間の根拠） | F001 は根拠文書の作成または決定記録への導線を求めている。導線は「関連ドキュメント導線」の `dec-*`（保持期間の根拠の判断、任意）に既にある。根拠文書の作成は sample の範囲を超える。 | - | `vp-po-purpose-alignment`。`dec-sample` は deprecated で、決定はプロジェクト登録簿の decision へ移っている。rulebook「位置づけ」表の `dec-*` を登録簿の decision に置き換えるかは R5（整合）で確かめるよう申し送る。 | - |
| R1-3 | R1 | rulebook「全体方針」の `_UNDECIDED_` | rulebook は「sample は本文構成（標準テンプレ）の 5 章に揃っていない」と書くが、sample は既に 5 章に揃っている（F002）。 | `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` の該当の `_UNDECIDED_` を「sample は 5 章に揃った。`recipe`・`template` の要否と、同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする」に書き換える。 | `vp-qe-kata-conformance`。 | - |
| R1-4 | R1 | 2. 適用範囲・前提条件、4. 測定・検証方法の `_UNDECIDED_` | F003（ready 化の条件の明示）は `vp-ops-release-readiness` の指摘である。kata-guide の「kata の観点の組」では kata の段のレビューから外す観点のため、R1 では扱わない。sample の `_UNDECIDED_` は未確定事項を明示する例として残した。 | - | kata-guide「kata の観点の組」（`vp-ops-release-readiness` は承認と ready 化を登録簿で追うため外す）。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-integrity-sample.md`: frontmatter に `based_on: []` を追加し、本文の `_ASSUMPTION_`（`based_on` は空にしている）との食い違いを解消した。保持期間の根拠が未作成であることは `_ASSUMPTION_` で明示したままにしている。

## 3. 申し送り

- F001 の残りの扱いは R5（整合）に回す。`dec-sample` は deprecated で、決定はプロジェクト登録簿の decision へ移っている。rulebook「位置づけ」表の `dec-*` を登録簿の decision に置き換えるかは、R5 で確かめる。
- F002 の対応には rulebook の更新が必要である。sample 以外は本タスクの範囲外のため、別タスクで `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` を直す。
- R1-1: R1 / Frontmatter・2. 適用範囲・前提条件 / 本文の `_ASSUMPTION_` は「`based_on` は空にしている」と書くが、frontmatter に `based_on` がなく、本文と食い違っている（F001 のうち sample で直せる部分） / frontmatter に `based_on: []` を追加した / `vp-qe-kata-conformance`（rulebook「推奨 Frontmatter 項目」の `based_on`、「記述ガイド」の適用範囲・前提条件の保持期間と根拠）、Sample 記述標準の「共通サンプル文脈」の前提条件（未確定事項は `_ASSUMPTION_` で明示）。根拠の規程文書が存在しないため、存在しない ID を `based_on` に入れる案（デッドリンクになる）は採らなかった / 要判断
- R1-2: R1 / 2. 適用範囲・前提条件（保持期間の根拠） / F001 は根拠文書の作成または決定記録への導線を求めているが、導線は「関連ドキュメント導線」の `dec-*`（保持期間の根拠の判断、任意）に既にある。根拠文書の作成は sample の範囲を超える / - / `vp-po-purpose-alignment`。`dec-sample` は deprecated で、決定はプロジェクト登録簿の decision へ移っている。rulebook「位置づけ」表の `dec-*` を登録簿の decision に置き換えるかは R5（整合）で確かめるよう申し送る / -
- R1-3: R1 / rulebook「全体方針」の `_UNDECIDED_` / rulebook は「sample は本文構成（標準テンプレ）の 5 章に揃っていない」と書くが、sample は既に 5 章に揃っている（F002） / - / `vp-qe-kata-conformance`。直す相手は `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md`。案: 該当の `_UNDECIDED_` を「sample は 5 章に揃った。`recipe`・`template` の要否と、同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする」に書き換える / -
- R1-4: R1 / 2. 適用範囲・前提条件・4. 測定・検証方法の `_UNDECIDED_` / F003（ready 化の条件の明示）は `vp-ops-release-readiness` の指摘で、kata-guide の「kata の観点の組」が kata の段のレビューから外す観点のため、R1 では扱わない。sample の `_UNDECIDED_` は未確定事項を明示する例として残す / - / kata-guide「kata の観点の組」（`vp-ops-release-readiness` は承認と ready 化を登録簿で追うため外す） / -
- 適用外の検証: `npm run validate:schema:file`（changed file is Markdown only; no `*.yaml` or `*.yml` changed）
- 適用外の検証: `npm run validate:history-links`（only a sample under docs/ja/specdojo/samples/ was changed; no plan/result/pjr history file was edited）

## 4. 進め方と実践の型の適用

根拠にしたのは、plan に展開された F001〜F003、sample の frontmatter から辿れる rulebook（`nfr-integrity-rulebook`）の「推奨 Frontmatter 項目」と「記述ガイド」、Sample 記述標準、kata-guide の「kata の観点の組」と「人への報告の形」である。維持した記述は、5 章構成、重要記録ごとの要件表、`_ASSUMPTION_` と `_UNDECIDED_` による未確定事項の明示、関連ドキュメント導線の表である。いずれも rulebook の必須項目に整合し、判断に要る情報だった。改訂したのは `based_on` の欠落だけである。存在しない根拠文書の ID を `based_on` に入れるとデッドリンクになるため、空配列にした。F001 の残りは sample の範囲を超えるため見送った。F002 は rulebook 側の修正案を指摘として残した。F003 は R1 の観点外として扱わなかった。frontmatter の `status` は `draft` のまま据え置いた。
