---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dss-sample-140-20261125t072010z-b5bd1110
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dss-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dss-sample-140/T-KATA-REVIEW-ALL-dss-sample-140-20261125T072010Z-b5bd1110/plan.md
  started_at: "2026-11-25T07:20:19.516Z"
  completed_at: "2026-11-25T07:34:41.403Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dss-sample
    - specdojo:dss-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `dss-sample` の事実を、schema、rulebook、参照先 sample と突き合わせた。
- 不一致は 2. 正本と適用方法 の Role code の説明 1 件だった。ARC、QE、PO の説明を正本 `pm-roles-sample.yaml` の名前に合わせて直した。
- ARC を更新責任とする割り当ては、`pm-roles-sample.yaml` の ARC の `project_note` と合わない。R5 の整合にかかわるため直さず、要判断として申し送る。
- 検査は executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dss-sample.md`: 2. 正本と適用方法 の Role code の説明を修正した（1 行の差分）。「ARC は GUI 設計担当、QE は品質保証担当」を、正本 `pm-roles-sample.yaml` の名前に合わせて「ARC は Architect、QE は Quality Engineer、PO は Project Owner で、本例では店主代表」に直した。

## 3. 申し送り

- R4-2 の ARC の更新責任の割り当ては未解決で、判断が要る。選択肢は、更新責任を UX または DEV へ移す案と、`pm-roles-sample` の ARC の注記に GUI の共通表現を加える案の 2 つ。R5 の整合で扱う。
- 主張ごとの確かめの表は、result の実施内容に書いた。
- R4-1: R4 / 2. 正本と適用方法 / Role code の説明「ARC は GUI 設計担当、QE は品質保証担当」が正本 `pm-roles-sample.yaml` の名前（ARC=Architect、QE=Quality Engineer、PO=Project Owner）と合わない / 「ARC は Architect、QE は Quality Engineer、PO は Project Owner で、本例では店主代表」に直した / `vp-arc-technical-constraints`、`docs/ja/specdojo/samples/pm-roles-sample.yaml` の roles / -
- R4-2: R4 / 2. 正本と適用方法 / 正本の表がトークン・部品・アクセシビリティの更新責任を ARC にしているが、`pm-roles-sample.yaml` の ARC の `project_note` は「構成・データ管理方針の専門支援、初期は独立タスクの主責任を持たない」となっている / - / `vp-dev-implementation-readiness`。役割の割り当ては R5 の整合（同じ系列の sample）にかかわるため直していない。選ばなかった案は、更新責任を UX（画面文言・操作説明の専門支援）または DEV（設計を主導）へ移す案、または `pm-roles-sample` の ARC の注記に GUI の共通表現を加える案 / 要判断
- 確かめ1: 主張=frontmatter の `type: architecture` / 正本=`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/dss-rulebook.md` / 確かめ方=deliverableType の enum と rulebook の `deliverable_type` を読み取り / 結果=一致 / 根拠=enum に `architecture`、rulebook の `deliverable_type: architecture`
- 確かめ2: 主張=frontmatter の `rulebook: specdojo:dss-rulebook`、`based_on: specdojo:uis-sample` / 正本=`dss-rulebook.md`、`uis-sample.md` の id / 確かめ方=grep で id を読み取り / 結果=一致 / 根拠=両ファイルの `id`、rulebook の `sample: specdojo:dss-sample`
- 確かめ3: 主張=wikilink `specdojo:uis-sample`・`specdojo:pm-roles-sample`・`specdojo:pjr-rulebook` / 正本=各ファイルの id / 確かめ方=grep / 結果=一致 / 根拠=`uis-sample.md`、`pm-roles-sample.yaml`、`pjr-rulebook.md` に id がある
- 確かめ4: 主張=Role code の ARC・QE・PO の説明（2. 正本と適用方法） / 正本=`docs/ja/specdojo/samples/pm-roles-sample.yaml` / 確かめ方=roles の code・name を読み取り / 結果=不一致（R4-1 で直した） / 根拠=ARC: Architect、QE: Quality Engineer、PO: Project Owner
- 確かめ5: 主張=通常文字と背景のコントラストが 4.5:1 以上（`dss-a11y-03`、色トークン） / 正本=WCAG の相対輝度の式 / 確かめ方=`node tmp/contrast.mjs` / 結果=一致 / 根拠=text/surface 17.74、text/canvas 16.12、muted/surface 7.56、muted/canvas 6.87、on-action/primary 6.70、on-action/danger 6.47、danger/surface 6.47、success/surface 7.13、muted/disabled-surface 6.10
- 確かめ6: 主張=識別枠と隣接面が 3:1 以上（`dss-a11y-03`） / 正本=WCAG の相対輝度の式 / 確かめ方=`node tmp/contrast.mjs` / 結果=一致 / 根拠=border/surface 4.83、border/canvas 4.39、primary（フォーカス枠）/surface 6.70、primary/canvas 6.09
- 確かめ7: 主張=登録簿の issue・todo・change-request・decision（8.3. 変更・不適合・例外） / 正本=`docs/ja/specdojo/rulebooks/pjr-rulebook.md`、`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` / 確かめ方=grep で種別の表と enum を読み取り / 結果=一致 / 根拠=pjr-rulebook の種別の表に 4 種があり、schema の enum に `change-request` がある
- 確かめ8: 主張=想定の文書 ID `nfr-usability`・`sac-usability`・`stc-store-gui`・`sysd-index`・`sysd-cross-cutting-policy`（8.1. 検証） / 正本=`docs/ja/specdojo/rulebooks/` の nfr-usability・sac・stc・sysd-index・sysd-cross-cutting-policy の rulebook、dss-rulebook の位置づけの表 / 確かめ方=ls と grep / 結果=一致（利用先の想定 ID として接頭辞が rulebook に沿う） / 根拠=対応する rulebook が存在し、dss-rulebook の位置づけの表に操作性要件・横断ルール・全体構成がある
- 確かめ9: 主張=44px の操作領域、200% の拡大、幅 360px、フォーカス枠の 3px・2px 離し、NVDA と Firefox での読み上げ確認 / 正本=なし（本例の設計上の選択） / 確かめ方=- / 結果=確かめられない（対象外） / 根拠=正本のない設計値で、共通サンプル文脈と食い違わないため確かめの対象にしない

## 4. 進め方と実践の型の適用

sample-maintenance として R4 を実施した。根拠にしたのは、`deliverable-frontmatter.schema.yaml`、`dss-rulebook.md`、`uis-sample.md`、`pm-roles-sample.yaml`、`pjr-rulebook.md`、`register-item-frontmatter.schema.yaml` と、WCAG の相対輝度の式によるコントラスト計算。確かめた主張は、frontmatter の `type`、`rulebook`、`based_on`、wikilink の id、登録簿の 4 種別、想定の文書 ID、コントラスト比。Role code の説明だけが不一致で、直した。44px や 200% などの設計値は正本がなく、共通サンプル文脈と食い違わないため、確かめの対象にしなかった。grade と condense の finding は plan になかった。ARC の更新責任は根拠上の判断が要るため推測で直さず、申し送りに残した。
