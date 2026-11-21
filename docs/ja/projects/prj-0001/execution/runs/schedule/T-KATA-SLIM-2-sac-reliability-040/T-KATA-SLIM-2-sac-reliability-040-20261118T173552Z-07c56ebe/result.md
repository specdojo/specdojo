---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sac-reliability-040-20261118t173552z-07c56ebe
  type: exec-result
  task_id: T-KATA-SLIM-2-sac-reliability-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sac-reliability-040/T-KATA-SLIM-2-sac-reliability-040-20261118T173552Z-07c56ebe/plan.md
  started_at: "2026-11-18T17:36:02.101Z"
  completed_at: "2026-11-18T18:06:15.401Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sac-reliability
    - specdojo:sac-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/sac-rulebook.md` から共通の運用記述と冗長な内容を削除し、共通正本への参照に置き換えて簡潔化した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sac-rulebook.md`: 共通運用の記述と冗長な内容を削除し、全体方針に「共通の運用」項目を追加。用語定義の表を削除して章名を「位置づけ」に変更し、全体方針と禁止事項の重複（F001・F003）を禁止事項へ一本化。また、ファイル名の命名規則や `title` 必須規定などの陳腐化した記述を修正し、サンプルを名前空間付きの最小例としてコードブロック形式に更新した。

## 3. 申し送り

- 大きさ: 空白（改行を含む）を除き、表の区切り行も除いて数えた。前 3,307 字（区切り行を含めると 3,581 字）、後 2,639 字（同 2,781 字）、比 79.8%。
- 章名の変更: 第 2 章を「用語定義」から「位置づけ」にした。用語の表 6 語（SAC・受入対象・シナリオ・前提・操作・期待結果）は「受入条件」節のシナリオの雛形を言い直しているだけで、rulebook 作成標準の「重複になる場合は用語定義を省略する」に当たるため。成果物の本文の章（概要・受入条件・メモ / 将来課題）と必須の区分は変えていない。
- F001・F003（全体方針と禁止事項の重複）: 全体方針から実装詳細と曖昧表現の禁止を外し、禁止事項の表に一本化した。全体方針には出口条件、観測できる事実で書くこと、1 ファイル 1 受入対象、共通の運用だけを残した。
- F002（`specdojo:sac-sample` が具体例でなく解説書になっている）は, sample がこの段では commit の対象外のため直していない。変更案: `sac-sample.md` を rulebook の本文構成（1. 概要、2. 受入条件（シナリオの前提・操作・期待結果）、3. メモ / 将来課題）に沿った駄菓子屋の SAC（例: `sac-performance`）に書き直す。あわせて H1 と表のセルにある `../rulebooks/sac-rulebook.md` への Markdown リンク（sample から rulebook へのリンク）を外す。
- 陳腐化した規定の修正: ファイル名を `sac-&lt;番号&gt;-&lt;短い日本語名&gt;.md` から `sac-&lt;term&gt;.md` に変えた（成果物カタログの `sac-reliability.md` と成果物リファレンスの `sac-&lt;term&gt;` に合わせた）。推奨 Frontmatter 項目にあった `title` を必須とする規定を外した（markdown の記法とスキーマでは `specdojo:` 配下に置けない）。項目の正本はドキュメントメタ情報標準とスキーマへの参照にした。サンプル（簡易）は経過措置の章として残し、名前空間付きの最小例をコードブロックに入れた。番号のない見出しと H5 は解消した。
- 成果物 `docs/ja/product/070-system-acceptance-criteria/sac-reliability.md` はリポジトリにまだないため、成果物と照らした見直しはできていない。成果物ができたら、章構成と期待結果の数値化が守られているかを確かめる。
- 共通の正本（ドキュメントメタ情報標準）への追記は不要と判断した。sac-rulebook には外すべき役割・承認の記述がもともとなく、参照 1 項目で足りるため。recipe と template は `undecided` のため変更案はない。
- F002（`specdojo:sac-sample` が具体例でなく解説書になっている）は、sample がこの段では commit の対象外のため直していない。変更案: `sac-sample.md` を rulebook の本文構成（1. 概要、2. 受入条件（シナリオの前提・操作・期待結果）、3. メモ / 将来課題）に沿った駄菓子屋の SAC（例: `sac-performance`）に書き直す。あわせて H1 と表のセルにある `../rulebooks/sac-rulebook.md` への Markdown リンク（sample から rulebook へのリンク）を外す。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴ファイルを変更していない（変更は rulebook のみ））
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml`・`*.yml` がない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T17:37:48.333Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
