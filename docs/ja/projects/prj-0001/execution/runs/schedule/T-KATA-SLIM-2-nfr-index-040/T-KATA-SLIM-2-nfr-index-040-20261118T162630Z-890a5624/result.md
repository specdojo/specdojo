---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-index-040-20261118t162630z-890a5624
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-index-040/T-KATA-SLIM-2-nfr-index-040-20261118T162630Z-890a5624/plan.md
  started_at: "2026-11-18T16:26:39.516Z"
  completed_at: "2026-11-18T16:56:32.327Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-index
    - specdojo:nfr-index-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/nfr-index-rulebook.md` から、用語の表、`title` を含む Frontmatter の表、正本の再掲、文書品質の完了条件などの共通運用の記述を削除し、全体方針に「共通の運用」としての参照項目を配置しました。
- 本文要件の受入条件列、および記述ガイドへの良い例・悪い例を追加し、実用性を向上させました。
- rulebook 内のサンプル章を `specdojo` 名前空間とし、全 5 章（概要〜関連ドキュメント導線）を含む最小例に書き換えることで finding F002 を解消しました。
- 文字数は空白と表の区切り行を除いて 3,609 字から 2,865 字（79.4%）へ削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-index-rulebook.md`: 共通運用の記述を削除して参照に置き換え、サンプル章を 5 章構成の最小例に更新。また、第 2 章を「位置づけと用語定義」から「位置づけ」に変更し、冗長な用語表を削除しました。

## 3. 申し送り

- F001・F003（未解消、sample 側の問題）: `nfr-index-sample` は rulebook の 5 章構成（概要〜関連ドキュメント導線）に沿っておらず、H1 と表に Markdown リンクがある。この段では sample を変更できないため、5 章構成の完成例へ書き直すことを変更案とする。書き直し後は、rulebook のサンプル章を外出しする候補になる。
- F002（解消）: rulebook のサンプル章を、見出し 1〜5 をすべて含む最小例にした。分冊の参照先は、誤っていた `docs/ja/specdojo/nfr-*.md` をファイル名だけの表記に改めた。
- 章名の変更: 第 2 章を「位置づけと用語定義」から「位置づけ」に変えた。用語の表が位置づけの言い直しで、rulebook 作成標準の用語定義の省略条件に当たるため。成果物側の章名と必須の区分は変えていない。
- 大きさ: 空白と表の区切り行を除いて 3,609 字から 2,865 字（79.4%）、区切り行を含めて 4,021 字から 3,202 字（79.6%）。
- recipe と template は `undecided` で変更対象がない。共通の正本（ドキュメントメタ情報標準）へ足す記述もない。対象の成果物 `nfr-index.md` はまだ作られていない。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票を変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T16:28:32.259Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
