---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdr-sample-110-20261125t051110z-0613b2e4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdr-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdr-sample-110/T-KATA-REVIEW-ALL-cdr-sample-110-20261125T051110Z-0613b2e4/plan.md
  started_at: "2026-11-25T05:11:19.465Z"
  completed_at: "2026-11-25T05:24:46.954Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを行い、`docs/ja/specdojo/samples/cdr-sample.md` の 2 か所を修正しました。どちらも禁止事項の表の内容を本文が言い換えて重複させていた箇所です。
- 欠けている内容はありません。rulebook の必須 8 章、固有章 1 章、Frontmatter の `applyTo`・`rulebook`・`based_on` はそろっています。rulebook など sample 以外は変更していません。
- 検証では、`prettier` と `markdownlint`（executor 実行）、および runner が実行した `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdr-sample.md`: 「Next.js のサーバーとクライアントの境界」の `server-only` の項目から、「クライアントから読み込まれた場合にビルドを失敗させる」という禁止事項表との重複部分を削除しました。F001・F002 に対応します。あわせて「基本方針」の型エラーに関する項目を、「`tsconfig.json` の `strict: true` を前提にする。」だけに絞りました。差分は 2 行追加・2 行削除です。

## 3. 申し送り

- 指摘 No.2（要判断）: 「基本方針」の 1 項目めの修正は人の判断が必要です。rulebook は基本方針に型検査の厳しさを書くよう求めています。本文に型エラーの直し方も添えるかどうかは、人が判断してください。直し方は「テストと検証」の表の失敗時の列に残っています。
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/cdr-sample.md の「Next.js のサーバーとクライアントの境界」の `server-only` の項目 / 指摘: 禁止事項の表にある「クライアントコンポーネントから DB 接続を import する」を、本章の「クライアントから読み込まれた場合にビルドを失敗させる」が言い換えて二重に書いている（grade の finding F001・F002） / 直した案: 本章は「DB 接続とつけ残高の更新を行うファイルは、先頭で `server-only` を import する。」という手順だけにし、被害と理由は表に任せる / 根拠: `specdojo:cdr-rulebook` の「本文要件」（表に書いた禁止は本文で肯定形にも言い換えない）、`vp-qe-kata-conformance`、`vp-arc-conciseness` / 印: なし
- No: 2 / 段: R1 / 箇所: docs/ja/specdojo/samples/cdr-sample.md の「基本方針」の 1 項目め / 指摘: 「型エラーは原因のコードを直して解消する」が、禁止事項の表の「`// @ts-ignore` で型エラーを消す」の肯定形になっている / 直した案: 「`tsconfig.json` の `strict: true` を前提にする。」だけにする。直し方は「テストと検証」の表の失敗時の列（「型エラーの原因を直す」）に残っている / 根拠: `specdojo:cdr-rulebook` の「本文要件」 / 印: 要判断（rulebook は基本方針に型検査の厳しさを書くよう求めている。本文に直し方も添えるかは人が判断する）
- No: 3 / 段: R1 / 箇所: cdr-sample 全体 / 指摘: rulebook の必須 8 章、固有章 1 章（上限 2 章）、Frontmatter の `applyTo`・`rulebook`・`based_on` がそろっていて、欠けている内容はない。ほかに要らない内容や rulebook の禁止事項に当たる記述も見つからなかった / 直した案: なし / 根拠: `specdojo:cdr-rulebook`、Sample 記述標準、`dct-kata.yaml` の cdr-sample の `done_criteria` / 印: なし

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、grade の finding F001（`vp-arc-conciseness`）と F002（`vp-qe-kata-conformance`）を R1 の観点で扱いました。根拠にした規範は `specdojo:cdr-rulebook` の本文要件（禁止事項の表に書いた内容を本文で言い換えて繰り返さない）、Sample 記述標準、`dct-kata.yaml` の cdr-sample の `done_criteria` です。F001・F002 は禁止事項の表に理由を残し、本文は `server-only` を import する手順だけにして解消しました。これらの重複を除いたうえで、必須章・固有章・Frontmatter が rulebook と整合していることを確認し、その他の記述は維持しました。未解消の finding はありません。
