---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-cmd-sample-130-20261126t143346z-bb88d255
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-cmd-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-cmd-sample-130/T-KATA-REVIEW-ALL-ifx-cmd-sample-130-20261126T143346Z-bb88d255/plan.md
  started_at: "2026-11-26T14:33:57.472Z"
  completed_at: "2026-11-26T14:38:58.872Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-cmd-sample
    - specdojo:ifx-cmd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/ifx-cmd-sample.yaml` の文を直した。意味と判断に要る背景・例外・制約は変えていない。
- grade の F002 に対応し、結果不明時に紙面を確かめる人の呼び名を「店番担当」に統一した。
- 主語の補い、指示語の置き換え、長い文の分割、`meaning` の文末の句点そろえを行った。
- grade の F001 は R2 の観点のため、この段では扱っていない。
- schema 検査と Prettier の検査は通った。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | `exit_codes`（code 1 `permanent_failure`）、`execution.idempotency.condition`、`error_handling.retry` のコメント | 結果不明時に紙面を確かめる人を「店頭利用者」「利用者」と呼んでおり、お客様とも読める。関連する sample の「店番担当」と表記がゆれている。 | 3 か所を「店番担当」に統一した。 | `vp-ux-language-consistency`、W8（grade F002） | - |
| R3-2 | R3 | `exit_codes`（code 1 `transient_failure`、`permanent_failure`）、code 5、`error_handling.retry` のコメント | 「自動再試行する」「再試行しない」「自動起動を止め」の主語がない。 | 主語の「呼び出し元は」と、権限を直す主体の「開発担当が」を補った。 | W1 | - |
| R3-3 | R3 | `exit_codes`（code 1 `permanent_failure`） | 「上記の送信前失敗」が指す先が、配列の前の要素にしか書かれていない。 | 「送信前のビジー状態」に置き換えた。 | W4 | - |
| R3-4 | R3 | `files.inputs[0].description` | パスの基準と可変部の解決を 1 文に詰めた長い文になっている。 | 「基準とする。」で 2 文に分けた。 | W3 | - |
| R3-5 | R3 | `exit_codes` の `meaning` | 複数の文からなる `meaning` で、文末に句点があるものとないものが混ざっている。 | code 2・5・1（2 件）の文末に句点を付けた。 | W10 | 要判断（体言止めのセルとみなして直さない案もあった。ほかの `meaning` に句点があるため句点にそろえた） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`: 文の読みやすさを直した（8 行追加、8 行削除）。結果不明時に紙面を確かめる人を「店番担当」に統一した（F002）。`exit_codes` と `error_handling.retry` のコメントに主語（呼び出し元・開発担当）を補った。code 1 `permanent_failure` の「上記の送信前失敗」を「送信前のビジー状態」に置き換えた。`files.inputs[0].description` の長い文を 2 文に分けた。`exit_codes` の `meaning` の文末に句点をそろえた。

## 3. 申し送り

- F001（`vp-qe-omissions-consistency`）は R2 の観点のため、この段では扱っていない。現在の `log_policy` は「マスクする秘密値はない」と書き、記録しない対象をレシート本文に絞っており、executor は解消済みに見えると申し送っている。再評価での確認は R2 または grade に任せる。
- R3-1: R3 / `exit_codes`（code 1 `permanent_failure`）・execution.idempotency.condition・`error_handling.retry` のコメント / 結果不明時に紙面を確かめる人を「店頭利用者」「利用者」と呼んでおり、お客様とも読める。関連する sample の「店番担当」と表記がゆれている / 3 か所を「店番担当」に統一した / vp-ux-language-consistency, W8（grade F002） / -
- R3-2: R3 / `exit_codes`（code 1 `transient_failure,` `permanent_failure`）・code 5・`error_handling.retry` のコメント / 「自動再試行する」「再試行しない」「自動起動を止め」の主語がない / 主語の「呼び出し元は」と、権限を直す主体の「開発担当が」を補った / W1 / -
- R3-3: R3 / `exit_codes`（code 1 `permanent_failure`） / 「上記の送信前失敗」が指す先が、配列の前の要素にしか書かれていない / 「送信前のビジー状態」に置き換えた / W4 / -
- R3-4: R3 / files.inputs[0].description / パスの基準と可変部の解決を 1 文に詰めた長い文 / 「基準とする。」で 2 文に分けた / W3 / -
- R3-5: R3 / `exit_codes` の meaning / 複数の文からなる meaning で、文末に句点があるものとないものが混ざっている / code 2・5・1（2 件）の文末に句点を付けた / W10 / 要判断（体言止めのセルとみなして直さない案もあった。ほかの meaning に句点があるため句点にそろえた）
- F001（vp-qe-omissions-consistency）は R2 の観点のため、この段では扱っていない。現在の `log_policy` は「マスクする秘密値はない」と書き、記録しない対象をレシート本文に絞っており、解消済みに見える。再評価での確認を R2 または grade に任せる。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更しておらず、変更は sample の YAML だけである）

## 4. 進め方と実践の型の適用

根拠は kata-guide の「文章のチェック項目」（W1〜W10）と grade の finding（F002）である。F002 は `vp-ux-language-consistency` の観点で、共通サンプル文脈の役割名「店番担当」に合わせた。F001 は R2 の観点のため見送り、再評価に委ねる。rulebook と矛盾する変更はなく、schema 検査も通っている。判断に要る背景・例外・制約は維持した。
