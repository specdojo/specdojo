---
specdojo:
  id: prj-0001:xer-pjr-bxym-20261127t135537z-3031ef43
  type: exec-result
  task_id: PJR-BXYM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BXYM/pjr-bxym-20261127T135537Z-3031ef43/plan.md
  started_at: "2026-11-27T13:55:44.728Z"
  completed_at: "2026-11-27T14:07:01.251Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- シビックテック向けの入門の型の組（プロジェクト概要・課題と解決アプローチ・ビジネスルール・システム化機能一覧・プロジェクト登録簿）と、あとで足す型 10 個とその目安を決めた。導入ガイド docs/ja/specdojo/guides/civic-tech-starter-guide.md を draft で新設し、サイドバーと全体概要ガイドに足した。個票の作業内容・対応結果・CHANGELOG の文案・関連ドキュメントを埋めた。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: 変更、+6 / -5 行
- `packages/docs-site/.vitepress/sidebar-config.ts`: 変更、+1 / -0 行
- `docs/ja/specdojo/guides/civic-tech-starter-guide.md`: 追加、+152 / -0 行

## 3. 申し送り

- 判断: 業務仕様の入口はビジネスルール（br）とし、業務プロセス仕様（bps）はあとで足す型にした。制度の計算・判定を当事者と確かめやすく、プログラムから復元しやすいため。
- 判断: 判断の記録は独立した型にせず、登録簿の decision に含めた（決定記録 `dec` の rulebook は非推奨）。このため候補の「判断の記録」と「登録簿」を 1 つと数え、入門の型の組を 5 つにした。
- 判断: 用語集はあとで足す型の先頭に置いた。最初から全員に書く手間を求めないため（Sustainable Participation）。
- 判断: 復元の場合も、概要はプログラムから復元せず聞き取りから始める順にした（PJR-Y5RD: プログラムから「なぜ」は戻らない）。
- 申し送り: PJR-DZMV の案 D（内容ごとの確認表）は採否が未定のため、ガイドには既存の目印と「確かめた人と日付を本文に書く」運用だけを書いた。案 D を採った場合は、ガイドの「確認状態の目印を使う」を直す。
- 申し送り: 「理解の負債」「Sustainable Participation」は SpecDojo 本体の文書ではこのガイドが初出。用語集に足すかは利用者が決める。
- CHANGELOG に書く事項（個票 5.3 にも記載）: 区分 Added。文案「シビックテックの小さなチーム向けに、最初に使う 5 つの型（入門の型の組）と、理解の負債を減らすために残す順番・確認状態の目印の使い方を示す「シビックテック入門ガイド」を追加した。」

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
