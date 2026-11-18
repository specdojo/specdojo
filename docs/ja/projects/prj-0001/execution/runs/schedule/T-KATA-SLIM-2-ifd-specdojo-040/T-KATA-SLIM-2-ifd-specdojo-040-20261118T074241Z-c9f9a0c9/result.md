---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifd-specdojo-040-20261118t074241z-c9f9a0c9
  type: exec-result
  task_id: T-KATA-SLIM-2-ifd-specdojo-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifd-specdojo-040/T-KATA-SLIM-2-ifd-specdojo-040-20261118T074241Z-c9f9a0c9/plan.md
  started_at: "2026-11-18T07:42:50.269Z"
  completed_at: "2026-11-18T08:11:15.457Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - ifd-specdojo
    - specdojo:ifd-mermaid-rulebook
---

# Edit Result

## 1. 実施内容

- `ifd-mermaid-rulebook` から、どの成果物にも共通する運用の記述を外し、全体方針に「共通の運用」を 1 項目だけ置いて共通の正本（ドキュメントメタ情報標準）を参照する形にした。
- 外した記述は、役割の行と主確認ロール、未決事項の担当・引き継ぎ先、改訂時の役割の追従、共通規約と同じ禁止事項、重複する用語の行である。
- F001（`vp-dev-testability`）には、表現規約に「図の確認」を足して対応した。対象は「インフラ構成図」章の全 Mermaid ブロックである。構文は `npm run lint:mermaid` で確かめ、描画プレビューでは表示名・経路ラベル・枠名が読めることと、枠の包含が「配置と境界の定義」と一致することを確かめる。
- 空白を除いた文字数は 3,753 字から 3,000 字になった（79.9%、目安の 8 割以下）。章名と必須・条件付きの区分は変えていない。
- runner の検証（`lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration`）はすべて passed だった。`lint:ts` と `typecheck` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifd-mermaid-rulebook.md`: sld の試行の一覧に沿って簡潔にした（38 行追加・45 行削除）。全体方針に「共通の運用」を 1 項目置き、役割、主確認ロール、未決事項の担当・引き継ぎ先、改訂時の役割の追従、共通規約と同じ禁止事項、重複する用語の行を外した。第 2 章には型固有の区別（ネットワーク境界、論理ゾーン、上位構成図）の 3 行だけを残した。F001 への対応として、5.1 節に「図の確認」（対象の章、`npm run lint:mermaid`、描画プレビューの確認点）を追加した。

## 3. 申し送り

- 変更案（template。対象外のため未変更）: `docs/ja/specdojo/templates/ifd-template.md` の検証対象の表から「主確認ロール」列を外す。メモ / 将来課題の表からは「担当」「解消条件・引き継ぎ先」列を外し、「対象・論点／影響（当面の扱い）」にする。
- 変更案（recipe。対象外のため未変更）: `docs/ja/specdojo/recipes/ifd-recipe.md` の手順 6 の「主確認ロール」、手順 7 の「担当、解消条件・引き継ぎ先」、受入の確認項目の「担当・解消条件」を、rulebook の「論点と影響（当面の扱い）」に合わせて直す。
- 変更案（sample。対象外のため未変更）: `docs/ja/specdojo/samples/ifd-sample.md` 冒頭の役割の段落と、検証の表の主確認ロール列、未決事項の担当・引き継ぎ先列を、template の変更に合わせて外す。
- 文字数の数え方は sld の試行と同じで、空白（改行を含む）と表の区切り行を除く。前 3,753 字、後 3,000 字、比 79.9%。
- F001（`vp-dev-testability`）の対応: 5.1 節に「図の確認」を足した。「インフラ構成図」章の全 Mermaid ブロックを対象に、構文はリポジトリの `npm run lint:mermaid` で確かめ、描画プレビューで表示名・経路ラベル・枠名が読めることと、枠の包含が「配置と境界の定義」と一致することを確かめる。lint を成果物の業務の検証に入れない方針とは、全体方針の「共通の運用」で成果物の検証観点に含めないと書いて両立させた。
- 章名・区分: 章名と必須・条件付きの区分は変えていない（既存の `ifd-specdojo.md` との対応を保つため）。第 2 章は「位置づけと用語定義」のまま残し、本文要件の言い直しではない型固有の区別（ネットワーク境界、論理ゾーン、上位構成図）の 3 行だけを残した。
- 共通の正本への追記は不要と判断した。ドキュメントメタ情報標準で、外した運用の記述（status・承認・改訂と廃止・未決事項の引き継ぎ）を賄える。
- 変更案（template、対象外のため未変更）: `docs/ja/specdojo/templates/ifd-template.md` の検証対象の表の「主確認ロール」列と、メモ / 将来課題の表の「担当」「解消条件・引き継ぎ先」列を外し、メモの表を「対象・論点／影響（当面の扱い）」にする。
- 変更案（recipe、対象外のため未変更）: `docs/ja/specdojo/recipes/ifd-recipe.md` の手順 6 の「主確認ロール」、手順 7 の「担当、解消条件・引き継ぎ先」、受入の確認項目（133 行目）の「担当・解消条件」を、rulebook の「論点と影響（当面の扱い）」に合わせて直す。
- 変更案（sample、対象外のため未変更）: `docs/ja/specdojo/samples/ifd-sample.md` 冒頭の役割の段落（ARC・DEV・QE・PO の責務対応）を外し、検証の表の主確認ロール列と未決事項の担当・引き継ぎ先列を template の変更に合わせて外す。成果物 `ifd-specdojo.md` は今回の段では変えていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票は変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T07:45:36.669Z に再開

## 4. 進め方と実践の型の適用

approach は `rulebook-maintenance` である。根拠は、plan に展開された F001（`vp-dev-testability`）、sld の試行の「他の型へ広げるときの一覧」、および共通の正本としてのドキュメントメタ情報標準である。外した運用の記述（status・承認・改訂と廃止・未決事項の引き継ぎ）は、この正本で賄える。そのため、共通の正本への追記は不要と判断した。型固有の判断基準、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、未決事項の論点と影響は維持した。F001 は、図の確認手順を 5.1 節に足したことで判定根拠に照らして解消したと見ている。lint を成果物の業務の検証に入れない方針とは、全体方針の「共通の運用」で成果物の検証観点に含めないと書いて両立させた。矛盾する箇所はなく、rulebook を正とする必要のある箇所はなかった。recipe・template・sample は commit の対象外のため変更せず、合わせて直す点は handoff に変更案として記した。
