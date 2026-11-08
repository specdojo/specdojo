---
specdojo:
  id: prj-0001:xep-pjr-mecy-20261108t020509z-5d09a989
  type: exec-plan
  rulebook: none
  task_id: PJR-MECY
  name: "業務データ辞書（bdd）の型を、実装と同じことを書かない形に手入れする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
---

# Edit Plan: PJR-MECY

## 1. このフェーズで行うこと

業務データ辞書の型を手入れする。schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-MECY/pjr-mecy-20261108T020509Z-5d09a989/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/bdd-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_MISSING_**
- 責務: _MISSING_

このロールが重視するレビュー観点:

- _MISSING_

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=119; anchor=``"- 技術的属性（`created_at`, `updated_at`, `deleted_at` など）を原則含めない。"``\]: `「技術的属性（created_at 等）を原則含めない」の例外を認める条件と判断者が未記載のため、例外可否の判断基準を明記する。`
- F002 \[minor/vp-pm-plan-feasibility; line=9; anchor=`"## 1. 全体方針"`\]: `業務データ辞書の完成条件（必須キー充足・schema 検証合格・用語集/CCD 照合済み等）が未定義のため、作業完了を判定できる完了条件を全体方針または記述ガイドに追記する。`
- F003 \[minor/vp-pm-dependency-risk; line=19; anchor=``"- `glossary_term_id` は用語集との参照キー、`related_terms` は関連用語への補助参照を指す。"``\]: `成果物の検証正本である bdd schema への依存が本文に記載されておらず、rulebook と schema の乖離リスクが識別されていないため、依存関係として明記する。`
- F004 \[major/vp-ba-requirements-completeness; line=50; anchor=`"| キー | 説明 | 必須 |"`\]: `本文要件の表（ルートキー・entities・fields）が空行で分断され entities/key_fields/fields/type 等の必須・任意が表として判読できないため、空行を除去して一つの表に統合する。`
- F005 \[minor/vp-ba-requirements-completeness; line=73; anchor=`"| ------------- | ---------------------------------- | ---- |"`\]: `enum フィールドで必須となる allowed_values / allowed_values_detailed が fields の標準構成表に含まれていないため、条件付き必須キーとして表へ追加する。`
- F006 \[minor/vp-ba-stakeholder-clarity; line=7; anchor=`"データの意味や構造に関する共通理解を関係者間で図り、システム設計や実装の基礎情報として活用します。"`\]: `「関係者」が抽象的で、作成者・利用者・確認者（Role code）と合意対象が特定されていないため、主要な関係者と確認観点を明記する。`
- F007 \[major/vp-arc-technical-constraints; line=25; anchor=``"- `id` は正規表現 `^bdd-[a-z0-9-]+$` に合致する一意IDを用いる。"``\]: ``ID 正規表現 `^bdd-[a-z0-9-]+$` が bdd schema の pattern（project 修飾を許容）より狭く正本と矛盾するため、schema と一致させるか project 修飾の扱いを明記する。``
- F008 \[minor/vp-arc-conciseness; line=5; anchor=`"本ドキュメントは、業務分析・要求定義・システム設計のために **業務データ辞書を記述する標準ルール**です。"`\]: `導入文と全体方針がエンティティ/属性の定義と共通理解形成という同一主張を反復しているため、どちらか一方に統合する。`
- F009 \[major/vp-dev-implementation-readiness; line=57; anchor=`"| サブ項目      | 説明                               | 必須 |"`\]: `entities / fields の標準構成表が空行で複数に分断され、key_fields・fields・type 等の必須キーが表外の断片となり YAML 構造を正しく読み取れないため、表を修復する。`
- F010 \[minor/vp-dev-change-impact; line=9; anchor=`"## 1. 全体方針"`\]: `rulebook 変更時に同期が必要な bdd schema・sample・用語集/CCD への影響範囲が記載されていないため、変更時の同期対象を明記する。`
- F011 \[major/vp-dev-testability; line=94; anchor=`"## 6. 記述ガイド"`\]: `YAML 成果物の検証手順（bdd schema を用いた validate:schema:file 等のコマンド・期待結果）が一切記載されておらず作成後の合否確認ができないため、検証手順を追記する。`
- F012 \[major/vp-qe-verifiability; line=50; anchor=`"| キー | 説明 | 必須 |"`\]: `必須・任意を示す本文要件表が分断され必須キー充足の pass/fail を判定できないため、表を修復する。`
- F013 \[minor/vp-qe-verifiability; line=37; anchor=`"Frontmatter と同等の以下の項目をYAMLドキュメントの先頭に必ず定義してください。"`\]: `見出し「推奨 Frontmatter 項目」と本文「必ず定義してください」で強制度が矛盾しているため、必須か推奨かを一意に表現する。`
- F014 \[minor/vp-qe-verifiability; line=122; anchor=`"- 物理名と論理名で英語・日本語を無秩序に混在させない。"`\]: `「無秩序に混在させない」は判定不能な表現のため、論理名は日本語・物理名は英語 lower_snake_case のように判定可能な条件に置き換える。`
- F015 \[minor/vp-qe-omissions-consistency; line=29; anchor=`"### 3.2. ファイル命名規約"`\]: `推奨される配置ディレクトリの記述が不足しており、プロジェクト内での標準的な配置場所が不明である。`
- F016 \[major/vp-qe-omissions-consistency; line=57; anchor=`"| サブ項目      | 説明                               | 必須 |"`\]: `entities / fields の必須キー定義表が空行で分断され、key_fields・fields・type 等の必須キーが表から欠落した状態のため、表を修復して必須キーの抜けをなくす。`
- F017 \[minor/vp-qe-omissions-consistency; line=48; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `章見出し「本文構成（標準テンプレ）」が authoring standard の標準章名「本文要件」と不一致で、template: not-needed とも表現が矛盾するため、見出しを揃える。`
- F018 \[major/vp-qe-kata-conformance; line=17; anchor=``"- 本ルールは `type: data` の成果物に適用する。"``\]: `成果物の種別（type: data）と、メタデータ項目としての設定値（type: domain）の内容が矛盾しており、正解の設定値が不明確である。`
- F019 \[major/vp-qe-kata-conformance; line=25; anchor=``"- `id` は正規表現 `^bdd-[a-z0-9-]+$` に合致する一意IDを用いる。"``\]: ``IDの正規表現 `^bdd-[a-z0-9-]+$` が、サンプル (`specdojo:bdd-sample`) のID形式（コロンを含む形式）と矛盾している。``
- F020 \[minor/vp-qe-kata-conformance; line=73; anchor=`"| ------------- | ---------------------------------- | ---- |"`\]: `sample と schema が使用する allowed_values_detailed / allowed_values が rulebook の fields 標準構成表に定義されておらず Kata 間で必須キー定義が不一致のため、表へ追加する。`
- F021 \[major/vp-ux-readability; line=50; anchor=`"| キー | 説明 | 必須 |"`\]: `本文要件の表が空行で分断され、描画時にヘッダーのみの空表と孤立行が並び主要なキー構造と必須/任意を読み取れないため、表を連続させる。`
- F022 \[minor/vp-ux-language-consistency; line=17; anchor=``"- 本ルールは `type: data` の成果物に適用する。"``\]: `「type」という用語が成果物の種別とメタデータ項目名の両義的に使用されており、混同を招く恐れがある。`
- F023 \[minor/vp-ux-language-consistency; line=12; anchor=`"- 業務上の管理単位（エンティティ）と属性（フィールド）の意味・制約・例値を、判断可能な粒度で記述する。"`\]: `属性を指す語が「属性」「項目」「フィールド」で混在しているため、fields に対応する用語へ統一する。`
- F024 \[minor/vp-ops-release-readiness; line=9; anchor=`"## 1. 全体方針"`\]: `ready 化の前提条件（schema との pattern 整合、type 矛盾の解消、rulebook-enums 検証合格）が明示されていないため、ready 判定条件を記載する。`
- F025 \[minor/vp-ops-operability; line=27; anchor=``"- 置き換えがある場合は `supersedes` に旧IDを列挙する。"``\]: `supersedes 以外の継続更新手順（用語集/CCD 変更時の追従、フィールド廃止時の扱い、保守担当 Role code）が未記載のため、変更管理の手順を追記する。`

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 方針（indie が決定、2026-11-08）: schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする。
- rulebook にあわせて bdd-sample も揃える。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[specdojo:bdd-rulebook]] に、次の規則を書いている。
  - schema があるエンティティは、schema を正として参照する（参照の書き方とキー名は executor が決める）。
  - fields には、schema から読めない業務上の意味（項目の業務的な定義、enum の値が表す業務上の状態など）だけを書く。型・必須・パターンなど schema にある制約は繰り返さない。
  - schema のないエンティティは、今の形で fields を書くか、TypeScript の型を参照する。どちらを選ぶかの基準を書く。
- `bdd-sample` を新しい規則に合わせ、schema を参照するエンティティと、schema のないエンティティの両方の例を載せている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
