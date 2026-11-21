---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-index-sample-080-20261121t103040z-e6566597
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-index-sample-080/T-KATA-WAVE-3-utc-index-sample-080-20261121T103040Z-e6566597/plan.md
  started_at: "2026-11-21T10:30:41.593Z"
  completed_at: "2026-11-21T10:35:51.615Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:utc-index-sample
  condense_records:
    - location: 「ケース表の共通カラム」導入文
      category: canonical-restatement
      action: reference
      reason: rulebook の10カラム名の列挙を消し、rulebook と直後の記入例の表への参照に置き換えた。カラムの数・順序・必須であることは参照先に残るので、意味は変わらない
      cause:
        type: document
    - location: 「本ドキュメントの目的と適用対象」最終段落（合否判定）
      category: canonical-restatement
      action: retain
      reason: 受け入れ基準と判定者（CI ジョブで失敗0件・DEV が判定）を書いた唯一の場所で、判定に必要なため
      cause:
        type: document
    - location: 「テスト対象の括り方と分割基準」の箇条書き「画面の部品では切らない」
      category: canonical-restatement
      action: retain
      reason: rulebook の規則を本システムの具体的な部品と代わりのテストレベル（総合テスト）に当てはめた判断のため
      cause:
        type: document
    - location: 「対象外・除外理由（共通）」表の後の一文
      category: table-prose
      action: retain
      reason: 例外をどのカラム（境界/依存）に書くかという、表にない記入先の決定を示すため
      cause:
        type: document
    - location: 「観点の立て方（共通）」表の後の段落（受領額60円の例）
      category: table-prose
      action: retain
      reason: 命名規則を本システムに当てはめた統合例で、表の内容とは重なっていないため
      cause:
        type: document
    - location: 「条件の立て方（共通）」表の後の段落（追加順）
      category: canonical-restatement
      action: retain
      reason: BAC-01 の C-01・C-02 という具体的な条件と、全組合せは作らないという制約を示すため
      cause:
        type: document
    - location: 「観点/条件の採用基準と対象別への分配方針（共通）」冒頭段落
      category: table-prose
      action: retain
      reason: 表の採用理由・主担当がどの基準で決まったかを示す根拠で、表だけでは読み取れないため
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- utc-index-sample の冗長箇所1件（ケース表の共通カラムで rulebook の10カラム名を再掲していた箇所）を参照に置き換え、ほかの候補6件は判断情報として残しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: 「ケース表の共通カラム」導入文における rulebook のカラム名の再掲を削除し、rulebook および直後の表への参照に置き換えました。

## 3. 申し送り

- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples 配下の sample だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` はない）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/specdojo/ 配下だけで、docs/ja/projects/ には及ばない）

## 4. 進め方と実践の型の適用

対象文書内の冗長な記述を整理し、既存の正本（`rulebook`）への参照に置き換えることで、情報の重複を排除しました。判断に要する重要な背景や制約については、意味を維持するために保持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `「ケース表の共通カラム」導入文` | `canonical-restatement` | `reference` | `rulebook の10カラム名の列挙を消し、rulebook と直後の記入例の表への参照に置き換えた。カラムの数・順序・必須であることは参照先に残るので、意味は変わらない` | `document` |
| `「本ドキュメントの目的と適用対象」最終段落（合否判定）` | `canonical-restatement` | `retain` | `受け入れ基準と判定者（CI ジョブで失敗0件・DEV が判定）を書いた唯一の場所で、判定に必要なため` | `document` |
| `「テスト対象の括り方と分割基準」の箇条書き「画面の部品では切らない」` | `canonical-restatement` | `retain` | `rulebook の規則を本システムの具体的な部品と代わりのテストレベル（総合テスト）に当てはめた判断のため` | `document` |
| `「対象外・除外理由（共通）」表の後の一文` | `table-prose` | `retain` | `例外をどのカラム（境界/依存）に書くかという、表にない記入先の決定を示すため` | `document` |
| `「観点の立て方（共通）」表の後の段落（受領額60円の例）` | `table-prose` | `retain` | `命名規則を本システムに当てはめた統合例で、表の内容とは重なっていないため` | `document` |
| `「条件の立て方（共通）」表の後の段落（追加順）` | `canonical-restatement` | `retain` | `BAC-01 の C-01・C-02 という具体的な条件と、全組合せは作らないという制約を示すため` | `document` |
| `「観点/条件の採用基準と対象別への分配方針（共通）」冒頭段落` | `table-prose` | `retain` | `表の採用理由・主担当がどの基準で決まったかを示す根拠で、表だけでは読み取れないため` | `document` |
