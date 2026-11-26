---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-assumptions-constraints-dependencies-sample-140-20261126t060705z-e138722d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-140/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-140-20261126T060705Z-e138722d/plan.md
  started_at: "2026-11-26T06:07:16.007Z"
  completed_at: "2026-11-26T06:10:55.860Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-assumptions-constraints-dependencies-sample
    - specdojo:prj-assumptions-constraints-dependencies-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を実施した。sample の事実を成功条件、憲章、スコープ、pm-plan、pm-members、rulebook と突き合わせ、誤りを 3 件直した。
- 直した内容は、ACD-D04 の初期受入の条件 ID（2 か所）と、ACD-D01 の未定義の担当名である。
- 本文冒頭の wikilink 先、スコープ・憲章・pm-plan の参照、列名と項目 ID の規則、frontmatter は一致していた。PJR-KN01 や `kinuya-*` などの記録名は正本のない仮定として確かめの対象外にした。
- 検証は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別により非適用になった検査はない扱いで runner が保持している。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 3. 依存関係（ACD-D04） | 初期受入の必須条件が「SC-01・AC-01〜AC-04」で、成功条件の必須条件（SC-01・SC-07・SC-09・AC-01〜AC-05）と食い違う。 | 「SC-01・SC-07・SC-09・AC-01〜AC-05 を正とする」に直した。 | vp-qe-verifiability。正本は成功条件と受入基準の sample の「判定対象と適用範囲」と「判定手順と証跡」の 2 番。 | - |
| R4-2 | R4 | 3. 依存関係（ACD-D04） | 「SC-02 以降の将来測定を初期受入の証拠に使わない」は、初期受入で判定する SC-07・SC-09 まで含んでしまう。 | 「運用開始後に判定する SC を初期受入の証拠に使わない」に直した。 | vp-arc-technical-constraints。正本は成功条件の「判定対象と適用範囲」（運用開始後は SC-02〜SC-06・SC-08・SC-10）。 | - |
| R4-3 | R4 | 3. 依存関係（ACD-D01） | 「店番担当」は pm-members-sample.yaml と pm-organization-sample にない担当名である。 | 「その日の店番をする代表」に直した。「店番担当」を member に足す案は採らなかった。 | vp-dev-implementation-readiness。member は店主代表・開発担当・同行レビュー担当・技術メンター・家族利用者代表で、スコープでは店番を店主代表と家族利用者代表が担う。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md`: ACD-D04 の初期受入の必須条件を成功条件の正本に合わせて「SC-01・SC-07・SC-09・AC-01〜AC-05」に直した。「SC-02 以降の将来測定を使わない」の表現を「運用開始後に判定する SC を使わない」に直した。ACD-D01 の未定義の「店番担当」を「その日の店番をする代表」に直した。prettier により表の列幅も調整されている。差分は 6 行追加・6 行削除。

## 3. 申し送り

- frontmatter の `status` は `ready` のまま触っていない。直した内容を人が採るか確かめる必要がある。
- R4-3 の「店番担当」は、member に足す案を採らず文言の置き換えにした。担当名を member として定義するかは人の判断に残る。
- R4-1: R4 / 3. 依存関係（ACD-D04） / 初期受入の必須条件が「SC-01・AC-01〜AC-04」で、成功条件の必須条件（SC-01・SC-07・SC-09・AC-01〜AC-05）と食い違う / 「SC-01・SC-07・SC-09・AC-01〜AC-05 を正とする」に直した / vp-qe-verifiability。正本は prj-success-criteria-and-acceptance-criteria-sample の「判定対象と適用範囲」と「判定手順と証跡」の 2 番 / -
- R4-2: R4 / 3. 依存関係（ACD-D04） / 「SC-02 以降の将来測定を初期受入の証拠に使わない」は、初期受入で判定する SC-07・SC-09 まで含んでしまう / 「運用開始後に判定する SC を初期受入の証拠に使わない」に直した / vp-arc-technical-constraints。正本は成功条件の「判定対象と適用範囲」（運用開始後は SC-02〜SC-06・SC-08・SC-10） / -
- R4-3: R4 / 3. 依存関係（ACD-D01） / 「店番担当」は pm-members-sample.yaml と pm-organization-sample にない担当名 / 「その日の店番をする代表」に直した / vp-dev-implementation-readiness。pm-members-sample.yaml の member は店主代表・開発担当・同行レビュー担当・技術メンター・家族利用者代表で、スコープでは店番を店主代表と家族利用者代表が担う。「店番担当」を member に足す案は採らなかった / 要判断
- 確かめの表（R4）: 1 本文冒頭の wikilink 先（成功条件・pm-plan・スコープ・憲章・課題ログ・リスク登録簿・変更要求ログ） / samples 配下の各ファイル / ファイルの有無と H1 を読んだ / 一致 / 各 sample が存在する。2 前提条件の章の、スコープ「対象業務」「スコープ外」「境界の判断基準」 / prj-scope-sample.md / 見出しを読んだ / 一致 / 1・4・5 章にある。境界の判断基準の 3 番が操作の単純化にあたる。3 ACD-A01 の SC-02・SC-03 / 成功条件の成功基準の表 / 表を読んだ / 一致 / 記録継続と負担。運用開始後 2 週間に判定。4 ACD-A02 の、憲章「未決事項」にオフライン時の扱いが残る / prj-charter-sample.md の未決事項 / 表を読んだ / 一致 / 論点「オフライン時の扱い」がある。5 制約事項の章の、憲章「主要前提・制約」の支出・公開情報 / prj-charter-sample.md の主要前提・制約 / 表を読んだ / 一致 / 費用上限と公開禁止の情報の 2 つの制約がある。6 ACD-C02 の、pm-plan の U-01 を店主代表が承認する / pm-plan-sample.md / U-01 を grep した / 一致 / U-01 は現金支出上限で、PM が提示し PO が判断する。7 ACD-D03 の、初期受入の対象外とする扱いは決定済み・記録方法は未決 / prj-scope-sample.md のスコープ外と、成功条件の例外条件と未解決事項 / 読んだ / 一致。8 ACD-D04 の初期受入の条件 ID / 成功条件の判定対象と適用範囲 / 読んだ / 不一致（R4-1・R4-2 で直した）。9 ACD-D01 の店番担当 / pm-members-sample.yaml / grep した / 不一致（R4-3 で直した）。10 開発担当の Role（PM・DEV） / pm-members-sample.yaml / 読んだ / 一致 / developer の roles は PM・BA・DEV。11 同行レビュー担当・技術メンター / pm-members-sample.yaml / 読んだ / 一致 / roles は QE と ARC。12 3 つの表の列と項目 ID の規則 / prj-assumptions-constraints-dependencies-rulebook.md の項目 ID と各章 / 読んだ / 一致 / 列名がそろい、旧 ACD-C01 の廃止と非再利用も規則どおり。13 frontmatter（type project、rulebook、`based_on`、supersedes） / rulebook の `deliverable_type` と deliverable-frontmatter.schema.yaml / 読んだ / 一致（schema の検証は親 runner の lint-fm に任せる）。14 PJR-KN01・`kinuya-*` の記録 / 正本なし / 本文で架空の参照名と明記 / 確かめない / 共通サンプル文脈の仮定として対象外。
- 申し送り: 本 sample の frontmatter の status は ready のまま触っていない。直した内容を人が採るか確かめる必要がある。

## 4. 進め方と実践の型の適用

根拠は、成功条件と受入基準の sample（判定対象と適用範囲、判定手順と証跡）、スコープ、憲章、pm-plan、pm-members の sample、前提・制約・依存関係の rulebook である。sample の事実を主張ごとに突き合わせ、一致した記述は維持した。不一致の 3 件だけを最小限に直した。矛盾時は成功条件の正本と rulebook を正とした。plan に展開された grade と condense の finding はなく、根拠不足で見送った項目もない。確かめた主張は 14 件で、一致 12 件、不一致 2 件（R4-1・R4-2 は ACD-D04 の 1 件の主張、R4-3 は ACD-D01 の主張）である。確かめなかったのは PJR-KN01 などの架空の参照名で、共通サンプル文脈の仮定として対象外にした。
