---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-usability-sample-120-20261125t222855z-d32f36f3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-usability-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-usability-sample-120/T-KATA-REVIEW-ALL-nfr-usability-sample-120-20261125T222855Z-d32f36f3/plan.md
  started_at: "2026-11-25T22:29:05.110Z"
  completed_at: "2026-11-25T22:34:59.432Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `nfr-usability-sample` を確認した。章の順と粒度は rulebook の本文要件の 5 章に沿っており、章の移動・分割・統合は不要だった。
- 「測定・検証方法」と「関連ドキュメント導線」で、表の前の 1 文と前提から結論への並びを直した。
- grade の finding F001 は R1 の版で「（未作成）」の明示が済んでおり、解消済みと確認した。F002 は R3 の観点のため、この段では扱わなかった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | 測定・検証方法（表の前の文と表の後の段落） | 表の前の文が「基準値は「操作性要件一覧」を参照する。」だけで、何の表かを示していなかった。被験者の選び方は全テストの前提なのに、表の後に結論（pass/fail）と並べて置かれていた。 | 表の前を「次の表に、要件 ID ごとの測定方法・判定タイミング・判定者を示す。基準値は「操作性要件一覧」を参照し、ユーザビリティテストの被験者は本システムの開発に関わっていない人から選ぶ。」にした。表の後は pass/fail と測り直しの文だけを残した。sample に反映済み。 | sample-authoring-standard の「表の前に、何と何の対応を示す表かを 1 文で書く」、kata-guide の R2「前提から結論の順に読めるか」、vp-arc-document-structure | - |
| 2 | R2 | 関連ドキュメント導線（表の前の段落） | 表の前に、変更時の見直しの段落が置かれていた。この段落はまだ読んでいない表の行を指し、何の表かを示す 1 文もなかった。 | 表の前を「次の表に、本書の参照先と参照する目的を示す。」にし、見直しの段落は表の後へ移した。sample に反映済み。 | sample-authoring-standard の表の前の 1 文の規定、kata-guide の R2「前提から結論の順」、vp-arc-document-structure | - |
| 3 | R2 | 適用範囲・利用者前提の 3 つ目の箇条書き（店主代表の文字サイズ） | 「熟練利用者の測定も同じ端末・同じ文字サイズの設定で行う」は測定の条件とも読め、測定・検証方法に移す余地がある。一方、rulebook の「記述ガイド」の判断基準は「基準値がどの利用者・環境で成り立つか」で、利用環境の前提とも読める。 | 今回は移さなかった。測定の手順として扱う場合は、測定・検証方法の表の前の文へ移す。 | nfr-usability-rulebook の「記述ガイド」の適用範囲・利用者前提と測定・検証方法の判断基準 | 要判断 |
| 4 | R2 | grade の finding F001（関連ドキュメント導線の `sac-store-sales`） | R1 が直した版では、目的の列に「（未作成）」がすでに明示されていて、指摘は解消済みだった。 | 変更なし | 現在の sample の関連ドキュメント導線の表の受入条件の行 | - |
| 5 | R2 | grade の finding F002（測定・検証方法の判定者列の「利用者代表」） | 観点 `vp-ux-language-consistency` は R3 の観点のため、この段では扱わず R3 に任せる。 | 変更なし（R3 で Role code の表記を判断する） | kata-guide の「kata の観点の組」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: 「測定・検証方法」の表の前の文を、表の内容と基準値の参照、被験者の選び方（前提）を示す形に改めた。表の後は pass/fail と測り直しの文だけを残した。「関連ドキュメント導線」では、表の前に何の表かを示す 1 文を置き、変更時の見直しの段落を表の後へ移した。

## 3. 申し送り

