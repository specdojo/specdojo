---
specdojo:
  id: prj-0001:xep-t-project-kata-prj-assumptions-constraints-dependencies-040-20261112t234651z-d630e725
  type: exec-plan
  rulebook: none
  task_id: T-PROJECT-KATA-prj-assumptions-constraints-dependencies-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-assumptions-constraints-dependencies
    - specdojo:prj-assumptions-constraints-dependencies-rulebook
---

# Edit Plan: T-PROJECT-KATA-prj-assumptions-constraints-dependencies-040

## 1. このフェーズで行うこと

代表成果物の実績から pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 前提・制約・依存関係
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-charter]]
- `overview`: 前提条件・制約事項・外部依存を整理
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-assumptions-constraints-dependencies.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-PROJECT-KATA-prj-assumptions-constraints-dependencies-040/T-PROJECT-KATA-prj-assumptions-constraints-dependencies-040-20261112T234651Z-d630e725/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/prj-assumptions-constraints-dependencies-rulebook.md`
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

- F001 \[minor/vp-qe-verifiability; line=61; anchor=`""`\]: `各表と変更記録で項目 ID を必須の追跡キーとして使う一方, 「ドキュメント ID」では文書 ID しか定義していないため, 前提・制約・依存ごとの接頭辞, 文書内一意性, 採番後の不変性を規定する必要がある。`
- F002 \[minor/vp-qe-omissions-consistency; line=61; anchor=`""`\]: ``sample は `ACD-A01`・`ACD-C01`・`ACD-D01` を使用し, template も種別別 ID を要求しているが, rulebook は項目 ID の形式・一意性・安定性を定義していないため, 必須キーの規則として追加する必要がある。``
- F003 \[major/vp-qe-kata-conformance; line=120; anchor=`"推奨表:"`\]: `継続提供される基盤を依存関係とする本規定に対し, recipe の「4.1. 前提条件」は「店頭で使う端末を利用できる」を前提の例とし, sample の ACD-D01 は同じ端末可用性を依存関係としているため, 誤登録を防ぐよう分類を統一する必要がある。`
- F004 \[major/vp-qe-kata-conformance; line=120; anchor=`"推奨表:"`\]: `rulebook と sample は継続利用する端末・作業基盤を依存関係として扱うが, recipe は店頭端末の利用可能性を前提条件の例としているため, recipe による適用結果が rulebook に反しないよう分類例を統一する必要がある。`
- F005 \[minor/vp-qe-kata-conformance; line=120; anchor=`"推奨表:"`\]: `` `rulebook-authoring-standard` は章参照を章タイトルで記載するよう求めているが, 「依存関係（6.3.）」は番号で参照しているため, 「依存関係」のような章タイトル参照へ改める必要がある。 ``
- F006 \[minor/vp-qe-kata-conformance; line=148; anchor=`"### 6.5. 監視・変更管理"`\]: `依存関係の推奨表は「内容または依存先」「確認方法または成立条件」等を用いる一方, template と sample は「依存先・条件」「受領・成立条件」等を用いているため, 列の必須意味が揺れないよう名称を統一する必要がある。`
- F007 \[minor/vp-qe-kata-conformance; line=148; anchor=`"### 6.5. 監視・変更管理"`\]: `rulebook の依存関係表と template・sample の列名が一致せず, 成立条件と確認方法の必須性が異なって読めるため, rulebook を正本として同一の項目定義へ揃える必要がある。`
- F008 \[minor/vp-ux-language-consistency; line=148; anchor=`"### 6.5. 監視・変更管理"`\]: `「内容または依存先」「影響・必要な理由」「確認方法または成立条件」「トリガー」は, template・sample の「依存先・条件」「必要となる理由」「受領・成立条件」「変化のトリガー」と表記と意味範囲が異なるため, 読み手が同じ必須項目として認識できる名称へ統一する必要がある。`

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
