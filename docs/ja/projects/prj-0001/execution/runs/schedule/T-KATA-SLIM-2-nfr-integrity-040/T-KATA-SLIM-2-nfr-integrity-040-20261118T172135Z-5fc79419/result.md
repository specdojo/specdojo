---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-integrity-040-20261118t172135z-5fc79419
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-integrity-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-integrity-040/T-KATA-SLIM-2-nfr-integrity-040-20261118T172135Z-5fc79419/plan.md
  started_at: "2026-11-18T17:21:42.077Z"
  completed_at: "2026-11-18T17:55:23.794Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-integrity
    - specdojo:nfr-integrity-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` から共通の運用の記述を外し、ドキュメントメタ情報標準への参照に置き換えた。
- 第 2 章を「位置づけ」に変更し、全体方針の言い直しとなる用語の表を削除した。
- frontmatter の表を正本に合わせ、不要な項目（`title` および `status` の値一覧）を削除し、`rulebook` を追加した。
- サンプル章の内容を最小例として簡縮し、表記を修正した。
- finding F002 に基づき、「冔等キー」を「冪等キー」に修正した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md`: 共通運用の記述をドキュメントメタ情報標準への参照に置換。第 2 章の章名変更と用語表の削除、frontmatter の整理、サンプル章の最小化、および誤記（冪等キー）の修正を実施。

## 3. 申し送り

- 大きさ: 空白（改行を含む）を除いた文字数は、前 3,824 字、後 3,258 字（約 85.2%）。8 割の目安に届かないのは、要件と検証の例・保持期間・例外条件など完全性の型に固有の内容を残したため。
- 章名の変更: rulebook の第 2 章を「位置づけと用語定義（必要に応じて）」から「位置づけ」に変え、用語の表（完全性・整合性違反・監査証跡）を外した。全体方針の言い直しで、rulebook 作成標準の用語定義を省く場合に当たるため。成果物の本文の 5 章の章名と必須の区分は変えていない。
- Frontmatter の表から `title`（Markdown の frontmatter では禁止）と `status` の値の一覧（共通の正本と同じ内容）を外し、`rulebook` を足した。相対パスの Markdown リンクは wikilink とパス表記に置き換えた。
- サンプル章: rulebook 作成標準の経過措置に従い章は残し、最小例にした。Frontmatter の例を `specdojo:` の配下へ移して `title` を外し、空行で割れていた測定・検証方法の表を直し、要件と検証の表は代表 4 行（001・002・004・006）に、概要の例は 1 文にした。
- F002（vp-ux-language-consistency）: 「冔等キー」を「冪等キー」に直した。
- F001（vp-qe-kata-conformance）の変更案: `docs/ja/specdojo/samples/nfr-integrity-sample.md` の章構成が「目的と適用範囲・入力情報・記述内容・最小記述例・未解決事項」で、rulebook の本文構成（概要（対象・目的）／適用範囲・前提条件／完全性要件一覧／測定・検証方法／関連ドキュメント導線）に合っていない。sample をこの 5 章に組み替え、H1 の Markdown リンクと本文の rulebook へのパス参照を外すことを提案する。この段では sample は変更対象外のため直していない。
- recipe と template は `undecided` で、対応するファイルがないため変更案はない。
- 共通の正本への追記は不要と判断した。外した記述はドキュメントメタ情報標準で賄える。
- 根拠となる成果物 `docs/ja/product/060-non-functional-requirements/nfr-integrity.md` はこの worktree に存在しないため、成果物との照合はしていない。
- F001（vp-qe-kata-conformance）の変更案: docs/ja/specdojo/samples/nfr-integrity-sample.md の章構成が「目的と適用範囲・入力情報・記述内容・最小記述例・未解決事項」で、rulebook の本文構成（概要（対象・目的）／適用範囲・前提条件／完全性要件一覧／測定・検証方法／関連ドキュメント導線）に合っていない。sample をこの 5 章に組み替え、H1 の Markdown リンクと本文の rulebook へのパス参照を外すことを提案する。この段では sample は変更対象外のため直していない。
- 根拠となる成果物 docs/ja/product/060-non-functional-requirements/nfr-integrity.md はこの worktree に存在しないため、成果物との照合はしていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/ 配下の rulebook だけで、plan・result・個票の履歴ファイルは変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下だけで、docs/ja/projects/ 配下の成果物を変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T17:23:33.890Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
