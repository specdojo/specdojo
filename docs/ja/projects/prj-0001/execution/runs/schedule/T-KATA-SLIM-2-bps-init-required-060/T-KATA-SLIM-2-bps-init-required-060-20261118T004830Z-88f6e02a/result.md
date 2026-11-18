---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-bps-init-required-060-20261118t004830z-88f6e02a
  type: exec-result
  task_id: T-KATA-SLIM-2-bps-init-required-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-bps-init-required-060/T-KATA-SLIM-2-bps-init-required-060-20261118T004830Z-88f6e02a/plan.md
  started_at: "2026-11-18T00:48:35.425Z"
  completed_at: "2026-11-18T01:01:49.106Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - bps-init-required
    - specdojo:bps-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/bps-recipe.md` から、文書の運用の記述、rulebook と同じ判断の言い直し、仕上げチェックの構造の検査、recipe 内の重複を外した。空白と表の区切り行を除いた文字数は 5,906 字から 3,046 字（51.6%）になり、目安の 7 割以下を満たした。
- F001・F002・F004 は、主要例外がある場合とない場合で受入確認を分岐させて解消した。主要例外がない場合は、確認範囲と結論を記載すれば足りる扱いに、深掘り手順と仕上げチェックの各箇所でそろえた。
- F003（Frontmatter・ファイル名の一致確認）は仕上げチェックに加えなかった。plan が仕上げチェックの構造の検査を外すことを求めているためである。代わりに、文書を分けると決めた時点で業務成果を表す名前を付ける旨を、全体の作成手順の 1 に書いた。再 grade で妥当性を確かめる必要がある。
- 実行した検査は、executor の `npx prettier --write` と、runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` で、いずれも passed だった。`lint:ts` と `typecheck` は、変更ファイルが対象パスに該当しないため `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/bps-recipe.md`: 運用の記述（役割の表と段落、「主な確認者」の列とロールの対応付けの段落）を外した。rulebook の言い直しと、仕上げチェックの構造の検査、レビュー観点・良い例と悪い例・仕上げチェックでの同じ確認の繰り返しも削った。主要例外の確認は、ある場合とない場合で分岐させ、「少なくとも一つ」の必須化をやめた（F001・F002・F004）。章を書く順番、入力の集め方、書き手が答える問い、つまずきやすい点、深掘りの順序、良い例と悪い例は残した。Frontmatter・ファイル名の一致確認は仕上げチェックに加えず、全体の作成手順の 1 に、業務成果を表す名前を付ける旨を書いた（F003）。

## 3. 申し送り

- 根拠となる成果物 `docs/ja/product/010-business-specs/030-business-model/bps-init-required.md` が worktree に存在しなかった。成果物との照合はしておらず、rulebook・sample・grade の finding を根拠にした見直しである。
- F003 は、再 grade で全体の作成手順の 1 への追記による代替が妥当かを確かめる。Frontmatter の検証は runner の `lint:fm` が担う。
- rulebook への変更案: 「全体方針」の共通の運用の段落と、「完成判定」の「本文要件の必須要件を確認」は、文書の運用・構造の検査にあたる。rulebook を簡素化するときに見直しを検討する。rulebook・sample・template は本タスクでは変更していない。
- 大きさ: 空白と表の区切り行を除いた文字数で、5,906 字から 3,046 字（51.6%）。
- F003（Frontmatter・ファイル名の一致確認）は、plan が仕上げチェックの構造の検査を外すことを求めるため加えなかった。Frontmatter の検証は親 runner の lint:fm が担う。代わりに、文書を分けると決めた時点で業務成果を表す名前を付ける旨を、全体の作成手順の 1 に書いた。再 grade で妥当か確かめる。
- 根拠となる成果物 docs/ja/product/010-business-specs/030-business-model/bps-init-required.md が worktree に存在しなかった。このため成果物との照合はせず、rulebook・sample・grade の finding を根拠に見直した。
- rulebook への変更案: 「全体方針」の共通の運用の段落と、「完成判定」の『本文要件の必須要件を確認』は文書の運用・構造の検査にあたるため、rulebook の簡素化を行う際に見直しを検討する。
- 「レビュー観点」の「主な確認者」の列と、ロールを対応付ける段落は役割の運用にあたるため外した。

## 4. 進め方と実践の型の適用

根拠としたのは、plan に展開された grade の finding（F001〜F004）、rulebook、sample、Recipe 記述標準、prj-charter の recipe 試行結果と改訂済みの手本である。外したのは、どの成果物にも共通する文書の運用、rulebook と同じ判断の言い直し、仕上げチェックの構造の検査、recipe 内の同じ確認の繰り返しである。残したのは、章を書く順番とその理由、入力の集め方、書き手が答える問い、つまずきやすい点、深掘りの順序、良い例と悪い例である。矛盾する箇所は rulebook を正とし、主要例外の確認は rulebook の規定に合わせて、ある場合とない場合に分けた。F001・F002・F004 は、この分岐によって判定根拠に照らして解消したと見ている。F003 は仕上げチェックへの追加を見送り、作成手順の命名のコツで代替した。見送った理由は、plan が構造の検査を外すことを求めているためであり、次のアクションは再 grade での確認である。根拠となる成果物が worktree に存在せず、成果物の慣行との照合はできなかった。
