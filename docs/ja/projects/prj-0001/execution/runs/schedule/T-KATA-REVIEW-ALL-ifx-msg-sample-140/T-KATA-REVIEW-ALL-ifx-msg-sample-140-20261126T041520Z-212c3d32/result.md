---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-msg-sample-140-20261126t041520z-212c3d32
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-msg-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-msg-sample-140/T-KATA-REVIEW-ALL-ifx-msg-sample-140-20261126T041520Z-212c3d32/plan.md
  started_at: "2026-11-26T04:15:30.597Z"
  completed_at: "2026-11-26T04:19:04.936Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-msg-sample
    - specdojo:ifx-msg-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、ifx-msg-sample.yaml の主張を AsyncAPI 2.6.0 の仕様と ifx-msg-rulebook に突き合わせ、誤り 2 件を直した。
- `source` と `subject` の Schema で使っていた `example` は AsyncAPI 2.6.0 の Schema Object にない語だったため、仕様にある `examples`（配列）へ改めた。
- 互換を壊す変更の版の上げ方は、rulebook の「版と改訂」に合わせて `info.version` の MAJOR と `type` の版を上げる記述にした。
- grade の F001・F002・F003 は前の段までの手直しで解消済みだった。F004（ifx-index-sample に連携の行がない）は kata の整合の観点で、R4 の観点ではないため扱う段に任せた。
- AsyncAPI CLI の `validate` は sandbox で実行できず、構造の確かめは人の確認に残した。
- 検証は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。executor の prettier も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | docs/ja/specdojo/samples/ifx-msg-sample.yaml 88 行目付近の `source`、92 行目付近の `subject` | AsyncAPI 2.6.0 の Schema Object にない `example` を使っていたため、検証器が無視して例が仕様に載らなかった。 | 仕様にある `examples`（配列）へ直した。 | AsyncAPI 2.6.0 仕様の Schema Object。JSON Schema から取り込む語の一覧にあるのは `examples` だけ。 | minor |
| 2 | R4 | docs/ja/specdojo/samples/ifx-msg-sample.yaml 18 行目 | 互換を壊す変更で `type` の版だけを上げると書いていて、rulebook が定める `info.version` の MAJOR の更新が抜けていた。 | 「`info.version` の MAJOR と `type` の版（`.v1`）を上げる」に直した。 | ifx-msg-rulebook の「版と改訂」。矛盾するため rulebook を正とした。 | minor |
| 3 | R4 | docs/ja/specdojo/samples/ifx-msg-sample.yaml 2 行目 | AsyncAPI CLI の `validate` による構造の確かめを、sandbox に `@asyncapi/cli` がないため実行できなかった。 | ready にする前に、人が `asyncapi validate docs/ja/specdojo/samples/ifx-msg-sample.yaml` を実行し、結果を実行記録に残す。 | executor evidence の validations で `requires_human` になっている。 | 要確認 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-msg-sample.yaml`: `source` と `subject` の `example` を、AsyncAPI 2.6.0 にある `examples`（配列）に直した。互換を壊す変更の版の上げ方も、rulebook に合わせて `info.version` の MAJOR と `type` の版（`.v1`）を上げる記述にした。変更は 3 行の追加と 3 行の削除。

## 3. 申し送り

- F004 は ifx-index-sample に在庫変更通知の行を足すか、rulebook に sample の例外を記す対応が要る。kata の整合を扱う段に任せる。
- [minor/R4] ifx-msg-sample.yaml の `source`（88 行目付近）と `subject`（92 行目付近）で使っていた `example` は、AsyncAPI 2.6.0 の Schema Object にない語のため、検証器が無視して例が仕様に載らなかった。仕様にある `examples`（配列）へ直した。根拠: AsyncAPI 2.6.0 仕様の Schema Object（JSON Schema から取り込む語の一覧にあるのは `examples` だけ）。
- [minor/R4] ifx-msg-sample.yaml の 18 行目は、互換を壊す変更で `type` の版だけを上げると書いていた。ifx-msg-rulebook の「版と改訂」は `info.version` の MAJOR も上げると定めるため、rulebook を正として「`info.version` の MAJOR と `type` の版（`.v1`）を上げる」に直した。
- [要確認/R4] 2 行目の AsyncAPI CLI の `validate` による構造の確かめは、sandbox に `@asyncapi/cli` がないため実行していない。ready にする前に、人が `asyncapi validate docs/ja/specdojo/samples/ifx-msg-sample.yaml` を実行し、結果を実行記録に残す。
- [申し送り] grade の F001・F002・F003 は前の段までの手直しで解消済みだった。F004（ifx-index-sample に連携の行がない）は kata の整合の観点で、R4 の観点ではないため扱う段に任せる。
- 適用外の検証: `npm run validate:schema:file`（対象の YAML は先頭行に `specdojo-schema: none reason=external-asyncapi` があり、SpecDojo の schema が対応しないため）
- 人の確認が必要: `asyncapi validate docs/ja/specdojo/samples/ifx-msg-sample.yaml`（AsyncAPI CLI は依存になく、sandbox で実行できない。人が AsyncAPI 2.6.0 に対応した検証器で構造を確かめる）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿った。sample の事実を AsyncAPI 2.6.0 の Schema Object と ifx-msg-rulebook の「版と改訂」に突き合わせ、不一致だった 2 件を直した。矛盾したときは rulebook を正とした。確かめの結果は 13 件で、一致が 10、不一致で修正が 2、確かめられないものが 1 だった。確かめられなかった 1 件は AsyncAPI CLI による構造検証で、人の確認に残した。grade の F001〜F003 は解消済みで、F004 は R4 の観点ではないため見送った。
