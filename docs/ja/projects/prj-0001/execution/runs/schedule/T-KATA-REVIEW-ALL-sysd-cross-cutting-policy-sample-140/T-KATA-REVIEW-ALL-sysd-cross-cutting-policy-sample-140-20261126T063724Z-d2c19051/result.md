---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-cross-cutting-policy-sample-140-20261126t063724z-d2c19051
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-140/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-140-20261126T063724Z-d2c19051/plan.md
  started_at: "2026-11-26T06:37:33.842Z"
  completed_at: "2026-11-26T06:45:56.678Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-cross-cutting-policy-sample
    - specdojo:sysd-cross-cutting-policy-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の事実を `ifx-cmd-sample.yaml`、`ifx-cmd.schema.yaml`、`clis-sample.md`、`prj-overview-sample.md`、rulebook と突き合わせた。誤りは参照の2件で、どちらも直した。
- grade の F001（5章見出しの略語）は前の段で見出しが「## 5. 関連ドキュメント導線」に変わって解消済みだった。R3 の観点なので、この段では手を加えていない。
- 検証では、executor の `prettier` と `markdownlint` が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 正しさ | docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md 3.6 `scp-TRC-001` References | 存在しない「販売管理 CLI 仕様の引継ぎ操作」を参照していた。`clis-sample.md` の該当箇所は「操作の流れ」の手順5（結果を引き継ぐ）である。 | 参照を「「操作の流れ」の結果の引継ぎ」に直した。 | `clis-sample.md` 3章。観点は vp-arc-technical-constraints。 | minor |
| R4-2 | R4 正しさ | docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md 3.4 `scp-RET-001` References | 「`error_handling.retry`（回数の数え方・待機列を含む）」は不正確だった。schema の retry のキーは `on_categories`、`max_attempts`、`backoff` だけである。初回を含む回数と1秒・2秒の待機は、`ifx-cmd-sample.yaml` の注記（126行）にしかない。 | 3つのキーに従い、数え方と秒数は注記を正とする書き方に直した。 | `ifx-cmd.schema.yaml` 273-289行、`ifx-cmd-sample.yaml` 126行。観点は vp-dev-implementation-readiness。 | minor |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`: 参照の誤りを2か所直した（2行追加、2行削除）。3.6 `scp-TRC-001` の References は、存在しない「引継ぎ操作」から、`clis-sample.md` の「操作の流れ」にある結果の引継ぎへ変えた。3.4 `scp-RET-001` の References は、`error_handling.retry` の説明を schema のキー `on_categories`、`max_attempts`、`backoff` に合わせた。回数の数え方と待機秒数は、`ifx-cmd-sample.yaml` の注記を正とする書き方にした。

## 3. 申し送り

- 確かめられなかった主張は、架空の正本（`kinuya-*`）と架空の script（`npm run check:contracts` など）だけである。突き合わせ先の正本がない。本文で未同梱の架空のものと明記しているため、確かめの対象にしなかった。
- R4-1 [minor/vp-arc-technical-constraints] sysd-cross-cutting-policy-sample の 3.6 `scp-TRC-001` References が、存在しない「販売管理 CLI 仕様の引継ぎ操作」を参照していた。clis-sample.md の該当箇所は「操作の流れ」の手順5（結果を引き継ぐ）なので、「「操作の流れ」の結果の引継ぎ」に直した。
- R4-2 [minor/vp-dev-implementation-readiness] 3.4 `scp-RET-001` References の「`error_handling.retry`（回数の数え方・待機列を含む）」は不正確だった。ifx-cmd.schema.yaml の retry のキーは `on_categories`・`max_attempts`・`backoff` だけで、初回を含む回数と1秒・2秒の待機は ifx-cmd-sample.yaml の注記（126行）にしかない。3つのキーに従い、数え方と秒数は注記を正とする書き方に直した。
- 確かめの表（result の実施内容用）: 1 3.3 `execution.timeout_seconds`/`error_handling.timeout_action` 一致（ifx-cmd-sample.yaml 112・129-132行）; 2 3.3 時間切れで子プロセスと子孫を終了し不完全な stdout を採用しない 一致（同130行）; 3 `receipt-print` 一致（同16行）; 4 3.4 送信前ビジーだけ再試行 一致（同82-94行）; 5 3.4 retry の数え方・待機列 不一致→直した（schema 273-289行、sample 126行の注記）; 6 3.7 `KINUYA_API_KEY` と認証設定不足 一致（clis-sample.md 60・102行）; 7 3.7 印刷は認証不要・OS権限拒否 exit 5 一致（ifx-cmd-sample.yaml 78-81・96-104行）; 8 3.8 `config/store-config.yaml` の欠落は既定値・破損は停止 一致（clis-sample.md 59行・6.2の店舗設定不正 exit 4）; 9 3.1 受付と保存を確かめてから会計確定を通知 一致（clis-sample.md 116行）; 10 3.1 参照先「代表的な表示と利用者の次の手」 一致（clis-sample.md 6.2）; 11 3.6 参照先「引継ぎ操作」 不一致→直した（clis-sample.md 3章）; 12 「まず記録する」 一致（prj-overview-sample.md 42行）; 13 `scp-` 接頭辞 一致（rulebook 38行）; 14 架空正本（`kinuya-*`）と架空 script（`npm run check:contracts` など） 確かめられない（正本なし。本文で未同梱の架空のものと明記しているため対象外）。
- F001（vp-ux-language-consistency、5章見出しの略語）は前の段で見出しが「## 5. 関連ドキュメント導線」になり解消済み。R3 の観点のため、この段では手を加えていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票などの履歴ファイルは変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の主張を schema、sample、コマンドリファレンス相当の文書と照合した。照合した主張は 14 件。内訳は一致 12 件、不一致 2 件（直した）、確かめられなかった 1 件。確かめられなかった 1 件は架空の正本と script で、本文に未同梱と書いてあるため対象外とした。 確かめの表: | No | 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | --- | | 1 | 3.3 `execution.timeout_seconds` と `error_handling.timeout_action` | `ifx-cmd-sample.yaml` 112・129-132行 | 一致 | | 2 | 3.3 時間切れで子プロセスと子孫を終了し、不完全な stdout を採用しない | 同 130行 | 一致 | | 3 | `receipt-print` | 同 16行 | 一致 | | 4 | 3.4 送信前ビジーだけ再試行 | 同 82-94行 | 一致 | | 5 | 3.4 retry の数え方と待機列 | schema 273-289行、sample 126行の注記 | 不一致、直した | | 6 | 3.7 `KINUYA_API_KEY` と認証設定不足 | `clis-sample.md` 60・102行 | 一致 | | 7 | 3.7 印刷は認証不要、OS権限拒否は exit 5 | `ifx-cmd-sample.yaml` 78-81・96-104行 | 一致 | | 8 | 3.8 `config/store-config.yaml` の欠落は既定値、破損は停止 | `clis-sample.md` 59行と 6.2 の店舗設定不正 exit 4 | 一致 | | 9 | 3.1 受付と保存を確かめてから会計確定を通知 | `clis-sample.md` 116行 | 一致 | | 10 | 3.1 参照先「代表的な表示と利用者の次の手」 | `clis-sample.md` 6.2 | 一致 | | 11 | 3.6 参照先「引継ぎ操作」 | `clis-sample.md` 3章 | 不一致、直した | | 12 | 「まず記録する」方針 | `prj-overview-sample.md` 42行 | 一致 | | 13 | `scp-` 接頭辞 | rulebook 38行 | 一致 | | 14 | 架空正本と架空 script | 正本なし | 確かめられない、対象外 |
