---
specdojo:
  id: prj-0001:xep-t-kata-review-all-opd-index-sample-150-20261124t145459z-ff6615d7
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-opd-index-sample-150
  name: "R5 整合"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-opd-index-sample-150

## 1. このフェーズで行うこと

kata のレビューの段 R5（整合）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
同じ接頭辞の sample（index と個別）、wikilink と based_on の参照先、用語集（docs/ja/product/010-business-specs/060-glossary/）、Sample 記述標準の共通サンプル文脈を読み、食い違いを確かめる。sample の側を直す差分を入れ、相手側を直すべき点は変更せずに直す案を result に書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を result の実施内容に Markdown の表として 1 回だけ書き、申し送りには表を重ねない。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用方針・設計（全体構成）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用方針・設計の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/opd-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-opd-index-sample-150/T-KATA-REVIEW-ALL-opd-index-sample-150-20261124T145459Z-ff6615d7/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/opd-index-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-qe-verifiability; line=39; anchor=``"| SLO  | 営業時間内の稼働   | _UNDECIDED_                                             | 月次     | 店番担当が記録できなかった時間を障害記録に残し合計する | 障害記録     | `OPS`  |"``\]: `欠品 KPI の「導入前から 50% 減」は導入前の基準値の取得方法と期間が不明で、稼働の目標も未決のため、基準値の測り方と暫定の判定条件を示すべきである。`
- F002 \[minor/vp-qe-omissions-consistency; line=65; anchor=``"P1 で `OPS` が 15 分以内に応答しない場合、店番担当は `PO` へ直接連絡し、紙の販売控えへ切り替える。"``\]: ``章 4 の「P1 で `OPS` が 15 分応答しなければ店番担当が紙の控えへ切替」と、章 6 の「30 分で `PO` が切替を決める」が食い違うため、切替の判断者とタイミングを統一すべきである。``
- F003 \[minor/vp-ux-language-consistency; line=71; anchor=`"| 監視対象               | 閾値                                 | 通知先 | 初動                                                       |"`\]: `章 5 と章 10 の「夜間バックアップ」と、章 8 の「閉店後の日次締めの後」で同じ作業の呼称と時間帯が揃っていないため、呼称を統一すべきである。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
