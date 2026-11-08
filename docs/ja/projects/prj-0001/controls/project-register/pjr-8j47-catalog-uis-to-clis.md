---
specdojo:
  id: prj-0001:pjr-8j47-catalog-uis-to-clis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T06:49:16Z"
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  depends_on:
    - PJR-PJYJ
    - PJR-025M
    - PJR-K4PM
    - PJR-25B9
---

# PJR-8J47 カタログの uis の 2 件を clis に付け替える

## 1. 概要

prj-0001 のカタログの uis-index・uis-exec-commands を clis-index・clis-exec-commands にし、rulebook と overview と done_criteria を確定した clis の型に合わせる

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: uis の代表は作らず（SpecDojo に GUI はない）、clis の代表 clis-exec-commands を作る。成果物も schedule のタスクもまだないため、名前を変えるだけで済む。

## 3. 完了条件

- `dct-user-interface-model.yaml` の `uis-index`・`uis-exec-commands` を `clis-index`・`clis-exec-commands` にし、`path`・`rulebook`（`specdojo:clis-rulebook`。索引に専用の rulebook がなければ、その扱いを決めて書く）・`overview`・`done_criteria`・`note`・`depends_on` を確定した clis の型に合わせている。引数・オプションを書くという記述は外している。
- 成果物も schedule のタスクもまだないため、古い `uis-*` の項目は残していない。ほかのカタログで `uis-index`・`uis-exec-commands` を参照している箇所（`sf-index` の説明など）があれば直している。
- ほかの項目とカタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo catalog validate --project prj-0001`・`npm run validate:schema`・`npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                                                                            |
| --- | -------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------- |
| 1   | 確定した clis の型と、カタログの uis の 2 件と参照を読む | DEV  | done | [[specdojo:clis-rulebook]]、`dct-user-interface-model.yaml`、`dct-system-functions.yaml` を確認 |
| 2   | 2 件を clis に付け替え、参照を直す                       | DEV  | done | `clis-index`・`clis-exec-commands` への改名および `sf-index` 参照の更新                         |
| 3   | 検査を流し、対応結果に書く                               | DEV  | done | `npm run validate:catalog`、`npm run validate:history-links` の通過を確認                       |

## 5. 対応結果

### 5.1. 実施内容

- `dct-user-interface-model.yaml` の `uis-index`・`uis-exec-commands` を `clis-index`・`clis-exec-commands` へ付け替え、`path`・`rulebook`・`overview`・`done_criteria`・`note`・`depends_on` を確定した `clis` の型（[[specdojo:clis-rulebook]]）に合わせて更新した。
  - 引数・オプションや画面・遷移に関する記述を外し、コマンドリファレンス参照・入力情報と出力情報の要点・終了コードとエラー表示・利用者の次の手を定義する形に改めた。
  - `clis-exec-commands` の `rulebook` を `specdojo:clis-rulebook` とし、`evidence_refs` の記述も引数・オプションに言及しない形に整えた。
  - `clis-index` については専用 rulebook（`clis-index-rulebook`）が未整備のため、個別成果物用 rulebook を流用せず未宣言とし、その扱いを note に明記した。
- `dct-system-functions.yaml` の `sf-index` において、`depends_on` の `uis-index` を `clis-index` に更新し、`overview` の「画面仕様（uis-index配下のCLIコマンド群）」を「CLI仕様（clis-index配下のCLIコマンド群）」へ更新した。
- 古い `uis-*` の項目は残さず、ほかの項目やカタログは変更していない。

### 5.2. 検証結果

- `specdojo catalog validate --project prj-0001`（`npm run validate:catalog`）を実行し、exit code 0 で正常終了することを確認した。
- `npm run validate:history-links` を実行し、exit code 0 で正常終了することを確認した。
- 親 runner の allowlisted validations（`validate-schema`、`lint-md` 等）は本 executor 終了後に親 runner により検証される。

### 5.3. CHANGELOG に書く事項

なし（prj-0001 内部の成果物カタログの定義記述の付け替え・更新であり、SpecDojo 利用者への直接の影響はないため）。

### 5.4. 残課題・申し送り

- `clis-index` の専用 rulebook（`clis-index-rulebook`）は現時点で未整備のため、カタログ上は rulebook を未宣言（指定なし）としている。必要に応じて将来のタスクで kata の新設を検討する。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 先行: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
- 確定決定: [[prj-0001:pjr-25b9-clis-kata-confirm-diagram-references]]
