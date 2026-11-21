---
specdojo:
  id: prj-0001:xep-t-project-kata-pm-roles-040-20261112t212941z-0f9075ca
  type: exec-plan
  rulebook: none
  task_id: T-PROJECT-KATA-pm-roles-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-roles
    - specdojo:pm-roles-rulebook
---

# Edit Plan: T-PROJECT-KATA-pm-roles-040

## 1. このフェーズで行うこと

代表成果物の実績から pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: ロール定義
- `depends_on`:
  - [[prj-0001:pm-organization]]
- `overview`: 全 Role code を machine-readable な YAML として一覧化する
- `path`: `docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-PROJECT-KATA-pm-roles-040/T-PROJECT-KATA-pm-roles-040-20261112T212941Z-0f9075ca/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`
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

- F001 \[minor/vp-arc-conciseness; line=72; anchor=`"| 要素         | 必須 | 内容                 |"`\]: ``第5章の `id` から `project_id` までの表は第4章のメタ項目表と重複するため, メタ項目は第4章へ一本化し、第5章は `roles` のルート要件だけに絞る必要がある。``
- F002 \[minor/vp-arc-conciseness; line=104; anchor=``"- `code` には標準 Role code のみを使用する。"``\]: `` `roles[].code` 節の標準コード限定・独自コード禁止は直前の `roles` 節と重複するため、配列全体の規則と各 code 値の規則を分担させて反復を除く必要がある。 ``
- F003 \[major/vp-qe-omissions-consistency; line=11; anchor=``"- 標準 Role code は `PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS` を基本セットとし、プロジェクト内で採用する責務語彙をこの集合から選ぶ。"``\]: ``上位標準では `PO` が最低限の必須 Role code だが、本行は8コードから任意に選べるように読めるため、`roles` に `PO` を必須とする条件を明記しなければ最終判断主体を欠く成果物を許してしまう。``
- F004 \[major/vp-qe-kata-conformance; line=61; anchor=``"| `rulebook` | `specdojo:pm-roles-rulebook` 固定 | ○ |"``\]: `` `rulebook` は schema の必須キーで sample・template にも存在する一方、対応 recipe が schema 非許可キーとして追加を禁止しているため、recipe の手順と悪い例を本行および schema に合わせて修正しなければ生成物が schema 不適合になる。 ``
- F005 \[major/vp-qe-kata-conformance; line=1; anchor=`"# プロジェクトロール定義 作成ルール"`\]: ``対応 recipe が本章の構造・必須キー・禁止事項を独自に再定義し、特に必須の `rulebook` を禁止しているため、recipe は問いと作成手順に責務を限定し、本 rulebook・schema と矛盾しない内容へ修正する必要がある。``
- F006 \[minor/vp-qe-kata-conformance; line=27; anchor=``"| `pm-roles.yaml` | 採用した Role code を machine-readable な YAML として一覧化する | `owner` 語彙、Role code 名、プロジェクト固有メモ |"``\]: ``本行は `pm-roles.yaml` を `owner` 語彙の正本とするが、`based_on` の人と組織の定義標準は採用 Role code と使用可能な `owner` を `pm-organization.md` の管理対象としているため、正本と machine-readable な転記先の関係を両文書で統一する必要がある。``
- F007 \[minor/vp-ux-readability; line=72; anchor=`"| 要素         | 必須 | 内容                 |"`\]: ``第4章とほぼ同じメタ項目表を再掲しているため、第5章を `roles` 固有のルート構造と配列要件に絞り、初見の読者が主要な判断点へ直接進める構成にする必要がある。``

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

`共通規約 sha256:9207f71312ebef46f71291a44eb339b25eb72de6d0e2075104b28fd5ac1120bd` `docs/ja/projects/prj-0001/execution/conventions/9207f71312ebef46f71291a44eb339b25eb72de6d0e2075104b28fd5ac1120bd.txt`
