---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-stc-init-040-20261118t185708z-29497d09
  type: exec-result
  task_id: T-KATA-SLIM-2-stc-init-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-stc-init-040/T-KATA-SLIM-2-stc-init-040-20261118T185708Z-29497d09/plan.md
  started_at: "2026-11-18T18:57:14.285Z"
  completed_at: "2026-11-18T19:30:49.160Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - stc-init
    - specdojo:stc-rulebook
---

# Edit Result

## 1. 実施内容

- `stc-rulebook.md` から全成果物に共通する運用の記述を外し、ドキュメントメタ情報標準への参照に置き換えました。
- 文字数は空白と表の区切り行を除き、6,777 字から 5,416 字（79.9%）に削減しました。
- 既存成果物との整合性を保つため、章名および必須・条件付きの区分は維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stc-rulebook.md`: 共通運用の記述（Frontmatter 項目の表、`title`・`status` の言い直し、重複した前置き等）を削除し、ドキュメントメタ情報標準への参照に統合しました。サンプル章は `specdojo:` 名前空間を用いた Frontmatter と 6 章構成の最小例として整理しました。

## 3. 申し送り

- 文字数（空白・改行と表の区切り行を除く）: 前 6,777 字 → 後 5,416 字（79.9%）。測り方は sld 試行（PJR-8S4T）と同じ。
- 章名と必須・条件付きの区分は変えていない（既存の stc 成果物との対応を保つため）。用語の表と役割の表は元からなかった。禁止事項 7 行はすべて stc 固有のため残した。サンプル章は rulebook-authoring-standard の「個別の改訂で先行して削除しない」に従って残した。旧形式の Frontmatter（`title` あり、`specdojo:` 名前空間なし）と章外の見出しをやめ、`specdojo:` 名前空間の Frontmatter と H1・6 章を 1 つの `markdown` コードブロックに収めた最小例にした。
- Frontmatter の章は項目の表（`title` 行・`status` の値の言い直しを含む）を外し、ドキュメントメタ情報標準と `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` を正本とする参照にした。本文の相対 Markdown リンクも wikilink とパス表記に置き換えた。H1 の形式（`# 総合テストカタログ: &lt;対象名&gt;`）は命名規則の章へ移した。
- F001（`vp-qe-kata-conformance`）は未解消。原因の `specdojo:stc-sample` は、この段では commit の対象外で変えていない。変更案: stc-sample を本文構成の 6 章（概要（`&lt;term&gt;`）・目的・対象外・境界/環境/依存・トレース（`trace_key` の表）・テスト観点とケース（観点・意図・条件・ケース表））で、駄菓子屋の文脈で作り直す。あわせて、H1 と本文の `../rulebooks/stc-rulebook.md` へのリンク（rulebook-authoring-standard で禁止）を外す。sample には共通の運用の参照文を書かない。
- 根拠の成果物 stc-init（`docs/ja/product/080-test-specs/050-system-test-catalog/stc-init.md`）はこの worktree になく、成果物との突き合わせはできなかった。recipe・template は `undecided` で変更案はない。`includes` で取り込む記法の rulebook はない。共通の正本（ドキュメントメタ情報標準）へ足す記述はないと判断した。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/stc-rulebook.md だけで、plan・result・個票などの履歴ファイルは変更していない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T18:59:10.319Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
