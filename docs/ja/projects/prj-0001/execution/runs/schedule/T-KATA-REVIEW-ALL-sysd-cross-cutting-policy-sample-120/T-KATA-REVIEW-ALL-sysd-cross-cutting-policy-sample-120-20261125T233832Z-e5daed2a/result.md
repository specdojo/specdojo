---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-cross-cutting-policy-sample-120-20261125t233832z-e5daed2a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-120/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-120-20261125T233832Z-e5daed2a/plan.md
  started_at: "2026-11-25T23:38:43.409Z"
  completed_at: "2026-11-25T23:47:06.345Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-cross-cutting-policy-sample
    - specdojo:sysd-cross-cutting-policy-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として sample を template と rulebook の本文構成に照らして見直し、見出し 2 か所と表 1 つを直した。
- 「## 4.」の見出しを template どおり「例外と判断記録」に変更した。
- 「## 5.」の見出しを「関連ドキュメント導線」に変更し、grade の F001（略語が文書名に対応しない）を解消した。
- 「5.1. 正本と運用への入口」の表を template の 5 区分（システム設計・重要フロー／非機能要件／運用設計・手順／テスト／判断記録）で組み直した。
- 「6.1」表の「判断者・担当」列は template にない列で、要判断として未反映のまま残した。「2.1」表の「担当」列は維持した。
- 検査は、変更した sample への整形と markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | sample「## 4.」見出し | 見出し「例外（DECリンク）」が template の「例外と判断記録」と異なり、略語 DEC が文書名に対応していない。 | 見出しを「## 4. 例外と判断記録」に変更した。 | `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md` 58 行、rulebook「本文要件」の「見出し順・表の骨組みは template を正」。 | 直した |
| 2 | R2 | sample「## 5.」見出し（grade F001） | 見出しの略語（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）が参照表の文書名と対応せず、template の見出しとも異なる。 | 見出しを「## 5. 関連ドキュメント導線」に変更し、F001 を解消した。 | template 77 行、rulebook「6.5. 関連導線」の「呼称は参照先の文書名に揃える」。 | 直した |
| 3 | R2 | sample「5.1. 正本と運用への入口」の表 | 「設定・契約・検証」の行に設計索引とテスト計画、「非機能・運用」の行に実行制約と運用手順が混ざり、template の 5 区分で追従先を選べない。 | template の 5 区分で行を組み直した。clis-sample・ifx-cmd-sample・`kinuya-system-design-index` はシステム設計・重要フロー、`kinuya-execution-policy` は非機能要件、`kinuya-log-policy`・`kinuya-recovery-procedure` は運用設計・手順、`kinuya-sales-test-plan` はテスト、`kinuya-register`・`kinuya-decision-log`・`kinuya-sales-schedule` は判断記録に置いた。 | template 83〜89 行、rulebook「本文要件」の関連導線の行。 | 直した |
| 4 | R2 | sample「6.1. 判断待ちと後続への影響」の表の「判断者・担当」列 | template の表にこの列はなく、template の注記は「判断者と承認の進み具合は登録簿の個票で追う」としている。 | 列を削り、判断者を「次アクションと解消条件」の列へ移す（例: Q-K1 に「PO が判断」を足す）。または完成例として列を残す。 | template 101〜105 行。 | 要判断 |
| 5 | R2 | sample「2.1. 適合確認の順序と時機」の表の「担当」列 | template にない列だが、rulebook は禁じておらず、確認群ごとの担当が読める。 | 維持した。 | template 41 行、rulebook「6.2. ルール一覧」の「適合状況・確認時機は別表へ分けてもよい」。 | 維持 |
| 6 | R2 | 成果物 `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md` の 23・294・311 行 | 成果物は旧見出し「例外（DECリンク）」「関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）」のままで、23 行は「例外（DECリンク）」という章名で例外の章を参照している。 | 成果物の見出しと 23 行の章名の参照を template どおり「例外と判断記録」「関連ドキュメント導線」へ揃える（本タスクの範囲外のため未変更）。 | template 58・77 行。 | 相手側を直す案 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`: 見出し「例外（DECリンク）」を「例外と判断記録」へ、「関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）」を「関連ドキュメント導線」へ変更した（F001 解消）。5.1 の表を template の 5 区分で組み直した。

## 3. 申し送り

- 指摘 No.4 は要判断のまま未反映である。「6.1」表の「判断者・担当」列を削って判断者を「次アクションと解消条件」へ移すか、完成例として列を残すかを人が決める。
- 指摘 No.6 の成果物 `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md` は旧見出しのままで、本タスクの範囲外のため未変更である。見出しと 23 行の章名参照を揃える別作業が必要になる。
- No: 1 / 段: R2 / 箇所: sample「## 4.」見出し / 指摘: 見出し「例外（DECリンク）」が template の「例外と判断記録」と異なり、略語 DEC が文書名に対応していない / 直した案: 見出しを「## 4. 例外と判断記録」に変更（sample に反映済み） / 根拠: `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md` 58 行、rulebook「本文要件」の「見出し順・表の骨組みは template を正」 / 印: 直した
- No: 2 / 段: R2 / 箇所: sample「## 5.」見出し（旧 158 行、grade F001） / 指摘: 見出し「関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）」の略語が参照表の文書名と対応せず、template の見出しとも異なる / 直した案: 見出しを「## 5. 関連ドキュメント導線」に変更し、F001 を解消（sample に反映済み） / 根拠: template 77 行、rulebook「6.5. 関連導線」の「呼称は参照先の文書名に揃える」 / 印: 直した
- No: 3 / 段: R2 / 箇所: sample「5.1. 正本と運用への入口」の表 / 指摘: 「設定・契約・検証」の行に設計索引とテスト計画、「非機能・運用」の行に実行制約と運用手順が混ざり、template の 5 区分（システム設計・重要フロー／非機能要件／運用設計・手順／テスト／判断記録）で追従先を選べない / 直した案: template の 5 区分で行を組み直した。clis-sample・ifx-cmd-sample・`kinuya-system-design-index` はシステム設計・重要フロー、`kinuya-execution-policy` は非機能要件、`kinuya-log-policy`・`kinuya-recovery-procedure` は運用設計・手順、`kinuya-sales-test-plan` はテスト、`kinuya-register`・`kinuya-decision-log`・`kinuya-sales-schedule` は判断記録に置いた（sample に反映済み） / 根拠: template 83〜89 行、rulebook「本文要件」の関連導線の行 / 印: 直した
- No: 4 / 段: R2 / 箇所: sample「6.1. 判断待ちと後続への影響」の表の「判断者・担当」列 / 指摘: template の表にこの列はなく、template の注記は「判断者と承認の進み具合は登録簿の個票で追う」としている / 直した案: 列を削り、判断者を「次アクションと解消条件」の列へ移す（例: Q-K1 に「PO が判断」を足す）。または完成例として列を残す / 根拠: template 101〜105 行 / 印: 要判断（未反映）
- No: 5 / 段: R2 / 箇所: sample「2.1. 適合確認の順序と時機」の表の「担当」列 / 指摘: template にない列だが、rulebook は禁じておらず、確認群ごとの担当が読める / 直した案: 維持 / 根拠: template 41 行、rulebook「6.2. ルール一覧」の「適合状況・確認時機は別表へ分けてもよい」 / 印: 維持
- No: 6 / 段: R2 / 箇所: 成果物 `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md` の 23・294・311 行 / 指摘: 成果物は旧見出し「例外（DECリンク）」「関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）」のままで、23 行は「例外（DECリンク）」という章名で例外の章を参照している / 直した案: 成果物の見出しと 23 行の章名の参照を template どおり「例外と判断記録」「関連ドキュメント導線」へ揃える（本タスクの範囲外のため未変更） / 根拠: template 58・77 行 / 印: 相手側を直す案
- 適用外の検証: `npm run validate:history-links`（変更は sample だけで、plan・result・個票などの履歴蓄積ファイルは変更していない）

## 4. 進め方と実践の型の適用

grade の F001 と、rulebook「6.5. 関連導線」・「本文要件」・template の見出し順と表の骨組みを根拠に、sample を修正した。見出しと 5.1 の表は rulebook と template を正として揃えた。template にない「2.1」の担当列は rulebook が禁じていないため維持した。判断が分かれる「6.1」の列は推測で改訂せず申し送った。F001 は見出しの変更で解消した。
