---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdr-sample-120-20261125t055013z-d02366b3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdr-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdr-sample-120/T-KATA-REVIEW-ALL-cdr-sample-120-20261125T055013Z-d02366b3/plan.md
  started_at: "2026-11-25T05:50:22.221Z"
  completed_at: "2026-11-25T06:04:13.292Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/cdr-sample.md` を確認した。章の順・粒度・表と本文の配置は `cdr-rulebook` の本文構成と `cdr-template` に沿っており、章の移動・分割・統合の差分は要らないと判断した。そのため sample は変更していない。
- F001（`vp-arc-conciseness`）と F002（`vp-qe-kata-conformance`）が指した、禁止事項の表と 8 章の `server-only` の重複は、R1 の版（commit bbad1006a7）で解消済みである。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 要判断: No 2 の「テストと検証」章の最後の項目にある `specdojo catalog validate` を、コマンドの表へ移すかどうかの判断が残っている。
- No: 1 / 段: R2 / 箇所: docs/ja/specdojo/samples/cdr-sample.md の 8 章「Next.js のサーバーとクライアントの境界」の先頭の項目（旧 93 行目、今の 104 行目） / 指摘: grade の F001（`vp-arc-conciseness`）と F002（`vp-qe-kata-conformance`）が指した、禁止事項の表と 8 章の重複は、R1 の版（commit bbad1006a7）で「クライアントから読み込まれた場合にビルドを失敗させる」が削られて解消している。理由は表だけ、8 章は `server-only` を import する手順だけに残る / 直した案: なし（今のまま） / 根拠: `cdr-rulebook` の本文要件（表に書いた禁止は本文の章で繰り返さない）、commit bbad1006a7 の差分 / 印: なし
- No: 2 / 段: R2 / 箇所: docs/ja/specdojo/samples/cdr-sample.md の 6 章「テストと検証」の最後の項目（`specdojo catalog validate` と、`applyTo`・`specdojo.id`・`specdojo.rulebook` のカタログとの照合） / 指摘: 本書を変えたときの検証コマンドがコマンドの表の外にある。照合は手で行う確認で、表の 1 行にまとめるとセルが長くなりセル内改行を使わない決まりに反するため移していない / 直した案: 今のまま。表に寄せる場合は、コマンド `specdojo catalog validate`、対象「本書の Frontmatter」、実行条件「本書を変更したとき」、失敗時「`based_on` の ID を直す」の行を足し、カタログとの照合は箇条書きに残す / 根拠: `cdr-rulebook` の「テストと検証の書き方」（表の列と、カタログとの照合を合格条件とする記述）、.github/instructions/markdown.instructions.md の表の規則 / 印: 要判断
- No: 3 / 段: R2 / 箇所: docs/ja/specdojo/samples/cdr-sample.md の 8 章の位置 / 指摘: 8 章を 2 章「モジュールと import」の近くへ移す案を検討した。rulebook が枠組み固有の章を必須章の後ろに置くと決め、template の末尾の注記も同じなので移さない / 直した案: なし（今のまま） / 根拠: `cdr-rulebook` の本文要件（固有の章は必須章の後ろに 1〜2 章まで）、`cdr-template` の末尾の注記 / 印: なし
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/cdr-sample.md`（Prettier の適用条件（変更した `*.md` など）を満たすファイルがない）
- 適用外の検証: `npx markdownlint docs/ja/specdojo/samples/cdr-sample.md`（markdownlint の適用条件（変更した `*.md`）を満たすファイルがない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2 として、plan に展開された F001・F002 を確認した。executor が参照した根拠は、`cdr-rulebook` の本文要件、`cdr-template` の末尾の注記、R1 の commit bbad1006a7 の差分である。 指摘は executor の handoff No 1 のとおり R1 で解消済みで、sample に追加の変更は入れていない。8 章は `server-only` を import する手順だけを残し、理由は禁止事項の表だけに置く形になっている。 8 章を 2 章「モジュールと import」の近くへ移す案は、固有の章を必須章の後ろに置く rulebook の決まりに反するため採らなかった（handoff No 3）。 表と本文の配置は、6 章の最後の項目を表へ寄せる案を検討した。表に足すとセルが長くなり、セル内改行を使わない規則に反するため移していない（handoff No 2）。判断が分かれるため「要判断」とした。 変更ファイルがないため、Prettier と markdownlint は `not_applicable` とした。runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run validate:schema` は passed である。
