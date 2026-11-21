---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-index-sample-050-20261121t100531z-ff6824f0
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-index-sample-050/T-KATA-WAVE-3-utc-index-sample-050-20261121T100531Z-ff6824f0/plan.md
  started_at: "2026-11-21T10:05:37.047Z"
  completed_at: "2026-11-21T10:16:03.193Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Result

## 1. 実施内容

- rulebook の構成に従い、`docs/ja/specdojo/samples/utc-index-sample.md` を「駄菓子屋きぬや」の具体的な完成例として大幅に拡充しました。
- Frontmatter に `based_on` を追加し、H1 タイトルを「単体テストカタログ: 概要（販売管理）」の規定形式に修正しました。
- 全 9 章の構成（目的、入力情報、記述内容、未解決事項など）を満たすよう、具体的なテスト範囲、境界条件、ステークホルダー、および未解決事項の担当・報告先を記載しました。
- Prettier による整形および `docs:build` による静的検証を完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: rulebook の 9 章構成に則り、駄菓子屋のプロジェクト文脈を用いた具体的な単体テストの構成例として書き換えました。`based_on` の追加、H1 タイトルの修正、各章への実例（テストの境界や TPC 観点の分配、未解決事項の管理など）の追加を行いました。

## 3. 申し送り

- rulebook 変更案: `utc-index-rulebook` の「全体方針」にある `_UNDECIDED_` の「sample は「本文要件」の見出し構成へ未整合」は今回の改訂で解消したので、この一文を削除する。
- F015（検証コマンド・lint）と F024（リリース前チェックリスト）は sample に書いていない。rulebook の「共通の運用」が文書の整形・lint は業務の受入確認に含めないと定めているため。単体テストの実行と証跡は CI ジョブ `kinuya-ci-unit`（架空）で示した。再評価で、rulebook の範囲外の指摘として扱えるか確認する。
- F025: 改訂の承認者として ARC を明記した。`status` の変更手順は rulebook に従ってドキュメントメタ情報標準に任せている。F004: 承認者は明記したが、公開対象の書き方は rulebook に定めがない。再評価で判断する。
- 対象別 sample の `utc-sample.md` は旧来の薄い形式のまま。本書の term（`utc-sales-checkout` など）と `case_id` の例に合わせて、別タスクで厚くする必要がある。
- rulebook 変更案: utc-index-rulebook の「全体方針」にある `_UNDECIDED_` の「sample は「本文要件」の見出し構成へ未整合」は今回の改訂で解消したので、この一文を削除する。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan / result / 個票は変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

rulebook の規定に基づき、既存の `utc-index-sample.md` を「単体テストカタログ概要」としての完成例にアップデートする。具体的には、`tsp-index` への依存関係の明示、構成要素（テスト範囲、境界、TPC 観点、合否基準）の実例化、および未解決事項の管理体制の具体化を行うことで、実践的なサンプルへと拡充する。
