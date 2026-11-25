---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-raci-sample-120-20261125t225406z-dfdffa89
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-raci-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-raci-sample-120/T-KATA-REVIEW-ALL-pm-raci-sample-120-20261125T225406Z-dfdffa89/plan.md
  started_at: "2026-11-25T22:54:16.904Z"
  completed_at: "2026-11-25T23:01:55.813Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-raci-sample
    - specdojo:pm-raci-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として pm-raci-sample を確認した。章の順・粒度は template と一致しており、章の移動・分割・統合は不要と判断した。
- 成果物表の後にあった `A` の判断範囲の段落を、判断・プロセス別 RACI の注記へ移した。重なりの説明が 2 か所に分かれていた状態を解消した。
- 不一致時の更新先の表の列名を template に合わせた。
- F001 は R1 が対象 ID 列を足して解消済みのため、R2 では繰り返していない。
- 検査は executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. 成果物別 RACI・3. 判断・プロセス別 RACI / 成果物表の後の段落 | 品質計画・試験結果とリリース候補の `A` の判断範囲を説明する段落が、「次表で決める」と先の表を指していた。rulebook の記述ガイドは、成果物行と重なる場合の各 `A` の判断範囲を判断表の側で明記するよう求めており、重なりの説明が 2 か所に分かれていた。 | 段落を「判断・プロセス別 RACI」の注記の 2 項目めへ移し、「利用開始の可否は本表の判断行で決める。」と書き換えた。 | `vp-arc-document-structure`（rulebook 6.3 の判断基準） | - |
| R2-2 | R2 | 4.2. 不一致時の更新先 / 表の列名 | 表の列名「更新する正本」が template の「更新する正本と確認」と食い違っていた。3 行めのセルは確認（組織定義を確かめる）も含んでいる。 | 列名を「更新する正本と確認」にした。 | `vp-qe-omissions-consistency`（template の 4.2 の表） | - |
| R2-3 | R2 | 2. 成果物別 RACI・4.1. 主担当と照合先 | template の「成果物別 RACI」の `_TODO_` は、複数 `R` の行（リリース候補）に主担当と担当範囲を注記するよう求める。rulebook は同じ要求を記述ガイド「Schedule・実行主体との対応」に置いている。sample は 4.1 の表で PM・DEV の担当範囲を注記しており、要求を満たしている。 | sample は変更しない。template の「成果物別 RACI」の `_TODO_` から複数 `R` の注記を外して 4.1 へ移し、rulebook 6.4 にそろえる。または rulebook 側を template にそろえる。 | `vp-arc-document-structure`。迷った理由: template に従って成果物表にも注記を足すと 4.1 と二重になり、`vp-arc-conciseness` に反する。選ばなかった案は成果物表への注記の追加。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-raci-sample.md`: 成果物表の後にあった品質計画・試験結果とリリース候補の `A` の判断範囲の段落を、判断・プロセス別 RACI の注記の 2 項目めへ移し、「利用開始の可否は本表の判断行で決める。」と書き換えた。4.2 の表の列名「更新する正本」を template に合わせて「更新する正本と確認」にした。

## 3. 申し送り

- R2-3 は要判断として残している。template の「成果物別 RACI」の `_TODO_` と rulebook 6.4 で、複数 `R` の注記の置き場所が食い違っている。
- R2-1: R2 / 2. 成果物別 RACI・3. 判断・プロセス別 RACI / 成果物表の後の段落が、品質計画・試験結果とリリース候補の `A` の判断範囲を説明し、「次表で決める」と先の表を指していた。rulebook の記述ガイド「判断・プロセス別 RACI」は、成果物行と重なる場合の各 `A` の判断範囲を判断表の側で明記するよう求めており、重なりの説明が 2 か所に分かれていた / 段落を「判断・プロセス別 RACI」の注記の 2 項目めへ移し、「利用開始の可否は本表の判断行で決める。」と書き換えた / `vp-arc-document-structure`（rulebook 6.3 の判断基準） / -
- R2-2: R2 / 4.2. 不一致時の更新先 / 表の列名「更新する正本」が template の「更新する正本と確認」と食い違っていた。3 行めのセルは確認（組織定義を確かめる）も含んでいる / 列名を「更新する正本と確認」にした / `vp-qe-omissions-consistency`（template の 4.2 の表） / -
- R2-3: R2 / 2. 成果物別 RACI・4.1. 主担当と照合先 / template の「成果物別 RACI」の `_TODO_` は複数 `R` の行（リリース候補）に主担当と担当範囲を注記するよう求めるが、rulebook は同じ要求を記述ガイド「Schedule・実行主体との対応」に置いている。sample は 4.1 の表で PM・DEV の担当範囲を注記して要求を満たしている / -（sample は変更しない） / `vp-arc-document-structure`。迷った理由: template に従って成果物表にも注記を足すと 4.1 と二重になり `vp-arc-conciseness` に反する。選ばなかった案は成果物表への注記の追加。相手側を直す案: template の「成果物別 RACI」の `_TODO_` から複数 `R` の注記を外して 4.1 へ移し、rulebook 6.4 にそろえる（または rulebook 側を template にそろえる） / 要判断
- F001（grade、R1 の範囲）: R1 が「対象 ID」列を足して解消済み。R2 では扱わない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票などの履歴蓄積ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は rulebook の記述ガイドと判断基準、template の本文構成、`vp-arc-document-structure`、`vp-qe-omissions-consistency`、`vp-arc-conciseness` である。構成が整合する箇所は維持し、重なりの説明と列名の不一致だけを直した。rulebook と template の食い違い（R2-3）は sample を変更せず、直す案を指摘に残した。F001 は R1 の対象 ID 列の追加で解消済みと確認した。
