---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-atc-init-040-20261118t160458z-b5a7bf73
  type: exec-result
  task_id: T-KATA-SLIM-2-atc-init-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-atc-init-040/T-KATA-SLIM-2-atc-init-040-20261118T160458Z-b5a7bf73/plan.md
  started_at: "2026-11-18T16:05:10.365Z"
  completed_at: "2026-11-18T16:33:37.800Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - atc-init
    - specdojo:atc-rulebook
---

# Edit Result

## 1. 実施内容

- `atc-rulebook` から共通の運用記述（役割、`status`・承認・改訂手順、文書品質検査）を削除し、ドキュメントメタ情報標準への参照に置き換えました。
- finding F002, F006, F007, F009, F010, F011, F013, F014 の指摘事項を修正しました。
- 空白を除いた文字数を 6,786 字から 4,517 字（約 66.6%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/atc-rulebook.md`: 共通運用記述の削除と正本への参照化、および finding に基づく構成・定義の修正（章名変更、優先度 `P0`/`P1` および実施形態の定義追加など）を実施しました。

## 3. 申し送り

- 大きさ: 空白（改行を含む）と表の区切り行を除いた文字数で、前 6,786 字、後 4,517 字（66.6%）。
- 章名: rulebook の章「本文構成（標準テンプレ）」を作成標準に合わせて「本文要件」にした（F013）。成果物側の 6 章の名前と、すべて必須という区分は変えていない。第 2 章「位置づけ」の導入文（図をなぞる文）は削った。
- finding F001・F015（ready 化の条件と判断者）と F003（暫定ケースの報告先と担当 Role code）は、plan の方針（status・承認・未決事項の引き継ぎは共通の正本を参照）に従い、全体方針の「共通の運用」でドキュメントメタ情報標準を参照する形にした。rulebook には書いていない。
- finding F004（作成者・確認者・受入合意者の Role code）は、役割の割り当てをメンバー定義が正本とするため概要의 要件を「誰がどの受入判断に使うか」に置き換えた。Role code は書いていない。
- finding F005・F008（lint・schema validate の手順）は、文書品質の検査を業務の検証に入れない方針のため追記していない。「共通の運用」に、整形・lint はリポジトリの検証で扱うと 1 文で書いた。
- finding F009: 優先度 `P0`（不合格なら受入不可）・`P1`（重要な分岐で、不合格時は条件付き受入を判断する）と、実施形態 `manual`・`automated` の意味を rulebook で新たに決めた。`atc-index` 側に別の定義があれば、そちらに合わせる必要がある。
- finding F012 の変更案（sample は commit 対象外のため未変更）: `docs/ja/specdojo/samples/atc-sample.md` を本 rulebook の 6 章（概要・受入の責務・対象外・環境/データ/外部依存・トレース・受入観点とケース）と type `test` の形に作り直す。H1 の Markdown リンクと本文の rulebook へのパス参照は外す。`relations.verifies` と、ケース表の `TR-xx` 参照・`P0`/`P1`・`manual`/`automated` を含める。
- サンプル章: 作成標準の「個別の改訂で先行して削除しない」に従い、「サンプル（最小）」はトレース表とケース表 1 行の輪郭だけに縮めて残した。sample を作り直した後に消すかは人が判断する。
- recipe・template は `undecided` のまま。合わせて直す点はない。共通の正本（ドキュメントメタ情報標準）への追記は不要と判断した。
- 対象の成果物 `docs/ja/product/080-test-specs/060-acceptance-test-catalog/atc-init.md` はまだ作られていない（成果物本体は変更しない決まりのため影響なし）。
- finding F004（作成者・確認者・受入合意者の Role code）は、役割の割り当てをメンバー定義が正本とするため概要の要件を「誰がどの受入判断に使うか」に置き換えた。Role code は書いていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・pjr 個票は変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T16:07:13.041Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
