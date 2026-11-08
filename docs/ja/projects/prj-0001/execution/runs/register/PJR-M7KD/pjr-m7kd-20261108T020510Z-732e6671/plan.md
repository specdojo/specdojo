---
specdojo:
  id: prj-0001:xep-pjr-m7kd-20261108t020510z-732e6671
  type: exec-plan
  rulebook: none
  task_id: PJR-M7KD
  name: "概念クラス図（ccd）の型を、実装と同じことを書かない形に手入れする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: rulebook-maintenance
  targets:
    - specdojo:ccd-mermaid-rulebook
---

# Edit Plan: PJR-M7KD

## 1. このフェーズで行うこと

概念クラス図の型を手入れする。属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-M7KD/pjr-m7kd-20261108T020510Z-732e6671/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md`
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

- F001 \[major/vp-po-decision-readiness; line=60; anchor=`"- **概念クラス図ではメソッドは原則記載しない。**"`\]: `メソッドを例外的に記述できるとする一方で禁止事項ではメソッド定義を一律禁止しており、採用可能な条件や判断者を確定できない。`
- F002 \[minor/vp-po-publication-accountability; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `draft から ready へ移行して公開する際の承認者と、人間が最終判断を担うことを明記する必要がある。`
- F003 \[major/vp-pm-plan-feasibility; line=15; anchor=`"## 2. クラス（エンティティ）のルール"`\]: `CCD 作成を計画可能にするため、入力確認から作図、レビュー、完了判定までの作業単位・順序・担当 Role code・完了条件を定義する必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `記法や本文要件の変更時に sample、recipe、template、既存 CCD のどれを追従確認するかを依存関係として明記する必要がある。`
- F005 \[major/vp-pm-control-reporting; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `recipe/template の未決定や規則間の矛盾を、PJR・課題・変更要求のいずれへ転記するかと担当 Role codeを定義する必要がある。`
- F006 \[minor/vp-ba-business-value; line=5; anchor=``"本ドキュメントは、業務分析・要求定義のために **概念クラ図を Mermaid の `classDiagram` で記述する標準ルール**です。"``\]: `BA、業務担当者、レビュー担当者などの対象者と、CCD 適用によって解決する業務上の問題または確認可能な期待効果を対応付ける必要がある。`
- F007 \[major/vp-ba-requirements-completeness; line=15; anchor=`"## 2. クラス（エンティティ）のルール"`\]: `CCD 成果物に必要な章・メタデータ・図要素を必須または任意として列挙し、対象外と受入条件を利用者が確認できる形で定義する必要がある。`
- F008 \[major/vp-ba-stakeholder-clarity; line=5; anchor=``"本ドキュメントは、業務分析・要求定義のために **概念クラ図を Mermaid の `classDiagram` で記述する標準ルール**です。"``\]: `CCD の作成者、業務内容の確認者、記法レビュー担当者、最終合意者を Role code または明確な役割名で定義する必要がある。`
- F009 \[major/vp-arc-technical-constraints; line=87; anchor=`"| 関係     | Mermaid 記法  | 説明                    |"`\]: `継承記法を「子 ＜|— 親」と定義している一方、関係例では上位概念の商品を左、下位概念のお菓子を右に置いており、親子の配置方向を一意に判断できない。`
- F010 \[minor/vp-arc-conciseness; line=77; anchor=`"| カテゴリ | 推奨ラベル例                                           |"`\]: `関係ラベルの推奨語彙表は「命名・表記ルール」の表と内容が重複するため、一方を正本として統合または参照に置き換えられる。`
- F011 \[major/vp-dev-implementation-readiness; line=15; anchor=`"## 2. クラス（エンティティ）のルール"`\]: `実際の CCD ファイルを作成できるよう、対象ファイル名・ID・Frontmatter・必須構成・入力情報・完成条件を定義する必要がある。`
- F012 \[major/vp-dev-change-impact; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `関係記法や必須要素を変更した場合の既存 CCD、sample、recipe/template、生成・検証処理への影響と移行方針を明記する必要がある。`
- F013 \[major/vp-dev-testability; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `作成後の CCD を検証する lint・Mermaid 描画または build コマンド、期待結果、エラー時の修正方針を記載する必要がある。`
- F014 \[major/vp-qe-verifiability; line=95; anchor=``"- 全ての関係線に **`: 関係の意味（役割名）` を付与することを推奨（必須）**"``\]: `「推奨（必須）」という矛盾した表現になっており、ルールとして推奨なのか必須なのかが判定できない。`
- F015 \[major/vp-qe-verifiability; line=60; anchor=`"- **概念クラス図ではメソッドは原則記載しない。**"`\]: `メソッドは例外的に記述可能とされる一方、禁止事項ではメソッド定義が全面禁止されており、許容可否を判定できない。`
- F016 \[major/vp-qe-verifiability; line=87; anchor=`"| 関係     | Mermaid 記法  | 説明                    |"`\]: `継承記法の表と具体例で親概念・子概念の配置方向が一致せず、正しい記法を判定できない。`
- F017 \[major/vp-qe-verifiability; line=100; anchor=`"多重度は、Mermaid の以下の位置に記述する(原則必須)："`\]: `多重度を原則必須としながら、直後の Mermaid 例では親子関係と参照関係の多重度を省略しており、合格条件と例が一致していない。`
- F018 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `成果物作成を支援するための recipe および template が未定義（undecided）である。`
- F019 \[major/vp-qe-omissions-consistency; line=15; anchor=`"## 2. クラス（エンティティ）のルール"`\]: `rulebook-authoring-standard が必須とする「ファイル命名・ID規則」「本文要件」「記述ガイド」がなく、template 未決定時に必要な章・キーの必須・任意も定義されていない。`
- F020 \[major/vp-qe-kata-conformance; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `参照されているサンプル specdojo:ccd-sample に具体的な Mermaid CCD の記述例が含まれておらず、完成例として機能していない。`
- F021 \[major/vp-qe-kata-conformance; line=15; anchor=`"## 2. クラス（エンティティ）のルール"`\]: `rulebook-authoring-standard の必須章構成に従わず、成果物の本文要件と記述ガイドが区別されていないため、rulebook としての責務を満たしていない。`
- F022 \[major/vp-qe-kata-conformance; line=201; anchor=`"## 11. サンプル"`\]: `完成例の正本を sample とする規約に反して詳細な完成図を rulebook に置く一方、参照 sample には完成図がなく、rulebook と sample の責務が逆転している。`
- F023 \[major/vp-ux-readability; line=95; anchor=``"- 全ての関係線に **`: 関係の意味（役割名）` を付与することを推奨（必須）**"``\]: `関係線ラベルを「推奨（必須）」とする表現を、必須または推奨のどちらかへ統一し、例外の有無も明記する必要がある。`
- F024 \[minor/vp-ux-readability; line=5; anchor=``"本ドキュメントは、業務分析・要求定義のために **概念クラ図を Mermaid の `classDiagram` で記述する標準ルール**です。"``\]: `導入文の「概念クラ図」は「概念クラス図」の誤記であり、対象成果物名を初見で正確に理解できるよう修正する必要がある。`
- F025 \[major/vp-ux-language-consistency; line=60; anchor=`"- **概念クラス図ではメソッドは原則記載しない。**"`\]: `メソッド、関係線ラベル、多重度について規範語が「原則」「例外可」「推奨」「必須」「禁止」の間で不統一なため、必須・任意・禁止のラベル体系を統一する必要がある。`
- F026 \[major/vp-ops-release-readiness; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `ready 化の前提として、recipe/template の要否決定、完成 sample の整備、規則矛盾の解消、検証完了、人間の承認を明示的な公開前条件にする必要がある。`
- F027 \[major/vp-ops-operability; line=1; anchor=`"# Mermaid を用いた概念クラス図（CCD）作成ルール"`\]: `rulebook 改訂時の sample・recipe・template 同期、既存 CCD の再検証、変更記録、問い合わせ先、担当 Role codeを運用手順として定義する必要がある。`

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

- 方針（indie が決定、2026-11-08）: 属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る。
- rulebook にあわせて ccd-sample も揃える。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[specdojo:ccd-mermaid-rulebook]] に、次の規則を書いている。
  - クラスの属性は主キーだけにし、そのほかの属性は業務データ辞書（bdd）を参照する。
  - 図と本文は、関連の意味（役割名）・多重度・関係の種類に絞る。関連ごとに、業務上なぜその多重度になるかを書く。
- `ccd-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 再開時の追加の指示（orchestrator、2026-11-08）

- 親の検証 `lint-fm` が、`docs/ja/specdojo/samples/ccd-sample.md` の frontmatter の schema エラー（unevaluatedProperties）で失敗した。sample の frontmatter に `depends_on` は書けないため外す。bdd への参照は本文で示しているので、それで足りる。
- 直した後に `npm run lint:fm` を流して通ることを確かめ、経緯を報告の `handoff` に書く。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
