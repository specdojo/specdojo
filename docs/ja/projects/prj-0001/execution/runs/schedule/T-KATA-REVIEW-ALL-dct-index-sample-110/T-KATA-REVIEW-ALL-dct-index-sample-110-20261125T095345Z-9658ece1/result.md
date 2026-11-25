---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dct-index-sample-110-20261125t095345z-9658ece1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dct-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dct-index-sample-110/T-KATA-REVIEW-ALL-dct-index-sample-110-20261125T095345Z-9658ece1/plan.md
  started_at: "2026-11-25T09:53:54.602Z"
  completed_at: "2026-11-25T10:09:44.976Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:dct-index-sample
    - specdojo:dct-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。`docs/ja/specdojo/samples/dct-index-sample.yaml` について、種別の責務と rulebook の目的に照らして過不足を確かめた。
- 指摘は 2 件。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 目的の過不足 | `dct-index-sample.yaml` 先頭コメントの 5〜6 行目（「単一店舗・タブレット1台で…」「EC、本格会計、仕入れ先とのシステム連携は対象外。本部 API を使う CLI 固有の拡張例は含めない。」） | 共通サンプル文脈の前提条件の繰り返しで、索引の目的（分類・表示順・表示名・概要・`size`）の判断に使われていない。本部 API の一文はこの sample の主題と無関係。 | 2 行を削除した。共通サンプル文脈を指す 4 行目のコメントは残した。 | `specdojo:dct-index-rulebook` の「全体方針」（索引のドメインは実在する `dct-*.yaml` と一致させる）、`specdojo:sample-authoring-standard` の「サンプル群の目的」、`vp-arc-conciseness`（正本の再掲） | 要判断（`T-KATA-WAVE-1-dct-index-050` で意図的に加えられた行のため。対象外ドメインがない理由を残したい場合は元に戻す） | | 2 | R1 目的の過不足 | sample 全体 | 足すべき内容はない。必須キーはそろっている。`size` の判断理由、分割ファイルを 1 ドメインにまとめる `_ASSUMPTION_`、配列順は Schedule と無関係である旨の注記、所属理由の注記、他カタログの `_ASSUMPTION_` は rulebook の判断の例として必要なため残した。 | 変更なし | `specdojo:dct-index-rulebook` の「本文要件」「記述ガイド」、`dct-kata.yaml` の `done_criteria` | なし |
- 検証は schema 検査と Prettier が通り、runner の lint・schema・docs テストも通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dct-index-sample.yaml`: 先頭コメントのうち、共通サンプル文脈の前提条件を繰り返していた 2 行を削除した（単一店舗・タブレット1台などの前提、EC・本格会計・仕入れ先連携・本部 API が対象外である旨）。キー構成と本文の判断例は変更していない。

## 3. 申し送り

- rulebook など sample 以外の文書は変更していない。No.1 は「要判断」である。対象外ドメインがない理由を残したい場合は、削除した 2 行を戻す。
- No: 1 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/dct-index-sample.yaml の先頭コメント 5〜6 行目（「単一店舗・タブレット1台で…」「EC、本格会計、仕入れ先とのシステム連携は対象外。本部 API を使う CLI 固有の拡張例は含めない。」） / 指摘: 共通サンプル文脈の前提条件をそのまま繰り返している。索引の目的（分類・表示順・表示名・概要・`size`）の判断にも使われていない。本部 API の一文はこの sample の主題に関係がない / 直した案: 2 行を削除し、共通サンプル文脈を指す 4 行目のコメントは残した / 根拠: [[specdojo:dct-index-rulebook]] の「全体方針」で、索引のドメインは実在する `dct-*.yaml` と一致させるもので、対象範囲から選ばない。[[specdojo:sample-authoring-standard]] の「サンプル群の目的」は記述を対象文書の説明に要る範囲に限るよう求める。`vp-arc-conciseness`（正本の再掲） / 印: 要判断（`T-KATA-WAVE-1-dct-index-050` でわざと加えられた行のため。対象外のドメインがない理由を残したい場合は元に戻す）
- No: 2 / 段: R1 目的の過不足 / 箇所: sample 全体 / 指摘: 足すべき内容はない。必須キー（`id`・`type`・`status`・`rulebook`・`title`・`size`・`groups`、ドメインの `domain`→`name`→`overview` の順）はそろっている。`size` の判断理由、分割ファイルを 1 ドメインにまとめる `_ASSUMPTION_`、配列順は Schedule と関係ないことの注記、どちらの分類にも当てはまりそうなドメインの所属理由、同梱されていない他カタログの `_ASSUMPTION_` は rulebook の判断の例として要るので残した / 直した案: 変更なし / 根拠: [[specdojo:dct-index-rulebook]] の「本文要件」「記述ガイド」、dct-kata.yaml の `done_criteria` / 印: なし

## 4. 進め方と実践の型の適用

sample-maintenance の R1 として、`dct-index-rulebook`、`sample-authoring-standard`、`vp-arc-conciseness` を根拠に、足す内容と削る内容を確かめた。plan に展開された grade の finding と condense の finding はなかった。足すべき内容はなく、正本の再掲に当たる先頭コメント 2 行だけを削った。rulebook との矛盾はなかった。判断根拠は要約表のとおり。
