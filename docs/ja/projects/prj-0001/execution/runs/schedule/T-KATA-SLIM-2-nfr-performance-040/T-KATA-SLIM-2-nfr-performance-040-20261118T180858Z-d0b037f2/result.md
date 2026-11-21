---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-performance-040-20261118t180858z-d0b037f2
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-performance-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-performance-040/T-KATA-SLIM-2-nfr-performance-040-20261118T180858Z-d0b037f2/plan.md
  started_at: "2026-11-18T18:09:05.476Z"
  completed_at: "2026-11-18T18:44:24.465Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-performance
    - specdojo:nfr-performance-rulebook
---

# Edit Result

## 1. 実施内容

- `nfr-performance-rulebook.md` から共通の運用（Frontmatter の `title`・`status` 値、用語表、相対パスリンク等）を削除し、「共通の運用」として `docs/ja/specdojo/standards/document-metadata-standard.md` を参照する形式に変更しました。
- F001 および F002 に対応するため、本文構成に条件付きの第 6 章「未決事項」を追加しました。
- サンプル章を最小例に縮小し、Frontmatter の例を `specdojo:` 配下の形式に修正しました。
- 文字数は空白および表の区切り行を除き、3,401 字から 2,719 字（約 79.9%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-performance-rulebook.md`: 共通運用記述の削除と正本への参照化、条件付き章「未決事項」の追加、サンプル章の最小化および Frontmatter 形式の修正を行いました。

## 3. 申し送り

- 文字数（空白・改行と表の区切り行を除く）: 改訂前 3,401 字、改訂後 2,719 字（79.9%）。
- 章の変更: rulebook 第 2 章を「位置づけと用語定義（必要に応じて）」から「位置づけ」に変え、用語の表を外した（RPS とピーク時の説明は記述ガイド「適用範囲・負荷条件」へ移した）。本文構成には条件付きの章 6「未決事項」を足した（F001・F002 への対応。空の章を作らせないため条件付き）。既存の章 1〜5 の名前と必須の区分は変えていない。
- サンプル章: rulebook-authoring-standard が個別の改訂での削除を禁じているため残し、形式の輪郭を示す最小例（性能要件一覧と測定・検証方法の各 2 行）に縮めた。旧形式の Frontmatter の例（トップレベルの `title`）は `specdojo:` 配下の形式に直した。
- F003 は未解消（変更案）: nfr-performance-sample の見出しを本文構成の 1〜6 に揃え、題材を共通サンプル文脈（駄菓子屋）に統一し、H1 の Markdown リンクと本文の `../rulebooks/` 参照を外す。sample が整ったら rulebook のサンプル章は外出しの対象にできる。
- F004: `ready` への昇格条件は共通の運用（ドキュメントメタ情報標準）の参照で扱う。業務上の合格条件は「測定・検証方法」で要件 ID ごとに求めるよう記述ガイドに書いた。
- 共通の正本への追記は不要と判断した（ドキュメントメタ情報標準の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄える）。recipe・template は `undecided` のままで変えておらず、要否の判断は後続に回す。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/nfr-performance-rulebook.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T18:11:00.102Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
