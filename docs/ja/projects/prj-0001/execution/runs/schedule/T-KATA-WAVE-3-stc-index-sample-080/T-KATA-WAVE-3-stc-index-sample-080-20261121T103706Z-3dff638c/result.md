---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-stc-index-sample-080-20261121t103706z-3dff638c
  type: exec-result
  task_id: T-KATA-WAVE-3-stc-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-stc-index-sample-080/T-KATA-WAVE-3-stc-index-sample-080-20261121T103706Z-3dff638c/plan.md
  started_at: "2026-11-21T10:37:07.577Z"
  completed_at: "2026-11-21T10:42:34.262Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:stc-index-sample
  condense_records:
    - location: 観点の立て方（共通） 末尾の文「「操作性が良いこと」のように条件を作れない観点は立てず、AT の観点として扱う。」
      category: repetition
      action: reference
      reason: 「対象外・除外理由（共通）」の AT 行（画面の分かりやすさ・説明なしでの操作完了→AT）と同じ主張のため、その章への参照に置き換えた。観点を立てない判断と AT に委ねる内容は保った
      cause:
        type: document
    - location: 本ドキュメントの目的と適用対象 のレベル境界表（UT・IT / ET / AT）
      category: repetition
      action: retain
      reason: rulebook の記述ガイドが求める他のテストレベルとの境界で、対象外の表とは役割が違う必須情報のため残した
      cause:
        type: document
    - location: テスト対象の括り方と分割基準 の導入文（業務/価値境界→境界横断→データ境界→運用境界）と末尾の分割再検討基準
      category: canonical-restatement
      action: retain
      reason: 表の判断がこの順序で行われたことを示し、再検討の分割軸をデータ境界に絞るという固有の判断を含むため残した
      cause:
        type: document
    - location: 観点/条件の採用基準と対象別への分配方針（共通） 末尾「主担当を複数置く場合は…理由のない重複は差し戻す。」
      category: canonical-restatement
      action: retain
      reason: stc-term の担当者に向けた共通規則で、差し戻すというこのプロジェクトのレビュー時の扱いを含むため残した
      cause:
        type: document
    - location: ケース表の共通カラム 末尾「期待値に「正常に処理される」とだけ書いたケースは、QE がレビューで差し戻す。」
      category: canonical-restatement
      action: retain
      reason: 禁止事項の再掲に近いが、QE がレビューで差し戻すという運用上の責任を定めているため残した
      cause:
        type: document
    - location: 対象外・除外理由（共通） の通信不能時の販売継続の行と、メモ / 将来課題 の _UNDECIDED_ の行
      category: repetition
      action: retain
      reason: 前者は rulebook が必須とする例外条件（いつ・どの条件で扱うか）、後者は分配表への主担当の割り当てを含む見直し方針で、役割が違うため残した
      cause:
        type: document
    - location: 条件の立て方（共通） 末尾の直積を作らない理由「（在庫の判定は店番の役割で変わらないため）」
      category: unneeded-background
      action: retain
      reason: rulebook が直積を作らない場合に理由を書くよう求めており、判断に要る理由のため残した
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 「観点の立て方（共通）」末尾における、AT への委ねに関する主張の重複を「対象外・除外理由（共通）」への参照に置き換えました（1 件）。
- その他の 6 件の候補（境界表、分割基準、担当者への規則、QE の差し戻し運用、例外条件、直積を作らない理由）については、判断や運用のための必須情報として保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: 「観点の立て方（共通）」の末尾にあった、AT（Acceptance Test）へ委ねる旨の記述を、「対象外・除外理由（共通）」への参照に置き換えて冗長さを解消しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/stc-index-sample.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ に及ばないため）

## 4. 進め方と実践の型の適用

対象文書の冗長さを削り、意味と必須情報を維持したまま、参照による簡略化を行いました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `観点の立て方（共通） 末尾の文「「操作性が良いこと」のように条件を作れない観点は立てず、AT の観点として扱う。」` | `repetition` | `reference` | `「対象外・除外理由（共通）」の AT 行（画面の分かりやすさ・説明なしでの操作完了→AT）と同じ主張のため、その章への参照に置き換えた。観点を立てない判断と AT に委ねる内容は保った` | `document` |
| `本ドキュメントの目的と適用対象 のレベル境界表（UT・IT / ET / AT）` | `repetition` | `retain` | `rulebook の記述ガイドが求める他のテストレベルとの境界で、対象外の表とは役割が違う必須情報のため残した` | `document` |
| `テスト対象の括り方と分割基準 の導入文（業務/価値境界→境界横断→データ境界→運用境界）と末尾の分割再検討基準` | `canonical-restatement` | `retain` | `表の判断がこの順序で行われたことを示し、再検討の分割軸をデータ境界に絞るという固有の判断を含むため残した` | `document` |
| `観点/条件の採用基準と対象別への分配方針（共通） 末尾「主担当を複数置く場合は…理由のない重複は差し戻す。」` | `canonical-restatement` | `retain` | `stc-term の担当者に向けた共通規則で、差し戻すというこのプロジェクトのレビュー時の扱いを含むため残した` | `document` |
| `ケース表の共通カラム 末尾「期待値に「正常に処理される」とだけ書いたケースは、QE がレビューで差し戻す。」` | `canonical-restatement` | `retain` | `禁止事項の再掲に近いが、QE がレビューで差し戻すという運用上の責任を定めているため残した` | `document` |
| `対象外・除外理由（共通） の通信不能時の販売継続の行と、メモ / 将来課題 の _UNDECIDED_ の行` | `repetition` | `retain` | `前者は rulebook が必須とする例外条件（いつ・どの条件で扱うか）、後者は分配表への主担当の割り当てを含む見直し方針で、役割が違うため残した` | `document` |
| `条件の立て方（共通） 末尾の直積を作らない理由「（在庫の判定は店番の役割で変わらないため）」` | `unneeded-background` | `retain` | `rulebook が直積を作らない場合に理由を書くよう求めており、判断に要る理由のため残した` | `document` |
