---
specdojo:
  id: prj-0001:pjr-vcer-kata-wave-3-catalog-schedule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T06:08:04Z"
  derived_from:
    - PJR-ABY4
---

# PJR-VCER 第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）

## 1. 概要

dct-kata.yaml を作って試験の型 13 種類の sample を成果物として載せ、kata-wave-3 の strategy と schedule を作る

## 2. 入力

- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml、`base_path` /docs/ja/specdojo、グループ samples）に sample を kind: work の成果物として載せ、`local_id` は `<name>-sample`、rulebook は対応の型。代表は sample そのもの（駄菓子屋の共通の文脈）
- 2026-11-21 の試し（trial/prj-0001/kata-sample-catalog、commit せず捨てた）: dct-kata.yaml に tsp-index-sample と utc-sample を載せ、dct-index.yaml に domain kata を足すと、catalog validate・catalog build・index build・exec plan --deliverable utc-sample が通った。plan の targets は sample の frontmatter の ID（specdojo:utc-sample）になった
- PJR-ABY4 の範囲: 段は rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template は PJR-WYTX で扱う
- 2026-11-21 から opus で型の grade をし直している（run id regrade-kata-2026-11-21）。結果は docs/ja/projects/prj-0001/execution/grade/results/`specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml`
- agy（Antigravity）は使わない（PJR-5V0T）

## 3. 完了条件

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` を作り、`dct-index.yaml` に domain `kata` を足す。試験の型 13 種類（tsp-index・utc-index・utc・itc-index・itc・stc-index・stc・etc-index・etc・atc-index・atc・trc-requirements-to-tests・imp-test）の sample を、`kind: work`・`local_id: <name>-sample`・`rulebook: specdojo:<name>-rulebook` の成果物として載せる。
- 各成果物の `done_criteria` は、型に共通の条件（rulebook の章立てと必須の表に沿う、sample の作成標準と共通のサンプル文脈に沿う、rulebook の禁止事項に当たらない）を基本にし、型に固有の条件を足す。固有の条件は、grade のし直しの結果（`execution/grade/results/specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml` の findings）から、型ごとに大きい指摘を拾って書く。grade の結果がまだ無い型は、共通の条件だけにして対応結果に書く。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml` を作り、`schedule build --track kata-wave-3` で `sch-track-kata-wave-3.yaml` を生成する。track は手で編集しない。
- 段は PJR-ABY4 の範囲に従う（rulebook を簡潔に → sample を厚く → condense → review → 人の確定）。recipe のある型は、rulebook に合わせて recipe を直す段を足す。template の段は入れない（PJR-WYTX で扱う）。成果物が sample そのものなので、sample を整える段と成果物を磨く段が同じファイルを触る。どちらの approach で組むかは executor が決め、`exec plan --track kata-wave-3` の dry-run で、各段の plan の対象と手本が食い違わないことを確かめて対応結果に書く。
- 段ごとの agent は strategy の `phase_overrides[].agent` で決める。edit の段は `opus-executor`、review の段は `sol-review-executor`、reporter は `gemma26-reporter`、人の確定は利用者とする。agy の member は使わない。
- 先行の track の前例（`sch-strategy-kata-wave-1.yaml`・`sch-strategy-kata-slim-2.yaml`）の書き方に合わせる。
- この項目では schedule のタスクを実行しない。
- `npm run validate:schema`（strategy と track の YAML の `task_suffix` などの文字列が数値に変わっていないことを含む）・`npx specdojo catalog validate`・`npx specdojo exec validate`・`npm run lint:md` が通り、親の検証が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に、利用者に影響が無いことを書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                               |
| --- | ------------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | `dct-kata.yaml` と `dct-index.yaml` の domain     | DEV  | done | 検証の修正を含む（対応結果を参照） |
| 2   | 13 種類の `done_criteria` を grade の結果から書く | DEV  | done | 26 件すべての grade の結果がある   |
| 3   | strategy を作り、track を生成する                 | DEV  | done | 65 タスク                          |
| 4   | plan の dry-run で段の組み方を確かめる            | DEV  | done | 対応結果を参照                     |

## 5. 対応結果

### 5.1. 実施内容

- `dct-kata.yaml` を作り、13 種類の sample を `kind: work`・`local_id: <name>-sample`・`rulebook: specdojo:<name>-rulebook` で載せた。`dct-index.yaml` には大分類「実践の型」を足し、domain `kata` を置いた。
- `depends_on` はテストの型の上下関係（tsp-index → 各 `*-index` → 対象別、trc は atc・stc の後）に合わせた。imp-test は範囲内に上位の型が無いので `[]` とした。
- `done_criteria` は、共通の 3 条件に、型に固有の条件を 2〜4 件足した。固有の条件は、13 種類 × rulebook・sample の 26 件の grade の結果（opus、2026-11-21）から、blocker と major の指摘（`vp-qe-kata-conformance`・`vp-qe-omissions-consistency`・`vp-qe-verifiability` が中心）を拾って書いた。grade の結果が無い型は無い。
- grade が `title` を足すよう指摘した件（itc-sample）は、Markdown 記述ルールが frontmatter の `title` を禁じているので、条件に入れなかった。
- `sch-strategy-kata-wave-3.yaml` を作り、`schedule build --track kata-wave-3` で `sch-track-kata-wave-3.yaml`（65 タスク）を生成した。track は手で編集していない。`sch-milestones.yaml` にはゲート 2 件とマイルストーン 1 件が追記された（既存の項目は値が変わっていない）。

### 5.2. 決めたことと理由