- rulebook の「記述ガイド」の適用範囲・利用者前提には、店主代表の文字サイズに関する箇条書きについて、測定条件か利用環境の前提かを判断する余地が残る。この箇所の扱いは findings の No 3 を参照する。
- `nfr-usability-rulebook` の frontmatter で `template` が `undecided` のため、template との照合は行っていない。
- No: 1 / 段: R2 / 箇所: 測定・検証方法（表の前の文と表の後の段落） / 指摘: 表の前の文が「基準値は「操作性要件一覧」を参照する。」だけで、何の表かを示していなかった。被験者の選び方は全テストの前提なのに、表の後に結論（pass/fail）と並べて置かれていた。 / 直した案: 表の前を「次の表に、要件 ID ごとの測定方法・判定タイミング・判定者を示す。基準値は「操作性要件一覧」を参照し、ユーザビリティテストの被験者は本システムの開発に関わっていない人から選ぶ。」にし、表の後は pass/fail と測り直しの文だけを残した（sample に反映済み） / 根拠: Sample 記述標準（sample-authoring-standard）の「表の前に、何と何の対応を示す表か…を 1 文で書く」、kata-guide の R2「前提から結論の順に読めるか」、vp-arc-document-structure / 印: なし
- No: 2 / 段: R2 / 箇所: 関連ドキュメント導線（表の前の段落） / 指摘: 表の前に、変更時の見直しの段落（「受入条件と総合テストの行の文書を見直す」）が置かれていた。この段落はまだ読んでいない表の行を指し、何の表かを示す 1 文もなかった。 / 直した案: 表の前を「次の表に、本書の参照先と参照する目的を示す。」にし、見直しの段落は表の後へ移した（sample に反映済み） / 根拠: Sample 記述標準の表の前の 1 文の規定、kata-guide の R2「前提から結論の順」、vp-arc-document-structure / 印: なし
- No: 3 / 段: R2 / 箇所: 適用範囲・利用者前提の 3 つ目の箇条書き（店主代表の文字サイズ、旧 43 行目） / 指摘: 「熟練利用者の測定も同じ端末・同じ文字サイズの設定で行う」は測定の条件とも読め、測定・検証方法に移す余地がある。一方、rulebook の「記述ガイド」の適用範囲・利用者前提の判断基準は「基準値がどの利用者・環境で成り立つか」で、利用環境の前提とも読める。 / 直した案: 今回は移さなかった。測定の手順として扱う場合は、測定・検証方法の表の前の文へ移す / 根拠: nfr-usability-rulebook の「記述ガイド」の適用範囲・利用者前提と測定・検証方法の判断基準 / 印: 要判断
- No: 4 / 段: R2 / 箇所: grade の finding F001（関連ドキュメント導線の `sac-store-sales`） / 指摘: R1 が直した版では、目的の列に「（未作成）」がすでに明示されていて、指摘は解消済みだった / 直した案: 変更なし / 根拠: 現在の sample の関連ドキュメント導線の表の受入条件の行 / 印: なし
- No: 5 / 段: R2 / 箇所: grade の finding F002（測定・検証方法の判定者列の「利用者代表」） / 指摘: 観点 `vp-ux-language-consistency` は R3 の観点のため、この段では扱わず R3 に任せる / 直した案: 変更なし（R3 で Role code の表記を判断する） / 根拠: kata-guide の「kata の観点の組」 / 印: なし
- rulebook 側の申し送り: nfr-usability-rulebook の frontmatter で `template` が `undecided` のため、R2 は template と照合できず、rulebook の本文要件だけで構成を確かめた。template を作るときは、各章の表の前の 1 文の置き方を sample に合わせる案を出す。
- 適用外の検証: `npm run validate:history-links`（変更は sample だけで、plan・result・個票などの履歴蓄積ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

R2 の観点（章の順・粒度・表と本文の配置、前提から結論の順）で、Sample 記述標準と kata-guide の R2、および `nfr-usability-rulebook` の本文要件を根拠に構成を確認した。章の移動・分割・統合は不要と判断し、表の前の 1 文の欠落と、前提・結論の配置だけを直した。rulebook など sample 以外は変更していない。F001 は現在の sample ですでに解消済みだった。F002 は観点 `vp-ux-language-consistency` が R3 の観点のため、R3 に任せた。
