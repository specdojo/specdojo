---
specdojo:
  id: prj-0001:xep-t-project-kata-pm-quality-management-plan-040-20261112t223148z-a7342916
  type: exec-plan
  rulebook: none
  task_id: T-PROJECT-KATA-pm-quality-management-plan-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-quality-management-plan
    - specdojo:pm-quality-management-plan-rulebook
---

# Edit Plan: T-PROJECT-KATA-pm-quality-management-plan-040

## 1. このフェーズで行うこと

代表成果物の実績から pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 品質管理計画
- `depends_on`:
  - [[prj-0001:pm-plan]]
- `overview`: 品質目標・レビュー方針・品質基準を定義
- `path`: `docs/ja/projects/prj-0001/030-project-management/pm-quality-management-plan.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-PROJECT-KATA-pm-quality-management-plan-040/T-PROJECT-KATA-pm-quality-management-plan-040-20261112T223148Z-a7342916/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 参考資料整備と成果物作成の計画・進捗・課題・リスクを管理する。小規模運用では専任化せず、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=43; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `宣言済み template が見出し・表・記入欄の骨組みの正本であるのに、「本文構成（標準テンプレ）」や6章で構造を再掲しているため、本章は各章の目的・必須性・記述規約に限定する必要がある。`
- F002 \[minor/vp-qe-verifiability; line=73; anchor=`"| 対象 | 主な観点 | 実施責任 | 出口条件・証跡 |"`\]: `「出口条件・証跡」を一つの列にまとめた結果、sample では証跡だけが記載されレビューの pass / fail 条件が欠落しているため、出口条件と証跡を分離するか両方を必須と明記する必要がある。`
- F003 \[minor/vp-qe-verifiability; line=82; anchor=`"| 区分 | 対応 | 再判定 | 記録先 |"`\]: `「再判定」が再判定する条件・ゲートを指すのか実施責任者を指すのか定義されず、sample では Role code が記載されているため、再判定条件と再判定責任を別々に判定できる列へ分ける必要がある。`
- F004 \[major/vp-qe-omissions-consistency; line=48; anchor=`"| 1 | 品質方針と適用範囲 | ○ | 価値品質、成果物品質、対象期間、人と AI の境界 |"`\]: `本文要件で対象期間を必須とする一方、記述ガイド（6.1章）、template、sample に対象期間がなく必須要件を満たしたか確認できないため、適用開始・終了などの記入規則を追加する必要がある。`
- F005 \[minor/vp-qe-omissions-consistency; line=64; anchor=`"| ゲート | 品質観点 | 合格条件 | 方法・証跡 | 時期 | 確認者 / 承認者 |"`\]: `` `people-and-organization-definition-standard` を根拠に持ちながら役割欄に定義済み Role code を用いる規則がないため、責任欄は RACI と整合するよう Role code で指定する条件を明記する必要がある。 ``
- F006 \[major/vp-qe-kata-conformance; line=43; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `rulebook が「対象期間」「人と AI の境界」「レビューの出口条件」「記録先」を必須とする一方、template や sample に反映されていないため、rulebook・template・sample の必須項目と見出し・列名を完全に一致させる必要がある。`
- F007 \[major/vp-qe-kata-conformance; line=43; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `template を文書 ID で宣言しているのに rulebook が「標準テンプレ」として骨格を再掲しているため、骨組みは template、意味要件は rulebook、完成例は sample という種別境界へ修正する必要がある。`
- F008 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 品質管理計画 作成ルール"`\]: `宣言済み recipe の「各章の書き方」が問いの形式ではなく、また「レビュー観点」が表形式になっていないため、Kata の標準仕様に合わせて recipe を修正する必要がある。`
- F009 \[minor/vp-ux-readability; line=43; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `「本文構成（標準テンプレ）」、6章の表、別ファイルの template に同じ構造情報が分散しているため、template を骨組みの参照先とし、rulebook には判断理由・必須性・例外だけを残して読み分けを明確にする必要がある。`
- F010 \[minor/vp-ux-language-consistency; line=15; anchor=`"- AI Agent は検証や指摘整理を支援できますが、利用者価値、例外、公開可否の最終判断は人間が行います。"`\]: `同じ判断主体を「AI Agent」「人と AI」「Agent」と表記しているため、「AI Agent」など一つの用語へ統一し、人間との判断境界を同じ名称で記述する必要がある。`
- F011 \[minor/vp-ux-language-consistency; line=73; anchor=`"| 対象 | 主な観点 | 実施責任 | 出口条件・証跡 |"`\]: `rulebook の表の列名「対象・実施責任・出口条件・証跡」に対して sample は「レビュー・実施者・証跡」と異なるラベルを用いているため、列名と用語を統一する必要がある。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
