---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdsd-sample-120-20261125t161535z-262e386f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdsd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdsd-sample-120/T-KATA-REVIEW-ALL-cdsd-sample-120-20261125T161535Z-262e386f/plan.md
  started_at: "2026-11-25T16:15:44.633Z"
  completed_at: "2026-11-25T16:22:29.868Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdsd-sample
    - specdojo:cdsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `specdojo:cdsd-sample` を見直した。章の順・粒度・表と本文の配置は rulebook の 5 章構成に沿っており、章の移動・分割・統合は不要と判断した。
- 差分は「関連仕様と検証」の「照合手順と受入条件」の表のみで、rulebook の「検証と受入条件」の順（範囲と一覧の照合、境界と依存の確認、データ検証）に合わせるため、「一覧の網羅」の行を 2 行に分けた。
- rulebook など sample 以外は変更していない。見出し「生成元と利用制約」の件は、実成果物と登録簿の個票が参照しているため sample では直さず、人の判断に回した。
- 検査は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` と executor の prettier 確認が成功した。ほかは変更種別により非適用とされた。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 構成 | 関連仕様と検証 &gt; 照合手順と受入条件 の表の「一覧の網羅」の行 | 一覧が網羅されているかと各表の対象集合が一致するかを 1 行で確かめており、rulebook が定める「範囲と一覧の照合 → 正本区分・生成元と依存の確認 → 管理単位ごとのデータ検証」の 2 段目にあたる行がない。 | 「一覧の網羅」（概要の 5 単位と一覧の行の照合）と「境界と依存」（一覧の行を正本区分・参照対応の各表と照合し、生成元・担当を参照先の定義と比べる。合格条件は対象集合が一致し、参照先の定義と矛盾しないこと）の 2 行に分けた。sample に反映済み。 | `specdojo:cdsd-rulebook` の「検証と受入条件」の段落と表（業務範囲と用途・境界と依存・データと運用）、観点 `vp-arc-document-structure` | - |
| 2 | R2 構成 | 正本区分と更新責務 &gt; 生成元と利用制約（見出し） | 表に更新担当・確認担当の列があり、見出しの下の段落も更新するプロセスと参照するだけのプロセスの区別を書いているので、見出しが内容より狭い。 | 見出しを「生成元・担当と利用制約」にする案。実成果物 `prj-0001:cdsd-execution` の同じ見出しと、登録簿の個票 `pjr-pejq` が章の名前でこの見出しを参照しているため、sample では直さず R5（整合）と人の判断に任せる。 | `specdojo:cdsd-rulebook` の「正本区分と更新責務」（担当の Role code と、更新するプロセス・参照だけのプロセスの区別を求めている）、観点 `vp-arc-document-structure` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdsd-sample.md`: 「照合手順と受入条件」の表の「一覧の網羅」の行を、「一覧の網羅」と「境界と依存」の 2 行に分けた。後者では、一覧の行を正本区分・参照対応の各表と照合し、生成元・担当を参照先の定義と比べる。合格条件は対象集合の一致と、参照先の定義との無矛盾とした。

## 3. 申し送り

- `specdojo:cdsd-sample` の frontmatter `status` は `draft` のまま据え置いた。
- No: 1 / 段: R2 構成 / 箇所: 関連仕様と検証 &gt; 照合手順と受入条件 の表の「一覧の網羅」の行 / 指摘: 一覧が網羅されているかと各表の対象集合が一致するかを 1 行で確かめており、rulebook が定める「範囲と一覧の照合 → 正本区分・生成元と依存の確認 → 管理単位ごとのデータ検証」の 2 段目にあたる行がない / 直した案: 「一覧の網羅」（概要の5単位と一覧の行の照合）と「境界と依存」（一覧の行を正本区分・参照対応の各表と照合し、生成元・担当を参照先の定義と比べる。合格条件は対象集合が一致し、参照先の定義と矛盾しないこと）の 2 行に分けた（sample に反映済み） / 根拠: `specdojo:cdsd-rulebook` の「検証と受入条件」の段落と表（業務範囲と用途・境界と依存・データと運用）、観点 `vp-arc-document-structure` / 印: なし
- No: 2 / 段: R2 構成 / 箇所: 正本区分と更新責務 &gt; 生成元と利用制約（見出し） / 指摘: 表に更新担当・確認担当の列があり、見出しの下の段落も更新するプロセスと参照するだけのプロセスの区別を書いているので、見出しが内容より狭い / 直した案: 見出しを「生成元・担当と利用制約」にする案。実成果物 `prj-0001:cdsd-execution` の同じ見出しと、登録簿の個票 `pjr-pejq` が章の名前でこの見出しを参照しているため、sample では直さず R5（整合）と人の判断に任せる / 根拠: `specdojo:cdsd-rulebook` の「正本区分と更新責務」（担当の Role code と、更新するプロセス・参照だけのプロセスの区別を求めている）、観点 `vp-arc-document-structure` / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdsd-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、`specdojo:cdsd-rulebook` の「検証と受入条件」と観点 `vp-arc-document-structure` を根拠に、sample の章構成と表の配置を照合した。章の順と粒度は維持し、検証表だけを rulebook の順に合わせて修正した。grade と condense 由来の finding は plan に展開されていない。見出し名の件は、実成果物と個票が参照しているため、R5（整合）と人の判断に任せた。
