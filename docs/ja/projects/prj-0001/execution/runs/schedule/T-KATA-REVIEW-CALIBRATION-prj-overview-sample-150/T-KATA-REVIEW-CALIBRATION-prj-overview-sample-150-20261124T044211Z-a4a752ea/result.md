---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-prj-overview-sample-150-20261124t044211z-a4a752ea
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-prj-overview-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-prj-overview-sample-150/T-KATA-REVIEW-CALIBRATION-prj-overview-sample-150-20261124T044211Z-a4a752ea/plan.md
  started_at: "2026-11-24T04:42:19.288Z"
  completed_at: "2026-11-24T04:47:13.012Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-overview-sample
    - specdojo:prj-overview-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）を実施した。対象 sample `specdojo:prj-overview-sample` を、同じ接頭辞の sample、共通サンプル文脈、用語集、スコープ、成功基準と照合した。食い違いのうち sample 側で直せるものを修正し、相手側の修正案は handoff に残した。
- R5-1: 共通サンプル文脈と成功基準 SC-09 にある、つけ残高を1分以内で確認する目標が概要になかった。5.1章に、両代表のすべての試行で顧客検索から残高表示まで1分以内とする指標と測定方法を追加した。
- R5-2: 連絡先を店内記録に置く記述が、スコープの連絡先管理対象外と食い違っていた。6章で、氏名・つけ残高の非公開方針は維持し、連絡先は管理しないと明記した。
- F001 は、元の90行の anchor が修正後103行にあたる。R1 の対応文が109行にあり、依存未成立時の影響と引継ぎ先は対応済みだった。そのため維持し、再指摘していない。
- lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema、Prettier の検査、`git diff --check` は合格した。その他の検査は変更種別により適用外とされた。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-overview-sample.md`: 5.1章の初期公開指標に、つけ残高を1分以内で確認する指標と測定方法を1行追加した。6章の顧客連絡先の扱いを、連絡先は管理しない方針に修正した。表の列幅は Prettier で整形した。差分は7行追加・6行削除。

## 3. 申し送り

- 指摘表（R5）。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 5.1. 初期公開指標 | 共通サンプル文脈と成功基準 SC-09 にある、つけ残高を1分以内で確認する目標が概要にない | 両代表のすべての試行で、顧客検索から残高表示まで1分以内とする指標・測定方法を追加した | `vp-qe-kata-conformance`。Sample 記述標準3.4、成功基準 sample の SC-09 と一致させた。確定した成功判定は引き続き同書へ委譲する | - | | R5-2 | R5 | 6. 前提条件 | 連絡先を店内記録に置く記述が、スコープの連絡先管理対象外と食い違う | 氏名・つけ残高の非公開方針を維持し、連絡先は管理しないと明記した | `vp-qe-kata-conformance`。スコープ sample 2章・4章 | - | | R5-3 | R5 | 6. 前提条件の引継ぎ先 | 前提・制約・依存関係 sample に、ベースライン記録の確保と家族利用者代表の参加の成立条件が登録されていない | - | `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の3章へ両条件を追加し、概要6章と成功基準 SC-04・SC-05・SC-08 に結ぶ案。成立期限、未成立時の影響、監視・対応を示す。対象外文書のため未編集 | - | | R5-4 | R5 | 引継ぎ先の初期受入条件 | 前提・制約・依存関係 sample の ACD-D04 は SC-01・AC-01〜AC-04 のみを参照し、SC-02 以降を将来測定としている | - | `vp-qe-kata-conformance`、`vp-dev-change-impact`。成功基準 sample 1章に合わせ、相手側を SC-01・SC-07・SC-09・AC-01〜AC-05 に更新する案。将来測定の説明も SC-02〜SC-06・SC-08・SC-10 に限定する。対象外文書のため未編集 | - | | R5-5 | R5 | 6. 前提条件・関連文書のオフライン方針 | 決定時期が概要では初期公開の計画、憲章では詳細計画の承認前、成功基準と ACD-D03 では初期運用開始前となり、対象範囲と記録方式の決定の区別が明確でない | - | `vp-qe-kata-conformance`。憲章9章とスコープ4章で対象範囲を決め、成功基準5章と ACD-D03 で記録方式・追加受入条件を初期運用開始前に確定する、という二段階を関連文書側に明記する案。すべてを詳細計画承認前に確定する案もあるが、現行の初期受入対象外という扱いに影響するため採らず、人の判断へ渡す | 要判断 |
- reporter は result の実施内容へ、次の指摘表を実際の Markdown 表として記載してください。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 5.1. 初期公開指標 | 共通サンプル文脈と成功基準 SC-09 にある、つけ残高を1分以内で確認する目標が概要にない | 両代表のすべての試行で、顧客検索から残高表示まで1分以内とする指標・測定方法を追加した | `vp-qe-kata-conformance`。Sample 記述標準3.4、成功基準 sample の SC-09 と一致させた。確定した成功判定は引き続き同書へ委譲する | - | | R5-2 | R5 | 6. 前提条件 | 連絡先を店内記録に置く記述が、スコープの連絡先管理対象外と食い違う | 氏名・つけ残高の非公開方針を維持し、連絡先は管理しないと明記した | `vp-qe-kata-conformance`。スコープ sample 2章・4章 | - | | R5-3 | R5 | 6. 前提条件の引継ぎ先 | 前提・制約・依存関係 sample に、ベースライン記録の確保と家族利用者代表の参加の成立条件が登録されていない | - | `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の3章へ両条件を追加し、概要6章と成功基準 SC-04・SC-05・SC-08 に結ぶ案。成立期限、未成立時の影響、監視・対応を示す。対象外文書のため未編集 | - | | R5-4 | R5 | 引継ぎ先の初期受入条件 | 前提・制約・依存関係 sample の ACD-D04 は SC-01・AC-01〜AC-04 のみを参照し、SC-02 以降を将来測定としている | - | `vp-qe-kata-conformance`、`vp-dev-change-impact`。成功基準 sample 1章に合わせ、相手側を SC-01・SC-07・SC-09・AC-01〜AC-05 に更新する案。将来測定の説明も SC-02〜SC-06・SC-08・SC-10 に限定する。対象外文書のため未編集 | - | | R5-5 | R5 | 6. 前提条件・関連文書のオフライン方針 | 決定時期が概要では初期公開の計画、憲章では詳細計画の承認前、成功基準と ACD-D03 では初期運用開始前となり、対象範囲と記録方式の決定の区別が明確でない | - | `vp-qe-kata-conformance`。憲章9章とスコープ4章で対象範囲を決め、成功基準5章と ACD-D03 で記録方式・追加受入条件を初期運用開始前に確定する、という二段階を関連文書側に明記する案。すべてを詳細計画承認前に確定する案もあるが、現行の初期受入対象外という扱いに影響するため採らず、人の判断へ渡す | 要判断 |
- result の変更ファイル欄: `docs/ja/specdojo/samples/prj-overview-sample.md`。5.1章に残高確認時間の指標を1行追加し、6章の顧客連絡先の扱いを修正した。表の列幅を Prettier で整形した。executor は result と grade サイドカーを編集していない。
- result の進め方と実践の型の適用欄: kata-guide 6.1・6.3・6.5、Sample 記述標準（特に共通サンプル文脈3.4・3.5）、prj-overview の rulebook・recipe・template、共通レビュー観点一覧、成果物カタログ `dct-kata.yaml` の対象項目の `done_criteria` を確認した。同じ接頭辞の sample 全8件（overview、scope、charter、stakeholder-register、success-criteria-and-acceptance-criteria、assumptions-constraints-dependencies、issues-and-approach、comparison-of-alternatives）を読み、同系列の index sample がないことを確認した。対象の wikilink 参照先はすべて実在し、`based_on` は空配列である。用語集6ファイルの用語・別名を照合し、対象本文と対応する定義を確認した。初期公開と初期リリースは本題材で店頭利用を始める版を指し、用語集固有の計画・登録簿の定義との混同は認めなかった。実成果物 `prj-0001:prj-overview` と R1〜R4 の result、grade 結果 `docs/ja/projects/prj-0001/execution/grade/results/specdojo.prj-overview-sample.yaml` も確認した。実成果物の本文は複製していない。
- 判断根拠の補足: F001 は `source=grade` に相当する既存 grade の指摘で、元の90行の anchor は修正後103行、R1 の対応文は109行にある。依存未成立時の影響と引継ぎ先は対応済みのため維持し、再指摘していない。元観点 `vp-pm-dependency-risk` は段レビューの対象外である。condense 由来の指摘はない。既存の章構成、短期・中長期指標、初期仮説と確定した成功判定の責務分担を維持した。追加した指標は既存の残高不一致指標とは測る価値・時期が異なり、`vp-arc-conciseness` に照らして重複ではない。rulebook との構成・禁止事項の矛盾はなく、既存の frontmatter を維持した。相手側の変更は実施せず修正案として残したため、本タスクの対象 sample に未完了作業はない。指定の lint・test・schema 等は親 runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は samples 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として kata-guide 6.1・6.3・6.5、Sample 記述標準（特に共通サンプル文脈3.4・3.5）、prj-overview の rulebook・recipe・template、共通レビュー観点一覧、`dct-kata.yaml` の `done_criteria` を確認した。同じ接頭辞の sample 全8件を読み、同系列の index sample がないことを確認した。wikilink 参照先はすべて実在し、`based_on` は空配列である。用語集6ファイルの用語・別名を照合し、初期公開と初期リリースに用語集との混同がないことを確認した。実成果物 `prj-0001:prj-overview`、R1〜R4 の result、grade 結果も確認したが、実成果物の本文は複製していない。改訂した記述は、残高確認時間の指標追加と連絡先の扱いの修正である。既存の章構成、短期・中長期指標、初期仮説と確定した成功判定の責務分担は維持した。追加した指標は既存の残高不一致指標と測る価値・時期が異なり、`vp-arc-conciseness` に照らして重複ではない。rulebook との構成・禁止事項の矛盾はなく、frontmatter も維持した。相手側の文書は対象外のため変更せず、修正案を handoff に残した。grade result サイドカーは直接編集していない。
