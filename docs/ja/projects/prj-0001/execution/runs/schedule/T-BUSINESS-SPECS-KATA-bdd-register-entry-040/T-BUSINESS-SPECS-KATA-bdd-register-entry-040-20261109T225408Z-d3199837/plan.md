---
specdojo:
  id: prj-0001:xep-t-business-specs-kata-bdd-register-entry-040-20261109t225408z-d3199837
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-bdd-register-entry-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - bdd-register-entry
    - specdojo:bdd-rulebook
---

# Edit Plan: T-BUSINESS-SPECS-KATA-bdd-register-entry-040

## 1. このフェーズで行うこと

代表成果物の実績から sf-rulebook・cdt-rulebook・ccd-mermaid-rulebook・bdd-rulebook・ifx-cmd-rulebook のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。ifx-cmd の recipe・template は後続の専用段で同期する。他の系統で新たに必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務データ辞書（登録項目個票）
- `depends_on`:  -
- `overview`: 登録項目個票（pjr）のエンティティ・属性を定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-bdd-register-entry-040/T-BUSINESS-SPECS-KATA-bdd-register-entry-040-20261109T225408Z-d3199837/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/bdd-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=5; anchor=`"本ドキュメントは、業務分析・要求定義・システム設計のために **業務データ辞書（BDD）を記述する標準ルール**です。"`\]: `導入文と全体方針がエンティティ/属性の定義と共通理解形成という同一主張を反復しているため、どちらか一方に統合する。`
- F002 \[minor/vp-dev-implementation-readiness; line=83; anchor=``"業務データ辞書のルートには `entities` キーを配置し、各エンティティの構成要素を定義する。"``\]: `The previous fragmented-table defect is resolved, but the required yaml-language-server $schema comment is only demonstrated in the example; explicitly require this comment and explain that its path must resolve from the output file's directory, because the documented full validation rejects files without it.`
- F003 \[minor/vp-dev-testability; line=200; anchor=`"- **期待結果**: YAML スキーマ検証、enum 網羅検証、用語集参照検証がすべてエラーなく完了すること。"`\]: `The previous absence of validation commands is resolved, but validate:schema:glossary checks glossary terms rather than BDD glossary_term_id or related_terms references, and bdd.schema.yaml does not enforce standalone field type requirements, enum-list exclusivity, or referenced-source consistency; add explicit manual checks or additional validators for these requirements and state the limits of command success.`
- F004 \[minor/vp-qe-omissions-consistency; line=83; anchor=``"業務データ辞書のルートには `entities` キーを配置し、各エンティティの構成要素を定義する。"``\]: `The previous placement, chapter-title, and table defects are resolved, but the YAML requirements omit the schema modeline required by validate:schema:yaml; add it as a required file-level directive so an artifact constructed from the requirements can pass the prescribed full validation.`
- F005 \[minor/vp-qe-kata-conformance; line=220; anchor=``"完成例の正本は `specdojo:bdd-sample`（`docs/ja/specdojo/samples/bdd-sample.yaml`）を参照する。以下に、3つのエンティティ定義形態の最小例を示す。"``\]: `The previous type, ID, and enum-key inconsistencies are resolved, but this paragraph repeats the sample relationship in the body despite the Rulebook Authoring Standard requiring that relationship to be declared only in Frontmatter; retain the existing sample declaration and the permitted transitional minimal example, and remove the repeated body reference.`
- F006 \[minor/vp-ops-release-readiness; line=20; anchor=``"- ルールブック内の enum 値網羅検証（`npm run validate:schema:rulebook-enums`）に合格していること。"``\]: `validate:schema:rulebook-enums skips draft rulebooks, including the current bdd-rulebook, so a successful command exit does not establish this target's pre-ready enum coverage; document a candidate-validation procedure and require target-specific coverage evidence before final approval.`
- F007 \[minor/vp-ops-operability; line=59; anchor=``"- 用語集（`gl-*.yaml`）や概念クラス図（CCD）が改訂された場合は、保守担当（BA / ARC）が関連する `bdd-*.yaml` の `logical_name`, `glossary_term_id`, `related_terms` を同期更新する。"``\]: `Extend the BA/ARC update procedure to changes in schema_ref and type_ref sources, including field renames, key changes, and enum-value changes, and require reconciliation of the dictionary's business annotations before accepting the update; the current trigger covers only glossary and CCD revisions.`

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

`共通規約 sha256:24a7a34ab9b496c7ba6c9bad3f495690243e40758ea99ff8d55c445ebbb0cb81` `docs/ja/projects/prj-0001/execution/conventions/24a7a34ab9b496c7ba6c9bad3f495690243e40758ea99ff8d55c445ebbb0cb81.txt`