- 段は rulebook-maintenance（040）→ sample-maintenance（050）→ condense（080）→ review（090、`mode: review`・`fully-guided`）→ finalize（140、`execution: human`）とした。recipe を持つ型が 13 種類に無く、template は PJR-WYTX で扱うので、どちらの段も置いていない。
- sample を厚くする段の approach は `sample-maintenance` とした。成果物と sample が同じファイルなので、`fully-guided` にすると対象の sample が自分の手本を兼ねる。`sample-maintenance` なら手本が rulebook、対象が sample になる。成果物を磨く `refine` の段は置かず、成果物の `done_criteria` はこの段で満たすよう description に書いた。
- finalize は `bootstrap-finalize` ではなく `finalize` とした。recipe・template は `undecided` で一式の確定の対象にならないので、直した rulebook の確認は description で求めた。
- owner は QE とした（試験の型のため）。agent は `owner_rules[].phase_overrides[].agent` で決めた。edit の段（040・050・080）は `opus-executor`、review の段は `sol-review-executor`、reporter はすべて `gemma26-reporter`。finalize は human の段なので agent を置いていない。agy の member は使っていない。
- 書き方は kata-wave-1・project-kata に合わせた（ゲートとドメインのマイルストーン、`task_suffix` の文字列）。

### 5.3. カタログ検証の修正

kata ドメインに載せると、`catalog validate` が sample の `based_on`（駄菓子屋の世界の ID。例: trc の `utc-index`・`itc-index`、imp-test の `cr-2026-004`）を prj-0001 の成果物として照合し、エラーを 3 件出した。今後の sample の段で `based_on` を足す指摘（tsp-index など）に応えると、エラーはさらに増える。

そこで `src/catalog/build-references.ts` の `validateBasedOn` を直した。文書の `id` が catalog の project 以外の名前空間（`specdojo:` など）で修飾されているときは、その `based_on` を照合しない。`tests/src/catalog/based-on.test.ts` にテストを 1 件足した。

この 2 ファイルは完了条件に挙がっていない。それでも直したのは、完了条件の「`catalog validate` が通る」を kata ドメインで満たすためである。再開の際に `build-references.ts` を HEAD の内容へ一時的に戻して `catalog validate --project prj-0001` を実行すると、`dct-kata.yaml` についてエラー 3 件（trc-requirements-to-tests-sample の `utc-index`・`itc-index` が `depends_on` の推移閉包に無い、imp-test-sample の `cr-2026-004` を解決できない）で失敗した。直した版ではエラーは 0 件だった。sample の `based_on` を消して通すと、sample が駄菓子屋の文脈で示すトレーサビリティの手本が崩れるので、検証の側を直した。

### 5.4. 単体テストのフィクスチャの更新

`schedule build` が `sch-milestones.yaml` に第 3 波のゲートとマイルストーンを足したので、`tests/src/docs/yaml-tables.test.ts` が比べる `tests/fixtures/yaml-pages/prj-0001--sch-milestones.md.snap` を作り直した。このテストは `toBe` でファイルと比べるので、`vitest -u` では更新されない。そのため `renderYamlPage` の出力をファイルへ書き戻した（47 行の追加だけ）。作り直した後、このテストは 38 件すべて通った。

### 5.5. plan の dry-run の結果

`exec plan --project prj-0001` で、utc-sample の 4 つの段（040・050・080・090）と trc-requirements-to-tests-sample の 050 の plan を `tmp/` へ作って確かめた。

| 段                         | `targets`                                      | 編集の対象                                   | 手本・根拠                  |
| -------------------------- | ---------------------------------------------- | -------------------------------------------- | --------------------------- |
| 040 rulebook-maintenance   | `specdojo:utc-sample`・`specdojo:utc-rulebook` | `docs/ja/specdojo/rulebooks/utc-rulebook.md` | sample（成果物）と grade    |
| 050 sample-maintenance     | `specdojo:utc-sample`（2 回並ぶ）              | `docs/ja/specdojo/samples/utc-sample.md`     | rulebook と sample の grade |
| 080 condense               | `specdojo:utc-sample`                          | `docs/ja/specdojo/samples/utc-sample.md`     | -                           |
| 090 review（fully-guided） | `specdojo:utc-sample`                          | 変更しない                                   | rulebook・sample の grade   |

どの段も、対象と手本は食い違わない。050 では成果物と編集の対象が同じ ID なので、`targets` に同じ ID が 2 回並ぶ。exec-plan の schema は重複を禁じていないので、そのまま進められる。finalize は human の段なので plan を作らない（claim で result を作る）。

### 5.6. 残課題

- `--project` を付けないと、この worktree では `exec plan` が既存の成果物（`utc-catalog` など）も見つけられなかった。グローバルの `specdojo` コマンドはメインのリポジトリの `dist` を指す。schedule のタスクを走らせる前に、`dist` に「カタログ検証の修正」を build しておく必要がある。
- `targets` の重複（「plan の dry-run の結果」の 050）は、`targetDocIds` で重複を除くかを別の項目で決める。

### 5.7. CHANGELOG に書く事項

利用者への影響は無い。`CHANGELOG.md` は変えていない。kata の成果物カタログ・strategy・track は prj-0001 の内部の計画で、`catalog validate` の修正は、project の外の名前空間の文書の照合を外すだけ。既存の project のカタログの検証の結果は変わらない。

## 6. 関連ドキュメント

- [[prj-0001:dct-index]]
- [[prj-0001:sch-strategy-kata-wave-1]]
- [[prj-0001:sch-strategy-project-kata]]
- `prj-0001:dct-kata`・`prj-0001:sch-strategy-kata-wave-3`・`prj-0001:sch-track-kata-wave-3`（本項目で作成）
