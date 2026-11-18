---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-maintainability-040-20261118t174518z-80829cd0
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-maintainability-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-maintainability-040/T-KATA-SLIM-2-nfr-maintainability-040-20261118T174518Z-80829cd0/plan.md
  started_at: "2026-11-18T17:45:24.870Z"
  completed_at: "2026-11-18T18:19:10.710Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-maintainability
    - specdojo:nfr-maintainability-rulebook
---

# Edit Result

## 1. 実施内容

- `nfr-maintainability-rulebook` から共通の運用記述を外し、正本（ドキュメントメタ情報標準等）への参照に置き換えた。
- Frontmatter 項目の表から廃止済みの `title` 行や共通の `status` 値などの記述を削除し、型固有の項目のみを記述するように変更した。
- 用語の表から定義の言い直しに過ぎない「保守性」の行を削除し、本文構成に関する重複記述を削減した。
- サンプル章を、rulebook 作成標準に従い形式の輪郭が伝わる最小限の例（Frontmatter および主要項目各 4 行）に絞り込んだ。
- 空白除いた文字数は 3,427 字から 2,504 字（約 73%）に削減した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-maintainability-rulebook.md`: 共通運用記述の削除、正本への参照への置き換え、およびサンプル章の最小化による冗長性の排除。

## 3. 申し送り

- 大きさ: 空白（改行を含む）を除いた文字数。表の区切り行を除くと前 3,427 字 → 後 2,504 字（73%）。区切り行を含むと前 3,966 字 → 後 2,852 字。
- 章名と必須の区分は変えていない（既存の成果物との対応を保つため）。第 2 章は用語の表に MTTR・変更リードタイムの定義が残るため「位置づけと用語定義」のままにした。用語の表から外したのは、冒頭の定義を言い直す「保守性」の行だけ。
- 外した記述: Frontmatter 項目の表（廃止された `title` の行、共通の `status` の値の列挙、相対パスの Markdown リンク）は、正本（ドキュメントメタ情報標準と `deliverable-frontmatter.schema.yaml`）への参照と、型固有の値（`specdojo.type`・`specdojo.rulebook`・`specdojo.part_of`・`specdojo.based_on`）の箇条書きに置き換えた。記述ガイドの「生成する本文の見出しは…」の行は本文構成の表の言い直しのため外した。もとの rulebook には役割の表・承認の段落・未決事項の管理台帳の列はなかった。
- サンプル章は、rulebook 作成標準の経過措置（完成例を丸ごと埋め込まず、形式の輪郭が伝わる最小例に限る）に従い、Frontmatter（`specdojo:` 名前空間の形に修正）と、保守性要件一覧・測定・検証方法の各 4 行に絞った。適用範囲・前提条件と関連ドキュメント導線の例は外した。章そのものは削除していない（標準の「個別の改訂で先行して削除しない」に従った）。
- F001（major/vp-qe-kata-conformance）: rulebook 側では解消できず、未解消。原因は `specdojo:nfr-maintainability-sample` が汎用の形（目的と適用範囲・入力情報・記述内容・最小記述例・未解決事項）のままで、標準の 5 章（概要（対象・目的）／適用範囲・前提条件／保守性要件一覧／測定・検証方法／関連ドキュメント導線）に従っていないこと。sample の変更案: (1) 5 章を順序どおりに置き、駄菓子屋の販売管理システムを文脈にする。(2) 要件一覧は `id`・内容・指標・基準・備考の 5 列で MTTR・変更リードタイム・一次切り分け時間などを `nfr-mnt-&lt;連番&gt;` で採番する。(3) 測定・検証方法は要件 ID ごとに測定方法・判定タイミング・判定者を示す。(4) 関連ドキュメント導線に `nfr-index`・`sac-*`・`opd-*`・`opr-*`・`dec-*` を置く。(5) H1 と本文から rulebook への相対リンクを外す。改訂前の rulebook のサンプル章（git の履歴にある）を下書きに使える。次のアクション: sample を直す todo を起票し、その後に再 grade する。
- recipe・template は `undecided` で、対応するファイルがないため変更案はない。共通の正本への追記は不要と判断した（`part_of`・`based_on`・`status` の扱いはドキュメントメタ情報標準の成果物の任意項目と値制約で賄える）。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票などの履歴ファイルを変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T17:47:12.457Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
