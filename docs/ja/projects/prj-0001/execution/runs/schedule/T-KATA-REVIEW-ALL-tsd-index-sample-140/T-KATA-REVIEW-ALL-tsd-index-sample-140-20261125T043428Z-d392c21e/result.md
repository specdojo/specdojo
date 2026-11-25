---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-index-sample-140-20261125t043428z-d392c21e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-index-sample-140/T-KATA-REVIEW-ALL-tsd-index-sample-140-20261125T043428Z-d392c21e/plan.md
  started_at: "2026-11-25T04:34:38.155Z"
  completed_at: "2026-11-25T04:47:18.766Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
    - specdojo:tsd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R4（正しさ）を実施した。sample の主張を schema と関連 sample に突き合わせ、誤りは見つからなかったため sample は変更していない（`changes` は空）。
- 確かめの表（C1〜C11）は executor の handoff にある。C1〜C10 は schema、`tsd-sample`、rulebook との読み取りで一致を確認した。C11 は版の記述で、repo に正本がないため確かめの対象外とした。
- F001（`vp-arc-conciseness`）は前の段で解消済みだった。指摘の「未作成の詳細文書」の章は現行版になく、`_TODO_` は 2.2 の参照先の表の 2 行にだけ残っている。冗長性は R3 の観点のため、R4 では直していない。
- 要判断が 1 件ある（R4-1）。ESLint 9.x と Next.js 14.x の組み合わせは、付属の ESLint 設定が ESLint 8 までを前提とする。sample は付属設定を使うとは書いておらず、ESLint 9 単独の構成もあり得るため、誤りとせず直さなかった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R4-1 は人の判断が要る。選択肢は 2 つある。ESLint を 8.x にする案は、8 系が 2024 年 10 月に保守終了しているため採らなかった。Next.js を 15.x にする案は、`tsd-sample` など同じ系列の版をそろえ直す必要があるため採らなかった。
- validations のうち runner の検査はすべて passed または `not_applicable` だった。executor が実行した `npm run validate:history-links` は、履歴ファイルを変更していないため `not_applicable` としている。
- R4-1: R4 / 1. 技術スタック一覧（静的解析の行） / ESLint 9.x と Next.js 14.x の組み合わせ。Next.js 14 に付属する ESLint 設定（eslint-config-next 14）は ESLint 8 までを前提とし、ESLint 9 への対応は Next.js 15 から / - / vp-arc-technical-constraints。sample は付属の ESLint 設定を使うとは書いておらず ESLint 9 を単独で使う構成もあり得るため、誤りとせず直さなかった。選ばなかった案: ESLint を 8.x にする（8 系は 2024 年 10 月に保守終了）、Next.js を 15.x にする（tsd-sample など同じ系列の版をそろえ直す必要がある） / 要判断
- R4 の確かめの表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: C1 / frontmatter の type: architecture / docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 読み取り / 一致 / 15 行目の enum に architecture がある
- C2 / frontmatter の rulebook: specdojo:tsd-index-rulebook / docs/ja/specdojo/rulebooks/tsd-index-rulebook.md / 読み取り / 一致 / rulebook の sample 宣言が specdojo:tsd-index-sample で、rulebook の「推奨 Frontmatter 項目」とも合う
- C3 / 2.1 の登録簿の decision 個票 / docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml / 読み取り / 一致 / 種別の enum に decision がある
- C4 / 参照先 specdojo:tsd-sample（DB 詳細定義） / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / id が specdojo:tsd-sample、`part_of` が specdojo:tsd-index-sample
- C5 / PostgreSQL 16.x・Prisma 5.x / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の冒頭と「採用設定一覧」が同じ版
- C6 / Node.js 22.x と版の正本 .node-version / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の「前提条件と必要リソース」がランタイム Node.js 22.x、正本は .node-version
- C7 / Docker 26.x 以上・Compose v2.x、開発端末で PostgreSQL を起動 / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の「前提条件と必要リソース」と、開発端末の Docker Compose の postgres サービス
- C8 / Fly.io の東京リージョンでアプリと DB を実行 / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の「実行環境と責務分界」で kinuya-app と kinuya-db が東京 nrt
- C9 / 2.2 の DB 詳細定義が扱う内容（構成・接続設定・マイグレーション・バックアップ） / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の「対象範囲と責務境界」と冒頭の利用場面
- C10 / tsd-hosting.md と tsd-ci.md は未作成で、fly.toml と .github/workflows/ が暫定の正本 / docs/ja/specdojo/samples/tsd-sample.md / 読み取り / 一致 / tsd-sample の「他文書との関係」も同じく未作成とし、同じ正本を挙げる
- C11 / TypeScript 5.x、Next.js 14.x、Vitest 2.x、ESLint 9.x、Prettier 3.x、Mermaid 11.x、Sentry 8.x / repo に正本なし（共通サンプル文脈の仮定） / 対象外 / 確かめられない / どれも実在するメジャー版。ESLint 9 と Next.js 14 の組み合わせは R4-1 を参照
- F001（vp-arc-conciseness）は前の段で解消済み。指摘が指していた「未作成の詳細文書」の章（旧 2.3）は今の版になく、`_TODO_` は 2.2 の参照先の表の 2 行にだけ残っている。R3 の観点のため R4 では直していない
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更しておらず、sample も変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実の主張を schema・`tsd-sample`・rulebook と突き合わせた。誤りは見つからず、sample は変更していない。F001 は前の段で解消済みと確認し、再編集しなかった。ESLint 9 と Next.js 14 の組み合わせは根拠が不足していて誤りと断定できないため、推測で改訂せず、R4-1 として判断を残した。
